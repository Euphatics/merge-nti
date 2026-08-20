/**
 * Generates the bcrypt hash for ADMIN_PASSWORD_HASH.
 *
 *   npm run hash-password -- "your-admin-password"
 *
 * The plaintext password is never stored anywhere — paste the printed hash into
 * the environment configuration and discard the original.
 */
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "your-admin-password"\n');
  console.error('Tip: a suitable JWT_TOKEN is also printed below.\n');
  console.error(`JWT_TOKEN="${crypto.randomBytes(32).toString('hex')}"`);
  process.exit(1);
}

if (password.length < 12) {
  console.error('❌ Choose an admin password of at least 12 characters.');
  process.exit(1);
}

const hash = await bcryptjs.hash(password, 12);

console.log('\nAdd these to your environment configuration:\n');
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
console.log(`JWT_TOKEN="${crypto.randomBytes(32).toString('hex')}"`);
console.log('\n⚠️  In hPanel, paste the hash exactly — including the $ characters.\n');
