from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request

def get_user_or_ip(request: Request):
    """
    Returns the user's ID if authenticated, falling back to IP address.
    Firebase auth dependency must attach the user to request.state.user.
    """
    if hasattr(request.state, "user") and request.state.user:
        return str(request.state.user.id)
    return get_remote_address(request)

limiter = Limiter(key_func=get_user_or_ip)
