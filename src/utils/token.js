const jwt = require('jsonwebtoken');
const env = require('../config/env');

exports.generateAccessToken = (payload) => jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpiresIn });
exports.generateRefreshToken = (payload) => jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });
