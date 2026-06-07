const {
  registerUser,
  loginUser,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
  requestPasswordReset,
  resetPassword,
} = require("../services/authService");
const { env } = require("../config/env");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await registerUser(
      req.body,
      {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      }
    );

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    return res.status(201).json({
      user,
      accessToken,
    });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body, {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    return res.status(200).json({
      user,
      accessToken,
    });
  } catch (err) {
    return next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const tokens = await rotateRefreshToken(refreshToken, {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);

    return res.status(200).json({
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    return next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    res.clearCookie("refreshToken", CLEAR_COOKIE_OPTIONS);

    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    return next(err);
  }
};

const logoutAll = async (req, res, next) => {
  try {
    await revokeAllRefreshTokens(req.user.id);

    return res.status(200).json({ message: "Logged out everywhere" });
  } catch (err) {
    return next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { resetToken } = await requestPasswordReset(req.body, {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    const payload = {
      message: "If the account exists, a reset link was issued.",
    };

    if (env.nodeEnv !== "production" && resetToken) {
      payload.resetToken = resetToken;
    }

    return res.status(200).json(payload);
  } catch (err) {
    return next(err);
  }
};

const resetPasswordHandler = async (req, res, next) => {
  try {
    await resetPassword(req.body);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  forgotPassword,
  resetPasswordHandler,
};
