import { useState, useRef, useEffect } from "react";
import { readdir, stat, create, remove, FileTypes } from "../../fileSystem";

const Terminal = () => {
  const [history, setHistory] = useState([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [inputValue, setInputValue] = useState("");
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (command) => {
    const parts = command.trim().split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    try {
      switch (cmd) {
        case "ls":
          const contents = readdir(currentPath);
          return contents
            .map(
              (item) =>
                `${item.name}${item.type === FileTypes.DIRECTORY ? "/" : ""}`
            )
            .join("  ");

        case "cd":
          const newPath = args[0] || "/";
          let resolvedPath;

          if (newPath === "..") {
            // Get parent directory by removing last segment
            resolvedPath = currentPath.split("/").slice(0, -1).join("/") || "/";
          } else {
            resolvedPath = newPath.startsWith("/")
              ? newPath
              : `${currentPath}/${newPath}`;
          }

          // Normalize path to remove double slashes
          resolvedPath = resolvedPath.replace(/\/+/g, "/");
          if (resolvedPath !== "/" && resolvedPath.endsWith("/")) {
            resolvedPath = resolvedPath.slice(0, -1);
          }

          // Verify the path exists and is a directory
          const stats = stat(resolvedPath);
          if (stats.type !== FileTypes.DIRECTORY) {
            throw new Error("Not a directory");
          }
          setCurrentPath(resolvedPath);
          return "";

        case "pwd":
          return currentPath;

        case "mkdir":
          if (!args[0]) throw new Error("Directory name required");
          create(`${currentPath}/${args[0]}`, FileTypes.DIRECTORY);
          return `Created directory ${args[0]}`;

        case "touch":
          if (!args[0]) throw new Error("File name required");
          create(`${currentPath}/${args[0]}`, FileTypes.FILE);
          return `Created file ${args[0]}`;

        case "rm":
          if (!args[0]) throw new Error("Path required");
          remove(`${currentPath}/${args[0]}`);
          return `Removed ${args[0]}`;

        case "clear":
          setHistory([]);
          return null;

        default:
          throw new Error("Command not found");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const command = inputValue.trim();

      // Add command to history
      setHistory((prev) => [
        ...prev,
        { text: `${currentPath}$ ${command}`, isCommand: true },
      ]);

      if (command) {
        try {
          const output = executeCommand(command);
          if (output !== null) {
            setHistory((prev) => [...prev, { text: output, isCommand: false }]);
          }
        } catch (error) {
          setHistory((prev) => [
            ...prev,
            { text: `Error: ${error.message}`, isCommand: false },
          ]);
        }
      }

      setInputValue("");
    }
  };

  return (
    <div
      ref={terminalRef}
      style={{
        // width: "100%",
        // height: "100%",
        height: "230px",
        minHeight: "100%",
        backgroundColor: "#1a1a1a",
        // color: "#00ff00",
        color: "white",
        fontFamily: "monospace",
        padding: "10px",
      }}
    >
      {history.map((entry, i) => (
        <div
          key={i}
          style={{
            whiteSpace: "pre-wrap",
            marginBottom: "1px",
            fontSize: "10px",
          }}
        >
          {entry.text}
        </div>
      ))}
      <div style={{ display: "flex", fontSize: "10px", alignItems: "center" }}>
        <span>{currentPath}$ </span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleCommand}
          style={{
            backgroundColor: "transparent",
            border: "none",
            // color: "#00ff00",
            fontFamily: "monospace",
            flexGrow: 1,
            outline: "none",
            fontSize: "10px",
            color: "white",
          }}
          autoFocus
        />
      </div>
    </div>
  );
};

export default Terminal;
