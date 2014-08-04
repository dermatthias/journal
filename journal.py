from flask import Flask
from flask import render_template
from flask.ext.sqlalchemy import SQLAlchemy

import models

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///journal.db'
db = SQLAlchemy(app)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/insert', methods=['POST'])
def insert():
    pass


if __name__ == '__main__':
    app.run()
