import mysql.connector


def update(tabla, columna, params, where_clause, conexion):
    """Recuerda mandar los datos encerrados por comillas dobles y no simples, recuerda que si necesitas un WHERE inclur """
    results = run_update(tabla, columna, params, where_clause, conexion)
    response = process_query(results)
    return response


def run_update(tabla, columna, params, where_clause, conexion):
    cursor = conexion.cursor()
    print("len", type(params))
    if (type(columna) == str):
        set_clause = f"{columna} = %s"
    else:
        set_clause = ", ".join([f"{col} = %s" for col in columna])
    query = f"UPDATE {tabla} SET {set_clause} {where_clause} %s"
    print("Query sin params: ", query)
    print("Query formated: ", query % params)
    try:
        cursor.execute(query, params)
        conexion.commit()
        rows_updated = cursor.rowcount
    except mysql.connector.Error as error:
        rows_updated = {"status": "false", "error": error}
    cursor.close()
    return rows_updated


def process_query(rows_updated):
    print("Processing", type(rows_updated))
    if type(rows_updated) == 'error':
        response = rows_updated
    elif rows_updated > 0:
        print("register submit")
        response = {'status': 'success'}
        print(response)
    else:
        response = {'status': 'false', 'error': 'No hubo ningun cambio.'}
        print("submit failed")
    return response
