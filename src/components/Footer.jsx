const Footer = () => {
    return (
        <footer className="bg-blue text-white py-2 mt-5">
          <section className="relative flex flex-col max-w-7xl z-20 mx-auto py-12 px-6 md:px-12">
        <div className="container mx-auto flex justify-between items-start">
          {/* Left: Logo Section */}
          <div>
            <h2 className="text-2xl font-bold">
              Skill<span className="text-black">Verse</span>
            </h2>
          </div>
  
          {/* Right: Social Links */}
          <div className="text-right">
            <h3 className="font-bold mb-2">Social</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Pinterest
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
  
        {/* Bottom Text */}
        <div className="text-center mt-8 text-sm">
          © 2024 SkillVerse. All rights reserved.
        </div>
      </section>
      </footer>
    );
  };
  
  export default Footer;
  