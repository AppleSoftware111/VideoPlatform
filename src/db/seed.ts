import { db } from './index';
import { accounts, proxies, tasks, logs } from './schema';

async function main() {
  console.log('Clearing existing data...');
  await db.delete(logs);
  await db.delete(tasks);
  await db.delete(proxies);
  await db.delete(accounts);

  console.log('Inserting accounts...');
  const accs = await db.insert(accounts).values([
    { username: 'user_john123', passwordEncrypted: 'aes:256:...', status: 'active', userAgent: 'Mozilla/5.0...', healthScore: 98 },
    { username: 'crypto_fan_99', passwordEncrypted: 'aes:256:...', status: 'active', userAgent: 'Mozilla/5.0...', healthScore: 100 },
    { username: 'music_lover_x', passwordEncrypted: 'aes:256:...', status: 'cooldown', userAgent: 'Mozilla/5.0...', healthScore: 45 },
    { username: 'banned_bot_01', passwordEncrypted: 'aes:256:...', status: 'banned', userAgent: 'Mozilla/5.0...', healthScore: 0 },
    { username: 'active_viewer_1', passwordEncrypted: 'aes:256:...', status: 'active', userAgent: 'Mozilla/5.0...', healthScore: 99 },
  ]).returning();

  console.log('Inserting proxies...');
  const proxs = await db.insert(proxies).values([
    { protocol: 'socks5', address: '192.168.1.10', port: 1080, isActive: true, successRate: 99 },
    { protocol: 'http', address: '10.0.0.15', port: 8080, isActive: true, successRate: 85 },
    { protocol: 'https', address: '45.33.22.11', port: 3128, isActive: false, failCount: 15, successRate: 10 },
    { protocol: 'socks5', address: '172.16.0.5', port: 1080, isActive: true, successRate: 100 },
  ]).returning();

  console.log('Inserting tasks...');
  const tsks = await db.insert(tasks).values([
    { name: 'Campaign Alpha - Views', type: 'view', targetUrl: 'https://youtube.com/watch?v=demo1', desiredCount: 10000, currentCount: 4520, status: 'running', config: '{"minDuration": 30, "maxDuration": 120}' },
    { name: 'Mass Like - Music Vid', type: 'like', targetUrl: 'https://youtube.com/watch?v=demo2', desiredCount: 500, currentCount: 500, status: 'completed', config: '{"delay": 5}' },
    { name: 'Comment Bombing', type: 'comment', targetUrl: 'https://youtube.com/watch?v=demo3', desiredCount: 100, currentCount: 12, status: 'running', config: '{"templates": ["Great video!", "Awesome!", "Thanks for sharing."]}' },
    { name: 'Auto Subscribe Batch 1', type: 'subscribe', targetUrl: 'https://youtube.com/@targetchannel', desiredCount: 1000, currentCount: 0, status: 'pending', config: '{}' },
  ]).returning();

  console.log('Inserting logs...');
  await db.insert(logs).values([
    { taskId: tsks[0].id, accountId: accs[0].id, proxyId: proxs[0].id, level: 'INFO', message: 'Session started. Navigating to target URL.' },
    { taskId: tsks[0].id, accountId: accs[0].id, proxyId: proxs[0].id, level: 'DEBUG', message: 'Simulating human mouse movements.' },
    { taskId: tsks[0].id, accountId: accs[0].id, proxyId: proxs[0].id, level: 'INFO', message: 'Video playback started. Watching for 45s.' },
    { taskId: tsks[2].id, accountId: accs[2].id, proxyId: proxs[1].id, level: 'WARNING', message: 'Rate limit detected. Entering cooldown.' },
    { taskId: tsks[0].id, accountId: accs[1].id, proxyId: proxs[3].id, level: 'INFO', message: 'Action successfully registered.' },
  ]);

  console.log('Seed complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
