import Hero from "../../sections/hero/Hero";
import HomeFooter from "../../sections/home footer/HomeFooter";
import HowItWorks from "../../sections/how it works/HowItWorks";
import WhyOrderFromUs from "../../sections/why order from us/WhyOrderFromUs";

export default function Home() {
  return (
    <main className="page-container">
      <Hero />
      <HowItWorks />
      <WhyOrderFromUs />
      <HomeFooter />
    </main>
  );
}
