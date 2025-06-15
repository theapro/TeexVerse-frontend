import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto  px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold">
                <span className="text-white">Teex</span>
                <span className="text-[#0fd6a0]">Verse</span>
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              Premium quality t-shirts with unique designs that speak your style.
            </p>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-gray-300 hover:text-[#0fd6a0] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#0fd6a0] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#0fd6a0] transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0fd6a0]">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Shop', 'Collections', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-[#0fd6a0] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0fd6a0]">Customer Service</h3>
            <ul className="space-y-2">
              {['FAQ', 'Returns & Exchanges', 'Shipping Policy', 'Size Guide', 'Terms & Conditions', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-[#0fd6a0] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0fd6a0]">Get 10% Off</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for special deals and updates.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#0fd6a0]"
              />
              <button
                onClick={handleSubscribe}
                className="px-4 py-2 bg-[#0fd6a0] text-black font-semibold rounded hover:bg-opacity-90 transition-colors"
              >
                Subscribe
              </button>
              {subscribed && (
                <p className="text-[#0fd6a0] text-sm">
                  Thanks for subscribing!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-800 mt-8 pt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <Mail size={18} className="text-[#0fd6a0] mr-2" />
            <span className="text-gray-300">support@teexverse.com</span>
          </div>
          <div className="flex items-center">
            <Phone size={18} className="text-[#0fd6a0] mr-2" />
            <span className="text-gray-300">+998 (90) 9119118</span>
          </div>
          <div className="flex items-center">
            <MapPin size={18} className="text-[#0fd6a0] mr-2" />
            <span className="text-gray-300">123 TeexVerse St, Teex City, Planet Saturn</span>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TeexVerse. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="text-gray-400 text-sm hover:text-[#0fd6a0]">
              Terms
            </a>
            <a href="#" className="text-gray-400 text-sm hover:text-[#0fd6a0]">
              Privacy
            </a>
            <a href="#" className="text-gray-400 text-sm hover:text-[#0fd6a0]">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}