const Subject = require("../model/Subject");
const ApiError = require("../errors/api-error");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const axios = require("axios");

class DocumentService {
    // Upload multiple documents for a subject
    async uploadDocuments(subjectId, files) {
        try {
            const subject = await Subject.findById(subjectId);
            if (!subject) {
                throw new ApiError(404, "Subject not found");
            }

            const uploadedDocuments = [];

            for (const file of files) {
                try {
                    // Upload to Cloudinary
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: `subjects/${subjectId}/documents`,
                        resource_type: "auto",
                        public_id: `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`
                    });

                    // Create document object
                    const document = {
                        originalName: file.originalname,
                        fileName: result.public_id,
                        fileUrl: result.secure_url,
                        fileSize: file.size,
                        mimeType: file.mimetype,
                        uploadedAt: new Date()
                    };

                    uploadedDocuments.push(document);

                    // Clean up temporary file
                    fs.unlinkSync(file.path);
                } catch (uploadError) {
                    // Clean up temporary file if upload fails
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                    throw new ApiError(500, `Error uploading ${file.originalname}: ${uploadError.message}`);
                }
            }

            // Add documents to subject
            subject.documents.push(...uploadedDocuments);
            await subject.save();

            return {
                message: `${uploadedDocuments.length} documents uploaded successfully`,
                documents: uploadedDocuments
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Error uploading documents");
        }
    }

    // Get all documents for a subject
    async getSubjectDocuments(subjectId) {
        try {
            const subject = await Subject.findById(subjectId);
            if (!subject) {
                throw new ApiError(404, "Subject not found");
            }

            return subject.documents;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Error fetching documents");
        }
    }

    // Delete a specific document
    async deleteDocument(subjectId, documentId) {
        try {
            const subject = await Subject.findById(subjectId);
            if (!subject) {
                throw new ApiError(404, "Subject not found");
            }

            const document = subject.documents.id(documentId);
            if (!document) {
                throw new ApiError(404, "Document not found");
            }

            // Delete from Cloudinary
            try {
                await cloudinary.uploader.destroy(document.fileName);
            } catch (cloudinaryError) {
                console.error("Error deleting from Cloudinary:", cloudinaryError);
            }

            // Remove from subject documents
            subject.documents.pull(documentId);
            await subject.save();

            return { message: "Document deleted successfully" };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Error deleting document");
        }
    }

    // Download all documents as ZIP
    async downloadAllDocumentsAsZip(subjectId) {
        try {
            const subject = await Subject.findById(subjectId);
            if (!subject) {
                throw new ApiError(404, "Subject not found");
            }

            if (subject.documents.length === 0) {
                throw new ApiError(404, "No documents found for this subject");
            }

            // Create a temporary directory for downloads
            const tempDir = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            const zipFileName = `${subject.subjectCode}_documents_${Date.now()}.zip`;
            const zipFilePath = path.join(tempDir, zipFileName);
            const output = fs.createWriteStream(zipFilePath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            return new Promise((resolve, reject) => {
                output.on('close', () => {
                    resolve({
                        filePath: zipFilePath,
                        fileName: zipFileName,
                        size: archive.pointer()
                    });
                });

                archive.on('error', (err) => {
                    reject(new ApiError(500, "Error creating ZIP file"));
                });

                archive.pipe(output);

                // Download and add each document to the ZIP
                subject.documents.forEach((doc, index) => {
                    const fileName = `${index + 1}_${doc.originalName}`;
                    const fileStream = axios.get(doc.fileUrl, { responseType: 'stream' });
                    
                    fileStream.then(response => {
                        archive.append(response.data, { name: fileName });
                    }).catch(error => {
                        console.error(`Error downloading ${doc.originalName}:`, error);
                        archive.append('', { name: fileName });
                    });
                });

                archive.finalize();
            });
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Error creating ZIP file");
        }
    }

    // Download a single document
    async downloadDocument(subjectId, documentId) {
        try {
            const subject = await Subject.findById(subjectId);
            if (!subject) {
                throw new ApiError(404, "Subject not found");
            }

            const document = subject.documents.id(documentId);
            if (!document) {
                throw new ApiError(404, "Document not found");
            }

            return {
                fileUrl: document.fileUrl,
                fileName: document.originalName,
                mimeType: document.mimeType
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Error downloading document");
        }
    }

    // Clean up temporary files
    async cleanupTempFiles() {
        try {
            const tempDir = path.join(__dirname, '../temp');
            if (fs.existsSync(tempDir)) {
                const files = fs.readdirSync(tempDir);
                for (const file of files) {
                    const filePath = path.join(tempDir, file);
                    const stats = fs.statSync(filePath);
                    // Delete files older than 1 hour
                    if (Date.now() - stats.mtime.getTime() > 3600000) {
                        fs.unlinkSync(filePath);
                    }
                }
            }
        } catch (error) {
            console.error("Error cleaning up temp files:", error);
        }
    }
}

module.exports = DocumentService;
