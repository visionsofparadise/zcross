import React from "react";
import zcrossIconBlack from "./Images/zcrossIconBlack.png";

export const Leader: React.FC = () => {
  return (
    <>
      <div className="row my-5">
        <div className="col-md-2"></div>
        <div className="col-2"></div>
        <div className="col">
          <div className="d-flex justify-content-center mt-5 p-3">
            <img
              src={zcrossIconBlack}
              className="card-img-top mt-5"
              alt="zcross icon"
            />
          </div>
        </div>
        <div className="col-2"></div>
        <div className="col-md-2"></div>
      </div>

      <div className="mb-5 text-center">
        <h5 className="mb-1">ƵCROSS</h5>
        <p>Audio editing and engineering</p>
      </div>
    </>
  );
};
