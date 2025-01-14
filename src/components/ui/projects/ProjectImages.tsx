import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Project } from "./ProjectsScreen";

const ProjectImages = ({ currentProject }: { currentProject: Project }) => {
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const projectImages = currentProject.images.filter(
    (img) => img.tags !== undefined
  );

  const tags = useMemo(() => {
    const uniqueTags = new Set<string>();
    projectImages.forEach((img) =>
      img.tags!.forEach((tag) => uniqueTags.add(tag))
    );
    return ["All", ...Array.from(uniqueTags)];
  }, []);

  const filteredImages = useMemo(() => {
    if (selectedTag === "All") return projectImages;
    return projectImages.filter((img) => img.tags!.includes(selectedTag));
  }, [selectedTag]);

  return (
    <motion.div
      className="project-images"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <h1>Work Examples</h1>
      <div className="category-filters">
        {tags.map((tag) => (
          <motion.button
            key={tag}
            className={`category-button ${selectedTag === tag ? "active" : ""}`}
            whileHover={{ background: currentProject.color }}
            onClick={() => setSelectedTag(tag)}
            style={{
              background: selectedTag === tag ? currentProject.color : "",
            }}
          >
            {tag}
          </motion.button>
        ))}
      </div>
      <div className="images-grid">
        {filteredImages.map((image, index) => (
          <div key={index} className="image-container">
            <img src={`/images/projects/${currentProject.id}/${image.src}`} />
            <div
              className="image-overlay"
              style={{ background: currentProject.color }}
            >
              <div className="overlay-content">
                <h3>{image.title}</h3>
                <p>{image.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectImages;
