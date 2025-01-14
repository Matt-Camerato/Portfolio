import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Project } from "./ProjectsScreen";

const ProjectOverview = ({ currentProject }: { currentProject: Project }) => {
  const [overviewRef, overviewInView] = useInView({ triggerOnce: true });

  return (
    <motion.div
      ref={overviewRef}
      className="overview-container"
      initial={{ opacity: 0, y: 50 }}
      animate={overviewInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <div className="overview-row">
        <motion.div
          className="overview-text"
          initial={{ opacity: 0, x: -50 }}
          animate={overviewInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <h1 style={{ color: currentProject.color }}>Overview</h1>
          {currentProject.overview.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </motion.div>
        <motion.div
          className="info"
          initial={{ opacity: 0, x: 50 }}
          animate={overviewInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {Object.entries(currentProject.info).map(([key, value]) => (
            <div
              key={`${key}-${value}`}
              className="info-item"
              style={{ background: currentProject.color }}
            >
              <h3>
                {key.charAt(0).toUpperCase() +
                  key.slice(1).replace(/([A-Z])/g, " $1")}
              </h3>
              <p>{value}</p>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="overview-row">
        <div className="links">
          {currentProject.links.map((link, index) => (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={overviewInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1 + index * 0.2 }}
            >
              <motion.a
                key={`${link.url}-${link.icon}`}
                href={link.url}
                target="_blank"
                className="link"
                whileHover={{
                  backgroundColor: currentProject.color,
                }}
                transition={{ duration: 0.1 }}
              >
                <FontAwesomeIcon icon={link.icon} />
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectOverview;
