from enum import Enum
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, ForeignKey, Enum as SqlEnum
from sqlalchemy.orm import relationship
from app.core.database.base import now_kst, Base
from sqlalchemy.types import JSON

class RoleType(str, Enum):
    USER = "user"
    AI = "ai"

class DataTypeType(str, Enum):
    TEXT = "text"
    FILE = "file"

class MessageType(str, Enum):
    TEXT = "text"
    VOICE = "voice"

class LatencyType(str, Enum):
    STT = "stt"              # user 발화 STT 처리 시간
    TTS = "tts"    # ai 응답 생성(+필요하면 TTS 포함) 시간
    RESPONSE = "response"    # ai 응답 생성 시간

class EndedReasonType(str, Enum):
    NORMAL = "normal"
    TIMEOUT = "timeout"
    ERROR = "error"
    DISCONNECTED = "disconnected"

class Chatbot(Base):
    __tablename__ = "tb_chatbots"
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    greeting_message = Column(String(100), nullable=True)
    stt_model = Column(String(100), nullable=True)
    tts_model = Column(String(100), nullable=True)
    response_model = Column(String(100), nullable=True)
    realtime_model = Column(String(100), nullable=True)
    data_type = Column(SqlEnum(DataTypeType, name="data_type"), nullable=True)
    text_data = Column(Text, nullable=True)
    vector_store_id = Column(String(100), nullable=True)
    vector_file_ids = Column(JSON, nullable=True)
    vector_file_names = Column(JSON, nullable=True)
    fallback_type = Column(Boolean, nullable=True)
    fallback_text = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=now_kst)

class Logs(Base):
    __tablename__ = "tb_logs"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    session_id = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("tb_users.id"), nullable=True, index=True)
    stt_model = Column(String(100), nullable=True)
    tts_model = Column(String(100), nullable=True)
    response_model = Column(String(100), nullable=True)        # 텍스트 응답 모델
    realtime_model = Column(String(100), nullable=True)        # realtime 모델 썼다면
    ended_at = Column(DateTime, nullable=True)
    ended_reason = Column(SqlEnum(EndedReasonType, name="ended_reason_type"), nullable=True) 
    created_at = Column(DateTime, default=now_kst)

    user = relationship("User", back_populates="logs")
    messages = relationship("Messages", back_populates="logs", cascade="all, delete-orphan", lazy="joined")

class Messages(Base):
    __tablename__ = "tb_messages"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    log_id = Column(Integer, ForeignKey("tb_logs.id"), nullable=False, index=True)
    role = Column(SqlEnum(RoleType, name="role_type"), nullable=False)
    message_type = Column(SqlEnum(MessageType, name="message_type"), nullable=False) # text / voice
    tokens = Column(Integer, nullable=True) # 토큰 수
    latency_ms = Column(Integer, nullable=True) # 시간(ms)
    latency_type = Column(SqlEnum(LatencyType, name="latency_type"), nullable=True)   # stt / tts
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=now_kst)

    logs = relationship("Logs", back_populates="messages")
