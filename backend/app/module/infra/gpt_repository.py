from sqlalchemy import select, update, insert, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.module.infra.gpt import Logs, Messages, RoleType, MessageType, LatencyType, EndedReasonType, Chatbot
from app.core.database.base import now_kst, parse_date
from datetime import datetime, timedelta
from calendar import monthrange
from sqlalchemy import func, text
from typing import Dict, List, Optional
from app.module.user.user import User

class GptRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    # ===================================
    # API (Client)
    # ===================================
    # create_or_get_log
    async def create_or_get_log(self, user_id: int, session_id: str, stt_model: str | None = None, tts_model: str | None = None, response_model: str | None = None, realtime_model: str | None = None) -> Logs:
        result = await self.db.execute(
            select(Logs).where(Logs.session_id == session_id)
        )
        log = result.scalar_one_or_none()

        if not log:
            log = Logs(user_id=user_id, session_id=session_id, stt_model=stt_model, tts_model=tts_model, response_model=response_model, realtime_model=realtime_model)
            self.db.add(log)
            await self.db.commit()
            await self.db.refresh(log)

        return log

    # update_log
    async def update_log(self, session_id: str, ended_reason: EndedReasonType):
        await self.db.execute(
            update(Logs)
            .where(Logs.session_id == session_id)
            .values(
                ended_reason=ended_reason,
                ended_at=now_kst(),
            )
        )
        await self.db.commit()

    # create_message    
    async def create_message(self, log_id: int, role: RoleType, message: str, message_type: MessageType, latency_ms: int | None = None, latency_type: LatencyType | None = None, tokens: int | None = None):
        message = Messages(log_id=log_id, role=role, message=message, message_type=message_type, latency_ms=latency_ms, latency_type=latency_type, tokens=tokens)
        self.db.add(message)
        await self.db.commit()
        await self.db.refresh(message)
        return message

    # ===================================
    # API (Admin)
    # ===================================
    # get_admin_chatbot_list
    async def get_admin_chatbot_list(self) -> List[Chatbot]:
        result = await self.db.execute(
            select(Chatbot)
            .order_by(Chatbot.id.desc())
        )
        return result.scalars().all()

    # get_admin_chatbot_detail
    async def get_admin_chatbot_detail(self, chatbot_id: int) -> Chatbot:
        result = await self.db.execute(
            select(Chatbot).where(Chatbot.id == chatbot_id)
        )
        return result.scalar_one_or_none()

    # get_admin_logs_lists
    async def get_admin_logs_lists(
        self,
        page: int,
        page_size: int,
        category: Optional[str],
        search: Optional[str],
        start_date: Optional[str],
        end_date: Optional[str],
    ) -> dict:
        page = max(1, page)
        page_size = max(1, page_size)

        stmt = (
            select(Logs)
            .options(
                selectinload(Logs.messages),
                selectinload(Logs.user),
            )
        )

        if start_date:
            stmt = stmt.where(Logs.created_at >= parse_date(start_date))

        if end_date:
            stmt = stmt.where(Logs.created_at < parse_date(end_date) + timedelta(days=1))

        if category and search:
            keyword = f"%{search}%"
            if category == "user_name":
                stmt = stmt.join(User).where(User.name.ilike(keyword))
            elif category == "message":
                stmt = stmt.join(Messages).where(Messages.message.ilike(keyword))

        count_stmt = select(func.count(func.distinct(Logs.id))).select_from(stmt.subquery())
        total = (await self.db.execute(count_stmt)).scalar() or 0

        stmt = (
            stmt.order_by(Logs.id.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )

        result = await self.db.execute(stmt)
        logs = result.scalars().unique().all()

        data = []
        for log in logs:
            messages = log.messages or []
            data.append(
                {
                    "id": log.id,
                    "created_at": log.created_at.strftime("%Y-%m-%d %H:%M:%S") if log.created_at else None,
                    "ended_at": log.ended_at.strftime("%Y-%m-%d %H:%M:%S") if log.ended_at else None,
                    "user_name": getattr(getattr(log, "user", None), "user_name", None),
                    "messages": [
                        {
                            "role": m.role.value if m.role else None,
                            "message": m.message,
                            "created_at": m.created_at.strftime("%Y-%m-%d %H:%M:%S") if m.created_at else None,
                        }
                        for m in messages
                    ],
                    "total_tokens": sum((m.tokens or 0) for m in messages),
                }
            )

        return {
            "total": total,
            "data": data,
        }

    # save_chatbot_setting
    async def save_chatbot_setting(
        self,
        chatbot_id: int | None,
        name: str | None,
        description: str | None,
        greeting_message: str | None,
        response_model: str | None,
        data_type: str | None,
        text_data: str | None,
        fallback_type: bool | None,
        fallback_text: str | None,
        vector_store_id: str | None,
        vector_file_ids: list[str] | None,
        vector_file_names: list[str] | None,
    ):
        values = dict(
            name=name,
            description=description,
            greeting_message=greeting_message,
            response_model=response_model,
            data_type=data_type,
            text_data=text_data,
            fallback_type=fallback_type,
            fallback_text=fallback_text,
            vector_store_id=vector_store_id,
            vector_file_ids=vector_file_ids,
            vector_file_names=vector_file_names,
        )

        if not chatbot_id:
            await self.db.execute(
                insert(Chatbot).values(**values)
            )
            await self.db.commit()
            return

        await self.db.execute(
            update(Chatbot)
            .where(Chatbot.id == chatbot_id)
            .values(**values)
        )
        await self.db.commit()

    # delete_chatbot
    async def delete_chatbot(self, chatbot_id: int):
        await self.db.execute(
            delete(Chatbot)
            .where(Chatbot.id == chatbot_id)
        )
        await self.db.commit()