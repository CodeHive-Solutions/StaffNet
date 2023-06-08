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
    # "disciplinary_actions": {
    #     "cedula": "CEDULA",
    #     "falta": "LLAMADO DE ATENCIÓN",
    #     "tipo_sancion": "MEMORANDO 1",
    #     "sancion": "MEMORANDO 2",
    #     # "memorando_3": "MEMORANDO 3"
    # },
    # "vacation_information": {
    #     "cedula": "CEDULA",
    #     "licencia_no_remunerada": "LICENCIA NO REMUNERADOS",
    #     "dias_utilizados": "# PERIODO TOMADOS VACACIONES",
    #     "fecha_salida_vacaciones": "FECHA SALIDA VACACIONES",
    #     "fecha_ingreso_vacaciones": "FECHA INGRESO VACACIONES"
    # },
    "leave_information": {
        "cedula": "CEDULA",
        "fecha_retiro": "FECHA RETIRO",
        "tipo_retiro": "Tipo de Retiro",
        "motivo_retiro": "MOTIVO DE RETIRO",
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
                row[mapping] = row[mapping].upper().strip()
                print(column)
                print("mapping",row[mapping])
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
                elif column in ['salario','tel_fijo', 'subsidio_transporte','dias_utilizados','personas_a_cargo','hijos','estrato','edad','cedula']:
                    integer = row[mapping]
                    print("integer",integer)
                    integer = re.sub(r'\D', '', integer)
                    if integer in ['','SIN INFORMACIÓN','933420000000000',' $ - ']:
                        integer = None
                        if column in ['personas_a_cargo','hijos']:
                            integer = 0
                        elif column in ['estrato']:
                            integer = None
                    if column == 'dias_utilizados' and integer is not None:
                        integer = int(integer)*15
                    if integer is not None:
                        try:
                            integer = int(integer)
                        except:
                            integer = None
                    print("intoger",integer)
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
                elif column == 'motivo_retiro':
                    texto = row[mapping]
                    if texto.find('-') != -1:
                        texto = texto.split('-')[1].strip()
                    if texto.find(' Y ') != -1:
                        texto = texto.split(' Y ')[0].strip()
                    if texto.find('/') != -1:
                        texto = texto.split('/')[0].strip()
                    if texto.find('–') != -1:
                        texto = texto.split('–')[0].strip()
                    if texto.find(',') != -1:
                        texto = texto.split(',')[0].strip()
                    if texto.startswith('RENUNCIA'):
                        texto = texto.split('RENUNCIA')[1].strip()
                    if texto.find(' E ') != -1:
                        texto = texto.split(' E ')[0].strip()
                    if texto in ['INCOMPATIBIIDAD CON EL JEFE','MALA RELACION CON EL JEFE','INCOMPATIBILIDAD CON JEFE','MOTIVADA MAL RELACIONAMIENTO CON EL JEFE']:
                        texto = 'INCOMPATIBILIDAD CON EL JEFE'
                    if texto in ['SENA','REGLAMENTO DE APRENDICES','TERMINACION CONTRATO DE APRENDIZAJE','TERMINACIÓN CONTRATO APRENDIZAJE','TERMINACIÓN CONTRATO DE APRENDIZAJE','TERMINACIÓN DE CONTRATO APRENDIZAJE','TERMINACIÓN DE CONTRATO DE APRENDIZAJE','TERMINACIÓN DE CONTRATO POR PERIODO DE PRUEBA','TERMINACIÓN UNILATERAL SENA','REGLAMENTO DE APRENDICES','TERMINACIÓN DE CONTRATO APRENDIZAJE']:
                        texto = 'TERMINACIÓN DE CONTRATO SENA'
                    elif texto in ['CAMBIO DE ACTIVIDA']:
                        texto = 'CAMBIO DE ACTIVIDAD'
                    elif texto in ['NO HAY OPORTUNIDADES DE CRECIMIENTO', 'NO HAY OPORTUNIDA DE CRECIMIENTO', 'NO HAY OPORTUNIDADESS DE CRECIMIENTO', 'NO OPORTUNIDAD DE CRECIMIENTO']:
                        texto = 'NO HAY OPORTUNIDAD DE CRECIMIENTO'
                    elif texto in ['OTRA ODERTA LABORAL', 'OTRA OFERTA', 'OTRA OFERTA LOBORAL', 'OTRA OFERLA LABORAL']:
                        texto = 'OTRA OFERTA LABORAL'
                    elif texto in ['POR SALUD','POR VENTAS','TRATAMIENTO MÉDICO','QUERIA UN RECESO PARA DESCANSAR','RECOMENDACION MEDICA','DEDICARSE A SU SALUD','POR MOTIVOS DE SALUD','PROBLEMAS DE SALUD','SALUD','DE SALUD']:
                        texto = 'MOTIVOS DE SALUD'
                    elif texto in ['PROBLEMAS PERSONALES','PROYECTO PERSONALES','NEGOCIO PROPIO','CALAMIDAD DOMÉSTICA','CALAMIDAD FAMILIAR','HOSPITALIZACION PADRES','MOTIVOS PERSONAS','MOTIVO FAMILAR','MOTIVOS FAMILIARES','MOTIVOS PERSONAL','MOTIVO PERSONAL','. MOTIVOS PERSONALES','PROBLEMAS PERSONALES CON CC','POR MOTIVOS PERSONALES','PROYECTOS PERSONALES','POR PROBLEMAS PERSONALES']:
                        texto = 'MOTIVOS PERSONALES'
                    elif texto in ['VIAJE FAMILIAR','TRASLADARSE','SALIDA DEL PAIS','MOTIVOSDE VIAJE','MOTIVO DE VIAJE','VIAJE','POR MOTIVOS DE VIAJE','VIAJE PERSONAL','VIAJE AL EXTERIOR','MOTIVOS DE VIAJE','POR MOTIVO DE VIAJE']:
                        texto = 'SE VA DE LA CIUDAD'
                    elif texto in ['POR DESPLAZAMIENTO','DESPLAZAMINTO','DESPLAZAMIENTO']:
                        texto = 'TRANSPORTE'
                    elif texto in ['HORARIO DE ESTUDIO','HORARIOS CON SU HIJO','HORARIO','HORARIOS LABORALES','HORARIO LABORAL']:
                        texto = 'MOTIVOS DE HORARIO'
                    elif texto in ['MAL CLIMA LABORAL','MAL AMBIENTE']:
                        texto = 'MAL AMBIENTE LABORAL'
                    elif texto in ['NO HAY OPORTUNIDAD DE CRECIMIENTO LABORAL','NO HAY OPORTUNIDADES DE CRECIMIENTO LABORAL']:
                        texto = 'NO HAY OPORTUNIDAD DE CRECIMIENTO'
                    elif texto in ['MEJOR OFERTA','OTRA LABORAL','MEJOR ORFERTA LABORAL','MOTIVOS CAMBIO DE LABOR','OFERTA LABORAL','OTRA OFERTA LABORAL']:
                        texto = 'MEJOR OFERTA LABORAL'
                    elif texto in ['ABANDONO','MANIFESTO NO CONTINUAR','ABANDONO DE CARGO','TERMINACIÓN POR ABANDONO DE PUESTO','TERMINACIÓN ABANDONO DE CARGO','ABANDONO DE PUESTO','NO SE VOLVIÓ A REPORTAR A SU LUGAR DE TRABAJO','NO VOLVIO A SU LUGAR DE TRABAJO','NO VOLVIO CAMBIO DE CIUDAD','TERMINACION DE CONTRATO POR ABANDONO DE PUESTO']:
                        texto = 'TERMINACIÓN DE CONTRATO POR ABANDONO DE PUESTO'
                    elif texto in ['OBRA','TÉRMINO DEFINIDO','TERMINACION DE CONTRATO TIEMPO PACTADO','OBRA O LABOR CONTRATADA','TERMINACION POR OBRA LABOR CONTRATADA','TERMINACIÓN DE CONTRATO POR OBRA LABOR','TERMINACIÓN DE CONTRATO POR OBRA O LABOR','TERMINACIÓN POR OBRA LABOR CONTRATADA','TERMINACION POR OBRA LABOR CONTRATADA','TERMINACION DE CONTRATO POR OBRA O LABOR','TERMINACION DE OBRA O LABOR CONTRATADA','OBRA O LABOR','TERMINACION POR OBRA O LABOR CONTRATADA','TERMINACIÒN DE CONTRATO POR OBRA O LABOR','TERMINACIÓN CONTRATO OBRA LABOR','TERMINACIÓN CONTRATO OBRA O LABOR','TERMINACIÓN DE CONTRATO OBRA LABOR','TERMINACIÓN OBRA O LABOR','TERMINACIÓN DE OBRA O LABOR CONTRATADA','TERMINACIÓN POR OBRA O LABOR CONTRATADA','TERMINACION OBRA O LABOR CONTRATADA','TERMINACION DE CONTRATO DE OBRA LABOR']:
                        texto = f'TERMINACIÓN DE CONTRATO DE OBRA O LABOR'
                    elif texto in ['SIN JUSTA CAUSA','TERMINACION DE CONTRATO SIN JUSTA CAUSA','TERMINACIÓN SIN JUSTA CAUSA','TERMINACIÓN CONTRATO SIN JUSTA CAUSA','TERMINACION SIN JUSTA CAUSA','TERMINACION DE CONTRATRO SIN JUSTA CAUSA']:
                        texto = 'TERMINACIÓN DE CONTRATO SIN JUSTA CAUSA'
                    elif texto in ['JUSTA CAUSA','TERMINACIÓN DE CONTRATO JUSTA CAUSA','TERMINACIÓN DE CONTRATO DE JUSTA CAUSA','CON JUSTA CAUSA','TERMINACIÓN CONTRATO LABORAL CON JUSTA CAUSA','TERMINACIÓN CONTRATO CON JUSTA CAUSA','TERMINACIÓN CON JUSTA CAUSA','TERMINACION DE CONTRATO CON JUSTA CAUSA','TERMINACION CONTRATO CON JUSTA CAUSA','TERMINACIO DE CONTRATO CON JUSTA CAUSA']:
                        texto = 'TERMINACIÓN DE CONTRATO CON JUSTA CAUSA'
                    elif texto in ["POR PERIODO DE PRUEBA",'TERMINACIÓN POR PERIODO DE PRUEBA','TERMINACIÓN PERIODO DE PRUEBA','TERMINACIÓN DE CONTRATO PERIODO DE PRUEBA','TERMINACIÓN DE CONTRARO POR PERIODO DE PRUEBA','TERMINACIÓN CONTRATO PERIODO DE PRUEBA','TERMINACIÓN CONTRATO DE TRABAJO DE PERIODO DE PRUEBA','TERMINACION PERIODO DE PRUEBA','TERMINACION DE CONTRATO POR PERIODO DE PRUEBA','TERMINACION DE CONTRATO PERIODO DE PRUEBA','PERIODO DE PRUEBA']:
                        texto = "TERMINACIÓN DE CONTRATO POR PERIODO DE PRUEBA"
                    elif texto in ['NO HAY OPORTUNIDAD DE ESTUDIAR','FORMACIÓN ACADÉMICA','PRACTICAS','PROYECTOS EN LA CARRERA','POR ESTUDIOS','OPORTUNIDAD DE ESTUDIO','NO HAY POSIBILIDADES DE ESTUDIAR','NO HAY OPORTUNIDADES DE ESTUDIAR','POR MOTIVOS DE ESTUDIO','POR ESTUDIO','ESTUDIOS FUERA DEL PAIS','ESTUDIOS','ESTUDIO','NO HAY OPORTUNIDADES DE ESTUDIAR']:
                        texto = 'MOTIVOS DE ESTUDIO'
                    
                    elif texto in ["",'SIN INFORMACION','VOLUNTARIO']:
                        texto = None
                    column_values[column] = texto
                else:
                    if row[mapping] in ['Gerencia de Recursos fisicos','Recursos Fisicos']:
                        row[mapping] = 'Recursos Físicos '
                    elif row[mapping] in ['Analista Gestión Humana']:
                        row[mapping] = 'Analista de Gestión Humana'
                    elif row[mapping] in ["",'',' ','N/A',0,'0','SIN INFORMACION','SIN INFORMACIÓN']:
                        row[mapping] = None
                    elif row[mapping] in ['Analista Juridico']:
                        row[mapping] = 'Analista Jurídico'
                    elif row[mapping] in ['Director(a) de Investigación ']:
                        row[mapping] = 'Director(a) de Investigaciones'
                    column_values[column] = row[mapping]
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