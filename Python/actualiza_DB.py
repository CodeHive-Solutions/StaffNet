import pandas as pd
import csv
import mysql.connector
import os
from dotenv import load_dotenv

if not os.path.isfile('/var/env/StaffNet.env'):
    raise FileNotFoundError('The env file was not found.')
else:
    load_dotenv("/var/env/StaffNet.env")

connection = mysql.connector.connect(
    #host='172.16.0.118',
    host='172.16.0.115',
    user='StaffNetuser',
    password=os.environ['StaffNetmysql'],
    database='staffnet'
)

# Read the CSV file
file_path = "Actualizacion_StaffNet.xlsx"

df = pd.read_excel(file_path)
cursor = connection.cursor()

# Iterate through the rows of the Excel data
for index, row in df.iterrows():
    cedula = row["cedula"]
    new_value = row["fecha_expedicion"]  # Replace with the actual column name you want to update
    
    # Perform the MySQL update
    update_query = f"UPDATE personal_information SET fecha_expedicion = '{new_value}' WHERE cedula = '{cedula}'"
    cursor.execute(update_query)
    print(f"Updated {cedula} to {new_value}")
connection.commit()

# Close the database connection
cursor.close()
connection.close()

print("Updates complete!")