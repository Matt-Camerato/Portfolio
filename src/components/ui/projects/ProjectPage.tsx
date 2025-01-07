import { Project } from "./ProjectsScreen";
import ProjectOverview from "./ProjectOverview";
import ProjectImages from "./ProjectImages";

const ProjectPage = ({ currentProject }: { currentProject: Project }) => {
  return (
    <div className="project">
      <img
        className="background"
        src={`/images/projects/${currentProject.id}/background.png`}
      />
      <img
        className="background-overlay"
        src={`/images/projects/${currentProject.id}/overlay.png`}
      />
      <div className="content">
        <ProjectOverview currentProject={currentProject} />
        <ProjectImages currentProject={currentProject} />
      </div>
    </div>
  );
};

export default ProjectPage;
