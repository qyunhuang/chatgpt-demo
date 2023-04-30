from flask import Flask
from flask_cors import CORS
from schema import db, User
import os
import click

app = Flask(__name__)

MYSQL_HOST = os.environ.get('MYSQL_HOST')
MYSQL_PORT = os.environ.get('MYSQL_PORT')
MYSQL_USER = os.environ.get('MYSQL_USER')
MYSQL_PASSWD = os.environ.get('MYSQL_PASSWD')
MYSQL_DB = os.environ.get('MYSQL_DB')

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}'
print(app.config['SQLALCHEMY_DATABASE_URI'])
db.init_app(app)
CORS(app)

@app.route('/test')
def hello_world():
    return 'Hello, World!'

@app.route('/users')
def ListUsers():
    users = User.query.all()
    return {'users': [user.name for user in users]}

@app.cli.command('initdb')
@click.option('--drop', is_flag=True, help='Create after drop.')  # 设置选项
def initdb(drop):
    with app.app_context():
        if drop:
            db.drop_all()
        db.create_all()
        db.session.add(User(name='John Doe'))
        db.session.add(User(name='Jane Doe'))
        db.session.commit()
    click.echo('Initialized database.')
    