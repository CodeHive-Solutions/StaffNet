# import jwt
# import logging
# import datetime

# logging.basicConfig(filename=f"/var/www/StaffNet/logs/Registros_{datetime.datetime.now().year}.log",
#                     level=logging.INFO,
#                     format='%(asctime)s:%(levelname)s:%(message)s')

# secret_key = "no_hackear_por_favor"
# # Generate token


# def generate_token(json_payload):
#     token = jwt.encode(json_payload, secret_key, algorithm="HS256")
#     return token

# # Verify token


# def verify_token(token, dato):
#     """Verify if the token have the permissions and return true or false depending"""
#     try:
#         # Decode the token using the secret key and HS256 algorithm
#         payload = jwt.decode(token, secret_key, algorithms=["HS256"])

#         if dato in payload and payload[dato] != False:
#             return True
#         else:
#             return False
#     except jwt.exceptions.InvalidTokenError:
#         # Return None if the token is invalid or cannot be decoded
#         logging.error("Error decoding token", jwt.exceptions.InvalidTokenError)
#         print("Error decoding token", jwt.exceptions.InvalidTokenError)
#         return False


# def decrypt(token, dato):
#     """searches for a data in the token and returns the decoded data"""
#     try:
#         # Decode the token using the secret key and HS256 algorithm
#         payload = jwt.decode(token, secret_key, algorithms=["HS256"])

#         if dato in payload:
#             return payload[dato]
#         else:
#             return "Dato no encontrado en el token"
#     except jwt.exceptions.InvalidTokenError:
#         # Return None if the token is invalid or cannot be decoded
#         logging.error("Error decoding token", jwt.exceptions.InvalidTokenError)
#         print("Error decoding token", jwt.exceptions.InvalidTokenError)
#         return False

