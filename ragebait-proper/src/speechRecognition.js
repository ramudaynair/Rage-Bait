const vscode = require('vscode');

/**
 * Speech recognition system using webview and HTML5 Speech Recognition API
 */
class SpeechRecognition {
    constructor(config, onTriggerCallback) {
        this.config = config;
        this.onTriggerCallback = onTriggerCallback;
        this.webviewPanel = null;
        this.isListening = false;
        this.statusBarItem = null;
        this.lastRecognitionTime = 0;
        this.recognitionCooldown = 1000; // 1 second cooldown between recognitions
    }

    /**
     * Initialize speech recognition
     */
    async initialize() {
        this.createStatusBarItem();
        
        if (this.config.isSpeechEnabled()) {
            await this.startListening();
        }
    }

    /**
     * Create status bar item for speech recognition
     */
    createStatusBarItem() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right, 
            100
        );
        this.statusBarItem.command = 'ragebait.toggleSpeech';
        this.updateStatusBar();
        this.statusBarItem.show();
    }

    /**
     * Update status bar display
     */
    updateStatusBar() {
        if (!this.statusBarItem) return;

        if (this.config.isSpeechEnabled()) {
            if (this.isListening) {
                this.statusBarItem.text = '🎤 RageBait Listening';
                this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
                this.statusBarItem.tooltip = 'RageBait is listening for trigger words. Click to disable.';
            } else {
                this.statusBarItem.text = '🎤 RageBait Ready';
                this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
                this.statusBarItem.tooltip = 'RageBait speech recognition is ready. Click to disable.';
            }
        } else {
            this.statusBarItem.text = '🔇 RageBait Muted';
            this.statusBarItem.backgroundColor = undefined;
            this.statusBarItem.tooltip = 'RageBait speech recognition is disabled. Click to enable.';
        }
    }

    /**
     * Start speech recognition
     */
    async startListening() {
        if (!this.config.isSpeechEnabled()) {
            return;
        }

        try {
            if (this.webviewPanel) {
                this.webviewPanel.dispose();
            }

            this.webviewPanel = vscode.window.createWebviewPanel(
                'rageBaitSpeech',
                'RageBait Speech Recognition',
                { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    localResourceRoots: []
                }
            );

            this.webviewPanel.webview.html = this.getWebviewContent();
            this.setupWebviewMessageHandling();

            // Auto-hide the webview panel
            setTimeout(() => {
                if (this.webviewPanel) {
                    this.webviewPanel.dispose();
                    this.webviewPanel = null;
                }
            }, 1000);

            this.isListening = true;
            this.updateStatusBar();

        } catch (error) {
            console.error('Error starting speech recognition:', error);
            vscode.window.showErrorMessage(`🎤 Failed to start speech recognition: ${error.message}`);
        }
    }

    /**
     * Stop speech recognition
     */
    stopListening() {
        if (this.webviewPanel) {
            this.webviewPanel.dispose();
            this.webviewPanel = null;
        }

        this.isListening = false;
        this.updateStatusBar();
    }

    /**
     * Toggle speech recognition
     */
    async toggleSpeechRecognition() {
        const newState = !this.config.isSpeechEnabled();
        await this.config.setSpeechEnabled(newState);

        if (newState) {
            await this.startListening();
            vscode.window.showInformationMessage('🎤 RageBait speech recognition enabled');
        } else {
            this.stopListening();
            vscode.window.showInformationMessage('🔇 RageBait speech recognition disabled');
        }

        this.updateStatusBar();
    }

    /**
     * Setup message handling from webview
     */
    setupWebviewMessageHandling() {
        if (!this.webviewPanel) return;

        this.webviewPanel.webview.onDidReceiveMessage(
            message => {
                switch (message.type) {
                    case 'speechResult':
                        this.handleSpeechResult(message.text, message.confidence);
                        break;
                    case 'speechError':
                        this.handleSpeechError(message.error);
                        break;
                    case 'speechStart':
                        this.isListening = true;
                        this.updateStatusBar();
                        break;
                    case 'speechEnd':
                        this.isListening = false;
                        this.updateStatusBar();
                        // Restart listening after a short delay
                        setTimeout(() => {
                            if (this.config.isSpeechEnabled()) {
                                this.startListening();
                            }
                        }, 2000);
                        break;
                }
            },
            undefined
        );

        this.webviewPanel.onDidDispose(() => {
            this.webviewPanel = null;
            this.isListening = false;
            this.updateStatusBar();
        });
    }

    /**
     * Handle speech recognition result
     * @param {string} text 
     * @param {number} confidence 
     */
    handleSpeechResult(text, confidence) {
        const now = Date.now();
        
        // Apply cooldown to prevent rapid-fire triggers
        if (now - this.lastRecognitionTime < this.recognitionCooldown) {
            return;
        }

        const threshold = this.config.getSpeechConfidenceThreshold();
        
        if (confidence < threshold) {
            console.log(`RageBait: Speech confidence too low: ${confidence} < ${threshold}`);
            return;
        }

        console.log(`RageBait: Speech recognized: "${text}" (confidence: ${confidence})`);

        // Check for trigger words
        const triggerWords = this.config.getTriggerWords();
        const lowerText = text.toLowerCase();
        
        for (const triggerWord of triggerWords) {
            if (this.containsWord(lowerText, triggerWord.toLowerCase())) {
                console.log(`RageBait: Trigger word detected in speech: "${triggerWord}"`);
                this.lastRecognitionTime = now;
                
                if (this.onTriggerCallback) {
                    this.onTriggerCallback('speech', triggerWord, text);
                }
                break;
            }
        }
    }

    /**
     * Handle speech recognition error
     * @param {string} error 
     */
    handleSpeechError(error) {
        console.error('Speech recognition error:', error);
        
        if (error.includes('not-allowed') || error.includes('permission')) {
            vscode.window.showErrorMessage(
                '🎤 RageBait: Microphone permission denied. Please allow microphone access.',
                'Settings'
            ).then(selection => {
                if (selection === 'Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'ragebait');
                }
            });
        } else if (error.includes('network')) {
            vscode.window.showWarningMessage('🎤 RageBait: Speech recognition network error. Retrying...');
            // Retry after a delay
            setTimeout(() => {
                if (this.config.isSpeechEnabled()) {
                    this.startListening();
                }
            }, 5000);
        }
    }

    /**
     * Check if text contains a specific word (whole word match)
     * @param {string} text 
     * @param {string} word 
     * @returns {boolean}
     */
    containsWord(text, word) {
        const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(text);
    }

    /**
     * Get webview HTML content
     * @returns {string}
     */
    getWebviewContent() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RageBait Speech Recognition</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 400px;
            margin: 0 auto;
            text-align: center;
        }
        .status {
            font-size: 18px;
            margin: 20px 0;
            padding: 10px;
            border-radius: 5px;
        }
        .listening {
            background-color: var(--vscode-inputValidation-warningBackground);
            color: var(--vscode-inputValidation-warningForeground);
        }
        .ready {
            background-color: var(--vscode-inputValidation-infoBackground);
            color: var(--vscode-inputValidation-infoForeground);
        }
        .error {
            background-color: var(--vscode-inputValidation-errorBackground);
            color: var(--vscode-inputValidation-errorForeground);
        }
        .controls {
            margin: 20px 0;
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 20px;
            margin: 5px;
            border-radius: 3px;
            cursor: pointer;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .transcript {
            margin-top: 20px;
            padding: 10px;
            background-color: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 3px;
            min-height: 100px;
            text-align: left;
            font-family: monospace;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>🎤 RageBait Speech Recognition</h2>
        <div id="status" class="status ready">Ready to listen...</div>
        
        <div class="controls">
            <button onclick="startListening()">Start Listening</button>
            <button onclick="stopListening()">Stop Listening</button>
        </div>
        
        <div id="transcript" class="transcript">
            Waiting for speech...
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let recognition = null;
        let isListening = false;

        function updateStatus(message, className) {
            const statusEl = document.getElementById('status');
            statusEl.textContent = message;
            statusEl.className = 'status ' + className;
        }

        function addToTranscript(text, confidence) {
            const transcriptEl = document.getElementById('transcript');
            const timestamp = new Date().toLocaleTimeString();
            transcriptEl.innerHTML += \`<div>[\${timestamp}] \${text} (confidence: \${confidence.toFixed(2)})</div>\`;
            transcriptEl.scrollTop = transcriptEl.scrollHeight;
        }

        function initSpeechRecognition() {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                updateStatus('Speech recognition not supported in this browser', 'error');
                vscode.postMessage({
                    type: 'speechError',
                    error: 'Speech recognition not supported'
                });
                return false;
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = function() {
                isListening = true;
                updateStatus('🎤 Listening for trigger words...', 'listening');
                vscode.postMessage({ type: 'speechStart' });
            };

            recognition.onresult = function(event) {
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        const text = result[0].transcript;
                        const confidence = result[0].confidence;
                        
                        addToTranscript(text, confidence);
                        
                        vscode.postMessage({
                            type: 'speechResult',
                            text: text,
                            confidence: confidence
                        });
                    }
                }
            };

            recognition.onerror = function(event) {
                updateStatus('Error: ' + event.error, 'error');
                vscode.postMessage({
                    type: 'speechError',
                    error: event.error
                });
            };

            recognition.onend = function() {
                isListening = false;
                updateStatus('Speech recognition ended', 'ready');
                vscode.postMessage({ type: 'speechEnd' });
            };

            return true;
        }

        function startListening() {
            if (!recognition && !initSpeechRecognition()) {
                return;
            }

            if (!isListening) {
                try {
                    recognition.start();
                } catch (error) {
                    updateStatus('Failed to start: ' + error.message, 'error');
                    vscode.postMessage({
                        type: 'speechError',
                        error: error.message
                    });
                }
            }
        }

        function stopListening() {
            if (recognition && isListening) {
                recognition.stop();
            }
        }

        // Auto-start when page loads
        window.addEventListener('load', function() {
            setTimeout(startListening, 1000);
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // Page is hidden, but keep listening
            } else {
                // Page is visible again
                if (!isListening) {
                    startListening();
                }
            }
        });
    </script>
</body>
</html>`;
    }

    /**
     * Dispose of resources
     */
    dispose() {
        if (this.webviewPanel) {
            this.webviewPanel.dispose();
            this.webviewPanel = null;
        }

        if (this.statusBarItem) {
            this.statusBarItem.dispose();
            this.statusBarItem = null;
        }

        this.isListening = false;
    }
}

module.exports = SpeechRecognition;
