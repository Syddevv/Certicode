import React from "react";
import PrimaryFrameworksIcon from "../assets/PrimaryFrameworks.png";
import DatabaseIcon from "../assets/Database.png";
import ReactIcon from "../assets/React.png";
import NodejsIcon from "../assets/Nodejs.png";
import TailwindIcon from "../assets/Tailwind.png";
import TypeScriptIcon from "../assets/TypeScript.png";
import PrimaryDatabaseIcon from "../assets/PrimaryDatabase.png";
import InfrastructureIcon from "../assets/Infrastructure.png";

const getIconForTech = (techName) => {
  const iconMap = {
    "react": ReactIcon,
    "node.js": NodejsIcon,
    "nodejs": NodejsIcon,
    "node": NodejsIcon,
    "tailwind": TailwindIcon,
    "tailwind css": TailwindIcon,
    "tailwindcss": TailwindIcon,
    "typescript": TypeScriptIcon,
    "postgresql": PrimaryDatabaseIcon,
    "postgres": PrimaryDatabaseIcon,
    "aws": InfrastructureIcon,
    "amazon web services": InfrastructureIcon,
  };
  
  const lowercaseName = techName.toLowerCase();
  return iconMap[lowercaseName] || ReactIcon;
};

const ProductTechStack = ({ technologies = [] }) => {
  if (!technologies || technologies.length === 0) {
    return (
      <div className="product__tech">
        <div className="product__techSection">
          <div className="product__techHeader">
            <img src={PrimaryFrameworksIcon} alt="" />
            <h3>Tech Stack</h3>
          </div>
          <p>No technology information available for this product.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product__tech">
      <div className="product__techSection">
        <div className="product__techHeader">
          <img src={PrimaryFrameworksIcon} alt="" />
          <h3>Tech Stack</h3>
        </div>
        <div className="product__techGrid">
          {technologies.map((tech, index) => {
            const techName = typeof tech === 'string' ? tech : tech.name || "Technology";
            const techDescription = tech.description || `Used in this project for ${techName.toLowerCase()} development.`;
            const techVersion = tech.version || "Latest";
            const techTag = tech.tag || tech.category || "Framework";
            
            return (
              <div key={`${techName}-${index}`} className="product__techCard">
                <div className="product__techIcon">
                  <img src={getIconForTech(techName)} alt={techName} />
                </div>
                <div className="product__techContent">
                  <div className="product__techTitleRow">
                    <strong>{techName}</strong>
                    <span className="product__techTag">{techTag}</span>
                  </div>
                  <p className="product__techVersion">Version {techVersion}</p>
                  <p className="product__techDescription">{techDescription}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductTechStack;