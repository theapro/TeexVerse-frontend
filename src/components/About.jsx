import React from "react";

const About = () => {
  return (
    <div className="w-full pb-[100px] bg-gray-50 text-black py-12">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24">
        <div className="rounded-xl p-6 shadow-customm bg-white border border-gray-100">
          {/* Title Section - More compact */}
          <section className="mb-10 relative">
            <div className="pl-4">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 relative tracking-tight">
                About Us
                <span className="absolute -bottom-2 left-0 w-20 h-1 bg-black" />
              </h1>
              <p className="text-base md:text-lg text-gray-700 max-w-3xl border-b pb-4 border-gray-200 leading-relaxed">
                TeexVerse is a brand where creativity meets quality. We craft
                modern, unique fashion pieces designed to express individuality and
                style.
              </p>
            </div>
          </section>

          {/* Compressed two-column info */}
          <section className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border-l-4 border-codee shadow-md">
              <h2 className="text-xl font-bold mb-2 text-black">Our Story</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Founded in 2025, TeexVerse emerged from a passion for merging
                fashion and innovation. We aim to inspire through original designs
                and sustainable practices that respect both people and planet.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border-l-4 border-codee shadow-md">
              <h2 className="text-xl font-bold mb-2 text-black">Our Mission</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                To empower individuals to express their identity through fashion.
                We create garments that reflect personality and purpose, designed
                to last both in style and quality.
              </p>
            </div>
          </section>

          {/* Values grid - Tightened spacing */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-black flex items-center">
              <span className="mr-2 w-6 h-1 bg-black inline-block" />
              Our Core Values
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Creativity",
                  text: "Each piece is a unique result of artistic exploration and innovation.",
                  icon: "✦"
                },
                {
                  title: "Quality",
                  text: "We use premium fabrics and expert craftsmanship in every garment.",
                  icon: "◆"
                },
                {
                  title: "Sustainability",
                  text: "Our materials and processes are chosen with environmental responsibility.",
                  icon: "❖"
                },
                {
                  title: "Customer Commitment",
                  text: "Your feedback shapes everything we do and how we grow.",
                  icon: "✧"
                },
              ].map((val, i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded-lg shadow-md border border-gray-100"
                >
                  <div className="text-2xl mb-2 text-codee">{val.icon}</div>
                  <h3 className="text-codee font-bold text-lg mb-1">
                    {val.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{val.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team section - More compact */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-black flex items-center">
              <span className="mr-2 w-6 h-1 bg-black inline-block" />
              Meet Our Team
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Apro",
                  role: "Creative Director",
                  bio: "With 10+ years in fashion design, Apro brings vision and direction to our collections."
                },
                {
                  name: "Apro",
                  role: "Head of Production",
                  bio: "Apro ensures our commitment to quality and sustainability in every production run."
                },
                {
                  name: "Apro",
                  role: "Customer Experience",
                  bio: "Apro leads our efforts to provide exceptional service at every touchpoint."
                }
              ].map((member, i) => (
                <div key={i} className="text-center p-4 bg-white rounded-lg shadow-md border border-gray-100 group">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-gray-800 group-hover:text-white transition-colors duration-300">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-codee mb-1">{member.name}</h3>
                  <p className="text-gray-500 font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Streamlined call to action */}
          <section className="relative overflow-hidden bg-gradient-to-br from-black to-gray-800 px-6 py-8 rounded-lg text-white">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="white" d="M47.7,-57.2C59.9,-45.3,67,-28.5,69.3,-11.2C71.6,6.1,69.1,23.8,60.4,37.2C51.8,50.5,37,59.5,20.6,64.8C4.3,70.2,-13.6,71.8,-27.9,65.9C-42.2,60,-52.9,46.5,-59.1,31.5C-65.4,16.4,-67.3,-0.3,-63.2,-15.1C-59.1,-29.9,-49.1,-42.9,-36.8,-54.5C-24.4,-66.1,-9.7,-76.5,4.4,-81.5C18.5,-86.5,35.5,-69.1,47.7,-57.2Z" transform="translate(100 100)" />
              </svg>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
              <div className="text-center md:text-left md:max-w-xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
                  Build Your Style With TeexVerse
                </h2>
                <p className="text-white text-opacity-90 text-base leading-relaxed">
                  Discover our latest collection and express your identity through fashion that matters.
                </p>
              </div>
              <button
                onClick={() => window.location.href='#products'}
                className="bg-white text-black hover:bg-gray-100 font-bold py-2 px-6 rounded-md shadow-md transition duration-300"
              >
                Explore Now
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;