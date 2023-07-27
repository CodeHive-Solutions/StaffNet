from login import consulta_usuario_ad
import datetime
import logging


logging.basicConfig(filename=f"/var/www/StaffNet/logs/Registros_{datetime.datetime.now().year}.log",
                    level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')

def search(campos, tabla, condicion, params, conexion, active_directory=None, user_ad=None):
    """The params is for the condicion argument that have to be an %s if you dont want any condition, send just the %s and the param like a string in white."""
    results = run_query(campos, tabla, condicion, conexion, params)
    response = process_query(results, active_directory, user_ad)
    return response


def run_query(campos, tabla, condicion, conexion, params):
    cursor = conexion.cursor()
    campos_str = ', '.join(campos)
    if condicion == None:
        query = "SELECT {} FROM {}".format(campos_str, tabla)
        cursor.execute(query)
    else:
        query = "SELECT {} FROM {} {}".format(
            campos_str, tabla, condicion)
        logging.info(f"Ejecutando: {query % params}")
        cursor.execute(query, params)
    resultado = cursor.fetchall()
    return resultado


def process_query(results, active_directory, user_ad):
    if results not in ['', None, []] :
        response = {'status': 'success', 'info': results}
    elif active_directory:
        status, result, respuesta, _ = consulta_usuario_ad(user_ad, 'name')
        if len(respuesta) >= 4:
            response = {'status': 'success'}
        else:
            print("Registro no encontrado LDAP")
            response = {'status': 'False', 'error': 'Usuario de windows no encontrado'}
    else:
        response = {'status': 'False', 'error': 'Registro no encontrado'}
    return response

