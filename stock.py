import stockquotes
import time

def get_stock(symbol):
    try:
        kroger = stockquotes.Stock(symbol)
        krogerPrice = kroger.current_price
        krogerGainDollars = kroger.increase_dollars
        increase_percent = kroger.increase_percent
    
        return (kroger.name, krogerPrice, krogerGainDollars, increase_percent)
    except stockquotes.StockDoesNotExistError as e:
        print("StockDoesNotExistError")
        return None, None, None, None
    except stockquotes.NetworkError as e:
        print("NetworkError")
        return None, None, None, None

def test():
    symbol = input("Please enter a symbol:\n")
    # symbol = "ADBE"
    name, price, inc, inc_percent = get_stock(symbol)

    print()

    if name == None:
        print(f"Can't find {symbol}")
        return

    t = time.strftime("%a %b %d %H:%M:%S %Y\n", time.localtime()) 
    print(t)
    print(f"{name}({symbol})\n")
    print(f"{price} +{inc}({+inc_percent}%)")

test()