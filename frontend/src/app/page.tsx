import Navbar from '@/components/Navbar';
import AboutSection from '@/components/AboutSection';
import EventsSection from '@/components/EventsSection';
import ScheduleSection from '@/components/ScheduleSection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <main>
      <Navbar />
      <AboutSection />
      <EventsSection />
      <ScheduleSection />
      <ContactSection />
    </main>
  );
}
