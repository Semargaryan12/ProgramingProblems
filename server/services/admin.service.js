const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class AdminService {
  /* ── Create Admin ────────────────────────────────── */
  async createAdmin(userData) {
    const { name, surname, username, email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Այս էլ. հասցեով օգտատեր արդեն գոյություն ունի:");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newAdmin = new User({
      name,
      surname,
      username,
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: false,
      verificationCode: otp,
      verificationExpires: Date.now() + 3600000,
    });

    await newAdmin.save();

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Հաստատեք ադմինի էլ․ հասցեն",
        html: `
          <h3>Բարև ${name},</h3>
          <p>Ձեր ադմին հաշվի հաստատման կոդն է՝</p>
          <h2 style="letter-spacing:4px">${otp}</h2>
          <p>Կոդը վավեր է 1 ժամ:</p>
        `,
      });
    } catch (err) {
      console.error("EMAIL ERROR:", err);
      throw new Error("Չհաջողվեց ուղարկել հաստատման նամակը");
    }

    return newAdmin;
  }

  /* ── Find users by role ──────────────────────────── */
  async findUsersByRole(role) {
    return await User.find({ role }).select("-password").sort({ createdAt: -1 });
  }

  /**
   * Update account fields.
   *
   * Supported fields: name, surname, username, password, email.
   *
   * Email change flow:
   *   - If newEmail is provided and differs from current email:
   *     1. Check newEmail is not taken.
   *     2. Generate OTP, store in pendingEmail + verificationCode + verificationExpires.
   *     3. Send OTP to newEmail.
   *     4. Return { requiresEmailVerification: true, pendingEmail: newEmail }
   *        — the controller responds with 202 so the frontend knows to show the OTP step.
   *   - The actual email swap happens in confirmEmailChange().
   *
   * Password change:
   *   - If newPassword is provided it is hashed before saving.
   */
  async updateAccount(id, updateData) {
    const { name, surname, username, newPassword, newEmail } = updateData;

    const user = await User.findById(id);
    if (!user) throw new Error("Հաշիվը չի գտնվել:");

    // ── Name / surname / username ─────────────────
    if (name)     user.name     = name;
    if (surname)  user.surname  = surname;
    if (username) user.username = username;

    // ── Password change ───────────────────────────
    if (newPassword && newPassword.trim().length >= 6) {
      user.password = await bcrypt.hash(newPassword, 12);
    }

    // ── Email change — start OTP flow ────────────
    if (newEmail && newEmail !== user.email) {
      const taken = await User.findOne({ email: newEmail, _id: { $ne: id } });
      if (taken) throw new Error("Այս էլ. հասցեն արդեն օգտագործվում է:");

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.pendingEmail        = newEmail;
      user.verificationCode    = otp;
      user.verificationExpires = Date.now() + 3600000;

      await user.save();

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: newEmail,
          subject: "Հաստատեք նոր էլ. հասցեն",
          html: `
            <h3>Բարև ${user.name},</h3>
            <p>Ձեր նոր էլ. հասցեի հաստատման կոդն է՝</p>
            <h2 style="letter-spacing:4px">${otp}</h2>
            <p>Կոդը վավեր է 1 ժամ:</p>
          `,
        });
      } catch (err) {
        console.error("EMAIL ERROR:", err);
        throw new Error("Չհաջողվեց ուղարկել հաստատման նամակը");
      }

      return { requiresEmailVerification: true, pendingEmail: newEmail };
    }

    const saved = await user.save();
    const result = saved.toObject();
    delete result.password;
    return { requiresEmailVerification: false, user: result };
  }

  /**
   * Confirm email change by verifying the OTP sent to pendingEmail.
   * Swaps email ← pendingEmail and clears the OTP fields.
   */
  async confirmEmailChange(id, code) {
    const user = await User.findById(id);
    if (!user) throw new Error("Հաշիվը չի գտնվել:");

    if (!user.pendingEmail) throw new Error("Նոր էլ. հասցե չի սպասվում:");

    if (
      user.verificationCode !== code ||
      !user.verificationExpires ||
      Date.now() > user.verificationExpires
    ) {
      throw new Error("Կոդը սխալ է կամ ժամկետն անցել է:");
    }

    user.email               = user.pendingEmail;
    user.pendingEmail        = undefined;
    user.verificationCode    = undefined;
    user.verificationExpires = undefined;

    const saved = await user.save();
    const result = saved.toObject();
    delete result.password;
    return result;
  }

  /* ── Delete ──────────────────────────────────────── */
  async deleteUserByRole(id, role) {
    const user = await User.findOne({ _id: id, role });
    if (!user) throw new Error(`${role === "admin" ? "Ադմինը" : "Օգտատերը"} չի գտնվել:`);
    return await User.findByIdAndDelete(id);
  }
}

module.exports = new AdminService();