import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Home from '@/components/home/Home';
import About from '@/components/about/About';
import Experience from '@/components/experience/Experience';
import Services from '@/components/services/Services';
import Portfolio from '@/components/portfolio/Portfolio';
import Contact from '@/components/contact/Contact';

export default function Page() {
  return (
    <>
      <Header />
      {/* Wrap main content in a <main> tag for better semantics */}
      <main>
        <Home />
        <About />
        <Experience />
        <Services />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </>
  );
}