import React, { useState } from "react";
import { Link } from "react-router";
import { forgotPasswordRequest } from "../../Services/AuthService";
import "../RegisterScreen/RegisterScreen.css"; // Comparte estilos de registro para el success box

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            await forgotPasswordRequest(email);
            setSuccess("Si el correo está registrado, recibirás un mensaje de recuperación con los pasos a seguir.");
        } catch (err) {
            setError(err.message || "Error al solicitar la recuperación.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="whatsapp-login-container">
            <div className="whatsapp-green-banner"></div>

            <div className="whatsapp-login-card">
                <div className="whatsapp-logo-section">
                    <svg viewBox="0 0 24 24" width="60" height="60" className="whatsapp-logo-svg">
                        <path fill="#00a884" d="M12.003 21.003h-.008a9.03 9.03 0 0 1-4.603-1.258l-.33-.196-3.422.898.913-3.336-.215-.341a9.017 9.017 0 0 1-1.385-4.766C1.954 7.026 5.996 2.984 11 2.984c2.424 0 4.703.943 6.417 2.658A9.01 9.01 0 0 1 20.074 12c.005 5.011-4.037 9.003-9.071 9.003ZM22 11.997c0-2.67-1.04-5.18-2.93-7.07C17.18 3.03 14.67 2 12.003 2c-5.514 0-10 4.478-10 10 0 1.77.46 3.49 1.34 5.02L2 22l5.12-1.34A9.92 9.92 0 0 0 12.003 22c5.514 0 10-4.478 10-10.003Z" />
                        <path fill="#ffffff" d="M12.003 3.984c-4.411 0-8 3.589-8 8 0 1.63.49 3.21 1.41 4.56l.27.4-.57 2.08 2.13-.56.39.23c1.3.77 2.79 1.18 4.31 1.18h.006c4.41 0 8-3.589 8-8 0-2.14-.83-4.15-2.34-5.66a7.95 7.95 0 0 0-5.606-2.23Z" />
                        <path fill="#00a884" d="M16.89 14.37c-.27-.13-1.58-.78-1.82-.87-.24-.09-.42-.13-.6.13-.18.27-.69.87-.85 1.05-.16.18-.31.2-.58.07a7.35 7.35 0 0 1-2.16-1.33 8.1 8.1 0 0 1-1.49-1.86c-.16-.27-.02-.42.12-.55.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.33-.02-.47-.07-.13-.6-1.44-.82-1.98-.22-.54-.44-.47-.6-.47-.16 0-.34-.02-.53-.02-.18 0-.47.07-.71.33-.24.27-.93.91-.93 2.22s.96 2.57 1.09 2.76c.13.18 1.88 2.88 4.56 4.04.64.27 1.13.44 1.52.56.64.2 1.22.18 1.69.11.51-.07 1.58-.65 1.8-1.27.22-.62.22-1.16.16-1.27-.06-.11-.23-.2-.5-.33Z" />
                    </svg>
                    <h1>BayApp</h1>
                </div>

                <div className="whatsapp-card-body">
                    <h2>Recuperar Contraseña</h2>
                    <p className="card-subtitle">Te enviaremos los pasos a tu correo</p>

                    {error && <div className="whatsapp-error-box">{error}</div>}
                    {success && <div className="whatsapp-success-box">{success}</div>}

                    <form onSubmit={handleSubmit} className="whatsapp-form">
                        <div className="whatsapp-input-group">
                            <label htmlFor="email">CORREO ELECTRÓNICO</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="ejemplo@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="whatsapp-btn" disabled={isLoading}>
                            {isLoading ? "ENVIANDO..." : "ENVIAR CORREO"}
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
