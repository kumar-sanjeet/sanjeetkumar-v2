import React from 'react';
import Image from 'next/image'; // Use next/image for optimization
import ME from '../../assets/me-about.jpg'; // Assuming asset path
import { FaAward } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { VscFolderLibrary } from 'react-icons/vsc';
import './about.css';

const About = () => {
  return (
    <section id="about">
      {/* ... other content ... */}
      <div className="container about__container">
        <div className="about__me">
          <div className="about__me-image">
            {/* Add descriptive alt text for accessibility and SEO */}
            <Image src={ME} alt="Sanjeet Kumar smiling" />
          </div>
        </div>
        <div className="about__content">
          {/* ... cards and paragraph ... */}
        </div>
      </div>
    </section>
  );
};

export default About;