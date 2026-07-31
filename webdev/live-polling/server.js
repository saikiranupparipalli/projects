import app from "./src/app.js";
import router from "./src/modules/auth/routes.js";
import db from "./src/common/db/db.js";
// app.use(express.json())
// app.get('/greet', (_, res)=>{
//     res.send('Hello')
//     console.log('hello')
// })
await db
const server = app.listen(4000, ()=>{
    console.log('server is running on http://localhost:4000')
})

 server