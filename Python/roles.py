roles = {
    "formacion": {
        "personal_information": {
            "cedula": "",
            "nombre": "",
            "tipo_documento": "",
            "fecha_nacimiento": "",
            "genero": "",
            "celular": "",
            "correo": "",
            "correo_corporativo": "",
        },
        "educational_information": {
            "nivel_escolaridad": "",
            "profesion": "",
            "estudios_en_curso": "",
        },
        "employment_information": {
            "sede": "",
            "cargo": "",
            "gerencia": "",
            "campana_general": "",
            "area_negocio": "",
            "fecha_ingreso": "",
            "aplica_teletrabajo": "",
            "fecha_aplica_teletrabajo": "",
        },
        "leave_information": {
            "fecha_retiro": "",
            "tipo_retiro": "",
            "motivo_retiro": "",
            "estado": "",
        },
    },
    "seleccion": {
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
            "tel_contacto": "",
        },
        "employment_information": {
            "campana_general": "",
            "cargo": "",
        },
        "leave_information": {"estado": ""},
    },
    "sst": {
        "personal_information": {
            "cedula": "",
            "nombre": "",
            "tipo_documento": "",
            "fecha_nacimiento": "",
            "genero": "",
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
        },
        "leave_information": {"estado": ""},
        "employment_information": {
            "eps": "",
            "pension": "",
            "fecha_ingreso": "",
            "sede": "",
            "cargo": "",
            "gerencia": "",
            "campana_general": "",
            "area_negocio": "",
            "tipo_contrato": "",
            "aplica_teletrabajo": "",
            "fecha_aplica_teletrabajo": "",
        },
    },
    "gestion": {
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
            "tel_contacto": "",
        },
        "educational_information": {
            "nivel_escolaridad": "",
            "profesion": "",
            "estudios_en_curso": "",
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
            "observaciones": "",
        },
        "leave_information": {
            "fecha_retiro": "",
            "tipo_retiro": "",
            "motivo_retiro": "",
            "aplica_recontratacion": "",
            "estado": "",
        },
    },
    "coordinador_falabella": {
        "personal_information": {
            "cedula": "",
            "nombre": "",
        },
        "employment_information": {
            "campana_general": ["BANCO FALABELLA"],
            "cargo": "",
            "fecha_ingreso": "",
        },
        "leave_information": {"fecha_retiro": "", "estado": ""},
    },
    "gerente_comercial": {
        "personal_information": {
            "cedula": "",
            "nombre": "",
            "genero": "",
            "fecha_nacimiento": "",
        },
        "employment_information": {
            "cargo": "",
            "campana_general": ["SURA", "COOMEVA", "METLIFE", "LIBERTY"],
            "fecha_ingreso": "",
        },
        "leave_information": {"fecha_retiro": "", "estado": ""},
    },
    "gerente_operaciones": {
        "personal_information": {
            "cedula": "",
            "nombre": "",
            "genero": "",
            "fecha_nacimiento": "",
        },
        "employment_information": {
            "cargo": "",
            "campana_general": [
                "BANCO FALABELLA",
                "PAY-U",
                "MI BANCO",
                "CREDIBANCO",
                "YANBAL",
                "BBVA",
                "AZTECA",
                "CLARO",
                "BANCO AGRARIO",
                "BANCO PICHINCHA",
                "CODENSA",
                "NUEVA EPS",
                "SCOTIABANK COLPATRIA",
            ],
            "fecha_ingreso": "",
        },
        "leave_information": {"fecha_retiro": "", "estado": ""},
    },
    "BI": {
        "personal_information": {
            "cedula": "",
            "nombre": "",
        },
        "employment_information": {
            "cargo": "",
            "campana_general": ["BI"],
            "fecha_ingreso": "",
        },
        "leave_information": {"fecha_retiro": "", "tipo_retiro":"","motivo_retiro":"","estado": ""},
    },
}


def get_rol_tables(search_rol):
    """Return a dictionary with the tables of the rol"""
    if search_rol in roles:
        return roles[search_rol]
    else:
        return None


def get_rol_columns(search_rol):
    """Return a list with the columns of the rol"""
    existing_roles = get_rol_tables(search_rol)
    column_roles = []
    if existing_roles:
        for _, value in existing_roles.items():
            for key2, _ in value.items():
                column_roles.append(key2)
    else:
        column_roles = None
    return column_roles
