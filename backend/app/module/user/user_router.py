from fastapi import APIRouter

from app.core.provider.endpoint import with_provider
from app.core.provider.login import with_login
from app.core.provider.service import ServiceProvider

router = APIRouter()

@router.get("/me")
@with_provider
@with_login()
async def get_me(p: ServiceProvider):
    return await p.user_service.get_me(p.request)
