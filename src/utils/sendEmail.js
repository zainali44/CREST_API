import nodemailer from "nodemailer";



const sendMail = (email,emailToken) => {
    console.log("ENTER TO SEND EMAIL");
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user:process.env.EMAIL_SENDER,
          pass: process.env.EMAIL_PASSWORD,
        },
    });
    console.log(`EMAIL ${email}`);

    const mailOptions = {
        from: 'Zettabyte',
        to: `${email}`,
        subject: 'Please verify your email...',
        html:`<p>Hello, verify your email address by clicking on this</p>
        <br>
        <a href="${process.env.MAIN_URL}/users/verify-email?emailToken=${emailToken}">Click here to verify</a>
        `
    };
        console.log(`EMAIL ${mailOptions}:`);


    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

export default sendMail;