import React, { useEffect, useState } from "react";

export const FakeScrollbar = () => {
  const [scrollY, setScrollY] = useState(1);

  useEffect(() => {
    window.addEventListener("scroll", () => setScrollY(window.pageYOffset));

    window.scroll({
      top: 1,
    });
  }, []);

  return (
    <div>
      <div
        className="bg-white"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 100 + "%",
          width: 10 + "px",
        }}
      ></div>
      <div
        className="bg-primary"
        style={{
          position: "fixed",
          bottom: 100 / (window.document.body.scrollHeight / scrollY) + "%",
          left: 0,
          height:
            100 / (window.document.body.scrollHeight / window.innerHeight) +
            "%",
          width: 10 + "px",
        }}
      ></div>
    </div>
  );
};
