import "../styles/Footer.css";
import CerticodeLogo from "../assets/certicodeicon3.png";
import FacebookIcon from "../assets/fb-gray.png";
import MailIcon from "../assets/mail-gray.png";
import LinkedInIcon from "../assets/linkedin-gray.png";
import SendIcon from "../assets/send-icon.png";
import { Link } from "react-router-dom";
import { showSuccessToast } from "../utils/toast";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const gmailComposeUrl =
    "https://mail.google.com/mail/?view=cm&fs=1&to=certicodecc@gmail.com";
  const marketplaceLinks = [
    {
      label: "Websites & Apps",
      to: "/marketplace?category=Website",
    },
    {
      label: "Mobile Solutions",
      to: "/marketplace?category=Mobile%20App",
    },
    {
      label: "UI/UX Design Kits",
      to: "/marketplace?category=UI%20Kit",
    },
    {
      label: "Custom Projects",
      to: "/marketplace?category=Custom%20Projects",
    },
  ];

  const handleSubmit = () => {
    showSuccessToast(
      "Newsletter signup is coming soon. For now, contact us at certicodecc@gmail.com.",
    );
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <img src={CerticodeLogo} alt="certicode" className="footer__logo" />
            <p className="footer__desc">
              A B2B marketplace for production-ready digital assets and UI/UX
              systems.
            </p>
            <div className="footer__socials">
              <a
                className="footer__social"
                href="https://www.facebook.com/CertiCode"
                aria-label="Facebook"
              >
                <img src={FacebookIcon} alt="" />
              </a>
              <a
                className="footer__social"
                href="https://www.linkedin.com/company/autopilot-virtual-assist-agency/"
                aria-label="LinkedIn"
              >
                <img src={LinkedInIcon} alt="" />
              </a>
              <a
                className="footer__social"
                href={gmailComposeUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Email"
              >
                <img src={MailIcon} alt="" />
              </a>
            </div>
          </div>

          <div className="footer__col">
            <div className="footer__heading">Marketplace</div>
            {marketplaceLinks.map((item) => (
              <Link key={item.label} className="footer__link" to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="footer__col">
            <div className="footer__heading">Company</div>
            <Link to="/about" className="footer__link">
              About Certicode
            </Link>
            <Link className="footer__link" to="/success-stories">
              Success Stories
            </Link>
            <Link className="footer__link" to="/blogs-news">
              Blog & News
            </Link>
          </div>

          <div className="footer__col footer__newsletter">
            <div className="footer__heading">Newsletter</div>
            <p className="footer__note">
              Stay updated on new CertiCode assets and marketplace trends.
            </p>
            <div className="footer__inputWrap">
              <input
                className="footer__input"
                type="email"
                placeholder="Email"
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="footer__send"
                type="button"
                aria-label="Send"
                onClick={() => handleSubmit()}
              >
                <img src={SendIcon} alt="" />
              </button>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copy">
            © 2026 Certicode Marketplace. All rights reserved.
          </div>
          <div className="footer__legal">
            <Link className="footer__legalLink" to="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="footer__legalLink" to="/terms">
              Terms & Conditions
            </Link>
            <a className="footer__legalLink" href="#">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
