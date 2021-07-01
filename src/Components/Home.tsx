import React from "react";
import { Clients } from "./Clients";
import zcrossIconBlack from "./Images/zcrossIconBlack.png";
import zcrossWordLogoBlack from "./Images/zcrossWordLogoBlack.png";
import { Labels } from "./Labels";
import { Services } from "./Services";
import { CopyButton } from "./UI/CopyButton";

export const Home: React.FC = () => {
  const email = "contact@zcross.media";

  return (
    <div className="container p-3">
      <div className="row">
        <div className="col-sm-2"></div>
        <div className="col">
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
            <p className="mb-1">
              With over a decade of experience in audio and music,
            </p>
            <p>
              <b>ƵCROSS</b> helps content creators to get professional quality
              audio and beyond.
            </p>
          </div>

          <br />
          <br />
          <br />

          <Services />

          <br />
          <br />
          <br />

          {/* <h5 className="text-muted text-center mb-5">- Contact -</h5> */}
          <div className="d-flex justify-content-center mb-5">
            <a href={`mailto:${email}`}>
              <span className="h4 text-primary mr-3 align-middle">{email}</span>
            </a>
            <CopyButton
              data={email}
              className="btn btn-sm btn-primary btn-outline"
            />
          </div>

          <br />
          <br />
          <br />
          <br />
          <br />

          {/* <div className="row">
            <div className="col-md">
              <h5 className="text-muted text-center mb-5">- Clients -</h5>
              <Clients />
            </div>
            <div className="col-md">
              <h6 className="text-muted text-center mb-5">
                {"- Labels we have worked with -"}
              </h6>
              <Labels />
            </div>
          </div>

          <br />
          <br /> */}

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
};
