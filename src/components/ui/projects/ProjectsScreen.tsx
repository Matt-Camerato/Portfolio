import { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { Vector3 } from "three";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useFocus } from "../../context/FocusContext";
import { PlexusScreenSaver } from "../ScreenSaver";
import ProjectsPage from "./ProjectsPage";
import ProjectPage from "./ProjectPage";
import "../../../styles/ProjectsScreen.scss";

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

export function ProjectsScreen({
  isActive,
  backClicked,
  setBackClicked,
}: {
  isActive: boolean;
  backClicked: boolean;
  setBackClicked: (backClicked: boolean) => void;
}) {
  const { setInteractState } = useFocus();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const selectProject = (project: Project) => {
    setIsLoading(true);
    setCurrentProject(project);
  };

  const handleBack = () => {
    setIsLoading(true);
    setCurrentProject(null);
  };

  useEffect(() => {
    if (backClicked) {
      handleBack();
      setBackClicked(false);
    }
  }, [backClicked]);

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
    if (currentProject) setInteractState(2);
    else setInteractState(1);

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
          <button className="back-button" onClick={handleBack}>
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
