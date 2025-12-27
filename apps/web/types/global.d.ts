interface Window {
  plausible?: (
    eventName: string, 
    options?: {
      props?: Record<string, string | number | boolean>;
      revenue?: {
        currency: string;
        amount: number;
      };
    }
  ) => void;
}