from flask import Flask, request
from flask_cors import CORS
from schema import db, User, Session, Message
import os
import click
from flask_restx import Api, Resource, Namespace, fields

app = Flask(__name__)
CORS(app)

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

user_id = api.model('user_id', {
    'user_id': fields.Integer(required=True, description='user id')
})

add_message = api.model('add_message', {
    'session_id': fields.Integer(required=True, description='session id'),
    'content': fields.String(required=True, description='message content'),
    'question': fields.Boolean(required=True, description='is question or answer')
})

select_message = api.model('select_message', {
    'session_id': fields.Integer(required=True, description='session id')
})

select_session = api.model('select_session', {
    'user_id': fields.Integer(required=True, description='user id')
})

add_session = api.model('add_session', {
    'session_id': fields.String(required=True, description='session id'),
    'user_id': fields.Integer(required=True, description='user id'),
    'name': fields.String(required=True, description='session name')
})

rename_session = api.model('rename_session', {
    'session_id': fields.String(required=True, description='session id'),
    'name': fields.String(required=True, description='new session name')
})

delete_session = api.model('delete_session', {
    'session_id': fields.String(required=True, description='session id')
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
        session_id = request.json.get('session_id')
        content = request.json.get('content')
        question = request.json.get('question')
        message = Message(session_id=session_id, content=content, question=question)
        db.session.add(message)
        db.session.commit()
        return {'message': 'message added'}

@ns.route('/session_select')
class SelectSession(Resource):
    @api.expect(select_session)
    def post(self):
        user_id = request.json.get('user_id')
        sessions = Session.query.filter_by(user_id=user_id).all()
        return {'sessions': [{'id': session.id, 'name': session.name} for session in sessions]}

@ns.route('/session_add')
class AddSession(Resource):
    @api.expect(add_session)
    def post(self):
        session_id = request.json.get('session_id')
        user_id = request.json.get('user_id')
        name = request.json.get('name')
        session = Session(id=session_id, user_id=user_id, name=name)
        db.session.add(session)
        db.session.commit()
        return {'message': 'session added'}
    
@ns.route('/session_rename')
class RenameSession(Resource):
    @api.expect(rename_session)
    def post(self):
        session_id = request.json.get('session_id')
        name = request.json.get('name')
        session = Session.query.get(session_id)
        session.name = name
        db.session.commit()
        return {'message': 'session renamed'}
    
@ns.route('/session_delete')
class DeleteSession(Resource):
    @api.expect(delete_session)
    def post(self):
        session_id = request.json.get('session_id')
        session = Session.query.get(session_id)
        db.session.delete(session)
        db.session.commit()
        return {'message': 'session deleted'}
    
@ns.route('/message_select')
class SelectMessage(Resource):
    @api.expect(select_message)
    def post(self):
        session_id = request.json.get('session_id')
        messages = Message.query.filter_by(session_id=session_id).all()
        return {'messages': [{'content': message.content, 'question': message.question} for message in messages]}

@app.cli.command('initdb')
@click.option('--drop', is_flag=True, help='Create after drop.') 
def initdb(drop):
    with app.app_context():
        if drop:
            db.drop_all()
        db.create_all()
        db.session.add(User(name='John Doe', password=''))
        db.session.commit()
    click.echo('Initialized database.')
    