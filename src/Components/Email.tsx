import React from "react";
import { CopyButton } from "./UI/CopyButton";

const email = "contact@zcross.media";

export const EmailTop: React.FC = () => (
  <>
    <CopyButton data={email} className="btn btn-sm btn-primary p-2 mr-3" />
    <a href={`mailto:${email}`}>
      <span className="h5 text-primary align-middle">{email}</span>
    </a>
  </>
);

export const EmailBottom: React.FC = () => (
  <>
    <a href={`mailto:${email}`}>
      <span className="h5 text-primary mr-3 align-middle">{email}</span>
    </a>
    <CopyButton data={email} className="btn btn-sm btn-primary m-0 p-2" />
  </>
);
