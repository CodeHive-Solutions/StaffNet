import http.server
import threading
import socketserver
import json
import datetime
import logging
from insert import insert
from login import consulta_login
from update import update
from search import search
from sessions import verify_token, decrypt
from transaction import transaction, join_tables


# Port number to use for the server
PORT = 5000

# Define a custom request handler


class Handler(http.server.SimpleHTTPRequestHandler):
    # Override the end_headers method to add a header to allow cross-origin requests
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin',
                         'http://localhost:5173')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        http.server.SimpleHTTPRequestHandler.end_headers(self)

    # Handle POST requests
    def do_POST(self):
        try:
            logging.basicConfig(filename='../logs/Registros_'+str(datetime.date.today().year)+".log", level=logging.INFO,
                                format='%(asctime)s:%(levelname)s:%(message)s')
            # Get the content length of the request body
            content_length = int(self.headers.get('Content-Length', 0))
            # Read the request body and convert in a JSON object
            body = json.loads(self.rfile.read(content_length))
            # Log the request data
            print("Peticion: ", body)
            request = body['request']
            if request == 'login':
                logging.info("Peticion: user: " +
                             str(body["user"])+" "+str(request))
            else:
                token = body['token']
                user = decrypt(token, "username")
                logging.info("Peticion: user: "+str(user)+str(body))
            # Send a response to the client
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            # Manejar la petición
            if request == 'login':
                response = consulta_login(body)

            elif request == 'validate_create_admins':
                if verify_token(token, "create_admins"):
                    response = {'status': 'success'}
                else:
                    response = {'status': 'False',
                                'error': 'No tienes permisos'}

            elif request == 'validate_consult':
                if verify_token(token, "consult"):
                    response = {'status': 'success'}
                else:
                    response = {'status': 'False',
                                'error': 'No tienes permisos'}

            elif request == 'search_employees':
                table_info = {
                    "personal_information": "cedula,nombre,celular,correo",
                    "leave_information": "estado"
                }
                where = "personal_information.cedula = leave_information.cedula"
                if verify_token(token, "consult"):
                    response = transaction(
                        table_info, search_table=True, where=where)
                else:
                    response = {'status': 'False',
                                'error': 'No tienes permisos'}
            elif request == 'search_user_ad':
                if verify_token(token, "consult"):
                    username = (body['username'],)
                    response = search('permission_consult, permission_create, permission_edit, permission_disable', 'users',
                                      'WHERE user = %s', username, True, body['username'])
                else:
                    response = {'status': 'False',
                                'error': 'No tienes permisos'}

            elif request == 'edit_admin':
                if verify_token(token, "edit"):
                    table = "users"
                    fields = "permission_consult", "permission_create", "permission_edit", "permission_disable"
                    condition = "WHERE user = %s"
                    parameters = (body["permissions"]["consultar"], body["permissions"]["crear"], body[
                        "permissions"]["editar"], body["permissions"]["inhabilitar"], body["user"],)
                    response = update(table, fields, parameters, condition)
                else:
                    response = {'status': 'False',
                                'error': 'No tienes permisos'}

            elif request == 'create':
                if verify_token(token, "create"):
                    parameters = (body["user"], body["permissions"]["consultar"], body["permissions"]["crear"], body[
                        "permissions"]["editar"], body["permissions"]["inhabilitar"],)
                    columns = ("user", "permission_consult",
                               "permission_create", "permission_edit", "permission_disable")
                    response = insert('users', columns, parameters)
                else:
                    response = {'status': 'False',
                                'error': 'No tienes permisos'}

            elif request == "insert_transaction":
                if verify_token(token, "create"):
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
                    response = transaction(info_tables, insert=True)
                else:
                    response = {'status': 'False',
                                'error': 'No tienes permisos'}

            elif request == "update_transaction":
                if verify_token(token, "edit"):
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
                    response = transaction(info_tables, "cedula")
                else:
                    response = {'status': 'False',
                                'error': 'No tienes permisos'}

            elif request == "change_state":
                if verify_token(token, "disable"):
                    response = update("leave_information", ("estado",),
                                      (body["change_to"], body["cedula"]), "WHERE cedula = %s")
                else:
                    response = {'status': 'False',
                                'error': 'No tienes permisos'}
            elif request == "join":
                if verify_token(token, "consult"):
                    table_names = ["personal_information",
                                   "educational_information", "employment_information", "performance_evaluation", "disciplinary_actions", "vacation_information", "leave_information"]
                    join_columns = ["cedula", "cedula",
                                    "cedula", "cedula", "cedula", "cedula"]
                    response = join_tables(
                        table_names, "*", join_columns, id_column="cedula", id_value=body["cedula"])
            # Enviar respuesta
            print("Respuesta: ", response)
            self.wfile.write(json.dumps(response).encode())
            logging.info("Respuesta: "+str(response))
        except Exception as e:
            print("Error: ", e)
            logging.warning("Error: "+str(e), exc_info=True)


# Start the server and serve forever
class ThreadedHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    pass


with ThreadedHTTPServer(("", PORT), Handler) as httpd:
    print("Serving at port", PORT)
    httpd.serve_forever()
print("Archivo terminado")
