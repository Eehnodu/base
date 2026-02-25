from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.module.admin.admin import Admin
from app.module.infra.gpt import Chatbot

class AdminRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_admin_by_id(self, id: int) -> Admin | None:
        result = await self.db.execute(select(Admin).where(Admin.id == id))
        return result.scalar_one_or_none()

    async def get_admin_by_email(self, admin_email: str) -> Admin | None:
        result = await self.db.execute(select(Admin).where(Admin.admin_email == admin_email))
        return result.scalar_one_or_none()