import logging
from io import BytesIO, TextIOWrapper, StringIO
import re
from flask import Flask, Response, request, session, g
from flask_session import Session
from insert import insert
from login import consulta_login
from update import update
from search import search
from transaction import search_transaction, insert_transaction, join_tables, update_data
from dotenv import load_dotenv
import datetime
import mysql.connector
import redis
import pandas as pd
import os

# Evitar logs innecesarios
logging.getLogger('werkzeug').setLevel(logging.ERROR)

logging.basicConfig(filename=f"/var/www/StaffNet/logs/Registros_{datetime.datetime.now().year}.log",
                    level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')

if not os.path.isfile('/var/env/StaffNet.env'):
    logging.critical(f"The env file was not found", exc_info=True)
    raise FileNotFoundError('The env file was not found.')
else:
    load_dotenv("/var/env/StaffNet.env")

try:
    redis_client = redis.Redis(
        host='172.16.0.128', port=6379, password=os.getenv('Redis'))
    logging.info(f"Connection to redis success")
    redis_client.ping()
except:
    print("Connection to redis failed")
    redis_client = None
    logging.critical(f"Connection to redis failed", exc_info=True)
    raise


app = Flask(__name__)
app.config['WERKZEUG_LOGGING_LEVEL'] = 'ERROR'
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_REDIS'] = redis_client
app.config['SESSION_COOKIE_NAME'] = 'StaffNet'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
# app.config['SESSION_COOKIE_SAMESITE'] = 'lax'
app.config['SESSION_COOKIE_SAMESITE'] = "None"
app.config['SESSION_COOKIE_DOMAIN'] = '.cyc-bpo.com'
app.secret_key = os.getenv('SECRET_KEY') or os.urandom(24)

sess = Session()
sess.init_app(app)


def get_request_body():
    if request.content_type == 'application/json':
        return request.get_json()
    else:
        return {}


def bd_info():
    body = get_request_body()
    if body != str:
        logging.info(f"Request: {body}")
        info_tables = {}
        try:
            info_tables = {
                "personal_information": {
                    "cedula": body.get("cedula").upper(), "nombre": body.get("nombre").upper(), "tipo_documento": body.get("tipo_documento").upper(), "fecha_expedicion": body.get("fecha_expedicion").upper(), "lugar_expedicion": body.get("lugar_expedicion").upper(),
                    "fecha_nacimiento": body.get("fecha_nacimiento").upper(), "genero": body.get("genero").upper(), "rh": body.get("rh").upper(),
                    "estado_civil": body.get("estado_civil").upper(), "hijos": body.get("hijos").upper(), "personas_a_cargo": body.get("personas_a_cargo").upper(),
                    "estrato": body.get("estrato").upper(), "tel_fijo": body.get("tel_fijo").upper(), "celular": body.get("celular").upper(),
                    "correo": body.get("correo").upper(), "correo_corporativo": body.get("correo_corporativo").upper(), "direccion": body.get("direccion").upper(), "barrio": body.get("barrio").upper(),
                    'localidad': body.get('localidad').upper(), "contacto_emergencia": body.get("contacto_emergencia").upper(), "parentesco": body.get("parentesco").upper(), "tel_contacto": body.get("tel_contacto").upper()
                },
                "educational_information": {
                    "cedula": body.get("cedula").upper(),
                    "nivel_escolaridad": body.get("nivel_escolaridad").upper(),
                    "profesion": body.get("profesion").upper(),
                    "estudios_en_curso": body.get("estudios_en_curso").upper()
                },
                "employment_information": {
                    "cedula": body.get("cedula").upper(), "fecha_afiliacion_eps": body.get("fecha_afiliacion_eps").upper(), "eps": body.get("eps").upper(),
                    "pension": body.get("pension").upper(), "caja_compensacion": body.get("caja_compensacion").upper(), "cesantias": body.get("cesantias").upper(),
                    "cuenta_nomina": body.get("cuenta_nomina").upper(),"fecha_nombramiento": body.get("fecha_nombramiento").upper(), "fecha_ingreso": body.get("fecha_ingreso").upper(), "sede": body.get("sede").upper(), "cargo": body.get("cargo").upper(),
                    "gerencia": body.get("gerencia").upper(), "campana_general": body.get("campana_general").upper(), "area_negocio": body.get("area_negocio").upper(),
                    "tipo_contrato": body.get("tipo_contrato").upper(), "salario": body.get("salario").upper(), "subsidio_transporte": body.get("subsidio_transporte").upper(),
                    'observaciones': body.get('observaciones').upper()
                },
                # "performance_evaluation": {
                # "cedula": body.get("cedula").upper(),
                # "calificacion": body.get("desempeno").upper(),
                # },
                "disciplinary_actions": {
                    "cedula": body.get("cedula").upper(),
                    "memorando_1": body.get("memorando_1").upper(),
                    "memorando_2": body.get("memorando_2").upper(),
                    "memorando_3": body.get("memorando_3").upper(),
                },
                # "vacation_information": {
                #     "cedula": body.get("cedula").upper(),
                #     "licencia_no_remunerada": body.get("licencia_no_remunerada").upper(),
                #     "dias_utilizados": "0",
                #     "fecha_salida_vacaciones": body.get("fecha_salida_vacaciones").upper(),
                #     "fecha_ingreso_vacaciones": body.get("fecha_ingreso_vacaciones".upper())
                # },
                "leave_information": {
                    "cedula": body.get("cedula").upper(),
                    "fecha_retiro": body.get("fecha_retiro").upper(),
                    "tipo_retiro": body.get("tipo_retiro").upper(),
                    "motivo_retiro": body.get("motivo_retiro").upper(),
                    "estado": body.get("estado", True)
                }
            }
        except Exception as error:
            logging.error(f"Campo no encontrado: {error}")
        return info_tables


@ app.route('/login', methods=['POST'])
def login():
    body = get_request_body()
    conexion = conexionMySQL()
    response = consulta_login(body, conexion)
    print(response)
    if response["status"] == 'success':
        session_key = 'session:' + session.get("sid", "")
        print("EXAMPLE", session_key)
        username = body["user"]
        session['session_id'] = session_key
        session["username"] = username
        session["create_admins"] = response["create_admins"]
        session["consult"] = response["consult"]
        session["create"] = response["create"]
        session["edit"] = response["edit"]
        session["disable"] = response["disable"]
        update("users", "session_id", (session_key,),
               f"WHERE user = '{username}'", conexion)
        response = {"status": 'success',
                    'create_admins': response["create_admins"]}
    return response


def conexionMySQL():
    if "conexion" not in g:
        try:
            g.conexion = mysql.connector.connect(
                host="172.16.0.115",
                user="StaffNetuser",
                password=os.getenv('StaffNetmysql'),
                database='staffnet'
            )
            logging.info("Connection to MYSQL success")
        except Exception as err:
            print("Error conexion MYSQL: ", err)
            logging.critical("Error conexion MYSQL: ", err, exc_info=True)
            raise
    return g.conexion


@app.before_request
def logs():
    logging.info("Request: %s", request.content_type)
    if request.method == 'OPTIONS':
        pass
    elif request.content_type == 'application/json':
        body = get_request_body()
        petition = request.url.split("/")[3]
        if petition == "login":
            print("Peticion: ", petition, "user: ", body["user"])
            logging.info(
                {"User": body["user"], "Peticion": petition})
        elif petition == "download":
            logging.info(
                {"User": session["username"], "Peticion": petition})
        else:
            print("Peticion: ", petition)
            if 'username' in session:
                logging.info({"User": session["username"], "Peticion": petition,
                              "Valores": request.json})
    elif request.content_type == 'text/csv':
        logging.info({"User": session["username"], "Peticion": "download"})
    else:
        petition = request.url.split("/")[3]
        if petition == "loged":
            pass
        else:
            petition = request.url.split("/")[3]
            print("Peticion: ", petition)
            if petition != "login":
                logging.info(
                    {"User": session["username"], "Peticion": petition})


@ app.after_request
def after_request(response):
    # Logs de respuesta
    if response.json != None:
        print("Respuesta: ", response.json)
        if request.url.split("/")[3] == "search_employees":
            if "info" in response.json:
                logging.info(
                    {"Respuesta: ": {"status": response.json["info"]["status"]}})
            else:
                logging.info(
                    {"Respuesta: ": {"status": response.json["status"]}})
        elif response.json["status"] == "False" and request.url.split("/")[3] != "loged":
            logging.info({"Respuesta: ": {
                "status": response.json["status"], "error": response.json["error"]}})
        elif request.url.split("/")[3] == "loged":
            pass
        else:
            logging.info(
                {"Respuesta: ": {"status": response.json["status"]}})
    # CORS
    url_permitidas = ["https://staffnet.cyc-bpo.com",
                      "https://staffnet-dev.cyc-bpo.com", "http://localhost:5173", "http://localhost:3000", "http://172.16.5.11:3000"]
    if request.origin in url_permitidas:
        response.headers.add('Access-Control-Allow-Origin',
                             request.origin)
        response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'POST')
    return response


