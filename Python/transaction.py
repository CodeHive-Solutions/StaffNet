from datetime import date
import mysql.connector
import json


def update_data(conexion, info_tables, where):
    try:
        mycursor = conexion.cursor()
        response = {"status": "failed", "error": "No hubo ningun cambio"}
        for table_name, columns in info_tables.items():
            values = []
            for column_name, value in columns.items():
                values.append(column_name + "=%s")
            sql = "UPDATE " + table_name + " SET " + \
                ", ".join(values) + " WHERE " + where
            params = tuple(columns.values())
            print("SQL: ", sql % params)
            mycursor.execute(sql, params)
            if mycursor.rowcount > 0:
                response = {"status": "success"}
        conexion.commit()
        return response

    except mysql.connector.Error as error:
        print("Error: ", error)
        response = {"status": "failed", "error": str(error)}
        return response

    finally:
        mycursor.close()


def search_transaction(conexion, table_info, where):
    """The "table_content" is a dictionary that contains the name of the table
    and her columns is maded in this format:
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
    # Create a cursor
    mycursor = conexion.cursor()

    try:
        response = {"status": "success"}
        # Start a transaction
        mycursor.execute("START TRANSACTION")

        # Loop through each table in the table_info dictionary
        table_names = ", ".join(table_info.keys())
        column_names = []
        for table_name, columns in table_info.items():
            column_names.extend(
                [f"{table_name}.{column}" for column in columns.split(",")])
        column_names = ", ".join(column_names)
        sql = f"SELECT {column_names} FROM {table_names} WHERE {where}"
        # Execute the SQL statement with search_value as parameter
        mycursor.execute(sql)
        result = mycursor.fetchall()
        response = {"status": "success", "data": result}
        return response

    except mysql.connector.Error as error:
        # Roll back the transaction if there's an error
        print(f"Error: {error}")
        conexion.rollback()
        error = str(error)
        response = {"status": "error", "error": error}

    finally:
        # Close the cursor and database connection
        mycursor.close()
        conexion.close()


def insert_transaction(conexion, table_info):
    """The "table_content" is a dictionary that contains the name of the table
    and her columns is maded in this format:
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
    # Create a cursor
    mycursor = conexion.cursor()
    try:
        response = {"status": "success"}
        # Start a transaction
        mycursor.execute("START TRANSACTION")

        # Loop through each table in the table_info dictionary
        for table_name, columns in table_info.items():
            # Build the SQL INSERT statement
            sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(['%s'] * len(columns))})"
            # Build the tuple of column values
            values = tuple(columns.values())
            # Execute the SQL statement
            print("Consulta sql: ", sql)
            print("valores", values)
            print("Aqui ", sql % values)
            mycursor.execute(sql, values)
            if mycursor.rowcount == 0:
                response = {"status": "error",
                            "message": "Ninguna fila fue afectada."}
        # Commit the transaction
        conexion.commit()
        return response

    except mysql.connector.Error as error:
        # Roll back the transaction if there's an error
        print(f"Error: {error}")
        conexion.rollback()
        error = str(error)
        response = {"status": "error", "error": error}

    finally:
        # Close the cursor and database connection
        mycursor.close()
        conexion.close()

class DateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        return json.JSONEncoder.default(self, obj)


def join_tables(conexion, table_names, select_columns, join_columns, id_column=None, id_value=None):
    # Set up the connection to the MySQL database

    # Create a cursor
    mycursor = conexion.cursor()

    # Define the final query
    query = f"SELECT {', '.join(select_columns)} FROM {table_names[0]}"

    for i in range(1, len(table_names)):
        query += f" JOIN {table_names[i]} USING ({join_columns[i-1]})"

    if id_column and id_value:
        # Add a WHERE clause to filter results by the specified column and value
        query += f" WHERE {table_names[0]}.{id_column} = {id_value}"
    try:
        # Execute the query
        mycursor.execute(query)
        # Fetch the results
        results = mycursor.fetchall()
        # Convert the results to a list of dictionaries
        columns = [col[0] for col in mycursor.description]
        rows = [dict(zip(columns, row)) for row in results]
        # Convert the list of dictionaries to a JSON string using the custom encoder
        json_str = json.dumps(rows, cls=DateEncoder)
        data = json.loads(json_str)
        return {"status": "success", "data": data}
    except Exception as error:
        print("Error ", error)
        return {"status": "false", "error": str(error)}
