import { useRef } from "react";
import Draggable from "react-draggable";
import { FaTimes } from "react-icons/fa";
import Terminal from "./Terminal";

const Window = ({ openWindows, icons, win, closeWindow }) => {
  const nodeRef = useRef(null);
  return (
    <Draggable key={win} handle=".window-header" nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        style={{
          position: "absolute",
          top: `${100 + openWindows.indexOf(win) * 30}px`,
          left: `${150 + openWindows.indexOf(win) * 30}px`,
          width: "300px",
          height: "250px",
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "10px",
          // boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          // display: "flex",
          // flexDirection: "column",
          // border: "1px solid rgb(245, 247, 245)",
        }}
      >
        <div
          className="window-header"
          style={{
            background: "#555",
            color: "white",
            // padding: "5px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "grab",
            // borderBottom: "1px solid #00ff00",
            fontSize: "10px",
            // height: "fit-content",
            height: "20px",
            padding: "0 10px",
            // border: "1px solidrgb(245, 247, 245)",
          }}
        >
          <span style={{ fontFamily: "sans-serif", color: "lightgray" }}>
            {icons.find((item) => item.id === win)?.label}
          </span>
          <FaTimes
            onClick={() => closeWindow(win)}
            style={{ cursor: "pointer", color: "lightgray" }}
          />
        </div>

        <Terminal />
      </div>
    </Draggable>
  );
};

export default Window;
