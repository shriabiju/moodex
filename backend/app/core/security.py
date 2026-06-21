from datetime import datetime, timedelta, timezone
import bcrypt
from jose import JWTError, jwt
from app.core.config import settings

# passlib's CryptContext is no longer used here: passlib is unmaintained and
# its internal self-test routine breaks under bcrypt>=4.1 (raises
# "password cannot be longer than 72 bytes" even on short passwords, because
# the self-test itself uses a long probe string). Calling bcrypt directly
# avoids that landmine entirely and removes a dependency.


def _truncate_to_bcrypt_limit(password: str) -> bytes:
    """bcrypt only uses the first 72 bytes of input — truncate safely on a byte boundary."""
    return password.encode("utf-8")[:72]


def hash_password(password: str) -> str:
    hashed = bcrypt.hashpw(_truncate_to_bcrypt_limit(password), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        _truncate_to_bcrypt_limit(plain_password), hashed_password.encode("utf-8")
    )


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None