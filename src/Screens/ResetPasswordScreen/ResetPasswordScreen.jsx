import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { resetPasswordRequest } from "../../Services/AuthService";
import "../RegisterScreen/RegisterScreen.css"; // Comparte estilos de registro

export default function ResetPasswordScreen() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Extraemos el parámetro ?token=XXXX de la URL
    const token = searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (!token) {
            setError("Token de recuperación no válido o inexistente.");
            return;
        }

        setIsLoading(true);

        try {
            await resetPasswordRequest(token, newPassword);
            setSuccess("Contraseña restablecida correctamente. Redirigiendo al login...");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            setError(err.message || "Error al restablecer la contraseña. El token podría haber expirado.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="whatsapp-login-container">
            <div className="whatsapp-green-banner"></div>

            <div className="whatsapp-login-card">
                <div className="whatsapp-logo-section">
                    <svg
                        xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                    </svg>
                    <h1>BayApp</h1>
                </div>

                <div className="whatsapp-card-body">
                    <h2>Restablecer Contraseña</h2>
                    <p className="card-subtitle">Escribe tu nueva contraseña</p>

                    {error && <div className="whatsapp-error-box">{error}</div>}
                    {success && <div className="whatsapp-success-box">{success}</div>}

                    <form onSubmit={handleSubmit} className="whatsapp-form">
                        <div className="whatsapp-input-group">
                            <label htmlFor="password">NUEVA CONTRASEÑA</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Mínimo 6 caracteres"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="whatsapp-input-group">
                            <label htmlFor="confirmPassword">CONFIRMAR CONTRASEÑA</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirma tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="whatsapp-btn" disabled={isLoading}>
                            {isLoading ? "GUARDANDO..." : "CAMBIAR CONTRASEÑA"}
                        </button>
                    </form>
                </div>

                <div className="whatsapp-card-footer">
                    <Link to="/login">Volver al inicio de sesión</Link>
                </div>
            </div>
        </div>
    );
}
