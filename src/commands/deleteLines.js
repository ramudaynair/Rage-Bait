const vscode = require('vscode');

/**
 * Destruction methods for RageBait extension
 * Contains various ways to destroy code when triggered
 */
class DestructionCommands {
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
     * Get random destruction method
     * @returns {string}
     */
    getRandomDestructionMethod() {
        const methods = [
            'randomLineDelete',
            'functionDestroyer',
            'selectionObliterator',
            'fileBisector'
        ];
        return methods[Math.floor(Math.random() * methods.length)];
    }

    /**
     * Execute random destruction
     * @param {vscode.TextEditor} editor 
     */
    async executeRandomDestruction(editor) {
        if (!editor) {
            vscode.window.showErrorMessage('🔥 No active editor for destruction!');
            return;
        }

        const method = this.getRandomDestructionMethod();
        this.saveUndoState(editor, `destruction_${method}`);

        try {
            switch (method) {
                case 'randomLineDelete':
                    await this.randomLineDelete(editor);
                    break;
                case 'functionDestroyer':
                    await this.functionDestroyer(editor);
                    break;
                case 'selectionObliterator':
                    await this.selectionObliterator(editor);
                    break;
                case 'fileBisector':
                    await this.fileBisector(editor);
                    break;
            }

            if (this.config.areNotificationsEnabled()) {
                vscode.window.showErrorMessage(`🔥 RageBait executed: ${method}`, 'Undo', 'Settings')
                    .then(selection => {
                        if (selection === 'Undo') {
                            vscode.commands.executeCommand('ragebait.panicUndo');
                        } else if (selection === 'Settings') {
                            vscode.commands.executeCommand('workbench.action.openSettings', 'ragebait');
                        }
                    });
            }
        } catch (error) {
            console.error('RageBait destruction error:', error);
            vscode.window.showErrorMessage(`🔥 RageBait destruction failed: ${error.message}`);
        }
    }

    /**
     * Delete random lines from the document
     * @param {vscode.TextEditor} editor 
     */
    async randomLineDelete(editor) {
        const document = editor.document;
        const totalLines = document.lineCount;
        
        if (totalLines <= 1) {
            return; // Don't destroy single-line files
        }

        const maxLines = Math.min(this.config.getMaxDestructionLines(), totalLines);
        const linesToDelete = Math.floor(Math.random() * (maxLines * 0.3)) + 1; // 1-30% of max lines
        const deletedLines = new Set();

        // Select random lines to delete
        while (deletedLines.size < linesToDelete && deletedLines.size < totalLines - 1) {
            const randomLine = Math.floor(Math.random() * totalLines);
            deletedLines.add(randomLine);
        }

        // Sort lines in descending order to delete from bottom to top
        const sortedLines = Array.from(deletedLines).sort((a, b) => b - a);

        await editor.edit(editBuilder => {
            sortedLines.forEach(lineNumber => {
                if (lineNumber < document.lineCount) {
                    const line = document.lineAt(lineNumber);
                    editBuilder.delete(line.rangeIncludingLineBreak);
                }
            });
        });
    }

    /**
     * Delete the entire function where cursor is located
     * @param {vscode.TextEditor} editor 
     */
    async functionDestroyer(editor) {
        const document = editor.document;
        const position = editor.selection.active;
        const currentLine = position.line;

        // Find function boundaries (simple heuristic)
        let startLine = currentLine;
        let endLine = currentLine;

        // Look for function start (lines with function keywords or opening braces)
        for (let i = currentLine; i >= 0; i--) {
            const lineText = document.lineAt(i).text.trim();
            if (this.isFunctionStart(lineText)) {
                startLine = i;
                break;
            }
            if (lineText === '' && i < currentLine - 20) break; // Don't go too far
        }

        // Look for function end (closing braces or next function)
        for (let i = currentLine; i < document.lineCount; i++) {
            const lineText = document.lineAt(i).text.trim();
            if (this.isFunctionEnd(lineText, startLine, i)) {
                endLine = i;
                break;
            }
            if (i > currentLine + 50) break; // Don't go too far
        }

        // Delete the function
        if (endLine > startLine) {
            const startPos = new vscode.Position(startLine, 0);
            const endPos = new vscode.Position(endLine + 1, 0);
            const range = new vscode.Range(startPos, endPos);

            await editor.edit(editBuilder => {
                editBuilder.delete(range);
            });
        } else {
            // Fallback: delete current line
            const line = document.lineAt(currentLine);
            await editor.edit(editBuilder => {
                editBuilder.delete(line.rangeIncludingLineBreak);
            });
        }
    }

    /**
     * Check if line is a function start
     * @param {string} lineText 
     * @returns {boolean}
     */
    isFunctionStart(lineText) {
        const functionKeywords = [
            'function', 'def ', 'func ', 'fn ', 'method', 'class ',
            'public ', 'private ', 'protected ', 'static ', 'async ',
            'const ', 'let ', 'var '
        ];
        
        return functionKeywords.some(keyword => 
            lineText.includes(keyword) && (lineText.includes('(') || lineText.includes('{'))
        );
    }

    /**
     * Check if line is a function end
     * @param {string} lineText 
     * @param {number} startLine 
     * @param {number} currentLine 
     * @returns {boolean}
     */
    isFunctionEnd(lineText, startLine, currentLine) {
        if (currentLine <= startLine) return false;
        
        // Simple heuristic: closing brace at start of line or next function
        return lineText === '}' || 
               lineText === '})' || 
               lineText === '};' ||
               this.isFunctionStart(lineText);
    }

    /**
     * Delete selected text or current line if nothing selected
     * @param {vscode.TextEditor} editor 
     */
    async selectionObliterator(editor) {
        const selection = editor.selection;

        if (selection.isEmpty) {
            // Delete current line
            const line = editor.document.lineAt(selection.active.line);
            await editor.edit(editBuilder => {
                editBuilder.delete(line.rangeIncludingLineBreak);
            });
        } else {
            // Delete selected text
            await editor.edit(editBuilder => {
                editBuilder.delete(selection);
            });
        }
    }

    /**
     * Delete top or bottom half of the file
     * @param {vscode.TextEditor} editor 
     */
    async fileBisector(editor) {
        const document = editor.document;
        const totalLines = document.lineCount;
        
        if (totalLines <= 2) {
            return; // Don't bisect very small files
        }

        const midPoint = Math.floor(totalLines / 2);
        const deleteTop = Math.random() < 0.5;

        let startLine, endLine;
        
        if (deleteTop) {
            startLine = 0;
            endLine = midPoint;
        } else {
            startLine = midPoint;
            endLine = totalLines;
        }

        const startPos = new vscode.Position(startLine, 0);
        const endPos = new vscode.Position(endLine, 0);
        const range = new vscode.Range(startPos, endPos);

        await editor.edit(editBuilder => {
            editBuilder.delete(range);
        });
    }

    /**
     * Get undo stack for debugging
     * @returns {Array}
     */
    getUndoStack() {
        return this.undoStack;
    }

    /**
     * Clear undo stack
     */
    clearUndoStack() {
        this.undoStack = [];
    }
}

module.exports = DestructionCommands;
