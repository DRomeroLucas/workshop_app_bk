import jwt from 'jwt-simple';
import moment from 'moment';
import dotenv from 'dotenv';

// Load environment variable
dotenv.config();

// Secret pass
const secret = process.env.SECRET_KEY;

// Generate token
const createToken = (user) => {
    const payload = {
        userId: user.id,
        role: user.role,
        iat: moment().unix(), // Issue date
        exp: moment().add(15, 'days').unix() // Expiration date
    }

    // Return coded token
    return jwt.encode(payload, secret);
};

export {
    secret,
    createToken
};