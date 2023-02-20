from ldap3 import Server, Connection, SAFE_SYNC,  SUBTREE
from session import create_session
import bcrypt


def consulta_login(body, conexion, cursor):
    session = False
    password = body['password']
    user = body['user']
    query = "SELECT password, permission_consult, permission_create, permission_edit, permission_disable FROM users WHERE `user` = %s"
    print(query % user)
    cursor.execute(query, (user,))
    result_query = cursor.fetchone()
    print(result_query)
    if result_query != None and result_query != []:
        # print(bcrypt.hashpw(bytes("", 'utf-8'), bcrypt.gensalt()))
        password_bd_encode = bytes(result_query[0], 'utf-8')
        if bcrypt.checkpw(bytes(password, 'utf-8'), password_bd_encode):
            print("Logged by MYSQL")
            create_session(user, result_query)
            response = {'login': 'success'}
        else:
            # LDAP
            server = Server('CYC-SERVICES.COM.CO')
            # Conexion a LDAP mediante usuario ADMIN
            conn = Connection(server, user='Staffnet', password='T3cn0l0g142023*',
                              client_strategy=SAFE_SYNC, auto_bind=True)
            # Busqueda del usuario
            status, result, response, _ = conn.search(
                'dc=CYC-SERVICES,dc=COM,dc=CO', '(sAMAccountName=%s)' % (user), search_scope=SUBTREE,  attributes='name')
            if len(response) >= 4:
                # Login
                atributos = response[0]['attributes']
                nombre = atributos['name']
                try:
                    print(nombre, password)
                    login = Connection(
                        server, user=nombre, password=password, client_strategy='SYNC', auto_bind=True, read_only=True)
                    session = create_session(user, result_query)
                    response = {'login': 'success'}
                    try:
                        hashed_password = bcrypt.hashpw(
                            bytes(password, 'utf-8'), bcrypt.gensalt())
                        print(hashed_password[0])
                        consulta = "UPDATE users SET password = '{}' WHERE user = '{}'".format(
                            hashed_password.decode('utf-8'), user)
                        cursor.execute(consulta)
                        conexion.commit()
                        print("Actualizacion exitosa")
                    except Exception as e:
                        print(e)
                    login.unbind()
                except Exception as e:
                    print(e)
                    print("Error en la contraseña LDAP")
                    response = {'login': 'failure',
                                'error': 'contraseña incorrecta'}
            else:
                print("usuario no encontrado LDAP")
                response = {'login': 'failure',
                            'error': 'usuario no encontrado'}
    else:
        response = {'login': 'failure',
                    'error': 'usuario no encontrado'}
    return response, session
