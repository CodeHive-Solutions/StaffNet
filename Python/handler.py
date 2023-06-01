import logging
from flask import Flask, request, session, g
from flask_session import Session
from insert import insert
from login import consulta_login
from update import update
from search import search
from transaction import search_transaction, insert_transaction, join_tables, update_data
import datetime
import mysql.connector
import redis
import os

# Evitar logs innecesarios
logging.getLogger('werkzeug').setLevel(logging.ERROR)

logging.basicConfig(filename=f"/var/www/StaffNet/logs/Registros_{datetime.datetime.now().year}.log",
                    level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')

try:
    redis_client = redis.Redis(
        host='172.16.0.128', port=6379, password="654321")
except:
    print("Connection to redis failed")
    redis_client = None
    logging.critical(f"Connection to redis failed", exc_info=True)
    raise

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_REDIS'] = redis_client
app.config['SESSION_COOKIE_NAME'] = 'StaffNet'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
# app.config['SESSION_COOKIE_SAMESITE'] = 'lax'
app.config['SESSION_COOKIE_SAMESITE'] = "None"
app.config['SESSION_COOKIE_DOMAIN'] = '.cyc-bpo.com'
app.secret_key = os.environ.get('SECRET_KEY') or os.urandom(24)
# app.secret_key = "Hack_me_if_u_can"

sess = Session()
sess.init_app(app)

def get_request_body():
    if request.content_type == 'application/json':
        return request.get_json()
    else:
        return {}

def bd_info():
    body = get_request_body()
    logging.info(f"Request: {body}")
    info_tables = {}
    try:
        info_tables = {
                    "personal_information": {
                        "cedula": body.get("cedula"), "nombre": body.get("nombre"),"tipo_documento": body.get("tipo_documento"), "fecha_nacimiento": body.get("fecha_nacimiento"),
                        "genero": body.get("genero"), "rh": body.get("rh"),
                        "estado_civil": body.get("estado_civil"), "hijos": body.get("hijos"), "personas_a_cargo": body.get("personas_a_cargo"),
                        "estrato": body.get("estrato"), "tel_fijo": body.get("tel_fijo"), "celular": body.get("celular"),
                        "correo": body.get("correo"), "direccion": body.get("direccion"), "barrio": body.get("barrio"),
                        "contacto_emergencia": body.get("contacto_emergencia"), "parentesco": body.get("parentesco"), "tel_contacto": body.get("tel_contacto")},
                    "educational_information": {
                        "cedula": body.get("cedula"),
                        "nivel_escolaridad": body.get("nivel_escolaridad"),
                        "profesion": body.get("Profesión"),
                        "estudios_en_curso": body.get("estudios_en_curso")
                    },
                    "employment_information": {
                        "cedula": body.get("cedula"), "fecha_afiliacion_eps": body.get("fecha_afiliacion"), "eps": body.get("eps"),
                        "pension": body.get("pension"),"caja_compensacion":body.get("caja_compensacion"), "cesantias": body.get("cesantias"),
                        "cuenta_nomina": body.get("cuenta_nomina"), "fecha_ingreso": body.get("fecha_ingreso"),"sede": body.get("sede"), "cargo": body.get("cargo"),
                        "gerencia": body.get("gerencia"), "campana_general": body.get("campana_general"), "area_negocio": body.get("area_negocio"),
                        "tipo_contrato": body.get("tipo_contrato"), "salario": body.get("salario_2023"), "subsidio_transporte": body.get("subsidio_transporte_2023"),
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
                        "tipo_retiro": body.get("tipo_de_retiro"),
                        "motivo_retiro": body.get("motivo_de_retiro"),
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
            # g.conexion = mysql.connector.connect(
            #     host="172.16.0.6",
            #     user="root",
            #     password="*4b0g4d0s4s*",
            #     database='StaffNet'
            # )
            g.conexion = mysql.connector.connect(
                host="172.16.0.115",
                user="root",
                password=os.environ.get('MYSQL_115'),
                database='StaffNet'
            )
            logging.info("Connection to MYSQL success")
        except Exception as err:
            print("Error conexion MYSQL: ", err)
            logging.critical("Error conexion MYSQL: ", err, exc_info=True)
            raise
    return g.conexion


@app.before_request
def logs():
    if request.method == 'OPTIONS':
        pass
    elif request.content_type == 'application/json':
        body = get_request_body()
        petition = request.url.split("/")[3]
        if petition == "login":
            print("Peticion: ", petition, "user: ", body["user"])
            logging.info(
                {"User": body["user"], "Peticion": petition})
        else:
            print("Peticion: ", petition)
            logging.info({"User": session["username"], "Peticion": petition,
                          "Valores": request.json})
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
                      "staffnet.cyc-bpo.com", "http://localhost:5173"]
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
        response = search('permission_consult, permission_create, permission_edit, permission_disable', 'users',
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
            "personal_information": "cedula,nombre,correo",
            "employment_information": "cargo,gerencia,campana_general",
            "leave_information": "estado"
        }
        where = "employment_information.cedula = personal_information.cedula AND leave_information.cedula = personal_information.cedula"
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
        response = search(["columna","valor_antiguo",'fecha_cambio'], "historical", "WHERE cedula = %s", (body["cedula"],), conexion)
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
