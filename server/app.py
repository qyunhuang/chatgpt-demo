from flask import Flask, request
from flask_cors import CORS
from schema import db, User, Session, Message
import os
import click
from flask_restx import Api, Resource, Namespace, fields

app = Flask(__name__)
api = Api(version='1.0', title='Chatbot API', description='A simple Chatbot API', doc='/api/doc')
ns = Namespace('api')
api.add_namespace(ns)

MYSQL_HOST = os.environ.get('MYSQL_HOST')
MYSQL_PORT = os.environ.get('MYSQL_PORT')
MYSQL_USER = os.environ.get('MYSQL_USER')
MYSQL_PASSWD = os.environ.get('MYSQL_PASSWD')
MYSQL_DB = os.environ.get('MYSQL_DB')

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}'
db.init_app(app)
api.init_app(app)
CORS(app, origins='*')

user_id = api.model('user_id', {
    'user_id': fields.Integer(required=True, description='user id')
})

add_message = api.model('add_message', {
    'session_id': fields.Integer(required=True, description='session id'),
    'content': fields.String(required=True, description='message content'),
    'question': fields.Boolean(required=True, description='is question')
})

@ns.route('/test')
class hello_world(Resource):
    def get(self):
        return 'hello world'

@ns.route('/users')
class ListUsers(Resource):
    def get(self):
        users = User.query.all()
        return {'users': [user.name for user in users]}
    
    @api.expect(user_id)
    def post(self):
        user_id = request.json.get('user_id')
        user = User.query.get(user_id)
        return {'users': [user.name]}
    
@ns.route('/message_add')
class AddMessage(Resource):
    @api.expect(add_message)
    def post(self):
        print(request.json)
        session_id = request.json.get('session_id')
        content = request.json.get('content')
        question = request.json.get('question')
        message = Message(session_id=session_id, content=content, question=question)
        db.session.add(message)
        db.session.commit()
        return {'message': 'message added'}
    
@app.cli.command('initdb')
@click.option('--drop', is_flag=True, help='Create after drop.') 
def initdb(drop):
    with app.app_context():
        if drop:
            db.drop_all()
        db.create_all()
        db.session.add(User(name='John Doe', password=''))
        db.session.add(Session(user_id=1, name='test session'))
        db.session.commit()
    click.echo('Initialized database.')
    