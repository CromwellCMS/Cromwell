---
sidebar_position: 4
---

# Payments

Cromwell CMS intends to provide ready full-featured solution for online stores. A convenient payments service is a must-have feature for a modern store website.  
We do not promote any payments service provider, and new providers will be added subsequently. Please create and upvote such requests at https://github.com/CromwellCMS/Cromwell/issues

Right now we have integrations with the following services:

- [Stripe](https://stripe.com/)
- [Paypal](https://developer.paypal.com/)

## Stripe

We use this provider by default in test mode, so you can already try it in the default store theme. To make a test payment you can use card number `4242 4242 4242 4242`.

To setup your payments, create a new account at https://stripe.com, go to dashboard > developers > [API keys](https://dashboard.stripe.com/test/apikeys) and copy Secret key.
Now go to Cromwell Admin panel > Plugins > Stripe integration > paste your key into `Stripe Secret API Key` field, click Save.  
After you activate and setup your Stripe account at stripe.com payments should work.

If `Pay with card / Google Pay` button is still disabled in your default store, there may be something wrong with your account setup. You can check server's logs or `[project root]/.cromwell/logs/error.log` for detailed info.
