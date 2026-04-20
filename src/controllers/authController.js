const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User, RefreshToken } = require("../models");
const { success, error } = require("../utils/apiResponse");

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "30m",
    },
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },
  );
}

function getRefreshExpiryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
}

exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return error(res, "Email already registered", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      passwordHash,
      role: "USER",
    });

    return success(
      res,
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      "User registered",
      201,
    );
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !user.isActive) {
      return error(res, "Invalid email or password", 401);
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return error(res, "Invalid email or password", 401);
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    await RefreshToken.create({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: getRefreshExpiryDate(),
      revoked: false,
    });

    return success(
      res,
      {
        accessToken,
        refreshToken,
        tokenType: "Bearer",
      },
      "Login successful",
    );
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return error(res, "refreshToken is required", 400);
    }

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return error(res, "Invalid or expired refresh token", 401);
    }

    const tokenRecord = await RefreshToken.findOne({
      where: {
        tokenHash: hashToken(refreshToken),
        revoked: false,
      },
    });

    if (!tokenRecord) {
      return error(res, "Refresh token not found or revoked", 401);
    }

    if (new Date(tokenRecord.expiresAt) < new Date()) {
      return error(res, "Refresh token expired", 401);
    }

    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return error(res, "User not found or inactive", 401);
    }

    const newAccessToken = createAccessToken(user);

    return success(
      res,
      {
        accessToken: newAccessToken,
        tokenType: "Bearer",
      },
      "Token refreshed",
    );
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return error(res, "refreshToken is required", 400);
    }

    await RefreshToken.update(
      { revoked: true },
      {
        where: {
          tokenHash: hashToken(refreshToken),
        },
      },
    );

    return success(res, null, "Logged out successfully");
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "fullName", "email", "role", "createdAt"],
    });

    return success(res, user, "Current user");
  } catch (err) {
    next(err);
  }
};
