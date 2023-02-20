import requests


def create_session(user, permissions):
    session = requests.Session()
    session.user = user
    session.consult = permissions[1]
    session.create = permissions[2]
    session.edit = permissions[3]
    session.disable = permissions[4]
    return session
