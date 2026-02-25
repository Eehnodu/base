from functools import wraps
from fastapi import HTTPException, WebSocket

from app.module.auth.auth_token import AuthToken


def with_login(type: str = "user"):
    """
    로그인 필수 (기본: user)
    admin API에서는 with_login("admin") 사용
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(p, *args, **kwargs):
            token_util = AuthToken()
            try:
                user_id, auth_type = await token_util.get_token_info(
                    p.request,
                    type,
                )
                p.request.user_id = user_id
                p.request.auth_type = auth_type
            except HTTPException as e:
                raise e
            return await func(p, *args, **kwargs)
        return wrapper
    return decorator

def with_login_ws(type: str = "user"):
    """
    WebSocket용 로그인 필수 (기본: user)
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(p, websocket: WebSocket, *args, **kwargs):
            token_util = AuthToken()
            try:
                user_id, auth_type = await token_util.get_token_info_ws(
                    websocket,
                    type,
                )
                websocket.user_id = user_id
                websocket.auth_type = auth_type
            except HTTPException as e:
                raise e
            return await func(p, websocket, *args, **kwargs)
        return wrapper
    return decorator