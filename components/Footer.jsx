"use client";

const Footer = () => {
  return (
    <div className="relative">
      {/* Back to Top Button */}
      <div className="text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-[#6387CE] text-white px-4 py-2 mb-10 -mt- rounded-md text-sm hover:bg-[#4058A4] shadow-sm hover:shadow-md transition-all cursor-pointer duration-300 ease-in-out transform hover:scale-105"
        >
          Back to top ↑
        </button>
      </div>

      {/* Wave SVG */}
      <div className="w-full overflow-hidden leading-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="#AAC3E6"
            fillOpacity="1"
            d="M0,64L40,53.3C80,43,160,21,240,26.7C320,32,400,64,480,112C560,160,640,224,720,224C800,224,880,160,960,149.3C1040,139,1120,181,1200,186.7C1280,192,1360,160,1400,144L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Footer */}
      <footer className="bg-[#AAC3E6] pt-6 pb-6 shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-800">
            © Copyright {new Date().getFullYear()} Scheduro. All Rights Reserved
          </p>
          <p className="text-sm text-gray-800">
            📩 <a href="mailto:support@scheduro.com">support@scheduro.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
