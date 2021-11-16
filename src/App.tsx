import React from "react";
import { Home } from "./Components/Home";
import FadeIn from "react-fade-in";
import { FakeScrollbar } from "./Components/FakeScrollbar";

const App = () => {
  return (
    <div className="App">
      <FakeScrollbar />
      <FadeIn>
        <Home />
      </FadeIn>
    </div>
  );
};

export default App;
