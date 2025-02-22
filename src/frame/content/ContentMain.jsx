import { useState } from "react";
import { FaFileAlt, FaFolderOpen, FaEnvelope, FaUser } from "react-icons/fa";
import CustomWindow from "./Window";

const icons = [
  // { id: "resume", label: "Resume", icon: <FaFileAlt /> },
  // { id: "projects", label: "Projects", icon: <FaFolderOpen /> },
  // { id: "contact", label: "Contact", icon: <FaEnvelope /> },
  // { id: "about", label: "About Me", icon: <FaUser /> },
];

const ContentMain = () => {
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        // background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0)), url(${background}) center/cover no-repeat`,
        position: "relative",
        padding: "20px",
        backgroundColor: "black",
      }}
    >
      {/* Desktop Icons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "absolute",
          top: "10px",
          left: "10px",
        }}
      >
        {icons.map((item) => (
          <div
            key={item.id}
            onClick={() => openWindow(item.id)}
            style={{
              textDecoration: "none",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              // gap: "5px",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div
              style={{
                fontSize: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "40px",
                height: "30px",
              }}
            >
              {item.icon}
            </div>
            <span style={{ fontSize: "10px", fontWeight: "500" }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Opened Windows */}
      {openWindows.map((win) => (
        <CustomWindow
          key={win}
          openWindows={openWindows}
          icons={icons}
          win={win}
          closeWindow={closeWindow}
        />
      ))}
    </div>
  );
};

export default ContentMain;
