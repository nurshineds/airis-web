const fs = require("fs");
const path = require("path");

/**
 * @param {string} fileName 
 * @param {object} variables
 */

function loadPrompt(fileName, variables = {}){
    const filePath = path.join(__dirname, "..", "prompts", fileName);

    if(!fs.existsSync(filePath)){
        throw new Error(`File prompt tidak ditemukan: ${fileName}`);
    }

    let template = fs.readFileSync(filePath, "utf8");

    for(const [key, value] of Object.entries(variables)){
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
        template = template.replace(regex, value ?? "-");
    }

    return template.trim();
}

module.exports = { loadPrompt };