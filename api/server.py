from flask import Flask
import stockquotes

app = Flask(__name__, static_folder='./static', static_url_path='/')


@app.route('/')
def index():
	return app.send_static_file('index.html')

@app.route('/ping')
def ping():
	return {'message': 'pong'}

@app.route('/invest', methods=['POST'])
def invest():
	return {'test': 'data'}
