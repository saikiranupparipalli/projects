import * as React from "react";

export function Timer() {
  const [timer, setTimer] = React.useState<number>(0);
  const [isRunning, setIsRunning] = React.useState<Boolean>(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isRunning) return;
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div>
      {/* <h1>{timer}</h1> */}
      <h1>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </h1>
      <button onClick={() => setIsRunning(!isRunning)}>start</button>
      <button onClick={() => setTimer(timer + 300)}>+5:00</button>
      <button onClick={() => setTimer(timer + 60)}>+1:00</button>
      <button onClick={() => setTimer(timer + 30)}>+30:00</button>
    </div>
  );
}

//   const [customTimer, setCustomTimer] = React.useState<number>(600000)
//       React.useEffect(() => {
//     const interval = setInterval(() => {
//       if (!isRunning) return;
//       setCustomTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           setIsRunning(false);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [isRunning]);

//     const hrMinutes = Math.floor(customTimer / 60)
//   const hrSeconds = customTimer % 60
//
//         {hrMinutes}:{hrSeconds.toString().padStart(2, "0")}
