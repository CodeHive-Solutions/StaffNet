import http.server
import threading
import socketserver
import json
import mysql.connector
from login import consulta_login
from edit import edit
from search import search
from http.cookiejar import Cookie, CookieJar
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
    except Exception as err:
        print(err)
    global cursor
    cursor = conexion.cursor()


class Handler(http.server.SimpleHTTPRequestHandler):
    # Override the end_headers method to add a header to allow cross-origin requests
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin',
                         'http://localhost:5173')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        http.server.SimpleHTTPRequestHandler.end_headers(self)

    # Handle POST requests
    def do_POST(self):
        # Recepcion de cookies
        cookie_str = self.headers.get('Cookie')
        print(self.headers)
        print("galletas: ", cookie_str)
        cj = CookieJar()
        # if cookie_str is not None:
        #     # Parse the cookies
        #     cookies = {}
        #     for item in cookie_str.split(';'):
        #         name, value = item.strip().split('=', 1)
        #         cookies[name] = value
        #     my_cookie = cookies.get('Hola')
        #     # Asignate the cookie
        #     if my_cookie:
        #         cookie = Cookie(version=0, name='Hola', value=my_cookie, port=None, port_specified=False,
        #                         domain='example.com', domain_specified=True, domain_initial_dot=False,
        #                         path='/', path_specified=True,
        #                         secure=False,
        #                         expires=None,
        #                         discard=False,
        #                         comment=None,
        #                         comment_url=None,
        #                         rest={},
        #                         rfc2109=False)
        #         cj.set_cookie(cookie)
        #         print("Cookie: ", cj)
        conexion_mysql()
        # Get the content length of the request body
        content_length = int(self.headers.get('Content-Length', 0))
        print("Content-Length: ", content_length)
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
            table = 'users'
            fields = ['permission_consult', 'permission_create',
                      'permission_edit', 'permission_disable']
            values = ["body['']"]
            response = edit(body, conexion, cursor, table, fields, values)
        elif request == 'create':
            print()
        elif request == 'validate_edit':
            response = 200
            # parametros = "cookie"
            # response = search('permission_create', 'users',
            #                   'WHERE user = %s', parametros, cursor, False, "")
        # Enviar respuesta
        self.wfile.write(json.dumps(response).encode())


# Start the server and serve forever
class ThreadedHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    pass


with ThreadedHTTPServer(("", PORT), Handler) as httpd:
    print("Serving at port", PORT)
    httpd.serve_forever()
conexion.close()
