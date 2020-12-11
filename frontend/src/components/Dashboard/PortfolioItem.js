import React, { Fragment, useEffect, useState } from "react";
import { SEGMENT_COLORS } from "./colors";
import { host, port } from "../utils/conf";
import { VictoryPie, VictoryChart, VictoryTheme, VictoryLine } from "victory";

const PortfolioItem = ({ item: { stock, avg_cost, qty } }) => {
  const [color, setColor] = useState("");
  useEffect(() => {
    getStockInfo();
    setColor(SEGMENT_COLORS[Math.floor(Math.random() * SEGMENT_COLORS.length)]);
  }, []);
  const [state, setState] = useState(null);
  const getStockInfo = () => {
    let url = new URL(`http://${host}:${port}/stock`);
    let params = { symbol: stock };
    url.search = new URLSearchParams(params).toString();
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setState(data);
      })
      .catch((err) => {
        console.error(err);
        setState(null);
      });
  };
  useEffect(() => {
    let isSubscribed = true;
    setTimeout(() => {
      isSubscribed && getStockInfo();
    }, 30000);
    return () => {
      isSubscribed = false;
    };
  }, [state]);
  return (
    <div className="item">
      <div className={`ui ${color} segment`}>
        <div className="right floated content">
          {state && (
            <Fragment>
              <div className="ui mini statistics">
                <div className="statistic">
                  <div className="value">{state.current_price}</div>
                  <div className="label">USD</div>
                </div>
                {state.increase_dollars > 0 ? (
                  <div className="green statistic">
                    <div className="value">
                      <i className="long arrow alternate up icon"></i>
                      {`${state.increase_dollars} (${state.increase_percent}%)`}
                    </div>
                  </div>
                ) : (
                  <div className="red statistic">
                    <div className="value">
                      <i className="long arrow alternate down icon"></i>
                      {`${state.increase_dollars} (${state.increase_percent}%)`}
                    </div>
                  </div>
                )}
              </div>
              <VictoryChart theme={VictoryTheme.material}>
                <VictoryLine
                  animate={{
                    duration: 500,
                    onLoad: { duration: 500 },
                  }}
                  style={{
                    data: { stroke: "#c43a31" },
                    parent: { border: "1px solid #ccc" },
                  }}
                  data={state.historical.map((day, i) => {
                    return {
                      x: state.historical.length - i,
                      y: day["adjusted_close"],
                    };
                  })}
                />
              </VictoryChart>
            </Fragment>
          )}
        </div>
        <div className="header">{stock}</div>
        <div className="content">{`average cost: $${avg_cost}`}</div>
        <div className="content">{`quantity: ${qty}`}</div>
      </div>
    </div>
  );
};

export default PortfolioItem;
