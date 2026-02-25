from fastapi import APIRouter

from app.core.provider.endpoint import with_provider
from app.core.provider.login import with_login
from app.core.provider.service import ServiceProvider
from app.core.utils.response import success
router = APIRouter()

# 사용 빈도수? 월간 주간 일간
@router.get("/usage")
@with_provider
@with_login("admin")
async def get_gpt_usage(p: ServiceProvider):
    return await p.gpt_service.get_gpt_usage(p.request)