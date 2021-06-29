import React, { FC } from "react";
import phoenixRising from "./Images/clients/phoenixRising.jpg";
import workingCode from "./Images/clients/workingCode.jpg";
import becomingUnshakeable from "./Images/clients/becomingUnshakeable.jpg";
import mmmn from "./Images/clients/mmmn.jpg";

export const Clients: FC = () => (
  <div className="text-center">
    <div className="mb-5">
      <h2>Clients</h2>
    </div>

    <div className="mb-5">
      <div className="row">
        <div className="col-4">
          <div className="card">
            <img
              src={phoenixRising}
              className="card-img-top"
              alt="Phoenix Rising"
            />
            <div className="card-body">
              <a
                href="https://www.ashleydrummonds.com/"
                rel="noreferrer"
                target="_blank"
              >
                <h5 className="card-title">Phoenix Rising</h5>
              </a>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card">
            <img
              src={workingCode}
              className="card-img-top"
              alt="Working Code"
            />
            <div className="card-body">
              <a
                href="https://workingcode.dev/"
                rel="noreferrer"
                target="_blank"
              >
                <h5 className="card-title">Working Code</h5>
              </a>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card">
            <img
              src={becomingUnshakeable}
              className="card-img-top"
              alt="Becoming Unshakeable"
            />
            <div className="card-body">
              <a href="#" rel="noreferrer" target="_blank">
                <h5 className="card-title">Becoming Unshakeable</h5>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <div className="card">
            <img
              src={mmmn}
              className="card-img-top"
              alt="Make More Money Now!"
            />
            <div className="card-body">
              <a
                href="https://www.youtube.com/channel/UCIdF0ijr6HFy8geBXiEXh1w/videos"
                rel="noreferrer"
                target="_blank"
              >
                <h5 className="card-title">Make More Money Now</h5>
              </a>
            </div>
          </div>
        </div>
        <div className="col-4"></div>
        <div className="col-4"></div>
      </div>
    </div>
  </div>
);
