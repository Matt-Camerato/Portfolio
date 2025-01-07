import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCube,
  faChevronDown,
  faBook,
  faDumbbell,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { ColorPalette } from "../../../utils/colors";
import BookShelf from "./BookShelf";

const InterestsPage = () => {
  const [musicRef, musicInView] = useInView({ triggerOnce: true });
  const [readingRef, readingInView] = useInView({ triggerOnce: true });
  const [japanRef, japanInView] = useInView({ triggerOnce: true });
  const [miscRef, miscInView] = useInView({ triggerOnce: true });

  const [currentDestination, setCurrentDestination] = useState(0);
  const [destinationX, setDestinationX] = useState(180);
  const [destinationFlipped, setDestinationFlipped] = useState(false);

  const nextDestination = () => {
    setTimeout(() => {
      setDestinationX((prev) => (prev + 180) % 360);
      setTimeout(() => {
        setDestinationFlipped((prev) => !prev);
        setCurrentDestination((prev) => (prev + 1) % destinations.length);
      }, 1750);
    }, 5000);
  };

  const playNote = (note: string) => {
    if (note === null) return;
    const audio = new Audio(`/audio/notes/${note}.mp3`);
    audio.play();
  };

  return (
    <div className="interests-page">
      {/* Header */}
      <motion.div
        className="interests-header"
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="header-overlay">
          <h1>Interests</h1>
          <p>Entertainment and other interests.</p>
        </div>
        <img src="/images/about/interests/tv.png" alt="Interests" />
        <FontAwesomeIcon
          icon={faChevronDown}
          className="scroll-indicator"
          style={{ color: ColorPalette.Yellow }}
        />
      </motion.div>

      {/* Music Section */}
      <motion.div
        ref={musicRef}
        className="music-section"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={musicInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 1, type: "spring", bounce: 0.5 }}
      >
        <div className="music-content">
          <div className="piano-keys">
            <div className="white-keys">
              {["C1", "D", "E", "F", "G", "A", "B", "C2"]
                .reverse()
                .map((note, index) => (
                  <motion.div
                    key={`${index}-${note}`}
                    className="white-key"
                    initial={{ opacity: 0, x: -80 }}
                    animate={musicInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    onClick={() => playNote(note)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  />
                ))}
            </div>
            <div className="black-keys">
              {[null, "Db", "Eb", null, "Gb", "Ab", "Bb", null]
                .reverse()
                .map((note, index) =>
                  note ? (
                    <motion.div
                      key={`${index}-${note}`}
                      className="black-key"
                      initial={{ opacity: 0, x: -80 }}
                      animate={musicInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.1 + index * 0.2 }}
                      onClick={() => playNote(note)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    />
                  ) : (
                    <div
                      key={`${index}-${note}`}
                      className="black-key"
                      style={{ visibility: "hidden" }}
                    />
                  )
                )}
            </div>
          </div>

          <div className="music-info">
            <h2>Music</h2>
            <p style={{ marginBottom: "50px", minHeight: "150px" }}>
              Music has been a fundamental part of my life since childhood. From
              participating heavily in my school's music program during middle
              and high school, to forming my own band with a group of friends,
              music has always been a passion of mine. I've played many
              instruments over the years, but my primary instrument is the
              piano. My love for all types music can be seen in what I listen to
              as well, as I listen to a wide variety of genres and I'm always
              open to new music.
            </p>

            <h3>My Instruments</h3>
            <motion.div
              className="instruments-carousel"
              initial={{ opacity: 0, y: 30 }}
              animate={musicInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="carousel-track">
                {[
                  ...instruments,
                  ...instruments,
                  ...instruments,
                  ...instruments,
                ].map((instrument, index) => (
                  <motion.div
                    key={`${instrument.name}-${index}`}
                    className="instrument-card"
                    animate={{
                      x: "-1500%",
                      transition: {
                        duration: 60,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                  >
                    <img
                      src={`/images/about/interests/instruments/${instrument.icon}`}
                      alt={instrument.name}
                    />
                    <motion.div
                      className="instrument-info"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4>{instrument.name}</h4>
                      <p>{instrument.description}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Reading Section */}
      <motion.div
        ref={readingRef}
        className="reading-section"
        initial={{ opacity: 0, scale: 0.5, y: 30 }}
        animate={readingInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 1, type: "spring", bounce: 0.5 }}
      >
        <div className="reading-content">
          <div className="reading-info">
            <h2>Reading</h2>
            <p>
              I used to read a lot as a kid, but just recently I've started
              getting back into it. It's always a great way to relax and escape
              from the stress of everyday life. I really enjoy books with
              interesting worlds and characters that I can immerse myself in,
              such as fantasy and science fiction, but I'm always open to new
              genres.
            </p>
            <div className="current-read">
              <h3>Currently Reading:</h3>
              <div className="book-info">
                <h2>{books.current.title}</h2>
                <h3>by {books.current.author}</h3>
              </div>

              <p>
                {books.current.seriesProgress} from the series "
                {books.current.series}"
              </p>
              <div className="progress-bar">
                <motion.div
                  className="progress"
                  initial={{ width: 0 }}
                  animate={
                    readingInView
                      ? { width: `${books.current.progress * 100}%` }
                      : {}
                  }
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
            </div>

            <div className="upcoming">
              <h3>Upcoming Series:</h3>
              <div className="book-list">
                {books.upcoming.map((book, index) => (
                  <motion.div
                    key={book}
                    className="book-preview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={readingInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.2 + 1 }}
                  >
                    <FontAwesomeIcon
                      icon={faBook}
                      style={{ color: ColorPalette.Yellow }}
                    />
                    <p>{book}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <BookShelf readingInView={readingInView} />
        </div>
      </motion.div>

      {/* Japan Section */}
      <motion.div
        ref={japanRef}
        className="japan-section"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={japanInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 1, type: "spring", bounce: 0.5 }}
      >
        <div className="japan-content">
          <motion.div
            className="torii-gate"
            initial={{ opacity: 0, x: -50 }}
            animate={japanInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              className="gate"
              animate={{
                scale: [1, 1.02, 1],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img
                src="/images/about/interests/japan/torii.png"
                alt="Torii Gate"
              />
            </motion.div>

            {/* Animated sakura petals */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="sakura-petal"
                initial={{
                  x: Math.random() * 400 - 200,
                  y: -50,
                  rotate: 0,
                }}
                animate={{
                  x: Math.random() * 400 - 200,
                  y: 400,
                  rotate: 360,
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </motion.div>

          <div className="japan-info">
            <div className="info-container">
              <div className="japan-text">
                <h2>Japan</h2>
                <p>
                  Japan has always fascinated me with its unique blend of
                  traditional culture and modern innovation. From its beautiful
                  landscapes to its incredible foods, there's so much to
                  appreciate. I'm an avid watcher of anime when I have the time,
                  and think they have some of the most well-written stories of
                  anything I've watched. I've also spent over two years studying
                  the language, and hope to visit someday to experience it all
                  firsthand.
                </p>
              </div>

              <motion.div
                className="destinations"
                initial={{ opacity: 0, x: 50 }}
                animate={japanInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3>Top Destinations</h3>
                <motion.div
                  className="destination-card"
                  animate={japanInView ? { rotateX: destinationX } : {}}
                  onAnimationComplete={nextDestination}
                  transition={{ delay: 1, duration: 1.5, ease: "linear" }}
                >
                  <div
                    className="card-content"
                    style={{
                      transform: `rotateX(${destinationFlipped ? 0 : 180}deg)`,
                    }}
                  >
                    <img
                      src={`/images/about/interests/japan/${destinations[currentDestination].image}`}
                      alt={destinations[currentDestination].name}
                    />
                    <div className="card-info">
                      <h4>{destinations[currentDestination].name}</h4>
                      <p>{destinations[currentDestination].description}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <h3>Foods I'd love to try</h3>
            <motion.div
              className="foods-carousel"
              initial={{ opacity: 0, y: 30 }}
              animate={japanInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="carousel-track">
                {[...foods, ...foods, ...foods, ...foods].map((food, index) => (
                  <motion.div
                    key={`${food.name}-${index}`}
                    className="food-card"
                    animate={{
                      x: "-1000%",
                      transition: {
                        duration: 60,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                  >
                    <img
                      src={`/images/about/interests/japan/${food.icon}`}
                      alt={food.name}
                    />
                    <motion.div
                      className="food-info"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4>{food.name}</h4>
                      <p style={{ marginBottom: "10px" }}>{food.description}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Misc Interests Section */}
      <motion.div
        ref={miscRef}
        className="misc-section"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={miscInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 1, type: "spring", bounce: 0.5 }}
      >
        <h2>Other Interests</h2>
        <div className="interests-grid">
          {miscInterests.map((interest, index) => (
            <motion.div
              key={interest.title}
              className="interest-card"
              initial={{ opacity: 0, y: 30 }}
              animate={miscInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
            >
              <FontAwesomeIcon
                icon={interest.icon}
                style={{ color: interest.color }}
              />
              <h3>{interest.title}</h3>
              <p>{interest.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default InterestsPage;

const instruments = [
  {
    name: "Piano",
    icon: "piano.png",
    description: "My primary and favorite instrument",
  },
  {
    name: "Drums",
    icon: "drums.png",
    description:
      "Started playing percussion in middle school and was section leader in high school",
  },
  {
    name: "Bass",
    icon: "bass.png",
    description: "Picked up to play in a band I started with friends",
  },
  {
    name: "Mallet Percussion",
    icon: "mallets.png",
    description:
      "One of the few percussionists who knew how to read music in high school",
  },
  {
    name: "Timpani",
    icon: "timpani.png",
    description:
      "Played in high school and was my instrument of choice in college",
  },
  {
    name: "Otamatone",
    icon: "otamatone.png",
    description:
      "A weird but fun Japanese instrument that acts as a voice synthesizer",
  },
  {
    name: "Accordion",
    icon: "accordion.png",
    description:
      "Regularly played in a local pit band and learned this once for the play 'Cabaret'",
  },
];

const books = {
  current: {
    title: "A Storm of Swords",
    author: "George R.R. Martin",
    progress: 0.5,
    series: "A Song of Ice and Fire",
    seriesProgress: "Book 3 of 5",
  },
  upcoming: ["A Court of Thorns and Roses", "Outlander", "The Witcher"],
};

const destinations = [
  {
    name: "Kyoto",
    image: "kyoto.jpg",
    description:
      "Kyoto is a city in Japan known for its traditional architecture and gardens.",
  },
  {
    name: "Tokyo",
    image: "tokyo.jpg",
    description:
      "Tokyo is the capital city of Japan, known for its modern architecture and technology.",
  },
  {
    name: "Osaka",
    image: "osaka.jpg",
    description:
      "Osaka is a city in Japan known for its delicious street food and nightlife.",
  },
];

const foods = [
  {
    name: "Okonomiyaki",
    icon: "okonomiyaki.png",
    description: "Savory pancake filled with a variety of ingredients",
  },
  {
    name: "Yakitori",
    icon: "yakitori.png",
    description: "Grilled chicken skewers",
  },
  {
    name: "Takoyaki",
    icon: "takoyaki.png",
    description: "Octopus balls",
  },
  {
    name: "Taiyaki",
    icon: "taiyaki.png",
    description: "Fish-shaped cake filled with sweet red bean paste",
  },
  {
    name: "Tonkatsu",
    icon: "tonkatsu.png",
    description: "Deep-fried pork cutlet",
  },
  {
    name: "Karaage",
    icon: "karaage.png",
    description: "Deep-fried chicken",
  },
];

const miscInterests = [
  {
    title: "Cooking",
    icon: faUtensils,
    color: ColorPalette.Blue,
    description: "Love trying new recipes a",
  },
  {
    title: "Working Out",
    icon: faDumbbell,
    color: ColorPalette.Green,
    description: "Regular fitness routine to stay healthy and energized",
  },
  {
    title: "Rubik's Cubes",
    icon: faCube,
    color: ColorPalette.Orange,
    description: "Collection of various twisty puzzles",
  },
];
