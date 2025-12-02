const config = {
  apiGateway: {
    REGION: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    URL: import.meta.env.VITE_API_URL
  },
  cognito: {
    REGION: import.meta.env.VITE_COGNITO_REGION || 'us-east-1',
    USER_POOL_ID: import.meta.env.VITE_USER_POOL_ID,
    APP_CLIENT_ID: import.meta.env.VITE_APP_CLIENT_ID,
  }
};

export default config;
