import React from "react";
import { Home } from "./Components/Home";
import FadeIn from "react-fade-in";
import { FakeScrollbar } from "./Components/FakeScrollbar";
import { EmailBottom, EmailTop } from "./Components/Email";

const App = () => {
  return (
    <div className="App">
      <FakeScrollbar />
      <div
        style={{
          position: "absolute",
          top: 40 + "px",
          left: 50 + "px",
          zIndex: 1,
        }}
      >
        <EmailTop />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 40 + "px",
          right: 50 + "px",
          zIndex: 1,
        }}
      >
        <EmailBottom />
      </div>
      <FadeIn>
        <Home />
      </FadeIn>
    </div>
  );
};

export default App;
