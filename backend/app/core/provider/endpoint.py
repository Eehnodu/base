from fastapi import Depends, WebSocket
from app.core.provider.service import get_provider, get_provider_ws
from app.core.provider.service import ServiceProvider

def with_provider(func):
    """라우터에 Depends(get_provider)를 자동 주입하는 데코레이터"""
    async def wrapper(p: ServiceProvider = Depends(get_provider)):
        return await func(p)
    return wrapper


def with_provider_ws(func):
    """WebSocket 요청에 Depends(get_provider_ws)를 자동 주입하는 데코레이터"""
    async def wrapper(
        websocket: WebSocket,
        p: ServiceProvider = Depends(get_provider_ws),
    ):
        return await func(p, websocket)
    return wrapper