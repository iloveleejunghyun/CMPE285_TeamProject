stock_strategy = {
    "ethicalInvest": {"AAPL": 0.3, "ADBE": 0.2, "MSFT": 0.2, "NSRGY": 0.2, "TSLA": 0.1},
    "growthInvest": {"EXEL": 0.3, "MB": 0.2, "NKE": 0.3, "SQ": 0.2},
    "indexInvest": {"VTI": 0.3, "IXUS": 0.3, "ILTB": 0.4},
    "qualityInvest": {"MA": 0.3, "TCEHY": 0.25, "TSM": 0.2, "V": 0.25},
    "valueInvest": {"IAG": 0.15, "LPX": 0.15, "SAFM": 0.1, "TWTR": 0.35, "ZG": 0.25}
}


# calculate the normalized portion for the suggested stock list
def get_portion_list(strategy_list):
    portion_list = {}
    total_strategy_num = len(strategy_list)
    for strategy in strategy_list:
        init_list = stock_strategy[strategy]
        for key, val in init_list.items():
            portion_list[key] = val / total_strategy_num

    return portion_list
