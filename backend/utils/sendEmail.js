import nodemailer from 'nodemailer';
export const sendEmail = async(options)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465, // true for port 465, false for other ports
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        },
        });
    // transporter.verify(function (error, success) {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log("Server is ready to take our messages");
    //     }
    //   });
    const mailOptions = {
        from : process.env.SMTP_MAIL,
        to:options.email,
        subject : options.subject,
        text : options.message,
    }
    await transporter.sendMail(mailOptions);
}