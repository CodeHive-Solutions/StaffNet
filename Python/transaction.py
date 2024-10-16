"""This module contains functions to perform transactions on the MySQL database."""
from datetime import date
import json
import logging
import datetime
import mysql.connector

logging.basicConfig(
    filename=f"/var/www/StaffNet/logs/Registros_{datetime.datetime.now().year}.log",
    level=logging.INFO,
    format="%(asctime)s:%(levelname)s:%(message)s",
)


def update_data(conexion, info_tables, where):
    cursor = conexion.cursor()
    try:
        response = {"status": "failed", "error": "No hubo ningún cambio"}
        for table_name, columns in info_tables.items():
            values = []
            for column_name, _ in columns.items():
                values.append(column_name + "=%s")
            sql = (
                "UPDATE " + table_name + " SET " + ", ".join(values) + " WHERE " + where
            )
            params = tuple(columns.values())
            cursor.execute(sql, params)
            if cursor.rowcount > 0:
                response = {"status": "success"}
        conexion.commit()
        return response
    except mysql.connector.Error as error:
        logging.error(f"Error: {error}")
        response = {"status": "failed", "error": str(error)}
        return response
    finally:
        conexion.close()


def search_transaction(conexion, table_info):
    cursor = conexion.cursor()
    try:
        response = {"status": "success", "data": []}
        # Get the table names and columns
        table_names = [table[0] for table in table_info]
        columns = {table[0]: table[1] for table in table_info}
        # Construct the SELECT statement and join conditions
        select_columns = []
        join_conditions = []
        for table_name in table_names:
            table_columns = columns[table_name]
            valid_columns = [
                f"{table_name}.{column}"
                for column, search_value in table_columns.items()
            ]
            if valid_columns:
                select_columns.extend(valid_columns)
                join_conditions.append(f"{table_name}.cedula = {table_names[0]}.cedula")

        select_columns = ", ".join(select_columns)
        join_conditions = " AND ".join(join_conditions)
        sql = f"SELECT {select_columns} FROM {table_names[0]}"
        for i in range(1, len(table_names)):
            sql += f" LEFT JOIN {table_names[i]} ON {table_names[i-1]}.cedula = {table_names[i]}.cedula"
        # Here we check if the user rol is assigned for a specific campaign
        campana_filter = columns.get("employment_information", {}).get(
            "campana_general", ""
        )
        if campana_filter:
            campana_conditions = []

            for value in campana_filter:
                campana_conditions.append(
                    "employment_information.campana_general LIKE %s"
                )

            campana_condition = " OR ".join(campana_conditions)

            sql += " WHERE " + join_conditions + " AND (" + campana_condition + ")"
            campana_value = f"%{campana_filter}%"

            campana_values = [f"%{value}%" for value in campana_filter]
            cursor.execute(sql, tuple((campana_values)))
        else:
            sql += " WHERE " + join_conditions
            cursor.execute(sql)

        # Fetch the results using a list comprehension
        response["data"] = [
            dict(zip([column[0].split(".")[-1] for column in cursor.description], row))
            for row in cursor.fetchall()
        ]

        return response
    except Exception as e:
        # Handle exceptions or log them for debugging
        logging.error(f"Error: {str(e)}")
        return {"status": "error", "message": str(e)}
    finally:
        conexion.close()


def insert_transaction(conexion, table_info):
    """The "table_content" is a dictionary that contains the name of the table
    and her columns is made in this format:
    {
        "table_name": {
            "column1": "value1",
            "column2": "value2",
            ...
        }
        "table_2: {
            "column1": "value1",
            "column2": "value2",
            ...
        }
    }
    """
    cursor = conexion.cursor()
    try:
        response = {"status": "success"}
        cursor.execute("START TRANSACTION")
        # Loop through each table in the table_info dictionary
        for table_name, columns in table_info.items():
            # Build the SQL INSERT statement
            sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(['%s'] * len(columns))})"
            # Build the tuple of column values
            values = tuple(columns.values())
            # Execute the SQL statement
            cursor.execute(sql, values)
            if cursor.rowcount == 0:
                response = {"status": "error", "message": "Ninguna fila fue afectada."}
        # Commit the transaction
        conexion.commit()
        return response
    except mysql.connector.Error as error:
        # Roll back the transaction if there's an error
        logging.error(f"Error: {error}")
        conexion.rollback()
        error = str(error)
        logging.error(f"sending error mysql {error}")
        response = {"status": "error", "error": error}
        return response
    finally:
        # Close the cursor and database connection
        cursor.close()
        conexion.close()


class DateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, date):
            return obj.strftime("%Y-%m-%d")
        return json.JSONEncoder.default(self, obj)


def join_tables(
    conexion,
    table_names,
    select_columns,
    join_columns,
    where=None,
    id_column=None,
    id_value=None,
):
    """Just a simple function to join tables and return a JSON string of the results"""
    if conexion is None:
        return {"status": "False", "error": "No se pudo conectar a la base de datos"}
    cursor = conexion.cursor()

    # Define the final query
    query = f"SELECT {', '.join(select_columns)} FROM {table_names[0]}"

    for i in range(1, len(table_names)):
        query += f" JOIN {table_names[i]} USING ({join_columns[i-1]})"

    if id_column and id_value:
        # Add a WHERE clause to filter results by the specified column and value
        query += f" WHERE {table_names[0]}.{id_column} = {id_value}"
    if where:
        query += f" {where}"
    try:
        # Execute the query
        cursor.execute(query)
        # Fetch the results
        results = cursor.fetchall()
        # Convert the results to a list of dictionaries
        columns = [col[0] for col in cursor.description]
        rows = [dict(zip(columns, row)) for row in results]
        # Convert the list of dictionaries to a JSON string using the custom encoder
        json_str = json.dumps(rows, cls=DateEncoder)
        data = json.loads(json_str)
        return {"status": "success", "data": data}
    except Exception as error:
        logging.error("Error: %s", error)
        return {"status": "False", "error": str(error)}
    finally:
        conexion.close()
