const DocumentService = require("../services/DocumentService");
const ApiError = require("../errors/api-error");
const fs = require("fs");

class DocumentController {
    constructor() {
        this.documentService = new DocumentService();
    }

    // Upload multiple documents for a subject
    uploadDocuments = async (req, res, next) => {
        try {
            const { subjectId } = req.params;
            const files = req.files;

            if (!files || files.length === 0) {
                throw new ApiError(400, "No files uploaded");
            }

            const result = await this.documentService.uploadDocuments(subjectId, files);

            res.status(200).json({
                success: true,
                message: result.message,
                data: result.documents
            });
        } catch (error) {
            next(error);
        }
    };

    // Get all documents for a subject
    getSubjectDocuments = async (req, res, next) => {
        try {
            const { subjectId } = req.params;
            const documents = await this.documentService.getSubjectDocuments(subjectId);

            res.status(200).json({
                success: true,
                data: documents
            });
        } catch (error) {
            next(error);
        }
    };

    // Delete a specific document
    deleteDocument = async (req, res, next) => {
        try {
            const { subjectId, documentId } = req.params;
            const result = await this.documentService.deleteDocument(subjectId, documentId);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    };

    // Download all documents as ZIP
    downloadAllDocumentsAsZip = async (req, res, next) => {
        try {
            const { subjectId } = req.params;
            const zipInfo = await this.documentService.downloadAllDocumentsAsZip(subjectId);

            res.download(zipInfo.filePath, zipInfo.fileName, (err) => {
                if (err) {
                    console.error("Error sending file:", err);
                }
                // Clean up the temporary file after download
                setTimeout(() => {
                    if (fs.existsSync(zipInfo.filePath)) {
                        fs.unlinkSync(zipInfo.filePath);
                    }
                }, 5000);
            });
        } catch (error) {
            next(error);
        }
    };

    // Download a single document
    downloadDocument = async (req, res, next) => {
        try {
            const { subjectId, documentId } = req.params;
            const document = await this.documentService.downloadDocument(subjectId, documentId);

            res.status(200).json({
                success: true,
                data: document
            });
        } catch (error) {
            next(error);
        }
    };

    // Clean up temporary files (admin endpoint)
    cleanupTempFiles = async (req, res, next) => {
        try {
            await this.documentService.cleanupTempFiles();

            res.status(200).json({
                success: true,
                message: "Temporary files cleaned up successfully"
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = DocumentController;
