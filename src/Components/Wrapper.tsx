import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "./UI/Footer";

const Wrapper: React.FC = ({ children }) => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="col-6">
            <div className="text-center my-5">
              <h1>zcross</h1>
            </div>

            <ul className="nav justify-content-center mb-5">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <span className="text-uppercase">Services</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/clients" className="nav-link">
                  <span className="text-uppercase">Clients</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/crew" className="nav-link">
                  <span className="text-uppercase">Crew</span>
                </Link>
              </li>
            </ul>

            <hr className="mb-5" />

            {children}

            <hr />

            <div className="my-5 text-center">
              <h4>
                For a quote, contact{" "}
                <a href="mailto:matt@zcross.media">matt@zcross.media</a>
              </h4>
            </div>
          </div>
          <div className="col-sm-3"></div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wrapper;
