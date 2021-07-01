import React, { FC, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

interface IProps {
  data: string | number;
  className?: string;
  text?: string;
  iconSize?: string;
}

export const CopyButton: FC<IProps> = ({ data, text, className, iconSize }) => {
  const [copying, setCopying] = useState(false);

  const onCopy = () => {
    setCopying(true);

    setTimeout(() => setCopying(false), 2000);
  };

  return (
    <CopyToClipboard text={data.toString()} onCopy={onCopy}>
      <button
        className={className || `btn btn-secondary`}
        type="button"
        id="button-addon2"
      >
        {copying ? (
          <>
            <i className={`material-icons md-${iconSize || "14"}`}>done</i>
            {text && <span className="ml-2">{text}</span>}
          </>
        ) : (
          <>
            <i className={`material-icons md-${iconSize || "14"}`}>
              assignment
            </i>
            {text && <span className="ml-2">{text}</span>}
          </>
        )}
      </button>
    </CopyToClipboard>
  );
};
