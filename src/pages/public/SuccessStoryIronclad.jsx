import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/SuccessStoryIronclad.css";

const SuccessStoryIronclad = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchAndRedirect();
  }, [id]);

  const fetchAndRedirect = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isNaN(id)) {
        const response = await fetch(`https://dev.to/api/articles/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.url) {
            window.location.href = data.url;
            return;
          }
        }
      }
      
      const curatedUrls = {
        'kalamuna-tyk': 'https://tyk.io/case-studies/kalamuna/',
        'publicis-dataddo': 'https://blog.dataddo.com/how-publicis-groupe-brasil-uses-dataddos-api-to-scale-a-data-product',
        'segment-apptopia': 'https://apptopia.com/case-study-segment',
        'medimpact-gravitee': 'https://www.gravitee.io/case-studies/medimpact',
        'noble-apollo': 'https://www.apollo.io/magazine/noble-customer-story',
        'centralplains-barchart': 'https://www.barchart.com/solutions/case-studies/cpm',
        'nhc-ibm': 'https://www.ibm.com/case-studies/nhc',
        'dvla-aws': 'https://aws.amazon.com/api-gateway/resources/',
        'veracode-aws': 'https://aws.amazon.com/api-gateway/resources/',
        'browsercompany-datadog': 'https://www.datadoghq.com/case-studies/the-browser-company/'
      };
      
      if (curatedUrls[id]) {
        window.location.href = curatedUrls[id];
        return;
      }
      
      setError('Success story not found');
    } catch (error) {
      console.error("Error fetching story:", error);
      setError('Failed to load success story');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ironclad-case">
        <Navbar />
        <div className="loading-container">
          <div className="loader">Redirecting to success story...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="ironclad-case">
        <Navbar />
        <div className="error-container">
          <h2>{error}</h2>
          <button 
            className="back-link"
            onClick={() => window.location.href = '/success-stories'}
          >
            Back to Success Stories
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return null;
};

export default SuccessStoryIronclad;