export function Timer() {
  function startTimer() {
    setInterval(()=>{
      const date = Date.now();
    console.log(date) 
    }, 1000)
  }
  return <button onClick={startTimer}>start</button>;
}
