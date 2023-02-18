---
sidebar_position: 1
---

# Mail

Emailing is a required feature of every CMS for sending transactional e-mails such as password resets, order placements, etc.  
By default, Cromwell CMS sends emails with resources of [Node.js server](https://www.npmjs.com/package/sendmail). But often you may notice that messages end up in a "spam" folder or never reach an address. That usually happens with self-hosted servers because email service providers don't trust them without proper configuration.

To fix the situation Cromwell CMS provides integration with SMTP service providers. You can choose a provider dependent on your needs or preferences, for integration to work you have to provide a [connection string](https://nodemailer.com/smtp/) in the form: `smtps://username:password@smtp.example.com`

We do not promote any provider, but just for the sake of example, there is a short instruction on how to set up [Sendgrid](https://sendgrid.com/).

- [Create an account](https://signup.sendgrid.com/)
- [Create a new sender](https://app.sendgrid.com/settings/sender_auth/senders/new)
- [Create API key](https://app.sendgrid.com/guide/integrate/langs/smtp)
- Create a connection string with your key: `smtps://apikey:YOUR_API_KEY@smtp.sendgrid.net`, so it will look like: `smtps://apikey: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@smtp.sendgrid.net`
- Go to the Admin panel > Settings page > Emailing settings. In "Send e-mails from" paste the e-mail address you submitted for a Sendgrid sender in the field "From Email Address". Paste your connection string in the field below.

## Templates

Emailing templates can be fully customized for your website.  
Navigate to [`.cromwell/server/emails`](/docs/overview/installation#working-directories) directory. There are copied number of templates:

- `order.hbs` - For new order placement
- `forgot-password.hbs` - Email with secret code when user starts reset-password transaction.

The CMS uses [Handlebars](https://handlebarsjs.com/guide/) as templating engine. You can edit CMS templates as you like, just keep Handlebars variables to insert data.

:::important
Make a backup of your custom template. When you run CMS update, it may possibly replace your templates with new ones. Your templates may become incompatible if some variables change in original template. Even though we'll try not to change them or do that as less as possible, this possibility still exists for now. In the future, we'll work out more convenient way for such updates.
:::
