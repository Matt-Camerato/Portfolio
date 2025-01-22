import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

interface ScrollIndicatorProps {
  color: string;
  bottom?: number;
  size?: "medium" | "large";
  scrollAmount?: number;
  className?: string;
}

const ScrollIndicator = ({
  color,
  size = "medium",
  bottom = -100,
  scrollAmount = 900,
  className = "",
}: ScrollIndicatorProps) => {
  const indicatorRef = useRef<HTMLDivElement>(null);

  const getFontSize = () => {
    return size === "medium" ? "60px" : "120px";
  };

  const handleClick = () => {
    if (!indicatorRef.current) return;

    const scrollContainer = indicatorRef.current.closest(".screen-content");

    if (scrollContainer) {
      const currentPosition = scrollContainer.scrollTop;
      scrollContainer.scrollTo({
        top: currentPosition + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      ref={indicatorRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <FontAwesomeIcon
        icon={faChevronDown}
        className={`scroll-indicator ${className}`}
        style={{ color, fontSize: getFontSize(), bottom: bottom }}
      />
    </motion.div>
  );
};

export default ScrollIndicator;
