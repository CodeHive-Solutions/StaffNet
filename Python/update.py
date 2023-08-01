import mysql.connector
import logging
import datetime

logging.basicConfig(filename=f"/var/www/StaffNet/logs/Registros_{datetime.datetime.now().year}.log",
                    level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')


def update(tabla, columna, params, where_clause, conexion):
    """Recuerda mandar los datos encerrados por comillas dobles y no simples, recuerda que si necesitas un WHERE inclur """
    results = run_update(tabla, columna, params, where_clause, conexion)
    response = process_query(results)
    return response


def run_update(tabla, columna, params, where_clause, conexion):
    cursor = conexion.cursor(prepared=True)
    if (type(columna) == str):
        set_clause = f"{columna} = %s"
    else:
        set_clause = ", ".join([f"{col} = %s" for col in columna])
    query = f"UPDATE {tabla} SET {set_clause} {where_clause}"
    print("Query sin params: ", query)
    print("Query formated: ", query % params)
    print(params)
    try:
        cursor.execute(query, params)
        conexion.commit()
        rows_updated = cursor.rowcount
        print("Rows updated: ", rows_updated)
    except mysql.connector.Error as error:
        logging.error(f"Error: {error}")
        print("Error: ", error)
        rows_updated = {"status": "False", "error": error}
        return rows_updated
    cursor.close()
    return rows_updated


def process_query(rows_updated):
    if type(rows_updated) == dict:
        response = rows_updated
    elif rows_updated > 0:
        print("register submit")
        response = {'status': 'success'}
        print(response)
    else:
        response = {'status': 'False', 'error': 'No hubo ningun cambio.'}
        print("submit failed")
    return response

