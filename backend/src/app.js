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

// Security
app.use(helmet());

// CORS
var corsOptions = {};
if (config.allowedOrigins[0] === '*') {
  corsOptions = {};
} else {
  corsOptions = {
    origin: function(origin, callback) {
      if (!origin || config.allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true,
  };
}
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

app.listen(config.port, function() {
  console.log('[API] Server running on port ' + config.port);
});
