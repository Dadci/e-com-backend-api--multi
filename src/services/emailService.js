const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
    try {
        const data = await resend.emails.send({
            from: 'E-commerce Store <onboarding@resend.dev>', // Resend's free testing email
            to: options.email, // Note: On the free tier, you can only send emails to your own verified email address!
            subject: options.subject,
            html: options.message,
        });

        console.log('Email sent successfully:', data.id);
        return data;
    } catch (error) {
        console.error('Error sending email via Resend:', error);
        throw new Error('Email could not be sent');
    }
};

module.exports = { sendEmail };