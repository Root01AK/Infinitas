"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AboutOurValues from "../Components/Ourvalues";
import Aboutus from "../Components/Aboutus";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const extractListItems = (blocks = []) => {
  const items = [];
  blocks.forEach((block) => {
    if (block.type === "list" && Array.isArray(block.children)) {
      block.children.forEach((li) => {
        if (li.type === "list-item" && Array.isArray(li.children)) {
          const text = li.children.map((c) => c.text || "").join(" ").trim();
          if (text) items.push(text);
        }
      });
    }
  });
  return items;
};

const extractMissionLines = (blocks = []) => {
  const lines = [];
  blocks.forEach((block) => {
    if (block.type === "list" && Array.isArray(block.children)) {
      block.children.forEach((li) => {
        if (li.type === "list-item" && Array.isArray(li.children)) {
          const text = li.children.map((c) => c.text || "").join(" ").trim();
          if (text) lines.push(text);
        }
      });
    } else if (block.type === "paragraph" && Array.isArray(block.children)) {
      const text = block.children.map((c) => c.text || "").join(" ").trim();
      if (text) lines.push(text);
    }
  });
  return lines;
};

export default function AboutClient({ initialData }) {
  const cardRef = useRef(null);
  const bgRef = useRef(null);
  const contentRefs = useRef([]);
  // Vision-Mission
  const visionMissionRef = useRef(null);
  const visionRef = useRef(null);
  const missionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Use initial data from server or fallback to empty object
  const aboutData = initialData || {};

  const visionBlocks = aboutData?.VisionDescription || [];
  const missionBlocks = aboutData?.MissionDescription || [];
  const aboutExperience = aboutData?.AboutExperience || [];
  const visionLines = extractListItems(visionBlocks);
  const missionLines = extractMissionLines(missionBlocks);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // === WHO WE ARE CARD ===
  useGSAP(
    () => {
      const card = cardRef.current;
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 100,
          x: -60,
          rotateZ: -15,
          scale: 0.95,
        },
        {
          scrollTrigger: {
            trigger: card,
            start: "top 60%",
            end: "top 10%",
            scrub: true,
          },
          opacity: 1,
          y: 0,
          x: 0,
          rotateZ: 0,
          scale: 1,
          ease: "power3.out",
        }
      );

      gsap.from(contentRefs.current, {
        scrollTrigger: {
          trigger: card,
          start: "top 70%",
        },
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
      });
    },
    { scope: cardRef }
  );

  // === VISION & MISSION ===
  useGSAP(
    () => {
      const section = visionMissionRef.current;
      const vision = visionRef.current;
      const mission = missionRef.current;
      if (!section || !vision || !mission) return;

      const mm = gsap.matchMedia();

      // Desktop animation (>768px)
      mm.add("(min-width: 769px)", () => {
        // Set initial positions - both cards start from bottom
        gsap.set(vision, {
          x: "-25%",
          y: "150%",
          opacity: 0,
          scale: 0.9,
        });

        gsap.set(mission, {
          x: "25%",
          y: "150%",
          opacity: 0,
          scale: 0.9,
        });

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 1,
          pinSpacing: true,
          onUpdate: (self) => {
            const progress = self.progress;

            if (progress <= 0.5) {
              // First half: Vision slides up from bottom-left
              const visionProgress = progress / 0.5;
              gsap.set(vision, {
                x: "-25%",
                y: `${150 - 150 * visionProgress}%`,
                opacity: visionProgress,
                scale: 0.9 + 0.1 * visionProgress,
              });
            } else {
              // Vision stays in position
              gsap.set(vision, {
                x: "-25%",
                y: "0%",
                opacity: 1,
                scale: 1,
              });

              // Second half: Mission slides up from bottom-right
              const missionProgress = (progress - 0.5) / 0.5;
              gsap.set(mission, {
                x: "25%",
                y: `${150 - 150 * missionProgress}%`,
                opacity: missionProgress,
                scale: 0.9 + 0.1 * missionProgress,
              });
            }
          },
        });
      });

      // Tablet animation (481px - 768px)
      mm.add("(min-width: 481px) and (max-width: 768px)", () => {
        gsap.set(vision, {
          x: 0,
          y: "100%",
          opacity: 0,
          scale: 0.9,
        });

        gsap.set(mission, {
          x: 0,
          y: "100%",
          opacity: 0,
          scale: 0.9,
        });

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 1,
          pinSpacing: true,
          onUpdate: (self) => {
            const progress = self.progress;

            if (progress <= 0.5) {
              const visionProgress = progress / 0.5;
              gsap.set(vision, {
                x: 0,
                y: `${100 - 100 * visionProgress}%`,
                opacity: visionProgress,
                scale: 0.9 + 0.1 * visionProgress,
              });
            } else {
              gsap.set(vision, {
                x: 0,
                y: "0%",
                opacity: 1,
                scale: 1,
              });

              const missionProgress = (progress - 0.5) / 0.5;
              gsap.set(mission, {
                x: 0,
                y: `${100 - 100 * missionProgress}%`,
                opacity: missionProgress,
                scale: 0.9 + 0.1 * missionProgress,
              });
            }
          },
        });
      });

      // Mobile - Simple stacked layout (<=480px)
      mm.add("(max-width: 480px)", () => {
        // Clear GSAP properties
        gsap.set([vision, mission], {
          clearProps: "all",
        });

        // Simple fade-in animations
        gsap.fromTo(
          vision,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: vision,
              start: "top 80%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          mission,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: mission,
              start: "top 80%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: visionMissionRef, dependencies: [isMobile] }
  );

  return (
    <div className="about-us-container">
      <Aboutus aboutData={aboutData} />
      {/* WHO WE ARE CARD */}
      <section
        className="about-section-wrapper"
        style={{ position: "relative" }}
      >
        <div
          className="about-who-we-are"
          ref={cardRef}
          style={{ position: "relative", zIndex: 2 }}
        >
          <div className="about-who-we-content">
            <h1 ref={(el) => (contentRefs.current[0] = el)}>
            {aboutData.secTitle || "Who We Are"}
            </h1>
            <p ref={(el) => (contentRefs.current[1] = el)}>
              {aboutData.secDescription ||
                "Infinitas Advisory is a multifaceted services firm specializing in Advisory, Consulting & Marketing incorporated at RAZEZ, UAE."}
            </p>
          </div>
          <div className="about-who-experience">
            <div
              className="about-experience"
              ref={(el) => (contentRefs.current[2] = el)}
            >
              <h1 className="about-experience-title">
                {aboutExperience[0]?.aboutexperiencetitle || "25+ Years"}
              </h1>
              <p>{aboutExperience[0]?.aboutexperiencedescription || "in Business"}</p>
            </div>
            <div
              className="about-clients"
              ref={(el) => (contentRefs.current[3] = el)}
            >
              <h1 className="about-clients-title">
                {aboutExperience[1]?.aboutexperiencetitle || "30+ Clients"}
              </h1>
              <p>
                {aboutExperience[1]?.aboutexperiencedescription ||
                  "across the globe"}
              </p>
            </div>
            <div
              className="about-Project"
              ref={(el) => (contentRefs.current[4] = el)}
            >
              <h1 className="about-Project-title">
                {aboutExperience[2]?.aboutexperiencetitle || "75+ Projects"}
              </h1>
              <p>
                {aboutExperience[2]?.aboutexperiencedescription ||
                  "completed successfully"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <AboutOurValues aboutData={aboutData} />

      {/* Vision & Mission */}
      <section
        className="about-vision-mission"
        ref={visionMissionRef}
        style={{
          padding: isMobile ? "2rem 1rem" : "4rem 2rem",
          backgroundImage: "url('/infinbg.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          position: "relative",
          width: "100%",
          minHeight: isMobile ? "auto" : "100vh",
          height: isMobile ? "auto" : "100vh",
          display: isMobile ? "flex" : "block",
          flexDirection: isMobile ? "column" : "initial",
          gap: isMobile ? "2rem" : "0",
          paddingTop: isMobile ? "3rem" : "4rem",
          paddingBottom: isMobile ? "3rem" : "4rem",
        }}
      >
        {/* Vision */}
        <div
          className="about-vision"
          ref={visionRef}
          style={{
            position: isMobile ? "relative" : "absolute",
            left: isMobile ? "auto" : "200px",
            top: isMobile ? "auto" : "200px",
            width: isMobile ? "100%" : "650px",
            maxWidth: isMobile ? "100%" : "50vw",
            height: isMobile ? "auto" : "500px",
            minHeight: isMobile ? "auto" : "450px",
            background: "var(--background)",
            borderRadius: "10px",
            padding: isMobile ? "2rem 1.5rem" : "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "1.75rem" : "2.5rem",
              fontWeight: "bold",
              color: "#040d1e",
              marginBottom: isMobile ? "1.5rem" : "2.5rem",
              textAlign: "center",
            }}
          >
            {aboutData.VisionTitle || "Our Vision"}
          </h2>
          <ul
            style={{
              margin: 0,
              padding: "0 0 0 1.25rem",
              width: "100%",
            }}
          >
            {visionLines.map((text, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: isMobile ? "0.95rem" : "16px",
                  lineHeight: "1.6",
                  color: "#040d1e",
                  textAlign: "left",
                  marginBottom:
                    idx === visionLines.length - 1
                      ? 0
                      : isMobile
                      ? "0.75rem"
                      : "1rem",
                }}
              >
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Mission */}
        <div
          className="about-mission"
          ref={missionRef}
          style={{
            position: isMobile ? "relative" : "absolute",
            right: isMobile ? "auto" : "200px",
            top: isMobile ? "auto" : "200px",
            left: isMobile ? "auto" : "initial",
            width: isMobile ? "100%" : "650px",
            maxWidth: isMobile ? "100%" : "60vw",
            height: isMobile ? "auto" : "500px",
            minHeight: isMobile ? "auto" : "450px",
            background: "#040d1e",
            borderRadius: "10px",
            padding: isMobile ? "2rem 1.5rem" : "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "1.75rem" : "2.5rem",
              fontWeight: "bold",
              color: "#ceae95",
              marginBottom: isMobile ? "1.5rem" : "1.5rem",
              textAlign: "center",
            }}
          >
            {aboutData.MissionTitle || "Our Mission"}
          </h2>
          <ul
            style={{
              margin: 0,
              padding: "0 0 0 1.25rem",
              width: "100%",
            }}
          >
            {missionLines.map((text, idx) => {
              const isIntro = idx < 2; // first two act like regular bullets
              return (
                <li
                  key={idx}
                  style={{
                    fontSize: isMobile ? "0.95rem" : isIntro ? "16px" : "15px",
                    lineHeight: "1.6",
                    color: "rgba(255, 255, 255, 0.9)",
                    textAlign: isIntro ? "left" : "justify",
                    marginBottom:
                      idx === missionLines.length - 1
                        ? 0
                        : isMobile
                        ? "0.75rem"
                        : "1rem",
                    listStyleType: isIntro ? "disc" : "none",
                    paddingLeft: isIntro ? undefined : "1rem",
                  }}
                >
                  {text}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}