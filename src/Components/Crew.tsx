import React, { FC } from "react";
import mattCavender from "./Images/crew/mattCavender.jpg";

export const Crew: FC = () => (
  <div className="text-center">
    <div className="mb-5">
      <h2>Crew</h2>
    </div>

    <div className="card mb-5">
      <div className="row no-gutters">
        <div className="col-md-4">
          <img
            src={mattCavender}
            className="card-img-top"
            alt="Matt Cavender"
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">Matt Cavender</h5>
            <p className="card-text">
              Over a decade of experience in electronic music and audio editing
              (p.k.a xKore, Sonny Banks)
            </p>
            <p className="card-text">
              AWS certified programmer using Typescript and serverless cloud
              computing.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
