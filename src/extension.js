const vscode = require('vscode');
const RageBaitConfig = require('./config');
const SpeechRecognition = require('./speechRecognition');
const DestructionCommands = require('./commands/deleteLines');
const CopilotFix = require('./commands/copilotFix');
const BasicFixes = require('./commands/basicFixes');
const UndoAction = require('./commands/undoAction');
const {
    RageBaitMainViewProvider,
    RageBaitHistoryViewProvider,
    RageBaitStatsViewProvider
} = require('./sidebarProvider');

/**
 * Main RageBait extension class
 * Monitors typing and speech for trigger words, then randomly destroys or fixes code
 */
class RageBaitExtension {
    constructor() {
        this.config = new RageBaitConfig();
        this.speechRecognition = null;
        this.destructionCommands = null;
        this.copilotFix = null;
        this.basicFixes = null;
        this.undoAction = new UndoAction();
        
        this.textChangeListener = null;
        this.lastTriggerTime = 0;
        this.triggerCooldown = 2000; // 2 seconds cooldown between triggers
        this.isProcessingTrigger = false;

        // Sidebar providers
        this.mainViewProvider = null;
        this.historyViewProvider = null;
        this.statsViewProvider = null;
    }

    /**
     * Activate the extension
     * @param {vscode.ExtensionContext} context
     */
    async activate(context) {
        console.log('🔥 RageBait extension is activating...');

        // Show activation message for debugging
        vscode.window.showInformationMessage('🔥 RageBait is starting up...');

        try {
            // Initialize components
            this.destructionCommands = new DestructionCommands(this.config);
            this.copilotFix = new CopilotFix(this.config);
            this.basicFixes = new BasicFixes(this.config);

            // Initialize speech recognition with trigger callback
            this.speechRecognition = new SpeechRecognition(
                this.config, 
                this.handleTrigger.bind(this)
            );

            // Register commands
            this.registerCommands(context);

            // Initialize sidebar views
            this.initializeSidebarViews(context);

            // Start text monitoring
            this.startTextMonitoring();

            // Initialize speech recognition
            await this.speechRecognition.initialize();

            // Show welcome message
            if (this.config.areNotificationsEnabled()) {
                vscode.window.showWarningMessage(
                    '🔥 RageBait is now active! Type or speak trigger words at your own risk!',
                    'Settings',
                    'Disable'
                ).then(selection => {
                    if (selection === 'Settings') {
                        vscode.commands.executeCommand('workbench.action.openSettings', 'ragebait');
                    } else if (selection === 'Disable') {
                        this.config.setEnabled(false);
                    }
                });
            }

            console.log('🔥 RageBait extension activated successfully');

            // Show success message
            vscode.window.showInformationMessage('🔥 RageBait is now active!', 'Open Sidebar', 'Settings')
                .then(selection => {
                    if (selection === 'Open Sidebar') {
                        vscode.commands.executeCommand('workbench.view.extension.ragebait-sidebar');
                    } else if (selection === 'Settings') {
                        vscode.commands.executeCommand('workbench.action.openSettings', 'ragebait');
                    }
                });

        } catch (error) {
            console.error('RageBait activation error:', error);
            vscode.window.showErrorMessage(`🔥 RageBait failed to activate: ${error.message}`, 'Show Details')
                .then(selection => {
                    if (selection === 'Show Details') {
                        vscode.window.showErrorMessage(`Error details: ${error.stack || error.toString()}`);
                    }
                });
        }
    }

