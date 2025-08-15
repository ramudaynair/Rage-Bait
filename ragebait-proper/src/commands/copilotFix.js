const vscode = require('vscode');
const axios = require('axios');

/**
 * AI-powered code fixing using Copilot and Gemini APIs
 */
class CopilotFix {
    constructor(config) {
        this.config = config;
        this.undoStack = [];
        this.maxUndoStack = 10;
    }

    /**
     * Save current state for undo functionality
     * @param {vscode.TextEditor} editor 
     * @param {string} action 
     */
    saveUndoState(editor, action) {
        const state = {
            document: editor.document.uri.toString(),
            content: editor.document.getText(),
            selection: editor.selection,
            action: action,
            timestamp: Date.now()
        };

        this.undoStack.push(state);
        if (this.undoStack.length > this.maxUndoStack) {
            this.undoStack.shift();
        }
    }

    /**
     * Execute AI-powered fix with fallback chain
     * @param {vscode.TextEditor} editor 
     */
    async executeAIFix(editor) {
        if (!editor) {
            vscode.window.showErrorMessage('🔧 No active editor for fixing!');
            return;
        }

        this.saveUndoState(editor, 'ai_fix');

        try {
            // Try Copilot first
            const copilotSuccess = await this.tryCopilotFix(editor);
            if (copilotSuccess) {
                this.showSuccessNotification('GitHub Copilot');
                return;
            }

            // Try Gemini API
            const geminiSuccess = await this.tryGeminiFix(editor);
            if (geminiSuccess) {
                this.showSuccessNotification('Google Gemini');
                return;
            }

            // Fallback to basic fixes
            const basicSuccess = await this.tryBasicFixes(editor);
            if (basicSuccess) {
                this.showSuccessNotification('Basic Fixes');
                return;
            }

            // If all else fails, show message
            if (this.config.areNotificationsEnabled()) {
                vscode.window.showWarningMessage('🔧 RageBait: No fixes available', 'Settings')
                    .then(selection => {
                        if (selection === 'Settings') {
                            vscode.commands.executeCommand('workbench.action.openSettings', 'ragebait');
                        }
                    });
            }

        } catch (error) {
            console.error('RageBait fix error:', error);
            vscode.window.showErrorMessage(`🔧 RageBait fix failed: ${error.message}`);
        }
    }

    /**
     * Try to use GitHub Copilot for fixes
     * @param {vscode.TextEditor} editor 
     * @returns {boolean} Success status
     */
    async tryCopilotFix(editor) {
        try {
            // Check if Copilot extension is available
            const copilotExtension = vscode.extensions.getExtension('GitHub.copilot');
            if (!copilotExtension) {
                return false;
            }

            // Ensure Copilot is activated
            if (!copilotExtension.isActive) {
                await copilotExtension.activate();
            }

            // Get current selection or entire document
            const document = editor.document;
            const selection = editor.selection;
            const text = selection.isEmpty ? document.getText() : document.getText(selection);

            if (!text.trim()) {
                return false;
            }

            // Try to trigger Copilot suggestions
            const position = selection.isEmpty ? new vscode.Position(0, 0) : selection.start;
            
            // Insert a comment to trigger Copilot
            const language = document.languageId;
            const commentPrefix = this.getCommentPrefix(language);
            const fixPrompt = `${commentPrefix} Fix this code:\n`;

            await editor.edit(editBuilder => {
                editBuilder.insert(position, fixPrompt);
            });

            // Trigger Copilot completion
            await vscode.commands.executeCommand('editor.action.inlineSuggest.trigger');
            
            // Wait a bit for Copilot to respond
            await new Promise(resolve => setTimeout(resolve, 1000));

            return true;

        } catch (error) {
            console.error('Copilot fix error:', error);
            return false;
        }
    }

    /**
     * Try to use Gemini API for fixes
     * @param {vscode.TextEditor} editor 
     * @returns {boolean} Success status
     */
    async tryGeminiFix(editor) {
        const apiKey = this.config.getGeminiApiKey();
        if (!apiKey) {
            return false;
        }

        try {
            const document = editor.document;
            const selection = editor.selection;
            const text = selection.isEmpty ? document.getText() : document.getText(selection);
            
            if (!text.trim()) {
                return false;
            }

            const language = document.languageId;
            const prompt = this.createFixPrompt(text, language);

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }
            );

            if (response.data && response.data.candidates && response.data.candidates[0]) {
                const fixedCode = this.extractCodeFromResponse(response.data.candidates[0].content.parts[0].text);
                
                if (fixedCode && fixedCode !== text) {
                    await editor.edit(editBuilder => {
                        if (selection.isEmpty) {
                            const fullRange = new vscode.Range(
                                document.positionAt(0),
                                document.positionAt(document.getText().length)
                            );
                            editBuilder.replace(fullRange, fixedCode);
                        } else {
                            editBuilder.replace(selection, fixedCode);
                        }
                    });
                    return true;
                }
            }

