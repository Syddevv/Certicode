import React from "react";
import PrimaryFrameworksIcon from "../assets/PrimaryFrameworks.png";
import DatabaseIcon from "../assets/Database.png";
import ReactIcon from "../assets/React.png";
import NodejsIcon from "../assets/Nodejs.png";
import TailwindIcon from "../assets/Tailwind.png";
import TypeScriptIcon from "../assets/TypeScript.png";
import PrimaryDatabaseIcon from "../assets/PrimaryDatabase.png";
import InfrastructureIcon from "../assets/Infrastructure.png";

const primaryFrameworks = [
  {
    name: "React",
    tag: "Frontend",
    version: "Version 18.2.0 - Concurrent",
    description: "Rendering enabled for peak performance.",
    icon: ReactIcon,
  },
  {
    name: "Node.js",
    tag: "Run Time",
    version: "Version 20.x (LTS)",
    description: "Optimized for scalable asynchronous I/O.",
    icon: NodejsIcon,
  },
  {
    name: "Tailwind 3",
    tag: "Styling",
    version: "Version 3.4 - Utility-first",
    description: "Fast UI styling with JIT engine.",
    icon: TailwindIcon,
  },
  {
    name: "TypeScript",
    tag: "Language",
    version: "Version 5.x - Strict type checks",
    description: "Reliability for enterprise workflows.",
    icon: TypeScriptIcon,
  },
];

const databaseInfrastructure = [
  {
    name: "Primary Database",
    tag: "PostgreSQL 15",
    description:
      "Relational database with complex query support and ACID compliance.",
    icon: PrimaryDatabaseIcon,
  },
  {
    name: "Infrastructure",
    tag: "AWS Cloud",
    description:
      "Hosting on EC2, S3 for storage, and CloudFront for global delivery.",
    icon: InfrastructureIcon,
  },
];

const ProductTechStack = () => {
  return (
    <div className="product__tech">
      <div className="product__techSection">
        <div className="product__techHeader">
          <img src={PrimaryFrameworksIcon} alt="" />
          <h3>Primary Frameworks</h3>
        </div>
        <div className="product__techGrid">
          {primaryFrameworks.map((item) => (
            <div key={item.name} className="product__techCard">
              <div className="product__techIcon">
                <img src={item.icon} alt="" />
              </div>
              <div className="product__techContent">
                <div className="product__techTitleRow">
                  <strong>{item.name}</strong>
                  <span className="product__techTag">{item.tag}</span>
                </div>
                <p className="product__techVersion">{item.version}</p>
                <p className="product__techDescription">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="product__techSection">
        <div className="product__techHeader">
          <img src={DatabaseIcon} alt="" />
          <h3>Database Infrastructure</h3>
        </div>
        <div className="product__techGrid product__techGrid--two">
          {databaseInfrastructure.map((item) => (
            <div key={item.name} className="product__techCard">
              <div className="product__techIcon">
                <img src={item.icon} alt="" />
              </div>
              <div className="product__techContent">
                <div className="product__techTitleRow">
                  <strong>{item.name}</strong>
                  <span className="product__techTag">{item.tag}</span>
                </div>
                <p className="product__techDescription">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductTechStack;
