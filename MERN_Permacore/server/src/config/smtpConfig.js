const getSmtpConfig = () => {
    return {
      host: process.env.SMTP_HOST,
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASS
    };
  };
  
  module.exports = { getSmtpConfig };
  