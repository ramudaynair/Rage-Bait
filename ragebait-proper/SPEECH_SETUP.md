# 🎤 RageBait Speech Recognition Setup

## Quick Start (3 steps)

### 1. Install Speech Server Dependencies
```bash
cd ragebait-proper/speech-server
npm install
```

### 2. Start the Speech Server
**Option A: Use the batch file (Windows)**
```bash
# Double-click start-speech.bat
# OR run in terminal:
start-speech.bat
```

**Option B: Manual start**
```bash
cd speech-server
node simple-server.js
```

### 3. Grant Microphone Permission
- The extension will auto-open http://localhost:3847 in your browser
- Click "Allow" when prompted for microphone access
- Click "🎤 Start Listening" 
- Speak a trigger word like "ugh", "fix this", "broken", "damn"

## How It Works

1. **Speech Server**: Runs on localhost:3847, serves a web UI with microphone access
2. **Browser Recognition**: Uses your browser's built-in speech recognition (Chrome/Edge recommended)
3. **WebSocket Communication**: Forwards speech results to VS Code extension
4. **Instant Triggers**: When trigger words are detected, RageBait immediately destroys or fixes your code

## Trigger Words (Default)
- "ugh", "ugh", "damn", "fix this", "help", "broken"
- "shit", "ayyo", "stupid", "hate", "why", "error", "bug", "crash"

## Troubleshooting

### Speech Server Won't Start
- Make sure Node.js is installed
- Run `npm install` in the speech-server directory
- Check if port 3847 is already in use

### Microphone Not Working
- Use Chrome or Edge browser (Firefox has limited support)
- Make sure no other app is using your microphone
- Check browser permissions: Settings → Privacy → Microphone

### No Triggers Detected
- Speak clearly and wait for the "🗣️ Heard:" message in the log
- Check that trigger words are spelled correctly
- Adjust confidence threshold if needed (default: 0.7)

### Extension Not Responding
- Check VS Code Developer Console for errors
- Make sure RageBait extension is enabled
- Verify WebSocket connection in browser (should show "✅ Connected")

## Settings

You can customize RageBait speech behavior in VS Code Settings:

- `ragebait.autoOpenSpeechUI`: Auto-open speech UI on startup (default: true)
- `ragebait.speechEnabled`: Enable/disable speech recognition
- `ragebait.triggerWords`: Customize trigger words
- `ragebait.destructionChance`: Adjust destruction vs fix probability

## Advanced Usage

### Custom Trigger Words
1. Open VS Code Settings
2. Search for "ragebait"
3. Edit "Trigger Words" array
4. Restart speech recognition

### Disable Auto-Open
If you don't want the speech UI to open automatically:
1. VS Code Settings → RageBait
2. Uncheck "Auto Open Speech UI"
3. Use Command Palette → "RageBait: Open Speech UI" when needed

## Security Notes

- Speech recognition runs locally in your browser
- No audio data is sent to external servers
- All processing happens on your machine
- WebSocket communication is local (localhost only)
