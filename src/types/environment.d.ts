declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'local' | 'developer' | 'staging' | 'prod';
    MINIO_ENDPOINT: string;
    MINIO_PORT: string;
    MINIO_USE_SSL: string;
    MINIO_ACCESS_KEY: string;
    MINIO_SECRET_KEY: string;
    MINIO_BUCKET_NAME: string;
  }
}
