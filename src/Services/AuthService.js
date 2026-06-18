import { API_BASE_URL } from "../Config/environment.js";

const API_URL = `${API_BASE_URL}/api/auth`;


export async function loginRequest(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
    }
    return data;
}


export async function registerRequest(name, email, password, nickname) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, nickname })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al registrarse");
    }
    return data;
}


export async function forgotPasswordRequest(email) {
    const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al enviar correo de recuperación");
    }
    return data;
}


export async function resetPasswordRequest(token, newPassword) {
    const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, newPassword })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error al restablecer la contraseña");
    }
    return data;
}
