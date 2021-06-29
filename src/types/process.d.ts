declare const process: {
  env: {
    USERNAME: string;
    PASSWORD: string;
    INTERVAL: number;
    URL: string;
    KAFKA_HOST?: string;
    SCHEMA_REGISTRY?: string;
    KAFKA_CLIENT_ID?: string;
  };
};
