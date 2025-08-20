import express from 'express'
import authUser from '../middleware/authMiddleware.js'

const router = express.Router()


router.get('/me', authUser, (req, res) => {
    try {
        res.status(200).json({
        id:req.userId, 
        user:req.role})
    } catch (error) {
        console.log("Error in me routes", error.message)
        console.log("Full error", error)
        res.status(500).json({
            message:"Failed to fetch user"
        })
    }
})


export default router