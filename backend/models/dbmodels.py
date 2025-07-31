from models import db
from sqlalchemy.sql import func # type: ignore
from sqlalchemy.dialects.postgresql import UUID # type: ignore
import uuid


class UsersTable(db.Model):
    __tablename__ = 'users'

    id =  db.Column(UUID(as_uuid=True), primary_key=True,default=uuid.uuid4,nullable=False)
    email = db.Column(db.String(128), unique=True)
    firstName = db.Column(db.String(64), nullable=False)
    lastName = db.Column(db.String(64), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(255), nullable=True)
    
    expenses = db.relationship('Expenses', backref='user', lazy=True)

#after creating models i need to do flask db init flask db migrate flask db upgrade because im using flask-migrate


class Expenses(db.Model):
    __tablename__ = 'expenses'

    id = db.Column(UUID(as_uuid=True), primary_key=True,default=uuid.uuid4)
    name = db.Column(db.String(128), nullable=False)
    category = db.Column(db.String(128), nullable=False)
    cost = db.Column(db.Integer, nullable=False)

    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
