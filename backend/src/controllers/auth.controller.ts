import { NextFunction, Request, Response } from 'express';
import { Roles, User } from '../models/user.models';
import { hashPassword, comparePassword, generateToken } from '../services/auth.service';

//this is middleware. common for register all user.
export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
    console.log('Body: ', req.body);
    try {
        const { email, password, confirmPassword, role } = req.body;


        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Assign role or default
        const userRole: Roles = role && ['Admin', 'Technician', 'Customer'].includes(role)
            ? (role as Roles)
            : 'Admin';

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            role: userRole,
            isActive: true,
            isDeleted: false,
        });

        // Pass _id to next middleware
        res.locals.userId = user._id;

        next(); // go to role-specific middleware
    } catch (err) {
        res.status(500).json({ message: 'User Create failed', error: err });
    }
};


//login 
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials, Email Not Exists.' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials, Password Invalid.' });

    const token = generateToken({ id: user._id, email: user.email });

    res.json({ user: { id: user._id, role: user.role, email }, token });
};
