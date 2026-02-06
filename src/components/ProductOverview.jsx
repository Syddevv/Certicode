import React from "react";
import ReactIcon from "../assets/React.png";
import TailwindIcon from "../assets/Tailwind.png";
import TypeScriptIcon from "../assets/TypeScript.png";
import NodejsIcon from "../assets/Nodejs.png";
import PrimaryDatabaseIcon from "../assets/PrimaryDatabase.png";
import InfrastructureIcon from "../assets/Infrastructure.png";

const ProductOverview = ({ product }) => {
    if (!product) {
      return (
        <div className="product__overview">
          <p>Loading product details...</p>
        </div>
      );
    }

  // Function to get icon for a technology
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
      "mysql": PrimaryDatabaseIcon,
      "mongodb": PrimaryDatabaseIcon,
      "aws": InfrastructureIcon,
      "amazon web services": InfrastructureIcon,
      "azure": InfrastructureIcon,
      "docker": InfrastructureIcon,
    };
    
    const lowercaseName = techName.toLowerCase();
    return iconMap[lowercaseName] || ReactIcon; // Default icon
  };

  // Function to get label/category for a technology
  const getLabelForTech = (techName) => {
    const techNameLower = techName.toLowerCase();
    
    if (techNameLower.includes('react') || 
        techNameLower.includes('vue') || 
        techNameLower.includes('angular') ||
        techNameLower.includes('next') ||
        techNameLower.includes('svelte')) {
      return 'Frontend';
    }
    if (techNameLower.includes('node') || 
        techNameLower.includes('express') || 
        techNameLower.includes('django') ||
        techNameLower.includes('flask') ||
        techNameLower.includes('spring')) {
      return 'Backend';
    }
    if (techNameLower.includes('tailwind') || 
        techNameLower.includes('bootstrap') || 
        techNameLower.includes('css') ||
        techNameLower.includes('sass') ||
        techNameLower.includes('less')) {
      return 'Styling';
    }
    if (techNameLower.includes('typescript') || 
        techNameLower.includes('javascript') || 
        techNameLower.includes('python') ||
        techNameLower.includes('java') ||
        techNameLower.includes('php')) {
      return 'Language';
    }
    if (techNameLower.includes('postgres') || 
        techNameLower.includes('mysql') || 
        techNameLower.includes('mongo') ||
        techNameLower.includes('database') ||
        techNameLower.includes('sql')) {
      return 'Database';
    }
    if (techNameLower.includes('aws') || 
        techNameLower.includes('azure') || 
        techNameLower.includes('cloud') ||
        techNameLower.includes('docker') ||
        techNameLower.includes('kubernetes')) {
      return 'Infrastructure';
    }
    
    return 'Framework';
  };

  // Process technologies from product data
  const getTechStack = () => {
    if (!product.technologies || product.technologies.length === 0) {
      // Return default tech stack if no technologies are provided
      return [
        { label: 'Frontend', icon: ReactIcon, name: 'React' },
        { label: 'Backend', icon: NodejsIcon, name: 'Node.js' },
        { label: 'Styling', icon: TailwindIcon, name: 'Tailwind' },
        { label: 'Language', icon: TypeScriptIcon, name: 'TypeScript' },
      ];
    }

    // Map product technologies to display format
    return product.technologies.map(tech => {
      const techName = typeof tech === 'string' ? tech : tech.name || "Technology";
      return {
        label: getLabelForTech(techName),
        icon: getIconForTech(techName),
        name: techName
      };
    });
  };

  return (
    <div className="product__overview">
      <h2>{product.name}</h2>
      <p>
        {product.description}
      </p>
      
      <div className="product__section">
        <h3>Tech Stack</h3>
        <div className="product__stackGrid">
          {/* Map through product technologies or use defaults */}
          {getTechStack().map((tech, index) => (
            <div key={index} className="product__stackCard">
              <span>{tech.label}</span>
              <img src={tech.icon} alt={`${tech.name} icon`} />
              <strong>{tech.name}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="product__section">
        <h3>Core Features</h3>
        <ul className="product__features">
          {/* If product has features, use them, otherwise use default features */}
          {product.features && product.features.length > 0 ? (
            product.features.map((feature, index) => (
              <li key={index}>
                <span className="product__featureDot" /> {feature}
              </li>
            ))
          ) : (
            // Default features
            <>
              <li>
                <span className="product__featureDot" /> Payment integration to
                provide seamless transactions
              </li>
              <li>
                <span className="product__featureDot" /> Highly modular components
                and clear folder structure
              </li>
              <li>
                <span className="product__featureDot" /> Real-time data visualization
                with Chart.js
              </li>
              <li>
                <span className="product__featureDot" /> Full authentication flow
                (Login, Register, Forgot Password)
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProductOverview;