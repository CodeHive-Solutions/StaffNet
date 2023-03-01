from datetime import date
import json
import mysql.connector


def transaction(table_info, update_key=None, search_table=None, where=None, insert=None):
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
    try:
        conexion = mysql.connector.connect(
            host="172.16.0.6",
            user="root",
            password="*4b0g4d0s4s*",
            database='StaffNet'
        )
    except Exception as err:
        print("Error conexion MYSQL: ", err)
    # Create a cursor
    mycursor = conexion.cursor()

    try:
        # Start a transaction
        mycursor.execute("START TRANSACTION")
        # Loop through each table in the table_info dictionary
        for table_name, columns in table_info.items():
            if search_table:
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
            elif update_key:
                # Build the SQL UPDATE statement
                sql = f"UPDATE {table_name} SET {', '.join([f'{col}=%s' for col in columns if col != update_key])} WHERE {update_key}=%s"
                primary_value = columns[update_key]
                # Remove the update_key from the columns dictionary
                columns = {k: v for k, v in columns.items() if k != update_key}
                # Add the update_key value to the end of the tuple of column values
                values = tuple(columns.values()) + (primary_value,)
                response = {"status": "success"}
                mycursor.execute(sql, values)
                if mycursor.rowcount == 0:
                    response = {"status": "false", "error": "Ningun cambio fue efectuado"}
                return response
            elif insert:
                # Build the SQL INSERT statement
                sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(['%s'] * len(columns))})"
                # Build the tuple of column values
                values = tuple(columns.values())
                response = {"status": "success"}
            # Execute the SQL statement
            mycursor.execute(sql, values)
        # Commit the transaction
        conexion.commit()
        return response

    except mysql.connector.Error as error:
        # Roll back the transaction if there's an error
        print(f"Error: {error}")
        conexion.rollback()
        error = str(error)
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


def join_tables(table_names, select_columns, join_columns, id_column=None, id_value=None):
    # Set up the connection to the MySQL database
    try:
        conexion = mysql.connector.connect(
            host="172.16.0.6",
            user="root",
            password="*4b0g4d0s4s*",
            database='StaffNet'
        )
    except Exception as err:
        print("Error conexion MYSQL: ", err)

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
    except Exception:
        return {"status": "false", "error": Exception}
