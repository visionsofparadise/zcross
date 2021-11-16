import React from "react";
import { CopyButton } from "./UI/CopyButton";

const email = "contact@zcross.media";

export const Email: React.FC = () => (
  <div className="d-flex justify-content-center">
    <a href={`mailto:${email}`}>
      <span className="h5 text-primary mr-3 align-middle">{email}</span>
    </a>
    <CopyButton data={email} className="btn btn-sm btn-primary m-0 p-2" />
  </div>
);
