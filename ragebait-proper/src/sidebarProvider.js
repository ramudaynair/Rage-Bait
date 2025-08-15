const vscode = require('vscode');

/**
 * Main control panel view provider for RageBait sidebar
 */
class RageBaitMainViewProvider {
    constructor(config, extension) {
        this.config = config;
        this.extension = extension;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        return element;
    }

    getChildren(element) {
        if (!element) {
            return this.getRootItems();
        }
        return [];
    }

    getRootItems() {
        const items = [];

        // Status section
        const isEnabled = this.config.isEnabled();
        const isSpeechEnabled = this.config.isSpeechEnabled();
        
        items.push(new RageBaitTreeItem(
            `Extension: ${isEnabled ? '🔥 ACTIVE' : '🔇 DISABLED'}`,
            vscode.TreeItemCollapsibleState.None,
            {
                command: 'ragebait.toggle',
                title: 'Toggle RageBait',
                arguments: []
            },
            isEnabled ? 'statusBarItem.warningBackground' : 'statusBarItem.background'
        ));

        items.push(new RageBaitTreeItem(
            `Speech: ${isSpeechEnabled ? '🎤 LISTENING' : '🔇 MUTED'}`,
            vscode.TreeItemCollapsibleState.None,
            {
                command: 'ragebait.toggleSpeech',
                title: 'Toggle Speech Recognition',
                arguments: []
            },
            isSpeechEnabled ? 'statusBarItem.prominentBackground' : 'statusBarItem.background'
        ));

        // Separator
        items.push(new RageBaitTreeItem('─────────────────', vscode.TreeItemCollapsibleState.None));

        // Action buttons
        items.push(new RageBaitTreeItem(
            '🔥 Manual Trigger',
            vscode.TreeItemCollapsibleState.None,
            {
                command: 'ragebait.trigger',
                title: 'Trigger RageBait Action',
                arguments: []
            }
        ));

        items.push(new RageBaitTreeItem(
            '🚨 Panic Undo (5x)',
            vscode.TreeItemCollapsibleState.None,
            {
                command: 'ragebait.panicUndo',
                title: 'Emergency Undo',
                arguments: []
            }
        ));

        // Separator
        items.push(new RageBaitTreeItem('─────────────────', vscode.TreeItemCollapsibleState.None));

        // Configuration info
        const destructionChance = this.config.getDestructionChance();
        const triggerWords = this.config.getTriggerWords();
        
        items.push(new RageBaitTreeItem(
            `Destruction Chance: ${Math.round(destructionChance * 100)}%`,
            vscode.TreeItemCollapsibleState.None,
            {
                command: 'ragebait.showSettings',
                title: 'Open Settings',
                arguments: []
            }
        ));

        items.push(new RageBaitTreeItem(
            `Trigger Words: ${triggerWords.length}`,
            vscode.TreeItemCollapsibleState.None,
            {
                command: 'ragebait.showSettings',
                title: 'Open Settings',
                arguments: []
            }
        ));

        // Gemini API status
        const hasGeminiKey = this.config.getGeminiApiKey().length > 0;
        items.push(new RageBaitTreeItem(
            `Gemini API: ${hasGeminiKey ? '✅ Configured' : '❌ Not Set'}`,
            vscode.TreeItemCollapsibleState.None,
            {
                command: 'ragebait.showSettings',
                title: 'Configure Gemini API',
                arguments: []
            }
        ));

        return items;
    }
}

/**
 * Undo history view provider for RageBait sidebar
 */
class RageBaitHistoryViewProvider {
    constructor(undoAction) {
        this.undoAction = undoAction;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        return element;
    }

    getChildren(element) {
        if (!element) {
            return this.getHistoryItems();
        }
        return [];
    }

    getHistoryItems() {
        const history = this.undoAction.getUndoStack();
        
        if (history.length === 0) {
            return [new RageBaitTreeItem(
                'No undo history',
                vscode.TreeItemCollapsibleState.None,
                undefined,
                undefined,
                'No actions have been performed yet'
            )];
        }

        return history.slice(-10).reverse().map((state, index) => {
            const timeAgo = this.getTimeAgo(state.timestamp);
            const documentName = this.getDocumentName(state.document);
            
            return new RageBaitTreeItem(
                `${state.action}`,
                vscode.TreeItemCollapsibleState.None,
                {
                    command: 'ragebait.restoreState',
                    title: 'Restore This State',
                    arguments: [state.id]
                },
                undefined,
                `${documentName} - ${timeAgo}`
            );
        });
    }

    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return `${seconds}s ago`;
    }

    getDocumentName(documentUri) {
        try {
            const uri = vscode.Uri.parse(documentUri);
            return uri.path.split('/').pop() || 'Unknown';
        } catch (error) {
            return 'Unknown';
        }
    }
}

