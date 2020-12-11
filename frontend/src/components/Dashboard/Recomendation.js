import React, { Fragment, useState, useEffect } from "react";
import { VictoryPie, VictoryChart, VictoryTheme, VictoryLine } from "victory";

import { host, port } from "../utils/conf";

import Wedges from "../../res/wedges.svg";
import RecomendationsTable from "./RecomendationsTable";
import { user } from "../auth/user";

const Recomendation = () => {
  const startegies = [
    { name: "Index Investing", icon: "hand point up outline" },
    { name: "Quality Investing", icon: "gem" },
    { name: "Value Investing", icon: "money bill alternate" },
    { name: "Ethical Investing", icon: "heart outline" },
    { name: "Growth Investing", icon: "chart line" },
  ];
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState(false);
  const [selected, setSelected] = useState([]);
  const [ammount, setAmmount] = useState(5000);
  const [suggestions, setSuggestions] = useState(null);
  const [chart, setChart] = useState([]);
  const [chartStocks, setChartStocks] = useState([]);
  const [historyLength, sethistoryLength] = useState(5);

  useEffect(() => {
    generateChart();
  }, [chartStocks, historyLength]);

  const generateChart = () => {
    let c = chartStocks.reduce((d, stock) => {
      for (let i = 0; i < historyLength; i++) {
        if (!d[i]) {
          d[i] = { x: historyLength - i, y: 0 };
        }
        d[i].y += suggestions[stock].historical[i].adjusted_close;
      }
      return d;
    }, []);
    setChart(c);
  };

  const updateChart = (stockName, add) => {
    if (add) {
      setChartStocks([...chartStocks, stockName]);
    } else {
      setChartStocks(chartStocks.filter((stock) => stockName != stock));
    }
  };

  return (
    <Fragment>
      <div className="ui buttom attached segment">
        <div className="ui form">
          <div className="ui small header">Customize your Investment:</div>
          <div className="field">
            <label>Choose Investment Strategy: (max 2)</label>
            <div className="ui fluid buttons">
              {startegies.map((startegy) => (
                <div
                  key={startegy.name}
                  className={
                    selected.includes(startegy.name)
                      ? "ui animated active fade button"
                      : selected.length < 2
                      ? "ui animated fade button"
                      : "ui animated disabled fade button"
                  }
                  onClick={() => {
                    if (selected.includes(startegy.name)) {
                      setSelected(selected.filter((s) => s !== startegy.name));
                    } else if (selected.length < 2) {
                      setSelected([...selected, startegy.name]);
                    } else {
                      //do alert
                    }
                  }}
                >
                  <div className="visible content">{startegy.name}</div>
                  <div className="hidden content">
                    <i className={`${startegy.icon} icon`}></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Investment Ammount: ($5000 minimum)</label>
            <input
              type="Number"
              placeholder="5000 Minimum"
              min="5000.00"
              step="0.01"
              value={ammount}
              onChange={(e) => {
                setAmmount(e.target.value);
              }}
            />
          </div>

          <div className="field">
            <div
              className={
                ammount >= 5000 && selected.length > 0 && !loading
                  ? "ui fluid blue button"
                  : "ui disabled fluid blue button"
              }
              onClick={() => {
                setLoading(true);
                setBuying(false);
                let url = new URL(`http://${host}:${port}/recomendation`);
                let params = { strategies: selected.join(",") };
                url.search = new URLSearchParams(params).toString();
                setSuggestions([]);
                fetch(url)
                  .then((res) => res.json())
                  .then((data) => {
                    console.log(data);
                    setLoading(false);
                    setSuggestions(data);
                    setChartStocks(Object.keys(data));
                  })
                  .catch((err) => {
                    console.error(err);
                    setLoading(false);
                    setChartStocks([]);
                  });
              }}
            >
              Get Suggestion
            </div>
          </div>
        </div>
      </div>
      {suggestions || loading ? (
        loading ? (
          <div className="ui placeholder segment">
            <div className="ui icon header">
              <img className="ui image icon" src={Wedges} />
              please wait while we crunch the numbers
            </div>
          </div>
        ) : (
          <div className="ui segment">
            <div className="ui two column grid">
              <div className="ui column">
                <div className="ui small centered text">
                  select the number of days:
                  <div className="ui buttons">
                    <button
                      className="ui button"
                      onClick={() => {
                        sethistoryLength(5);
                      }}
                    >
                      5
                    </button>
                    <button
                      className="ui button"
                      onClick={() => {
                        sethistoryLength(10);
                      }}
                    >
                      10
                    </button>
                    <button
                      className="ui button"
                      onClick={() => {
                        sethistoryLength(30);
                      }}
                    >
                      30
                    </button>
                    <button
                      className="ui button"
                      onClick={() => {
                        sethistoryLength(60);
                      }}
                    >
                      60
                    </button>
                  </div>
                </div>

                <div className="ui small centered header">
                  Historical Trend
                  <VictoryChart theme={VictoryTheme.material}>
                    <VictoryLine
                      animate={{
                        duration: 2000,
                        onLoad: { duration: 2000 },
                      }}
                      style={{
                        data: { stroke: "#c43a31" },
                        parent: { border: "1px solid #ccc" },
                      }}
                      data={chart}
                    />
                  </VictoryChart>
                </div>
              </div>
              <div className="ui column">
                <div className="ui small centered header">
                  click on the stocks to add or remove them from the trend chart
                </div>
                <VictoryPie
                  colorScale={[
                    "green",
                    "tomato",
                    "orange",
                    "gold",
                    "cyan",
                    "navy",
                    "blue",
                    "purple",
                    "brown",
                    "olive",
                  ]}
                  events={[
                    {
                      target: "data",
                      eventHandlers: {
                        onClick: () => {
                          return [
                            {
                              target: "data",
                              mutation: ({ style, datum }) => {
                                if (
                                  chartStocks.length > 1 ||
                                  style.fill === "#cccccc"
                                ) {
                                  if (style.fill === "#cccccc") {
                                    updateChart(datum.label, true);
                                  } else {
                                    updateChart(datum.label, false);
                                  }
                                  return style.fill !== "#cccccc"
                                    ? { style: { fill: "#cccccc" } }
                                    : null;
                                } else {
                                  return null;
                                }
                              },
                            },
                          ];
                        },
                      },
                    },
                  ]}
                  data={Object.keys(suggestions).map((stock, i) => {
                    return { x: i, y: suggestions[stock].cost, label: stock };
                  })}
                />
              </div>
            </div>
            <RecomendationsTable recs={suggestions} />
            <div className="ui segment">
              <div
                className={
                  buying
                    ? buying === "success"
                      ? "ui fluid disabled green button"
                      : "ui fluid loading disabled green button"
                    : "ui fluid green button"
                }
                onClick={() => {
                  setBuying(true);
                  fetch(`http://${host}:${port}/investment`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      email: user.userId,
                      stocks: Object.keys(suggestions).map((key) => {
                        let { symbol, price, cost } = suggestions[key];
                        return { symbol, price, qty: cost / price };
                      }),
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      console.log(data);
                      setBuying("success");
                    })
                    .catch((err) => {
                      console.error(err);
                      setBuying(false);
                    });
                }}
              >
                {buying === "success" ? "success" : "buy"}
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="ui placeholder segment">
          <div className="ui icon header">
            <i className="chart bar outline icon"></i>
            select your strategy and investment ammount to get personalized
            recomendations
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Recomendation;
