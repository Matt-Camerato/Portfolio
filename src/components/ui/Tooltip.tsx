import { useState, useEffect } from "react";
import { useFocus } from "../context/FocusContext";

export const Tooltip = () => {
  const { tooltipContent } = useFocus();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    tooltipContent && (
      <div
        className="tooltip"
        style={{
          left: mousePos.x,
          top: mousePos.y - 10,
        }}
      >
        <div className="tooltip-content">{tooltipContent}</div>
      </div>
    )
  );
};
