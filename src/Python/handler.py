import http.server
import socketserver
import json
import mysql.connector
from login import consulta_login
from edit import edit
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
        self.send_header('Access-Control-Allow-Origin', '*')
        http.server.SimpleHTTPRequestHandler.end_headers(self)

    # Handle POST requests
    def do_POST(self):
        conexion_mysql()
        # Get the content length of the request body
        content_length = int(self.headers.get('Content-Length', 0))
        # Read the request body and convert in a JSON object
        body = json.loads(self.rfile.read(content_length))
        # Log the request data
        print(body)
        # Send a response to the client
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        request = body['request']
        if request == 'login':
            response, session = consulta_login(body, conexion, cursor)
        elif request == 'edit':
            table = 'users'
            fields = ['permission_consult', 'permission_create',
                      'permission_edit', 'permission_disable']
            values = ["body['']"]
            response = edit(body, conexion, cursor, table, fields, values)
        elif request == 'create':
            print()
        elif request == 'validate_edit':
            if session.user == 'heibert.mogollon':
                print("llego")
        # Enviar respuesta
        self.wfile.write(json.dumps(response).encode())


# Start the server and serve forever
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Serving at port", PORT)
    httpd.serve_forever()
conexion.close()
