def update(tabla, columna, params, where_clause, conexion):
    """Recuerda mandar los datos encerrados por comillas dobles y no simples, recuerda mandar las columnas como array incluso si es solo una."""
    results = run_update(tabla, columna, params, where_clause, conexion)
    response = process_query(results)
    return response


def run_update(tabla, columna, params, where_clause, conexion):
    cursor = conexion.cursor()
    if (len(columna) == 1):
        print("Just one")
        set_clause = f"{columna[0]} = %s"
    else:
        set_clause = ", ".join([f"{col} = %s" for col in columna])
    query = f"UPDATE {tabla} SET {set_clause} {where_clause}"
    print(query)
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
        response = {'status': 'false'}
        print("submit failed")
    return response
