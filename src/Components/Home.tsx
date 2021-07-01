import React from "react";
import { Clients } from "./Clients";
import zcrossWordLogoBlack from "./Images/zcrossWordLogoBlack.png";
import { Leader } from "./Leader";
import { Services } from "./Services";

export const Home: React.FC = () => {
  return (
    <div className="container p-3">
      <div className="row">
        <div className="col-sm-2"></div>
        <div className="col">
          <Leader />

          <br />
          <br />
          <br />

          <Services />

          <br />
          <br />
          <br />

          <Clients />

          <br />
          <br />
          <br />

          <div className="row mb-5">
            <div className="col-md-2"></div>
            <div className="col-2"></div>
            <div className="col">
              <div className="d-flex justify-content-center mb-5">
                <img
                  src={zcrossWordLogoBlack}
                  className="card-img-top mb-5"
                  alt="zcross"
                />
              </div>
            </div>
            <div className="col-2"></div>
            <div className="col-md-2"></div>
          </div>
        </div>
        <div className="col-sm-2"></div>
      </div>
    </div>
  );
};
