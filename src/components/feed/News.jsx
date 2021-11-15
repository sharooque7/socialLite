import React from "react";
import "./news.css";

const News = ({ news }) => {
  return (
    <div className="newsComp">
      <div className="newsCompWrapper">
        <div className="newsCompTop">
          <img
            src={news.multimedia[0].url ? news.multimedia[0].url : ""}
            alt=""
          />

          <p className="abstract">{news.abstract}</p>
          <a href={news.short_url} target="_blank" rel="noreferrer">
            Visit the link for more detail
          </a>
        </div>
      </div>
    </div>
  );
};

export default News;
