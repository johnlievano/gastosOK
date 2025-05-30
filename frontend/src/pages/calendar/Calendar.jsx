import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/ThemeContext";
import { Link } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "../../styles.css";

export default function GastosCalendar() {
  const [date, setDate] = useState(new Date());
  const [transacciones, setTransacciones] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const gastosRaw = localStorage.getItem("gastosPorCategoria");
    const ahorrosRaw = localStorage.getItem("ahorrosPorCategoria");

    const gastos = gastosRaw
      ? Object.values(JSON.parse(gastosRaw)).flat().map((g) => ({ ...g, tipo: "gasto" }))
      : [];
    const ahorros = ahorrosRaw
      ? Object.values(JSON.parse(ahorrosRaw)).flat().map((a) => ({ ...a, tipo: "ahorro" }))
      : [];

    setTransacciones([...gastos, ...ahorros]);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const transaccionesDelDia = transacciones.filter(
    (t) => t.fecha === date.toLocaleDateString()
  );

  const fechasConTransacciones = transacciones.reduce((acc, t) => {
    const fecha = t.fecha;
    if (!acc[fecha]) acc[fecha] = { gasto: false, ahorro: false };
    acc[fecha][t.tipo] = true;
    return acc;
  }, {});

  return (
    <div className={`expenses-wrapper ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            className="sidebar"
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ duration: 0.3 }}
            ref={sidebarRef}
          >
            <nav>
              <ul>
                <li><Link to="/" onClick={() => setIsSidebarOpen(false)}>Inicio</Link></li>
                <li><Link to="/expenses" onClick={() => setIsSidebarOpen(false)}>Gastos</Link></li>
                <li><Link to="/savings" onClick={() => setIsSidebarOpen(false)}>Ahorros</Link></li>
                <li><Link to="/settings" onClick={() => setIsSidebarOpen(false)}>Configuración</Link></li>
                <li><button onClick={() => setIsSidebarOpen(false)}>Cerrar</button></li>
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      <header className="start-header">
        <Menu
          className="menu-icon"
          style={{ visibility: isSidebarOpen ? "hidden" : "visible" }}
          onClick={() => setIsSidebarOpen(true)}
        />
      </header>

      <div className="calendar-wrapper">
        <h2 className="calendar-title">Calendario de Gastos</h2>
        <div className="calendar-container">
          <Calendar
            onChange={setDate}
            value={date}
            className="custom-calendar"
            tileContent={({ date, view }) => {
              const fecha = date.toLocaleDateString();
              const hasGasto = fechasConTransacciones[fecha]?.gasto;
              const hasAhorro = fechasConTransacciones[fecha]?.ahorro;
              return (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
                  {hasGasto && <span style={{ height: 6, width: 6, borderRadius: "50%", background: "red", marginRight: hasAhorro ? 4 : 0 }} />}
                  {hasAhorro && <span style={{ height: 6, width: 6, borderRadius: "50%", background: "lightgreen" }} />}
                </div>
              );
            }}
          />
        </div>

        <h3 className="calendar-subtitle">Movimientos del {date.toLocaleDateString()}</h3>

        <div className="calendar-gastos-list">
          {transaccionesDelDia.length === 0 ? (
            <p className="no-gastos-msg">No hay movimientos este día.</p>
          ) : (
            transaccionesDelDia.map((t, i) => (
              <div key={i} className="gasto-card">
                <span>{t.nombre}</span>
                <span style={{
                  color: t.tipo === "gasto" ? "red" : "lightgreen",
                  fontWeight: "bold"
                }}>
                  {t.tipo === "gasto" ? "-" : "+"}${t.monto}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
