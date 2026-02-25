# app/module/__init__.py
from fastapi import FastAPI
# --- 모델 등록 (SQLAlchemy 관계 인식용) ---
from app.module.user.user import User
from app.module.infra.gpt import Logs, Messages
# --- 라우터 등록 함수 ---
from app.module.auth import auth_router
from app.module.admin import admin_router
from app.module.user import user_router
from app.module.infra import gpt_router
from app.module.ws import ws_router

def register_routers(app: FastAPI):
    """모든 도메인 라우터를 FastAPI 인스턴스에 등록"""
    app.include_router(auth_router.router, prefix="/api/auth")
    app.include_router(admin_router.router, prefix="/api/admin")
    app.include_router(user_router.router, prefix="/api/user")
    app.include_router(gpt_router.router, prefix="/api/gpt")
    app.include_router(ws_router.router, prefix="/api/ws")