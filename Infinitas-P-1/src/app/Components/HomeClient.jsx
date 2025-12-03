"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Scrollcard from "../Components/Scrollcard";
import ModelViewer from "../Components/ModalViewer";
import Cta from "../Components/Cta";
import About from "../Components/About";
import Help from "../Components/help";

export default function HomeSection() {
  return (
    <>
      {/* Banner Section */}
      <ModelViewer />
      <About />
      <Scrollcard />
      <Help />
      <Cta />
    </>
  );
}
