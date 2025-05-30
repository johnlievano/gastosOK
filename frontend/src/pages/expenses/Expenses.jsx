import React, { useState, useEffect, useRef } from "react";
import ListOfThings from "../components/ListOfThings";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import "../../styles.css";

console.log("Renderizando EXPENSES");

export default function Expenses() {
    const [categorias, setCategorias] = useState(() => {
        const saved = localStorage.getItem("categorias");
        return saved ? JSON.parse(saved) : ["COMIDA", "SERVICIOS", "ARRIENDO", "GIMNASIO", "ALL"];
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formularioActivo, setFormularioActivo] = useState(false);
    const [editandoGasto, setEditandoGasto] = useState(null);

    const [gastosPorCategoria, setGastosPorCategoria] = useState(() => {
        const saved = localStorage.getItem("gastosPorCategoria");
        return saved ? JSON.parse(saved) : { ALL: {} };
    });

    const { isDarkMode, toggleTheme } = useTheme();

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

    useEffect(() => {
        localStorage.setItem("categorias", JSON.stringify(categorias));
    }, [categorias]);

    useEffect(() => {
        localStorage.setItem("gastosPorCategoria", JSON.stringify(gastosPorCategoria));
    }, [gastosPorCategoria]);

    useEffect(() => {
        setGastosPorCategoria(prev => ({
            ...prev,
            ALL: categorias
                .filter(cat => cat !== "ALL")
                .flatMap(cat => prev[cat] || [])
        }));
    }, [categorias]);

    useEffect(() => {
        if (editandoGasto) {
            const form = document.querySelector(".gasto-form");
            if (form) {
                form.nombre.value = editandoGasto.nombre;
                form.monto.value = editandoGasto.monto;
                form.fecha.value = editandoGasto.fecha;
            }
        }
    }, [editandoGasto]);

    const agregarCategoria = () => {
        const nuevaCatUpper = nuevaCategoria.trim().toUpperCase();
        if (!nuevaCatUpper || categorias.includes(nuevaCatUpper)) return;

        const nuevasCategorias = [...categorias];
        const indiceAll = nuevasCategorias.indexOf("ALL");
        nuevasCategorias.splice(indiceAll, 0, nuevaCatUpper);
        setCategorias(nuevasCategorias);

        setGastosPorCategoria(prev => ({
            ...prev,
            [nuevaCatUpper]: []
        }));

        setNuevaCategoria("");
        setMostrarFormulario(false);
    };

    const eliminarCategoria = (categoria) => {
        if (categoria === "ALL") return;

        const confirmacion = window.confirm(`¿Está seguro de eliminar la categoría "${categoria}"?`);
        if (!confirmacion) return;

        const nuevasCategorias = categorias.filter(c => c !== categoria);
        setCategorias(nuevasCategorias);

        setGastosPorCategoria(prev => {
            const { [categoria]: _, ...rest } = prev;
            return rest;
        });

        if (selectedCategory === categoria) {
            setSelectedCategory(null);
        }
    };

    const agregarGasto = (e) => {
        e.preventDefault();
        const nuevoGasto = {
            nombre: e.target.nombre.value,
            monto: parseFloat(e.target.monto.value),
            fecha: e.target.fecha.value
        };

        if (isNaN(nuevoGasto.monto) || nuevoGasto.monto <= 0) {
            alert("Por favor ingresa un monto válido.");
            return;
        }

        setGastosPorCategoria(prev => {
            const categoria = editandoGasto ? editandoGasto.categoria : selectedCategory;
            const gastosActuales = [...(prev[categoria] || [])];

            if (editandoGasto) {
                gastosActuales[editandoGasto.index] = nuevoGasto;
            } else {
                gastosActuales.push(nuevoGasto);
            }

            return {
                ...prev,
                [categoria]: gastosActuales
            };
        });

        e.target.reset();
        setFormularioActivo(false);
        setEditandoGasto(null);
    };

    const eliminarGasto = (categoria, index) => {
        const confirmacion = window.confirm("¿Estás seguro de eliminar este gasto?");
        if (!confirmacion) return;

        setGastosPorCategoria(prev => {
            const nuevosGastos = [...prev[categoria]];
            nuevosGastos.splice(index, 1);
            return {
                ...prev,
                [categoria]: nuevosGastos
            };
        });
    };

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
                                <li>
                                    <Link to="/" onClick={() => setIsSidebarOpen(false)}>Inicio</Link>
                                </li>
                                <li>
                                    <Link to="/Savings" onClick={() => setIsSidebarOpen(false)}>Ahorros</Link>
                                </li>
                                <li>
                                    <Link to="/calendar" onClick={() => setIsSidebarOpen(false)}>Calendario</Link>
                                </li>
                                <li>
                                    <Link to="/settings" onClick={() => setIsSidebarOpen(false)}>
                                        Configuración
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={() => setIsSidebarOpen(false)}>Cerrar</button>
                                </li>
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

            <div className="expenses-box expenses-box--left scroll-categorias">
                <ListOfThings
                    title="Categorías"
                    categories={categorias}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                    onDelete={eliminarCategoria}
                />

                <div className="nueva-categoria-wrapper">
                    {!mostrarFormulario ? (
                        <button className="btn-agregar-categoria" onClick={() => setMostrarFormulario(true)}>
                            Añadir categoría
                        </button>
                    ) : (
                        <div className="nueva-categoria">
                            <input
                                type="text"
                                placeholder="Nueva categoría"
                                value={nuevaCategoria}
                                onChange={e => setNuevaCategoria(e.target.value.toUpperCase())}
                            />
                            <button onClick={agregarCategoria}>Añadir</button>
                            <button onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="expenses-box expenses-box--right">
                {formularioActivo && selectedCategory && selectedCategory !== "ALL" && (
                    <form className="gasto-form" onSubmit={agregarGasto}>
                        <h4>{editandoGasto ? `Editar gasto en ${selectedCategory}` : `Agregar gasto a ${selectedCategory}`}</h4>
                        <input name="nombre" placeholder="Nombre" required maxLength={30} />
                        <input name="monto" type="number" placeholder="Monto" required />
                        <input name="fecha" type="date" required />
                        <button type="submit">{editandoGasto ? "Guardar cambios" : "Agregar"}</button>
                        <button type="button" onClick={() => {
                            setFormularioActivo(false);
                            setEditandoGasto(null);
                        }}>Cerrar</button>
                    </form>
                )}

                {(selectedCategory === null || selectedCategory === "ALL"
                    ? categorias.filter(c => c !== "ALL")
                    : [selectedCategory]
                ).map((cat, idx) => (
                    <div key={idx} className="category-card">
                        <div className="category-header">
                            <h3 className="category-title">{cat}</h3>
                            {cat !== "ALL" && (
                                <button
                                    className="btn-agregar-gasto"
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setFormularioActivo(true);
                                        setEditandoGasto(null);
                                    }}
                                >
                                    Añadir gasto
                                </button>
                            )}
                        </div>

                        {gastosPorCategoria[cat]?.map((gasto, i) => (
                            <div key={i} className="gasto-item">
                                <span className="gasto-nombre" title={gasto.nombre}>
                                    {gasto.nombre}
                                </span>
                                <span className="gasto-monto gasto-negativo">
                                    -${gasto.monto.toLocaleString()}
                                </span>
                                <div className="gasto-acciones">
                                    <span className="gasto-fecha">{gasto.fecha}</span>

                                    <button
                                        className="btn-editar-gasto"
                                        title="Editar gasto"
                                        onClick={() => setEditandoGasto({ categoria: cat, index: i, ...gasto })}
                                    >
                                        ✏️
                                    </button>

                                    <button
                                        className="btn-eliminar-gasto"
                                        onClick={() => eliminarGasto(cat, i)}
                                        title="Eliminar gasto"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
