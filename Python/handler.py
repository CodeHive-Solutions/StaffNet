"""The main handler for the StaffNet API"""

import logging
import re
import os
import mysql.connector
import pandas as pd
from io import BytesIO, StringIO
from datetime import datetime, timedelta
from urllib.parse import urlparse
import redis
from flask import (
    Flask,
    Response,
    request,
    session,
    g,
    send_file,
    jsonify,
    make_response,
)
from flask_compress import Compress
from flask_session import Session
from insert import insert
from login import consulta_login
from update import update
from search import search
from transaction import search_transaction, insert_transaction, join_tables, update_data
from dotenv import load_dotenv
from roles import get_rol_tables, get_rol_columns
from werkzeug.utils import secure_filename
from PIL import Image


# Evitar logs innecesarios
logging.getLogger("werkzeug").setLevel(logging.ERROR)

logging.basicConfig(
    filename=f"/var/www/StaffNet/logs/Registros_{datetime.now().year}.log",
    level=logging.INFO,
    format="%(asctime)s:%(levelname)s:%(message)s",
)

if not os.path.isfile("/var/env/StaffNet.env"):
    logging.critical("The env file was not found", exc_info=True)
    raise FileNotFoundError("The env file was not found.")
else:
    load_dotenv("/var/env/StaffNet.env")

try:
    REDIS_CLIENT = redis.Redis("localhost", db=2)
    REDIS_CLIENT.ping()
except:
    REDIS_CLIENT = None
    logging.critical(f"Connection to redis failed", exc_info=True)
    raise

if os.environ["DEBUG"] == "True":
    DEBUG = True
else:
    DEBUG = False

PROFILE_PICTURE_KEY = os.environ["PROFILE_PICTURE_KEY"]

app = Flask(__name__)
Compress(app)
app.config["WERKZEUG_LOGGING_LEVEL"] = "ERROR"
app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_REDIS"] = REDIS_CLIENT
app.config["SESSION_COOKIE_NAME"] = "StaffNet"
app.config["SESSION_COOKIE_SECURE"] = True
app.config["SESSION_COOKIE_HTTPONLY"] = True
if DEBUG:
    app.config["SESSION_COOKIE_SAMESITE"] = "None"
else:
    app.config["SESSION_COOKIE_SAMESITE"] = "lax"
    app.config["SESSION_COOKIE_DOMAIN"] = ".cyc-bpo.com"
app.config["PROFILE_PICTURES_FOLDER"] = os.environ["PROFILE_PICTURES_FOLDER"]
app.secret_key = os.getenv("SECRET_KEY") or os.urandom(24)

s = Session()
s.init_app(app)


def get_request_body():
    """Get the request body as a dictionary"""
    if request.content_type == "application/json" and request.data:
        return request.get_json()
    else:
        try:
            return request.get_json(force=True)
        except:
            return {}


def clean_value(value):
    """Clean the value to be inserted in the database"""
    if value is None or str(value).strip() == "" or str(value).upper() == "NAN":
        return None
    if isinstance(value, int):
        return value
    return str(value).upper()


