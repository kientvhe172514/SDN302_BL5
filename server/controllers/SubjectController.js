const SubjectService = require("../services/SubjectService");

class SubjectController {
    constructor() {
        this.subjectService = new SubjectService();
    }

    // Create new subject
    createSubject = async (req, res, next) => {
        try {
            const subjectData = req.body;
            const subject = await this.subjectService.createSubject(subjectData);

            res.status(201).json({
                status: "success",
                message: "Subject created successfully",
                data: subject
            });
        } catch (error) {
            next(error);
        }
    };

    // Get all subjects with pagination and filtering
    getAllSubjects = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await this.subjectService.getAllSubjects(query);

            res.status(200).json({
                status: "success",
                message: "Subjects retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    // Get subject by ID
    getSubjectById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const subject = await this.subjectService.getSubjectById(id);

            res.status(200).json({
                status: "success",
                message: "Subject retrieved successfully",
                data: subject
            });
        } catch (error) {
            next(error);
        }
    };

    // Get subject by subject code
    getSubjectByCode = async (req, res, next) => {
        try {
            const { subjectCode } = req.params;
            const subject = await this.subjectService.getSubjectByCode(subjectCode);

            res.status(200).json({
                status: "success",
                message: "Subject retrieved successfully",
                data: subject
            });
        } catch (error) {
            next(error);
        }
    };

    // Update subject
    updateSubject = async (req, res, next) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const subject = await this.subjectService.updateSubject(id, updateData);

            res.status(200).json({
                status: "success",
                message: "Subject updated successfully",
                data: subject
            });
        } catch (error) {
            next(error);
        }
    };

    // Delete subject
    deleteSubject = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await this.subjectService.deleteSubject(id);

            res.status(200).json({
                status: "success",
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    };



    // Get subjects by credits range
    getSubjectsByCredits = async (req, res, next) => {
        try {
            const { minCredits, maxCredits } = req.query;
            const subjects = await this.subjectService.getSubjectsByCredits(
                minCredits ? parseInt(minCredits) : undefined,
                maxCredits ? parseInt(maxCredits) : undefined
            );

            res.status(200).json({
                status: "success",
                message: "Subjects retrieved successfully",
                data: subjects
            });
        } catch (error) {
            next(error);
        }
    };

    // Get subjects statistics
    getSubjectsStats = async (req, res, next) => {
        try {
            const Subject = require("../model/Subject");

            const totalSubjects = await Subject.countDocuments();
            const subjectsByCredits = await Subject.aggregate([
                {
                    $group: {
                        _id: "$credits",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            const avgCredits = await Subject.aggregate([
                {
                    $group: {
                        _id: null,
                        averageCredits: { $avg: "$credits" }
                    }
                }
            ]);

            // Tính min và max credits
            const minMaxCredits = await Subject.aggregate([
                {
                    $group: {
                        _id: null,
                        minCredits: { $min: "$credits" },
                        maxCredits: { $max: "$credits" }
                    }
                }
            ]);

            res.status(200).json({
                status: "success",
                message: "Subject statistics retrieved successfully",
                data: {
                    totalSubjects,
                    subjectsByCredits,
                    averageCredits: avgCredits[0]?.averageCredits || 0,
                    minCredits: minMaxCredits[0]?.minCredits || 0,
                    maxCredits: minMaxCredits[0]?.maxCredits || 0
                }
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = SubjectController;
