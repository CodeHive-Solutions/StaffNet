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
        "employment_information": {
            "campana_general": "",
            "cargo": "",
        },
        "leave_information": {
            "estado": ""
        }
    },
    "sst": {
        "personal_information": {
            "cedula": "",
            "nombre": "",
            "tipo_documento": "",
            "fecha_nacimiento": "",
            "genero": "",
            "edad": "",
            "rh": "",
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
            "tel_contacto": "",
            "eps": "",
            "pension": "",
            "sede": "",
            "cargo": "",
            "gerencia": "",
            "campana_general": "",
            "area_negocio": "",
            "tipo_contrato": "",
            "aplica_teletrabajo": "",
            "fecha_aplica_teletrabajo": ""
        },
        "leave_information": {
            "estado": ""
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
            "aplica_recontratacion": "",
            "estado": ""
        }
    },
    "coordinador_falabella": {
        "personal_information":{
            "cedula": "",
            "nombre": "",
        },
        "employment_information": {
            "campana_general": "FALABELLA",
            "cargo": "",
            "fecha_ingreso": "",
        },
        "leave_information": {
            "fecha_retiro": "",
            "estado": ""
        }
    }
}

def get_rol_tables(search_rol):
    if search_rol in roles:
        return roles[search_rol]
    else:
        return None

def get_rol_columns(search_rol):
    roles = get_rol_tables(search_rol)
    column_roles = []
    if roles:
        for key, value in roles.items():
            for key2, value2 in value.items():
                column_roles.append(key2)
    else:
        column_roles = None
    return column_roles