def bd_info():
    """Dictionary with the information of the database"""
    body = get_request_body()
    if body != str:
        info_tables = {}
        try:
            info_tables = {
                "personal_information": {
                    "cedula": clean_value(body.get("cedula")),
                    "nombres": clean_value(body.get("nombres")),
                    "apellidos": clean_value(body.get("apellidos")),
                    "tipo_documento": clean_value(body.get("tipo_documento")),
                    "fecha_expedicion": clean_value(body.get("fecha_expedicion")),
                    "lugar_expedicion": clean_value(body.get("lugar_expedicion")),
                    "fecha_nacimiento": clean_value(body.get("fecha_nacimiento")),
                    "genero": clean_value(body.get("genero")),
                    "rh": clean_value(body.get("rh")),
                    "estado_civil": clean_value(body.get("estado_civil")),
                    "hijos": clean_value(body.get("hijos")),
                    "personas_a_cargo": clean_value(body.get("personas_a_cargo")),
                    "estrato": clean_value(body.get("estrato")),
                    "tel_fijo": clean_value(body.get("tel_fijo")),
                    "celular": clean_value(body.get("celular")),
                    "correo": clean_value(body.get("correo")),
                    "correo_corporativo": clean_value(body.get("correo_corporativo")),
                    "direccion": clean_value(body.get("direccion")),
                    "barrio": clean_value(body.get("barrio")),
                    "localidad": clean_value(body.get("localidad")),
                    "contacto_emergencia": clean_value(body.get("contacto_emergencia")),
                    "parentesco": clean_value(body.get("parentesco")),
                    "tel_contacto": clean_value(body.get("tel_contacto")),
                    "caso_medico": clean_value(body.get("caso_medico")),
                },
                "educational_information": {
                    "cedula": clean_value(body.get("cedula")),
                    "nivel_escolaridad": clean_value(body.get("nivel_escolaridad")),
                    "profesion": clean_value(body.get("profesion")),
                    "estudios_en_curso": clean_value(body.get("estudios_en_curso")),
                },
                "employment_information": {
                    "cedula": clean_value(body.get("cedula")),
                    "fecha_afiliacion_eps": clean_value(
                        body.get("fecha_afiliacion_eps")
                    ),
                    "eps": clean_value(body.get("eps")),
                    "pension": clean_value(body.get("pension")),
                    "caja_compensacion": clean_value(body.get("caja_compensacion")),
                    "cesantias": clean_value(body.get("cesantias")),
                    "cuenta_nomina": clean_value(body.get("cuenta_nomina")),
                    "banco": clean_value(body.get("banco")),
                    "fecha_nombramiento": clean_value(body.get("fecha_nombramiento")),
                    "fecha_ingreso": clean_value(body.get("fecha_ingreso")),
                    "sede": clean_value(body.get("sede")),
                    "cargo": clean_value(body.get("cargo")),
                    "gerencia": clean_value(body.get("gerencia")),
                    "campana_general": clean_value(body.get("campana_general")),
                    "area_negocio": clean_value(body.get("area_negocio")),
                    "tipo_contrato": clean_value(body.get("tipo_contrato")),
                    "salario": clean_value(body.get("salario")),
                    "subsidio_transporte": clean_value(body.get("subsidio_transporte")),
                    "rodamiento": clean_value(body.get("rodamiento")),
                    "aplica_teletrabajo": clean_value(
                        body.get("aplica_teletrabajo", False)
                    ),
                    "fecha_aplica_teletrabajo": clean_value(
                        body.get("fecha_aplica_teletrabajo")
                    ),
                    "talla_camisa": clean_value(body.get("talla_camisa")),
                    "talla_pantalon": clean_value(body.get("talla_pantalon")),
                    "talla_zapatos": clean_value(body.get("talla_zapatos")),
                    "observaciones": clean_value(body.get("observaciones")),
                },
                "disciplinary_actions": {
                    "cedula": clean_value(body.get("cedula")),
                    "memorando_1": clean_value(body.get("memorando_1")),
                    "memorando_2": clean_value(body.get("memorando_2")),
                    "memorando_3": clean_value(body.get("memorando_3")),
                },
                # "vacation_information": {
                #     "cedula": body.get("cedula").upper(),
                #     "licencia_no_remunerada": body.get("licencia_no_remunerada").upper(),
                #     "dia_utilizados": "0",
                #     "fecha_salida_vacaciones": body.get("fecha_salida_vacaciones").upper(),
                #     "fecha_ingreso_vacaciones": body.get("fecha_ingreso_vacaciones".upper())
                # },
                "leave_information": {
                    "cedula": clean_value(body.get("cedula")),
                    "fecha_retiro": clean_value(body.get("fecha_retiro")),
                    "tipo_retiro": clean_value(body.get("tipo_retiro")),
                    "motivo_retiro": clean_value(body.get("motivo_retiro")),
                    "aplica_recontratacion": body.get("aplica_recontratacion"),
                    "estado": body.get("estado", True),
                },
            }
        except Exception as error:
            logging.exception(f"Campo no encontrado: %s", {error})
        return info_tables


@app.route("/login", methods=["POST"])
def login():
    """Login to the StaffNet API"""
    body = get_request_body()
    if "password" not in body:
        return jsonify({"status": "False", "error": "Contraseña no encontrada"}), 400
    elif "user" not in body:
        return jsonify({"status": "False", "error": "Usuario no encontrado"}), 400
    conexion = conexion_mysql()
    response = consulta_login(body, conexion)
    if response["status"] == "success":
        session_key = "session:" + session.get("sid", "")
        username = body["user"]
        session["session_id"] = session_key
        session["username"] = username
        session["create_admins"] = response["create_admins"]
        session["consult"] = response["consult"]
        session["create"] = response["create"]
        session["edit"] = response["edit"]
        session["disable"] = response["disable"]
        session["rol"] = response["rol"]
        conexion = conexion_mysql()
        update(
            "users",
            "session_id",
            (session_key,),
            f"WHERE user = '{username}'",
            conexion,
        )
        response = {"status": "success", "create_admins": response["create_admins"]}
    return response


