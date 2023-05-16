import csv
import mysql.connector

# Establish a connection to the MySQL database
connection = mysql.connector.connect(
    host='your_host',
    user='your_user',
    password='your_password',
    database='your_database'
)

# Create a cursor object
cursor = connection.cursor(prepared=True)

# Function to insert data into a specific table
def insert_data_into_table(table_name, data):
    # Prepare the SQL query with placeholders
    placeholders = ', '.join(['%s'] * len(data))
    columns = ', '.join(data.keys())
    sql = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"

    # Execute the query with the data values
    cursor.execute(sql, list(data.values()))

# Read data from CSV file
with open('data.csv', 'r') as file:
    csv_reader = csv.reader(file)
    header = next(csv_reader)  # Read the header row

    # Iterate over each table
    for table_name in header:
        columns = next(csv_reader)  # Read the columns for the table
        create_table_structure(table_name, columns)  # Create table structure

        # Iterate over the remaining rows and insert the data
        for row in csv_reader:
            data = {column: value for column, value in zip(columns, row)}
            insert_data_into_table(table_name, data)

# Commit the changes
connection.commit()

# Close the cursor and the database connection
cursor.close()
connection.close()
