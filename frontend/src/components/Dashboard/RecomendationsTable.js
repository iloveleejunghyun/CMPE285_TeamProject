import React from "react";

const RecomendationsTable = ({ recs }) => {
  return (
    <table className="ui celled table">
      <thead>
        <tr>
          <th>Stock Symbol</th>
          <th>Stock Name</th>
          <th>Current Price</th>
          <th>Number of shares</th>
          <th>Total Cost</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(recs).map((rec) => {
          return (
            <tr>
              <td data-label="Stock Symbol">{recs[rec].symbol}</td>
              <td data-label="Stock Name">{recs[rec].name}</td>
              <td data-label="Current Price" className="ui red text">
                <div className="ui mini statistics">
                  <div className="statistic">
                    <div className="value">{recs[rec].price}</div>
                    <div className="label">USD</div>
                  </div>
                  {recs[rec].increase_dollars > 0 ? (
                    <div className="green statistic">
                      <div className="value">
                        <i className="long arrow alternate up icon"></i>
                        {`${recs[rec].increase_dollars} (${recs[rec].increase_percent}%)`}
                      </div>
                    </div>
                  ) : (
                    <div className="red statistic">
                      <div className="value">
                        <i className="long arrow alternate down icon"></i>
                        {`${recs[rec].increase_dollars} (${recs[rec].increase_percent}%)`}
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td data-label="Number of shares">
                {recs[rec].cost / recs[rec].price}
              </td>
              <td data-label="Total Cost">{recs[rec].cost}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RecomendationsTable;
