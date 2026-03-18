# app/module/user/user_service.py
from app.module.user.user_repository import UserRepository
from app.core.logging import get_logger

logger = get_logger(__name__)

class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    async def get_me(self, request):
        user_id = request.user_id
        logger.info(f"get_me: user_id={user_id}")
        return await self.repo.get_user_by_id(user_id)