// const User = require("../models/User");
// const Answer = require("../models/Answer");
// const LaboratorAnswer = require("../models/LaboratorAnswer");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { generateAccessToken, generateRefreshToken } = require("./tokenService");

// class AuthService {
//     // 1. Register
//     async registerUser(userData) {
//         const { name, surname, email, password, faculty, course } = userData;
//         const existingUser = await User.findOne({ email });
//         if (existingUser) throw new Error("Email already in use");

//         const hashedPassword = await bcrypt.hash(password, 10);
//         return await User.create({
//             name, surname, email,
//             password: hashedPassword,
//             faculty, course
//         });
//     }

//     // 2. Login
//     async loginUser(email, password) {
//         const user = await User.findOne({ email });
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             throw new Error("Invalid credentials");
//         }
//         const accessToken = generateAccessToken(user);
//         const refreshToken = generateRefreshToken(user);
        
//         user.refreshToken = refreshToken;
//         await user.save();
        
//         return { user, accessToken, refreshToken };
//     }

//     // 3. Refresh Token
//     async refreshAccessToken(refreshToken) {
//         const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//         const user = await User.findById(decoded.id);

//         if (!user || user.refreshToken !== refreshToken) {
//             throw new Error("Invalid or expired refresh token");
//         }

//         return jwt.sign(
//             { id: user._id, role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: '15m' }
//         );
//     }

//     // 4. Logout (Clear DB token)
//     async clearRefreshToken(refreshToken) {
//         if (!refreshToken) return;
//         const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//         await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
//     }

//     // 5. Get All Users
//     async getAllUsers() {
//         return await User.find().select("-password -refreshToken");
//     }

//     // 6. Get Single User
//     async getUserById(id) {
//         const user = await User.findById(id).select("-password -refreshToken");
//         if (!user) throw new Error("User not found");
//         return user;
//     }

//     // 7. Get My Results (Complex Populate)
//     async getFullUserResults(userId) {
//         const data = await User.findById(userId)
//             .select('-password -refreshToken')
//             .populate({ path: 'questionAnswers.questionId', model: 'Question' })
//             .populate({ path: 'questionAnswers.answerId', model: 'Answer' })
//             .populate({ path: 'quizSubmissions.quizId', model: 'Quiz' })
//             .populate({ path: 'labSubmissions.labId', model: 'Laborator' })
//             .populate({ path: 'labSubmissions.submissionId', model: 'LaboratorAnswer' });
        
//         if (!data) throw new Error("User not found");
//         return data;
//     }

//     // 8. Grade Logic (Shared for Answer and Lab)
//     async updateGrade(modelType, answerId, grade) {
//         const Model = modelType === 'lab' ? LaboratorAnswer : Answer;
//         const updated = await Model.findByIdAndUpdate(answerId, { grade }, { new: true });
//         if (!updated) throw new Error("Record not found");
//         return updated;
//     }
// }

// module.exports = new AuthService();