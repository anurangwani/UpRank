import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure you're using the correct secret
        req.user = decoded.user; // Attach user info to the request
        next(); // Proceed to the protected route
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};


export default protect;  // Export the middleware
