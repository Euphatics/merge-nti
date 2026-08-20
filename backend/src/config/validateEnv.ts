/**
 * Validates that all required environment variables are set at startup.
 * Call this before starting the server to fail fast on misconfiguration.
 */
export function validateEnv(): void {
  const required = [
    'DATABASE_URL',
    'JWT_TOKEN',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD_HASH',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('\nPlease set them in your .env file. See .env.example for reference.');
    process.exit(1);
  }

  // Warn about weak JWT secret
  const jwtSecret = process.env.JWT_TOKEN!;
  if (jwtSecret.length < 32) {
    console.warn('⚠️  JWT_TOKEN is shorter than 32 characters. Consider using a stronger secret.');
  }
}
