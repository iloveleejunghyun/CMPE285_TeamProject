import stockquotes
import time

def get_recommanded_stocks(strategy):
    if strategy == "Index Investing":
        return "VTI", "IXUS", "ILTB"
    elif strategy == "Quality Investing":
        return "GOOG", "MCD", "KO"
    elif strategy == "Value Investing":
        return "BA", "DAL", "CCL"

def get_stock(symbol):
    try:
        kroger = stockquotes.Stock(symbol)
        krogerPrice = kroger.current_price
        krogerGainDollars = kroger.increase_dollars
        increase_percent = kroger.increase_percent
        history = []
        for i in range(4):
            # history price from yesterday to the 4th past day
            history.append(kroger.historical[i]['close'])
        return (kroger.name, krogerPrice, history, krogerGainDollars, increase_percent)
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

out = get_final("Index Investing")

print(out)
