export default function DatabaseUsageBar({ dbSize, userSize }) {
    const percentage = Math.min((dbSize / userSize) * 100, 100);

    // Definir colores según el porcentaje
    let barColor = "#4CAF50"; // Verde
    if (percentage > 50) barColor = "#FFC107"; // Amarillo
    if (percentage > 80) barColor = "#F44336"; // Rojo

    return (
        <div style={{ width: "100%", maxWidth: "400px", padding: "10px", fontFamily: "Arial, sans-serif" }}>
            <div style={{ fontSize: "14px", marginBottom: "5px", color: "#555" }}>
                Uso de la Base de Datos: {dbSize.toFixed(2)}MB / {userSize.toFixed(2)}MB
            </div>
            <div style={{
                width: "100%",
                backgroundColor: "#ddd",
                borderRadius: "8px",
                overflow: "hidden",
                height: "20px",
                position: "relative"
            }}>
                <div style={{
                    width: `${percentage}%`,
                    backgroundColor: barColor,
                    height: "100%",
                    transition: "width 0.5s ease-in-out"
                }}></div>
            </div>
            <div style={{ fontSize: "12px", marginTop: "5px", color: "#777" }}>
                {percentage.toFixed(2)}% utilizado
            </div>
        </div>
    );
}
