import csv
import re
import datetime
import mysql.connector
import logging
import datetime

logging.basicConfig(filename=f"/var/www/StaffNet/logs/Registros_{datetime.datetime.now().year}.log",
                    level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')

info_tables = {
    "personal_information": {
        "cedula": "CEDULA",
        "nombre": "NOMBRE",
        "fecha_nacimiento": "FECHA DE NACIMIENTO",
        "lugar_expedicion": "LUGAR EXPEDICION C.C.",
        "genero": "GENERO",
        "rh": "RH",
        "estado_civil": "ESTADO CIVIL",
        "hijos": "# HIJOS",
        "personas_a_cargo": "# PERSONAS A CARGO",
        "estrato": "ESTRATO ",
        "tel_fijo": "TEL FIJO",
        "celular": "CELULAR",
        "correo": "CORREO",
        "direccion": "DIRECCION",
        "barrio": "BARRIO",
        "contacto_emergencia": "CONTACTO CASO EMERGENCIA",
        "parentesco": "PARENTESCO",
        "tel_contacto": "TEL CONTACTO"
    },
    "educational_information": {
        "cedula": "CEDULA",
        "nivel_escolaridad": "NIVEL ESCOLARIDAD",
        "profesion": "PROFESION ",
        "estudios_en_curso": "ESTUDIOS EN CURSO"
    },
    "employment_information": {
        "cedula": "CEDULA",
        "fecha_afiliacion_eps": "FECHA AFILIACION",
        "eps": "EPS",
        "pension": "PENSION",
        "cesantias": "CESANTIAS",
        "cambio_eps_pension_fecha": "CAMBIO EPS - PENSION FECHA",
        "cuenta_nomina": "CUENTA NOMINA",
        "fecha_ingreso": "FECHA INGRESO",
        "sede": "CIUDAD DE TRABAJO",
        "cargo": "CARGO",
        "gerencia": "GERENCIA",
        "campana_general": "CAMPAÑA GENERAL",
        "area_negocio": "ÁREA DE NEGOCIO",
        "tipo_contrato": "TIPO DE CONTRATO",
        "salario": " SALARIO 2023 ",
        "subsidio_transporte": " SUBSIDIO TRANSPORTE 2023 ",
        "fecha_cambio_campana_periodo_prueba": "FECHA CAMBIO CAMPAÑA PERIODO DE PRUEBA"
    },
    # "performance_evaluation": {
    #     "cedula": "CEDULA",
    #     "desempeno_1_sem_2016": "E. DESEMPEÑO I SEM 2016",
    #     "desempeno_2_sem_2016": "E. DESEMPEÑO II SEM 2016",
    #     "desempeno_2017": "E. DESEMPEÑO 2017",
    #     "desempeno_2018": "E. DESEMPEÑO 2018",
    #     "desempeno_2019": "E. DESEMPEÑO 2019",
    #     "desempeno_2020": "E. DESEMPEÑO 2020",
    #     "desempeno_2021": "E. DESEMPEÑO 2021"
    # },
    "disciplinary_actions": {
        "cedula": "CEDULA",
        "falta": "LLAMADO DE ATENCIÓN",
        "tipo_sancion": "MEMORANDO 1",
        "sancion": "MEMORANDO 2",
        # "memorando_3": "MEMORANDO 3"
    },
    "vacation_information": {
        "cedula": "CEDULA",
        "licencia_no_remunerada": "LICENCIA NO REMUNERADOS",
        "dias_utilizados": "# PERIODO TOMADOS VACACIONES",
        "fecha_salida_vacaciones": "FECHA SALIDA VACACIONES",
        "fecha_ingreso_vacaciones": "FECHA INGRESO VACACIONES"
    },
    "leave_information": {
        "cedula": "CEDULA",
        "fecha_retiro": "FECHA RETIRO",
        "tipo_de_retiro": "Tipo de Retiro",
        "motivo_de_retiro": "MOTIVO DE RETIRO",
        "estado": "ESTADO"
    }
}


connection = mysql.connector.connect(
    host='172.16.0.115',
    user='root',
    password='T3cn0l0g142023*',
    database='StaffNet'
)

cursor = connection.cursor()

file_path = '/var/www/StaffNet/python/ENCUESTA SOCIODEMOGRÁFICA_PROYECTO_StaffNet.csv'

with open(file_path, 'r', encoding='utf-8-sig') as csv_file:
    csv_reader = csv.DictReader(csv_file, delimiter=";")
    for row in csv_reader:
        print(row)
        # Iterate over each table in the JSON object
        for table, column_mapping in info_tables.items():
            column_values = {}
            for column, mapping in column_mapping.items():
                row[mapping] = row[mapping].upper()
                print(column)
                if column in ['fecha_nacimiento', 'fecha_afiliacion_eps', 'fecha_ingreso','fecha_salida_vacaciones', 'fecha_ingreso_vacaciones', 'fecha_retiro']:
                    date_string = row[mapping]
                    print("fecha",date_string)
                    if date_string in ['',' ','NO','0/01/1900','N/A'] or len(date_string) > 10:
                        formatted_date = None
                        if column in ['fecha_nacimiento']:
                            formatted_date = '1000-01-01'
                    else:
                        date_object = datetime.datetime.strptime(date_string, '%d/%m/%Y')
                        formatted_date = date_object.strftime('%Y-%m-%d')
                    print(formatted_date)
                    column_values[column] = formatted_date
                elif column in ['salario','tel_fijo' 'subsidio_transporte','dias_utilizados','personas_a_cargo','hijos','estrato','edad','cedula']:
                    integer = row[mapping]
                    integer = re.sub(r'\D', '', integer)
                    if integer in ['','SIN INFORMACIÓN','933420000000000',' $ - ']:
                        integer = None
                        if column in ['personas_a_cargo','hijos','estrato']:
                            integer = 0
                    if column == 'dias_utilizados' and integer is not None:
                        integer = int(integer)*15
                    print(integer)
                    column_values[column] = integer
                elif column in ['lugar_expedicion']:
                    texto = row[mapping]
                    if texto in ['','SIN INFORMACIÓN']:
                        texto = None
                    elif texto == 'BOGOTÁ D.C.':
                        texto = 'BOGOTA'
                elif column in ['estado']:
                    estado = row[mapping]
                    print(estado)
                    if estado == 'ACTIVO':
                        estado = 1
                    elif estado == 'RETIRADO':
                        estado = 0
                    column_values[column] = estado
                elif column == 'LLAMADO DE ATENCIÓN':
                    query = "INSERT INTO disciplinary_actions (cedula, falta, tipo_sancion, sancion,fecha_faltas) VALUES (%s, %s, %s, %s, %s)"
                    cursor.execute(query, (row["cedula"], row["LLAMADO DE ATENCIÓN"],None, None, None))
                elif column == 'MEMORANDO 1':
                    query = "INSERT INTO disciplinary_actions (cedula, falta, tipo_sancion, sancion,fecha_faltas) VALUES (%s, %s, %s, %s, %s)"
                    cursor.execute(query, (row["cedula"], row["MEMORANDO 1"],None, None, None))
                elif column == 'MEMORANDO 2':
                    query = "INSERT INTO disciplinary_actions (cedula, falta, tipo_sancion, sancion,fecha_faltas) VALUES (%s, %s, %s, %s, %s)"
                    cursor.execute(query, (row["cedula"], row["MEMORANDO 2"],None, None, None))
                elif column == 'MEMORANDO 3':
                    query = "INSERT INTO disciplinary_actions (cedula, falta, tipo_sancion, sancion,fecha_faltas) VALUES (%s, %s, %s, %s, %s)"
                    cursor.execute(query, (row["cedula"], row["MEMORANDO 3"],None, None, None))
                else:
                    column_values[column] = row[mapping]
            # if 'estado' in column_values and column_values['estado'] == 0:
            #     column_values['dias_utilizados'] = None
            column_names = ', '.join(column_values.keys())
            placeholders = ', '.join(['%s'] * len(column_values))
            update_columns = ', '.join([f"{column} = VALUES({column})" for column in column_values])
            query = f"INSERT INTO {table} ({column_names}) VALUES ({placeholders}) ON DUPLICATE KEY UPDATE {update_columns}"
            try:
                print(query , tuple(column_values.values()))
                cursor.execute(query, tuple(column_values.values()))
            except Exception as e:
                logging.error(f"Error inserting row into {table} table, error: ",e)
                raise Exception(f"Error inserting row into {table} table, error: ",e)


# Commit the changes and close the cursor and connection
try:
    connection.commit()
    cursor.close()
    connection.close()
except Exception as e:
    logging.error(f"Error committing changes and closing cursor and connection, error: ",e)
    print(e)