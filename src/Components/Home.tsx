import React from "react";
import { Email } from "./Email";
import { Leader } from "./Leader";

export const Home: React.FC = () => {
  return (
    <div className="container p-3">
      <div className="row">
        <div className="col-sm-2"></div>
        <div className="col">
          <Leader />
          <Email />

          <br />
          <br />
          <br />
        </div>
        <div className="col-sm-2"></div>
      </div>
    </div>
  );
};
