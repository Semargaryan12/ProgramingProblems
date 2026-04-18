const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { 
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});
class AdminService {


async  createAdmin(userData) {
    const { name, surname,username, email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Այս էլ. հասցեով օգտատեր արդեն գոյություն ունի:");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // 🔹 Generate OTP
     const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newAdmin = new User({
        name,
        surname,
        username,
        email,
        password: hashedPassword,
        role: 'admin',

        // ✅ IMPORTANT
        isVerified: false,
        verificationCode: otp.toString(),
        verificationExpires: Date.now() + 3600000 // 1 hour
    });

    await newAdmin.save();

    // 🔹 Send email
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Հաստատեք ադմինի էլ․ հասցեն',
            html: `
                <h3>Բարև ${name},</h3>
                <p>Ձեր ադմին հաշվի հաստատման կոդն է՝</p>
                <h2>${otp}</h2>
            `
        });
    } catch (err) {
        console.log("EMAIL ERROR:", err);
        throw new Error("Չհաջողվեց ուղարկել հաստատման նամակը");
    }

    return newAdmin;

}


    async findUsersByRole(role) {
        return await User.find({ role })
            .select('-password')
            .sort({ createdAt: -1 });
    }

    async updateAccount(id, updateData) {
        const { email } = updateData;

        // Check if email is taken by another user
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                throw new Error("Այս էլ. հասցեն արդեն օգտագործվում է այլ հաշվի կողմից:");
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) throw new Error("Հաշիվը չի գտնվել:");
        return updatedUser;
    }

    async deleteUserByRole(id, role) {
        const user = await User.findOne({ _id: id, role });
        if (!user) throw new Error(`${role === 'admin' ? 'Ադմինը' : 'Օգտատերը'} չի գտնվել:`);
        
        return await User.findByIdAndDelete(id);
    }
}

module.exports = new AdminService();