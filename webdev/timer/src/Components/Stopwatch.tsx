import * as React from "react";

export const Stopwatch = () => {
  const [rendering, isRendering] = React.useState<boolean>(false);

  const [seconds, setSeconds] = React.useState(0);

  const [timeStamp, setTimeStamp] = React.useState<number>(Date.now());

  React.useEffect(() => {
    if (!rendering) return;

    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - timeStamp) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [rendering, timeStamp]);
  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;
  const displayMinutes = (minutes % 60)

  const hrs = Math.floor(minutes / 60)
  const displayHrs = hrs % 60
  return (
    <div>
      <h1>
      {displayHrs}:{displayMinutes}:{displaySeconds}
      </h1>
      <button
        onClick={() => {
          {
            setTimeStamp(Date.now() - seconds * 1000)
            isRendering(!rendering);
          }
          // {
          //   
          // }
        }}
      >
        start
      </button>

      <button
        onClick={() => {
          {
           setSeconds(0)
            isRendering(false);
          }
        }}
      >
        restart
      </button>
      
    </div>
  );
};
