def edit(body, conexion, cursor, table, fields, values):
    cursor.execute("UPDATE {} SET {} VALUES {}")
