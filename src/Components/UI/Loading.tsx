import React, { FC } from "react";
import "./Loading.css";

export const Loading: FC<{ size?: string; text?: string }> = ({
  size,
  text,
}) => (
  <>
    <div className="d-flex justify-content-center">
      <div className={`spinner-${size || "lg"}`} />
    </div>
    {text && <p className="text-center small text-muted mb-3">{text}...</p>}
  </>
);
