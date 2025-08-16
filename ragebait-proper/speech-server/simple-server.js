const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');


class SimpleSpeechServer {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });
        this.port = 3847;
        this.clients = new Set();
        this.isListening = false;
        this.triggerWords = [
            'ugh', 'shey', 'damn', 'thenga', 'ayyo', 'shit',
            'stupid', 'hate', 'why', 'oh no', 'noo', 'crash'
        ];
        this.confidenceThreshold = 0.7;
    }

    initialize() {
        this.setupExpress();
        this.setupWebSocket();
        this.startServer();
    }

    setupExpress() {
        this.app.use(express.static(path.join(__dirname, 'public')));

        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                isListening: this.isListening,
                clients: this.clients.size
            });
        });

        // Main UI
        this.app.get('/', (req, res) => {
            res.send(this.getWebUI());
        });
    }

    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log('🔥 New client connected');
            this.clients.add(ws);

            // Send current status
            ws.send(JSON.stringify({
                type: 'status',
                isListening: this.isListening,
                triggerWords: this.triggerWords,
                confidenceThreshold: this.confidenceThreshold
            }));

            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    this.handleMessage(ws, message);
                } catch (error) {
                    console.error('Invalid message:', error);
                }
            });

            ws.on('close', () => {
                console.log('🔥 Client disconnected');
                this.clients.delete(ws);
            });
        });
    }

    handleMessage(ws, message) {
        switch (message.type) {
            case 'start-listening':
                this.startListening();
                break;
            case 'stop-listening':
                this.stopListening();
                break;
            case 'speech-result':
                this.processSpeechResult(message.text, message.confidence);
                break;
        }
    }

    startListening() {
        this.isListening = true;
        console.log('🎤 Started listening for speech');
        this.broadcast({
            type: 'listening-started'
        });
    }

    stopListening() {
        this.isListening = false;
        console.log('🔇 Stopped listening for speech');
        this.broadcast({
            type: 'listening-stopped'
        });
    }

    processSpeechResult(text, confidence) {
        if (confidence < this.confidenceThreshold) {
            return;
        }

        console.log(`🗣️ Speech: "${text}" (confidence: ${confidence.toFixed(2)})`);

        // Check for trigger words
        const lowerText = text.toLowerCase();
        for (const triggerWord of this.triggerWords) {
            if (this.containsWord(lowerText, triggerWord.toLowerCase())) {
                console.log(`🔥 TRIGGER DETECTED: "${triggerWord}" in "${text}"`);
                
                this.broadcast({
                    type: 'trigger-detected',
                    triggerWord: triggerWord,
                    text: text,
                    confidence: confidence
                });
                break; // Only trigger once per speech result
            }
        }
    }

    containsWord(text, word) {
        if (word.includes(' ')) {
            return text.includes(word);
        }
        const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(text);
    }

    broadcast(message) {
        const data = JSON.stringify(message);
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    }

    getWebUI() {
        return `<!DOCTYPE html>
<html>
<head>
    <title>RageBait Speech Recognition</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #1e1e1e; color: #fff; }
        .container { max-width: 600px; margin: 0 auto; }
        .status { padding: 15px; margin: 10px 0; border-radius: 5px; font-weight: bold; }
        .listening { background: #4a5c2a; border: 2px solid #6a8c3a; }
        .stopped { background: #5c2a2a; border: 2px solid #8c3a3a; }
        .controls { margin: 20px 0; }
        button { padding: 10px 20px; margin: 5px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
        .start-btn { background: #4CAF50; color: white; }
        .stop-btn { background: #f44336; color: white; }
        .log { background: #2d2d2d; padding: 15px; border-radius: 5px; height: 300px; overflow-y: auto; font-family: monospace; }
        .trigger-words { margin: 15px 0; }
        .trigger-word { background: #444; padding: 3px 8px; margin: 2px; border-radius: 3px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔥 RageBait Speech Recognition</h1>
        
        <div id="status" class="status stopped">🔇 Speech Recognition: STOPPED</div>
        
        <div class="controls">
            <button class="start-btn" onclick="startListening()">🎤 Start Listening</button>
            <button class="stop-btn" onclick="stopListening()">🔇 Stop Listening</button>
        </div>
        
        <div class="trigger-words">
            <strong>Trigger Words:</strong>
            <div id="triggerWords"></div>
        </div>
        
        <div>
            <strong>Confidence Threshold:</strong> <span id="confidence">0.7</span>
        </div>
        
        <h3>Activity Log</h3>
        <div id="log" class="log"></div>
    </div>

    <script>
        const ws = new WebSocket('ws://localhost:3847');
        let recognition = null;
        let isRecognizing = false;

        ws.onopen = function() {
            log('✅ Connected to RageBait speech server');
        };

        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            handleServerMessage(data);
        };

        ws.onclose = function() {
            log('❌ Disconnected from server');
        };

        function initRecognition() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                log('❌ Speech Recognition not supported in this browser');
                return null;
            }

            const rec = new SpeechRecognition();
            rec.continuous = true;
            rec.interimResults = false;
            rec.lang = 'en-US';

            rec.onstart = () => {
                isRecognizing = true;
                log('🎤 Microphone started');
            };

            rec.onend = () => {
                isRecognizing = false;
                log('🔇 Microphone stopped');
                // Auto-restart if still supposed to be listening
                setTimeout(() => {
                    if (document.getElementById('status').classList.contains('listening') && !isRecognizing) {
                        try { rec.start(); } catch(e) {}
                    }
                }, 1000);
            };

            rec.onerror = (event) => {
                let errorMsg = '❌ Speech error: ' + event.error;
                switch(event.error) {
                    case 'not-allowed':
                        errorMsg += ' - Microphone permission denied. Please allow microphone access.';
                        break;
                    case 'no-speech':
                        errorMsg += ' - No speech detected. Try speaking louder or closer to microphone.';
                        break;
                    case 'audio-capture':
                        errorMsg += ' - Audio capture failed. Check if microphone is connected and working.';
                        break;
                    case 'network':
                        errorMsg += ' - Network error. Check internet connection.';
                        break;
                    case 'service-not-allowed':
                        errorMsg += ' - Speech service not allowed. Try using HTTPS or localhost.';
                        break;
                    case 'bad-grammar':
                        errorMsg += ' - Grammar error in speech recognition.';
                        break;
                    case 'language-not-supported':
                        errorMsg += ' - Language not supported. Using en-US.';
                        break;
                    default:
                        errorMsg += ' - Unknown error. Try refreshing the page.';
                }
                log(errorMsg);
            };

            rec.onresult = (event) => {
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        const text = result[0].transcript;
                        const confidence = result[0].confidence || 0.8;
                        log('🗣️ Heard: "' + text + '" (confidence: ' + confidence.toFixed(2) + ')');
                        ws.send(JSON.stringify({ type: 'speech-result', text, confidence }));
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
                    startRecognition();
                    break;
                case 'listening-stopped':
                    updateListeningStatus(false);
                    stopRecognition();
                    break;
                case 'trigger-detected':
                    log('🔥 TRIGGER: "' + data.triggerWord + '" in "' + data.text + '"');
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
                if (recognition && !isRecognizing) {
                    recognition.start();
                }
            } catch (e) {
                log('❌ Failed to start recognition: ' + e.message);
            }
        }

        function stopRecognition() {
            try {
                if (recognition && isRecognizing) {
                    recognition.stop();
                }
            } catch (e) {}
        }

        function log(message) {
            const logEl = document.getElementById('log');
            const timestamp = new Date().toLocaleTimeString();
            logEl.innerHTML += '[' + timestamp + '] ' + message + '\\n';
            logEl.scrollTop = logEl.scrollHeight;
        }

        // Auto-start recognition if server is already listening
        setTimeout(() => {
            if (document.getElementById('status').classList.contains('listening')) {
                startRecognition();
            }
        }, 1000);
    </script>
</body>
</html>`;
    }

    startServer() {
        this.server.listen(this.port, () => {
            console.log(`🔥 RageBait Speech Server running on http://localhost:${this.port}`);
            console.log(`🎤 Open the URL in Chrome/Edge to start speech recognition`);
        });
    }
}

// Start the server
const server = new SimpleSpeechServer();
server.initialize();
