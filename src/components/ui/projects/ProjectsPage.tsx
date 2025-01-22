import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  faSteamSymbol,
  faItchIo,
  faYoutube,
  faGooglePlay,
  faApple,
} from "@fortawesome/free-brands-svg-icons";
import { ColorPalette } from "../../../utils/colors";
import ScrollIndicator from "../ScrollIndicator";
import { Project } from "./ProjectsScreen";

const projects: Project[] = [
  {
    id: "trewel-towers",
    color: "#ffcc00",
    title: "The Defense of \nTrewel Towers",
    description: "Multiplayer VR \nTower Defense",
    overview:
      "The Defense of Trewel Towers, or Trewel Towers, is a VR tower defense game. The player embodies the Orna Kingdom's hero and defends the kingdom using their archery skills from atop a tower. The player follows the hero's story, gaining magical abilities and upgrading the tower defenses in order to repel the invaders from another world. \nThis game project was started around January of 2022 by myself, Tyler Gorman, Horacio Valdes, and Brendan Berg. What started as a rework of an old VR project for one of our college courses soon became a game worth spending hundreds of development hours on. As our knowledge and passion for game development grew, so did the project itself with new members joining to help us achieve even bigger and better goals.",
    info: {
      players: "1-4",
      platform: "PC-VR",
      teamSize: "6",
      role: "Lead Designer, Programmer, 3D Artist",
      duration: "2 years",
      technologies: "Unity, C#, Blender, Miro",
    },
    links: [
      {
        icon: faSteamSymbol,
        url: "https://store.steampowered.com/app/2288710/The_Defense_of_Trewel_Towers/",
      },
      {
        icon: faItchIo,
        url: "https://horavaldes.itch.io/treweltowers",
      },
      {
        icon: faYoutube,
        url: "https://www.youtube.com/watch?v=IF-2yYu3cjY&t=2s&ab_channel=LittleLoafStudios",
      },
    ],
    images: [
      {
        src: "background.jpg",
        title: "background",
      },
      {
        src: "titleOverlay.png",
        title: "title-overlay",
      },
      {
        src: "initialDesign.jpg",
        title: "First Design on Miro",
        description:
          "Planned out the design of the game when we first started using a team Miro board. This included designing the arrow store, enemies, and the first iteration of the tower system.",
        tags: ["Design"],
      },
      {
        src: "tutorialDesign.jpg",
        title: "Tutorial Design",
        description:
          "Researched and designed how the game's tutorials would be implemented. Decided to slowly introduce mechanics as player progresses through Story mode levels. Tutorials include a puppet avatar that teaches the player each game mechanic through a series of commands.",
        tags: ["Design"],
      },
      {
        src: "cutsceneDesign.jpg",
        title: "Cutscene System",
        description:
          "Designed and implemented a modular cutscene system centered around the idea of a theatre with actors. The TheatreManager reads the script of the cutscene from a text file, telling it what to do and when. This includes spawning actors in different positions, animating them to voicelines, and controlling spotlights.",
        tags: ["Design", "Programming"],
      },
      {
        src: "study.jpg",
        title: "Humphrey's Study",
        description:
          "Designed and modeled the study of Humphrey the wizard, one of the main characters in the game. This is used for the game's main menu and co-op lobby scenes.",
        tags: ["Art"],
      },
      {
        src: "worldTerrain.jpg",
        title: "World Terrain",
        description:
          "Designed and modeled the terrain of the game world. This includes the various hills and cliffs, as well as the path that enemies take through the map.",
        tags: ["Art"],
      },
      {
        src: "theKeep.jpg",
        title: "The Keep",
        description:
          "Designed and modeled the player's keep, which can be seen in the game's logo. This serves as the home base for players which they must defend throughout the game.",
        tags: ["Art"],
      },
      {
        src: "avatarBoard.jpg",
        title: "Avatar Customization UI",
        description:
          "Designed the UI board for customizing your player avatar. Created VR physics buttons and knobs for interacting with the large amount of settings.",
        tags: ["UI/UX", "Programming"],
      },
      {
        src: "tutorial.jpg",
        title: "Level 1 Tutorial",
        description:
          "Designed and programmed the first level's tutorial. This is where the puppet introduces the player to the keep, shows them where to find their gear, and teaches them how to use the bow and unlock towers.",
        tags: ["Design", "Programming"],
      },
      {
        src: "store.jpg",
        title: "Arrow Store",
        description:
          "Designed and created the UI for the arrow store. This displays the different arrow types and allows the player to upgrade their damage.",
        tags: ["UI/UX"],
      },
      {
        src: "lobbyUI.jpg",
        title: "Multiplayer Lobby UI",
        description:
          "Designed and programmed the multiplayer lobby system and its UI elements. The player can host a room with a given name, make it private, join a public room, or join a private room by name.",
        tags: ["UI/UX", "Programming"],
      },
      {
        src: "introTutorial.jpg",
        title: "Intro Tutorial",
        description:
          "Designed and programmed the tutorial that occurs when the game is first played. The player goes through the process of creating the main menu book while learning how to move, grab objects, and shoot the bow.",
        tags: ["Design", "Programming"],
      },
      {
        src: "menuBook.jpg",
        title: "Main Menu Book",
        description:
          "Designed and programmed the main menu book, including all UI and functionality. This is found in Humphrey's study and is used by the player to start a storymode level or to play endless mode.",
        tags: ["UI/UX", "Programming"],
      },
      {
        src: "arrowDial.jpg",
        title: "Arrow Ability Dial",
        description:
          "Designed and programmed the arrow ability dial and its user interface. This is used by the player to change the arrow they're holding into a special arrow type.",
        tags: ["Design", "UI/UX", "Programming"],
      },
    ],
  },
  {
    id: "demigod-daycare",
    color: "#d0583d",
    title: "Demigod Daycare",
    description: "Mythological \nBaby Battler",
    overview:
      "Demigod Daycare is a game where you're tasked with raising the children of the gods to become legendary heroes. It's an Ancient Greek autobattler where you manage your own daycare of demigods to compete against other daycares and prove yours is the best in all of Olympus. With over 50 different demigod variants to collect and raise, develop strategies and form the best teams to take down the opposing daycares. \nThis is a game I developed during my time in the MassDigi Summer Innovation Program back in 2022. With a group of 5 others, I got to experience the full development cycle of a mobile game for the first time, from pre-production all the way to launch. As lead designer and one of the programmers, I learned many important lessons about game development that I'll never forget, such as how to best work as a team to reach deadlines and achieve our goals in the most effective way possible. This was an invaluable learning experience for me and helped forge the developer I am today.",
    info: {
      players: "1",
      platform: "iOS, Android",
      teamSize: "6",
      role: "Lead Designer, Programmer",
      duration: "3 months",
      technologies: "Unity, C#, Miro, PlasticSCM",
    },
    links: [
      {
        icon: faGooglePlay,
        url: "https://play.google.com/store/apps/details?id=com.MassDiGi.DemigodDaycare&hl=en_US",
      },
      {
        icon: faApple,
        url: "https://apps.apple.com/us/app/demigod-daycare-autobattler/id1630237568",
      },
      {
        icon: faYoutube,
        url: "https://www.youtube.com/watch?v=pnCwOAoY4mc&ab_channel=MassDigi",
      },
    ],
    images: [
      {
        src: "background.jpg",
        title: "background",
      },
      {
        src: "titleOverlay.png",
        title: "title-overlay",
      },
      {
        src: "battle-speed.jpg",
        title: "UI Programming",
        description:
          "The speed dropdown for adjusting the playback of the auto battles was one example of the many UI elements I got to program for this game. It was my first time using DoTween for Unity, and I got to learn a lot about how to create optimized UI animations.",
        tags: ["UI/UX", "Programming"],
      },
      {
        src: "currency.jpg",
        title: "Currency System",
        description:
          "As lead designer, I was tasked with designing and balancing the currency system for the game. This was quite the challenge, as we wanted players to be able to get all the different baby variants, but didn't want to make the game too easy.",
        tags: ["Design"],
      },
      {
        src: "lineup.jpg",
        title: "Lineup UI",
        description:
          "The lineup UI was particularly challenging, as there were many times when the scrollable area for selecting your babies conflicted with our custom touch control system. Eventually we got it working, but it was a fun challenge to overcome.",
        tags: ["UI/UX", "Programming"],
      },
      {
        src: "battle.jpg",
        title: "Game Inspiration",
        description:
          "The game itself is heavily inspired by 'Super Auto Pets', which was very popular at the time. This can be seen in the UI design of the babies here, as well as the auto battle system overall.",
        tags: ["Design"],
      },
      {
        src: "open-house.jpg",
        title: "Open House",
        description:
          "The addition of the open house screen where players obtain new babies was one of my favorite parts of the game's development. It finally allowed us to see the 50+ baby variants our artists had been working on in action.",
        tags: ["UI/UX", "Programming"],
      },
      {
        src: "tutorial.jpg",
        title: "Tutorial",
        description:
          "I designed and programmed the tutorial for the game in one of our last weekends of development. We realized that our game could be quite confusing for new players, so I had to rush to get it implemented in time for the game's launch.",
        tags: ["Design", "Programming"],
      },
    ],
  },
  {
    id: "get-down",
    color: "#ee964b",
    title: "Get Down",
    description: "AR Turn-Based \nParty Game",
    overview:
      "Get Down! is an AR party game where players take turns moving around and making attacks on an AR board of tiles placed within the room. Each turn, players can move to an adjacent tile and then choose 3 more tiles to attack, causing them to raise at the end of the round. The goal of the game is simple: get down. The player on the highest tile at the end of each round loses a life, and players have 3 lives before they're out so the last one standing wins. \nThis is a game I independently developed within an AR/VR course I took during my junior year at Quinnipiac University. The idea for the game is completely original and came to me one night while I was thinking of ways to take advantage of the affordances of augmented reality within games. I wanted to try making a multiplayer experience, and thought it would be neat to have a 3D board within your space that changed as you played, causing you to move around it to get a better view. I've always been proud of how this game turned out, and wish I had more time to finish and release it fully on the app stores. Today, I'm working on a web-based recreation of it for my board game website, FunBoredGames.com.",
    info: {
      players: "2-8",
      platform: "Android",
      teamSize: "1",
      role: "Sole Developer",
      duration: "1.5 months",
      technologies: "Unity, C#, ARKit",
    },
    links: [
      {
        icon: faItchIo,
        url: "https://matt-camerato.itch.io/get-down",
      },
      {
        icon: faYoutube,
        url: "https://www.youtube.com/watch?v=mshD7JSDdlU&ab_channel=MattCamerato",
      },
    ],
    images: [
      {
        src: "#f4d35e",
        title: "background-color",
      },
      {
        src: "titleOverlay.png",
        title: "title-overlay",
      },
      {
        src: "board-placement.jpg",
        title: "Board Placement",
        description:
          "The game uses ARKit to allow players to place the game board within the center of their playing space. As they pass the phone around the room, each player can see the board and move around it to get a better view.",
        tags: ["Programming"],
      },
      {
        src: "gameplay.jpg",
        title: "Gameplay",
        description:
          "I have always been proud of the gameplay loop of this game, and how it's simple yet fun. It also gave me the chance to create a multiplayer experience for the first time.",
        tags: ["Design"],
      },
      {
        src: "players.jpg",
        title: "Player List",
        description:
          "Creating the player list was fun, as I had never made a game with multiple players before. I was already fond of UI/UX design at this point, and even had the chance to add an interface for player's to choose their own color.",
        tags: ["UI/UX", "Design"],
      },
      {
        src: "tutorial.jpg",
        title: "Tutorial",
        description:
          "I really enjoyed creating the tutorial for this game, as the game's concept is simple yet unique. The tutorial itself is fully animated and plays out like a short intro cutscene if any players are unfamiliar with the game.",
        tags: ["Design", "Programming"],
      },
      {
        src: "UI-design.jpg",
        title: "UI Design",
        description:
          "I used a simple yet fun artstyle for the UI of this game, as I wanted it look like a party game. I got to animate all of the UI elements, giving it a very polished feel that I'm quite proud of.",
        tags: ["UI/UX", "Design"],
      },
    ],
  },
  {
    id: "trails",
    color: "#a0a3d9",
    title: "Trails",
    description: "Simplistic \n Metaphor Game",
    overview:
      "Trails is a simplistic metaphor game that symbolizes the mark you leave behind in life. You can't live forever, so choose the path you want to take and make sure to spend your time wisely. For those who come after you, the trail you leave behind may be a guide to new and better places. \nThis game was an independent project I worked on for a game design course in college where we were tasked with creating metaphor games. Although there isn't much gameplay or replayability, I tried to pack as much symbolism into it as possible within the short time I had to work on it. From venturing out from home, finding love, choosing how you spend your life and whether you want to leave something behind for future generations, there is a lot of hidden meaning within the short gameplay experience. Once I finished polishing it, I was quite proud of how it turned out and have always wondered how much further I could have taken the idea with more time.",
    info: {
      players: "1",
      platform: "WebGL",
      teamSize: "1",
      role: "Sole Developer",
      duration: "3 weeks",
      technologies: "Unity, C#",
    },
    links: [
      {
        icon: faItchIo,
        url: "https://matt-camerato.itch.io/trails",
      },
      {
        icon: faYoutube,
        url: "https://www.youtube.com/watch?v=7etgFp9PTvU&ab_channel=MattCamerato",
      },
    ],
    images: [
      {
        src: "#d5fcd1",
        title: "background-color",
      },
      {
        src: "titleOverlay.png",
        title: "title-overlay",
      },
      {
        src: "3D-art.jpg",
        title: "3D Art",
        description:
          "I created all of the 3D art for the game, which was the first time I had done so for class project. Although everything was made out of primitive shapes, I think the stylized look of it all turned out pretty well.",
        tags: ["Art"],
      },
      {
        src: "pause.jpg",
        title: "Pause Menu",
        description:
          "I added a pause menu for changing the music and sound settings, as I had enough time to add those features. I think the music I found really helped with creating the game's overall atmosphere in the end.",
        tags: ["Design", "UI/UX"],
      },
      {
        src: "UI-design.jpg",
        title: "UI Design",
        description:
          "To further emphasize the game's calm and minimalist theme, I went with simple and clean UI design. I think it fits the game perfectly and further pushed my love of UI/UX design.",
        tags: ["Design", "UI/UX"],
      },
      {
        src: "trails.jpg",
        title: "Trails",
        description:
          "The main feature of the game is the trails that you leave behind by holding space. They symbolize the path you've taken in life, and help your future generations find their way around the map.",
        tags: ["Design", "Programming"],
      },
      {
        src: "upgrades.jpg",
        title: "Upgrades",
        description:
          "The game has a few upgrades that you can get if you collect enough currency, which can take some time. Your currency and upgrades are passed down to future generations, however, so how you spend your time is a big part of the game.",
        tags: ["Design", "Programming"],
      },
    ],
  },
  {
    id: "military-malfunction",
    color: "white",
    title: "Military \nMalfunction",
    description: "2D Top-down \nTank Game",
    overview:
      "Military Malfunction is a wave based survival game where your tank can no longer stop moving. Fend off against the endless waves of enemy tanks that progressively get stronger as you play. How many waves can you last? \nThis was a game I developed for the 2020 Qunnipiac Game Dev Club's eJam. it was my first time participating in a game jam, and I only had a week to work on it in between my class work, so it was quite the challenge. I had a lot of fun making it though and learned a lot from the process. The algorithm for generating endless waves of increasingly difficult enemies was particularly tricky to get right, and this was also one of the first games where I put a heavy focus on polish, even getting the chance to add my own custom music and sound effects.",
    info: {
      players: "1",
      platform: "WebGL",
      teamSize: "1",
      role: "Sole Developer",
      duration: "1 week",
      technologies: "Unity, C#, Bfxr",
    },
    links: [
      {
        icon: faItchIo,
        url: "https://matt-camerato.itch.io/military-malfunction",
      },
    ],
    images: [
      {
        src: "background.jpg",
        title: "background",
      },
      {
        src: "titleOverlay.png",
        title: "title-overlay",
      },
      {
        src: "enemy-variants.jpg",
        title: "Enemy Variants",
        description:
          "The most challenging part of the game was creating the algorithm for generating endless waves of increasingly difficult enemies. Each enemy type had a different color and set of stats, and the algorithm had to select a mix of different types to spawn each wave to make it get harder as you play.",
        tags: ["Design", "Programming"],
      },
      {
        src: "2D-art.jpg",
        title: "2D Art",
        description:
          "I created all of the 2D art for the game, including the player and enemy sprites, the UI elements, and the overall map itself. I didn't have a lot of time to work on it but I'm proud of how it turned out.",
        tags: ["Art"],
      },
      {
        src: "intro.jpg",
        title: "Intro Dialogue",
        description:
          "The theme of the game jam was 'Moving Forward', so I ended up adding some backstory at the beginning of the game explaining how your tank has malfunctioned and can no longer stop moving with a short dialogue sequence.",
        tags: ["Design", "UI/UX"],
      },
      {
        src: "settings.jpg",
        title: "Settings",
        description:
          "The game needed a settings menu for changing the music and sound settings, as I had the chance to add my own custom music and sound effects. It was also the first time I implemented a save system, which allowed you to leave and return to the game on the wave you left off at.",
        tags: ["UI/UX", "Programming"],
      },
      {
        src: "UI-animations.jpg",
        title: "UI Animations",
        description:
          "During the polishing phase, I got the chance to add animations to my main menu UI, which I really enjoyed doing. I often think this was where I first fell in love with UI/UX design.",
        tags: ["UI/UX", "Design"],
      },
    ],
  },
];

