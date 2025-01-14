import { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { Vector3 } from "three";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import ProjectsPage from "./ProjectsPage";
import ProjectPage from "./ProjectPage";
import { PlexusScreenSaver } from "../ScreenSaver";
import "../../../styles/ProjectsScreen.scss";

export interface Project {
  id: string;
  color: string;
  title: string;
  description: string;
  overview: string;
  info: ProjectInfo;
  links: ProjectLink[];
  images: ProjectImage[];
}

interface ProjectInfo {
  players: string;
  platform: string;
  teamSize: string;
  role: string;
  duration: string;
  technologies: string;
}

interface ProjectLink {
  icon: IconProp;
  url: string;
}

export interface ProjectImage {
  src: string;
  title: string;
  description?: string;
  tags?: string[];
}

export function ProjectsScreen({ isActive }: { isActive: boolean }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const selectProject = (project: Project) => {
    setIsLoading(true);
    setCurrentProject(project);
  };

  useEffect(() => {
    if (!isActive && currentProject) {
      setCurrentProject(null);
    } else {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [isActive]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [currentProject]);

  return isActive ? (
    <Html
      transform
      position={[0, 0.48, 0.001]}
      rotation={[0, 0, 0]}
      scale={[0.0308, 0.0308, 0.0308]}
    >
      <div className="projects-screen">
        <img className="toolbar" src="/images/projects/toolbar.png" />
        {currentProject && (
          <button
            className="back-button"
            onClick={() => {
              setIsLoading(true);
              setCurrentProject(null);
            }}
          >
            ←
          </button>
        )}
        <div className={`page-loader ${!isLoading ? "fade-out" : ""}`}></div>
        {!isLoading && (
          <div className="screen-content">
            {currentProject ? (
              <ProjectPage currentProject={currentProject} />
            ) : (
              <ProjectsPage selectProject={selectProject} />
            )}
          </div>
        )}
      </div>
    </Html>
  ) : (
    <PlexusScreenSaver
      position={new Vector3(0, 0.467, 0.1)}
      scale={new Vector3(0.03025, 0.03025, 0.03025)}
    />
  );
}
