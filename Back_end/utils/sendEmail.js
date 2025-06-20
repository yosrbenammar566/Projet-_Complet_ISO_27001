const nodemailer = require('nodemailer');


const sendVerificationCode = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Use environment variable for email
            pass: process.env.EMAIL_PASS // Use environment variable for password
        }
    });

    await transporter.sendMail({
        from: `"Verify Code" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code',
        html: `<h2>Your code is: <b>${code}</b></h2><p>Expires in 10 minutes.</p>`
    });
};

module.exports = { sendVerificationCode };
