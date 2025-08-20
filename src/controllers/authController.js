import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'


export const signupController = async (req, res) => {
    const { fullName, email, phoneNumber, password, role } = req.body

    if (!fullName || !email || !phoneNumber || !password) {
        return res.status(400).json({
            success: false,
            error: "Missing fields",
            message: "All fields are required"
        })
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: "Duplicate User",
                message: "A user with this email already exists"
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Only allow "admin" role if you seed it manually or check some condition
        // By default, anyone signing up gets "user"
        const assignedRole = role === "admin" ? "admin" : "user"

        const user = await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role: assignedRole
        })

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                userId: user.id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        })
    } catch (error) {
        console.log("Error in sign up controller", error.message)
        res.status(500).json({
            success: false,
            error: "Server side error while creating user"
        })
    }
}


export const signinController = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: "Missing fields",
            message: "All fields are required"
        })
    }

    try {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
                message: "Invalid credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials",
                message: "Password does not match"
            })
        }

        // Include role in JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET_KEY,
            
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1 * 60 * 60 * 1000
        })

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                userId: user.id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        })

    } catch (error) {
        console.log("Error in sign in controller", error.message)
        return res.status(500).json({
            success: false,
            error: "Internal Error",
            message: "Server error while logging in"
        })
    }
}
