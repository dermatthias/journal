from journal import db
import datetime


class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.datetime.now)
    text = db.Column(db.Text)

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
