import { useState } from "react";
import { Project } from "./ProjectsScreen";
import {
  faSteamSymbol,
  faItchIo,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const projects: Project[] = [
  {
    id: "trewel-towers",
    title: "The Defense of \nTrewel Towers",
    description: "Multiplayer VR \nTower Defense",
    overview:
      "The Defense of Trewel Towers, or Trewel Towers, is a VR tower defense game. The player embodies the Orna Kingdom's hero and defends the kingdom using their archery skills from atop a tower. The player follows the hero's story, gaining magical abilities and upgrading the tower defenses in order to repel the invaders from another world. \nThis game project was started around January of 2022 by myself, Tyler Gorman, Horacio Valdes, and Brendan Berg. What started as a rework of an old VR project for one of our college courses soon became a game worth spending hundreds of development hours on. As our knowledge and passion for game development grew, so did the project itself with new members joining to help us achieve even bigger and better goals.",
    info: {
      players: "1-4",
      platform: "PC-VR",
      teamSize: "6",
      role: "Lead Designer, Programmer, 3D Artist",
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
        src: "/initialDesign.jpg",
        title: "First Design on Miro",
        description:
          "Planned out the design of the game when we first started using a team Miro board. This included designing the arrow store, enemies, and the first iteration of the tower system.",
        tags: ["Game Design"],
      },
      {
        src: "/tutorialDesign.jpg",
        title: "Tutorial Design",
        description:
          "Researched and designed how the game's tutorials would be implemented. Decided to slowly introduce mechanics as player progresses through Story mode levels. Tutorials include a puppet avatar that teaches the player each game mechanic through a series of commands.",
        tags: ["Game Design"],
      },
      {
        src: "/cutsceneDesign.jpg",
        title: "Cutscene System",
        description:
          "Designed and implemented a modular cutscene system centered around the idea of a theatre with actors. The TheatreManager reads the script of the cutscene from a text file, telling it what to do and when. This includes spawning actors in different positions, animating them to voicelines, and controlling spotlights.",
        tags: ["Game Design", "Programming"],
      },
      {
        src: "/study.jpg",
        title: "Humphrey's Study",
        description:
          "Designed and modeled the study of Humphrey the wizard, one of the main characters in the game. This is used for the game's main menu and co-op lobby scenes.",
        tags: ["Modeling"],
      },
      {
        src: "/worldTerrain.jpg",
        title: "World Terrain",
        description:
          "Designed and modeled the terrain of the game world. This includes the various hills and cliffs, as well as the path that enemies take through the map.",
        tags: ["Modeling"],
      },
      {
        src: "/theKeep.jpg",
        title: "The Keep",
        description:
          "Designed and modeled the player's keep, which can be seen in the game's logo. This serves as the home base for players which they must defend throughout the game.",
        tags: ["Modeling"],
      },
      {
        src: "/avatarBoard.jpg",
        title: "Avatar Customization UI",
        description:
          "Designed the UI board for customizing your player avatar. Created VR physics buttons and knobs for interacting with the large amount of settings.",
        tags: ["UI/UX", "Programming"],
      },
      {
        src: "/tutorial.jpg",
        title: "Level 1 Tutorial",
        description:
          "Designed and programmed the first level's tutorial. This is where the puppet introduces the player to the keep, shows them where to find their gear, and teaches them how to use the bow and unlock towers.",
        tags: ["Game Design", "Programming"],
      },
      {
        src: "/store.jpg",
        title: "Arrow Store",
        description:
          "Designed and created the UI for the arrow store. This displays the different arrow types and allows the player to upgrade their damage.",
        tags: ["UI/UX"],
      },
      {
        src: "/lobbyUI.jpg",
        title: "Multiplayer Lobby UI",
        description:
          "Designed and programmed the multiplayer lobby system and its UI elements. The player can host a room with a given name, make it private, join a public room, or join a private room by name.",
        tags: ["UI/UX", "Programming"],
      },
      {
        src: "/introTutorial.jpg",
        title: "Intro Tutorial",
        description:
          "Designed and programmed the tutorial that occurs when the game is first played. The player goes through the process of creating the main menu book while learning how to move, grab objects, and shoot the bow.",
        tags: ["Game Design", "Programming"],
      },
      {
        src: "/menuBook.jpg",
        title: "Main Menu Book",
        description:
          "Designed and programmed the main menu book, including all UI and functionality. This is found in Humphrey's study and is used by the player to start a storymode level or to play endless mode.",
        tags: ["UI/UX", "Programming"],
      },
      {
        src: "/arrowDial.jpg",
        title: "Arrow Ability Dial",
        description:
          "Designed and programmed the arrow ability dial and its user interface. This is used by the player to change the arrow they're holding into a special arrow type.",
        tags: ["Game Design", "UI/UX", "Programming"],
      },
    ],
  },
  {
    id: "demigod-daycare",
    title: "Demigod Daycare",
    description: "Mythological \nBaby Battler",
    overview: "",
    info: {
      players: "",
      platform: "",
      teamSize: "",
      role: "",
      technologies: "",
    },
    links: [],
    images: [],
  },
  {
    id: "get-down",
    title: "Get Down",
    description: "AR Turn-Based \nParty Game",
    overview: "",
    info: {
      players: "",
      platform: "",
      teamSize: "",
      role: "",
      technologies: "",
    },
    links: [],
    images: [],
  },
  {
    id: "trails",
    title: "Trails",
    description: "Simplistic \n Metaphor Game",
    overview: "",
    info: {
      players: "",
      platform: "",
      teamSize: "",
      role: "",
      technologies: "",
    },
    links: [],
    images: [],
  },
  {
    id: "military-malfunction",
    title: "Military \nMalfunction",
    description: "2D Top-down \nTank Game",
    overview: "",
    info: {
      players: "",
      platform: "",
      teamSize: "",
      role: "",
      technologies: "",
    },
    links: [],
    images: [],
  },
  {
    id: "crumbling-catacombs",
    title: "The Crumbling \nCatacombs",
    description: "2D Top-down \nDungeon Crawler",
    overview: "",
    info: {
      players: "",
      platform: "",
      teamSize: "",
      role: "",
      technologies: "",
    },
    links: [],
    images: [],
  },
];

const ProjectsPage = ({
  selectProject,
}: {
  selectProject: (project: Project) => void;
}) => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <div className="projects">
      <div className="title">Projects</div>
      <div className="project-cards">
        {projects.map((project, index) => (
          <div
            key={project.title}
            className={`project-card ${
              hoveredProject === project.id ? "hovered" : ""
            }`}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
