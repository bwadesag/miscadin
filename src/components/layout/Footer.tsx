import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gold-600/20 text-gold-200 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gold-400">MISCADIN</h3>
            <p className="text-gold-400 mb-4">
              Votre destination pour le prêt-à-porter homme moderne. Qualité, style et confort.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gold-400 transition text-gold-500">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gold-400 transition text-gold-500">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gold-400 transition text-gold-500">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold-300">Navigation</h4>
            <ul className="space-y-2 text-gold-400">
              <li>
                <Link to="/" className="hover:text-gold-300 transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-gold-300 transition">
                  Vêtements
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-gold-300 transition">
                  Chaussures
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-gold-300 transition">
                  Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold-300">Service Client</h4>
            <ul className="space-y-2 text-gold-400">
              <li>
                <Link to="/contact" className="hover:text-gold-300 transition">
                  Contactez-nous
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-gold-300 transition">
                  Livraison
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-gold-300 transition">
                  Retours
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gold-300 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold-300">Contact</h4>
            <ul className="space-y-3 text-gold-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:contact@miscadin.com" className="hover:text-gold-300 transition">
                  contact@miscadin.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+237699047359" className="hover:text-gold-300 transition">
                +237699047359
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>yde montee anne Rouge<br />Face maison MTN</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gold-600/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gold-500">
            <p>&copy; {new Date().getFullYear()} MISCADIN. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-gold-300 transition">
                Confidentialité
              </Link>
              <Link to="/terms" className="hover:text-gold-300 transition">
                Conditions
              </Link>
              <Link to="/cookies" className="hover:text-gold-300 transition">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