/**
 * Statistics view provider for RageBait sidebar
 */
class RageBaitStatsViewProvider {
    constructor(undoAction) {
        this.undoAction = undoAction;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.stats = {
            totalActions: 0,
            destructionActions: 0,
            fixActions: 0,
            speechTriggers: 0,
            textTriggers: 0,
            manualTriggers: 0
        };
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    updateStats(action, source) {
        this.stats.totalActions++;
        
        if (action.includes('destruction')) {
            this.stats.destructionActions++;
        } else if (action.includes('fix')) {
            this.stats.fixActions++;
        }

        if (source === 'speech') {
            this.stats.speechTriggers++;
        } else if (source === 'typing') {
            this.stats.textTriggers++;
        } else if (source === 'manual') {
            this.stats.manualTriggers++;
        }

        this.refresh();
    }

    getTreeItem(element) {
        return element;
    }

    getChildren(element) {
        if (!element) {
            return this.getStatsItems();
        }
        return [];
    }

    getStatsItems() {
        const items = [];
        const undoHistory = this.undoAction.getUndoStack();

        // Calculate stats from undo history
        const destructionCount = undoHistory.filter(s => s.action.includes('destruction')).length;
        const fixCount = undoHistory.filter(s => s.action.includes('fix')).length;
        const speechCount = undoHistory.filter(s => s.metadata?.source === 'speech').length;
        const textCount = undoHistory.filter(s => s.metadata?.source === 'typing').length;
        const manualCount = undoHistory.filter(s => s.metadata?.source === 'manual').length;

        items.push(new RageBaitTreeItem(
            `📊 Total Actions: ${undoHistory.length}`,
            vscode.TreeItemCollapsibleState.None
        ));

        items.push(new RageBaitTreeItem(
            `💥 Destructions: ${destructionCount}`,
            vscode.TreeItemCollapsibleState.None
        ));

        items.push(new RageBaitTreeItem(
            `🔧 Fixes: ${fixCount}`,
            vscode.TreeItemCollapsibleState.None
        ));

        // Separator
        items.push(new RageBaitTreeItem('─────────────────', vscode.TreeItemCollapsibleState.None));

        items.push(new RageBaitTreeItem(
            `🎤 Speech Triggers: ${speechCount}`,
            vscode.TreeItemCollapsibleState.None
        ));

        items.push(new RageBaitTreeItem(
            `⌨️ Text Triggers: ${textCount}`,
            vscode.TreeItemCollapsibleState.None
        ));

        items.push(new RageBaitTreeItem(
            `👆 Manual Triggers: ${manualCount}`,
            vscode.TreeItemCollapsibleState.None
        ));

        // Calculate success rate
        const totalTriggers = destructionCount + fixCount;
        if (totalTriggers > 0) {
            const destructionRate = Math.round((destructionCount / totalTriggers) * 100);
            items.push(new RageBaitTreeItem('─────────────────', vscode.TreeItemCollapsibleState.None));
            items.push(new RageBaitTreeItem(
                `🎯 Destruction Rate: ${destructionRate}%`,
                vscode.TreeItemCollapsibleState.None
            ));
        }

        return items;
    }
}

/**
 * Custom tree item for RageBait sidebar
 */
class RageBaitTreeItem extends vscode.TreeItem {
    constructor(label, collapsibleState, command, backgroundColor, tooltip) {
        super(label, collapsibleState);
        this.command = command;
        this.tooltip = tooltip || label;
        
        if (backgroundColor) {
            this.resourceUri = vscode.Uri.parse(`ragebait:${label}`);
            this.contextValue = 'ragebaitItem';
        }
    }
}

module.exports = {
    RageBaitMainViewProvider,
    RageBaitHistoryViewProvider,
    RageBaitStatsViewProvider
};
