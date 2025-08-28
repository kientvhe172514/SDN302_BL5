const express = require("express");
const router = express.Router();
const DocumentController = require("../controllers/documentController");
const { uploadDocuments, handleUploadError } = require("../middleware/uploadMiddleware");

const documentController = new DocumentController();

// Upload multiple documents for a subject
router.post(
    "/subjects/:subjectId/documents",
    uploadDocuments,
    handleUploadError,
    documentController.uploadDocuments
);

// Get all documents for a subject
router.get(
    "/subjects/:subjectId/documents",
    documentController.getSubjectDocuments
);

// Delete a specific document
router.delete(
    "/subjects/:subjectId/documents/:documentId",
    documentController.deleteDocument
);

// Download all documents as ZIP
router.get(
    "/subjects/:subjectId/documents/download/zip",
    documentController.downloadAllDocumentsAsZip
);

// Download a single document (returns file info)
router.get(
    "/subjects/:subjectId/documents/:documentId/download",
    documentController.downloadDocument
);

// Clean up temporary files (admin endpoint)
router.delete(
    "/documents/cleanup",
    documentController.cleanupTempFiles
);

module.exports = router;
