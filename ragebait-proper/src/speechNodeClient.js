const vscode = require('vscode');
const WebSocket = require('ws');
const axios = require('axios');
const path = require('path');
const { spawn } = require('child_process');

/**
 * Node-backed speech client that connects to local speech server
 */
class SpeechNodeClient {
    constructor(config, onTrigger) {
        this.config = config;
        this.onTrigger = onTrigger;
        this.ws = null;
        this.reconnectInterval = 3000;
        this.statusBarItem = null;
        this.serverProcess = null;
        this.port = 3847;
        this.disposed = false;
    }

    async initialize(context) {
        try {
            this.port = (this.config.getConfig && this.config.getConfig().get('speechServerPort')) || 3847;
        } catch (_) {}
        this.createStatusBar();
        await this.ensureServerRunning(context);
        await this.connectWebSocket();
    }

    createStatusBar() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'ragebait.openSpeechUI';
        this.updateStatusBar(false);
        this.statusBarItem.show();
    }

    updateStatusBar(connected) {
        if (!this.statusBarItem) return;
        this.statusBarItem.text = connected ? '🎤 RageBait Speech: Connected' : '🎤 RageBait Speech: Connecting…';
        this.statusBarItem.tooltip = 'Open Speech UI';
    }

    async ensureServerRunning(context) {
        const baseUrl = `http://localhost:${this.port}`;
        try {
            const resp = await axios.get(`${baseUrl}/health`, { timeout: 1500 });
            if (resp.data && resp.data.status === 'ok') {
                return;
            }
        } catch (_) {}

        // Ask to start server
        const choice = await vscode.window.showInformationMessage(
            'RageBait Speech Server is not running. Start it now?',
            'Start Server',
            'Open UI',
            'Cancel'
        );
        if (choice === 'Open UI') {
            await vscode.env.openExternal(vscode.Uri.parse(baseUrl));
        }
        if (choice !== 'Start Server') return;

        // Try to start server via node
        const serverScript = path.join(context.extensionPath, 'speech-server', 'server.js');
        const cwd = path.dirname(serverScript);
        // Start without blocking VS Code (user may need to install deps manually)
        this.serverProcess = spawn(process.execPath, [serverScript], {
            cwd,
            detached: true,
            stdio: 'ignore'
        });
        this.serverProcess.unref();

        // Wait briefly for server to come up
        await new Promise(r => setTimeout(r, 1000));
    }

    async connectWebSocket() {
        if (this.disposed) return;
        const url = `ws://localhost:${this.port}`;
        try {
            this.ws = new WebSocket(url);
            this.ws.on('open', () => {
                this.updateStatusBar(true);
                // Request server to start listening
                this.ws.send(JSON.stringify({ type: 'start-listening' }));
            });
            this.ws.on('message', (data) => {
                try {
                    const msg = JSON.parse(data.toString());
                    this.handleServerMessage(msg);
                } catch (e) {
                    console.error('Invalid WS message', e);
                }
            });
            this.ws.on('close', () => {
                this.updateStatusBar(false);
                if (!this.disposed) setTimeout(() => this.connectWebSocket(), this.reconnectInterval);
            });
            this.ws.on('error', (err) => {
                console.error('WS error:', err.message);
            });
        } catch (err) {
            console.error('WS connect error:', err.message);
            setTimeout(() => this.connectWebSocket(), this.reconnectInterval);
        }
    }

    handleServerMessage(msg) {
        switch (msg.type) {
            case 'trigger-detected':
                if (this.onTrigger) {
                    this.onTrigger('speech', msg.triggerWord, msg.text);
                }
                break;
        }
    }

    async dispose() {
        this.disposed = true;
        try {
            if (this.ws) {
                this.ws.terminate();
                this.ws = null;
            }
        } catch (_) {}
        try {
            if (this.statusBarItem) {
                this.statusBarItem.dispose();
                this.statusBarItem = null;
            }
        } catch (_) {}
    }
}

module.exports = SpeechNodeClient;
