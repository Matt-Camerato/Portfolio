import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Project } from "./ProjectsScreen";

const ProjectOverview = ({ currentProject }: { currentProject: Project }) => {
  return (
    <div className="content-item">
      <div className="content-row">
        <div className="overview">
          <h1>Overview</h1>
          {currentProject.overview.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <div className="info">
          {Object.entries(currentProject.info).map(([key, value]) => (
            <div key={`${key}-${value}`} className="info-item">
              <h3>
                {key.charAt(0).toUpperCase() +
                  key.slice(1).replace(/([A-Z])/g, " $1")}
              </h3>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="content-row">
        <div className="links">
          {currentProject.links.map((link) => (
            <a
              key={`${link.url}-${link.icon}`}
              href={link.url}
              target="_blank"
              className="link"
            >
              <FontAwesomeIcon icon={link.icon} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
