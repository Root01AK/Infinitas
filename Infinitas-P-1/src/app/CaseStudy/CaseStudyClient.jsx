'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { IoIosGlobe, IoMdClose } from "react-icons/io";
import axios from 'axios';

const CaseStudyPage = () => {
  const scrollRef = useRef(null);
  const [caseStudyList, setCaseStudyList] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expertiseTitle, setExpertiseTitle] = useState('');
  const [expertiseDescription, setExpertiseDescription] = useState('');

  // Fetch data from Strapi
  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'http://127.0.0.1:1338/api/expertise?populate[CaseStudy][populate]=Contents'
        );

        const expertiseData = response.data?.data?.[0];
        
        if (expertiseData) {
          // Set title and description from CMS
          setExpertiseTitle(expertiseData.ExpertiseTitle || 'Success Stories That Speak for Themselves');
          setExpertiseDescription(expertiseData.ExpertiseDescription || '');

          // Transform case studies
          if (expertiseData.CaseStudy) {
            const transformedData = expertiseData.CaseStudy.map((study) => {
              // Extract points from nested Keywords structure
              const points = study.Contents?.[0]?.Keywords?.map(keyword => {
                const text = keyword?.children?.[0]?.children?.[0]?.text || '';
                return text;
              }).filter(Boolean) || [];

              return {
                id: study.id.toString(),
                name: study.title,
                title: study.titleNumber,
                des: study.TitleDescription,
                points: points,
              };
            });

            setCaseStudyList(transformedData);
          }
        }
      } catch (err) {
        // console.error('Error fetching case studies:', err);
        setError('Failed to load case studies');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  // Wheel event listener for horizontal scroll
useEffect(() => {
  if (!scrollRef.current) return;

  const el = scrollRef.current;

  const onWheel = (e) => {
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    const atStart = el.scrollLeft <= 0;
    const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;

    if (e.deltaY > 0 && !atEnd) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    } else if (e.deltaY < 0 && !atStart) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  };

  // Attach listener now that DOM is updated
  window.addEventListener("wheel", onWheel, { passive: false });

  // Cleanup
  return () => window.removeEventListener("wheel", onWheel);

}, [caseStudyList]); // <-- ADD THIS DEPENDENCY


  const handleCardClick = useCallback((service) => {
    setSelectedService(service);
  }, []);

  const closePopup = useCallback(() => {
    setSelectedService(null);
  }, []);

  if (loading) {
    return (
      <div className="cs-container">
        <div className="cs-loading">Loading case studies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cs-container">
        <div className="cs-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="cs-container">
      <div className="cs-top-section">
        <h1 className="cs-heading">{expertiseTitle}</h1>
        <p className="cs-subtext">{expertiseDescription}</p>
      </div>

      <div ref={scrollRef} className="cs-scroll-section">
        {caseStudyList.map((list) => (
          <div
            key={list.id}
            className="cs-card"
            onClick={() => handleCardClick(list)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick(list)}
          >
            <div className="cs-card-header">
              <div className="cs-card-left">
                <p className="cs-card-name">{list.name}</p>
                <div className="cs-card-icon"><IoIosGlobe /></div>
              </div>
              <div className="cs-card-title">{list.title}</div>
            </div>
            <div className="cs-card-description">
              {list.des}
            </div>
          </div>
        ))}
      </div>

      {selectedService && (
        <div className="cs-popup-overlay" onClick={closePopup} role="dialog" aria-modal="true">
          <div className="cs-popup-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="cs-popup-close" 
              onClick={closePopup}
              aria-label="Close popup"
            >
              <IoMdClose />
            </button>
            <div className="cs-popup-header">
              <div className="cs-popup-icon">
                <IoIosGlobe />
              </div>
              <h2 className="cs-popup-title">{selectedService.name}</h2>
            </div>
            <div className="cs-popup-points">
              <h3>Key Highlights</h3>
              <ul>
                {selectedService.points?.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudyPage;