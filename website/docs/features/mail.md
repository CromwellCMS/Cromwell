---
sidebar_position: 1
---

# Mail

E-mailing is a required feature of every CMS for sending transactional e-mails, password resets, order placements, etc.  
By default Cromwell CMS is sending emails with resources of [Node.js server](https://www.npmjs.com/package/sendmail). But you often may notice that messages end up in a "spam" folder or never reach an address. Which is normal case because email service providers don't trust self-hosted servers without proper configuration.

To fix the situation Cromwell CMS provides integration with SMTP service providers via [nodemailer](https://nodemailer.com/about/). You can choose a provider dependent on your needs or preferences, what you have to provide to the CMS is a connection string.

We do not promote any provider, but just for the sake of example, there is a short instruction how to setup [Sendgrid](https://sendgrid.com/).  
- [Create account](https://signup.sendgrid.com/)
- [Create a new sender](https://app.sendgrid.com/settings/sender_auth/senders/new)
- [Create API key](https://app.sendgrid.com/guide/integrate/langs/smtp) 
- Create a connection string with your key: `smtps://apikey:YOUR_API_KEY@smtp.sendgrid.net`, so it will look like: `smtps://apikey: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@smtp.sendgrid.net`
- Go to the CMS admin panel, settings page, scroll to E-mailing settings. In "Send e-mails from" paste e-mail address you submitted for a Sendgrid sender in field "From Email Address". Paste your connection string in a field below.