import express from 'express'
import authUser from '../middleware/authMiddleware.js'
import User from '../models/userModel.js'

const router = express.Router()


router.get('/me', authUser, async (req, res) => {
    try {

        const user = await User.findByPk(req.userId,{
            attributes:{exclude :['password']}
        })

        res.status(200).json({
        id:req.userId, 
        user:req.role,
        data:user
    })

        
    } catch (error) {
        console.log("Error in me routes", error.message)
        console.log("Full error", error)
        res.status(500).json({
            message:"Failed to fetch user"
        }) 
    }
})


export default router