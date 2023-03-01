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


def update(tabla, columna, params, where_clause):
    """Recuerda mandar los datos encerrados por comillas dobles y no simples, recuerda mandar las columnas como array incluso si es solo una."""
    results = run_update(tabla, columna, params, where_clause)
    response = process_query(results)
    return response


def run_update(tabla, columna, params, where_clause):
    cursor = conexion.cursor()
    if (len(columna) == 1):
        set_clause = f"{columna[0]} = %s"
    else:
        set_clause = ", ".join([f"{col} = %s" for col in columna])
    query = f"UPDATE {tabla} SET {set_clause} {where_clause}"
    print(query % tuple(params))
    cursor.execute(query, params)
    conexion.commit()
    return cursor.rowcount


def process_query(rows_updated):
    if rows_updated > 0:
        print("register submit")
        response = {'status': 'success'}
        print(response)
    else:
        response = {'status': 'false', 'error': 'Ninguna columna fue editada'}
        print("submit failed")
    return response