db_config = {
    "host": "172.16.0.115" if DEBUG else "172.16.0.118",
    "user": "StaffNetuser",
    "password": os.environ["StaffNetmysql"],
    "database": "staffnet",
}


def conexion_mysql():
    """Get a connection from the connection"""
    try:
        g.connection = mysql.connector.connect(**db_config)
        return g.connection
    except Exception as e:
        logging.error("Error connecting to MySQL: %s", e)
        raise Exception from e


@app.before_request
def logs():
    """Logs of the request and db connection"""
    if "profile-picture" in request.url:
        petition = "profile-picture" + "/" + request.url.split("/")[-1]
    elif "personal-information" in request.url:
        petition = "personal-information" + "/" + request.url.split("/")[-1]
    else:
        petition = urlparse(request.url).path.split("/")[-1]
    if request.method == "OPTIONS":
        pass
    elif request.content_type == "application/json":
        body = get_request_body()
        if petition == "login":
            if "user" in body:
                logging.info({"User": body["user"], "Petición": petition})
        elif petition == "download":
            logging.info({"User": session["username"], "Petición": petition})
        else:
            if "username" in session:
                logging.info(
                    {
                        "User": session["username"],
                        "Petición": petition,
                        "Valores": request.json,
                    }
                )
    elif request.content_type == "text/csv":
        logging.info({"User": session["username"], "Petición": "download"})
    else:
        # Don't log this requests
        if (
            petition == "logged"
            or petition == "favicon.ico"
            or petition.startswith("profile-picture")
        ):
            pass
        elif "username" in session:
            if petition != "login":
                logging.info({"User": session["username"], "Petición": petition})
            else:
                logging.info({"User": session["username"], "Petición": petition})
        else:
            logging.info({"User": "Anonymous", "Petición": petition})


@app.after_request
def after_request(response):
    """Logs of the response CORS, and close DB"""
    if "connection" in g and g.connection is not None:
        g.connection.close()
        g.connection = None
    petition = urlparse(request.url).path.split("/")[-1]
    # Logs de respuesta
    if response.json is not None:
        if petition == "search_employees":
            if "info" in response.json:
                logging.info(
                    {"Respuesta: ": {"status": response.json["info"]["status"]}}
                )
            else:
                logging.info({"Respuesta: ": response.json})
        elif (
            "status" in response.json
            and response.json["status"] == "False"
            and petition != "logged"
        ):
            logging.info(
                {
                    "Respuesta: ": {
                        "status": response.json["status"],
                        "error": (
                            response.json["error"] if "error" in response.json else ""
                        ),
                    }
                }
            )
        elif petition == "logged":
            pass
        else:
            logging.info({"Respuesta: ": response.json})
    # CORS
    if DEBUG:
        url_permitidas = [
            "https://staffnet-dev.cyc-bpo.com",
            "https://insights-dev.cyc-bpo.com",
            "http://localhost:5173",
            "http://localhost:3000",
            "http://172.16.5.11:3000",
            "http://172.16.0.115:3000",
            "http://172.16.0.115:8000",
        ]
    else:
        url_permitidas = [
            "https://staffnet.cyc-bpo.com",
            "https://intranet.cyc-bpo.com",
        ]
    if request.origin in url_permitidas:
        response.headers.add("Access-Control-Allow-Origin", request.origin)
        response.headers.add("Access-Control-Allow-Credentials", "true")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "POST,PATCH")
    return response


@app.errorhandler(Exception)
def handle_error(error):
    """Logs of the application errors"""
    if str(error) == "'username'":
        return jsonify({"status": "False", "error": "Usuario no encontrado"}), 401
    elif hasattr(error, "code") and error.code == 404:
        return jsonify({"status": "False", "error": "Pagina no encontrada"}), 404
    elif hasattr(error, "code") and error.code == 405:
        return jsonify({"status": "False", "error": "Método no permitido"}), 405
    else:
        logging.warning(error)
        logging.warning("Petición: %s", error, exc_info=True)
        response = jsonify({"status": "False", "error": "Error interno"}), 500
        return response


