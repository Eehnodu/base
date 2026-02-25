# app/module/admin/admin.py
from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from app.core.database.base import now_kst, Base

class Admin(Base):
    __tablename__ = "tb_admins"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    admin_email = Column(String(100), unique=True, nullable=False)
    admin_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=now_kst)