// Minimal Express auth server (demo only; not production-ready)
import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 8787;

app.use(express.json());
app.use(cookieParser());

// in-memory store
const users = new Map(); // email -> { id, email, passwordHash, plan, credits }

function setSession(res, email) {
  const token = Buffer.from(`${email}|${Date.now()}`).toString('base64');
  res.cookie('sid', token, { httpOnly: true, sameSite: 'lax' });
}

function getEmailFromCookie(req) {
  const token = req.cookies?.sid;
  if (!token) return null;
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const email = raw.split('|')[0];
    return users.has(email) ? email : null;
  } catch {
    return null;
  }
}

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password || !email.includes('@') || password.length < 6) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }
  if (users.has(email)) return res.status(409).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), email, passwordHash, plan: 'free', credits: 0 };
  users.set(email, user);
  setSession(res, email);
  res.json({ id: user.id, email: user.email, plan: user.plan, credits: user.credits });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = users.get(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  setSession(res, email);
  res.json({ id: user.id, email: user.email, plan: user.plan, credits: user.credits });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('sid');
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  const email = getEmailFromCookie(req);
  if (!email) return res.status(401).json({ error: 'Not signed in' });
  const { id, plan, credits } = users.get(email);
  res.json({ id, email, plan, credits });
});

app.post('/api/buy-credit', (req, res) => {
  const email = getEmailFromCookie(req);
  if (!email) return res.status(401).json({ error: 'Not signed in' });
  const u = users.get(email);
  u.credits += 1;
  res.json({ credits: u.credits });
});

app.post('/api/subscribe', (req, res) => {
  const email = getEmailFromCookie(req);
  if (!email) return res.status(401).json({ error: 'Not signed in' });
  const { plan } = req.body || {};
  if (!['standard', 'pro'].includes(plan)) return res.status(400).json({ error: 'Invalid plan' });
  const u = users.get(email);
  u.plan = plan;
  res.json({ plan: u.plan });
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});



