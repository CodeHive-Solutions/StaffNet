
def insert(tabla, columna, params, conexion):
    """Recuerda mandar los datos encerrados por comillas dobles y no simples, el valor "columna" debe ser un string vacio, si solo insertaras valores en ciertas columnas debes especificar la cantidad de columnas con '%s' y sus nombres en params."""
    cursor = conexion.cursor()
    results = run_query(tabla, columna, params, conexion, cursor)
    response = process_query(results)
    cursor.close()
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
