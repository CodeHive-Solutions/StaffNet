# Read a xlsx file and load it into a mysql database

import os
import pandas as pd
import mysql.connector
from mysql.connector import Error


def clean_value(value):
    """Clean the value to be inserted in the database"""
    if value is None or value == "" or str(value).upper() == "NAN":
        return None
    if isinstance(value, int):
        return value
    return str(value).upper()


def bd_info():
    """Dictionary with the information of the database"""
    body = {}
    if body != str:
        info_tables = {}
        try:
            info_tables = {
                "personal_information": {
                    "cedula": "cedula",
                    "nombres": "nombres",
                    "apellidos": "apellidos",
                    "tipo_documento": "tipo_documento",
                    "fecha_expedicion": "fecha_expedicion",
                    "lugar_expedicion": "lugar_expedicion",
                    "fecha_nacimiento": "fecha_nacimiento",
                    "genero": "genero",
                    "rh": "rh",
                    "estado_civil": "estado_civil",
                    "hijos": "hijos",
                    "personas_a_cargo": "personas_a_cargo",
                    "estrato": "estrato",
                    "tel_fijo": "tel_fijo",
                    "celular": "celular",
                    "correo": "correo",
                    "correo_corporativo": "correo_corporativo",
                    "direccion": "direccion",
                    "barrio": "barrio",
                    "localidad": "localidad",
                    "contacto_emergencia": "contacto_emergencia",
                    "parentesco": "parentesco",
                    "tel_contacto": "tel_contacto",
                },
                "educational_information": {
                    "cedula": "cedula",
                    "nivel_escolaridad": "nivel_escolaridad",
                    "profesion": "profesion",
                    "estudios_en_curso": "estudios_en_curso",
                },
                "employment_information": {
                    "cedula": "cedula",
                    "fecha_afiliacion_eps": clean_value(
                        body.get("fecha_afiliacion_eps")
                    ),
                    "eps": "eps",
                    "pension": "pension",
                    "caja_compensacion": "caja_compensacion",
                    "cesantias": "cesantias",
                    "cuenta_nomina": "cuenta_nomina",
                    "fecha_nombramiento": "fecha_nombramiento",
                    "fecha_ingreso": "fecha_ingreso",
                    "sede": "sede",
                    "cargo": "cargo",
                    "gerencia": "gerencia",
                    "campana_general": "campana_general",
                    "area_negocio": "area_negocio",
                    "tipo_contrato": "tipo_contrato",
                    "salario": "salario",
                    "subsidio_transporte": "subsidio_transporte",
                    "aplica_teletrabajo": clean_value(
                        body.get("aplica_teletrabajo", False)
                    ),
                    "fecha_aplica_teletrabajo": clean_value(
                        body.get("fecha_aplica_teletrabajo")
                    ),
                    "talla_camisa": "talla_camisa",
                    "talla_pantalon": "talla_pantalon",
                    "talla_zapatos": "talla_zapatos",
                    "observaciones": "observaciones",
                },
                "disciplinary_actions": {
                    "cedula": "cedula",
                    "memorando_1": "memorando_1",
                    "memorando_2": "memorando_2",
                    "memorando_3": "memorando_3",
                },
                # "vacation_information": {
                #     "cedula": body.get("cedula").upper(),
                #     "licencia_no_remunerada": body.get("licencia_no_remunerada").upper(),
                #     "dia_utilizados": "0",
                #     "fecha_salida_vacaciones": body.get("fecha_salida_vacaciones").upper(),
                #     "fecha_ingreso_vacaciones": body.get("fecha_ingreso_vacaciones".upper())
                # },
                "leave_information": {
                    "cedula": "cedula",
                    "fecha_retiro": "fecha_retiro",
                    "tipo_retiro": "tipo_retiro",
                    "motivo_retiro": "motivo_retiro",
                    "aplica_recontratacion": body.get("aplica_recontratacion"),
                    "estado": 1,
                },
            }
        except Exception as error:
            raise Exception(f"Campo no encontrado: %s", {error})
        return info_tables


# Load the xlsx file
df = pd.read_excel("massive_template 1.xlsx")

# Connect to the database
db_config = {
    "host": "172.16.0.115",
    "user": "StaffNetuser",
    "password": "qlVF3liVBswi$@4",
    "database": "staffnet",
}

try:
    connection = mysql.connector.connect(**db_config)
    if connection.is_connected():
        cursor = connection.cursor()

        # Insert the data into the database
        for index, row in df.iterrows():
            # print(row)
            info = bd_info()
            print(index)
            # print(row)
            # print(row.values)
            for table, columns in info.items():
                print(table)
                print(columns)
                # The name of the columns of the db and the columns of the xlsx file must be the same
                columns = list(columns.keys())
                print(columns)
                values = [clean_value(row.get(column)) for column in columns]
                print(values)
                cursor.execute(
                    f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join(['%s'] * len(columns))})",
                    values,
                )
                connection.commit()
except Error as e:
    print("Error while connecting to MySQL", e)
finally:
    #    if connection.is_connected():
    #        cursor.close()
    #        connection.close()
    print("MySQL connection is closed")
