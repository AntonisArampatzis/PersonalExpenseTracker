from flask_sqlalchemy import SQLAlchemy # type: ignore

# Initialize SQLAlchemy
db = SQLAlchemy()

# Import models to register them with SQLAlchemy
from .dbmodels import UsersTable,Expenses