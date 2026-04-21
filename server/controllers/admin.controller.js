const adminService = require("../services/admin.service");

class AdminController {
  async createAdmin(req, res) {
    try {
      const { name, surname, username, email, password } = req.body;
      if (!name || !surname || !username || !email || !password) {
        return res.status(400).json({ success: false, message: "Բոլոր դաշտերը պարտադիր են:" });
      }
      const admin = await adminService.createAdmin(req.body);
      res.status(201).json({
        success: true,
        message: "Հաստատման կոդը ուղարկվեց էլ․ հասցեին:",
        data: { email: admin.email },
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAdmins(req, res) {
    try {
      const admins = await adminService.findUsersByRole("admin");
      res.status(200).json({ success: true, count: admins.length, data: admins });
    } catch {
      res.status(500).json({ success: false, message: "Սխալ՝ ցուցակը բեռնելիս:" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await adminService.findUsersByRole("user");
      res.status(200).json({ success: true, count: users.length, data: users });
    } catch {
      res.status(500).json({ success: false, message: "Սխալ՝ ցուցակը բեռնելիս:" });
    }
  }

  /**
   * PUT /super/admin/:id  or  PUT /super/user/:id
   *
   * Body fields (all optional):
   *   name, surname, username, newPassword, newEmail
   *
   * Response:
   *   200  { success, message, data: updatedUser }          — normal update
   *   202  { success, message, requiresEmailVerification: true, pendingEmail }
   *                                                          — OTP sent to newEmail
   */
  async updateAccount(req, res) {
    try {
      const result = await adminService.updateAccount(req.params.id, req.body);

      if (result.requiresEmailVerification) {
        return res.status(202).json({
          success: true,
          requiresEmailVerification: true,
          pendingEmail: result.pendingEmail,
          message: "Հաստատման կոդը ուղարկվեց նոր էլ. հասցեին:",
        });
      }

      res.status(200).json({
        success: true,
        message: "Տվյալները թարմացվեցին:",
        data: result.user,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * POST /super/admin/:id/confirm-email  or  /super/user/:id/confirm-email
   * Body: { code: "123456" }
   */
  async confirmEmailChange(req, res) {
    try {
      const user = await adminService.confirmEmailChange(req.params.id, req.body.code);
      res.status(200).json({
        success: true,
        message: "Էլ. հասցեն հաջողությամբ թարմացվեց:",
        data: user,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteAdmin(req, res) {
    try {
      await adminService.deleteUserByRole(req.params.id, "admin");
      res.status(200).json({ success: true, message: "Ադմինը հաջողությամբ հեռացվեց:" });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await adminService.deleteUserByRole(req.params.id, "user");
      res.status(200).json({ success: true, message: "Օգտատերը հեռացվեց:" });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AdminController();