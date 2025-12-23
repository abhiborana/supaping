"use server"

import { sign } from "jsonwebtoken";

export const createSecureJwt = async (payload) => {
    return sign(payload, process.env.JWT_SALT);
}
