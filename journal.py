from flask import Flask
from flask import request, redirect, url_for, render_template
from flask.ext.sqlalchemy import SQLAlchemy
import models

app = Flask(__name__)
app.debug = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///journal.db'
db = SQLAlchemy(app)



@app.route('/')
def index():

    entries = models.Entry.query.all()

    return render_template('index.html',
                           entries=entries)


@app.route('/insert/', methods=['POST'])
def insert():
    text = request.form['text']
    entry = models.Entry(text)
    db.session.add(entry)
    db.session.commit()
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run()
