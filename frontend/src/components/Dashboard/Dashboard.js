import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
//import { LineChart, XAxis, Tooltip, CartesianGrid, Line } from "recharts";

import { user } from "../auth/user";
import Portfolio from "./Portfolio";
import Recomendation from "./Recomendation";
import Stocks from "./Stocks";

const Dashboard = () => {
  const [tab, setTab] = useState(1);
  return !user.userId ? (
    <Redirect to="/login" />
  ) : (
    <Fragment>
      <div className="ui top attached tabular menu">
        <div
          className={tab === 1 ? "active link item" : "link item"}
          onClick={() => {
            setTab(1);
          }}
        >
          Recomendation Engine
        </div>
        <div
          className={tab === 2 ? "active link item" : "link item"}
          onClick={() => {
            setTab(2);
          }}
        >
          Buy Stocks
        </div>
        <div
          className={tab === 3 ? "active link item" : "link item"}
          onClick={() => {
            setTab(3);
          }}
        >
          My Portfolio
        </div>

        <div className="right menu">
          <div className="fitted item">
            <Link
              to="/login"
              className="ui basic primary button"
              onClick={() => {
                user.userId = null;
              }}
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
      {tab === 1 && <Recomendation />}
      {tab === 2 && <Stocks />}
      {tab === 3 && <Portfolio />}
    </Fragment>
  );
};

export default Dashboard;
