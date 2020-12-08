import stockquotes
import time

def get_recommanded_stocks(strategy):
    if strategy == "Ethical Investing":
        return 'AAPL', 'GOOG', 'AMZN'
    elif strategy == "Growth Investing":
        return 'ABNB','TSLA','VXRT','NLS','CTRN'

def get_stock(symbol):
    try:
        stock = stockquotes.Stock(symbol)
        stockPrice = stock.current_price
        stockGainDollars = stock.increase_dollars
        increase_percent = stock.increase_percent
        history = []
        for i in range(4):
            # history price from yesterday to the 4th past day
            history.append(stock.historical[i]['close'])
        return (stock.name, stockPrice, history, stockGainDollars, increase_percent)
    except stockquotes.StockDoesNotExistError as e:
        print("StockDoesNotExistError")
        return None, None, None, None, None
    except stockquotes.NetworkError as e:
        print("NetworkError")
        return None, None, None, None, None

def get_final(strategy):

    symbol_list = get_recommanded_stocks(strategy)
    res = []
    for symbol in symbol_list:
        name, price, history, inc, inc_percent = get_stock(symbol)
        res.append((symbol, name, price, history, inc, inc_percent))
    return res
    

out = get_final("Ethical Investing")

print(out)


