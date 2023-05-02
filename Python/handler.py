import pickle
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
import time
import sys
import os
sys.path.insert(0, '/path/to/insert/module')

logging.basicConfig(filename=f"../logs/Registros_{datetime.datetime.now().year}.log",
                    level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')
app = Flask(__name__)
app.config['SESSION_TYPE'] = 'redis'
try:
    redis_client = redis.Redis(
        host='172.16.0.128', port=6379, password="654321")
    redis_client.ping()
except:
    print("Connection to redis failed")
    logging.critical(f"Connection to redis failed", exc_info=True)
app.config['SESSION_REDIS'] = redis_client
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_REFRESH_EACH_REQUEST'] = True
# app.config['SESSION_REFRESH_THRESHOLD'] = 600
app.secret_key = os.urandom(24)
# app.secret_key = "Hack_me_if_u_can"
logging.getLogger('werkzeug').setLevel(logging.ERROR)

Session(app)

# Evitar logs innecesarios


def conexionMySQL():
    if "conexion" not in g:
        try:
            g.conexion = mysql.connector.connect(
                host="172.16.0.6",
                user="root",
                password="*4b0g4d0s4s*",
                database='StaffNet'
            )
        except Exception as err:
            print("Error conexion MYSQL: ", err)
    return g.conexion


@app.before_request
def logs():
    print("Actual session sid", session.sid)
    if request.method == 'OPTIONS':
        pass
    elif request.content_type == 'application/json':
        petition = request.url.split("/")[3]
        if petition == "login":
            print("Peticion: ", petition, "user: ", request.json["user"])
            logging.info(
                {"User": request.json["user"], "Peticion": petition})
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
    url_permitidas = ["http://localhost:5173",
                      "http://localhost:8080", "http://172.16.5.10:8080"]
    if request.origin in url_permitidas:
        response.headers.add('Access-Control-Allow-Origin',
                             request.origin)
        response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'POST, GET')
    return response


@app.teardown_appcontext
def close_db(useless_var):
    conexion = g.pop('conexion', None)
    if conexion != None:
        print("Conexion cerrada")
        conexion.close()
    print(
        "____________________________________________________________________________")


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


@ app.route('/login', methods=['POST'])
def login():
    conexion = conexionMySQL()
    response = consulta_login(request.json, conexion)
    print(response)
    session_key = 'session:' + session.sid
    print(session_key)
    if response["status"] == 'success':
        username = request.json["user"]
        session["username"] = username
        session["create_admins"] = response["create_admins"]
        session["consult"] = response["consult"]
        session["create"] = response["create"]
        session["edit"] = response["edit"]
        session["disable"] = response["disable"]
        # session_data = redis_client.get(session_key)
        # print(pickle.loads(session_data))
        update("users", "session_id", (session_key,),
               f"WHERE user = '{username}'", conexion)
        response = {"status": 'success',
                    'create_admins': response["create_admins"]}
    return response


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
        conexion = conexionMySQL()
        username = (request.json['username'],)
        response = search('permission_consult, permission_create, permission_edit, permission_disable', 'users',
                          'WHERE user = %s', username, conexion, True, username)
    else:
        response = {'status': 'False',
                    'error': 'No tienes permisos'}
    return response


@ app.route('/create', methods=['POST'])
def crete():
    if session["create"] == True:
        body = request.json
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
    body = request.json
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
            "personal_information": "cedula,nombre,celular,correo",
            "employment_information": "cargo,gerencia,campana_general",
            "leave_information": "estado"
        }
        where = "personal_information.cedula = leave_information.cedula"
        response = search_transaction(
            conexion, table_info, where=where)
        response = {"info": response, "permissions": {
            "create": session["create"], "edit": session["edit"], "disable": session["disable"]}}
    else:
        response = {'status': 'False',
                    'error': 'No tienes permisos'}
        print(response)
    return response


