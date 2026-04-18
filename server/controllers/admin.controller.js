const adminService = require('../services/admin.service');

class AdminController {
async  createAdmin(req, res) {
    try {
        const { name, surname,username, email, password,  } = req.body;

        if (!name || !surname || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Բոլոր դաշտերը պարտադիր են:"
            });
        }

        const admin = await adminService.createAdmin(req.body);

        res.status(201).json({
            success: true,
            message: "Հաստատման կոդը ուղարկվեց էլ․ հասցեին:",
            data: { email: admin.email }
        });

    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
}

    async getAdmins(req, res) {
        try {
            const admins = await adminService.findUsersByRole('admin');
            res.status(200).json({ success: true, count: admins.length, data: admins });
        } catch (error) {
            res.status(500).json({ success: false, message: "Սխալ՝ ցուցակը բեռնելիս:" });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await adminService.findUsersByRole('user');
            res.status(200).json({ success: true, count: users.length, data: users });
        } catch (error) {
            res.status(500).json({ success: false, message: "Սխալ՝ ցուցակը բեռնելիս:" });
        }
    }

    async updateAccount(req, res) {
        try {
            const updatedUser = await adminService.updateAccount(req.params.id, req.body);
            res.status(200).json({ success: true, message: "Տվյալները թարմացվեցին:", data: updatedUser });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async deleteAdmin(req, res) {
        try {
            await adminService.deleteUserByRole(req.params.id, 'admin');
            res.status(200).json({ success: true, message: "Ադմինը հաջողությամբ հեռացվեց:" });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            await adminService.deleteUserByRole(req.params.id, 'user');
            res.status(200).json({ success: true, message: "Օգտատերը հեռացվեց:" });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }
}

module.exports = new AdminController();