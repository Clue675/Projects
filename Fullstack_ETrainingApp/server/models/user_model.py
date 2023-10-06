# user_model.py
from flask_sqlalchemy import SQLAlchemy
from passlib.hash import pbkdf2_sha256

# Initialize SQLAlchemy instance
sql_db = SQLAlchemy()

class User(sql_db.Model):
    __tablename__ = 'users'

    id = sql_db.Column(sql_db.Integer, primary_key=True)
    username = sql_db.Column(sql_db.String(50), unique=True)
    password = sql_db.Column(sql_db.String(200))

    def __init__(self, username, password):
        self.username = username
        self.password = pbkdf2_sha256.hash(password)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
        }

    def __repr__(self):
        return f"<User(id='{self.id}', username='{self.username}')>"