@app.route("/logged", methods=["POST"])
def logged():
    """Check if the user is logged in"""
    response = {"status": "False"}
    if "username" in session:
        logging.info(
            {
                "User": session["username"],
                "Petición": "logged",
                "consult": session["consult"],
                "create_admins": session["create_admins"],
            }
        )
        if session["consult"]:
            response = {"status": "success", "access": "home"}
        elif session["create_admins"]:
            response = {"status": "success", "access": "permissions"}
    return response


@app.route("/logout", methods=["POST"])
def logout():
    """Logout from the StaffNet API"""
    session.clear()
    response = {"status": "success"}
    return response


@app.route("/validate_create_admins", methods=["POST"])
def validate_create_admins():
    """Validate if the user can create admins"""
    if session["create_admins"] is True:
        response = {"status": "success"}
    else:
        response = {"status": "False", "error": "No tienes permisos"}
    return response


@app.route("/validate_consult", methods=["POST"])
def validate_consult():
    """Validate if the user can consult"""
    if session["consult"] is True:
        response = {
            "status": "success",
            "permissions": {
                "create": session["create"],
                "edit": session["edit"],
                "disable": session["disable"],
            },
        }
    else:
        response = {"status": "False", "error": "No tienes permisos"}
    return response


@app.route("/search_ad", methods=["POST"])
def search_ad():
    """Search the user in the database"""
    if session["create_admins"] is True:
        body = get_request_body()
        conexion = conexion_mysql()
        username = (body["username"],)
        response = search(
            [
                "permission_consult",
                "permission_create",
                "permission_edit",
                "permission_disable",
            ],
            "users",
            "WHERE user = %s",
            username,
            conexion,
            True,
            username,
        )
    else:
        response = {"status": "False", "error": "No tienes permisos"}
    return response


@app.route("/create", methods=["POST"])
def create():
    """Create a new user in the database"""
    if session["create"] is True:
        body = get_request_body()
        conexion = conexion_mysql()
        parameters = (
            body["user"],
            body["permissions"]["consultar"],
            body["permissions"]["crear"],
            body["permissions"]["editar"],
            body["permissions"]["inhabilitar"],
        )
        columns = (
            "user",
            "permission_consult",
            "permission_create",
            "permission_edit",
            "permission_disable",
        )
        response = insert("users", columns, parameters, conexion)
    else:
        response = {"status": "False", "error": "No tienes permisos"}
    return response


@app.route("/edit_admin", methods=["POST"])
def edit_admin():
    """Edit the permissions of an admin"""
    body = get_request_body()
    if session["create_admins"] is True:
        if session["username"] != body["user"]:
            conexion = conexion_mysql()
            table = "users"
            fields = (
                "permission_consult",
                "permission_create",
                "permission_edit",
                "permission_disable",
            )
            condition = "WHERE user = %s"
            parameters = (
                body["permissions"]["consultar"],
                body["permissions"]["crear"],
                body["permissions"]["editar"],
                body["permissions"]["inhabilitar"],
                body["user"],
            )
            response = update(table, fields, parameters, condition, conexion)
            if response["status"] == "success":
                response_search = search(
                    "session_id", "users", "WHERE user = %s", (body["user"],), conexion
                )
                session_key = response_search["info"][0]
                REDIS_CLIENT.delete(session_key)
        else:
            response = {"status": "False", "error": "No puedes cambiar tus permisos."}
    else:
        response = {"status": "False", "error": "No tienes permisos"}
    return response


@app.route("/search_employees", methods=["POST"])
def search_employees():
    """Function to get permissions"""
    if "consult" in session and session["consult"] == True:
        rol_tables = get_rol_tables(session["rol"])
        if not rol_tables:
            return Response(f"Rol no encontrado {session['rol']}", 404)
        conexion = conexion_mysql()
        response = search_transaction(conexion, rol_tables.items())
        response = {
            "info": response,
            "rol": session["rol"],
            "permissions": {
                "create": session["create"],
                "edit": session["edit"],
                "disable": session["disable"],
            },
        }
    else:
        response = {"status": "False", "error": "No tienes permisos"}
    return response


@app.route("/get_join_info", methods=["POST"])
def get_join_info():
    """ "Get the information of the user"""
    conexion = conexion_mysql()
    body = get_request_body()
    if "consult" in session and session["consult"] == True:
        table_names = [
            "personal_information",
            "educational_information",
            "employment_information",
            "leave_information",
        ]
        join_columns = ["cedula", "cedula", "cedula", "cedula", "cedula", "cedula"]
        response = join_tables(
            conexion,
            table_names,
            "*",
            join_columns,
            id_column="cedula",
            id_value=body["cedula"],
        )
    else:
        response = {"status": "False", "error": "No tienes permisos"}
    return response


