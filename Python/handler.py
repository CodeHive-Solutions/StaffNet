import logging
from io import StringIO
import csv
from flask import Flask,Response, request, session, g
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
                            "cedula": body.get("cedula"), "nombre": body.get("nombre"),"tipo_documento": body.get("tipo_documento"), "fecha_nacimiento": body.get("fecha_nacimiento"),
                            "genero": body.get("genero"), "rh": body.get("rh"),
                            "estado_civil": body.get("estado_civil"), "hijos": body.get("hijos"), "personas_a_cargo": body.get("personas_a_cargo"),
                            "estrato": body.get("estrato"), "tel_fijo": body.get("tel_fijo"), "celular": body.get("celular"),
                            "correo": body.get("correo"),"correo_corporativo": body.get("correo_corporativo"), "direccion": body.get("direccion"), "barrio": body.get("barrio"),
                            'localidad':body.get('localidad'),"contacto_emergencia": body.get("contacto_emergencia"), "parentesco": body.get("parentesco"), "tel_contacto": body.get("tel_contacto")},
                        "educational_information": {
                            "cedula": body.get("cedula"),
                            "nivel_escolaridad": body.get("nivel_escolaridad"),
                            "profesion": body.get("profesion"),
                            "estudios_en_curso": body.get("estudios_en_curso")
                        },
                        "employment_information": {
                            "cedula": body.get("cedula"), "fecha_afiliacion_eps": body.get("fecha_afiliacion_eps"), "eps": body.get("eps"),
                            "pension": body.get("pension"),"caja_compensacion":body.get("caja_compensacion"), "cesantias": body.get("cesantias"),
                            "cuenta_nomina": body.get("cuenta_nomina"), "fecha_ingreso": body.get("fecha_ingreso"),"sede": body.get("sede"), "cargo": body.get("cargo"),
                            "gerencia": body.get("gerencia"), "campana_general": body.get("campana_general"), "area_negocio": body.get("area_negocio"),
                            "tipo_contrato": body.get("tipo_contrato"), "salario": body.get("salario"), "subsidio_transporte": body.get("subsidio_transporte"),
                            'observaciones': body.get('observaciones')
                        },
                        # "performance_evaluation": {
                            # "cedula": body.get("cedula"),
                            # "calificacion": body.get("desempeno"),
                        # },
                        # "disciplinary_actions": {
                        #     "cedula": body.get("cedula"),
                        #     "falta": body.get("falta"),
                        #     "tipo_sancion": body.get("tipo_sancion"),
                        #     "sancion": body.get("sancion"),
                        # },
                        # "vacation_information": {
                        #     "cedula": body.get("cedula"),
                        #     "licencia_no_remunerada": body.get("licencia_no_remunerada"),
                        #     "dias_utilizados": "0",
                        #     "fecha_salida_vacaciones": body.get("fecha_salida_vacaciones"),
                        #     "fecha_ingreso_vacaciones": body.get("fecha_ingreso_vacaciones")
                        # },
                        "leave_information": {
                            "cedula": body.get("cedula"),
                            "fecha_retiro": body.get("fecha_retiro"),
                            "tipo_retiro": body.get("tipo_retiro"),
                            "motivo_retiro": body.get("motivo_retiro"),
                            "estado": body.get("estado")
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
                      "https://staffnet-dev.cyc-bpo.com", "http://localhost:5173","http://localhost:3000", "http://172.16.5.11:3000"]
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
            'educational_information': '*',
            "employment_information": "*",
            "leave_information": "*"
        }
        where = "educational_information.cedula = employment_information.cedula AND employment_information.cedula = personal_information.cedula AND leave_information.cedula = personal_information.cedula"
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
        response = search(["columna","valor_antiguo","valor_nuevo",'fecha_cambio'], "historical", "WHERE cedula = %s", (body["cedula"],), conexion)
    else:
        response = {'status': 'False',
                    'error': 'No tienes permisos'}
    logging.info(f"response4: {response}")
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

@ app.route('/download', methods=['POST']) #type: ignore
def download():
    if session["consult"] == True:
        body = request.get_data(as_text=True)
        logging.info("BODY")
        logging.info("BODY",body)
        conexion = conexionMySQL()
        history = search(["columna","valor_antiguo","valor_nuevo",'fecha_cambio'], "historical", None,None, conexion)
        rows = body.strip().split("\n")
        csv_buffer = StringIO()
        writer = csv.writer(csv_buffer, delimiter=";")
        for row in rows:
            writer.writerow(row.split(";"))
        # Create a response object with CSV content
        response = Response(csv_buffer.getvalue(), content_type="text/csv")
        response.headers["Content-Disposition"] = 'attachment; filename="Exporte_StaffNet.csv"'
        response.headers["Cache-Control"] = "no-cache"
        return response
