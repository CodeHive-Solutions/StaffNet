import mysql.connector


try:
    conexion = mysql.connector.connect(
        host="172.16.0.6",
        user="root",
        password="*4b0g4d0s4s*",
        database='StaffNet'
    )
except Exception as err:
    print("Error conexion MYSQL: ", err)


def insert(tabla, columna, params, conexion):
    """Recuerda mandar los datos encerrados por comillas dobles y no simples, el valor "columna" debe ser "" si insertaras valores para cada campo, por el contrario debes especificar las columnas si no es asi."""
    cursor = conexion.cursor()
    results = run_query(tabla, columna, params, conexion, cursor)
    response = process_query(results)
    return response


def run_query(tabla, columna, params, conexion, cursor):
    valores = ", ".join(["%s"] * len(params))
    if columna != "":
        columnas = ", ".join(columna)
        query = f"INSERT INTO {tabla} ({columnas}) VALUES ({valores})"
    else:
        query = f"INSERT INTO {tabla} VALUES ({valores})"
    print(query % params)
    cursor.execute(query, params)
    conexion.commit()
    return cursor.rowcount


def process_query(rows_updated):
    if rows_updated > 0:
        print("register submit")
        response = {'status': 'success'}
        print(response)
    else:
        response = {'status': 'false'}
        print("submit failed")
    return response
