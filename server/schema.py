from datetime import datetime
from xmlrpc.client import boolean
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from dataclasses import dataclass

db = SQLAlchemy()

@dataclass
class User(db.Model):
    
    __tablename__ = 'user'
    
    id: int = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    name: str = sa.Column(sa.String(20), nullable=False)
    password: str = sa.Column(sa.String(20), nullable=False)
 
   
@dataclass     
class Session(db.Model):
    
    __tablename__ = 'session'
    __allow_unmapped__ = True
    
    id: int = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    user_id: int = sa.Column(sa.Integer, ForeignKey('user.id'), nullable=False)
    name: str = sa.Column(sa.String(20), nullable=False)
    created_at: datetime = sa.Column(sa.DateTime, nullable=False, default=datetime.now)
    user: User = relationship('User', backref='sessions') 
    
    
@dataclass
class Message(db.Model):
    
    __tablename__ = 'message'
    __allow_unmapped__ = True
    
    id: int = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    session_id: int = sa.Column(sa.Integer, ForeignKey('session.id'), nullable=False)
    content: str = sa.Column(sa.Text, nullable=False)
    question: boolean = sa.Column(sa.Boolean, nullable=False)
    created_at: datetime = sa.Column(sa.DateTime, nullable=False, default=datetime.now)
    session: Session = relationship('Session', backref='messages')
