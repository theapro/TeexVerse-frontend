  import React from "react";
  import "../../src/index.css"; // Ensure custom styles are applied

  const brands = [
    { name: "Nike", logo: "https://banner2.cleanpng.com/20180610/eyz/aa8tygwat.webp" },
    { name: "The North Face", logo: "https://banner2.cleanpng.com/20180525/fgu/kisspng-the-north-face-discounts-and-allowances-clothing-c-5b0810ff0cf164.116529271527255295053.jpg" },
    { name: "Adidas", logo: "https://banner2.cleanpng.com/20180426/bhw/ave6by86s.webp" },
    { name: "Reebok", logo: "https://static.cdnlogo.com/logos/r/74/reebok.png" },
    { name: "Puma", logo: "https://e7.pngegg.com/pngimages/788/658/png-clipart-puma-herzogenaurach-logo-iron-on-brand-others-miscellaneous-mammal.png" },
    { name: "Levi's", logo: "https://static.cdnlogo.com/logos/l/40/levi-8217-s.png" },
    { name: "Uniqlo", logo: "https://static.vecteezy.com/system/resources/previews/048/116/300/non_2x/uniqlo-logo-design-template-free-png.png" },
    { name: "Hugo Boss", logo: "https://cdn.worldvectorlogo.com/logos/hugo-boss-logo.svg" },
  ];

  const BrandCarousel = () => {
      return (
        <div className="w-full mt-[-120px] bg-gradient-to-b from-gray-100 via-blue-50 to-gray-50">
          <div className="overflow-hidden p-10">
            <div className="slide-track flex animate-scroll">
              {brands.concat(brands).map((brand, index) => (
                <div key={index} className="slide h-[160px] w-[300px] flex-shrink-0 p-6 mx-2 flex items-center bg-white shadow-custom2 rounded-lg shadow-xs hover:shadow-customm duration-500 transition-all transform">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-24 h-24 object-contain mr-6"
                  />
                  <p className="text-xl font-medium text-gray-800">{brand.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
  };

  export default BrandCarousel;