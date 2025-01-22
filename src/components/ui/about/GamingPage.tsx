import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { ColorPalette } from "../../../utils/colors";
import ScrollIndicator from "../ScrollIndicator";
import AnimatedController from "./AnimatedController";

interface Game {
  id: string;
  title: string;
  description?: string;
  image?: string;
  releaseDate?: string;
  developer?: string;
  color?: string;
  genres?: string[];
  status?: string;
}

const favoriteGames: Game[] = [
  {
    id: "minecraft",
    title: "Minecraft",
    description:
      "The ultimate creative sandbox that never gets old. It is easily my favorite and most played game ever, and one of the main reasons I chose to pursue a career in game development from a young age. I wouldn't be where I am today without this game.",
    image: "minecraft.jpg",
  },
  {
    id: "obra-dinn",
    title: "Return of the Obra Dinn",
    description:
      "A puzzle game that has captivated me with its unique premise, gameplay, and visual style. I've played this one quite a few times and can easily say it's one of my favorite gaming experiences of all time, as well as a major inspiration for me as a game developer.",
    image: "obra-dinn.jpg",
  },
  {
    id: "witcher3",
    title: "The Witcher 3: Wild Hunt",
    description:
      "A masterpiece of storytelling and world-building, this one easily ranks as one of the greatest games of all time. The story is one of the best I've ever experienced in a video game, and reading the books as well as watching the Netflix show has only made me love it more. I can't wait for the next installment.",
    image: "witcher3.jpg",
  },
  {
    id: "stardew",
    title: "Stardew Valley",
    description:
      "A charming and relaxing farming simulation game that has brought me countless hours of enjoyment. As a solo developer, the story behind Eric Barone's creation of this game is truly inspiring.",
    image: "stardew.jpg",
  },
];

const currentGames: Game[] = [
  {
    id: "bo6",
    title: "Black Ops 6",
    status: "Currently Playing",
    image: "bo6-icon.jpg",
    color: ColorPalette.Orange,
  },
  {
    id: "marvelrivals",
    title: "Marvel Rivals",
    status: "Just Started",
    image: "rivals-icon.jpg",
    color: ColorPalette.Indigo,
  },
  {
    id: "shadows",
    title: "Assassin's Creed: Shadows",
    status: "Coming Soon",
    image: "shadows-icon.jpg",
    color: ColorPalette.Pink,
  },
];

