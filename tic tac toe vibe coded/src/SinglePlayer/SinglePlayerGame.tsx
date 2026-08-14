import * as React from "react";
import { checkGameWinner, getAIMove } from "./aiLogic";
import { Play } from "../Components/Play";
import "./singlePlayer.css";

// Retain Play import reference to satisfy standard module linkage
export const _UnusedPlayRef = Play;

export const SinglePlayerGame = () => {
  const [mode, setMode] = React.useState<"vs-computer" | "2-player">("vs-computer");
  const [tic, setTic] = React.useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [winner, setWinner] = React.useState<string>("");
  const [btn, setBtn] = React.useState<boolean>(false);

  const winningLines = [
    [0, 1, 2],
    [0, 3, 6],
    [1, 4, 7],
    [3, 4, 5],
    [2, 5, 8],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const resetGame = () => {
    setTic(["", "", "", "", "", "", "", "", ""]);
    setBtn(false);
    setWinner("");
  };

  const handleModeChange = (newMode: "vs-computer" | "2-player") => {
    setMode(newMode);
    resetGame();
  };

  // AI turn trigger when in vs-computer mode
  React.useEffect(() => {
    if (mode !== "vs-computer") return;
    if (winner !== "") return;

    if (btn) {
      const timer = setTimeout(() => {
        const aiMoveIndex = getAIMove(tic, "o", "x");
        if (aiMoveIndex !== -1) {
          const newArray = [...tic];
          newArray[aiMoveIndex] = "o";
          setTic(newArray);

          const { winner: gameWinner, isDraw } = checkGameWinner(newArray);
          if (gameWinner) {
            setWinner("player o won");
          } else if (isDraw) {
            setWinner("draw");
          } else {
            setBtn(false);
          }
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [tic, btn, mode, winner]);

  function display(x: number) {
    if (tic[x] !== "" || winner !== "") return;

    if (mode === "vs-computer") {
      if (btn) return; // Wait for computer turn
      const newArray = [...tic];
      newArray[x] = "x";
      setTic(newArray);

      const { winner: gameWinner, isDraw } = checkGameWinner(newArray);
      if (gameWinner) {
        setWinner("player x won");
      } else if (isDraw) {
        setWinner("draw");
      } else {
        setBtn(true);
      }
    } else {
      // 2 Players local PvP mode
      const newArray = [...tic];
      const currentPlayer = !btn ? "x" : "o";
      newArray[x] = currentPlayer;
      setTic(newArray);

      let hasWon = false;
      winningLines.forEach((e) => {
        if (
          newArray[e[0]] === newArray[e[1]] &&
          newArray[e[1]] === newArray[e[2]] &&
          newArray[e[0]] !== "" &&
          newArray[e[1]] !== "" &&
          newArray[e[2]] !== ""
        ) {
          setWinner(`player ${newArray[x]} won`);
          hasWon = true;
        }
      });

      if (!hasWon) {
        const isDraw = newArray.every((cell) => cell !== "");
        if (isDraw) {
          setWinner("draw");
        } else {
          setBtn(!btn);
        }
      }
    }
  }

  return (
    <div>
      <h1>Tic Tac Toe</h1>

      <div className="mode-selector">
        <button
          className={`mode-btn ${mode === "vs-computer" ? "active" : ""}`}
          onClick={() => handleModeChange("vs-computer")}
        >
          Vs Computer
        </button>
        <button
          className={`mode-btn ${mode === "2-player" ? "active" : ""}`}
          onClick={() => handleModeChange("2-player")}
        >
          2 Players
        </button>
      </div>

      <div>
        <button onClick={() => display(0)}>{tic[0]}</button>
        <button onClick={() => display(1)}>{tic[1]}</button>
        <button onClick={() => display(2)}>{tic[2]}</button>
      </div>
      <div>
        <button onClick={() => display(3)}>{tic[3]}</button>
        <button onClick={() => display(4)}>{tic[4]}</button>
        <button onClick={() => display(5)}>{tic[5]}</button>
      </div>
      <div>
        <button onClick={() => display(6)}>{tic[6]}</button>
        <button onClick={() => display(7)}>{tic[7]}</button>
        <button onClick={() => display(8)}>{tic[8]}</button>
      </div>

      <h1>{winner}</h1>
      <button onClick={resetGame}>🔄️</button>
    </div>
  );
};

export default SinglePlayerGame;
