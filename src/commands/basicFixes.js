const vscode = require('vscode');

/**
 * Basic code fixes for when AI services are unavailable
 */
class BasicFixes {
    constructor(config) {
        this.config = config;
    }

    /**
     * Apply basic fixes to the current editor
     * @param {vscode.TextEditor} editor 
     * @returns {boolean} Whether any fixes were applied
     */
    async applyBasicFixes(editor) {
        if (!editor) {
            return false;
        }

        const document = editor.document;
        const language = document.languageId;
        let fixesApplied = false;

        try {
            // Format document first
            await vscode.commands.executeCommand('editor.action.formatDocument');
            fixesApplied = true;

            // Apply language-specific fixes
            const originalText = document.getText();
            let fixedText = originalText;

            switch (language) {
                case 'javascript':
                case 'typescript':
                    fixedText = this.fixJavaScript(originalText);
                    break;
                case 'python':
                    fixedText = this.fixPython(originalText);
                    break;
                case 'java':
                case 'csharp':
                case 'cpp':
                case 'c':
                    fixedText = this.fixCStyleLanguage(originalText);
                    break;
                case 'html':
                    fixedText = this.fixHTML(originalText);
                    break;
                case 'css':
                    fixedText = this.fixCSS(originalText);
                    break;
                case 'json':
                    fixedText = this.fixJSON(originalText);
                    break;
                case 'xml':
                    fixedText = this.fixXML(originalText);
                    break;
                default:
                    fixedText = this.fixGeneric(originalText);
                    break;
            }

            // Apply fixes if text changed
            if (fixedText !== originalText) {
                await editor.edit(editBuilder => {
                    const fullRange = new vscode.Range(
                        document.positionAt(0),
                        document.positionAt(originalText.length)
                    );
                    editBuilder.replace(fullRange, fixedText);
                });
                fixesApplied = true;
            }

            // Try to fix syntax errors
            await this.fixSyntaxErrors(editor);

            return fixesApplied;

        } catch (error) {
            console.error('Basic fixes error:', error);
            return false;
        }
    }

    /**
     * Fix JavaScript/TypeScript specific issues
     * @param {string} code 
     * @returns {string}
     */
    fixJavaScript(code) {
        let fixed = code;

        // Add missing semicolons (but be smart about it)
        fixed = fixed.replace(/([^;\s}{\n])\s*\n/g, (match, p1) => {
            // Don't add semicolon after certain keywords
            if (/^(if|else|for|while|function|class|try|catch|finally)/.test(p1.trim())) {
                return match;
            }
            return p1 + ';\n';
        });

        // Fix equality operators
        fixed = fixed.replace(/([^=!])={2}([^=])/g, '$1===$2');
        fixed = fixed.replace(/([^=!])!{1}=([^=])/g, '$1!==$2');

        // Fix var to let/const
        fixed = fixed.replace(/\bvar\b/g, 'let');

        // Add missing commas in object literals
        fixed = fixed.replace(/([^,\s}])\s*\n\s*([a-zA-Z_$][a-zA-Z0-9_$]*\s*:)/g, '$1,\n  $2');

        // Fix missing quotes in object keys
        fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');

