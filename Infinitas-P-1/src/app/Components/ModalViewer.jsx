"use client";

import React, { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import axios from "axios";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1338/api";
const MEDIA_URL = process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL || "http://localhost:1338";

// 3D Model logic
const Model = () => {
  const groupRef = useRef();
  const { scene } = useGLTF("/infinity.glb");

  useEffect(() => {
    if (scene && groupRef.current) {
      const clonedScene = scene.clone();
      const box = new THREE.Box3().setFromObject(clonedScene);
      const size = new THREE.Vector3();
      box.getSize(size);

      if (size.length() > 0) {
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scaleFactor = 6 / maxDimension;
        clonedScene.scale.setScalar(scaleFactor);

        const center = new THREE.Vector3();
        box.getCenter(center);
        clonedScene.position.copy(center.multiplyScalar(-scaleFactor));
      }

      groupRef.current.clear();
      groupRef.current.add(clonedScene);
    }
  }, [scene]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.006;
    }
  });

  return <group ref={groupRef} />;
};

const ModelViewer = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      position: "relative",
    }}
  >
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 12], fov: 50 }}
      gl={{
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
      }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[8, 8, 8]}
        intensity={1.2}
        castShadow={false}
      />
      <pointLight position={[-8, -8, 8]} intensity={0.6} />
      <pointLight position={[0, 10, 0]} intensity={0.4} />
      <OrbitControls
        enableZoom={false}
        enableRotate={false}
        enablePan={false}
      />
      <Model />
    </Canvas>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // console.error("3D Model Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "transparent",
            color: "white",
            fontSize: "4rem",
          }}
        >
          ∞
        </div>
      );
    }
    return this.props.children;
  }
}

const SocialButton = ({ label, icon, onClick, isSvg }) => (
  <button
    onClick={onClick}
    aria-label={label}
    style={{
      width: "60px",
      height: "60px",
      clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)",
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(20px)",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      color: "white",
      fontSize: "1.2rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
      e.currentTarget.style.transform = "scale(1.1)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    {isSvg ? icon : <span>{icon}</span>}
  </button>
);

export default function BannerSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch CMS data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${STRAPI_BASE_URL}/homes?populate=*`,
          { timeout: 10000 }
        );
        
        if (isMounted && response.data?.data?.[0]) {
          setData(response.data.data[0]);
        }
      } catch (err) {
        // console.error("Error fetching banner data:", err);
        if (isMounted) setLoading(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

let videoUrl = null;

if (data?.BannerVideo?.length > 0 && data.BannerVideo[0]?.url) {
  videoUrl = `${MEDIA_URL}${data.BannerVideo[0].url}`;
  // console.log("✔ CMS Video URL:", videoUrl);
} else {
  // console.log("❌ No video in CMS, using fallback");
}


  const titleText = data?.TitleText || "Driving Business Through";
  const titleText1 = data?.TitleText1 || "Strategy, Innovation & Execution";

  return (
    <section
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Video Background */}
      {videoUrl ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            minWidth: "100%",
            minHeight: "100%",
            width: "100%",
            height: "100%",
            transform: "translate(-50%, -50%)",
            zIndex: -1,
            objectFit: "cover",
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            minWidth: "100%",
            minHeight: "100%",
            width: "100%",
            height: "100%",
            transform: "translate(-50%, -50%)",
            zIndex: -1,
            objectFit: "cover",
          }}
        >
          {/* <source src="/infin.webm" type="video/webm" />
          <source src="/infin.mp4" type="video/mp4" /> */}
          Your browser does not support the video tag.
        </video>
      )}

      {/* Dark overlays */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* 3D Model */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <ErrorBoundary>
          <Suspense
            fallback={
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "6rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                ∞
              </div>
            }
          >
            <ModelViewer />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Headline block */}
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "50%",
          transform: "translate(-50%, 0)",
          zIndex: 10,
          textAlign: "center",
          width: "100%",
          maxWidth: "900px",
          color: "white",
          pointerEvents: "none",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            fontSize: "28px",
            fontWeight: 400,
            color: "white",
            marginBottom: "0.7rem",
            lineHeight: 1.1,
            fontFamily: "var(--font)",
            textShadow: "0 2px 6px rgba(0,0,0,0.8)",
            textTransform: "uppercase",
          }}
        >
          {titleText}
        </div>
        <div
          style={{
            fontSize: "clamp(30px, 8vw, 62px)",
            fontWeight: 700,
            background: "linear-gradient(45deg, #ffffff, #ece3d0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1,
            fontFamily: "var(--font)",
            textTransform: "uppercase",
            textShadow: "0 2px 6px rgba(0,0,0,0.8)",
          }}
        >
          {titleText1}
        </div>
      </div>

      {/* Socials */}
      <div
        style={{
          position: "fixed",
          bottom: "20%",
          right: "20px",
          color: "white",
          textAlign: "center",
          zIndex: 10,
          paddingTop: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            flexDirection: "column",
          }}
        >
          <SocialButton
            label="Facebook"
            icon="f"
            onClick={() => window.open("https://www.facebook.com/profile.php?id=61583391791129", "_blank")}
          />
          <SocialButton
            label="Instagram"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            }
            onClick={() => window.open("https://www.instagram.com/infinitas_advisory/", "_blank")}
            isSvg={true}
          />
          <SocialButton
            label="LinkedIn"
            icon="in"
            onClick={() => window.open("https://www.linkedin.com/company/infinitasadvisory/", "_blank")}
          />
        </div>
      </div>
    </section>
  );
}

useGLTF.preload("/infinity.glb");