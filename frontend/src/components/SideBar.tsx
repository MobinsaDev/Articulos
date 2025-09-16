// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import s from "../css/sidebar.module.scss";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const [expanded, setExpanded] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const close = () => setMobileOpen(false);
        window.addEventListener("hashchange", close);
        return () => window.removeEventListener("hashchange", close);
    }, []);

    const { logout } = useAuth();
    const nav = useNavigate();

    const onLogout = async () => {
        await logout();
        nav("/login", { replace: true });
    };
    return (
        <>
            {/* Botón móvil */}
            <button
                className={s.mobileToggler}
                aria-label="Abrir menú"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
            >
                ☰ Menú
            </button>

            {/* Overlay móvil */}
            <div
                className={`${s.overlay} ${mobileOpen ? s.overlayShown : ""}`}
                onClick={() => setMobileOpen(false)}
                aria-hidden={!mobileOpen}
            />

            {/* Sidebar */}
            <aside
                className={[
                    s.sidebar,
                    expanded ? s.expanded : s.collapsed,
                    mobileOpen ? s.mobileOpen : "",
                ].join(" ")}
                aria-label="Barra lateral"
            >
                {/* Botón desktop para expandir/contraer */}
                <button
                    className={s.desktopToggler}
                    aria-label={expanded ? "Contraer sidebar" : "Expandir sidebar"}
                    onClick={() => setExpanded((v) => !v)}
                >
                    {expanded ? "«" : "»"}
                </button>

                <nav className={s.menu}>
                    <NavLink end to="/" className={({ isActive }) => (isActive ? s.active : "")}>
                        <span className={s.icon}>🏠</span>
                        <span className={s.label}>Inicio</span>
                    </NavLink>
                    <NavLink to="/forklifts" className={({ isActive }) => (isActive ? s.active : "")}>
                        <span className={s.icon}>🚜</span>
                        <span className={s.label}>Montacargas</span>
                    </NavLink>
                    <NavLink to="/batteries" className={({ isActive }) => (isActive ? s.active : "")}>
                        <span className={s.icon}>🔋</span>
                        <span className={s.label}>Baterías</span>
                    </NavLink>
                    <NavLink to="/chargers" className={({ isActive }) => (isActive ? s.active : "")}>
                        <span className={s.icon}>🔌</span>
                        <span className={s.label}>Cargadores</span>
                    </NavLink>
                    <NavLink to="/Aditamets" className={({ isActive }) => isActive ? s.active : ""}>
                        <span className={s.icon}>🔩</span>
                        <span className={s.label}>Aditamentos</span>
                    </NavLink>
                    <NavLink to="/users" className={({ isActive }) => (isActive ? s.active : "")}>
                        <span className={s.icon}>👤</span>
                        <span className={s.label}>Usuarios</span>
                    </NavLink>
                    <button onClick={onLogout} className={s.logout}>Salir</button>

                </nav>
            </aside>
        </>
    );
}
