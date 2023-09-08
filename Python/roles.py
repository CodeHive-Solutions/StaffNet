import datetime
import logging

logging.basicConfig(filename=f"/var/www/StaffNet/logs/Registros_{datetime.datetime.now().year}.log",
                    level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')

def get_rol(search_rol):
    roles = {
    "formacion": {
        "personal_information": {
            "cedula": "",
            "nombre": "",
            "tipo_documento": "",
            "fecha_nacimiento": "",
            "lugar_expedicion": "",
            "fecha_expedicion": "",
            "genero": "",
            "rh": "",
            "estado_civil": "",
            "hijos": "",
            "tel_fijo": "",
            "celular": "",
            "correo": "",
            "correo_corporativo": "",
            "direccion": "",
            "barrio": "",
            "localidad": "",
            "contacto_emergencia": "",
            "parentesco": "",
            "tel_contacto": ""
        },
        "educational_information": {
            "nivel_escolaridad": "",
            "profesion": "",
            "estudios_en_curso": ""
        },
        "employment_information": {
            "sede": "",
            "cargo": "",
            "gerencia": "",
            "campana_general": "",
            "area_negocio": "",
            "tipo_contrato": "",
            "fecha_ingreso": "",
            "aplica_teletrabajo": "",
            "fecha_aplica_teletrabajo": "",
        },
        "leave_information": {
            "fecha_retiro": "",
            "tipo_retiro": "",
            "motivo_retiro": "",
            "estado": ""
        }
    },
    "seleccion" : {
            "personal_information": {
            "cedula": "",
            "nombre": "",
            "tipo_documento": "",
            "fecha_nacimiento": "",
            "lugar_expedicion": "",
            "fecha_expedicion": "",
            "genero": "",
            "estado_civil": "",
            "tel_fijo": "",
            "celular": "",
            "correo": "",
            "correo_corporativo": "",
            "direccion": "",
            "contacto_emergencia": "",
            "parentesco": "",
            "tel_contacto": ""
        },
    "sst": {
        "personal_information": {
            "cedula": "lady.miranda",
            "nombre": "lady.miranda",
            "tipo_documento": "lady.miranda",
            "fecha_nacimiento": "lady.miranda",
            "genero": "lady.miranda",
            "edad": "lady.miranda",
            "rh": "lady.miranda",
            "hijos": "lady.miranda",
            "tel_fijo": "lady.miranda",
            "celular": "lady.miranda",
            "correo": "lady.miranda",
            "correo_corporativo": "lady.miranda",
            "direccion": "lady.miranda",
            "barrio": "lady.miranda",
            "localidad": "lady.miranda",
            "contacto_emergencia": "lady.miranda",
            "parentesco": "lady.miranda",
            "tel_contacto": "lady.miranda",
            "eps": "lady.miranda",
            "pension": "lady.miranda",
            "sede": "lady.miranda",
            "cargo": "lady.miranda",
            "gerencia": "lady.miranda",
            "campana_general": "lady.miranda",
            "area_negocio": "lady.miranda",
            "tipo_contrato": "lady.miranda",
            "aplica_teletrabajo": "lady.miranda",
            "fecha_aplica_teletrabajo": "lady.miranda"
        }
    },
    "gestion":{
        "personal_information": {
            "cedula": "",
            "nombre": "",
            "tipo_documento": "",
            "fecha_nacimiento": "",
            "lugar_expedicion": "",
            "fecha_expedicion": "",
            "genero": "",
            "rh": "",
            "estado_civil": "",
            "hijos": "",
            "personas_a_cargo": "",
            "estrato": "",
            "tel_fijo": "",
            "celular": "",
            "correo": "",
            "correo_corporativo": "",
            "direccion": "",
            "barrio": "",
            "localidad": "",
            "contacto_emergencia": "",
            "parentesco": "",
            "tel_contacto": ""
        },
        "educational_information": {
            "nivel_escolaridad": "",
            "profesion": "",
            "estudios_en_curso": ""
        },
        "employment_information": {
            "fecha_afiliacion_eps": "",
            "eps": "",
            "cambio_eps_legado": "",
            "pension": "",
            "caja_compensacion": "",
            "cesantias": "",
            "cuenta_nomina": "",
            "sede": "",
            "cargo": "",
            "fecha_nombramiento": "",
            "fecha_nombramiento_legado": "",
            "gerencia": "",
            "campana_general": "",
            "area_negocio": "",
            "tipo_contrato": "",
            "fecha_ingreso": "",
            "salario": "",
            "subsidio_transporte": "",
            "cambio_campaña_legado": "",
            "aplica_teletrabajo": "",
            "fecha_aplica_teletrabajo": "",
            "observaciones": ""
        },
        "leave_information": {
            "fecha_retiro": "",
            "tipo_retiro": "",
            "motivo_retiro": "",
            "estado": ""
        }
    }
}
}
    if search_rol in roles:
        return roles[search_rol]
    else:
        return None

rol = get_rol("seleccion")
if rol:
    print(list(rol.items()))