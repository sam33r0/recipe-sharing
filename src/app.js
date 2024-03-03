import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./kp.js";

dotenv.config({
    path: './.env'
})
connectDB()
.then(()=>{
    app.on("error",
        (error)=>{
            console.log("error",error);
            throw error;
        }
    )
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running at ${process.env.PORT}`)
    })

})
.catch((error)=>{
    console.log("mongodb connection fail!!! ", error);
});
