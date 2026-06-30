"use client";

import {
  siFacebook,
  siInstagram,
} from "simple-icons/icons";

const QuickLinks =[
  {name: "Home", link: "/"},
  {name: "Our Cars", link: "/cars"},
  {name: "About Us", link: "#about"},
  {name: "Services", link: "#services"},
  {name: "Contact", link: "#contact"},
]

const Brands = ["Toyota", "Nissan", "Honda", "Tata", "Hyundai"];

const policies = [
  {name: "Privacy", link: "/privacy"},
  {name: "Terms", link: "/terms"},
];

const Social = [
  {link: "https://www.facebook.com/husseinghulammotorsfzco", icon: siFacebook},
  {link: "https://www.instagram.com/husseinghulammotors", icon: siInstagram},
]

export default function Footer() {
  return (
    <footer className="relative w-full py-16 overflow-hidden rounded-md" id="contact">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black" />

      {/* subtle gold glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#C8A24A]/10 blur-3xl" />

      <div className="relative">

        {/* MAIN */}
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-neutral-400">

          {/* Contact Us */}
          <div>
            <h3 className="text-white text-lg font-medium mb-5">
              Contact Us
            </h3>
            <p className="text-sm leading-relaxed">
             We are always ready to serve you and provide the best solutions in the automotive world.
            Please contact us for more information or business partnerships.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-medium mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {QuickLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.link} className="group inline-block relative hover:text-white transition duration-200">
                    {link.name}
                    <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#C8A24A] group-hover:w-full transition-all duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Brands */}
          <div>
            <h3 className="text-white text-lg font-medium mb-5">
              Our Brands
            </h3>
            <ul className="space-y-3 text-sm">
              {Brands.map((brand, i) => (
                <li key={i}>
                  <a className="group inline-block relative hover:text-white transition duration-200">
                    {brand}
                    <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#C8A24A] group-hover:w-full transition-all duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="text-white text-lg font-medium mb-5">
              Contact
            </h3>

            <ul className="space-y-3 text-sm">
              <li>Email: info@husseinghulammotors.com</li>
              <li>Phone: +971 54 314 1978</li>
              <li>Location: Dubai, UAE</li>
            </ul>

            {/* Social */}
         <div className="flex gap-4 mt-6">
  {Social.map((social, i) => (
    <a
      key={i}
      className="w-9 h-9 flex items-center justify-center border border-neutral-700 rounded-full text-neutral-400 hover:text-white hover:border-[#C8A24A]  transition duration-200"
      href={social.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path d={social.icon.path} fill="currentColor" />
      </svg>
    </a>
  ))}
</div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">

            <p>
              © {new Date().getFullYear()} <span className="text-neutral-400">Hussein Ghulam Motors.</span> All rights reserved.
            </p>

            <div className="flex gap-6">
              {policies.map((item, i) => (
                <a
                  key={i}
                  className="hover:text-white transition duration-200"
                  href={item.link}
                >
                  {item.name}
                </a>
              ))}
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}