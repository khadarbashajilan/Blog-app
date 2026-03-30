import bcrypt  # Import the bcrypt library for password hashing

class Hash:
    @staticmethod
    def bcrypt(password: str):  # Method to hash a password using bcrypt
        # Convert string to bytes, then hash
        pwd_bytes = password.encode('utf-8')  # Convert the password string to bytes
        salt = bcrypt.gensalt()  # Generate a random salt
        hashed_password = bcrypt.hashpw(pwd_bytes, salt)  # Hash the password with the salt
        return hashed_password.decode('utf-8')  # Return the hashed password as a string

    @staticmethod
    def verify(hashed_password: str, plain_password: str):  # Method to verify a password against a hash
        # Check if the plain password matches the hash
        password_byte_enc = plain_password.encode('utf-8')  # Convert the plain password to bytes
        hashed_byte_enc = hashed_password.encode('utf-8')  # Convert the hashed password to bytes
        return bcrypt.checkpw(password_byte_enc, hashed_byte_enc)  # Check if the plain password matches the hash
    
    