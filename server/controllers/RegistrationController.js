const RegistrationService = require('../services/RegistrationService');

class RegistrationController {
    // Xóa từ khóa "static" ở dòng dưới
    async handleCreateRegistrations(req, res, next) {
        try {
            const { studentIds, subjectIds, semester } = req.body;
            if (!studentIds || !subjectIds || !semester || studentIds.length === 0 || subjectIds.length === 0) {
                return res.status(400).json({ message: "studentIds, subjectIds, and semester are required." });
            }
            const result = await RegistrationService.createRegistrations({ studentIds, subjectIds, semester });
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RegistrationController();