import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa"
import { IoLogoLinkedin } from "react-icons/io5"

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Col 1: Brand */}
        <div>
          <div className="footer-logo">FC-BASU Lab</div>
          <p className="footer-tagline">Fuel Cell, Battery Application & Sustainable-Energy Utilisation &middot; IIT Delhi</p>

          {/* Removed if required uncomment */}
          {/* <p className="footer-desc">Please follow our social media pages for more updates.</p>
          <div className="footer-socials">
            <a href="https://www.facebook.com/Suddhsaatwa.Basu" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <span className="footer-social-icon"><FaFacebook /></span>
            </a>
            <a href="https://www.linkedin.com/in/suddhasatwa-basu-fnasc-fnae-frsc-5998882b/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <span className="footer-social-icon"><FaTwitter /></span>
            </a>

            <span className="footer-social-icon"><IoLogoLinkedin /></span>
          </div> */}
        </div>

        {/* Col 2: Links (2 Columns) */}
        <div>
          {/* <h3 className="footer-col-heading">Links</h3> */}
          <ul className="footer-links-2col">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/people">People</Link></li>
            <li><Link href="/research/areas">Research</Link></li>
            <li><Link href="/news">News</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><a href="/studio" target="_blank">Admin</a></li>

          </ul>
        </div>

        {/* Col 3: Contact */}
        <div>
          <h3 className="footer-col-heading">Contact</h3>
          <div className="footer-contact-item">
            <Phone className="footer-contact-icon" size={16} />
            <span className="footer-contact-text">+91-(50) 3210 2068</span>
          </div>
          <div className="footer-contact-item">
            <Mail className="footer-contact-icon" size={16} />
            <span className="footer-contact-text">chemlabiitd@gmail.com</span>
          </div>
          <div className="footer-contact-item">
            <MapPin className="footer-contact-icon" size={16} />
            <span className="footer-contact-text">Dept. of Chemical Engineering, IIT Delhi</span>
          </div>
        </div>

        {/* Col 4: Location */}
        <div>
          <h3 className="footer-col-heading">Location</h3>
          <div className="footer-map">
            <iframe
              src="https://www.google.com/maps?q=Indian+Institute+of+Technology+Delhi,+Hauz+Khas,+New+Delhi&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map showing IIT Delhi, Hauz Khas"
              aria-label="Interactive map of IIT Delhi, Hauz Khas"
            />
          </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Indian+Institute+of+Technology+Delhi,+Hauz+Khas,+New+Delhi"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-map-link"
          >
            Get directions &rarr;
          </a>
        </div>
      </div>

      {/* Bottom strip */}
      {/* <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span className="footer-bottom-text">&copy; 2026 Chemical Laboratory IIT Delhi. All rights reserved.</span>
          <span className="footer-bottom-text">Department of Chemical Engineering</span>
        </div>
      </div> */}
    </footer>
  )
}

export default Footer
