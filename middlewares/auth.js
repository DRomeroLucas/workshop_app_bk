import jwt from "jwt-simple";
import moment from "moment";
import { secret } from "../services/jwt.js";

// Authentication method
export const ensureAuth = (req, res, next) => {

    // Check
    if(!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "La petición no tiene la cabecera de autenticación"
        });
    };

    // Clean token
    const token = req.headers.authorization.replace(/['"]/g,'').replace("Bearer ", "");

    // Verify token
    try {
        let payload = jwt.decode(token, secret)

        // Verify token validity
        if(payload.exp <= moment.unix()){
            
        }
    } catch (error) {
        
    }
}