import React from "react";
import ReactIcon from "../assets/React.png";
import TailwindIcon from "../assets/Tailwind.png";
import TypeScriptIcon from "../assets/TypeScript.png";

const ProductOverview = ({ product }) => {
  // If no product, show loading or default
    if (!product) {
      return (
        <div className="product__overview">
          <p>Loading product details...</p>
        </div>
      );
    }

  // Helper function to detect which tech stack icons to show
  const getTechIcons = () => {
    const icons = [];
    const techs = product.technologies || [];
    
    if (techs.some(tech => tech.includes('React') || tech.includes('react'))) {
      icons.push({
        label: 'Framework',
        icon: ReactIcon,
        name: 'React'
      });
    }
    if (techs.some(tech => tech.includes('Tailwind') || tech.includes('tailwind'))) {
      icons.push({
        label: 'Styling',
        icon: TailwindIcon,
        name: 'Tailwind'
      });
    }
    if (techs.some(tech => tech.includes('TypeScript') || tech.includes('typescript') || tech.includes('Type Script'))) {
      icons.push({
        label: 'Language',
        icon: TypeScriptIcon,
        name: 'TypeScript'
      });
    }
    
    // Fallback to default icons if none detected
    if (icons.length === 0) {
      icons.push(
        { label: 'Framework', icon: ReactIcon, name: 'React' },
        { label: 'Styling', icon: TailwindIcon, name: 'Tailwind' },
        { label: 'Language', icon: TypeScriptIcon, name: 'TypeScript' }
      );
    }
    
    return icons;
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
          {/* Map through tech icons based on product technologies */}
          {getTechIcons().map((tech, index) => (
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