import React from "react";
import { Home } from "./Components/Home";
import FadeIn from "react-fade-in";

const App = () => {
  return (
    <div className="App">
      <FadeIn>
        <Home />
      </FadeIn>
    </div>
  );
};

export default App;
