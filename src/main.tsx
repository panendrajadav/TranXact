import { createRoot } from "react-dom/client";
import { AlgoWalletProvider } from "./contexts/WalletProvider";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AlgoWalletProvider>
    <App />
  </AlgoWalletProvider>
);