@app.route("/employee_history", methods=["POST"])
def get_historico():
    """Get the historical data of the user"""
    conexion = conexion_mysql()
    body = get_request_body()
    if session["consult"] == True:
        response = search(
            ["columna", "valor_antiguo", "valor_nuevo", "fecha_cambio"],
            "historical",
            "WHERE cedula = %s",
            (body["cedula"],),
            conexion,
        )
    else:
        response = {"status": "False", "error": "No tienes permisos"}
    return response


@app.route("/change_state", methods=["POST"])
def change_state():
    """Change the state of the user"""
    if session["disable"] == True:
        body = get_request_body()
        conexion = conexion_mysql()
        response = update(
            "leave_information",
            ("estado",),
            (body["change_to"], body["cedula"]),
            "WHERE cedula = %s",
            conexion,
        )
    else:
        response = {"status": "False", "error": "No tienes permisos"}
    return response


@app.route("/update_transaction", methods=["POST"])
def update_transaction():
    """Update the data in the database"""
    if session["edit"] == True:
        body = get_request_body()
        info_tables = bd_info()
        conexion = conexion_mysql()
        response = update_data(conexion, info_tables, "cedula = " + str(body["cedula"]))
    else:
        response = {"status": "False", "error": "No tienes permisos"}
    return response


@app.route("/insert_transaction", methods=["POST"])
def insert_in_tables():
    """Insert the data in the database"""
    info_tables = bd_info()
    if session["create"] == True:
        conexion = conexion_mysql()
        response = insert_transaction(conexion, info_tables)
    else:
        response = {"status": "False", "error": "No tienes permisos"}
    return response


@app.route("/favicon.ico")
def favicon():
    """Get the favicon.ico"""
    return Response(status=404)


