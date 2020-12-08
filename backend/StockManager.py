import stockquotes
from datetime import datetime, timedelta


# portion => {'AAPL': 0.3, 'ADBE': 0.2, 'MSFT': 0.2, 'NSRGY': 0.2, 'TSLA': 0.1}


def get_stock_info(stock_syml):
    return stockquotes.Stock(stock_syml)


# {'AAPL': 124.54, 'ADBE': 494.0, 'MSFT': 216.52, 'NSRGY': 111.91, 'TSLA': 647.16}
def get_curr_stock_price(portion):
    prices = {}
    for key in portion:
        stock_info = get_stock_info(key)
        current_price = stock_info.current_price
        prices[key] = current_price
    return prices


# {'AAPL': 'Apple Inc.', 'ADBE': 'Adobe Inc.', 'MSFT': 'Microsoft Corporation', 'NSRGY': 'Nestlé S.A.', 'TSLA': 'Tesla, Inc.'}
def get_company_name(portion):
    company_name_di = {}
    for syml in portion.keys():
        stock_info = get_stock_info(syml)
        company_name = stock_info.name
        company_name_di[syml] = company_name
    return company_name_di


# {'AAPL': 1500.0, 'ADBE': 1000.0, 'MSFT': 1000.0, 'NSRGY': 1000.0, 'TSLA': 500.0}
def get_each_amount(amount, portion):
    amount_di = {}
    for key, val in portion.items():
        amount_di[key] = amount * val
    return amount_di


# return how many shares a person can buy
def get_share_amount(amount_di, prices):
    share_amount = {}
    for key, val in amount_di.items():
        price = prices[key]
        share_amount[key] = val / price
    return share_amount


# return {'2020-12-08': 124.88, '2020-12-07': 123.75, '2020-12-06': 122.25, '2020-12-05': 122.94, '2020-12-04': 123.08}
def get_five_days_stock_price(stock):
    stock_history = {}
    stock_info = get_stock_info(stock)
    today = datetime.now()
    for i in range(5):
        # history price from yesterday to the 4th past day
        date = today - timedelta(days=i)
        date_formatted = date.strftime('%Y-%m-%d')
        stock_history[date_formatted] = stock_info.historical[i]['close']
    return stock_history


# return {'2020-12-08': 5000.06, '2020-12-07': 4965.76, '2020-12-06': 4904.13, '2020-12-05': 4899.160000000001, '2020-12-04': 4886.86}
def get_history_portfolio(share_amount):
    history_portfolio = {}
    stock_list = share_amount.keys()
    for stock in stock_list:
        stock_week_history = get_five_days_stock_price(stock)
        for date in stock_week_history.keys():
            if date in history_portfolio:
                history_portfolio[date] += float(
                    str(round(stock_week_history[date] * share_amount[stock], 2)))
            else:
                history_portfolio[date] = float(
                    str(round(stock_week_history[date] * share_amount[stock], 2)))

    return history_portfolio
