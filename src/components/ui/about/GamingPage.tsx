import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { ColorPalette } from "../../../utils/colors";

interface Game {
  id: string;
  title: string;
  description?: string;
  image?: string;
  rating?: number;
  genres?: string[];
  status?: string;
}

const favoriteGames: Game[] = [
  {
    id: "minecraft",
    title: "Minecraft",
    description:
      "The ultimate creative sandbox that simply never gets old. It is easily my favorite and most played game ever, and one of the main reasons I chose to pursue a career in game development from a young age. I wouldn't be where I am today without this game.",
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
  },
  {
    id: "marvelrivals",
    title: "Marvel Rivals",
    status: "Just Started",
    image: "rivals-icon.jpg",
  },
  {
    id: "shadows",
    title: "Assassin's Creed: Shadows",
    status: "Coming Soon",
    image: "shadows-icon.jpg",
  },
];

const libraryGames: Game[] = [
  {
    id: "elden-ring",
    title: "Elden Ring",
    rating: 5,
    genres: ["RPG", "Action"],
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    rating: 5,
    genres: ["RPG", "Action"],
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    rating: 5,
    genres: ["RPG", "Action"],
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    rating: 5,
    genres: ["RPG", "Action"],
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    rating: 5,
    genres: ["RPG", "Action"],
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    rating: 5,
    genres: ["Strategy", "Action"],
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    rating: 5,
    genres: ["Strategy", "Action"],
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    rating: 5,
    genres: ["Strategy", "Action"],
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    rating: 5,
    genres: ["Adventure", "Action"],
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    rating: 5,
    genres: ["Adventure", "Action"],
  },
];

const genres = ["All", "RPG", "Action", "Strategy", "Adventure"];

const GamingPage = () => {
  const [favoritesRef, favoritesInView] = useInView({ triggerOnce: true });
  const [currentRef, currentInView] = useInView({ triggerOnce: true });
  const [libraryRef, libraryInView] = useInView({ triggerOnce: true });

  const [currentFavorite, setCurrentFavorite] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFavorite((prev) => (prev + 1) % favoriteGames.length);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  const filteredGames = libraryGames.filter(
    (game) => selectedGenre === "All" || game.genres?.includes(selectedGenre)
  );

  return (
    <div className="gaming-page">
      <motion.div
        className="gaming-header"
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="header-overlay">
          <h1>Gaming</h1>
          <p>My job, my hobby, and my passion.</p>
        </div>
        <img src="/images/about/gaming/controller.png" alt="Gaming" />
        <FontAwesomeIcon
          icon={faChevronDown}
          className="scroll-indicator"
          style={{ color: ColorPalette.Yellow }}
        />
      </motion.div>

      <motion.div
        ref={favoritesRef}
        className="favorites-section"
        initial={{ opacity: 0, y: 50 }}
        animate={favoritesInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
      >
        <h2>All-Time Favorites</h2>
        <div className="favorites-carousel">
          <button
            className="carousel-button prev"
            onClick={() =>
              setCurrentFavorite((prev) =>
                prev === 0 ? favoriteGames.length - 1 : prev - 1
              )
            }
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentFavorite}
              className="carousel-item"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={`/images/about/gaming/${favoriteGames[currentFavorite].image}`}
                alt={favoriteGames[currentFavorite].title}
              />
              <div className="game-info">
                <h3>{favoriteGames[currentFavorite].title}</h3>
                <p>{favoriteGames[currentFavorite].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            className="carousel-button next"
            onClick={() =>
              setCurrentFavorite((prev) => (prev + 1) % favoriteGames.length)
            }
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </motion.div>

      <motion.div
        ref={currentRef}
        className="current-section"
        initial={{ opacity: 0, y: 30 }}
        animate={currentInView ? { opacity: 1, y: 0 } : {}}
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
              transition={{ delay: index * 0.4 }}
              onHoverStart={() => setFlippedCard(game.id)}
              onHoverEnd={() => setFlippedCard(null)}
            >
              <div className="card-front">
                <img
                  src={`/images/about/gaming/${game.image}`}
                  alt={game.title}
                />
              </div>
              <div className="card-back">
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
      >
        <h2>My Library</h2>
        <div className="genre-filters">
          {genres.map((genre) => (
            <button
              key={genre}
              className={selectedGenre === genre ? "active" : ""}
              onClick={() => setSelectedGenre(genre)}
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
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      style={{
                        color:
                          i < (game.rating || 0)
                            ? ColorPalette.Yellow
                            : "#555555",
                      }}
                    />
                  ))}
                </div>
                <div className="genres">
                  {game.genres?.map((genre) => (
                    <span key={genre} className="genre-tag">
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
