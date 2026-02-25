from sqlalchemy import Boolean, Column, DateTime, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database.base import now_kst, Base

class User(Base):
    __tablename__ = "tb_users"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_email = Column(String(100), unique=True, nullable=False)
    user_password = Column(String(255), nullable=True)
    user_name = Column(String(20), nullable=False)
    user_profile_image = Column(String(200), nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=now_kst)
    last_login_at = Column(DateTime(timezone=True))

    devices = relationship("UserDevice", back_populates="user", lazy="selectin")
    logs = relationship("Logs", back_populates="user")

# 기기 정보 저장
class UserDevice(Base):
    __tablename__ = "tb_user_devices"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    device_info = Column(String(255), nullable=True)
    fcm_token = Column(String(255), nullable=True)
    active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=now_kst)

    user_id = Column(Integer, ForeignKey("tb_users.id", ondelete="CASCADE"), nullable=False)
    user = relationship("User", back_populates="devices")