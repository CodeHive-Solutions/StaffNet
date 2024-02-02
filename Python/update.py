import logging
import datetime
from types import NoneType
import mysql.connector

logging.basicConfig(
    filename=f"/var/www/StaffNet/logs/Registros_{datetime.datetime.now().year}.log",
    level=logging.INFO,
    format="%(asctime)s:%(levelname)s:%(message)s",
)


def update(tabla, columna, params, where_clause, conexion):
    """Recuerda mandar los datos encerrados por comillas dobles y no simples, recuerda que si necesitas un WHERE incluirlo en la variable where_clause, si no necesitas un WHERE, mandar un string vacio."""
    results = run_update(tabla, columna, params, where_clause, conexion)
    response = process_query(results)
    return response


def run_update(tabla, columna, params, where_clause, conexion):
    cursor = conexion.cursor()
    if isinstance(columna, str):
        set_clause = f"{columna} = %s"
    else:
        set_clause = ", ".join([f"{col} = %s" for col in columna])
    query = f"UPDATE {tabla} SET {set_clause} {where_clause}"
    try:
        cursor.execute(query, params)
        conexion.commit()
        rows_updated = cursor.rowcount
    except mysql.connector.Error as error:
        rows_updated = {"status": "False", "error": error}
        return rows_updated
    cursor.close()
    return rows_updated


def process_query(rows_updated):
    if type(rows_updated) == dict:
        response = rows_updated
    elif rows_updated > 0:
        response = {"status": "success"}
    else:
        response = {"status": "False", "error": "No hubo ningun cambio."}
    return response
