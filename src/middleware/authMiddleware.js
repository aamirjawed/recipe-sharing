import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const authUser = async (req, res, next) => {
    try {
        const { token } = req.cookies

        if (!token) {
            res.clearCookie('token')
            return res.status(401).json({
                success: false,
                error: "Token not found",
                message: "Please login"
            })
        }

        const decodedMessage = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const { id } = decodedMessage

        const user = await User.findByPk(id)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found. Unauthorized"
            })
        }

        
        req.userId = id  
        
        req.role = user.role  

        next()

    } catch (error) {
        console.log("Error in auth middleware", error.message)
        res.status(401).json({
            success: false,
            error: "Invalid Token",
            message: "Internal server error"
        })
    }
}

export default authUser