const currentProject = {
  title: "Unnamed Hand-drawn Game",
  description:
    "A browser game I'm working on with a stylized look based on a game idea I had a few years ago. It will be mostly story-driven, but I'm currently working on an interesting mechanic I may use for the main focus of gameplay.",
  technologies: "React, Three.js",
};

const ProjectsPage = ({
  selectProject,
}: {
  selectProject: (project: Project) => void;
}) => {
  const [currentRef, currentInView] = useInView({ triggerOnce: true });
  const [pastRef, pastInView] = useInView({ triggerOnce: true });

  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <div className="projects-page">
      <motion.div
        ref={currentRef}
        className="current"
        initial={{ opacity: 0, scale: 0.6, y: 100 }}
        animate={currentInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 1.4, type: "spring", bounce: 0.5 }}
      >
        <h1>Currently working on...</h1>

        <div className="current-project">
          <img src="/images/projects/current.jpg" />
          <div className="project-info">
            <h3>{currentProject.title}</h3>
            <p>{currentProject.description}</p>
            <h4>{"Current Tech: " + currentProject.technologies}</h4>
          </div>
        </div>

        <ScrollIndicator color={ColorPalette.Yellow} scrollAmount={1200} />
      </motion.div>

      <motion.div
        ref={pastRef}
        className="past-work"
        initial={{ opacity: 0 }}
        animate={pastInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <h1>Past Work</h1>
        <div className="project-cards">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className={`project-card ${
                hoveredProject === project.id ? "hovered" : ""
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={pastInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => {
                selectProject(project);
              }}
            >
              <img src={`/images/projects/p${index + 1}.jpg`} />
              <div className="project-info">
                {project.title.split("\n").map((line, index) => (
                  <h3 key={index}>{line}</h3>
                ))}
                <br />
                {project.description.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectsPage;
