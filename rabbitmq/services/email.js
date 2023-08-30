const sgMail = require('@sendgrid/mail')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const {SENDGRID_API_KEY, SENDGRID_SENDER} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY)
const sendMessage=(message, to)=>{
    const msg = {
      to, 
      from: SENDGRID_SENDER, 
      subject: 'del mom de tomas',
      text: 'tu mensaje fue procesado',
      html: `<strong>Response: ${message}</strong>`,
    }
    sgMail
          .send(msg)
          .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
          })
          .catch((error) => {
            console.error(error)
          })
    return msg;
  }

module.exports = {
  sendMessage
}