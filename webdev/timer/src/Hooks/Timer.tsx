import * as React from "react";

export function Timer() {
  const [timer, setTimer] = React.useState<number>(300);
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
      <button onClick={() => setIsRunning(!isRunning)}>start timer </button>
    </div>
  );
}
