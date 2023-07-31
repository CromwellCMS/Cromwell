export type TAppCustomConfig = {
  store: {
    currencyOptions: string[];
  };
  header: {
    logo: string;
    contactPhone: string;
    welcomeMessage: string;
    topLinks: TTopLink[];
  };
};

export type TTopLink = {
  title: string;
  href: string;
};
