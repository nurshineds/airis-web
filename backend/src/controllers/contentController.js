// moga bener aamiin
const prisma = require("../lib/prisma");

exports.getContentbyID = async (req, res) => {
    try {
        const { idContent } = req.params;
 
        const content = await prisma.webContent.findUnique({
            where: { idContent },
            select: {
                idContent: true,
                type: true,
                title: true,
                content: true
            }
        });
 
        if (!content) {
            console.log(`Get contact failed: content with Content ${idContent} not found.`);
            return res.status(404).json({
                success: false,
                message: "Content not found."
            });
        }
 
        console.log("Content successfully retrieved:", content);
 
        res.json({
            success: true,
            message: "Successfully retrieved content data.",
            data: content
        });
    } catch (error) {
        console.error("Get content by id error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred."
        });
    }
};

exports.createContent = async (req, res) => {
    try {
        const { type, title, content } = req.body;

        if (!type || !title || !content) {
            console.log("Failed to create content: type, title, and content are required.");
            return res.status(400).json({
                success: false,
                message: "Type, title, and content must be filled in!"
            });
        }

        const newContent = await prisma.webContent.create({
            data: { type, title, content }
        });

        console.log("Content has been created successfully:", newContent);

        res.json({
            success: true,
            message: "Content added successfully.",
            data: newContent
        });
    } catch (error) {
        console.error("Create content error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add content."
        });
    }
};

exports.updateContent = async (req, res) => {
    try {
        const { idContent, type, title, content } = req.body;

        if (!idContent) {
            console.log("Failed to update content: idContent is missing.");
            return res.status(400).json({
                success: false,
                message: "Content ID must be filled in!"
            });
        }

        if (!type && !title && !content) {
            console.log("Failed to update content: no changes detected.");
            return res.status(400).json({
                success: false,
                message: "Validation failed: At least one of type, title, or content is required."
            });
        }

        const contentExist = await prisma.webContent.findUnique({
            where: { idContent: Number(idContent) }
        });

        if (!contentExist) {
            console.log(`Failed to update content: content with ID ${idContent} not found.`);
            return res.status(404).json({
                success: false,
                message: "The requested content could not be found."
            });
        }

        const dataToUpdate = {};
        if (type) dataToUpdate.type = type;
        if (title) dataToUpdate.title = title;
        if (content) dataToUpdate.content = content;

        const updatedContent = await prisma.webContent.update({
            where: { idContent: Number(idContent) },
            data: dataToUpdate
        });

        console.log("Content updated successfully:", updatedContent);

        res.json({
            success: true,
            message: "Content updated successfully.",
            data: updatedContent
        });
    } catch (error) {
        console.error("Update content error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update content."
        });
    }
};

exports.deleteContent = async (req, res) => {
    try {
        const { idContent } = req.body;

        if (!idContent) {
            console.log("Failed to delete content: idContent is missing.");
            return res.status(400).json({
                success: false,
                message: "Content ID must be filled in!"
            });
        }

        const contentExist = await prisma.webContent.findUnique({
            where: { idContent: Number(idContent) }
        });

        if (!contentExist) {
            console.log(`Failed to delete content: content with ID ${idContent} not found.`);
            return res.status(404).json({
                success: false,
                message: "The requested content could not be found."
            });
        }

        await prisma.webContent.delete({
            where: { idContent: Number(idContent) }
        });

        console.log(`Content with ID ${idContent} has been successfully deleted.`);

        res.json({
            success: true,
            message: "Content deleted successfully."
        });
    } catch (error) {
        console.error("Delete content error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete content."
        });
    }
};

//Maqoli inna rahmatan ya Code, maqoli inna rahmatan fima Allah.
//Syududu