@app.route("/download", methods=["POST"])  # type: ignore
def download():
    """Download the data in the database"""
    if session["consult"] == True:
        try:
            body = request.get_data(as_text=True)
            conexion = conexion_mysql()
            # Parse the CSV data from the request body
            csv_df = pd.read_csv(
                StringIO(body), delimiter=";", keep_default_na=False, na_values=[""]
            )
            all_columns = csv_df.columns.tolist()
            history_data = None
            rol_columns = get_rol_columns(session["rol"])
            if not rol_columns:
                response = {"status": "False", "error": "Rol no encontrado"}
                return response
            # This define if search the history
            if "Cedula" in all_columns:
                # Extract "Cedula" values from the first column of the DataFrame
                cedula_values = csv_df.iloc[:, 0].tolist()
                # Build the WHERE clause for MySQL
                where = (
                    "WHERE ("
                    + " OR ".join(
                        [f'historical.cedula = "{cedula}"' for cedula in cedula_values]
                    )
                    + f') AND columna in ({str(rol_columns).replace("[","").replace("]","")})'
                    + " ORDER BY historical.cedula, historical.fecha_cambio DESC"
                )
                # Fetch history data from MySQL based on the WHERE clause
                history = search(
                    [
                        "cedula",
                        "columna",
                        "valor_antiguo",
                        "valor_nuevo",
                        "fecha_cambio",
                    ],
                    "historical",
                    where,
                    None,
                    conexion,
                )
                if "error" in history and history["error"] == "Registro no encontrado":
                    history = {"info": []}
                history_data = pd.DataFrame(
                    history["info"],
                    columns=[
                        "cedula",
                        "columna",
                        "valor_antiguo",
                        "valor_nuevo",
                        "fecha_cambio",
                    ],
                )
            # This is for format the data
            if "Salario" in all_columns:
                salario_index = csv_df.columns.get_loc("Salario")
                salario_list = csv_df.iloc[:, salario_index].tolist()
                salario = []
                for value in salario_list:
                    # Check if value is NaN
                    if pd.isna(value):
                        salario.append(None)
                        continue
                    else:
                        cleaned_value = re.sub(r"[^0-9]", "", value)
                        if cleaned_value:
                            salario.append(int(cleaned_value))
                        else:
                            salario.append(None)
                csv_df.iloc[:, salario_index] = salario  # type: ignore
            # Save CSV data to one sheet and history data to another sheet in the same Excel file
            excel_data = BytesIO()  # Use BytesIO for Excel data

            def get_column_width(data):
                values = [len(str(value)) for value in data if str(value).strip()]
                return (
                    max(values) if values else 15
                )  # Set a minimum width if column is empty

            with pd.ExcelWriter(
                excel_data, engine="xlsxwriter"
            ) as writer:  # Use excel_data as the file-like object
                # Convert date columns to datetime objects
                date_columns = {
                    "Fecha de ingreso": "%d/%m/%Y",
                    "Fecha de nacimiento": "%d/%m/%Y",
                    "Fecha de expedición": "%d/%m/%Y",
                    "Fecha de afiliación": "%d/%m/%Y",
                    "Fecha de nombramiento": "%d/%m/%Y",
                    "Fecha de retiro": "%d/%m/%Y",
                    "Fecha de aplicacion de teletrabajo": "%d/%m/%Y",
                }

                def format_date(x, date_format):
                    if pd.notna(x) and x != "-" and x != "1/1/1000":
                        return pd.to_datetime(x, format=date_format).date()
                    else:
                        return x

                for column, date_format in date_columns.items():
                    if column in csv_df:
                        csv_df[column] = csv_df[column].apply(
                            format_date, args=(date_format,)
                        )

                csv_df.to_excel(writer, sheet_name="Exporte", index=False)
                # Get the XlsxWriter workbook and worksheet objects
                workbook = writer.book
                csv_sheet = writer.sheets["Exporte"]
                # Only save history data if it exists
                if history_data is not None:
                    history_data.to_excel(writer, sheet_name="Historial", index=False)
                    history_sheet = writer.sheets["Historial"]
                    for i, column in enumerate(history_data.columns):
                        column_width = get_column_width(history_data[column])
                        history_sheet.set_column(i, i, column_width + 2)
                        # Set column width for History Info sheet

                        cedula_values = history_data["cedula"].tolist()  # type: ignore
                        start_color = "#FFFFFF"  # No cell color
                        alternate_color = "#D3D3D3"  # Light grey color
                        current_color = start_color

                        for row_number, cedula in enumerate(cedula_values):
                            if (
                                row_number > 0
                                and cedula != cedula_values[row_number - 1]
                            ):
                                # Change color when the cedula changes
                                current_color = (
                                    alternate_color
                                    if current_color == start_color
                                    else start_color
                                )

                            # Set the row color for all columns in the row
                            row_format = workbook.add_format({"bg_color": current_color})  # type: ignore
                            history_sheet.set_row(row_number + 1, None, row_format)
                # Function to calculate the column width based on content
                # Set column width for CSV Data sheet
                for i, column in enumerate(csv_df.columns):
                    column_width = get_column_width(csv_df[column])
                    csv_sheet.set_column(i, i, column_width + 2)
            # Create a response object with the Excel content
            response = Response(
                excel_data.getvalue(),
                content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            )
            response.headers["Content-Disposition"] = (
                'attachment; filename="Exporte_StaffNet.xlsx"'
            )
            response.headers["Cache-Control"] = "no-cache"
            return response
        except Exception as e:
            logging.exception(e)
            return Response(status=500)


@app.route("/profile-picture/<cedula>", methods=["POST"])  # type: ignore
def upload_image(cedula):
    """Upload a profile picture"""
    if not ("create" in session or "edit" in session):
        return make_response(
            jsonify({"detail": "Permission denied."}),
            403,
        )

    if "image" not in request.files:
        return make_response(
            jsonify({"detail": "No file selected."}),
            400,
        )

    uploaded_image = request.files["image"]

    if uploaded_image.filename == "":
        return make_response(
            jsonify({"detail": "No file selected."}),
            400,
        )

    if uploaded_image:
        filename = secure_filename(uploaded_image.filename)
        if not filename.endswith(".webp"):
            return make_response(
                jsonify({"detail": "Invalid file type. Only .webp files are allowed."}),
                400,
            )

        file_content = uploaded_image.read()
        max_file_size_bytes = 5 * 1024 * 1024  # 5 MB

        if len(file_content) > max_file_size_bytes or len(file_content) == 0:
            return make_response(
                jsonify(
                    {"detail": "Invalid file size. The file must be less than 5MB."}
                ),
                400,
            )

        filename = cedula + ".webp"

        image_path = os.path.join(app.config["PROFILE_PICTURES_FOLDER"], filename)

        uploaded_image.seek(0)

        # Save the image, overwriting if it already exists
        try:
            image = Image.open(BytesIO(file_content))
            if os.path.exists(image_path):
                os.remove(image_path)
            image.save(image_path, format="WEBP")
        except IOError:
            return make_response(
                jsonify({"detail": "Unable to save image."}),
                500,
            )

        return make_response(jsonify({"detail": "File uploaded successfully."}), 200)


