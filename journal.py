import datetime
from flask import Flask
from flask import request, redirect, url_for, render_template
from flask import json
from flask.ext.sqlalchemy import SQLAlchemy
import markdown2

app = Flask(__name__)
app.debug = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///journal.db'
db = SQLAlchemy(app)


@app.route('/')
def index():
    entries = Entry.query.order_by(Entry.date.desc()).limit(5).offset(0).all()

    # render markdown for all entries in DB
    for entry in entries:
        entry.text_markdown = markdown2.markdown(entry.text)

    total_entries = db.session.query(Entry.id).count()

    return render_template('main.html',
                           total_entries=total_entries,
                           datetime=datetime.datetime,
                           entries=entries)


@app.route('/get/', methods=['GET'])
def get():
    limit = request.args.get('limit', 5)
    offset = request.args.get('offset', 0)

    entries = Entry.query\
        .order_by(Entry.date.desc())\
        .limit(limit).offset(offset)\
        .all()

    # render markdown for all entries in DB
    for entry in entries:
        entry.text_markdown = markdown2.markdown(entry.text)

    return render_template('entries.html',
                           datetime=datetime.datetime,
                           entries=entries)


@app.route('/get/<int:entry_id>', methods=['GET'])
def get_entry(entry_id):
    entry = Entry.query.get(entry_id)
    entry.text_markdown = markdown2.markdown(entry.text)
    return render_template('single.html',
                           datetime=datetime.datetime,
                           entry=entry)


@app.route('/insert/', methods=['POST'])
def insert():
    text = request.form['text']
    if not text or len(text.strip()) == 0:
        return redirect(url_for('index'))

    entry = Entry(text)

    if request.form['lat'] and request.form['lng']:
        entry.lat = request.form['lat']
        entry.lng = request.form['lng']
    if request.form['date']:
        entry.date = datetime.datetime.strptime((request.form['date']), '%Y-%m-%d %H:%M:%S')
    db.session.add(entry)
    db.session.commit()
    return redirect(url_for('index'))


@app.route('/edit/', methods=['POST'])
def edit():
    entry_id = request.form['entry_id']
    edited_text = request.form['text']
    edited_text_markdown = markdown2.markdown(edited_text)

    entry = Entry.query.get(entry_id)
    entry.text = edited_text

    if request.form.get('lat') and request.form.get('lng'):
        entry.lat = request.form['lat']
        entry.lng = request.form['lng']

    db.session.commit()

    response = {'status': 'ok', 'code': 200, 'content': edited_text_markdown}
    return json.dumps(response)


@app.route('/delete/', methods=['POST'])
def delete():
    entry_id = request.form['entry_id']

    entry = Entry.query.get(entry_id)
    db.session.delete(entry)
    db.session.commit()

    response = {'status': 'ok', 'code': 200}
    return json.dumps(response)



@app.route('/all_locations', methods=['GET'])
def all_locations():
    entries = Entry.query.all()
    json_locations = []
    for e in entries:
        if e.lat and e.lng:
            loc = {'date': e.date.strftime('%a, %d. %B %Y'),
                   'id': e.id,
                   'lat': e.lat,
                   'lng': e.lng
                   }
            json_locations.append(loc)

    return json.dumps(json_locations)


class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.datetime.now)
    text = db.Column(db.Text)
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)

    def __init__(self, text):
        self.text = text

    def __prep__(self):
        return '<Entry %r>' % self.date


class Picture(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(128), unique=True)
    mimetype = db.Column(db.String(64))

    entry_id = db.Column(db.Integer, db.ForeignKey('entry.id'))
    entry = db.relationship('Entry',
                            backref=db.backref('pictures', lazy='dynamic'))

    def __init__(self, path):
        self.path = path

    def __repr__(self):
        return '<Picture %r>' % self.path



if __name__ == '__main__':
    app.run(host='0.0.0.0')
