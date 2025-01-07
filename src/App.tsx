import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { OverlayProvider } from "./components/context/OverlayContext";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import { Navbar } from "./components/ui/Navbar";
import { Scene } from "./components/canvas/Scene";
import { Overlay } from "./components/ui/Overlay";

function App() {
  return (
    <>
      <LoadingScreen />

      <OverlayProvider>
        <Navbar />
        <Scene />
        <Overlay />
      </OverlayProvider>

      {/* Vercel Analytics */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
