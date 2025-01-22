import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCube,
  faGamepad,
  faHeart,
  faMapMarkerAlt,
  faMusic,
  faPlane,
  faCode,
  faFireFlameSimple,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ColorPalette } from "../../../utils/colors";
import ScrollIndicator from "../ScrollIndicator";
import Carousel from "./Carousel";

const currentItems = [
  {
    title: "Playing",
    icon: faGamepad,
    color: ColorPalette.Green,
    text: "Black Ops 6, Marvel Rivals, and more!",
  },
  {
    title: "Learning",
    icon: faHeart,
    color: ColorPalette.Pink,
    text: "Three.js, React Three Fiber, Socket.io",
  },
  {
    title: "Working On",
    icon: faCode,
    color: ColorPalette.Yellow,
    text: "Hand-drawn browser game and this portfolio!",
  },
];

const funFacts = [
  {
    text: "Based in New Hampshire, USA",
    icon: faMapMarkerAlt,
    color: ColorPalette.Blue,
  },
  { text: "Favorite Game: Minecraft", icon: faCube, color: ColorPalette.Green },
  {
    text: "Love playing piano & making music",
    icon: faMusic,
    color: ColorPalette.Purple,
  },
  {
    text: "Always have a candle lit",
    icon: faFireFlameSimple,
    color: ColorPalette.Orange,
  },
  {
    text: "Dream of traveling to Japan",
    icon: faPlane,
    color: ColorPalette.Indigo,
  },
  {
    text: "Favorite Show: Game of Thrones",
    icon: faCrown,
    color: ColorPalette.Yellow,
  },
];

const navButtons = [
  { text: "Gaming", page: "gaming", color: ColorPalette.Blue },
  { text: "Interests", page: "interests", color: ColorPalette.Orange },
];

interface AboutPageProps {
  setPage: (page: string) => void;
}

const AboutPage = ({ setPage }: AboutPageProps) => {
  const [welcomeRef, welcomeInView] = useInView({ triggerOnce: true });
  const [currentRef, currentInView] = useInView({ triggerOnce: true });
  const [factsRef, factsInView] = useInView({ triggerOnce: true });
  const [navRef, navInView] = useInView({ triggerOnce: true });

  return (
    <div className="about-page">
      <motion.div
        className="profile-section"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="profile-image">
          <div
            className="image-accent"
            style={{ backgroundColor: ColorPalette.Yellow }}
          />
          <img src="/images/about/profile.jpg" alt="Profile" />
        </div>
      </motion.div>

      <motion.div
        ref={welcomeRef}
        className="welcome-section"
        initial={{ opacity: 0, y: 40 }}
        animate={welcomeInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <h1 style={{ color: ColorPalette.Yellow }}>Hey, I'm Matt!</h1>
        <p>
          I'm a UI/UX designer and game developer with a passion for creating
          immersive experiences. When I'm not coding or designing games, you can
          usually find me watching YouTube, gaming, or spending time with my
          family.
        </p>
        <ScrollIndicator color={ColorPalette.Yellow} />
      </motion.div>

      <motion.div ref={currentRef} className="current-section">
        <h2>Currently...</h2>
        <div className="current-items">
          {currentItems.map((item, index) => (
            <motion.div
              key={index}
              className="current-item"
              initial={{ opacity: 0, y: 30 }}
              animate={currentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
            >
              <FontAwesomeIcon icon={item.icon} style={{ color: item.color }} />
              <h3>{item.title}</h3>
              {item.text.split("\n").map((line, lineIndex) => (
                <p key={lineIndex}>{line}</p>
              ))}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        ref={factsRef}
        className="fun-facts"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={factsInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h2>Fun Facts</h2>
        <Carousel items={funFacts} />
      </motion.div>

      <motion.div
        ref={navRef}
        className="navigation-section"
        initial={{ opacity: 0, y: 50 }}
        animate={navInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "backOut" }}
      >
        <h2>Explore More</h2>
        <div className="nav-buttons">
          {navButtons.map((button) => (
            <motion.button
              key={button.page}
              onClick={() => setPage(button.page)}
              style={{ backgroundColor: button.color }}
              whileHover={{
                y: -5,
                backgroundColor: ColorPalette.Yellow,
                color: ColorPalette.Black,
              }}
              transition={{ duration: 0.2 }}
            >
              {button.text}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
