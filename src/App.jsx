import "./App.css";
import BottomNavMain from "./frame/bottomNav/BottomNavMain";
import ContentMain from "./frame/content/ContentMain";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <ContentMain />
      <BottomNavMain />
    </div>
  );
}

export default App;
