import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    auth: {
        user:process.env.NODEMAILER_USER, 
        pass:process.env.NODEMAILER_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
    try {
        const mailOptions = {
            from: '"Your Name" <your-email@example.com>',
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};