@ app.route('/get_join_info', methods=['POST'])
def get_join_info():
    conexion = conexionMySQL()
    body = request.json
    if session["consult"] == True:
        table_names = ["personal_information",
                       "educational_information", "employment_information", "performance_evaluation", "disciplinary_actions", "vacation_information", "leave_information"]
        join_columns = ["cedula", "cedula",
                        "cedula", "cedula", "cedula", "cedula"]
        response = join_tables(
            conexion, table_names, "*", join_columns, id_column="cedula", id_value=body["cedula"])
    else:
        response = {'status': 'False',
                    'error': 'No tienes permisos'}
    return response


@ app.route('/change_state', methods=['POST'])
def change_state():
    if session["disable"] == True:
        body = request.json
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
        body = request.json
        conexion = conexionMySQL()
        info_tables = {
            "personal_information": {
                "cedula": body["cedula"], "nombre": body["nombre"], "fecha_nacimiento": body["fecha_nacimiento"],
                "genero": body["genero"], "edad": body["edad"], "rh": body["rh"],
                "estado_civil": body["estado_civil"], "hijos": body["hijos"], "personas_a_cargo": body["personas_a_cargo"],
                "estrato": body["estrato"], "tel_fijo": body["tel_fijo"], "celular": body["celular"],
                "correo": body["correo"], "direccion": body["direccion"], "barrio": body["barrio"],
                "contacto_emergencia": body["contacto_emergencia"], "parentesco": body["parentesco"], "tel_contacto": body["tel_contacto"]},
            "educational_information": {
                "cedula": body["cedula"],
                "nivel_escolaridad": body["nivel_escolaridad"],
                "profesion": body["profesion"],
                "estudios_en_curso": body["estudios_en_curso"]
            },
            "employment_information": {
                "cedula": body["cedula"], "fecha_afiliacion": body["fecha_afiliacion"], "eps": body["eps"],
                "pension": body["pension"], "cesantias": body["cesantias"], "cambio_eps_pension_fecha": body["cambio_eps_pension_fecha"],
                "cuenta_nomina": body["cuenta_nomina"], "fecha_ingreso": body["fecha_ingreso"], "cargo": body["cargo"],
                "gerencia": body["gerencia"], "campana_general": body["campana_general"], "area_negocio": body["area_negocio"],
                "tipo_contrato": body["tipo_contrato"], "salario_2023": body["salario_2023"], "subsidio_transporte_2023": body["subsidio_transporte_2023"],
                "fecha_cambio_campana_periodo_prueba": body["fecha_cambio_campana_periodo_prueba"]
            },
            "performance_evaluation": {
                "cedula": body["cedula"],
                "desempeno_1_sem_2016": body["desempeno_1_sem_2016"],
                "desempeno_2_sem_2016": body["desempeno_2_sem_2016"],
                "desempeno_2017": body["desempeno_2017"],
                "desempeno_2018": body["desempeno_2018"],
                "desempeno_2019": body["desempeno_2019"],
                "desempeno_2020": body["desempeno_2020"],
                "desempeno_2021": body["desempeno_2021"]
            },
            "disciplinary_actions": {
                "cedula": body["cedula"],
                "llamado_atencion": body["llamado_atencion"],
                "memorando_1": body["memorando_1"],
                "memorando_2": body["memorando_2"],
                "memorando_3": body["memorando_3"]
            },
            "vacation_information": {
                "cedula": body["cedula"],
                "licencia_no_remunerada": body["licencia_no_remunerada"],
                "periodo_tomado_vacaciones": body["periodo_tomado_vacaciones"],
                "periodos_faltantes_vacaciones": body["periodos_faltantes_vacaciones"],
                "fecha_salida_vacaciones": body["fecha_salida_vacaciones"],
                "fecha_ingreso_vacaciones": body["fecha_ingreso_vacaciones"]
            },
            "leave_information": {
                "cedula": body["cedula"],
                "fecha_retiro": body["fecha_retiro"],
                "tipo_de_retiro": body["tipo_de_retiro"],
                "motivo_de_retiro": body["motivo_de_retiro"],
                "estado": body["estado"]
            }
        }
        if body["historical"]:
            insert("historical", "", "", conexion)
        response = update_data(
            conexion, info_tables, "cedula = "+str(body["cedula"]))
    else:
        response = {'status': 'False',
                    'error': 'No tienes permisos'}
    return response