const libraryGames: Game[] = [
  {
    id: "ark-survival-evolved",
    title: "Ark: Survival Evolved",
    releaseDate: "2015-06-02",
    developer: "Studio Wildcard",
    genres: ["Action", "Survival"],
  },
  {
    id: "ac3",
    title: "Assassin's Creed 3: Liberation",
    releaseDate: "2012-10-12",
    developer: "Ubisoft",
    genres: ["Action", "Adventure"],
  },
  {
    id: "acodyssey",
    title: "Assassin's Creed Odyssey",
    releaseDate: "2018-10-02",
    developer: "Ubisoft",
    genres: ["Action", "Adventure", "RPG"],
  },
  {
    id: "acorigins",
    title: "Assassin's Creed Origins",
    releaseDate: "2017-10-27",
    developer: "Ubisoft",
    genres: ["Action", "Adventure", "RPG"],
  },
  {
    id: "acvalhalla",
    title: "Assassin's Creed Valhalla",
    releaseDate: "2020-11-10",
    developer: "Ubisoft",
    genres: ["Action", "Adventure", "RPG"],
  },
  {
    id: "aviary-attorney",
    title: "Aviary Attorney",
    releaseDate: "2015-12-22",
    developer: "Sketchy Logic",
    genres: ["Adventure", "Indie", "Puzzle"],
  },
  {
    id: "bo3",
    title: "Call of Duty: Black Ops 3",
    releaseDate: "2015-11-06",
    developer: "Treyarch",
    genres: ["Action", "FPS"],
  },
  {
    id: "bo6",
    title: "Call of Duty: Black Ops 6",
    releaseDate: "2024-10-25",
    developer: "Treyarch",
    genres: ["Action", "FPS"],
  },
  {
    id: "codmw",
    title: "Call of Duty: Modern Warfare",
    releaseDate: "2019-10-25",
    developer: "Infinity Ward",
    genres: ["Action", "FPS"],
  },
  {
    id: "core-keeper",
    title: "Core Keeper",
    releaseDate: "2022-03-08",
    developer: "Pugstorm",
    genres: ["Indie", "Sandbox", "Survival"],
  },
  {
    id: "cyberpunk2077",
    title: "Cyberpunk 2077",
    releaseDate: "2020-12-10",
    developer: "CD Projekt Red",
    genres: ["Action", "Adventure", "RPG"],
  },
  {
    id: "dont-starve",
    title: "Don't Starve",
    releaseDate: "2013-04-23",
    developer: "Klei Entertainment",
    genres: ["Adventure", "Indie", "Survival"],
  },
  {
    id: "dying-light",
    title: "Dying Light",
    releaseDate: "2015-01-26",
    developer: "Techland",
    genres: ["Action", "Adventure", "Horror"],
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    releaseDate: "2022-02-25",
    developer: "FromSoftware",
    genres: ["Action", "Adventure", "RPG"],
  },
  {
    id: "forager",
    title: "Forager",
    releaseDate: "2019-04-18",
    developer: "HopFrog",
    genres: ["Indie", "Survival"],
  },
  {
    id: "got",
    title: "Ghosts of Tsushima",
    releaseDate: "2020-07-17",
    developer: "Sucker Punch Productions",
    genres: ["Adventure", "Action", "RPG"],
  },
  {
    id: "gta5",
    title: "Grand Theft Auto 5",
    releaseDate: "2013-09-17",
    developer: "Rockstar Games",
    genres: ["Action", "Adventure", "RPG"],
  },
  {
    id: "green-hell",
    title: "Green Hell",
    releaseDate: "2018-08-29",
    developer: "Creepy Jar",
    genres: ["Horror", "Indie", "Survival"],
  },
  {
    id: "human-fall-flat",
    title: "Human: Fall Flat",
    releaseDate: "2016-07-22",
    developer: "No Brakes Games",
    genres: ["Adventure", "Indie", "Puzzle"],
  },
  {
    id: "lethal-company",
    title: "Lethal Company",
    releaseDate: "2023-10-09",
    developer: "Zeekerss",
    genres: ["Horror", "Indie", "Survival"],
  },
  {
    id: "marvel-rivals",
    title: "Marvel Rivals",
    releaseDate: "2024-12-06",
    developer: "NetEase Games",
    genres: ["Action"],
  },
  {
    id: "minecraft",
    title: "Minecraft",
    releaseDate: "2011-11-18",
    developer: "Mojang Studios",
    genres: ["Adventure", "Sandbox", "Survival"],
  },
  {
    id: "no-mans-sky",
    title: "No Man's Sky",
    releaseDate: "2016-08-09",
    developer: "Hello Games",
    genres: ["Adventure", "Sandbox", "Survival"],
  },
  {
    id: "pvz",
    title: "Plants vs. Zombies",
    releaseDate: "2009-05-05",
    developer: "PopCap Games",
    genres: ["Indie", "Strategy"],
  },
  {
    id: "overcooked",
    title: "Overcooked",
    releaseDate: "2016-08-02",
    developer: "Ghost Town Games",
    genres: ["Indie", "Simulation"],
  },
  {
    id: "plate-up",
    title: "Plate Up",
    releaseDate: "2022-08-04",
    developer: "It's Happening",
    genres: ["Indie", "Simulation", "Strategy"],
  },
  {
    id: "prison-architect",
    title: "Prison Architect",
    releaseDate: "2013-03-21",
    developer: "Introversion Software",
    genres: ["Indie", "Simulation", "Strategy"],
  },
  {
    id: "rdr2",
    title: "Red Dead Redemption 2",
    releaseDate: "2018-10-26",
    developer: "Rockstar Games",
    genres: ["Action", "Adventure"],
  },
  {
    id: "rotod",
    title: "Return of the Obra Dinn",
    releaseDate: "2018-10-18",
    developer: "Lucas Pope",
    genres: ["Indie", "Puzzle"],
  },
  {
    id: "rimworld",
    title: "RimWorld",
    releaseDate: "2013-11-04",
    developer: "Tynan Sylvester",
    genres: ["Indie", "Simulation", "Strategy"],
  },
  {
    id: "civ6",
    title: "Sid Meier's Civilization 6",
    releaseDate: "2016-10-21",
    developer: "Firaxis Games",
    genres: ["Simulation", "Strategy"],
  },
  {
    id: "slay-the-spire",
    title: "Slay the Spire",
    releaseDate: "2017-11-14",
    developer: "Mega Crit",
    genres: ["Indie", "Strategy"],
  },
  {
    id: "spiritfarer",
    title: "Spiritfarer",
    releaseDate: "2020-08-18",
    developer: "Thunder Lotus Games",
    genres: ["Adventure", "Indie", "Simulation"],
  },
  {
    id: "stardew",
    title: "Stardew Valley",
    releaseDate: "2016-02-26",
    developer: "ConcernedApe",
    genres: ["Adventure", "Indie", "RPG"],
  },
  {
    id: "stranded-deep",
    title: "Stranded Deep",
    releaseDate: "2015-01-23",
    developer: "Beam Team Games",
    genres: ["Adventure", "Indie", "Survival"],
  },
  {
    id: "stray",
    title: "Stray",
    releaseDate: "2022-07-19",
    developer: "BlueTwelve Studio",
    genres: ["Adventure", "Indie"],
  },
  {
    id: "subnautica",
    title: "Subnautica",
    releaseDate: "2014-12-16",
    developer: "Unknown Worlds Entertainment",
    genres: ["Adventure", "Survival"],
  },
  {
    id: "superliminal",
    title: "Superliminal",
    releaseDate: "2019-11-12",
    developer: "Pillow Castle Games",
    genres: ["Adventure", "Indie", "Puzzle"],
  },
  {
    id: "the-escapists",
    title: "The Escapists",
    releaseDate: "2014-08-20",
    developer: "Team17",
    genres: ["Indie", "Strategy"],
  },
  {
    id: "the-forest",
    title: "The Forest",
    releaseDate: "2014-05-30",
    developer: "Endnight Games",
    genres: ["Horror", "Survival"],
  },
  {
    id: "the-mortuary-assistant",
    title: "The Mortuary Assistant",
    releaseDate: "2022-08-02",
    developer: "DarkStone Digital",
    genres: ["Horror", "Indie"],
  },
  {
    id: "the-stanley-parable",
    title: "The Stanley Parable",
    releaseDate: "2013-10-10",
    developer: "Galactic Cafe",
    genres: ["Adventure", "Indie"],
  },
  {
    id: "tvoec",
    title: "The Vanishing of Ethan Carter",
    releaseDate: "2014-09-25",
    developer: "The Astronauts",
    genres: ["Adventure", "Indie", "Puzzle"],
  },
  {
    id: "witcher3",
    title: "The Witcher 3: Wild Hunt",
    releaseDate: "2015-05-18",
    developer: "CD Projekt Red",
    genres: ["Action", "Adventure", "RPG"],
  },
  {
    id: "tos",
    title: "Town of Salem",
    releaseDate: "2014-12-15",
    developer: "BlankMediaGames",
    genres: ["Indie", "Strategy"],
  },
  {
    id: "vampire-survivors",
    title: "Vampire Survivors",
    releaseDate: "2021-12-17",
    developer: "Poncle",
    genres: ["Action", "Indie"],
  },
  {
    id: "what-remains-of-edith-finch",
    title: "What Remains of Edith Finch",
    releaseDate: "2017-04-24",
    developer: "Giant Sparrow",
    genres: ["Adventure", "Indie"],
  },
];

