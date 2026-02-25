# app/module/auth/auth_router.py

from fastapi import APIRouter, HTTPException
from app.core.utils.response import success

from app.core.provider.endpoint import with_provider
from app.core.provider.login import with_login
from app.core.provider.service import ServiceProvider
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/login")
@with_provider
async def login(p: ServiceProvider):
    user, auth_type = await p.auth_service.login(p.request)
    response = success(message="user login successful")
    await p.auth_service.token_util.create_jwt_token(user, response, auth_type)
    return response

@router.post("/logout")
@with_provider
@with_login()
async def logout(p:ServiceProvider):
    auth_type = p.request.auth_type
    response = success(message="user logout successful")
    await p.auth_service.token_util.delete_token(response, auth_type)
    return response

@router.post("/logout_admin")
@with_provider
@with_login("admin")
async def logout_admin(p: ServiceProvider):
    auth_type = p.request.auth_type
    response = success(message="admin logout successful")
    await p.auth_service.token_util.delete_token(response, auth_type)
    return response

# TODO: NATIVE
@router.post("/native_logout")
@with_provider
@with_login()
async def native_logout(p:ServiceProvider):
    response = success(message="user logout successful")
    await p.auth_service.native_logout(p.request)
    return response

@router.post("/refresh_token")
@with_provider
async def refresh_token(p: ServiceProvider):
    id, _ = await p.auth_service.token_util.verify_refresh_by_type(p.request, "user")
    user = await p.auth_service.get_user_by_id(id)
    if not user:
        raise HTTPException(status_code=404, detail="user not found")

    response = success(message="user login successful")
    await p.auth_service.token_util.create_jwt_token(user, response, "user")
    return response

@router.post("/refresh_token_admin")
@with_provider
async def refresh_token_admin(p: ServiceProvider):
    id, _ = await p.auth_service.token_util.verify_refresh_by_type(p.request, "admin")
    admin = await p.admin_service.get_admin_by_id(id)
    if not admin:
        raise HTTPException(status_code=404, detail="admin not found")
    response = success(message="admin login successful")
    await p.auth_service.token_util.create_jwt_token(admin, response, "admin")
    return response