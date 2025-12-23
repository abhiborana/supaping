"use server"

import { decode, sign } from "jsonwebtoken";

export const fetchSupaProject = async (projectUrl, token, table) => {
    return await fetch(`${projectUrl}/rest/v1/${table}?select=*`, {
        method: 'GET',
        headers: {
            'apikey': token,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());
}

export const createSecureJwt = async (payload) => {
    return sign(payload, process.env.JWT_SALT);
}

export const decodeSecureJwt = async (token) => {
    try {
        return decode(token);
    } catch (error) {
        console.error("Invalid JWT:", error);
        return null;
    }
}