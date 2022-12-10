export type SettingsType = {
  /**
   * [Paypal client_id](https://developer.paypal.com/docs/api-basics/manage-apps/)
   */
  client_id?: string;

  /**
   * Paypal client_secret
   */
  client_secret?: string;

  /**
   * Paypal mode https://developer.paypal.com/docs/api-basics/sandbox/
   */
  mode?: string;
};
