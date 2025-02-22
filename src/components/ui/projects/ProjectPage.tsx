import { motion } from "framer-motion";
import ScrollIndicator from "../ScrollIndicator";
import { Project } from "./ProjectsScreen";
import ProjectOverview from "./ProjectOverview";
import ProjectImages from "./ProjectImages";

const ProjectPage = ({ currentProject }: { currentProject: Project }) => {
  const backgroundImage = currentProject.images.find((img) =>
    img.title.includes("background")
  );

  const titleOverlay = currentProject.images.find(
    (img) => img.title === "title-overlay"
  );

  return (
    <div className="project-page">
      {backgroundImage && (
        <div className="background">
          {backgroundImage.title === "background" ? (
            <img
              src={`/images/projects/${currentProject.id}/${backgroundImage.src}`}
            />
          ) : (
            <div
              className="background-color"
              style={{ backgroundColor: `${backgroundImage.src}` }}
            />
          )}
        </div>
      )}
      {titleOverlay && (
        <div className="title-overlay">
          <motion.img
            src={`/images/projects/${currentProject.id}/${titleOverlay.src}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: [5, -5, 5, -5, 5],
              y: [5, -5, 5, -5, 5],
            }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              x: {
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              },
              y: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        </div>
      )}
      <ScrollIndicator color={currentProject.color} size="large" bottom={100} />
      <div className="content">
        <ProjectOverview currentProject={currentProject} />
        <ProjectImages currentProject={currentProject} />
      </div>
    </div>
  );
};

export default ProjectPage;
