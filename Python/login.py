from ldap3 import Server, Connection, SAFE_SYNC,  SUBTREE
import os
import logging
import datetime

logging.basicConfig(filename=f"/var/www/StaffNet/logs/Registros_{datetime.datetime.now().year}.log",
                    level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')

# LDAP
server = Server('CYC-SERVICES.COM.CO')


def start_ldap():
    # Conexion a LDAP mediante usuario ADMIN
    conn = Connection(server, user='Staffnet', password=os.getenv('StaffNetldap'),
                      client_strategy=SAFE_SYNC, auto_bind=True) # type: ignore
    return conn, server


def consulta_login(body, conexion):
    cursor = conexion.cursor()
    password = body['password']
    user = body['user']
    query = "SELECT permission_consult, permission_create, permission_edit, permission_disable, permission_create_admins, rol FROM users WHERE `user` = %s"
    # La coma de user si es necesaria
    cursor.execute(query, (user,))
    
    result_query = cursor.fetchone()
    if result_query != None and result_query != []:
        status, result, response, _ = consulta_usuario_ad(user, 'name')
        if len(response) >= 4:
            # Login
            atributos = response[0]['attributes']
            nombre = atributos['name']
            try:
                login = Connection(
                    server, user=nombre, password=password, client_strategy='SYNC', auto_bind=True, read_only=True) # type: ignore
                response = {"disable": result_query[3], "edit": result_query[2], 'status': 'success', "consult": result_query[0], "create": result_query[1],
                            'create_admins': result_query[4], 'rol': result_query[5]}
                login.unbind()
            except Exception as e:
                response = {'status': 'failure',
                            'error': 'Contraseña Incorrecta'}
        else:
            response = {'status': 'failure',
                        'error': 'Usuario no encontrado'}
    else:
        response = {'status': 'failure',
                    'error': 'Usuario no encontrado'}
    cursor.close()
    conexion.close()
    return response


def consulta_usuario_ad(user, attributes):
    conn, server = start_ldap()
    # Busqueda del usuario
    status, result, response, _ = conn.search(
        'dc=CYC-SERVICES,dc=COM,dc=CO', '(sAMAccountName=%s)' % (user), search_scope=SUBTREE,  attributes=attributes)
    return status, result, response, _

