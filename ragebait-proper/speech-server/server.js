const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');

/**
 * RageBait Speech Recognition Server
 * Provides speech recognition capabilities for the VS Code extension
 */
class RageBaitSpeechServer {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });
        this.port = 3847; // RAGE in phone keypad
        this.isListening = false;
        this.clients = new Set();
        this.triggerWords = [
            'ugh', 'ugh', 'damn', 'thenga', 'help', 'ayyo', 
            'shit', 'shey', 'stupid', 'hate', 'why', 'error', 'bug', 'crash'
        ];
        this.confidenceThreshold = 0.7;
        this.speechRecognition = null;
        this.microphoneStream = null;
        this.microphoneRecording = null;
    }

    /**
     * Initialize the server
     */
    async initialize() {
        this.setupExpress();
        this.setupWebSocket();
        this.setupSpeechRecognition();
        this.startServer();
    }

    /**
     * Setup Express middleware and routes
     */
    setupExpress() {
        this.app.use(cors());
        this.app.use(express.json());

        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                isListening: this.isListening,
                clients: this.clients.size,
                triggerWords: this.triggerWords.length
            });
        });

        // Configuration endpoints
        this.app.post('/config/trigger-words', (req, res) => {
            const { words } = req.body;
            if (Array.isArray(words)) {
                this.triggerWords = words;
                this.broadcastToClients({ type: 'config-updated', triggerWords: this.triggerWords });
                res.json({ success: true, triggerWords: this.triggerWords });
            } else {
                res.status(400).json({ error: 'Invalid trigger words format' });
            }
        });

        this.app.post('/config/confidence', (req, res) => {
            const { threshold } = req.body;
            if (typeof threshold === 'number' && threshold >= 0 && threshold <= 1) {
                this.confidenceThreshold = threshold;
                this.broadcastToClients({ type: 'config-updated', confidenceThreshold: this.confidenceThreshold });
                res.json({ success: true, confidenceThreshold: this.confidenceThreshold });
            } else {
                res.status(400).json({ error: 'Invalid confidence threshold' });
            }
        });

        // Speech control endpoints
        this.app.post('/speech/start', (req, res) => {
            this.startListening();
            res.json({ success: true, isListening: this.isListening });
        });

        this.app.post('/speech/stop', (req, res) => {
            this.stopListening();
            res.json({ success: true, isListening: this.isListening });
        });

        // Serve the speech recognition web interface
        this.app.get('/', (req, res) => {
            res.send(this.getWebInterface());
        });
    }

    /**
     * Setup WebSocket for real-time communication
     */
    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log('🔥 RageBait: Client connected to speech server');
            this.clients.add(ws);

            // Send current status to new client
            ws.send(JSON.stringify({
                type: 'status',
                isListening: this.isListening,
                triggerWords: this.triggerWords,
                confidenceThreshold: this.confidenceThreshold
            }));

            // Handle client messages
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    this.handleClientMessage(ws, data);
                } catch (error) {
                    console.error('Invalid message from client:', error);
                }
            });

            // Handle client disconnect
            ws.on('close', () => {
                console.log('🔥 RageBait: Client disconnected from speech server');
                this.clients.delete(ws);
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
                this.clients.delete(ws);
            });
        });
    }

    /**
     * Setup speech recognition using Web Speech API simulation
     */
    setupSpeechRecognition() {
        // This will be enhanced with actual speech recognition libraries
        console.log('🔥 RageBait: Speech recognition system initialized');
    }

    /**
     * Handle messages from WebSocket clients
     */
    handleClientMessage(ws, data) {
        switch (data.type) {
            case 'start-listening':
                this.startListening();
                break;
            case 'stop-listening':
                this.stopListening();
                break;
            case 'speech-result':
                this.processSpeechResult(data.text, data.confidence);
                break;
            case 'update-config':
                if (data.triggerWords) this.triggerWords = data.triggerWords;
                if (data.confidenceThreshold) this.confidenceThreshold = data.confidenceThreshold;
                break;
        }
    }

    /**
     * Start speech recognition
     */
    startListening() {
        if (this.isListening) return;

        this.isListening = true;
        console.log('🎤 RageBait: Started listening for speech...');
        
        this.broadcastToClients({
            type: 'listening-started',
            isListening: true
        });

        // Simulate speech recognition (in real implementation, this would use actual speech libraries)
        this.simulateSpeechRecognition();

        // Note: Server-side microphone recording disabled to avoid system dependency issues
        // Speech recognition is handled by the browser's Web Speech API
        console.log('🎤 RageBait: Server-side microphone recording disabled - using browser speech recognition');
    }

    /**
     * Stop speech recognition
     */
    stopListening() {
        if (!this.isListening) return;

        this.isListening = false;
        console.log('🔇 RageBait: Stopped listening for speech');
        
        this.broadcastToClients({
            type: 'listening-stopped',
            isListening: false
        });

        // Note: No server-side microphone to stop - using browser speech recognition
    }

    /**
     * Process speech recognition results
     */
    processSpeechResult(text, confidence) {
        console.log(`🎤 Speech recognized: "${text}" (confidence: ${confidence})`);

        if (confidence < this.confidenceThreshold) {
            console.log(`🔇 Confidence too low: ${confidence} < ${this.confidenceThreshold}`);
            return;
        }

        // Check for trigger words
        const lowerText = text.toLowerCase();
        for (const triggerWord of this.triggerWords) {
            if (this.containsWord(lowerText, triggerWord.toLowerCase())) {
                console.log(`🔥 Trigger word detected: "${triggerWord}"`);
                
                this.broadcastToClients({
                    type: 'trigger-detected',
                    triggerWord: triggerWord,
                    text: text,
                    confidence: confidence,
                    source: 'speech'
                });
                break;
            }
        }
    }

    /**
     * Check if text contains a specific word
     */
    containsWord(text, word) {
        if (word.includes(' ')) {
            return text.includes(word);
        }
        const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(text);
    }

    /**
     * Broadcast message to all connected clients
     */
    broadcastToClients(message) {
        const messageStr = JSON.stringify(message);
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(messageStr);
            }
        });
    }

    /**
     * Simulate speech recognition for testing
     */
    simulateSpeechRecognition() {
        // This is a placeholder - in real implementation, integrate with speech recognition libraries
        if (!this.isListening) return;

        // Simulate random speech detection for testing
        setTimeout(() => {
            if (this.isListening) {
                const testPhrases = [
                    'this code is ayyo ugh',
                    'help me thenga',
                    'damn this bug',
                    'ugh why is this not working'
                ];
                
                const randomPhrase = testPhrases[Math.floor(Math.random() * testPhrases.length)];
                const confidence = 0.8 + Math.random() * 0.2; // 0.8-1.0
                
                this.processSpeechResult(randomPhrase, confidence);
                
                // Continue simulation
                setTimeout(() => this.simulateSpeechRecognition(), 10000 + Math.random() * 20000);
            }
        }, 5000 + Math.random() * 10000);
    }

    /**
     * Get web interface HTML
     */
    getWebInterface() {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RageBait Speech Server</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #1e1e1e;
            color: #d4d4d4;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .status {
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            font-weight: bold;
        }
        .listening {
            background: #4a5c2a;
            border: 2px solid #6a8c3a;
        }
        .stopped {
            background: #5c2a2a;
            border: 2px solid #8c3a3a;
        }
        .controls {
            display: flex;
            gap: 10px;
            margin: 20px 0;
            justify-content: center;
        }
        button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        .start-btn {
            background: #4CAF50;
            color: white;
        }
        .stop-btn {
            background: #f44336;
            color: white;
        }
        .info {
            background: #2d2d30;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .trigger-words {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 10px;
        }
        .trigger-word {
            background: #007acc;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
        .log {
            background: #1e1e1e;
            border: 1px solid #3e3e42;
            padding: 15px;
            border-radius: 8px;
            height: 200px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔥 RageBait Speech Server</h1>
        <p>Node.js backend for VS Code extension speech recognition</p>
    </div>

    <div id="status" class="status stopped">
        🔇 Speech Recognition: STOPPED
    </div>

    <div class="controls">
        <button class="start-btn" onclick="startListening()">🎤 Start Listening</button>
        <button class="stop-btn" onclick="stopListening()">🔇 Stop Listening</button>
    </div>

    <div class="info">
        <h3>Configuration</h3>
        <p><strong>Clients Connected:</strong> <span id="clientCount">0</span></p>
        <p><strong>Confidence Threshold:</strong> <span id="confidence">0.7</span></p>
        <p><strong>Trigger Words:</strong></p>
        <div id="triggerWords" class="trigger-words"></div>
    </div>

    <div class="info">
        <h3>Activity Log</h3>
        <div id="log" class="log"></div>
    </div>

    <script>
        const ws = new WebSocket('ws://localhost:3847');
        
        ws.onopen = function() {
            log('Connected to RageBait speech server');
        };
        
        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            handleServerMessage(data);
        };
        
        ws.onclose = function() {
            log('Disconnected from server');
        };

        let recognition = null;
        let isRecognizing = false;

        function initRecognition() {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SR) {
                log('❌ Web Speech API not supported by this browser');
                return null;
            }
            const rec = new SR();
            rec.continuous = true;
            rec.interimResults = false;
            rec.lang = 'en-US';
            rec.onstart = () => { isRecognizing = true; log('🎤 Browser mic listening…'); };
            rec.onend = () => { isRecognizing = false; log('🔇 Browser mic stopped'); };
            rec.onerror = (e) => { log('❌ Speech error: ' + e.error); };
            rec.onresult = (event) => {
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        const text = result[0].transcript;
                        const confidence = result[0].confidence;
                        ws.send(JSON.stringify({ type: 'speech-result', text, confidence }));
                        log('🗣️ Heard: "' + text + '" (conf: ' + confidence.toFixed(2) + ')');
                    }
                }
            };
            return rec;
        }

        function handleServerMessage(data) {
            switch(data.type) {
                case 'status':
                    updateStatus(data);
                    break;
                case 'listening-started':
                    updateListeningStatus(true);
                    log('🎤 Started listening for speech');
                    startRecognition();
                    break;
                case 'listening-stopped':
                    updateListeningStatus(false);
                    log('🔇 Stopped listening for speech');
                    stopRecognition();
                    break;
                case 'trigger-detected':
                    log('🔥 TRIGGER: "' + data.triggerWord + '" in "' + data.text + '" (confidence: ' + data.confidence.toFixed(2) + ')');
                    break;
            }
        }
        
        function updateStatus(data) {
            updateListeningStatus(data.isListening);
            document.getElementById('confidence').textContent = data.confidenceThreshold;
            
            const wordsContainer = document.getElementById('triggerWords');
            wordsContainer.innerHTML = '';
            data.triggerWords.forEach(word => {
                const span = document.createElement('span');
                span.className = 'trigger-word';
                span.textContent = word;
                wordsContainer.appendChild(span);
            });
        }
        
        function updateListeningStatus(isListening) {
            const statusEl = document.getElementById('status');
            if (isListening) {
                statusEl.className = 'status listening';
                statusEl.textContent = '🎤 Speech Recognition: LISTENING';
            } else {
                statusEl.className = 'status stopped';
                statusEl.textContent = '🔇 Speech Recognition: STOPPED';
            }
        }
        
        function startListening() {
            ws.send(JSON.stringify({ type: 'start-listening' }));
        }
        
        function stopListening() {
            ws.send(JSON.stringify({ type: 'stop-listening' }));
        }

        function startRecognition() {
            try {
                if (!recognition) recognition = initRecognition();
                if (recognition && !isRecognizing) recognition.start();
            } catch (e) { log('❌ Failed to start recognition: ' + e.message); }
        }

        function stopRecognition() {
            try { if (recognition && isRecognizing) recognition.stop(); } catch (_) {}
        }

        function log(message) {
            const logEl = document.getElementById('log');
            const timestamp = new Date().toLocaleTimeString();
            logEl.innerHTML += \`[\${timestamp}] \${message}\\n\`;
            logEl.scrollTop = logEl.scrollHeight;
        }
    </script>
</body>
</html>`;
    }

    /**
     * Start the server
     */
    startServer() {
        this.server.listen(this.port, () => {
            console.log(`🔥 RageBait Speech Server running on http://localhost:${this.port}`);
            console.log(`🎤 WebSocket server ready for connections`);
            console.log(`🔧 Health check: http://localhost:${this.port}/health`);
        });
    }
}

// Initialize and start the server
const speechServer = new RageBaitSpeechServer();
speechServer.initialize().catch(console.error);