@app.teardown_appcontext
def close_db(useless_var):
    conexion = g.pop('conexion', None)
    if conexion != None:
        print("Conexion cerrada")
        conexion.close()
    print("____________________________________________________________________________")


@ app.errorhandler(Exception)
def handle_error(error):
    response = {"status": "False", "error": str(error)}
    if str(error) == "'username'":
        response = {"status": "False",
                    "error": "Usuario no ha iniciado sesion."}
    print(request.url.split('/')[3])
    logging.warning(
        f"Peticion: {request.url.split('/')[3]}", exc_info=True)
    return response, 200


@ app.route('/loged', methods=['POST'])
def loged():
    response = {"status": 'False'}
    if "username" in session:
        if session["consult"] == True:
            response = {"status": 'success', "access": "home"}
        elif session["create_admins"] == True:
            response = {"status": 'success', "access": "permissions"}
    return response


@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    response = {"status": "success"}
    return response


@ app.route('/validate_create_admins', methods=['POST'])
def validate_create_admins():
    if session["create_admins"] == True:
        response = {'status': 'success'}
    else:
        response = {'status': 'False', 'error': 'No tienes permisos'}
    return response


@ app.route('/validate_consult', methods=['POST'])
def validate_consult():
    if session["consult"] == True:
        response = {'status': 'success', "permissions": {
            "create": session["create"], "edit": session["edit"], "disable": session["disable"]}}
    else:
        response = {'status': 'False', 'error': 'No tienes permisos'}
    return response


