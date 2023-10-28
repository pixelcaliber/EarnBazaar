import logging

from flask import jsonify
from pymongo import MongoClient

connection_string = "mongodb+srv://abhinavnew:IoXUM3fjuFGUy9Bk@cluster0.devxnnw.mongodb.net/?retryWrites=true&w=majority&uuidRepresentation=standard"
client = MongoClient(connection_string)
db = client.get_database("events")


class Event:
    username: str
    date_created: str
    event_details: []
    tags: []
    event_id: str
    user_id: str

    def __init__(self, username, date_created, tags, event_details, user_id, event_id):
        self.username = username
        self.date_created = date_created
        self.tags = tags
        self.event_details = event_details
        self.user_id = user_id
        self.event_id = event_id

    def save(self):
        db.events.insert_one(
            {
                "username": self.username,
                "date_created": self.date_created,
                "user_id": self.user_id,
                "event_id": self.event_id,
                "tags": self.tags,
                "event_details": self.event_details,
            }
        )
        return True

    @staticmethod
    def find_all(query):
        return db.events.find(query)

    @staticmethod
    def find(query):
        return db.events.find_one(query)

    @staticmethod
    def update(event_id, event_details, user_id):
        query = {"event_id": event_id}
        event = db.events.find_one(query)
        if not event:
            return jsonify({"error": "Event not found"})

        if event["user_id"] != user_id:
            return jsonify({"message": f"Event {event_id} cannot be updated by User {user_id}"})
        update_operation = {"$set": {"event_details": event_details}}
        updated_event = db.events.find_one_and_update(
            query, update_operation, return_document=True
        )
        if updated_event:
            return jsonify({"message": f"Event {event_id} updated successfully"})
        else:
            return jsonify({"message": f"Event {event_id} updatation failed"})

    @staticmethod
    def delete(event_id, user_id):
        query = {"event_id": event_id}
        event = db.events.find_one(query)
        if not event:
            return jsonify({"error": "Event not found"})
        if event["user_id"] != user_id:
            return jsonify({"message": f"Event {event_id} cannot be deleted by User {user_id}"})
        deleted_event = db.events.find_one_and_delete(query)
        if deleted_event:
            return jsonify({"message": f"Event {event_id} deleted successfully"})
        else:
            return jsonify({"message": f"Event {event_id} deletion failed"})
