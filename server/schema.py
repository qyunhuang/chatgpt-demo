from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa
from dataclasses import dataclass

db = SQLAlchemy()

@dataclass
class User(db.Model):
    
    __tablename__ = 'user'
    id: int = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    name: str = sa.Column(sa.String(20), nullable=False)