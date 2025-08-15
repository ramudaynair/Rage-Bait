const vscode = require('vscode');

/**
 * Emergency undo system for RageBait extension
 * Provides panic undo functionality with multiple action rollback
 */
class UndoAction {
    constructor() {
        this.undoStack = [];
        this.maxUndoStack = 20;
        this.isUndoing = false;
    }

    /**
     * Save current state for undo functionality
     * @param {vscode.TextEditor} editor 
     * @param {string} action 
     * @param {object} metadata 
     */
    saveUndoState(editor, action, metadata = {}) {
        if (this.isUndoing) {
            return; // Don't save undo states while undoing
        }

        if (!editor || !editor.document) {
            return;
        }

        const state = {
            id: this.generateId(),
            document: editor.document.uri.toString(),
            content: editor.document.getText(),
            selection: {
                start: editor.selection.start,
                end: editor.selection.end,
                active: editor.selection.active,
                anchor: editor.selection.anchor
            },
            action: action,
            timestamp: Date.now(),
            metadata: metadata
        };

        this.undoStack.push(state);
        
        // Keep stack size manageable
        if (this.undoStack.length > this.maxUndoStack) {
            this.undoStack.shift();
        }

        console.log(`RageBait: Saved undo state for action: ${action}`);
    }

    /**
     * Execute panic undo - undo multiple actions
     * @param {number} count Number of actions to undo (default: 5)
     */
    async executePanicUndo(count = 5) {
        if (this.undoStack.length === 0) {
            vscode.window.showWarningMessage('🚨 RageBait: No actions to undo');
            return;
        }

        this.isUndoing = true;
        let undoCount = 0;
        const maxUndo = Math.min(count, this.undoStack.length);

        try {
            // Show progress
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: `🚨 RageBait Panic Undo`,
                cancellable: false
            }, async (progress) => {
                for (let i = 0; i < maxUndo; i++) {
                    const state = this.undoStack.pop();
                    if (!state) break;

                    progress.report({
                        increment: (100 / maxUndo),
                        message: `Undoing: ${state.action} (${i + 1}/${maxUndo})`
                    });

                    const success = await this.restoreState(state);
                    if (success) {
                        undoCount++;
                    }

                    // Small delay for visual feedback
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            });

            vscode.window.showInformationMessage(
                `🚨 RageBait: Successfully undid ${undoCount} action(s)`,
                'View Undo History'
            ).then(selection => {
                if (selection === 'View Undo History') {
                    this.showUndoHistory();
                }
            });

        } catch (error) {
            console.error('Panic undo error:', error);
            vscode.window.showErrorMessage(`🚨 RageBait panic undo failed: ${error.message}`);
        } finally {
            this.isUndoing = false;
        }
    }

    /**
     * Undo single action
     */
    async executeSingleUndo() {
        if (this.undoStack.length === 0) {
            vscode.window.showWarningMessage('🚨 RageBait: No actions to undo');
            return;
        }

        this.isUndoing = true;

        try {
            const state = this.undoStack.pop();
            const success = await this.restoreState(state);

            if (success) {
                vscode.window.showInformationMessage(
                    `🚨 RageBait: Undid action: ${state.action}`,
                    'Undo More'
                ).then(selection => {
                    if (selection === 'Undo More') {
                        this.executePanicUndo(3);
                    }
                });
            } else {
                vscode.window.showErrorMessage('🚨 RageBait: Failed to undo action');
            }

        } catch (error) {
            console.error('Single undo error:', error);
            vscode.window.showErrorMessage(`🚨 RageBait undo failed: ${error.message}`);
        } finally {
            this.isUndoing = false;
        }
    }

    /**
     * Restore a saved state by ID
     * @param {string} stateId
     * @returns {boolean} Success status
     */
    async restoreStateById(stateId) {
        const state = this.undoStack.find(s => s.id === stateId);
        if (!state) {
            vscode.window.showErrorMessage('🚨 RageBait: State not found in undo history');
            return false;
        }

        return await this.restoreState(state);
    }

    /**
     * Restore a saved state
     * @param {object} state
     * @returns {boolean} Success status
     */
    async restoreState(state) {
        try {
            // Find the document
            const document = await vscode.workspace.openTextDocument(vscode.Uri.parse(state.document));
            const editor = await vscode.window.showTextDocument(document);

            if (!editor) {
                console.error('Could not open editor for document:', state.document);
                return false;
            }

            // Restore content
            await editor.edit(editBuilder => {
                const fullRange = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(document.getText().length)
                );
                editBuilder.replace(fullRange, state.content);
            });

            // Restore selection
            if (state.selection) {
                const selection = new vscode.Selection(
                    new vscode.Position(state.selection.anchor.line, state.selection.anchor.character),
                    new vscode.Position(state.selection.active.line, state.selection.active.character)
                );
                editor.selection = selection;
                editor.revealRange(selection);
            }

            return true;

        } catch (error) {
            console.error('Error restoring state:', error);
            return false;
        }
    }

    /**
     * Show undo history in a quick pick
     */
    async showUndoHistory() {
        if (this.undoStack.length === 0) {
            vscode.window.showInformationMessage('🚨 RageBait: No undo history available');
            return;
        }

        const items = this.undoStack.map((state, index) => ({
            label: `${state.action}`,
            description: `${new Date(state.timestamp).toLocaleTimeString()}`,
            detail: `Document: ${this.getDocumentName(state.document)}`,
            state: state,
            index: index
        })).reverse(); // Show most recent first

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select action to undo to (will undo this and all actions after it)',
            matchOnDescription: true,
            matchOnDetail: true
        });

        if (selected) {
            const undoToIndex = this.undoStack.length - 1 - selected.index;
            const undoCount = this.undoStack.length - undoToIndex;
            
            const confirm = await vscode.window.showWarningMessage(
                `🚨 This will undo ${undoCount} action(s). Continue?`,
                'Yes, Undo',
                'Cancel'
            );

            if (confirm === 'Yes, Undo') {
                await this.executePanicUndo(undoCount);
            }
        }
    }

    /**
     * Clear undo history
     */
    clearUndoHistory() {
        this.undoStack = [];
        vscode.window.showInformationMessage('🚨 RageBait: Undo history cleared');
    }

    /**
     * Get undo stack for debugging
     * @returns {Array}
     */
    getUndoStack() {
        return this.undoStack;
    }

    /**
     * Get undo stack size
     * @returns {number}
     */
    getUndoStackSize() {
        return this.undoStack.length;
    }

    /**
     * Generate unique ID
     * @returns {string}
     */
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get document name from URI
     * @param {string} documentUri 
     * @returns {string}
     */
    getDocumentName(documentUri) {
        try {
            const uri = vscode.Uri.parse(documentUri);
            return uri.path.split('/').pop() || 'Unknown';
        } catch (error) {
            return 'Unknown';
        }
    }

    /**
     * Get statistics about undo history
     * @returns {object}
     */
    getUndoStatistics() {
        const stats = {
            totalActions: this.undoStack.length,
            actionTypes: {},
            oldestAction: null,
            newestAction: null,
            documentsAffected: new Set()
        };

        this.undoStack.forEach(state => {
            // Count action types
            stats.actionTypes[state.action] = (stats.actionTypes[state.action] || 0) + 1;
            
            // Track documents
            stats.documentsAffected.add(state.document);
            
            // Track timestamps
            if (!stats.oldestAction || state.timestamp < stats.oldestAction) {
                stats.oldestAction = state.timestamp;
            }
            if (!stats.newestAction || state.timestamp > stats.newestAction) {
                stats.newestAction = state.timestamp;
            }
        });

        stats.documentsAffected = stats.documentsAffected.size;

        return stats;
    }

    /**
     * Export undo history for debugging
     * @returns {string}
     */
    exportUndoHistory() {
        const stats = this.getUndoStatistics();
        const history = this.undoStack.map(state => ({
            action: state.action,
            timestamp: new Date(state.timestamp).toISOString(),
            document: this.getDocumentName(state.document),
            metadata: state.metadata
        }));

        return JSON.stringify({
            statistics: stats,
            history: history
        }, null, 2);
    }
}

module.exports = UndoAction;
