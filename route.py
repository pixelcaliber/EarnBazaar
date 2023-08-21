from flask import Blueprint, Flask

from constants import PORT

main_blueprint = Blueprint("main", __name__)


@main_blueprint.route("/")
def home():
    return f"Server is listening to port: {PORT}"


@main_blueprint.route("/login")
def test1():
    return "This is the login page!"