            return false;

        } catch (error) {
            console.error('Gemini fix error:', error);
            return false;
        }
    }

    /**
     * Try basic code fixes
     * @param {vscode.TextEditor} editor 
     * @returns {boolean} Success status
     */
    async tryBasicFixes(editor) {
        const document = editor.document;
        const language = document.languageId;
        let fixApplied = false;

        try {
            // Format document
            await vscode.commands.executeCommand('editor.action.formatDocument');
            fixApplied = true;

            // Language-specific fixes
            const text = document.getText();
            let fixedText = text;

            switch (language) {
                case 'javascript':
                case 'typescript':
                    fixedText = this.fixJavaScript(text);
                    break;
                case 'python':
                    fixedText = this.fixPython(text);
                    break;
                case 'java':
                    fixedText = this.fixJava(text);
                    break;
                case 'csharp':
                    fixedText = this.fixCSharp(text);
                    break;
                default:
                    fixedText = this.fixGeneric(text);
                    break;
            }

            if (fixedText !== text) {
                await editor.edit(editBuilder => {
                    const fullRange = new vscode.Range(
                        document.positionAt(0),
                        document.positionAt(text.length)
                    );
                    editBuilder.replace(fullRange, fixedText);
                });
                fixApplied = true;
            }

            return fixApplied;

        } catch (error) {
            console.error('Basic fix error:', error);
            return false;
        }
    }

    /**
     * Create fix prompt for AI
     * @param {string} code 
     * @param {string} language 
     * @returns {string}
     */
    createFixPrompt(code, language) {
        return `Fix the following ${language} code. Return only the corrected code without explanations:

\`\`\`${language}
${code}
\`\`\`

Fixed code:`;
    }

    /**
     * Extract code from AI response
     * @param {string} response 
     * @returns {string}
     */
    extractCodeFromResponse(response) {
        // Try to extract code from markdown blocks
        const codeBlockRegex = /```[\w]*\n([\s\S]*?)\n```/;
        const match = response.match(codeBlockRegex);
        
        if (match) {
            return match[1].trim();
        }

        // If no code block, return the response as-is (might be plain code)
        return response.trim();
    }

    /**
     * Get comment prefix for language
     * @param {string} language 
     * @returns {string}
     */
    getCommentPrefix(language) {
        const commentMap = {
            'javascript': '//',
            'typescript': '//',
            'java': '//',
            'csharp': '//',
            'cpp': '//',
            'c': '//',
            'python': '#',
            'ruby': '#',
            'shell': '#',
            'yaml': '#',
            'html': '<!--',
            'xml': '<!--',
            'css': '/*',
            'sql': '--'
        };

        return commentMap[language] || '//';
    }

    /**
     * Fix JavaScript/TypeScript code
     * @param {string} code 
     * @returns {string}
     */
    fixJavaScript(code) {
        let fixed = code;
        
        // Add missing semicolons
        fixed = fixed.replace(/([^;\s}])\s*\n/g, '$1;\n');
        
        // Fix common syntax issues
        fixed = fixed.replace(/==/g, '===');
        fixed = fixed.replace(/!=/g, '!==');
        
        return fixed;
    }

    /**
     * Fix Python code
     * @param {string} code 
     * @returns {string}
     */
    fixPython(code) {
        let fixed = code;
        
        // Fix indentation (basic)
        const lines = fixed.split('\n');
        let indentLevel = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.endsWith(':')) {
                lines[i] = '    '.repeat(indentLevel) + line;
                indentLevel++;
            } else if (line && !line.startsWith('#')) {
                lines[i] = '    '.repeat(indentLevel) + line;
            }
        }
        
        return lines.join('\n');
    }

    /**
     * Fix Java code
     * @param {string} code 
     * @returns {string}
     */
    fixJava(code) {
        let fixed = code;
        
        // Add missing semicolons
        fixed = fixed.replace(/([^;\s}])\s*\n/g, '$1;\n');
        
        return fixed;
    }

    /**
     * Fix C# code
     * @param {string} code 
     * @returns {string}
     */
    fixCSharp(code) {
        let fixed = code;
        
        // Add missing semicolons
        fixed = fixed.replace(/([^;\s}])\s*\n/g, '$1;\n');
        
        return fixed;
    }

    /**
     * Generic code fixes
     * @param {string} code 
     * @returns {string}
     */
    fixGeneric(code) {
        let fixed = code;
        
        // Remove trailing whitespace
        fixed = fixed.replace(/[ \t]+$/gm, '');
        
        // Ensure file ends with newline
        if (!fixed.endsWith('\n')) {
            fixed += '\n';
        }
        
        return fixed;
    }

    /**
     * Show success notification
     * @param {string} method 
     */
    showSuccessNotification(method) {
        if (this.config.areNotificationsEnabled()) {
            vscode.window.showInformationMessage(`🔧 RageBait fixed code using: ${method}`, 'Undo', 'Settings')
                .then(selection => {
                    if (selection === 'Undo') {
                        vscode.commands.executeCommand('ragebait.panicUndo');
                    } else if (selection === 'Settings') {
                        vscode.commands.executeCommand('workbench.action.openSettings', 'ragebait');
                    }
                });
        }
    }
}

module.exports = CopilotFix;
