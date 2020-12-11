from flask import Flask, request
import mysql.connector
import stockquotes
import simplejson as json
from flask_cors import CORS

from backend.StockManager import get_stock_info, get_recomendation, get_company_name, get_curr_stock_price, get_each_amount, get_share_amount, get_history_portfolio
from backend.StrategySelection import get_portion_list


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

get_portfolio = ( 'SELECT stock, SUM(qty) AS qty, AVG(price) AS avg_cost FROM portfolio'
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
            cursor = cnx.cursor(dictionary=True)
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
                purchase_details['stock'] = stock['symbol']
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

@app.route("/recomendation", methods=['GET'])
def get_recomendation_route():
    response = {}
    try:
        # print(request.args.getlist('strategies')) 
        print(request.args)      
        amount = int(request.args.get('amount', 5000))
        strategy_list = request.args.get('strategies')
        print(strategy_list.split(','))
        print(type(strategy_list.split(',')))
        portion = get_portion_list(strategy_list.split(','))# portions
        response = get_recomendation(portion, amount)
    except mysql.connector.Error as err:
        response = {'status': 500}
    return response
    

@app.route("/stock", methods=['GET'])
def get_stock_route():
    response = {}
    try:     
        symbol = request.args.get('symbol')
        stock_info = get_stock_info(symbol)
        response = vars(stock_info)
    except Error as err:
        response = {'status': 500}
    return response
    
    
# @app.route("/result", methods=['GET', 'POST'])
# def get_result():
#     if request.method == 'POST':
#         amount = request.form.get('amount', None)
#         strategy_list = request.form.getlist("strategy")
#         portion = get_portion_list(strategy_list)
#         prices = get_curr_stock_price(portion)
#         company_name_di = get_company_name(portion)
#         amount_di = get_each_amount(float(amount), portion)
#         share_amount = get_share_amount(amount_di, prices)
#         history_portfolio = get_history_portfolio(share_amount)
#         return render_template('result.html', prices=prices, company_name_di=company_name_di, amount_di=amount_di, history_portfolio=history_portfolio)
