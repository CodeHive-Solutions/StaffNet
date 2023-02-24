import mysql.connector


def transaction(conexion, table_content):
    """Insert data into tables the "table_content" is a dictionary that contains the name of the table
    and her columns is maded in json format"""
    # Create a cursor
    mycursor = conexion.cursor()

    try:
        # Start a transaction
        mycursor.execute("START TRANSACTION")

        # Loop through each table in the table_content dictionary
        for table_name, columns in table_content.items():
            # Build the SQL INSERT statement
            sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(['%s'] * len(columns))})"

            # Build the tuple of column values
            values = tuple(columns[col] for col in columns)
            # Execute the SQL INSERT statement
            mycursor.execute(sql, values)

        # Commit the transaction
        conexion.commit()
        print("Data has been successfully inserted into the tables!")
        response = {"status": "success"}
        return response

    except mysql.connector.Error as error:
        # Roll back the transaction if there's an error
        print(f"Error inserting data into the tables: {error}")
        conexion.rollback()
        error = str(error)
        response = {"status": "error", "error": error}
        return response

    finally:
        # Close the cursor and database connection
        mycursor.close()
        conexion.close()
