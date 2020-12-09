from flask import Flask, render_template, request, session
import stockquotes
from backend.StockManager import get_company_name, get_curr_stock_price, get_each_amount, get_share_amount, get_history_portfolio
from backend.StrategySelection import get_portion_list


app = Flask(__name__)

# setting app secret key for session
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

# route for user log in
@app.route("/", methods=['GET', 'POST'])
def get_login():
    return render_template('login.html')

@app.route("/home", methods=['GET', 'POST'])
def get_input():
    # for first time logging in users
    if request.method == 'POST':
        # if username and password matches, allow log in
        # if not, go to 'wrong.html'
        username = request.form.get('inputEmail3', None)
        password = request.form.get('inputPassword3', None)
        session['userID'] = username
        if username == 'admin@root' and password == '123456':
            return render_template('home.html', username=username)
        else:
            return render_template('wrong.html', username=username)
    # for returning users
    if request.method == 'GET':
        if session.get('userID') == 'admin@root':
            return render_template('home.html', username=session.get('userID'))

@app.route("/result", methods=['GET', 'POST'])
def get_result():
    if request.method == 'POST':
        amount = request.form.get('amount', None)
        strategy_list = request.form.getlist("strategy")
        portion = get_portion_list(strategy_list)
        prices = get_curr_stock_price(portion)
        company_name_di = get_company_name(portion)
        amount_di = get_each_amount(float(amount), portion)
        share_amount = get_share_amount(amount_di, prices)
        history_portfolio = get_history_portfolio(share_amount)
        return render_template('result.html', prices=prices, company_name_di=company_name_di, amount_di=amount_di, history_portfolio=history_portfolio)

# route to handle if user enters wrong password and username combination
@app.route("/wrong", methods=['GET', 'POST'])
def get_test():
    if request.method == 'POST':
        return render_template('wrong.html')
    elif request.method == 'GET':
        return render_template('wrong.html')

if __name__ == '__main__':
    app.run(debug=True)
