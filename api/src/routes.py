import json
import logging
import uuid
from datetime import datetime

from event import Event
from flask import (
    Blueprint,
    Flask,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from flask_cors import CORS
from models import User
from utils.constants import PORT

main_blueprint = Blueprint("main", __name__)
CORS(main_blueprint)


@main_blueprint.route("/")
def health():
    # return render_template("index.html")
    return jsonify(f"Server is listening to port: {PORT}")


@main_blueprint.route("/register", methods=["POST"])
def register():
    try:
        if session.get("user_id") is not None:
            return jsonify("Already logged In")
        data = request.json["data"]
        logging.info(data)
        username = data["username"]
        email = data["email"]
        user_type = data["userType"]
        password = data["password"].encode("utf-8")
        user_id = str(uuid.uuid4())

        user = User(username, password, email, user_type, user_id)
        if user.save():
            return jsonify("Registration Successfull")
        else:
            return jsonify("Email already registered")
    except Exception as e:
        raise e


@main_blueprint.route("/login", methods=["POST"])
def login():
    try:
        if session.get("user_id") is not None:
            return "Already logged In"
        data = request.json["data"]
        logging.info(data)
        email = data["email"]
        password = data["password"].encode("utf-8")
        user = User.find_by_email(email)
        if user and user.check_password(password, user.password):
            session["user_id"] = user.user_id
            response = {"userId": user.user_id, "username": user.username}
            return jsonify(response)
            # return "login successfull"
        else:
            return "login failed"
    except Exception as e:
        raise e


@main_blueprint.route("/logout", methods=["GET"])
def logout():
    user_id = session.get("user_id")
    if user_id is None:
        return "Please logIn or SignUp"
    session.pop("user_id", None)
    return "logout successful"


@main_blueprint.route("/publish", methods=["POST"])
def publish():
    try:
        user_id = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not user_id:
            return jsonify("Please login or signup")
        json_data = request.json["data"]
        username = json_data["username"]
        date_created = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        event_id = str(uuid.uuid4())
        tags = json_data["tags"]
        event_details = json_data["event_details"]
        event = Event(username, date_created, tags, event_details, user_id, event_id)
        if event.save():
            return "Event Published Successfully"
        else:
            return "Event Publish Failed"
    except Exception as e:
        raise e


@main_blueprint.route("/events/update/<string:event_id>", methods=["POST"])
def update(event_id):
    try:
        user_id = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not user_id:
            return jsonify("Please login or signup")
        json_data = request.json["data"]
        event_details = json_data["event_details"]
        return Event.update(event_id, event_details, user_id)
    except Exception as e:
        raise e


@main_blueprint.route("/events/delete/<string:event_id>", methods=["GET", "POST"])
def delete(event_id):
    try:
        user_id = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not user_id:
            return jsonify("Please login or signup")
        return Event.delete(event_id, user_id)
    except Exception as e:
        raise e


@main_blueprint.route("/events", methods=["GET"])
def events():
    try:
        user_id = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not user_id:
            return jsonify("Please login or signup")
        events = Event.find_all({})
        if not events:
            return "No events found"
        events_list = []
        for event in events:
            event = {
                "event_id": event["event_id"],
                "username": event["username"],
                "user_id": event["user_id"],
                "event_details": event["event_details"],
                "date_created": event["date_created"],
                "tags": event["tags"],
            }
            events_list.append(event)
        return json.dumps(events_list)
    except Exception as e:
        return jsonify({"error": str(e)})


@main_blueprint.route("/events/<string:event_id>", methods=["GET"])
def show_event(event_id):
    try:
        user_id = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not user_id:
            return jsonify("Please login or signup")
        query = {"event_id": event_id}
        event = Event.find(query)
        if not event:
            return f"No event for event_id: {event_id} found"
        event = {
            "event_id": event["event_id"],
            "username": event["username"],
            "user_id": event["user_id"],
            "event_details": event["event_details"],
            "date_created": event["date_created"],
            "tags": event["tags"],
        }
        return event

    except Exception as e:
        raise e


@main_blueprint.route("/users", methods=["GET"])
def users():
    try:
        if session.get("user_id") is None:
            return "Please logIn or SignUp"
        users = User.find_all()
        if not users:
            return "No users found"
        users_list = []
        for user in users:
            user = {
                "user_id": user["user_id"],
                "username": user["username"],
                "email": user["email"],
                "type": user["type"],
            }
            users_list.append(user)
        return users_list
    except Exception as e:
        raise e


@main_blueprint.route("/users/<string:user_id>", methods=["GET"])
def show_user(user_id):
    try:
        if session.get("user_id") is None:
            return "Please logIn or SignUp"
        query = {"user_id": user_id}
        user = User.find(query)
        logging.info(user)
        if not user:
            return f"No user for user_id: {user_id} found"
        user = {
            "user_id": user["user_id"],
            "username": user["username"],
            "email": user["email"],
            "type": user["type"],
        }
        return user

    except Exception as e:
        raise e


@main_blueprint.route("/events/filter", methods=["GET"])
def filter_events_by_tags():
    try:
        user_id = session.get("user_id")
        if user_id is None:
            return "Please logIn or SignUp"
        tags = request.args.get("tags")
        if not tags:
            return jsonify({"error": "Tags parameter is missing"})
        tag_list = tags.split(",")
        events = Event.find_all({"tags": {"$in": tag_list}})
        events_list = []
        for event in events:
            event = {
                "event_id": event["event_id"],
                "username": event["username"],
                "user_id": event["user_id"],
                "event_details": event["event_details"],
                "date_created": event["date_created"],
                "tags": event["tags"],
            }
            events_list.append(event)
        if len(events_list):
            return events_list
        else:
            return f"No events with tags: {tag_list} found"
    except Exception as e:
        return jsonify({"error": str(e)})
