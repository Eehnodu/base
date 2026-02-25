# app/module/auth/auth_service.py

from passlib.context import CryptContext

from app.module.user.user_repository import UserRepository
from app.module.admin.admin_repository import AdminRepository
from app.module.auth.auth_token import AuthToken
from app.core.utils.response import fail

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

class AuthService:
    def __init__(self, user_repo: UserRepository, admin_repo: AdminRepository):
        self.user_repo = user_repo
        self.admin_repo = admin_repo
        self.token_util = AuthToken()

    async def signup(self, request):
        body = await request.json()
        nickname = body.get("nickname")
        user_id = body.get("userId")
        password = body.get("password")
        
        original = await self.user_repo.get_user_by_id(user_id)
        if original:
            fail("user already exists", "USER_ALREADY_EXISTS", 400)
        else:
            hashed_password = hash_password(password)
            await self.user_repo.create_user(nickname, user_id, hashed_password)

    async def login(self, request):
        body = await request.json()
        email = body.get("email")
        password = body.get("password")
        type = body.get("type")

        if type == "user":
            user_obj = await self.user_repo.get_user_by_id(email)
        elif type == "admin":
            user_obj = await self.admin_repo.get_admin_by_email(email)
        else:
            fail("invalid type", "INVALID_TYPE", 400)
        if not user_obj or not verify_password(password, user_obj.admin_password if type == "admin" else user_obj.user_password):
            fail("user does not exists", "USER_DOES_NOT_EXISTS", 404)

        return user_obj, type

    async def get_user_by_id(self, user_id: int):
        return await self.user_repo.get_user_by_id(user_id)

    async def get_admin_by_id(self, admin_id: int):
        return await self.admin_repo.get_admin_by_id(admin_id)