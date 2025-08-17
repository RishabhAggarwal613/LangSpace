import React from "react";
import Hero from "../components/home/Hero.jsx";
import FeatureGrid from "../components/home/FeatureGrid.jsx";
import AboutBlock from "../components/home/AboutBlock.jsx";
import Testimonials from "../components/home/Testimonials.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <AboutBlock />
      <Testimonials />
    </>
  );
}
