import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import db from './db/db-connection.js'
import authRoutes from './routes/authRoutes.js'
import profileManageRoutes from './routes/profileManageRoute.js'
import recipeRoutes from "./routes/recipeRoutes.js";
import favoriteCollectionRoutes from './routes/favoriteCollectionRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import socialRoutes from './routes/socialRoutes.js'
import adminRoutes from "./routes/adminRoutes.js"







dotenv.config({
    path:'./.env'
})


const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json({
    limit:"16kb"
}))

app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))

app.use(cookieParser())

// auth routes
app.use('/api/v1/user', authRoutes)

// manage profile
app.use('/api/v1/user', profileManageRoutes)

// recipe routes
app.use("/api/v1/recipes", recipeRoutes);

// favorite collection routes
app.use("/api/v1/favorites", favoriteCollectionRoutes);

// review routes
app.use("/api/v1/reviews", reviewRoutes)

// social routes
app.use("/api/v1", socialRoutes)

// admin routes
app.use("/api/v1/admin", adminRoutes)





db.sync().then(() => {
    app.listen(PORT, ()=>{
    console.log(`Server is running on: ${PORT}`)
})
}).catch((err) => {
    console.log("Error in db sync in app js", err.message)
});






