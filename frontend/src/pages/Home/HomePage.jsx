import HomeHero from './components/HomeHero';
import AboutNTI from './components/AboutNTI';
import SubjectsOffered from './components/SubjectsOffered';
import AssociatedSchools from './components/AssociatedSchools';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <AboutNTI />
      <SubjectsOffered />
      <AssociatedSchools />
    </>
  );
}