@ app.route('/search_ad', methods=['POST'])
def search_ad():
    if session["create_admins"] == True:
        body = get_request_body()
        conexion = conexionMySQL()
        username = (body['username'],)
        response = search(['permission_consult', 'permission_create', 'permission_edit', 'permission_disable'], 'users',
                          'WHERE user = %s', username, conexion, True, username)
    else:
        response = {'status': 'False',
                    'error': 'No tienes permisos'}
    return response


@ app.route('/create', methods=['POST'])
def crete():
    if session["create"] == True:
        body = get_request_body()
        conexion = conexionMySQL()
        parameters = (body["user"], body["permissions"]["consultar"], body["permissions"]["crear"], body[
            "permissions"]["editar"], body["permissions"]["inhabilitar"],)
        columns = ("user", "permission_consult",
                   "permission_create", "permission_edit", "permission_disable")
        response = insert('users', columns, parameters, conexion)
    else:
        response = {'status': 'False',
                    'error': 'No tienes permisos'}
    return response


@ app.route('/edit_admin', methods=['POST'])
def edit_admin():
    body = get_request_body()
    if session["create_admins"] == True:
        if session["username"] != body["user"]:
            conexion = conexionMySQL()
            table = "users"
            fields = "permission_consult", "permission_create", "permission_edit", "permission_disable"
            condition = "WHERE user = %s"
            parameters = (body["permissions"]["consultar"], body["permissions"]["crear"], body[
                "permissions"]["editar"], body["permissions"]["inhabilitar"], body["user"])
            response = update(
                table, fields, parameters, condition, conexion)
            if response["status"] == "success":
                print("searching")
                response_search = search(
                    "session_id", "users", "WHERE user = %s", (body["user"],), conexion)
                session_key = response_search["info"][0]
                redis_client.delete(session_key)
        else:
            response = {'status': 'False',
                        'error': 'No puedes cambiar tus permisos.'}
    else:
        response = {'status': 'False',
                    'error': 'No tienes permisos'}
    return response


@ app.route('/search_employees', methods=['POST'])
def search_employees():
    if session["consult"] == True:
        conexion = conexionMySQL()
        table_info = {
            "personal_information": "*",
            "disciplinary_actions": "*",
            'educational_information': '*',
            "employment_information": "*",
            "leave_information": "*"
        }
        where = "educational_information.cedula = employment_information.cedula AND employment_information.cedula = personal_information.cedula AND leave_information.cedula = personal_information.cedula AND disciplinary_actions.cedula = personal_information.cedula"
        response = search_transaction(
            conexion, table_info, where=where)
        response = {"info": response, "permissions": {
            "create": session["create"], "edit": session["edit"], "disable": session["disable"]}}
    else:
        response = {'status': 'False',
                    'error': 'No tienes permisos'}
    return response


@ app.route('/get_join_info', methods=['POST'])
def get_join_info():
    conexion = conexionMySQL()
    body = get_request_body()
    if session["consult"] == True:
        table_names = ["personal_information",
                       "educational_information", "employment_information", "leave_information"]
        join_columns = ["cedula", "cedula",
                        "cedula", "cedula", "cedula", "cedula"]
        response = join_tables(
            conexion, table_names, "*", join_columns, id_column="cedula", id_value=body["cedula"])
    else:
        response = {'status': 'False',
                    'error': 'No tienes permisos'}
    return response


@ app.route('/employee_history', methods=['POST'])
def get_historico():
    conexion = conexionMySQL()
    body = get_request_body()
    if session["consult"] == True:
        response = search(["columna", "valor_antiguo", "valor_nuevo", 'fecha_cambio'],
                          "historical", "WHERE cedula = %s", (body["cedula"],), conexion)
    else:
        response = {'status': 'False',
                    'error': 'No tienes permisos'}
    return response


