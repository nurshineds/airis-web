const prisma = require("../lib/prisma");

exports.getHomeContent = async(req, res) => {
    try{
        const contents = await prisma.webContent.findMany({
            where: {
                type: {
                    in: ["about", "indicator", "guide"]
                }
            },
            orderBy: {
                order: "asc"
            }
        });

        const about = contents.find((item) => item.type === "about") || null;
        const indicators = contents.filter((item) => item.type === "indicator");
        const guides = contents.filter((item) => item.type === "guide");

        return res.status(200).json({
            success: true,
            message: "Successfully retrieved homepage's contents.",
            data: {
                about,
                indicators,
                guides
            }
        });
    } catch(error){
        console.error("Kesalahan mengambil konten homepage: ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve homepage contents.",
            error: error.message
        });
    }
}

exports.getContentbyID = async (req, res) => {
    try {
        const { idContent } = req.body;
 
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
 
        return res.status(200).json({
            success: true,
            message: "Successfully retrieved content data.",
            data: content
        });
    } catch (error) {
        console.error("Get content by id error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred.",
            error: error.message
        });
    }
};

exports.createContent = async (req, res) => {
    try {
        const { idContent, type, title, content, symbol, icon, order } = req.body;

        if (!idContent || !type || !title || !content) {
            console.log("Failed to create content: type, title, and content are required.");
            return res.status(400).json({
                success: false,
                message: "Content ID, type, title, and content must be filled in!"
            });
        }

        const newContent = await prisma.webContent.create({
            data: { idContent, type, title, content, symbol, icon, order }
        });

        console.log("Content has been created successfully:", newContent);

        return res.status(200).json({
            success: true,
            message: "Content added successfully.",
            data: newContent
        });
    } catch (error) {
        console.error("Create content error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add content.",
            error: error.message
        });
    }
};

exports.updateContent = async (req, res) => {
    try {
        const { idContent, type, title, content, symbol, icon, order } = req.body;

        if (!idContent) {
            console.log("Failed to update content: idContent is missing.");
            return res.status(400).json({
                success: false,
                message: "Content ID must be filled in!"
            });
        }

        if (!type && !title && !content && !symbol && !icon && !order) {
            console.log("Failed to update content: no changes detected.");
            return res.status(400).json({
                success: false,
                message: "Validation failed: At least one of type, title, content, symbol, icon, or order is required."
            });
        }

        const contentExist = await prisma.webContent.findUnique({
            where: { idContent }
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
        if (symbol) dataToUpdate.symbol = symbol;
        if (icon) dataToUpdate.icon = icon;
        if (order) dataToUpdate.order = order;

        const updatedContent = await prisma.webContent.update({
            where: { idContent },
            data: dataToUpdate
        });

        console.log("Content updated successfully:", updatedContent);

        return res.status(200).json({
            success: true,
            message: "Content updated successfully.",
            data: updatedContent
        });
    } catch (error) {
        console.error("Update content error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update content.",
            error: error.message
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
            where: { idContent }
        });

        if (!contentExist) {
            console.log(`Failed to delete content: content with ID ${idContent} not found.`);
            return res.status(404).json({
                success: false,
                message: "The requested content could not be found."
            });
        }

        await prisma.webContent.delete({
            where: { idContent }
        });

        console.log(`Content with ID ${idContent} has been successfully deleted.`);

        return res.status(200).json({
            success: true,
            message: "Content deleted successfully."
        });
    } catch (error) {
        console.error("Delete content error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete content.",
            error: error.message
        });
    }
};

//Maqoli inna rahmatan ya Code, maqoli inna rahmatan fima Allah.
//Syududu