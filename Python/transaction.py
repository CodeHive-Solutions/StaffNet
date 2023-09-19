from datetime import date
import mysql.connector
import json
import logging
import datetime

logging.basicConfig(filename=f"/var/www/StaffNet/logs/Registros_{datetime.datetime.now().year}.log",
                    level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')

def update_data(conexion, info_tables, where):
    mycursor = conexion.cursor()
    try:
        response = {"status": "failed", "error": "No hubo ningun cambio"}
        for table_name, columns in info_tables.items():
            values = []
            for column_name, value in columns.items():
                values.append(column_name + "=%s")
            sql = "UPDATE " + table_name + " SET " + \
                ", ".join(values) + " WHERE " + where
            params = tuple(columns.values())
            mycursor.execute(sql, params)
            if mycursor.rowcount > 0:
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
    # Create a cursor
    mycursor = conexion.cursor()
    try:
        # Initialize the response dictionary
        response = {"status": "success", "data": []}  # Changed data to an empty list
        # Get the table names and columns
        table_names = [table[0] for table in table_info]
        columns = {table[0]: table[1] for table in table_info}
        # Construct the SELECT statement and join conditions
        select_columns = []
        join_conditions = []
        for table_name in table_names:
            table_columns = columns[table_name]
            valid_columns = [f"{table_name}.{column}" for column, search_value in table_columns.items()]
            if valid_columns:
                select_columns.extend(valid_columns)
                join_conditions.append(f"{table_name}.cedula = {table_names[0]}.cedula")
        
        select_columns = ", ".join(select_columns)
        join_conditions = " AND ".join(join_conditions)
        sql = f"SELECT {select_columns} FROM {table_names[0]}"
        for i in range(1, len(table_names)):
            sql += f" LEFT JOIN {table_names[i]} ON {table_names[i-1]}.cedula = {table_names[i]}.cedula"
        
        # Use parameterized queries to prevent SQL injection
        campana_filter = columns.get("employment_information", {}).get("campana_general", "")
        if campana_filter:
            sql += " WHERE " + join_conditions + " AND employment_information.campana_general LIKE %s"
            campana_value = f"%{campana_filter}%"
            mycursor.execute(sql, (campana_value,))
        else:
            sql += " WHERE " + join_conditions
            mycursor.execute(sql)
        
        # Fetch the results using a list comprehension
        response["data"] = [dict(zip([column[0].split('.')[-1] for column in mycursor.description], row)) for row in mycursor.fetchall()]
        
        return response
    except Exception as e:
        # Handle exceptions or log them for debugging
        logging.error(f"Error: {str(e)}")
        return {"status": "error", "message": str(e)}
    finally:
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
            mycursor.execute(sql, values)
            if mycursor.rowcount == 0:
                response = {"status": "error",
                            "message": "Ninguna fila fue afectada."}
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
        mycursor.close()
        conexion.close()

class DateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        return json.JSONEncoder.default(self, obj)


def join_tables(conexion, table_names, select_columns, join_columns, id_column=None, id_value=None):
    """Just a simple function to join tables and return a JSON string of the results"""
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
        logging.error(f"Error: {error}")
        return {"status": "False", "error": str(error)}
    finally:
        conexion.close()

