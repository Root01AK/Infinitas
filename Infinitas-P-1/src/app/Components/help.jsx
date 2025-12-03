"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Help() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data from Strapi
  useEffect(() => {
    const fetchHelpData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          "http://127.0.0.1:1338/api/homes?populate=*"
        )

        const homeData = response.data?.data?.[0]
        if (homeData) {
          setData(homeData)
        }
      } catch (err) {
        // console.error("Error fetching help data:", err)
        setError("Failed to load help section")
      } finally {
        setLoading(false)
      }
    }

    fetchHelpData()
  }, [])

  if (loading) {
    return (
      <div className="help-section">
        <div className="help-container">
          <div style={{ padding: "100px 20px", textAlign: "center" }}>
            Loading help section...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="help-section">
        <div className="help-container">
          <div style={{ padding: "100px 20px", textAlign: "center", color: "red" }}>
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="help-section">
        <div className="help-container">
          <div style={{ padding: "100px 20px", textAlign: "center" }}>
            No data available
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="help-section">
      <div className="help-container">
        
        {/* Header Section */}
        <div className="help-header">
          <div className="help-header-text">
            <div className="help-established">
              <span>{data.Est}</span>
              <span className="help-line"></span>
              <span>{data.Estyear}</span>
            </div>
            <div className="help-description">
              <p>
                {data.EstTitle}
              </p>
              <p className="help-mission">
                {data.EstDescription?.split("\n").map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    {idx < data.EstDescription.split("\n").length - 1 && <br/>}
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>
          
          <div className="help-main-title">
            <h1>
              {data.EstBranding}
              {data.EstBrandingline1}
            </h1>
            <div className="help-subtitle">
              <h2>{data.EstBrandingline1}</h2>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="help-content">
          <div className="help-main-content">
            <div className="help-brand">
              <h2>{data.EstHelpText}</h2>
              <span className="trademark">©</span>
            </div>
          </div>
          
          {/* Materials Preview */}
          <div className="help-materials">
            <div className="material-item sand">
              <div className="material-icon">Advising today. Transforming tomorrow.</div>
              <span></span>
            </div>
            <div className="material-item cement">
              <div className="material-icon">⬣</div>
              <span></span>
            </div>
            <div className="material-item bricks">
              <div className="material-icon">⬡</div>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}