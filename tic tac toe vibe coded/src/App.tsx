 import SinglePlayerGame from "./SinglePlayer/SinglePlayerGame";
import "./App.css";
import { StrictMode } from "react";

function App() {
  return (
    <>
      <StrictMode>
        <SinglePlayerGame />
      </StrictMode>
    </>
  );
}

export default App;