    /**
     * Register all extension commands
     * @param {vscode.ExtensionContext} context 
     */
    registerCommands(context) {
        const commands = [
            // Manual trigger
            vscode.commands.registerCommand('ragebait.trigger', () => {
                this.handleTrigger('manual', 'manual trigger', 'Manual trigger activated');
            }),

            // Toggle extension
            vscode.commands.registerCommand('ragebait.toggle', async () => {
                const newState = !this.config.isEnabled();
                await this.config.setEnabled(newState);
                
                const message = newState ? 
                    '🔥 RageBait enabled - Chaos mode activated!' : 
                    '🔇 RageBait disabled - Safe mode activated';
                
                vscode.window.showInformationMessage(message);
            }),

            // Toggle speech recognition
            vscode.commands.registerCommand('ragebait.toggleSpeech', () => {
                if (this.speechRecognition) {
                    this.speechRecognition.toggleSpeechRecognition();
                }
            }),

            // Panic undo
            vscode.commands.registerCommand('ragebait.panicUndo', () => {
                this.undoAction.executePanicUndo(5);
            }),

            // Show settings
            vscode.commands.registerCommand('ragebait.showSettings', () => {
                vscode.commands.executeCommand('workbench.action.openSettings', 'ragebait');
            }),

            // Additional commands for power users
            vscode.commands.registerCommand('ragebait.singleUndo', () => {
                this.undoAction.executeSingleUndo();
            }),

            vscode.commands.registerCommand('ragebait.showUndoHistory', () => {
                this.undoAction.showUndoHistory();
            }),

            vscode.commands.registerCommand('ragebait.clearUndoHistory', () => {
                this.undoAction.clearUndoHistory();
            }),

            vscode.commands.registerCommand('ragebait.exportUndoHistory', () => {
                const history = this.undoAction.exportUndoHistory();
                vscode.workspace.openTextDocument({
                    content: history,
                    language: 'json'
                }).then(doc => {
                    vscode.window.showTextDocument(doc);
                });
            }),

            // Sidebar commands
            vscode.commands.registerCommand('ragebait.refreshViews', () => {
                this.refreshSidebarViews();
            }),

            vscode.commands.registerCommand('ragebait.clearHistory', () => {
                this.undoAction.clearUndoHistory();
                this.refreshSidebarViews();
            }),

            vscode.commands.registerCommand('ragebait.exportHistory', () => {
                const history = this.undoAction.exportUndoHistory();
                vscode.workspace.openTextDocument({
                    content: history,
                    language: 'json'
                }).then(doc => {
                    vscode.window.showTextDocument(doc);
                });
            }),

            vscode.commands.registerCommand('ragebait.restoreState', async (stateId) => {
                // Restore specific state by ID
                const success = await this.undoAction.restoreStateById(stateId);
                if (success) {
                    this.refreshSidebarViews();
                }
            })
        ];

        // Register all commands with error handling
        commands.forEach((command, index) => {
            try {
                context.subscriptions.push(command);
                console.log(`✅ Registered command ${index + 1}/${commands.length}`);
            } catch (error) {
                console.error(`❌ Failed to register command ${index + 1}:`, error);
                vscode.window.showErrorMessage(`Failed to register RageBait command: ${error.message}`);
            }
        });

        console.log(`🔥 RageBait: Successfully registered ${commands.length} commands`);
    }

    /**
     * Initialize sidebar views
     * @param {vscode.ExtensionContext} context
     */
    initializeSidebarViews(context) {
        try {
            console.log('🔥 RageBait: Initializing sidebar views...');

            // Create view providers
            this.mainViewProvider = new RageBaitMainViewProvider(this.config, this);
            this.historyViewProvider = new RageBaitHistoryViewProvider(this.undoAction);
            this.statsViewProvider = new RageBaitStatsViewProvider(this.undoAction);

            // Register tree data providers
            vscode.window.registerTreeDataProvider('ragebait.mainView', this.mainViewProvider);
            vscode.window.registerTreeDataProvider('ragebait.historyView', this.historyViewProvider);
            vscode.window.registerTreeDataProvider('ragebait.statsView', this.statsViewProvider);

            console.log('✅ RageBait: Sidebar views registered successfully');

            // Listen for configuration changes to refresh views
            const configListener = vscode.workspace.onDidChangeConfiguration(event => {
                if (event.affectsConfiguration('ragebait')) {
                    this.refreshSidebarViews();
                }
            });

            context.subscriptions.push(configListener);

        } catch (error) {
            console.error('❌ RageBait: Failed to initialize sidebar views:', error);
            vscode.window.showErrorMessage(`Failed to initialize RageBait sidebar: ${error.message}`);
        }
    }

    /**
     * Refresh all sidebar views
     */
    refreshSidebarViews() {
        if (this.mainViewProvider) {
            this.mainViewProvider.refresh();
        }
        if (this.historyViewProvider) {
            this.historyViewProvider.refresh();
        }
        if (this.statsViewProvider) {
            this.statsViewProvider.refresh();
        }
    }

    /**
     * Start monitoring text changes for trigger words
     */
    startTextMonitoring() {
        this.textChangeListener = vscode.workspace.onDidChangeTextDocument(event => {
            if (!this.config.isEnabled() || this.isProcessingTrigger) {
                return;
            }

            // Check if this is a user edit (not programmatic)
            if (event.reason !== vscode.TextDocumentChangeReason.Undo && 
                event.reason !== vscode.TextDocumentChangeReason.Redo) {
                
                this.checkForTriggerWords(event);
            }
        });
    }

