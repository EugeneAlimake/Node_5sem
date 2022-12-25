const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "eugenealimake@gmail.com",
        pass: "zckrhfytzahfdtup",
    },
});

function send(mail) {
    const option = {
        from: "eugenealimake@gmail.com",
        to: "eugenealimake@gmail.com",
        subject: "Send function",
        text: mail,
    };

    transport.sendMail(option, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
}

module.exports = send;