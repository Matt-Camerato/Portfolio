import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Navbar } from "./components/ui/Navbar";
import { Scene } from "./components/canvas/Scene";
import { Overlay } from "./components/ui/Overlay";
import { OverlayProvider } from "./components/context/OverlayContext";

function App() {
  return (
    <>
      <OverlayProvider>
        <Navbar />
        <Scene />
        <Overlay />
      </OverlayProvider>
      <SpeedInsights />
      <Analytics />
    </>
  );
}

export default App;
