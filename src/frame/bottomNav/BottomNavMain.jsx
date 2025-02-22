import { useState } from "react";
import { FaFolderOpen, FaTerminal, FaCog } from "react-icons/fa";
import Window from "../content/Window";

const dockItems = [
  {
    id: "terminal",
    icon: <FaTerminal style={{ borderRadius: "5px" }} />,
    label: "Terminal",
  },
  // {
  //   id: "file-explorer",
  //   icon: <FaFolderOpen style={{ borderRadius: "5px" }} />,
  //   label: "File Explorer",
  // },
  // {
  //   id: "settings",
  //   icon: <FaCog style={{ borderRadius: "5px" }} />,
  //   label: "Settings",
  // },
];

const BottomNavMain = () => {
  const [openWindows, setOpenWindows] = useState([]);

  const openWindow = (id) => {
    if (!openWindows.includes(id)) {
      setOpenWindows([...openWindows, id]);
    }
  };

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter((win) => win !== id));
  };

  return (
    <>
      <div
        style={{
          height: "40px",
          width: "auto",
          minWidth: "300px",
          position: "fixed",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(25px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
          padding: "0 15px",
          gap: "12px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {dockItems.map((item) => (
          <div
            key={item.id}
            onClick={() => openWindow(item.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              position: "relative",
              padding: "8px",
            }}
          >
            <div
              style={{
                fontSize: "15px",
                color: "white",
                padding: "8px",
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "5px",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                background: "rgba(0, 0, 0, 0.8)",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                color: "white",
                opacity: 0,
                transform: "translateY(-10px)",
                transition: "all 0.2s",
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
              className="tooltip"
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Opened Windows */}
      {openWindows.map((win) => (
        <Window
          key={win}
          id={win}
          closeWindow={closeWindow}
          openWindows={openWindows}
          icons={dockItems}
          win={win}
        />
      ))}
    </>
  );
};

// Reusable Window Component

export default BottomNavMain;
