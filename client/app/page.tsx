
import Hero from './sections/Hero';
import About from './sections/About-Us';
import OurBrands from './sections/Our-Brands';
import Team from './sections/Our-Team';
import OurServices from './sections/Our-Services';
import CTA from './sections/Cta';
import FAQ from './sections/Faq';
import OurPresence from './sections/Our-Presence';
import OurMarkets from './sections/Our-Markets';

export default function Home() {
  return (
    <div className="bg-white flex flex-col flex-1 items-center justify-center p-2">
      <Hero/>
      <About/>
      <OurMarkets/>
      <OurServices/>
      <OurPresence/>
      <OurBrands/>
      <Team/>
      <FAQ/>
      <CTA/>
    </div>
  );
}


// Hussein-Ghulam-Motors