        return fixed;
    }

    /**
     * Fix Python specific issues
     * @param {string} code 
     * @returns {string}
     */
    fixPython(code) {
        let fixed = code;
        const lines = fixed.split('\n');
        const fixedLines = [];
        let indentLevel = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            if (!trimmed || trimmed.startsWith('#')) {
                fixedLines.push(line);
                continue;
            }

            // Adjust indent level
            if (trimmed.endsWith(':')) {
                fixedLines.push('    '.repeat(indentLevel) + trimmed);
                indentLevel++;
            } else if (trimmed.startsWith('except') || trimmed.startsWith('elif') || trimmed.startsWith('else')) {
                indentLevel = Math.max(0, indentLevel - 1);
                fixedLines.push('    '.repeat(indentLevel) + trimmed);
                if (trimmed.endsWith(':')) {
                    indentLevel++;
                }
            } else if (trimmed === 'pass' || trimmed.startsWith('return') || trimmed.startsWith('break') || trimmed.startsWith('continue')) {
                fixedLines.push('    '.repeat(indentLevel) + trimmed);
            } else {
                fixedLines.push('    '.repeat(indentLevel) + trimmed);
            }

            // Decrease indent after certain statements
            if (i < lines.length - 1) {
                const nextLine = lines[i + 1].trim();
                if (nextLine && !nextLine.startsWith('#') && 
                    (nextLine.startsWith('def ') || nextLine.startsWith('class ') || 
                     nextLine.startsWith('if ') || nextLine.startsWith('for ') || 
                     nextLine.startsWith('while ') || nextLine.startsWith('try:'))) {
                    indentLevel = 0;
                }
            }
        }

        return fixedLines.join('\n');
    }

    /**
     * Fix C-style languages (Java, C#, C++, C)
     * @param {string} code 
     * @returns {string}
     */
    fixCStyleLanguage(code) {
        let fixed = code;

        // Add missing semicolons
        fixed = fixed.replace(/([^;\s}{\n])\s*\n/g, (match, p1) => {
            if (/^(if|else|for|while|class|struct|enum|namespace)/.test(p1.trim())) {
                return match;
            }
            return p1 + ';\n';
        });

        // Fix missing braces
        fixed = fixed.replace(/(if|else|for|while|do)\s*\([^)]*\)\s*([^{])/g, '$1($2) {\n    $3\n}');

        return fixed;
    }

    /**
     * Fix HTML specific issues
     * @param {string} code 
     * @returns {string}
     */
    fixHTML(code) {
        let fixed = code;

        // Close unclosed tags (basic)
        const openTags = [];
        const tagRegex = /<(\/?)([\w-]+)[^>]*>/g;
        let match;

        while ((match = tagRegex.exec(code)) !== null) {
            const isClosing = match[1] === '/';
            const tagName = match[2].toLowerCase();

            if (!isClosing && !['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tagName)) {
                openTags.push(tagName);
            } else if (isClosing) {
                const lastOpen = openTags.pop();
                if (lastOpen !== tagName) {
                    // Mismatched tags - add the missing closing tag
                    fixed += `</${lastOpen}>`;
                }
            }
        }

        // Close remaining open tags
        while (openTags.length > 0) {
            fixed += `</${openTags.pop()}>`;
        }

        return fixed;
    }

    /**
     * Fix CSS specific issues
     * @param {string} code 
     * @returns {string}
     */
    fixCSS(code) {
        let fixed = code;

        // Add missing semicolons
        fixed = fixed.replace(/([^;\s}])\s*\n/g, '$1;\n');

        // Fix missing closing braces
        const openBraces = (fixed.match(/{/g) || []).length;
        const closeBraces = (fixed.match(/}/g) || []).length;
        
        if (openBraces > closeBraces) {
            fixed += '\n' + '}'.repeat(openBraces - closeBraces);
        }

        return fixed;
    }

    /**
     * Fix JSON specific issues
     * @param {string} code 
     * @returns {string}
     */
    fixJSON(code) {
        try {
            // Try to parse and reformat
            const parsed = JSON.parse(code);
            return JSON.stringify(parsed, null, 2);
        } catch (error) {
            // Basic fixes for common JSON issues
            let fixed = code;

            // Add missing quotes to keys
            fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');

            // Fix trailing commas
            fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

            // Add missing commas
            fixed = fixed.replace(/([^,\s}])\s*\n\s*"/g, '$1,\n  "');

            return fixed;
        }
    }

    /**
     * Fix XML specific issues
     * @param {string} code 
     * @returns {string}
     */
    fixXML(code) {
        let fixed = code;

        // Close unclosed tags (similar to HTML but stricter)
        const openTags = [];
        const tagRegex = /<(\/?)([\w:-]+)[^>]*>/g;
        let match;

        while ((match = tagRegex.exec(code)) !== null) {
            const isClosing = match[1] === '/';
            const tagName = match[2];

            if (!isClosing && !match[0].endsWith('/>')) {
                openTags.push(tagName);
            } else if (isClosing) {
                openTags.pop();
            }
        }

        // Close remaining open tags
        while (openTags.length > 0) {
            fixed += `</${openTags.pop()}>`;
        }

        return fixed;
    }

    /**
     * Generic fixes for any language
     * @param {string} code 
     * @returns {string}
     */
    fixGeneric(code) {
        let fixed = code;

        // Remove trailing whitespace
        fixed = fixed.replace(/[ \t]+$/gm, '');

        // Fix multiple empty lines
        fixed = fixed.replace(/\n{3,}/g, '\n\n');

        // Ensure file ends with newline
        if (fixed && !fixed.endsWith('\n')) {
            fixed += '\n';
        }

        // Fix mixed line endings
        fixed = fixed.replace(/\r\n/g, '\n');

        return fixed;
    }

    /**
     * Try to fix syntax errors using VS Code's built-in diagnostics
     * @param {vscode.TextEditor} editor 
     */
    async fixSyntaxErrors(editor) {
        try {
            // Get diagnostics for the current document
            const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
            
            if (diagnostics.length === 0) {
                return;
            }

            // Try to apply quick fixes
            for (const diagnostic of diagnostics) {
                if (diagnostic.severity === vscode.DiagnosticSeverity.Error) {
                    try {
                        // Try to get code actions for this diagnostic
                        const codeActions = await vscode.commands.executeCommand(
                            'vscode.executeCodeActionProvider',
                            editor.document.uri,
                            diagnostic.range
                        );

                        if (codeActions && codeActions.length > 0) {
                            // Apply the first available fix
                            const firstFix = codeActions[0];
                            if (firstFix.edit) {
                                await vscode.workspace.applyEdit(firstFix.edit);
                            }
                        }
                    } catch (error) {
                        // Ignore individual fix errors
                        console.log('Could not apply fix for diagnostic:', diagnostic.message);
                    }
                }
            }
        } catch (error) {
            console.error('Error fixing syntax errors:', error);
        }
    }
}

module.exports = BasicFixes;
