import logging

import bcrypt
from pymongo import MongoClient

connection_string = "mongodb+srv://abhinavnew:IoXUM3fjuFGUy9Bk@cluster0.devxnnw.mongodb.net/?retryWrites=true&w=majority&uuidRepresentation=standard"
client = MongoClient(connection_string)
db = client.get_database("users")


class User:
    username: str
    password: str
    email: str
    type: str
    user_id: str

    def __init__(self, username, password, email, type, user_id):
        self.username = username
        self.password = password
        self.email = email
        self.type = type
        self.user_id = user_id

    def check_password(self, password, password_hashed):
        return bcrypt.checkpw(password, password_hashed)

    def save(self):
        user_data = db.users.find_one({"email": self.email})
        if not user_data:
            password_hash = bcrypt.hashpw(self.password, bcrypt.gensalt(12))
            db.users.insert_one(
                {
                    "username": self.username,
                    "password_hash": password_hash,
                    "email": self.email,
                    "type": self.type,
                    "user_id": self.user_id,
                }
            )
            return True
        else:
            return False

    @staticmethod
    def find_by_email(email):
        user_data = db.users.find_one({"email": email})
        if user_data:
            logging.info(f"user found")
            return User(
                user_data["username"],
                user_data["password_hash"],
                user_data["email"],
                user_data["type"],
                user_data["user_id"],
            )
        else:
            logging.info(f"user not found")
            return None

    @staticmethod
    def find_all():
        return db.users.find({})

    @staticmethod
    def find(query):
        return db.users.find_one(query)
