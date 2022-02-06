const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")

var sendMail = {
    send : function(toEmail,ccEmail,fromEmail,subject, html){
        //data verification
        //mandatory data
        if( toEmail == null )
        {
            return null;
        }

        const msg = {
            to: toEmail,
            cc: ccEmail,
            //bcc: bccEmail,
            from: fromEmail,            
            subject: subject,
            html: html
            //text: text
          }

          sgMail
            .send(msg)
            .then(() => {
            console.log('Email sent')
            })
            .catch((error) => {
            console.error(error)
            })
    },
    sendwithoutcc: function(toEmail,fromEmail,subject, html){
        //data verification
        //mandatory data
        if( toEmail == null )
        {
            return null;
        }

        const msg = {
            to: toEmail,
            //cc: ccEmail,
            //bcc: bccEmail,
            from: fromEmail,            
            subject: subject,
            html: html
            //text: text
          }

          sgMail
            .send(msg)
            .then(() => {
            console.log('Email sent')
            })
            .catch((error) => {
            console.error(error)
            })
    }
}

module.exports = sendMail