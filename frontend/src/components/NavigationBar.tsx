// src/components/NavigationBar.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../css/navigationbar.module.scss";

const logo = "/img/OIP.jpg"; 
const mob = "/img/Logo_Mob.png";

export default function NavigationBar() {
    const [q, setQ] = useState("");
    const nav = useNavigate();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <nav className={style.navigationmain} aria-label="Barra de navegación">
            <div className={style.brand}>
                <picture>
                    <source media="(max-width: 430px)" srcSet={mob} />
                    <img src={logo} alt="Mobinsa" loading="eager" />
                </picture>      </div>

            <form className={style.search} onSubmit={onSubmit} role="search" aria-label="Buscar">
                <input
                    type="search"
                    placeholder="Buscar"
                    aria-label="Buscar"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <button type="submit"><span>Buscar</span></button>
            </form>
        </nav>
    );
}
