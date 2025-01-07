import { useState, useMemo } from "react";
import { Project } from "./ProjectsScreen";

const ProjectImages = ({ currentProject }: { currentProject: Project }) => {
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const tags = useMemo(() => {
    const uniqueTags = new Set<string>();
    currentProject.images.forEach((img) =>
      img.tags.forEach((tag) => uniqueTags.add(tag))
    );
    return ["All", ...Array.from(uniqueTags)];
  }, [currentProject.images]);

  const filteredImages = useMemo(() => {
    if (selectedTag === "All") return currentProject.images;
    return currentProject.images.filter((img) =>
      img.tags.includes(selectedTag)
    );
  }, [currentProject.images, selectedTag]);

  return (
    <div className="project-images">
      <div className="title">Work Examples</div>
      <div className="category-filters">
        {tags.map((tag) => (
          <button
            key={tag}
            className={`category-button ${selectedTag === tag ? "active" : ""}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="images-grid">
        {filteredImages.map((image, index) => (
          <div key={index} className="image-container">
            <img src={`/images/projects/${currentProject.id}/${image.src}`} />
            <div className="image-overlay">
              <div className="overlay-content">
                <h3>{image.title}</h3>
                <p>{image.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectImages;
