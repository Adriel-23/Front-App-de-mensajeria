import React from 'react';
import { useOutletContext } from 'react-router';
import './WelcomeScreen.css';

export default function WelcomeScreen() {
    const { setActiveSidebar, searchInputRef, triggerSearchHint } = useOutletContext() || {};

    const handleNewGroup = () => {
        if (setActiveSidebar) setActiveSidebar('create-group');
    };

    const handleNewContact = () => {
        if (setActiveSidebar) setActiveSidebar('chats');
        setTimeout(() => {
            if (searchInputRef && searchInputRef.current) {
                searchInputRef.current.focus();
            }
            if (triggerSearchHint) triggerSearchHint();
        }, 50);
    };

    return (
        <div className="welcome-screen">


            <div className="promo-card">
                <div className="promo-image-container">
                    <div className="placeholder-svg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-laptop" viewBox="0 0 16 16">
                            <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5" />
                        </svg>
                    </div>
                </div>

                <h2 className="promo-title">Bienvenido a BayApp</h2>

                <p className="promo-text">
                    Esta es una app web de mensajería actualmente en desarrollo.
                    <br />
                    Tranquilo, algunas de sus funciones son meramente decorativas, pero proximamente estarán funcionales.
                    <br />
                    En esta primera versión de la aplicación solo podrás enviar mensajes de texto.
                </p>

            </div>


            <div className="quick-actions-container">

                <div className="action-item">
                    <button className="action-btn" onClick={handleNewGroup}>

                        <div className="placeholder-icon">
                            <svg viewBox="0 0 24 24" height="24" width="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                    </button>
                    <span className="action-label">Nuevo Grupo</span>
                </div>

                <div className="action-item">
                    <button className="action-btn" onClick={handleNewContact}>

                        <div className="placeholder-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-plus" viewBox="0 0 16 16">
                                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5" />
                            </svg>
                        </div>
                    </button>
                    <span className="action-label">Nuevo Contacto</span>
                </div>

            </div>
        </div>
    )
}