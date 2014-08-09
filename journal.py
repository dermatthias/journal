import datetime
from flask import Flask
from flask import request, redirect, url_for, render_template
from flask.ext.sqlalchemy import SQLAlchemy
import markdown2

app = Flask(__name__)
app.debug = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///journal.db'
db = SQLAlchemy(app)

import models

@app.route('/')
def index():
    entries = models.Entry.query.order_by(models.Entry.date.desc()).all()
    # render markdown for all entries in DB
    for entry in entries:
        entry.text_markdown = markdown2.markdown(entry.text)

    return render_template('index.html',
                           datetime=datetime.datetime,
                           entries=entries)


@app.route('/insert/', methods=['POST'])
def insert():
    text = request.form['text']
    entry = models.Entry(text)
    entry.lat = request.form['lat']
    entry.lng = request.form['lng']
    if request.form['date']:
        entry.date = datetime.datetime.strptime((request.form['date']), '%Y-%m-%d %H:%M:%S')
    db.session.add(entry)
    db.session.commit()
    return redirect(url_for('index'))


@app.route('/add_location', methods=['POST'])
def add_location():
    entry_id = request.form['entry_id']
    return redirect(url_for('index'))



if __name__ == '__main__':
    app.run()
