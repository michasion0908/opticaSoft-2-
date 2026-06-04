import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpeg";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Usuario/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Credenciales incorrectas");
        setLoading(false);
        return;
      }
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      navigate("/home", { replace: true });
    } catch {
      setError("No se pudo conectar al servidor");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f0f4f8",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        display: "flex",
        width: "860px",
        maxWidth: "95vw",
        minHeight: "500px",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)"
      }}>

        {/* Panel izquierdo - Formulario */}
        <div style={{
          flex: 1,
          background: "#ffffff",
          padding: "50px 45px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <div style={{ marginBottom: "8px" }}>
            <span style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#4A90D9",
              letterSpacing: "2px",
              textTransform: "uppercase"
            }}>Bienvenido</span>
          </div>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#1a2b4a",
            margin: "0 0 6px 0"
          }}>Iniciar Sesión</h2>
          <p style={{
            fontSize: "14px",
            color: "#8a94a6",
            margin: "0 0 32px 0"
          }}>Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#4a5568",
                marginBottom: "8px"
              }}>Correo Electrónico</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "16px",
                  color: "#a0aec0"
                }}>✉</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 40px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: "#2d3748",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    background: "#f8fafc"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#4A90D9"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#4a5568",
                marginBottom: "8px"
              }}>Contraseña</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "16px",
                  color: "#a0aec0"
                }}>🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 40px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: "#2d3748",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    background: "#f8fafc"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#4A90D9"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            </div>

            {error && (
              <div style={{
                background: "#fff5f5",
                border: "1px solid #feb2b2",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "13px",
                color: "#c53030",
                marginBottom: "20px"
              }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                background: loading ? "#90b8e0" : "linear-gradient(135deg, #4A90D9, #2c6fad)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.5px",
                transition: "opacity 0.2s"
              }}
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>

        {/* Panel derecho - Bienvenida */}
        <div style={{
          width: "340px",
          background: "linear-gradient(160deg, #2c6fad 0%, #1a4a7a 60%, #0f2d4d 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "50px 35px",
          color: "#fff",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Círculos decorativos */}
          <div style={{
            position: "absolute",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.08)",
            top: "-60px",
            right: "-60px"
          }} />
          <div style={{
            position: "absolute",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.08)",
            bottom: "-40px",
            left: "-40px"
          }} />

          {/* Logo */}
          <img
            src={logo}
            alt="Óptica Maryen"
            style={{
              width: "180px",
              borderRadius: "12px",
              marginBottom: "24px",
              background: "#fff",
              padding: "10px",
              boxSizing: "border-box"
            }}
          />

          <div style={{
            width: "40px",
            height: "2px",
            background: "rgba(255,255,255,0.4)",
            margin: "4px auto 16px"
          }} />

          <p style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.75)",
            lineHeight: "1.7",
            margin: 0
          }}>
            Sistema de gestión integral para el control de pacientes, inventario y ventas.
          </p>

          <p style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.4)",
            marginTop: "40px"
          }}>v1.0 · 2025</p>
        </div>

      </div>
    </div>
  );
}

export default Login;
