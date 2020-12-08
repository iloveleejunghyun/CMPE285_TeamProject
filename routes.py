from flask import Flask, render_template, request
import stockquotes
from backend.StockManager import get_company_name, get_curr_stock_price, get_each_amount, get_share_amount, get_history_portfolio
from backend.StrategySelection import get_portion_list

app = Flask(__name__)


@app.route("/")
def get_input():
    return render_template('home.html')


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


if __name__ == '__main__':
    app.run(debug=True)