@ app.route('/change_state', methods=['POST'])
def change_state():
    if session["disable"] == True:
        body = get_request_body()
        conexion = conexionMySQL()
        response = update("leave_information", ("estado",),
                          (body["change_to"], body["cedula"]), "WHERE cedula = %s", conexion)
    else:
        response = {'status': 'False',
                    'error': 'No tienes permisos'}
    return response


@ app.route('/update_transaction', methods=['POST'])
def update_transaction():
    if session["edit"] == True:
        body = get_request_body()
        info_tables = bd_info()
        logging.info(info_tables["personal_information"])
        conexion = conexionMySQL()
        response = update_data(
            conexion, info_tables, "cedula = "+str(body["cedula"]))
    else:
        response = {'status': 'False',
                    'error': 'No tienes permisos'}
    return response


@ app.route('/insert_transaction', methods=['POST'])
def insert_in_tables():
    info_tables = bd_info()
    if session["create"] == True:
        conexion = conexionMySQL()
        response = insert_transaction(conexion, info_tables)
    else:
        response = {'status': 'False',
                    'error': 'No tienes permisos'}
    return response

@app.route('/download', methods=['POST'])  # type: ignore
def download():
    if session["consult"] == True:
        try:
            body = request.get_data(as_text=True)
            logging.info("Request: %s", body)
            conexion = conexionMySQL()
            # Parse the CSV data from the request body
            csv_df = pd.read_csv(StringIO(body), delimiter=";", keep_default_na=False, na_values=[""])
            logging.info("CSV DataFrame: %s", csv_df)
            all_columns = csv_df.columns.tolist()
            
            salario = csv_df.iloc[:, 0].tolist()
            history_data = None
            if "Cedula" in all_columns:
                # Extract "Cedula" values from the first column of the DataFrame
                cedula_values = csv_df.iloc[:, 0].tolist()
                logging.info("Cedula values: %s", cedula_values)
                # Build the WHERE clause for MySQL
                where = "WHERE " + " OR ".join([f'historical.cedula = "{cedula}"' for cedula in cedula_values]) + " ORDER BY historical.cedula, historical.fecha_cambio DESC"
                logging.info("WHERE %s", where)
                # Fetch history data from MySQL based on the WHERE clause
                history = search(["cedula","columna", "valor_antiguo", "valor_nuevo", 'fecha_cambio'], "historical", where, None, conexion)
                if "error" in history and history['error'] == "Registro no encontrado":
                    history = {"info": []}
                history_data = pd.DataFrame(history["info"], columns=["cedula","columna", "valor_antiguo", "valor_nuevo", "fecha_cambio"])
            # Save CSV data to one sheet and history data to another sheet in the same Excel file
            excel_data = BytesIO()  # Use BytesIO for Excel data
            def get_column_width(data):
                values = [len(str(value)) for value in data if str(value).strip()]
                return max(values) if values else 15  # Set a minimum width if column is empty
            with pd.ExcelWriter(excel_data, engine='xlsxwriter') as writer:  # Use excel_data as the file-like object
                csv_df.to_excel(writer, sheet_name='Exporte', index=False)
                # Get the XlsxWriter workbook and worksheet objects
                workbook = writer.book
                csv_sheet = writer.sheets['Exporte']
                # Only save history data if it exists
                if history_data is not None: 
                    history_data.to_excel(writer, sheet_name='Historial', index=False)
                    history_sheet = writer.sheets['Historial']
                    for i, column in enumerate(history_data.columns):
                        column_width = get_column_width(history_data[column])
                        history_sheet.set_column(i, i, column_width + 2)
                        # Set column width for History Info sheet

                        cedula_values = history_data["cedula"].tolist() # type: ignore
                        start_color = "#FFFFFF"  # No cell color
                        alternate_color = "#D3D3D3"  # Light grey color
                        current_color = start_color

                        for row_number, cedula in enumerate(cedula_values):
                            if row_number > 0 and cedula != cedula_values[row_number - 1]:
                                # Change color when the cedula changes
                                current_color = alternate_color if current_color == start_color else start_color

                            # Set the row color for all columns in the row
                            row_format = workbook.add_format({'bg_color': current_color}) # type: ignore
                            history_sheet.set_row(row_number + 1, None, row_format)
                # Function to calculate the column width based on content
                # Set column width for CSV Data sheet
                for i, column in enumerate(csv_df.columns):
                    column_width = get_column_width(csv_df[column])
                    csv_sheet.set_column(i, i, column_width + 2)
            # Create a response object with the Excel content
            response = Response(excel_data.getvalue(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            response.headers["Content-Disposition"] = 'attachment; filename="Exporte_StaffNet.xlsx"'
            response.headers["Cache-Control"] = "no-cache"
            return response
        except Exception as e:
            logging.exception(e)
            return Response(status=500)