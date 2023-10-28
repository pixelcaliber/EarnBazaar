import logging
from logging.handlers import RotatingFileHandler

from flask import Flask, redirect, render_template, request, session, url_for
from flask_cors import CORS

from routes import main_blueprint

app = Flask(__name__)
CORS(app)

FORMAT = "%(asctime)s %(message)s"
logging.basicConfig(level="INFO", format=FORMAT)
app.config["SECRET_KEY"] = "IoXUM3fjuFGUy9Bk!@#1212asdaAfkleaAAewqsASDEF2(*@#$@)"

app.register_blueprint(main_blueprint)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
