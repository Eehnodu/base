# app/core/provider/service.py

from fastapi import Depends, Request, WebSocket
from typing import Union
from typing import Optional
from app.core.database.base import get_session

# repo & service import는 나중에
# -> 순환 참조 방지를 위해 내부에서 import
class ServiceProvider:
    def __init__(self, conn: Union[Request, WebSocket], db):
        self.conn = conn
        self.db = db
        self.request: Optional[Request] = conn if isinstance(conn, Request) else None
        self.websocket: Optional[WebSocket] = conn if isinstance(conn, WebSocket) else None
        self._user_repo = None
        self._admin_repo = None
        self._gpt_repo = None
        self._user_service = None
        self._auth_service = None
        self._admin_service = None
        self._gpt_service = None
        self._kakao_service = None
        self._google_service = None
        self._native_service = None
        self._ws_service = None

    @property
    def user_repo(self):
        if not self._user_repo:
            from app.module.user.user_repository import UserRepository
            self._user_repo = UserRepository(self.db)
        return self._user_repo

    @property
    def admin_repo(self):
        if not self._admin_repo:
            from app.module.admin.admin_repository import AdminRepository
            self._admin_repo = AdminRepository(self.db)
        return self._admin_repo

    @property
    def gpt_repo(self):
        if not self._gpt_repo:
            from app.module.infra.gpt_repository import GptRepository
            self._gpt_repo = GptRepository(self.db)
        return self._gpt_repo

    @property
    def user_service(self):
        if not self._user_service:
            from app.module.user.user_service import UserService
            self._user_service = UserService(self.user_repo)
        return self._user_service

    @property
    def admin_service(self):
        if not self._admin_service:
            from app.module.admin.admin_service import AdminService
            self._admin_service = AdminService(self.admin_repo, self.gpt_repo)
        return self._admin_service

    @property
    def auth_service(self):
        if not self._auth_service:
            from app.module.auth.auth_service import AuthService
            self._auth_service = AuthService(self.user_repo, self.admin_repo)
        return self._auth_service
    
    @property
    def google_service(self):
        if not self._google_service:
            from app.module.infra.google.google_service import GoogleService
            self._google_service = GoogleService(self.user_repo)
        return self._google_service
    
    @property
    def kakao_service(self):
        if not self._kakao_service:
            from app.module.infra.kakao.kakao_service import KakaoService
            self._kakao_service = KakaoService(self.user_repo)
        return self._kakao_service

    @property
    def gpt_service(self):
        if not self._gpt_service:
            from app.module.infra.gpt_service import GPTService
            self._gpt_service = GPTService(self.gpt_repo)
        return self._gpt_service

    @property
    def ws_service(self):
        if not self._ws_service:
            from app.module.ws.ws_service import WsService
            self._ws_service = WsService(self.gpt_service)
        return self._ws_service

    @property
    def native_service(self):
        if not self._native_service:
            from app.module.native.native_service import NativeService
            self._native_service = NativeService(self.user_repo)
        return self._native_service

async def get_provider(
    request: Request,
    db=Depends(get_session),
):
    return ServiceProvider(request, db)

async def get_provider_ws(
    websocket: WebSocket,
    db=Depends(get_session),
):
    return ServiceProvider(websocket, db)