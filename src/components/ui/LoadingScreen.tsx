import { useState } from "react";
import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { ColorPalette } from "../../utils/colors";

export function LoadingScreen() {
  const { progress } = useProgress();
  const [showEntrance, setShowEntrance] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const handleLoadingComplete = () => {
    setTimeout(() => {
      setShowEntrance(true);
    }, 500);
  };

  const handleEnter = () => {
    setHasEntered(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!hasEntered && (
        <motion.div
          key="loading-container"
          className="loading-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          {!showEntrance ? (
            <motion.div
              key="loading"
              className="loading-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3 }}
            >
              <h1>Hi, I'm Matt</h1>
              <div className="loading-bar">
                <motion.div
                  className="loading-progress"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.max(progress, 100)}%` }}
                  transition={{ duration: 2 }}
                  onAnimationComplete={handleLoadingComplete}
                  style={{ backgroundColor: ColorPalette.Yellow }}
                />
              </div>
              <p>{Math.round(progress)}%</p>
            </motion.div>
          ) : (
            <motion.div
              key="entrance"
              className="entrance-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3 }}
            >
              <h1>Welcome to my workspace...</h1>
              <motion.button
                className="enter-button"
                onClick={handleEnter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ backgroundColor: ColorPalette.Yellow }}
              >
                Enter
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
