import * as React from "react";

export const Play = () => {
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
  const [winner, setWinner] = React.useState<null | string>(null);
  const [btn, setbtn] = React.useState<boolean>(false);

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
  // const [reset, setReset] = React.useState<string[]>([]);

  function display(x: number) {
    const newArray = [...tic];
    if (newArray[x] !== "") return;
    if (!btn) {
      newArray[x] = "x";
    } else {
      newArray[x] = "o";
    }
    winningLines.forEach((e) => {
      if (
        newArray[e[0]] === newArray[e[1]] &&
        newArray[e[1]] === newArray[e[2]] &&
        newArray[e[0]] !== "" &&
        newArray[e[1]] !== "" &&
        newArray[e[2]] !== ""
      ) {
        setWinner(`player ${newArray[x]} won`);
      }
    });
    setTic(newArray);
    setbtn(!btn);
  }

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <div>
        <button
          onClick={() => {
            display(0);
          }}
        >
          {tic[0]}
        </button>
        <button onClick={() => display(1)}>{tic[1]} </button>
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
      <button
        onClick={() => {
          setTic(["", "", "", "", "", "", "", "", ""]);
          setbtn(false);
          setWinner("");
        }}
      >
        🔄️
      </button>
    </div>
  );
};

 
