"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import axios from "axios";

gsap.registerPlugin(ScrollTrigger);

// Memoized helper to convert Strapi rich text
const renderRichText = (richTextArray) => {
  if (!Array.isArray(richTextArray)) return null;
  
  return richTextArray
    .filter(block => block.type === 'paragraph')
    .map((block, index) => {
      const text = block.children?.map(child => child.text).join('') || '';
      return text.trim() ? <p key={index}>{text}</p> : null;
    })
    .filter(Boolean);
};

// Transform team member data
const transformTeamMember = (member, apiUrl) => {
  let imageUrl = "/default-avatar.jpg";
  
  if (member.TeamImage?.[0]?.url) {
    imageUrl = `${apiUrl.replace('/api', '')}${member.TeamImage[0].url}`;
  }
  
  return {
    name: member.Name,
    designation: member.Designation,
    image: imageUrl,
    description: renderRichText(member.Description),
  };
};

export default function TeamScroll() {
  const sectionRef = useRef(null);
  const imageRefs = useRef([]);
  const textRefs = useRef([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoized ref callbacks - reuse same function instance
  const addImageRef = useCallback(el => {
    if (el && !imageRefs.current.includes(el)) {
      imageRefs.current.push(el);
    }
  }, []);

  const addTextRef = useCallback(el => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  }, []);

  // Load team data on mount
  useEffect(() => {
    const controller = new AbortController();

    const loadTeamData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
        const res = await axios.get(
          `${apiUrl}/teams?populate[TeamList][populate]=*`,
          { signal: controller.signal }
        );
        
        const teamList = res.data.data?.[0]?.TeamList || [];
        const transformed = teamList.map(member => 
          transformTeamMember(member, apiUrl)
        );
        
        setTeamMembers(transformed);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          // console.error("Error fetching team data:", err);
        }
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
    return () => controller.abort();
  }, []);

  // GSAP animation
  useGSAP(() => {
    if (teamMembers.length < 2) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 15%",
        end: "+=1500",
        scrub: true,
        pin: true,
      },
    });

    const GAP = 2;

    teamMembers.forEach((_, i) => {
      if (i === 0) return;

      const startTime = i === 2 ? i * 1.8 + GAP : i * 1.8;

      tl.to(imageRefs.current[i], {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        scale: 1,
        duration: 1,
      }, startTime)
        .to(textRefs.current[i], {
          opacity: 1,
          zIndex: 2,
          duration: 1,
        }, startTime)
        .to(imageRefs.current[i - 1], {
          opacity: 0,
          duration: 1,
        }, startTime + 0.5)
        .to(textRefs.current[i - 1], {
          opacity: 0,
          zIndex: 1,
          duration: 1,
        }, startTime + 0.5);
    });
  }, { scope: sectionRef, dependencies: [teamMembers] });

  if (loading) {
    return (
      <section className="team-section" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="loading-spinner">Loading team...</div>
      </section>
    );
  }

  if (!teamMembers.length) {
    return (
      <section className="team-section" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="error-message">No team members found</div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="team-section">
      <div className="team-container">
        <div className="team-image">
          {teamMembers.map((member, i) => (
            <React.Fragment key={i}>
              <img
                ref={addImageRef}
                className="image-layer"
                src={member.image}
                alt={member.name}
                loading={i === 0 ? "eager" : "lazy"}
                style={{
                  clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)",
                  opacity: i === 0 ? 1 : 0,
                  transform: "scale(1)",
                }}
              />
              <div
                className="text-layer"
                ref={addTextRef}
                style={{
                  opacity: i === 0 ? 1 : 0,
                  zIndex: i === 0 ? 2 : 1,
                  padding: "1rem",
                }}
              >
                <h2 className="team-name">{member.name}</h2>
                <p className="team-designation">{member.designation}</p>
                <div className="team-description">{member.description}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}