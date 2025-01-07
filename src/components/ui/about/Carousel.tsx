import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

interface CarouselProps {
  items: {
    text: string;
    icon: any;
    color: string;
  }[];
}

const Carousel = ({ items }: CarouselProps) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRotation((prev) => prev + 0.3);
    }, 20); // Adjust speed here

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="carousel">
      {items.map((item, index) => {
        const angle = (index * (360 / items.length) + rotation) % 360;
        const x = Math.cos((angle * Math.PI) / 180) * 300;
        const z = Math.sin((angle * Math.PI) / 180) * 300;
        const scale = (z + 300) / 600;

        return (
          <motion.div
            key={index}
            className="carousel-item"
            animate={{
              x,
              scale,
              zIndex: Math.round(scale * 100),
            }}
            transition={{ duration: 0 }}
          >
            <p>{item.text}</p>
            <FontAwesomeIcon icon={item.icon} style={{ color: item.color }} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default Carousel;
