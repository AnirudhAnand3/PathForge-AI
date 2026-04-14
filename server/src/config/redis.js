import { createClient } from 'redis';

const client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

client.on('error', (err) => console.log('Redis error:', err));
client.on('connect', () => console.log('✅ Redis connected'));

// Connect (non-blocking — app still works without Redis)
client.connect().catch(console.error);

export default client;