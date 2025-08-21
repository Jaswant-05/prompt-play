import Header from "../components/layout/Header";
import CTA from "../components/sections/CTA";
import Features from "../components/sections/Features";
import Hero from "../components/sections/Hero";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
    </div>
  );
}