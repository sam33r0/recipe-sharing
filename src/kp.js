import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js"
import  recipeRoutes  from "./routes/recipe.routes.js";

const app= express();

app.use(cors({
    origin: true,
    credentials: true,
    
}));

app.use(express.json({ limit: "32kb" }))
app.use(express.urlencoded({ extended: true, limit: "32kb" }))
app.use(express.static("public"))
app.use(cookieParser());

app.use("/reciapi/v1/users",userRoutes);
app.use("/reciapi/v1/recipe", recipeRoutes)
export { app };