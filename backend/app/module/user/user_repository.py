# app/module/user/user_repository.py

import os

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database.base import now_kst
from app.module.user.user import User, UserDevice

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_id(self, user_id: int):
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_user_by_user_id(self, user_id: str):
        result = await self.db.execute(
            select(User).where(User.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def create_user(self, nickname, user_id, hashed_password):
        user = User(
            user_id=user_id,
            user_name=nickname,
            user_password=hashed_password,
            last_login_at=now_kst()
        )

        self.db.add(user)
        await self.db.commit()

    async def get_or_create_user(self, email: str, name: str, picture: str) -> User | None:
        result = await self.db.execute(select(User).filter(User.user_email == email))
        user = result.unique().scalar_one_or_none()

        if user:
            user.last_login_at=now_kst()
        else:
            user = User(
                user_email=email,
                user_name=name,
                user_profile_image=picture,
                created_at=now_kst(),
                last_login_at=now_kst()
            )

            self.db.add(user)
        
        await self.db.commit()
        await self.db.refresh(user)

        return user
    
    async def save_user_device(self, user_id: int, device_info: str, fcm_token: str) -> None:
        result = await self.db.execute(
            select(UserDevice).where(
                UserDevice.user_id==user_id, 
                UserDevice.device_info == device_info
            )
        )
        device = result.scalar_one_or_none()

        if device:
            device.fcm_token = fcm_token
            device.updated_at = now_kst()
            device.active = True
        else:
            device = UserDevice(
                user_id=user_id, 
                device_info=device_info,
                fcm_token=fcm_token
            )
            self.db.add(device)

        await self.db.commit()
        await self.db.refresh(device)

    async def native_logout(self, user_id, device_info):
        result = await self.db.execute(
            select(UserDevice).where(
                UserDevice.user_id==user_id, 
                UserDevice.device_info == device_info
            )
        )
        device = result.scalar_one_or_none()
        device.active = False

        await self.db.commit()
