from flask import Flask, request
import mysql.connector
import stockquotes
import simplejson as json
from flask_cors import CORS

app = Flask(__name__, static_folder='./static', static_url_path='/')
CORS(app)
config = {
    'user': 'root',
    'password': 'password',
    'host': '35.238.224.251',
    'database': 'stocks',
    'raise_on_warnings': True
}

create_user = ( 'INSERT INTO user'
                '(fname, lname, email, password)'
                ' VALUES (%(fname)s, %(lname)s, %(email)s, %(password)s)')

login_user = ( 'SELECT * FROM user '
                ' WHERE email = %(email)s'
                ' AND password = %(password)s')

buy_stock = ( 'INSERT INTO portfolio(id, user, stock, qty, price) VALUES (NULL, %(user)s, %(stock)s, %(qty)s, %(price)s)')

get_portfolio = ( 'SELECT stock, SUM(qty), AVG(price) FROM portfolio'
                 ' WHERE user = %s'
                 ' GROUP BY stock')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/ping')
def ping():
    return {'message': 'pong'}

@app.route('/getusers')
def getusers():
    response ={}
    try:
        cnx = mysql.connector.connect(**config)
        cursor = cnx.cursor()
        cursor.execute('SELECT * from user')
        res = cursor.fetchall()
        
        response = {'status': 200, 'users': list(res)}
    except mysql.connector.Error as err:
        print(err)
        response = {'status': 500}
    finally:
        cursor.close()
        cnx.cursor()

    return response


@app.route('/signup', methods=['POST'])
def signup():
    response ={}
    try:
        details = request.json
        cnx = mysql.connector.connect(**config)
        cursor = cnx.cursor()
        cursor.execute(create_user, details)
        cnx.commit()
        res = cursor.rowcount
        response = {'status': 200, 'success': res==1}
    except mysql.connector.Error as err:
        cnx.rollback()
        print(err)
        response = {'status': 500}
    finally:
        cursor.close()
        cnx.close()
    return response

@app.route('/signin', methods=['POST'])
def signin():
    response ={}
    try:
        cnx = mysql.connector.connect(**config)
        cursor = cnx.cursor()
        details = request.json
        cursor.execute(login_user, details)
        result = cursor.fetchone()
        res = dict(zip(cursor.column_names, result or [None, None]))
        response = {'status': 200 if result else 400, 'user': res}
    except mysql.connector.Error as err:
        print(err)
        response = {'status': 500}
    finally:
        cursor.close()
        cnx.close()
    return response

@app.route('/investment', methods=['GET', 'POST'])
def invest():
    if(request.method == 'GET'):
        response = {}
        try:
            cnx = mysql.connector.connect(**config)
            cursor = cnx.cursor()
            cursor.execute(get_portfolio, (request.args.get('email'), ))
            res = cursor.fetchall()
            response = {'status': 200, 'portfolio': res}
        except mysql.connector.Error as err:
            cnx.rollback()
            print(err)
            response = {'status': 500}
        finally:
            cursor.close()
            cnx.close()
        return response
    else:
        response ={}
        try:
            cnx = mysql.connector.connect(**config)
            cursor = cnx.cursor()
            details = request.json
            print(details)
            purchase_details = {'user': details['email']}
            for stock in details['stocks']:
                print(stock)
                purchase_details['stock'] = stock['name']
                purchase_details['qty'] = stock['qty']
                purchase_details['price'] = stock['price']
                cursor.execute(buy_stock, purchase_details)
            cnx.commit()
            res = cursor.rowcount
            response = {'status': 200, 'success': res!=0}
        except mysql.connector.Error as err:
            cnx.rollback()
            print(err)
            response = {'status': 500}
        finally:
            cursor.close()
            cnx.close()
        return response
