import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { FocusProvider } from "./components/context/FocusContext";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import { Navbar } from "./components/ui/Navbar";
import { Scene } from "./components/canvas/Scene";

function App() {
  return (
    <>
      <LoadingScreen />

      <FocusProvider>
        <Navbar />
        <Scene />
      </FocusProvider>

      {/* Vercel Analytics */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
