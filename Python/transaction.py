import mysql.connector


def insert_or_update_transaction(conexion, table_info, update_key=None):
    """Insert data into tables the "table_content" is a dictionary that contains the name of the table
    and her columns is maded in json format"""
    # Create a cursor
    mycursor = conexion.cursor()

    try:
        # Start a transaction
        mycursor.execute("START TRANSACTION")

        # Loop through each table in the table_info dictionary
        for table_name, columns in table_info.items():
            if update_key:
                # Build the SQL UPDATE statement
                sql = f"UPDATE {table_name} SET {', '.join([f'{col}=%s' for col in columns if col != update_key])} WHERE {update_key}=%s"

                primary_value = columns[update_key]
                # Remove the update_key from the columns dictionary
                columns = {k: v for k, v in columns.items() if k != update_key}
                print(columns)
                # Add the update_key value to the end of the tuple of column values
                values = tuple(columns.values()) + (primary_value,)
            else:
                # Build the SQL INSERT statement
                sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(['%s'] * len(columns))})"

                # Build the tuple of column values
                values = tuple(columns.values())

            # Execute the SQL statement
            mycursor.execute(sql, values)

        # Commit the transaction
        conexion.commit()

        print("Data has been successfully inserted or updated in the tables!")
        response = {"status": "success"}
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
