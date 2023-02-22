
def edit(tabla, campos, condicion, params, conexion, cursor):
    results = run_query(tabla, campos, condicion, conexion, cursor, params)
    response = process_query(results)
    return response


def run_query(tabla, campos, condicion, conexion, cursor, params):
    query = "UPDATE {} SET {} {}".format(
        tabla, (" = %s,".join(campos))+" = %s", condicion)
    print(query % params)
    cursor.execute(query, params)
    conexion.commit()
    return cursor.rowcount


def process_query(rows_updated):
    if rows_updated > 0:
        print("register edited")
        response = {'status': 'success'}
        print(response)
    else:
        response = {'status': 'false'}
        print("register not edited")
    return response
