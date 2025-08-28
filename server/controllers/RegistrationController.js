const RegistrationService = require('../services/RegistrationService');

class RegistrationController {
    // XÓA TỪ KHÓA 'static' Ở ĐÂY
    async handleCreateRegistrations(req, res, next) {
        try {
            const { studentIds, subjectIds, semester } = req.body;
            if (!studentIds || !subjectIds || !semester || studentIds.length === 0 || subjectIds.length === 0) {
                return res.status(400).json({ message: "studentIds, subjectIds, and semester are required." });
            }

            // Gọi hàm mới: createRegistrationsAndAssignClasses
            const result = await RegistrationService.createRegistrationsAndAssignClasses({ studentIds, subjectIds, semester });
            
            res.status(201).json({
                success: true,
                message: "Registration and class assignment process completed.",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RegistrationController();
