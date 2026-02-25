from fastapi.param_functions import Body
from app.module.admin.admin_repository import AdminRepository
from app.module.infra.gpt_repository import GptRepository
from app.core.utils.response import success
import json
from openai import AsyncOpenAI
from app.core.config.settings import settings
from typing import List, Optional, Tuple
from io import BytesIO

client = AsyncOpenAI(api_key=settings.openai_api_key)

class AdminService:
    def __init__(self, admin_repo: AdminRepository, gpt_repo: GptRepository):
        self.admin_repo = admin_repo
        self.gpt_repo = gpt_repo

    # ===================================
    # helpers (create_vc, delete_vc, add_file, delete_file, dedupe_pair)
    # ===================================
    async def create_vc(self) -> str:
        vs = await client.vector_stores.create(name="quick_data_vc")
        return vs.id

    async def delete_vc(self, vc_id: str):
        await client.vector_stores.delete(vector_store_id=vc_id)
        return True

    async def add_file(self, vc_id, files):
        vc_file_ids = []
        vc_file_names = []
        for file in files:
            if hasattr(file, "read"):
                file_name = file.filename
                file_content = await file.read()
            else:
                continue

            created = await client.files.create(
                file=(file_name, BytesIO(file_content)),
                purpose="assistants",
            )

            vc_file_ids.append(created.id)
            vc_file_names.append(file_name)

        if vc_file_ids:
            await client.vector_stores.file_batches.create_and_poll(
                vector_store_id=vc_id,
                file_ids=vc_file_ids,
            )
        return vc_file_ids, vc_file_names

    async def delete_file(self, vc_id: str, file_ids: list[str]):
        for fid in file_ids:
            try:
                await client.vector_stores.files.delete(
                    vector_store_id=vc_id,
                    file_id=fid,
                )
            except Exception as e:
                print(f"[unlink warn] vc={vc_id}, file={fid}, err={e}")

        for fid in file_ids:
            try:
                await client.files.delete(fid)
            except Exception as e:
                print(f"[files.delete warn] file={fid}, err={e}")

        return True

    async def dedupe_pair(
        self,
        ids: List[str],
        names: List[Optional[str]],
    ) -> Tuple[List[str], List[Optional[str]]]:
        seen = set()
        out_ids, out_names = [], []
        for i, fid in enumerate(ids):
            if fid and fid not in seen:
                seen.add(fid)
                out_ids.append(fid)
                out_names.append(names[i] if i < len(names) else None)
        return out_ids, out_names

    # ===================================
    # API
    # ===================================

    async def get_admin_by_id(self, admin_id: int):
        return await self.admin_repo.get_admin_by_id(admin_id)

    async def get_admin_chatbot_list(self):
        chatbot_list = await self.gpt_repo.get_admin_chatbot_list()
        return success([{"id": chatbot.id, "name": chatbot.name} for chatbot in chatbot_list])

    async def get_admin_chatbot_detail(self, request):
        qp = request.query_params
        chatbot_id = int(qp.get("chatbot_id"))
        chatbot_detail = await self.gpt_repo.get_admin_chatbot_detail(chatbot_id)
        dict_chatbot_detail = {
            "id": chatbot_detail.id,
            "name": chatbot_detail.name,
            "description": chatbot_detail.description,
            "greeting_message": chatbot_detail.greeting_message,
            "response_model": chatbot_detail.response_model,
            "data_type": chatbot_detail.data_type,
            "text_data": chatbot_detail.text_data,
            "vector_store_id": chatbot_detail.vector_store_id,
            "vector_file_ids": chatbot_detail.vector_file_ids,
            "vector_file_names": chatbot_detail.vector_file_names,
            "fallback_type": chatbot_detail.fallback_type,
            "fallback_text": chatbot_detail.fallback_text,
        }
        return success(dict_chatbot_detail)

    async def get_admin_logs_lists(self, request):
        qp = request.query_params
        page = int(qp.get("page", 1))
        page_size = int(qp.get("page_size", 10))
        category = qp.get("category")
        search = qp.get("search")
        start_date = qp.get("start_date")
        end_date = qp.get("end_date")

        logs = await self.gpt_repo.get_admin_logs_lists(
            page=page,
            page_size=page_size,
            category=category,
            search=search,
            start_date=start_date,
            end_date=end_date,
        )

        return success(logs)
        
    async def save_chatbot_setting(self, request):
        form = await request.form()
        payload_raw = form.get("payload")
        payload = json.loads(payload_raw) if payload_raw else {}
        removed_raw = form.get("removed_remote_ids") or "[]"
        try:
            removed_remote_ids = json.loads(removed_raw)
        except Exception:
            removed_remote_ids = []

        files = form.getlist("files")

        chatbot_id = payload.get("id")
        name = payload.get("name")
        description = payload.get("description")
        greeting_message = payload.get("greeting_message")
        response_model = payload.get("response_model")
        data_type = payload.get("data_type")
        text_data = payload.get("text_data")
        fallback_type = payload.get("fallback_type")
        fallback_text = payload.get("fallback_text")

        vector_store_id = None
        vector_file_ids = None
        vector_file_names = None

        chatbot = None
        if chatbot_id:
            chatbot = await self.gpt_repo.get_admin_chatbot_detail(chatbot_id)

        # ===== TEXT =====
        if data_type == "text":
            if chatbot and chatbot.vector_store_id:
                if chatbot.vector_file_ids:
                    await self.delete_file(chatbot.vector_store_id, chatbot.vector_file_ids)
                await self.delete_vc(chatbot.vector_store_id)

            text_data = text_data or ""
            vector_store_id = None
            vector_file_ids = None
            vector_file_names = None

        # ===== FILE =====
        elif data_type == "file":
            text_data = ""
            if chatbot and chatbot.vector_store_id:
                vector_store_id = chatbot.vector_store_id
                keep_ids = list(chatbot.vector_file_ids or [])
                keep_names = list(chatbot.vector_file_names or [])
                print("removed_remote_ids:", removed_remote_ids)
                print("keep_ids:", keep_ids)
            else:
                vector_store_id = await self.create_vc()
                keep_ids = []
                keep_names = []
            if removed_remote_ids:
                await self.delete_file(vector_store_id, removed_remote_ids)
                next_keep_ids = []
                next_keep_names = []
                for i, fid in enumerate(keep_ids):
                    if fid in removed_remote_ids:
                        continue
                    next_keep_ids.append(fid)
                    next_keep_names.append(keep_names[i] if i < len(keep_names) else None)
                keep_ids, keep_names = next_keep_ids, next_keep_names

            new_ids, new_names = ([], [])
            if files:
                new_ids, new_names = await self.add_file(vector_store_id, files)

            merged_ids = keep_ids + (new_ids or [])
            merged_names = keep_names + (new_names or [])

            merged_ids, merged_names = await self.dedupe_pair(merged_ids, merged_names)

            vector_file_ids = merged_ids
            vector_file_names = merged_names

        else:
            data_type = "text"
            text_data = text_data or ""
            vector_store_id = None
            vector_file_ids = None
            vector_file_names = None

        await self.gpt_repo.save_chatbot_setting(
            chatbot_id=chatbot_id,
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

        return success("success")

    async def delete_chatbot(self, request):
        body = await request.json()
        chatbot_id = body.get("id")
        chatbot = await self.gpt_repo.get_admin_chatbot_detail(chatbot_id)
        if chatbot:
            if chatbot.vector_store_id:
                await self.delete_file(chatbot.vector_store_id, chatbot.vector_file_ids)
                await self.delete_vc(chatbot.vector_store_id)
        await self.gpt_repo.delete_chatbot(chatbot_id)
        return success("success")