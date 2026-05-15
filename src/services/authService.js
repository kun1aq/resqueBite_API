const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const prisma = require("../config/database");
const env = require("../config/env");
const AppError = require("../utils/AppError");
const { sendVerificationEmail } = require("./emailService");

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      type: "refresh"
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN }
  );
}

async function deliverVerificationCode(email, verificationToken) {
  let emailDeliveryMode = "postman";

  if (email === env.RESEND_ALLOWED_EMAIL) {
    await sendVerificationEmail({
      to: email,
      token: verificationToken
    });

    emailDeliveryMode = "email";
  }

  return {
    verificationCode:
      emailDeliveryMode === "postman" ? verificationToken : undefined,
    emailDeliveryMode
  };
}

async function registerUser({ email, username, password, role }) {
  if (role === "ADMIN") {
    throw new AppError("Cannot self-register as admin", 403);
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }]
    }
  });

  if (existing) {
    if (!existing.isEmailVerified && existing.email === email) {
      const verificationToken = crypto.randomInt(100000, 999999).toString();

      const updatedUser = await prisma.user.update({
        where: { id: existing.id },
        data: {
          username,
          passwordHash: await bcrypt.hash(password, 12),
          role: role || existing.role,
          emailVerificationToken: verificationToken,
          emailVerificationExpires: new Date(Date.now() + 30 * 60 * 1000)
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          isEmailVerified: true,
          createdAt: true
        }
      });

      const delivery = await deliverVerificationCode(email, verificationToken);

      return {
        ...updatedUser,
        ...delivery
      };
    }

    throw new AppError("Email or username already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomInt(100000, 999999).toString();

  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      role: role || "USER",
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 30 * 60 * 1000)
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      isEmailVerified: true,
      createdAt: true
    }
  });

  const delivery = await deliverVerificationCode(email, verificationToken);

  return {
    ...user,
    ...delivery
  };
}

async function verifyEmail(token) {
  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: token
    }
  });

  if (!user) {
    throw new AppError("Invalid verification token", 400);
  }

  if (user.emailVerificationExpires < new Date()) {
    throw new AppError("Verification token expired", 400);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      isEmailVerified: true
    }
  });

  return updatedUser;
}

async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.isEmailVerified) {
    throw new AppError("Email is not verified", 403);
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  const decoded = jwt.decode(refreshToken);
  const expiresAt = new Date(decoded.exp * 1000);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt
    }
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    }
  };
}

async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 401);
  }

  let payload;

  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  if (payload.type !== "refresh") {
    throw new AppError("Invalid token type", 401);
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(refreshToken) },
    include: { user: true }
  });

  if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
    throw new AppError("Refresh token revoked or expired", 401);
  }

  if (!storedToken.user.isEmailVerified) {
    throw new AppError("Email is not verified", 403);
  }

  const accessToken = signAccessToken(storedToken.user);

  return { accessToken };
}

async function logoutUser(refreshToken) {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  await prisma.refreshToken.updateMany({
    where: {
      tokenHash: hashToken(refreshToken),
      revoked: false
    },
    data: {
      revoked: true
    }
  });

  return { message: "Logged out successfully" };
}

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  refreshAccessToken,
  logoutUser
};