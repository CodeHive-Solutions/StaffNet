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
    host='172.16.0.118',
    user='StaffNetuser',
    password=os.environ['StaffNetmysql'],
    # host='172.16.0.115',
    # user='root',
    # password=os.environ['MYSQL_115'],
    database='staffnet'
)

# Read the CSV file
file_path = "StaffNeto.csv"

try:
    with connection.cursor() as cursor:
        with open(file_path, 'r', encoding='utf-8-sig') as csv_file:
            csv_reader = csv.DictReader(csv_file, delimiter=";")
            
            for row in csv_reader:
                cedula_str = row['CEDULA'].replace(',', '')  # Remove comma
                cedula = float(cedula_str)  # Convert to float first
                lugar = row['LUGAR EXPEDICION C.C.']
                
                # SQL query to update data
                sql = f"UPDATE personal_information SET `lugar_expedicion` = %s WHERE `cedula` = %s"
                cursor.execute(sql, (lugar, cedula))
            
        # Commit the changes
        connection.commit()
        
finally:
    connection.close()
