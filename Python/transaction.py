import mysql.connector


def transaction(table_info, update_key=None, search_table=None, where=None, insert=None, join=None, join_condition=None):
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
        print(f"Error: {error}")
        conexion.rollback()
        error = str(error)
        response = {"status": "error", "error": error}

    finally:
        # Close the cursor and database connection
        mycursor.close()
        conexion.close()


def join_tables(*join_args):
    try:
        conexion = mysql.connector.connect(
            host="172.16.0.6",
            user="root",
            password="*4b0g4d0s4s*",
            database='StaffNet'
        )
    except Exception as err:
        print("Error conexion MYSQL: ", err)
        return {"status": "error", "message": str(err)}

    # Create a cursor
    mycursor = conexion.cursor()

    join_conditions = []
    select_columns = []
    for table1, table2, columns in join_args:
        for col1, col2 in columns:
            select_columns.append(f"{table1}.{col1} AS {table1}_{col1}")
            select_columns.append(f"{table2}.{col2} AS {table2}_{col2}")
            join_conditions.append(f"{table1}.{col1} = {table2}.{col2}")

    select_columns_str = ", ".join(select_columns)
    join_conditions_str = " AND ".join(join_conditions)
    sql = f"SELECT {select_columns_str} FROM `{join_args[0][0]}` JOIN `{join_args[0][1]}` ON {join_conditions_str}"
    for table1, table2, columns in join_args[1:]:
        join_conditions = []
        for col1, col2 in columns:
            join_conditions.append(f"`{table1}`.`{col1}` = `{table2}`.`{col2}`")
        join_conditions_str = " AND ".join(join_conditions)
        sql = f"SELECT * FROM ({sql}) AS joined_tables JOIN `{table2}` ON {join_conditions_str}"
    print(sql)
    try:
        mycursor.execute(sql)
        result = mycursor.fetchall()
        response = {"status": "success", "data": result}
    except Exception as e:
        response = {"status": "error", "message": str(e)}
    finally:
        conexion.close()

    return response
