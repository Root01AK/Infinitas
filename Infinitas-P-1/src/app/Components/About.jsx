"use client";
import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import axios from "axios";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const missionRef = useRef(null);
  const centerRef = useRef(null);
  const promiseRef = useRef(null);
  const bottomRef = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from Strapi
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://127.0.0.1:1338/api/homes?populate=*"
        );

        const homeData = response.data?.data?.[0];
        if (homeData) {
          setData(homeData);
        }
      } catch (err) {
        // console.error("Error fetching about data:", err);
        setError("Failed to load about section");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Helper function to get image URL
  const getImageUrl = (imageArray) => {
    if (!imageArray || imageArray.length === 0) return "/default-image.jpg";
    const baseUrl = "http://127.0.0.1:1338";
    return `${baseUrl}${imageArray[0].url}`;
  };

  useGSAP(
    () => {
      if (!data) return;

      ScrollTrigger.getAll().forEach((t) => t.kill());
      // LEFT
      gsap.fromTo(
        missionRef.current,
        { x: -200, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // TOP
      gsap.fromTo(
        centerRef.current,
        { y: -200, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: centerRef.current,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // RIGHT
      gsap.fromTo(
        promiseRef.current,
        { x: 200, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: promiseRef.current,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // BOTTOM
      gsap.fromTo(
        bottomRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: bottomRef.current,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [data] }
  );

  if (loading) {
    return (
      <div className="home-about-section">
        <div className="loading-state">Loading about section...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-about-section">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="home-about-section">
        <div className="error-state">No data available</div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="home-about-section">
      <div className="home-about-container">
        <div className="home-about-top">
          {/* Mission */}
          <div ref={missionRef} className="home-about-mission">
            <h2>{data.OurMissionTitle}</h2>
            <p>{data.OurMissionDescription}</p>
            <div className="home-about-image">
              <img
                src={getImageUrl(data.OurMissionImage)}
                alt={data.OurMissionTitle}
              />
            </div>
          </div>

          {/* Center */}
          <div ref={centerRef} className="home-about-center">
            <div className="home-about-main-image">
              <img
                src={getImageUrl(data.AboutBanner)}
                alt="About Us Banner"
              />
              <div className="home-about-overlay">ABOUT&nbsp;US</div>
            </div>
          </div>

          {/* Vision */}
          <div ref={promiseRef} className="home-about-promise">
            <h2>{data.OurVisionTitle}</h2>
            <p>{data.OurVisionDescription}</p>
            <div className="home-about-image">
              <img
                src={getImageUrl(data.OurVisionImage)}
                alt={data.OurVisionTitle}
              />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div ref={bottomRef} className="home-about-bottom">
          <div className="home-about-left">
            <h1>
              {data.BrandTitle?.split("\n").map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < data.BrandTitle.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
          </div>
          <div className="home-about-right">
            <p>{data.BrandDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
}