const genres: Map<string, string> = new Map([
  ["All", ColorPalette.White],
  ["Action", ColorPalette.Orange],
  ["Adventure", ColorPalette.Indigo],
  ["Horror", ColorPalette.Pink],
  ["Indie", ColorPalette.Green],
  ["FPS", ColorPalette.Blue],
  ["Puzzle", ColorPalette.Yellow],
  ["RPG", ColorPalette.Purple],
  ["Sandbox", ColorPalette.Pear],
  ["Simulation", ColorPalette.Blue],
  ["Strategy", ColorPalette.Purple],
  ["Survival", ColorPalette.Pink],
]);

const GamingPage = () => {
  const [favoritesRef, favoritesInView] = useInView({ triggerOnce: true });
  const [currentRef, currentInView] = useInView({ triggerOnce: true });
  const [libraryRef, libraryInView] = useInView({ triggerOnce: true });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const getDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % favoriteGames.length);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevious = () => {
    if (isSliding) return;
    setIsSliding(true);
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? favoriteGames.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (isSliding) return;
    setIsSliding(true);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % favoriteGames.length);
  };

  const filteredGames = libraryGames.filter(
    (game) => selectedGenre === "All" || game.genres?.includes(selectedGenre)
  );

  return (
    <div className="gaming-page">
      <motion.div className="gaming-header">
        <AnimatedController />

        <motion.div
          className="title-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <h1>Gaming</h1>
          <motion.div
            className="title-underline"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 3 }}
          />
          <p>My career, my hobby, and my passion.</p>
          <ScrollIndicator color={ColorPalette.Yellow} scrollAmount={1000} />
        </motion.div>
      </motion.div>

      <motion.div
        ref={favoritesRef}
        className="favorites-section"
        initial={{ opacity: 0, y: 50 }}
        animate={favoritesInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h2>All-Time Favorites</h2>
        <div className="favorites-carousel">
          <button className="carousel-button prev" onClick={handlePrevious}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <div className="carousel-container">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={{
                  enter: (direction: number) => ({
                    x: direction > 0 ? 1000 : -1000,
                    opacity: 0,
                  }),
                  center: {
                    zIndex: 1,
                    x: 0,
                    opacity: 1,
                  },
                  exit: (direction: number) => ({
                    zIndex: 0,
                    x: direction < 0 ? 1000 : -1000,
                    opacity: 0,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="carousel-item"
                onAnimationComplete={() => setIsSliding(false)}
              >
                <img
                  src={`/images/about/gaming/${favoriteGames[currentIndex].image}`}
                  alt={favoriteGames[currentIndex].title}
                />
                <div className="game-info">
                  <h3>{favoriteGames[currentIndex].title}</h3>
                  <p>{favoriteGames[currentIndex].description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button className="carousel-button next" onClick={handleNext}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </motion.div>

      <motion.div
        ref={currentRef}
        className="current-section"
        initial={{ opacity: 0, y: 30 }}
        animate={currentInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h2>Current & Upcoming</h2>
        <div className="current-grid">
          {currentGames.map((game, index) => (
            <motion.div
              key={game.id}
              className={`game-card ${
                flippedCard === game.id ? "flipped" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={currentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + index * 0.4 }}
              onHoverStart={() => setFlippedCard(game.id)}
              onHoverEnd={() => setFlippedCard(null)}
            >
              <div className="card-front">
                <img
                  src={`/images/about/gaming/${game.image}`}
                  alt={game.title}
                />
              </div>
              <div
                className="card-back"
                style={{ backgroundColor: game.color }}
              >
                <h3>{game.title}</h3>
                <p>{game.status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        ref={libraryRef}
        className="library-section"
        initial={{ opacity: 0, y: 30 }}
        animate={libraryInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h2>My Library</h2>
        <div className="genre-filters">
          {Array.from(genres.keys()).map((genre) => (
            <button
              key={genre}
              className={selectedGenre === genre ? "active" : ""}
              onClick={() => setSelectedGenre(genre)}
              style={
                selectedGenre === genre
                  ? { backgroundColor: genres.get(genre) }
                  : {}
              }
            >
              {genre}
            </button>
          ))}
        </div>
        <motion.div className="library-grid" layout>
          <AnimatePresence>
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                className="library-card"
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                <h3>{game.title}</h3>
                <h4>{game.developer}</h4>
                <p>{"Released: " + getDate(game.releaseDate!)}</p>
                <div className="genres">
                  {game.genres?.map((genre) => (
                    <span
                      key={genre}
                      className="genre-tag"
                      style={{ backgroundColor: genres.get(genre) }}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GamingPage;
