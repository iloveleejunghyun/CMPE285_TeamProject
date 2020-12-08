import React, { Fragment, useState } from "react";
import { Redirect } from "react-router-dom";
//import { LineChart, XAxis, Tooltip, CartesianGrid, Line } from "recharts";

import { VictoryBar, VictoryPie } from "victory";
import { user } from "../auth/user";

const Dashboard = () => {
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
  return !user.userId ? (
    <Redirect to="/login" />
  ) : (
    <Fragment>
      <div className="ui segment">
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
                ammount >= 5000 && selected.length > 0
                  ? "ui fluid blue button"
                  : "ui disabled fluid blue button"
              }
              onClick={() => {
                setSuggestions({});
              }}
            >
              Get Suggestion
            </div>
          </div>
        </div>
      </div>
      {suggestions && (
        <div className="ui short segment">
          <div className="ui two column grid">
            <div className="ui column">
              <VictoryBar
                data={[
                  { x: 1, y: 2, label: "A" },
                  { x: 2, y: 4, label: "B" },
                  { x: 3, y: 7, label: "C" },
                  { x: 4, y: 3, label: "D" },
                  { x: 5, y: 5, label: "E" },
                ]}
                events={[
                  {
                    target: "data",
                    eventHandlers: {
                      onClick: () => {
                        return [
                          {
                            target: "labels",
                            mutation: (props) => {
                              return props.text === "clicked"
                                ? null
                                : { text: "clicked" };
                            },
                          },
                        ];
                      },
                    },
                  },
                ]}
              />
            </div>
            <div className="ui column">
              <VictoryPie />
            </div>
          </div>

          {/* <LineChart
          width={400}
          height={400}
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <Tooltip />
          <CartesianGrid stroke="#f5f5f5" />
          <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} />
          <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} />
        </LineChart> */}
        </div>
      )}
    </Fragment>
  );
};

export default Dashboard;
