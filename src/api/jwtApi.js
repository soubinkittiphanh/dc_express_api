
const jwt = require('jsonwebtoken');
const logger = require('./logger');
const secretKey = require('../config').actksecret;
const validateToken = (req, res, next) => {
    // Extract token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        req.user = decoded; // Attach the decoded payload (user data) to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

const generateToken = (user) => {
    // const user = { name: u_name,tel:u_phone,id:u_id };
    const accessToken = jwt.sign(user, secretKey, { expiresIn: '5h' });
    logger.warn("Token ===> send to client " + accessToken)
    return { accessToken, user }
}
const getUserFromToken = (req, res) => {
    const authHeader = req.headers['authorization']
    logger.info("Decrypted user request header: " + authHeader);
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return error.status(401).send('Invalid token')
    jwt.verify(token, secretKey, (error, user) => {
        if (error) {
            logger.error(`Cannot decrypt user from token ${error}`)
            return res.status(403).send('Token invalid or expired!')//res.sendStatus(403).send('invalid')
        }
        logger.warn(`user decrypted ${user.cus_name}`);
        res.status(200).send({ user })
    })
}

const deleteToken = (req, res) => {
    const dateTime = new Date(Date.now()).toLocaleString()
    logger.warn("Signout: ", dateTime);
    const authHeader = req.headers['authorization']
    logger.info("Middleware header: " + authHeader);
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send('Invalid token')
    const decodedToken = jwt.decode(token);
    decodedToken.exp = 0;
    res.status(200).send({ status: 'succeed' })
}

module.exports = { validateToken, generateToken, getUserFromToken, deleteToken }