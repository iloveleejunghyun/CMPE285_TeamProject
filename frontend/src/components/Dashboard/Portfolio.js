import React, { useEffect, useState } from "react";

import { host, port } from "../utils/conf";

import { user } from "../auth/user";
import PortfolioItem from "./PortfolioItem";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    let url = new URL(`http://${host}:${port}/investment`);
    let params = { email: user.userId };
    url.search = new URLSearchParams(params).toString();
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPortfolio(data.portfolio);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return loading ? (
    <div className="ui buttom attached loading placeholder segment">
      <div className="ui icon header">
        <i className="folder open icon"></i>
        Looking through your portfolio
      </div>
    </div>
  ) : (
    <div className="ui buttom attached segment">
      <div className="ui list">
        {portfolio.map((item) => {
          return <PortfolioItem key={item.stock} item={item} />;
        })}
      </div>
    </div>
  );
};

export default Portfolio;