@app.route("/profile-picture/<filename>", methods=["GET"])
def get_profile_picture(filename):
    """Get the profile picture of an employee"""
    # body = get_request_body()
    # if ("picture_key" not in body or body["picture_key"] != PROFILE_PICTURE_KEY) and (
    # "consult" not in session or session["consult"] is False
    # ):
    # return Response("Permission denied.", 403)
    try:
        filename = secure_filename(str(filename))
        filename += ".webp"
        return send_file(
            f"{app.config['PROFILE_PICTURES_FOLDER']}/{filename}", mimetype="image/webp"
        )
    except FileNotFoundError:
        return jsonify({"message": "File not found"}), 404
    except Exception as e:
        logging.exception(e)
        return jsonify({"message": "Internal server error"}), 500


@app.route("/profile-picture/birthday", methods=["GET"])
def get_birthday_pictures():
    """Get the profile pictures of the employees with birthday today, yesterday, and tomorrow"""
    # body = get_request_body()
    # if ("picture_key" not in body or body["picture_key"] != PROFILE_PICTURE_KEY) and (
    # "consult" not in session or session["consult"] is False
    # ):
    # return jsonify({"message": "Permission denied."}), 403
    try:
        conexion = conexion_mysql()
        today = datetime.now()
        yesterday = today - timedelta(days=1)
        tomorrow = today + timedelta(days=1)

        today_birthdays = []
        yesterday_birthdays = []
        tomorrow_birthdays = []

        condition = (
            f"WHERE (MONTH(personal_information.fecha_nacimiento) = MONTH('{today}') "
            f"AND DAY(personal_information.fecha_nacimiento) = DAY('{today}') "
            f"AND leave_information.estado = 1)"
            f"OR (MONTH(personal_information.fecha_nacimiento) = MONTH('{yesterday}') "
            f"AND DAY(personal_information.fecha_nacimiento) = DAY('{yesterday}')"
            "AND leave_information.estado = 1)"
            f"OR (MONTH(personal_information.fecha_nacimiento) = MONTH('{tomorrow}') "
            f"AND DAY(personal_information.fecha_nacimiento) = DAY('{tomorrow}')"
            "AND leave_information.estado = 1)"
        )

        response = join_tables(
            conexion,
            ["personal_information", "employment_information", "leave_information"],
            [
                "cedula",
                "descripcion",
                "nombres",
                "apellidos",
                "fecha_nacimiento",
                "campana_general",
            ],
            ["cedula", "cedula"],
            where=condition,
        )

        if response["status"] == "False":
            return (
                jsonify(
                    {"message": "Internal server error", "error": response["error"]}
                ),
                500,
            )

        if response["status"] == "success" and len(response["data"]) == 0:
            return (
                jsonify(
                    {
                        "message": "No employees with birthday today, yesterday, or tomorrow"
                    }
                ),
                200,
            )

        for employee in response["data"]:
            birthday = datetime.strptime(employee["fecha_nacimiento"], "%Y-%m-%d")
            if (birthday.month, birthday.day) == (today.month, today.day):
                today_birthdays.append(employee)
            elif (birthday.month, birthday.day) == (yesterday.month, yesterday.day):
                yesterday_birthdays.append(employee)
            elif (birthday.month, birthday.day) == (tomorrow.month, tomorrow.day):
                tomorrow_birthdays.append(employee)

        response_data = {
            "yesterday": yesterday_birthdays,
            "today": today_birthdays,
            "tomorrow": tomorrow_birthdays,
        }

        response = {
            "status": "success",
            "data": response_data,
        }

        return jsonify(response), 200
    except FileNotFoundError:
        return jsonify({"message": "File not found"}), 404
    except Exception as e:
        logging.exception(e)
        return jsonify({"message": "Internal server error"}), 500


