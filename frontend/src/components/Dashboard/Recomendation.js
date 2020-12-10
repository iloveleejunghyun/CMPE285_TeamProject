import React, { Fragment, useState, useEffect } from "react";
import {
  VictoryBar,
  VictoryPie,
  VictoryChart,
  VictoryTheme,
  VictoryLine,
} from "victory";

import { host, port } from "../utils/conf";

import Wedges from "../../res/wedges.svg";

const Recomendation = () => {
  const startegies = [
    { name: "Index Investing", icon: "hand point up outline" },
    { name: "Quality Investing", icon: "gem" },
    { name: "Value Investing", icon: "money bill alternate" },
    { name: "Ethical Investing", icon: "heart outline" },
    { name: "Growth Investing", icon: "chart line" },
  ];
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [ammount, setAmmount] = useState(5000);
  const [suggestions, setSuggestions] = useState(null);
  const [chart, setChart] = useState([]);
  const [chartStocks, setChartStocks] = useState([]);

  useEffect(() => {
    generateChart();
  }, [chartStocks]);

  const generateChart = () => {
    console.log("generating stocks for");
    console.log(chartStocks);

    let c = chartStocks.reduce((d, stock) => {
      for (let i = 0; i < 5; i++) {
        if (!d[i]) {
          d[i] = { x: 5 - i, y: 0 };
        }
        d[i].y += suggestions[stock].historical[i].adjusted_close;
      }
      return d;
    }, []);

    console.log(c);
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
                let url = new URL(`http://${host}:${port}/recomendation`);
                let params = { strategies: selected.join(",") };
                url.search = new URLSearchParams(params).toString();
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
            <div className="ui segment">
              <div className="ui fluid green button" onClick={() => {}}>
                buy
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
