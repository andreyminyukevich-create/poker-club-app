const config = require('./config');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middlewares/errorHandler');

const tournamentsRouter = require('./routes/tournaments');
const usersRouter = require('./routes/users');
const registrationsRouter = require('./routes/registrations');
const ratingsRouter = require('./routes/ratings');
const healthRouter = require('./routes/health');

const app = express();
app.set('trust proxy', 1);

// Security
app.use(helmet());

// CORS
var corsOptions = {
  origin: function(origin, callback) {
    var allowed = [
      'https://pleasing-gratitude-production.up.railway.app',
      'https://poker-club-app-production-41ec.up.railway.app'
    ];
    // Add custom origins from env
    if (config.allowedOrigins && config.allowedOrigins[0] !== '*') {
      config.allowedOrigins.forEach(function(o) {
        if (allowed.indexOf(o) === -1) allowed.push(o);
      });
    }
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin || allowed.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsing with size limit
app.use(express.json({ limit: '1mb' }));

// Rate limiting
var limiter = rateLimit({
  windowMs: config.rateLimitWindow,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'RateLimitError', message: 'Too many requests' },
});
app.use('/api/', limiter);

// Health
app.use('/', healthRouter);

// API routes
app.use('/api/tournaments', tournamentsRouter);
app.use('/api/users', usersRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/ratings', ratingsRouter);

// Root
app.get('/', function(req, res) {
  res.json({ ok: true, message: 'Poker Club API v2' });
});

// Error handler (must be last)
app.use(errorHandler);

// Keep Supabase alive - ping every 4 minutes
setInterval(function() {
  var supabase = require('./services/supabase');
  supabase.from('tournaments').select('id').limit(1).then(function() {
    console.log('[PING] Supabase alive');
  }).catch(function() {});
}, 4 * 60 * 1000);

app.listen(config.port, function() {
  console.log('[API] Server running on port ' + config.port);
});

// Start bot in same process
console.log('[BOOT] BOT_TOKEN present:', !!config.botToken);
if (config.botToken) {
  try {
    var startBot = require('./bot-worker-inline');
    startBot();
    console.log('[BOOT] Bot startup initiated');
  } catch (err) {
    console.error('[BOOT] Bot startup FAILED:', err.message, err.stack);
  }
} else {
  console.log('[BOT] BOT_TOKEN not set, bot not started');
}
