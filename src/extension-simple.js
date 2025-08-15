const vscode = require('vscode');

/**
 * Simple test version of RageBait extension to debug activation issues
 */

/**
 * Extension activation function
 * @param {vscode.ExtensionContext} context 
 */
async function activate(context) {
    console.log('🔥 RageBait SIMPLE extension is activating...');
    
    try {
        // Show activation message
        vscode.window.showInformationMessage('🔥 RageBait Simple is starting up...');

        // Register basic commands first
        const commands = [
            vscode.commands.registerCommand('ragebait.showSettings', () => {
                console.log('🔥 RageBait: Opening settings...');
                vscode.commands.executeCommand('workbench.action.openSettings', 'ragebait');
            }),

            vscode.commands.registerCommand('ragebait.trigger', () => {
                console.log('🔥 RageBait: Manual trigger activated');
                vscode.window.showInformationMessage('🔥 RageBait triggered manually!');
            }),

            vscode.commands.registerCommand('ragebait.toggle', () => {
                console.log('🔥 RageBait: Toggle command executed');
                vscode.window.showInformationMessage('🔄 RageBait toggled!');
            }),

            vscode.commands.registerCommand('ragebait.toggleSpeech', () => {
                console.log('🔥 RageBait: Speech toggle command executed');
                vscode.window.showInformationMessage('🎤 Speech recognition toggled!');
            }),

            vscode.commands.registerCommand('ragebait.panicUndo', () => {
                console.log('🔥 RageBait: Panic undo command executed');
                vscode.window.showInformationMessage('🚨 Panic undo executed!');
            })
        ];

        // Register all commands
        commands.forEach((command, index) => {
            try {
                context.subscriptions.push(command);
                console.log(`✅ Registered command ${index + 1}/${commands.length}`);
            } catch (error) {
                console.error(`❌ Failed to register command ${index + 1}:`, error);
                vscode.window.showErrorMessage(`Failed to register command: ${error.message}`);
            }
        });

        console.log(`🔥 RageBait Simple: Successfully registered ${commands.length} commands`);
        
        // Show success message
        vscode.window.showInformationMessage('🔥 RageBait Simple is now active!', 'Test Settings', 'Test Trigger')
            .then(selection => {
                if (selection === 'Test Settings') {
                    vscode.commands.executeCommand('ragebait.showSettings');
                } else if (selection === 'Test Trigger') {
                    vscode.commands.executeCommand('ragebait.trigger');
                }
            });

        console.log('🔥 RageBait Simple extension activated successfully');

    } catch (error) {
        console.error('RageBait Simple activation error:', error);
        vscode.window.showErrorMessage(`🔥 RageBait Simple failed to activate: ${error.message}`, 'Show Details')
            .then(selection => {
                if (selection === 'Show Details') {
                    vscode.window.showErrorMessage(`Error details: ${error.stack || error.toString()}`);
                }
            });
    }
}

/**
 * Extension deactivation function
 */
function deactivate() {
    console.log('🔥 RageBait Simple extension deactivated');
}

module.exports = {
    activate,
    deactivate
};