@app.route("/massive-update", methods=["POST"])
def massive_update():
    """Update the data in the database from a xlsx file to each user"""
    if (
        "edit" in session
        and session["edit"]
        and session["username"]
        in ["heibert.mogollon", "daniela.ospina.c", "juan.carreno"]
    ):
        conexion = conexion_mysql()
        if conexion is None:
            return (
                jsonify(
                    {
                        "status": "False",
                        "error": "No se pudo conectar con la base de datos",
                    }
                ),
                500,
            )
        if not request.files or "file" not in request.files:
            return (
                jsonify(
                    {"status": "False", "error": "No se ha enviado ningún archivo"}
                ),
                400,
            )
        # Read the xlsx file
        file = request.files["file"]
        try:
            csv_df = pd.read_excel(file, keep_default_na=False, na_values=[""])
        except Exception as e:
            logging.exception(e)
            return (
                jsonify(
                    {"status": "False", "error": "El archivo no es un xlsx valido"}
                ),
                400,
            )
        # Get the columns of the xlsx file
        all_columns = csv_df.columns.tolist()
        # Check if the columns are valid
        if "Cedula" not in all_columns:
            return (
                jsonify(
                    {
                        "status": "False",
                        "error": "La columna 'Cedula' no fue encontrada.",
                    }
                ),
                400,
            )
        if "Tabla" not in all_columns:
            return (
                jsonify(
                    {
                        "status": "False",
                        "error": "La columna 'Tabla' no  fue encontrada.",
                    }
                ),
                400,
            )
        if "Columna" not in all_columns:
            return jsonify(
                {
                    "status": "False",
                    "error": "Debes especificar la columna mediante una columna llamada 'columna'.",
                },
                400,
            )
        if "Valor" not in all_columns:
            return (
                jsonify(
                    {"status": "False", "error": "La columna 'Valor' no se encuentra."}
                ),
                400,
            )
        # Get the values of the xlsx file
        cedula_values = csv_df["Cedula"].tolist()
        tabla_values = csv_df["Tabla"].tolist()
        columna_values = csv_df["Columna"].tolist()
        valor_values = csv_df["Valor"].tolist()
        if (
            len(cedula_values)
            != len(tabla_values)
            != len(columna_values)
            != len(valor_values)
        ):
            return jsonify(
                {
                    "status": "False",
                    "error": "La cantidad de información en las columnas no es la coincide",
                },
                400,
            )
        # Update the data in the database
        if conexion is None:
            return (
                jsonify(
                    {
                        "status": "False",
                        "error": "No se pudo conectar con la base de datos",
                    }
                ),
                500,
            )
        for i, _ in enumerate(cedula_values):
            if valor_values[i] == "None" or valor_values[i] == "":
                valor_values[i] = None
            update(
                tabla_values[i],
                (columna_values[i],),
                (valor_values[i], cedula_values[i]),
                "WHERE cedula = %s",
                conexion,
            )
        return jsonify({"status": "success"}), 200
    else:
        return jsonify({"status": "False", "error": "No tienes permisos"}), 403


# Patch for just one table
@app.route("/update", methods=["PATCH"])
def patch_update():
    """Update the data in the database"""
    logging.info(session.items())
    logging.info(session["edit"])
    if "edit" in session and session["edit"] == True:
        body = get_request_body()
        conexion = conexion_mysql()
        # Convert from a list to a tuple
        if not "value" in body and "column" in body:
            return (
                jsonify(
                    {
                        "status": "False",
                        "error": "No se enviaron los campos necesarios para la actualización",
                    }
                ),
                400,
            )
        params = tuple(body["value"] + [body["cedula"]])
        logging.info(params)
        logging.info(body["value"])
        columns = tuple(body["column"])
        response = update(
            body["table"],
            columns,
            params,
            "WHERE cedula = %s",
            conexion,
        )
        if response["status"] == "True":
            return jsonify(response)
        elif (
            response["status"] == "False"
            and response["error"] == "No se encontró ningún cambio."
        ):
            return jsonify(response), 400
        else:
            return jsonify(response), 500
    else:
        return jsonify({"status": "False", "error": "No tienes permisos"}), 403


@app.route("/personal-information/<cedula>", methods=["GET"])
def get_personal_information(cedula):
    """Get the personal information of the user"""
    if not ("consult" in session and session["consult"]):
        return jsonify({"status": "False", "error": "No tienes permisos"}), 403
    conexion = conexion_mysql()
    columns = [
        "estado_civil",
        "hijos",
        "personas_a_cargo",
        "tel_fijo",
        "celular",
        "correo",
        "contacto_emergencia",
        "parentesco",
        "tel_contacto",
    ]
    response = search(
        columns,
        "personal_information",
        "WHERE cedula = %s",
        (cedula,),
        conexion,
    )
    if response["status"] == "success":
        data = {columns[i]: info for i, info in enumerate(response["info"][0])}
        response = {"status": "success", "data": data}
        return response
    return jsonify(response), 500
