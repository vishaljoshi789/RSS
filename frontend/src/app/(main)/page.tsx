
import About from "./_components/About/About";
import Contact from "./_components/Contact/Contact";
import Divine from "./_components/DivineMission/Divine";
import Donation from "./_components/Donation/Donation";
import DonationList2 from "./_components/DonationList/DonationList";
import Founder from "./_components/Founder/Founder";
import Gallery from "./_components/Gallery/Gallery";
import Hero from "./_components/Hero/Hero";
import Highlights from "./_components/Highlights/Highlights";
import Press from "./_components/Press/Press";
import RssOverview from "./_components/RssOverview/RssOverview";
import Supporters from "./_components/Supporters/Supporters";
import Testimonials from "./_components/testimonials";

export default function Home() {
  return (
  <main className="w-full" role="main">
    <Hero />
    <Supporters />
    <About />
    <Founder />
    <RssOverview /> 
    <Divine />
    <Donation />
    <DonationList2 />

    <Highlights />

    <Gallery />

    <Press />

    <Contact />
    <Testimonials />
  </main>
  );
}
