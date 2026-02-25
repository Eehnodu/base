from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.core.provider.endpoint import with_provider
from app.core.provider.login import with_login
from app.core.provider.service import ServiceProvider

router = APIRouter()

@router.get("/chatbot/list")
@with_provider
@with_login("admin")
async def get_admin_chatbot_list(p: ServiceProvider):
    return await p.admin_service.get_admin_chatbot_list()

@router.get("/chatbot/detail")
@with_provider
@with_login("admin")
async def get_admin_chatbot_detail(p: ServiceProvider):
    return await p.admin_service.get_admin_chatbot_detail(p.request)

@router.get("/logs/lists")
@with_provider
@with_login("admin")
async def get_admin_logs_lists(p: ServiceProvider):
    return await p.admin_service.get_admin_logs_lists(p.request)

@router.post("/chatbot/save")
@with_provider
@with_login("admin")
async def save_chatbot_setting(p: ServiceProvider):
    return await p.admin_service.save_chatbot_setting(p.request)

@router.post("/chatbot/delete")
@with_provider
@with_login("admin")
async def delete_chatbot(p: ServiceProvider):
    return await p.admin_service.delete_chatbot(p.request)