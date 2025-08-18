
import bcrypt, { hash } from 'bcryptjs'
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'




export const signupController = async (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body

    if (!fullName || !email || !phoneNumber || !password) {
        return res.status(400).json({
            success: false,
            error: "Missing fields",
            message: "All fields are required"
        })
    }

    try {


        /* The code snippet `const existingUser = await User.findOne({email})` is querying the database
        to find a user record based on the provided email address. If a user with the specified
        email already exists in the database, the `existingUser` variable will hold that user's
        information. */
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: "Duplicate User",
                message: "A user with this email already exists"
            });
        }


        /* `const hashedPassword = await bcrypt.hash(password, 10)` is using the `bcrypt` library to
        hash the user's password before storing it in the database. The `bcrypt.hash()` function
        takes the password and a salt round value (in this case, 10) as parameters. The salt round
        determines the complexity of the hashing algorithm. By hashing the password, it adds a layer
        of security by converting the password into a unique and irreversible string, making it more
        secure than storing plain text passwords. */
        const hashedPassword = await bcrypt.hash(password, 10)


        /* The code snippet `const user = await User.create({ fullName, email, phoneNumber, password:
        hashedPassword })` is creating a new user record in the database using the `User` model.
        Here's a breakdown of what each property represents: */
        const user = await User.create({
            fullName: fullName,
            email: email,
            phoneNumber: phoneNumber,
            password: hashedPassword
        })


        /* This code snippet is setting the HTTP response status to 201 which indicates that a new
        resource has been successfully created. It then sends a JSON response back to the client
        with the following data:
        - `success: true`: Indicates that the user creation process was successful.
        - `message: "User created successfully"`: A message informing the client that the user was
        created without any issues.
        - `userId: user.id`: The unique identifier (ID) of the newly created user. This ID can be
        used to identify and retrieve the user from the database.
        - `userEmail: user.email`: The email address of the newly created user, providing additional
        information about the user that was just created. */
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                userId: user.id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        })
    } catch (error) {
        console.log("Error in sing up controller in auth controller", error.message)
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

        const comparePassword = bcrypt.compare(password, user.password)

        if (!comparePassword) {
            return res.status(404).json({
                success: false,
                error: "User not found",
                message: "Invalid credentials"
            })
        }




        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY)

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            success: true,
            message: `User with ${email} exist`,
            data: {
                userId: user.id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        })


    } catch (error) {
        console.log("Error in sign in controller in auth controller", error.message)
        return res.status(500).json({
            success: "false",
            error: "Internal Error",
            message: "Server error while logging"
        })
    }
}