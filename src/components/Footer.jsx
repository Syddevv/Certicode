import { Link } from "react-router-dom";
import "../styles/Footer.css";
import CerticodeLogo from "../assets/certicodeicon3.png";
import FacebookIcon from "../assets/fb-gray.png";
import MailIcon from "../assets/mail-gray.png";
import LinkedInIcon from "../assets/linkedin-gray.png";
import SendIcon from "../assets/send-icon.png";

const Footer = () => {
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
              <a className="footer__social" href="#" aria-label="Facebook">
                <img src={FacebookIcon} alt="" />
              </a>
              <a className="footer__social" href="#" aria-label="LinkedIn">
                <img src={LinkedInIcon} alt="" />
              </a>
              <a className="footer__social" href="#" aria-label="Email">
                <img src={MailIcon} alt="" />
              </a>
            </div>
          </div>

          <div className="footer__col">
            <div className="footer__heading">Marketplace</div>
            <a className="footer__link" href="#">
              Websites & Apps
            </a>
            <a className="footer__link" href="#">
              Mobile Solutions
            </a>
            <a className="footer__link" href="#">
              UI/UX Design Kits
            </a>
            <a className="footer__link" href="#">
              Custom Projects
            </a>
          </div>

          <div className="footer__col">
            <div className="footer__heading">Company</div>
            <a className="footer__link" href="#">
              About Certicode
            </a>
            <a className="footer__link" href="#">
              Success Stories
            </a>
            <a className="footer__link" href="#">
              Blog & News
            </a>
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
              />
              <button className="footer__send" type="button" aria-label="Send">
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