@ app.route('/insert_transaction', methods=['POST'])
def insert_in_tables():
    if session["create"] == True:
        body = request.json
        conexion = conexionMySQL()
        info_tables = {
            "personal_information": {
                "cedula": body["cedula"], "nombre": body["nombre"], "fecha_nacimiento": body["fecha_nacimiento"],
                "genero": body["genero"], "edad": body["edad"], "rh": body["rh"],
                "estado_civil": body["estado_civil"], "hijos": body["hijos"], "personas_a_cargo": body["personas_a_cargo"],
                "estrato": body["estrato"], "tel_fijo": body["tel_fijo"], "celular": body["celular"],
                "correo": body["correo"], "correo_corporativo": body["correo_corporativo"], "direccion": body["direccion"], "barrio": body["barrio"],
                "contacto_emergencia": body["contacto_emergencia"], "parentesco": body["parentesco"], "tel_contacto": body["tel_contacto"]},
            "educational_information": {
                "cedula": body["cedula"],
                "nivel_escolaridad": body["nivel_escolaridad"],
                "profesion": body["profesion"],
                "estudios_en_curso": body["estudios_en_curso"]
            },
            "employment_information": {
                "cedula": body["cedula"], "fecha_afiliacion": body["fecha_afiliacion"], "eps": body["eps"],
                "pension": body["pension"], "cesantias": body["cesantias"], "cambio_eps_pension_fecha": body["cambio_eps_pension_fecha"],
                "cuenta_nomina": body["cuenta_nomina"], "fecha_ingreso": body["fecha_ingreso"], "cargo": body["cargo"],
                "gerencia": body["gerencia"], "campana_general": body["campana_general"], "area_negocio": body["area_negocio"],
                "tipo_contrato": body["tipo_contrato"], "salario_2023": body["salario_2023"], "subsidio_transporte_2023": body["subsidio_transporte_2023"],
                "fecha_cambio_campana_periodo_prueba": body["fecha_cambio_campana_periodo_prueba"]
            },
            "performance_evaluation": {
                "cedula": body["cedula"],
                "desempeno_1_sem_2016": body["desempeno_1_sem_2016"],
                "desempeno_2_sem_2016": body["desempeno_2_sem_2016"],
                "desempeno_2017": body["desempeno_2017"],
                "desempeno_2018": body["desempeno_2018"],
                "desempeno_2019": body["desempeno_2019"],
                "desempeno_2020": body["desempeno_2020"],
                "desempeno_2021": body["desempeno_2021"]
            },
            "disciplinary_actions": {
                "cedula": body["cedula"],
                "llamado_atencion": body["llamado_atencion"],
                "memorando_1": body["memorando_1"],
                "memorando_2": body["memorando_2"],
                "memorando_3": body["memorando_3"]
            },
            "vacation_information": {
                "cedula": body["cedula"],
                "licencia_no_remunerada": body["licencia_no_remunerada"],
                "periodo_tomado_vacaciones": body["periodo_tomado_vacaciones"],
                "periodos_faltantes_vacaciones": body["periodos_faltantes_vacaciones"],
                "fecha_salida_vacaciones": body["fecha_salida_vacaciones"],
                "fecha_ingreso_vacaciones": body["fecha_ingreso_vacaciones"]
            },
            "leave_information": {
                "cedula": body["cedula"],
                "fecha_retiro": body["fecha_retiro"],
                "tipo_de_retiro": body["tipo_de_retiro"],
                "motivo_de_retiro": body["motivo_de_retiro"],
                "estado": body["estado"]
            }
        }
        response = insert_transaction(conexion, info_tables)
    else:
        response = {'status': 'False',
                    'error': 'No tienes permisos'}
    return response


if __name__ == '__main__':
    app.run(port=5000)
