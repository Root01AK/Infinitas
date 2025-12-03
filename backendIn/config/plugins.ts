module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env('SMTP_PORT', 587),
        secure: false, // true for 465, false for other ports
        auth: {
          user: env('SMTP_USER'),
          pass: env('SMTP_PASSWORD'),
        },
        // Optional: helpful for debugging
        logger: true,
        debug: true,
      },
      settings: {
        defaultFrom: env('SMTP_USER'),
        defaultReplyTo: env('SMTP_USER'),
      },
    },
  },
});