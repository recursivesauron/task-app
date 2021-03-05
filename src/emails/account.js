const sgMail = require('@sendgrid/mail')
const sendgridapikey = process.env.SENDGRID_API_KEY
sgMail.setApiKey(sendgridapikey)
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'r.trudeau124@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'r.trudeau124@gmail.com',
        subject: 'Sorry to see you go',
        text: `Goodbye ${name}. We hope to see you back again in the future :)`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}