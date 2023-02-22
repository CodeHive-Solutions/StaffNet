import jwt

secret_key = "no_hackear_por_favor"
# Generate token


def generate_token(username, consult, create, edit, disable, create_admins):
    payload = {"username": username, "consult": consult,
               "create": create, "edit": edit, "disable": disable, 'create_admins': create_admins}
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    return token

# Verify token


def verify_token(token, permission):
    try:
        # Decode the token using the secret key and HS256 algorithm
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        # Extract the user ID from the decoded payload
        permission = payload[permission]
        print(payload)
        if permission == 1:
            response = {'status': 'success', 'permission': permission}
            return response
        else:
            response = {'status': 'false', 'permission': permission}
            return response
    except jwt.exceptions.InvalidTokenError:
        # Return None if the token is invalid or cannot be decoded
        print("Error decoding token", jwt.exceptions.InvalidTokenError)
        response = {'status': 'false', 'permission': 'false'}
        return response
