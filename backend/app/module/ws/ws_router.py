from fastapi import APIRouter, WebSocket
from app.core.provider.endpoint import with_provider_ws
from app.core.provider.login import with_login_ws
from app.core.provider.service import ServiceProvider

router = APIRouter()

@router.websocket("/")
@with_provider_ws
@with_login_ws
async def stt_ws(p: ServiceProvider, websocket: WebSocket):
    await p.ws_service.init_state(websocket)
