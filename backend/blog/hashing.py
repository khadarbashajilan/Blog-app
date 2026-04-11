from pwdlib import PasswordHash

class Hash:
    # Initialize the handler once (using bcrypt as the backend)
    # This automatically handles salting and complex configurations
    _password_hash = PasswordHash.recommended()

    @staticmethod
    def bcrypt(password: str) -> str:
        """Hash a password string and return the hash string."""
        # pwdlib handles .encode() and .decode() internally
        return Hash._password_hash.hash(password)

    @staticmethod
    def verify(plain_password: str, hashed_password: str) -> bool:
        """Verify a plain password against a stored hash."""
        return Hash._password_hash.verify(plain_password, hashed_password)
    