    /**
     * Check text changes for trigger words
     * @param {vscode.TextDocumentChangeEvent} event 
     */
    checkForTriggerWords(event) {
        const now = Date.now();
        
        // Apply cooldown to prevent rapid-fire triggers
        if (now - this.lastTriggerTime < this.triggerCooldown) {
            return;
        }

        const triggerWords = this.config.getTriggerWords();
        
        for (const change of event.contentChanges) {
            const text = change.text.toLowerCase();
            
            for (const triggerWord of triggerWords) {
                if (this.containsWord(text, triggerWord.toLowerCase())) {
                    console.log(`RageBait: Trigger word detected in typing: "${triggerWord}"`);
                    this.lastTriggerTime = now;
                    this.handleTrigger('typing', triggerWord, change.text);
                    return; // Only trigger once per change
                }
            }
        }
    }

    /**
     * Handle trigger word detection
     * @param {string} source - 'typing', 'speech', or 'manual'
     * @param {string} triggerWord - The word that triggered the action
     * @param {string} context - Additional context
     */
    async handleTrigger(source, triggerWord, context) {
        if (!this.config.isEnabled() || this.isProcessingTrigger) {
            return;
        }

        this.isProcessingTrigger = true;

        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('🔥 RageBait: No active editor found');
                return;
            }

            // Save state for undo
            this.undoAction.saveUndoState(editor, `trigger_${source}_${triggerWord}`, {
                source: source,
                triggerWord: triggerWord,
                context: context
            });

            // Determine action: destroy or fix (50/50 by default)
            const destructionChance = this.config.getDestructionChance();
            const shouldDestroy = Math.random() < destructionChance;

            console.log(`RageBait: Executing ${shouldDestroy ? 'destruction' : 'fix'} triggered by ${source}: "${triggerWord}"`);

            if (shouldDestroy) {
                await this.destructionCommands.executeRandomDestruction(editor);
                // Update stats
                if (this.statsViewProvider) {
                    this.statsViewProvider.updateStats('destruction', source);
                }
            } else {
                await this.executeRandomFix(editor);
                // Update stats
                if (this.statsViewProvider) {
                    this.statsViewProvider.updateStats('fix', source);
                }
            }

            // Refresh sidebar views after action
            this.refreshSidebarViews();

        } catch (error) {
            console.error('RageBait trigger handling error:', error);
            vscode.window.showErrorMessage(`🔥 RageBait trigger failed: ${error.message}`);
        } finally {
            this.isProcessingTrigger = false;
        }
    }

    /**
     * Execute random fix method
     * @param {vscode.TextEditor} editor 
     */
    async executeRandomFix(editor) {
        try {
            // Try AI-powered fix first
            await this.copilotFix.executeAIFix(editor);
        } catch (error) {
            console.error('AI fix failed, trying basic fixes:', error);
            
            try {
                // Fallback to basic fixes
                const success = await this.basicFixes.applyBasicFixes(editor);
                
                if (success && this.config.areNotificationsEnabled()) {
                    vscode.window.showInformationMessage(
                        '🔧 RageBait applied basic fixes',
                        'Undo',
                        'Settings'
                    ).then(selection => {
                        if (selection === 'Undo') {
                            vscode.commands.executeCommand('ragebait.panicUndo');
                        } else if (selection === 'Settings') {
                            vscode.commands.executeCommand('workbench.action.openSettings', 'ragebait');
                        }
                    });
                }
            } catch (basicError) {
                console.error('Basic fixes also failed:', basicError);
                vscode.window.showWarningMessage('🔧 RageBait: No fixes could be applied');
            }
        }
    }

    /**
     * Check if text contains a specific word (whole word match)
     * @param {string} text 
     * @param {string} word 
     * @returns {boolean}
     */
    containsWord(text, word) {
        // Handle multi-word triggers like "fix this"
        if (word.includes(' ')) {
            return text.includes(word);
        }
        
        // Single word - use word boundary matching
        const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(text);
    }

    /**
     * Deactivate the extension
     */
    deactivate() {
        console.log('🔥 RageBait extension is deactivating...');

        try {
            // Dispose of text change listener
            if (this.textChangeListener) {
                this.textChangeListener.dispose();
                this.textChangeListener = null;
            }

            // Dispose of speech recognition
            if (this.speechRecognition) {
                this.speechRecognition.dispose();
                this.speechRecognition = null;
            }

            console.log('🔥 RageBait extension deactivated');

        } catch (error) {
            console.error('RageBait deactivation error:', error);
        }
    }
}

// Global extension instance
let rageBaitExtension = null;

/**
 * Extension activation function
 * @param {vscode.ExtensionContext} context 
 */
async function activate(context) {
    rageBaitExtension = new RageBaitExtension();
    await rageBaitExtension.activate(context);
}

/**
 * Extension deactivation function
 */
function deactivate() {
    if (rageBaitExtension) {
        rageBaitExtension.deactivate();
        rageBaitExtension = null;
    }
}

module.exports = {
    activate,
    deactivate
};
