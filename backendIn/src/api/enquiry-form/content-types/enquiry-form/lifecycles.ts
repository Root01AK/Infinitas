export default {
  async afterCreate(event: any) {
    const { result } = event;
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'info@infinitasadvisory.com';
      const fromEmail = process.env.SMTP_USER || 'infinitasadvisory@gmail.com';

      // Send email notification to admin
      await strapi.plugins['email'].services.email.send({
        to: adminEmail,
        from: fromEmail,
        replyTo: result.email,
        subject: `🎉 New Enquiry from ${result.firstName} ${result.lastName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .header {
                background: linear-gradient(135deg, #040d1e 0%, #1a2a4e 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0 0 10px 0;
                font-size: 28px;
                font-weight: 600;
              }
              .header p {
                margin: 0;
                opacity: 0.9;
                font-size: 14px;
              }
              .content {
                padding: 30px;
              }
              .field {
                margin-bottom: 24px;
              }
              .field-label {
                font-weight: 600;
                color: #040d1e;
                margin-bottom: 8px;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .field-value {
                color: #555;
                padding: 12px 16px;
                background: #f8f9fa;
                border-radius: 6px;
                border-left: 3px solid #ceae95;
                font-size: 15px;
              }
              .field-value a {
                color: #040d1e;
                text-decoration: none;
                font-weight: 500;
              }
              .field-value a:hover {
                text-decoration: underline;
              }
              .service-badge {
                display: inline-block;
                background: linear-gradient(135deg, #ceae95 0%, #b89a7f 100%);
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                font-weight: 600;
                font-size: 14px;
                box-shadow: 0 2px 4px rgba(206, 174, 149, 0.3);
              }
              .message-box {
                background: #f8f9fa;
                padding: 16px;
                border-radius: 6px;
                border-left: 3px solid #ceae95;
                white-space: pre-wrap;
                font-size: 15px;
                line-height: 1.6;
              }
              .actions {
                margin-top: 30px;
                padding: 25px;
                background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
                border-radius: 8px;
                text-align: center;
              }
              .actions p {
                margin: 0 0 15px 0;
                color: #2e7d32;
                font-weight: 600;
                font-size: 16px;
              }
              .btn {
                display: inline-block;
                padding: 12px 28px;
                text-decoration: none;
                border-radius: 6px;
                margin: 5px;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.3s ease;
              }
              .btn-primary {
                background: #040d1e;
                color: white;
              }
              .btn-secondary {
                background: #ceae95;
                color: white;
              }
              .footer {
                text-align: center;
                padding: 20px 30px;
                background: #f8f9fa;
                border-top: 1px solid #e0e0e0;
                color: #777;
                font-size: 12px;
              }
              .footer a {
                color: #040d1e;
                text-decoration: none;
                font-weight: 600;
              }
              @media only screen and (max-width: 600px) {
                .container {
                  margin: 10px;
                }
                .header, .content {
                  padding: 20px;
                }
                .btn {
                  display: block;
                  margin: 10px 0;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 New Enquiry Received!</h1>
                <p>Infinitas Advisory Contact Form</p>
              </div>
              
              <div class="content">
                <div class="field">
                  <div class="field-label">📋 Service Requested</div>
                  <div class="field-value">
                    <span class="service-badge">${result.service}</span>
                  </div>
                </div>

                <div class="field">
                  <div class="field-label">👤 Customer Name</div>
                  <div class="field-value">${result.firstName} ${result.lastName}</div>
                </div>

                <div class="field">
                  <div class="field-label">📧 Email Address</div>
                  <div class="field-value">
                    <a href="mailto:${result.email}">${result.email}</a>
                  </div>
                </div>

                <div class="field">
                  <div class="field-label">📞 Phone Number</div>
                  <div class="field-value">
                    <a href="tel:${result.phone.replace(/\s/g, '')}">${result.phone}</a>
                  </div>
                </div>

                <div class="field">
                  <div class="field-label">💬 Message</div>
                  <div class="message-box">${result.message}</div>
                </div>

                <div class="field">
                  <div class="field-label">🕒 Submitted At</div>
                  <div class="field-value">${new Date(result.createdAt).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                  })}</div>
                </div>

                <div class="actions">
                  <p>⚡ Quick Actions</p>
                  <a href="mailto:${result.email}" class="btn btn-primary">
                    📧 Reply via Email
                  </a>
                  <a href="tel:${result.phone.replace(/\s/g, '')}" class="btn btn-secondary">
                    📞 Call Customer
                  </a>
                </div>
              </div>

              <div class="footer">
                <p>This email was sent from your Infinitas Advisory contact form.</p>
                <p>Manage enquiries in your <a href="${process.env.STRAPI_ADMIN_URL || 'http://localhost:1337/admin'}">Strapi Dashboard</a></p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      
      await strapi.plugins['email'].services.email.send({
        to: result.email,
        from: fromEmail,
        subject: 'Thank you for contacting Infinitas Advisory',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .header {
                background: linear-gradient(135deg, #040d1e 0%, #1a2a4e 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
              }
              .content {
                padding: 30px;
              }
              .content p {
                margin: 15px 0;
              }
              .content a {
                color: #040d1e;
                text-decoration: none;
                font-weight: 600;
              }
              .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #777;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✨ Thank You!</h1>
              </div>
              <div class="content">
                <p>Dear ${result.firstName},</p>
                <p>Thank you for reaching out to Infinitas Advisory. We have received your enquiry regarding <strong>${result.service}</strong>.</p>
                <p>Our team will review your message and get back to you within 24-48 hours.</p>
                <p>If you need immediate assistance, please feel free to call us at <a href="tel:+919841059274">+91 9841059274</a>.</p>
                <p>Best regards,<br><strong>Infinitas Advisory Team</strong></p>
              </div>
              <div class="footer">
                <p>Infinitas Advisory | Dubai, UAE</p>
                <p>📧 info@infinitasadvisory.com | 📞 +91 9841059274</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    } catch (error) {
      // console.error('=================================');
    }
  },
};