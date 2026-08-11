const date = new Date()



setInterval(()=>{
console.log(date.getSeconds())
console.log(date.getMilliseconds())
}, 1000)