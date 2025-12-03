import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'

export default function Cta() {
  const [ctaTitle, setCtaTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data from Strapi
  useEffect(() => {
    const fetchCtaData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          "http://127.0.0.1:1338/api/homes?populate=*"
        )

        const homeData = response.data?.data?.[0]
        if (homeData && homeData.CTA && homeData.CTA.length > 0) {
          setCtaTitle(homeData.CTA[0].Title || 'Eager to shape a brand-new reality?')
        }
      } catch (err) {
        // console.error("Error fetching CTA data:", err)
        setError("Failed to load CTA section")
        // Set default title as fallback
        setCtaTitle('Eager to shape a brand-new reality?')
      } finally {
        setLoading(false)
      }
    }

    fetchCtaData()
  }, [])

  return (
    <section className="cta-section">
      <div className="logo-container">
        <Image 
          src="/cta.gif" 
          alt="Infinitas Animated Logo" 
          width={400}
          height={200}
          className="animated-logo"
          priority
          unoptimized 
        />
      </div>

      <h1 className="cta-heading">
        {ctaTitle}
      </h1>

      <div className="cta-buttons">
        <a href='tel:/919841059274' className="btn btn-primary">
          Contact&nbsp;Now
        </a>
        
        <a href='mailto:/info@infinitasadvisory.com' className="btn btn-secondary">
          Drop a Mail
        </a>
      </div>
    </section>
  )
}