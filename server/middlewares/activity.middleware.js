// const ActivityLog = require("../models/ActivityLog");

// exports.logActivity = async (actorId, action, targetUserId) => {
//   try {
//     await ActivityLog.create({
//       actor: actorId,
//       action,
//       targetUser: targetUserId
//     });
//   } catch (error) {
//     console.error("Activity log failed:", error.message);
//   }
// };