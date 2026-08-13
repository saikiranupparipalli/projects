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
  console.log(tic);
  const [btn, setbtn] = React.useState<boolean>(false);

  function display(x: number) {
    const newArray = [...tic];
    if (newArray[x] !== "") return;
    if (!btn) {
      newArray[x] = "x";
    } else {
      newArray[x] = "o";
    }
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
    </div>
  );
};

// approach 1 //
//  React.useEffect(() => {
//     btn ? setTic("X") : setTic(null); //first approach
//   }, []);
//   React.useEffect(() => {
//     btnTwo ? setTicTwo("O") : setTicTwo(null);
//   }, []);

// approach 2 //
// export const Play = () => {
//   const [tic, setTic] = React.useState<string>(" ");
//   const [ticTwo, setTicTwo] = React.useState<null | string>(null);
//   // const [btn, setbtn] = React.useState<boolean>(false);
//   const [btnTwo, setbtnTwo] = React.useState<boolean>(false);
//   React.useEffect(() => {
//     setTic(tic);
//   }, []);
//   React.useEffect(() => {

//   }, [tic]);

//   return (
//     <div>
//       <h1>Tic tac too</h1>
//       <div>
//         <button
//           onClick={() => {
//             setTic("X");
//           }}
//         >
//           {tic}
//         </button>
//         <button
//           onClick={() => {
//             setTicTwo("O");
//             setbtnTwo(true);
//           }}
//         >
//           {ticTwo}
//         </button>
//       </div>
//     </div>
//   );
// };
