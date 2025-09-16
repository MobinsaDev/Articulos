// src/pages/HomePage.tsx
import { useAuth } from "../context/AuthContext";
import NavigationBar from "../components/NavigationBar";
import Sidebar from "../components/SideBar";
import style from "../css/home.module.scss";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function HomePage() {
    const { user } = useAuth();
    const [sbExpanded, setSbExpanded] = useState(true);

    return (
        <>
            <NavigationBar />
            <div className={style.homeMain}>
                <Sidebar
                    expanded={sbExpanded}
                    onToggle={() => setSbExpanded((v) => !v)}
                />
                <main className={style.content}>
                    <header className={style.header}>
                        <div className={style.title}>Mobinsa • Panel</div>
                        <div className={style.right}>
                            <span>{user ? `Hola, ${user.name}` : ""}</span>
                        </div>
                    </header>

                    <section>
                        <Outlet />
                    </section>
                </main>
            </div>
        </>
    );
}
