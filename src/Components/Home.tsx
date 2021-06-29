import React from "react";
import { Clients } from "./Clients";
import zcrossIconBlack from "./Images/zcrossIconBlack.png";
import zcrossWordLogoBlack from "./Images/zcrossWordLogoBlack.png";
import { Services } from "./Services";

export const Home: React.FC = () => (
  <div className="container p-3">
    <div className="row">
      <div className="col-sm-2"></div>
      <div className="col">
        <div className="row my-5">
          <div className="col-md-2"></div>
          <div className="col-2"></div>
          <div className="col">
            <div className="d-flex justify-content-center my-5">
              <img
                src={zcrossIconBlack}
                className="card-img-top my-5"
                alt="zcross icon"
              />
            </div>
          </div>
          <div className="col-2"></div>
          <div className="col-md-2"></div>
        </div>

        <Services />

        <div className="d-flex justify-content-center mb-5">
          <a href="mailto:contact@zcross.media">
            <span className="h4 text-primary">contact@zcross.media</span>
          </a>
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />

        <h4 className="text-center mb-5">Clients</h4>
        <Clients />

        <br />
        <br />
        <br />
        <br />
        <br />

        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-2"></div>
          <div className="col">
            <div className="d-flex justify-content-center">
              <img
                src={zcrossWordLogoBlack}
                className="card-img-top"
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
