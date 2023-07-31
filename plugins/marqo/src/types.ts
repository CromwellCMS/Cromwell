export type SettingsType = {
  /**
   * Url of Marqo instance
   */
  marqo_url?: string;

  /**
   * [Marqo index to use for products](https://docs.marqo.ai/0.0.21/API-Reference/indexes/)
   */
  index_name?: string;

  /**
   * Add secret to use in headers:  { 'Authorization': 'Bearer ${secret}' }
   */
  secret?: string;
};
