import mysql.connector


def transaction(conexion, table_info, update_key=None, search_table=None, where=None, insert=None, join_tables=None, join_condition=None):
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
            if search_table:
                table_names = ", ".join(table_info.keys())
                column_names = []
                for table_name, columns in table_info.items():
                    column_names.extend(
                        [f"{table_name}.{column}" for column in columns.split(",")])
                column_names = ", ".join(column_names)
                sql = f"SELECT {column_names} FROM {table_names} WHERE {where}"
                # Execute the SQL statement with search_value as parameter
                print(sql)
                mycursor.execute(sql)
                result = mycursor.fetchall()
                response = {"status": "success", "data": result}
                return response
            if join_tables:
                print(columns)
                print(table_name)
                for tables in columns:
                    print(tables)
                    # Build the SQL JOIN statement
                    sql = f"SELECT * FROM {tables} JOIN {join_tables} ON {join_condition}"
                    print("2", tables)
                # Execute the SQL statement
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
                print(sql)
                # Add the update_key value to the end of the tuple of column values
                values = tuple(columns.values()) + (primary_value,)
            elif insert:
                # Build the SQL INSERT statement
                sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(['%s'] * len(columns))})"

                # Build the tuple of column values
                values = tuple(columns.values())

            # Execute the SQL statement
            mycursor.execute(sql, values)
        # Commit the transaction
        conexion.commit()
        return response

    except mysql.connector.Error as error:
        # Roll back the transaction if there's an error
        print(f"Error inserting or updating data in the tables: {error}")
        conexion.rollback()
        error = str(error)
        response = {"status": "error", "error": error}

    finally:
        # Close the cursor and database connection
        mycursor.close()
        conexion.close()
