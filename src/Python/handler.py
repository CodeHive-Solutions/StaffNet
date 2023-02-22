import http.server
import threading
import socketserver
import json
import mysql.connector
from insert import insert
from login import consulta_login
from edit import edit
from search import search
from sessions import verify_token
# Port number to use for the server
PORT = 5000

# Define a custom request handler


def conexion_mysql():
    try:
        global conexion
        conexion = mysql.connector.connect(
            host="172.16.0.6",
            user="root",
            password="*4b0g4d0s4s*",
            database='StaffNet'
        )
        global cursor
        cursor = conexion.cursor()
    except Exception as err:
        print(err)


class Handler(http.server.SimpleHTTPRequestHandler):
    # Override the end_headers method to add a header to allow cross-origin requests
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin',
                         'http://localhost:5173')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        http.server.SimpleHTTPRequestHandler.end_headers(self)

    # Handle POST requests
    def do_POST(self):
        conexion_mysql()
        # Get the content length of the request body
        content_length = int(self.headers.get('Content-Length', 0))
        # Read the request body and convert in a JSON object
        body = json.loads(self.rfile.read(content_length))
        # Log the request data
        print("Peticion: ", body)
        # Send a response to the client
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        # Manejar la petición
        request = body['request']
        if request == 'login':
            response = consulta_login(body, conexion, cursor)

        elif request == 'search':
            parametros = (body['username'],)
            print("Tipo: ", type(parametros))
            response = search('permission_consult, permission_create, permission_edit, permission_disable', 'users',
                              'WHERE user = %s', parametros, cursor, True, body['username'])

        elif request == 'edit':
            table = "users"
            fields = "permission_consult", "permission_create", "permission_edit", "permission_disable"
            condition = "WHERE user = %s"
            parameters = (body["permissions"]["consultar"], body["permissions"]["crear"], body[
                "permissions"]["editar"], body["permissions"]["inhabilitar"], body["user"],)
            response = edit(table, fields,
                            condition, parameters, conexion, cursor)

        elif request == 'create':
            parameters = (body["user"], body["permissions"]["consultar"], body["permissions"]["crear"], body[
                "permissions"]["editar"], body["permissions"]["inhabilitar"],)
            columns = ("user", "permission_consult",
                       "permission_create", "permission_edit", "permission_disable")
            response = insert('users', columns, parameters, conexion, cursor)

        elif request == 'validate_create_admins':
            print("llega a validar")
            response = verify_token(body["token"], "create_admins")
        # Enviar respuesta
        print("Respuesta: ", response)
        self.wfile.write(json.dumps(response).encode())


# Start the server and serve forever
class ThreadedHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    pass


with ThreadedHTTPServer(("", PORT), Handler) as httpd:
    print("Serving at port", PORT)
    httpd.serve_forever()
conexion.close()
