---
sidebar_position: 3
---

# Payments

Cromwell CMS intended to provide ready full-featured solution for online stores. Convenient payments service is a must-have feature for a modern website.  
We do not promote any payments service provider, and new providers will be added subsequently. Please create and upvote such requests at https://github.com/CromwellCMS/Cromwell/issues  

Right now we have integrations with following services: 

- [Stripe](https://stripe.com/)


## Stripe

We use this provider by default in test mode, so you can already try it in our default store theme.  
To setup your payments, create a new account at https://stripe.com, go to dashboard > developers > [API keys](https://dashboard.stripe.com/test/apikeys) and copy Secret key.
Now go to Cromwell Admin panel > Settings > Store settings > paste your key into `Stripe API key` field, click Save.  
Activate and setup your stripe account, payments then should work.

If `Pay with card / Google Pay` button is still disabled in your default store, there maybe something wrong with your account setup. You can check server's logs or ./.cromwell/logs/error.log for detailed info. 
