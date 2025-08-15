const vscode = require('vscode');
const WebSocket = require('ws');

/**
 * Simple speech client that connects to the speech server
 */
class SimpleSpeechClient {
    constructor(config, onTrigger) {
        this.config = config;
        this.onTrigger = onTrigger;
        this.ws = null;
        this.statusBarItem = null;
        this.isConnected = false;
        this.reconnectTimer = null;
    }

    async initialize() {
        this.createStatusBar();
        this.connectToServer();
    }

    createStatusBar() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right, 
            100
        );
        this.statusBarItem.command = 'ragebait.openSpeechUI';
        this.statusBarItem.text = '🎤 RageBait Speech: Connecting...';
        this.statusBarItem.tooltip = 'Click to open Speech UI';
        this.statusBarItem.show();
    }

    connectToServer() {
        try {
            this.ws = new WebSocket('ws://localhost:3847');
            
            this.ws.on('open', () => {
                this.isConnected = true;
                this.statusBarItem.text = '🎤 RageBait Speech: Connected';
                console.log('🔥 Connected to RageBait speech server');
                
                // Request to start listening
                this.ws.send(JSON.stringify({ type: 'start-listening' }));
            });

            this.ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    this.handleMessage(message);
                } catch (error) {
                    console.error('Error parsing speech message:', error);
                }
            });

            this.ws.on('close', () => {
                this.isConnected = false;
                this.statusBarItem.text = '🎤 RageBait Speech: Disconnected';
                console.log('🔥 Disconnected from speech server');
                
                // Try to reconnect after 3 seconds
                if (this.reconnectTimer) {
                    clearTimeout(this.reconnectTimer);
                }
                this.reconnectTimer = setTimeout(() => {
                    this.connectToServer();
                }, 3000);
            });

            this.ws.on('error', (error) => {
                console.error('Speech WebSocket error:', error);
                this.statusBarItem.text = '🎤 RageBait Speech: Error';
            });

        } catch (error) {
            console.error('Failed to connect to speech server:', error);
            this.statusBarItem.text = '🎤 RageBait Speech: Failed';
        }
    }

    handleMessage(message) {
        switch (message.type) {
            case 'trigger-detected':
                console.log(`🔥 Speech trigger detected: "${message.triggerWord}" in "${message.text}"`);
                if (this.onTrigger) {
                    this.onTrigger('speech', message.triggerWord, message.text);
                }
                break;
            
            case 'listening-started':
                this.statusBarItem.text = '🎤 RageBait Speech: Listening';
                break;
                
            case 'listening-stopped':
                this.statusBarItem.text = '🎤 RageBait Speech: Stopped';
                break;
                
            default:
                console.log('Unknown speech message:', message);
        }
    }

    startListening() {
        if (this.ws && this.isConnected) {
            this.ws.send(JSON.stringify({ type: 'start-listening' }));
        }
    }

    stopListening() {
        if (this.ws && this.isConnected) {
            this.ws.send(JSON.stringify({ type: 'stop-listening' }));
        }
    }

    dispose() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        
        if (this.statusBarItem) {
            this.statusBarItem.dispose();
            this.statusBarItem = null;
        }
    }
}

module.exports = SimpleSpeechClient;
