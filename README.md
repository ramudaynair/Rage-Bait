# 🔥 RageBait - The Ultimate Chaotic VS Code Extension

<div align="center">

![RageBait Logo](https://img.shields.io/badge/🔥-RageBait-red?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.3.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**A chaotic VS Code extension that monitors typing AND speech, then randomly destroys or fixes your code when trigger words are detected.**

⚠️ **EXTREME DANGER WARNING** ⚠️
**This extension will INSTANTLY and RANDOMLY destroy or fix your code without warning!**
**Always commit your work and use version control before activating RageBait!**

</div>

---
### Team Members
- Team Member 1: Ram U Nair
- Team Member 2: Reyhan Hazeem

## 🎯 What is RageBait?

RageBait is the most chaotic VS Code extension ever created. It monitors **both your typing AND speech** for trigger words, then **immediately** (no warnings, no countdowns, no mercy) either **destroys or fixes your code** with a 50/50 chance.

Think of it as a **digital Russian roulette** for your codebase - sometimes it saves you hours of debugging, sometimes it deletes your entire function. The thrill is in never knowing which one you'll get!

## 🚨 Core Features

### 🎯 Dual Trigger System
- **📝 Text Monitoring**: Detects trigger words as you type in real-time
- **🎤 Speech Recognition**: Listens to your microphone for spoken trigger words
- **⚡ Immediate Action**: No delays, progress bars, or warnings - instant chaos!
- **🎲 50/50 Chance**: Randomly destroys OR fixes your code

### 💥 Destruction Arsenal (Random Selection)
- **🎯 Random Line Deletion**: Obliterates 20-30% of random lines from your file
- **🔪 Function Destroyer**: Completely deletes the function where your cursor is located
- **💀 Selection Obliterator**: Vaporizes selected text or current line
- **⚔️ File Bisector**: Cuts your file in half (top or bottom, randomly chosen)

### 🛠️ AI-Powered Salvation (Priority Chain)
1. **🤖 GitHub Copilot Integration**: Uses Copilot API for intelligent fixes
2. **🧠 Google Gemini Integration**: Leverages Gemini AI for code improvements
3. **🔧 Smart Basic Fixes**: Auto-formatting, syntax error correction, missing semicolons
4. **📚 Language-Specific Fixes**: Tailored improvements for JS, Python, Java, C#, HTML, CSS, JSON, XML

### 🎛️ Professional Control Panel
- **🔥 Sidebar Integration**: Custom flame icon in VS Code activity bar
- **📊 Real-Time Dashboard**: Live status monitoring and statistics
- **🎮 Quick Actions**: One-click trigger, toggle, and emergency controls
- **📈 Usage Analytics**: Track destruction vs fix ratios and trigger sources
- **⚙️ Settings Overview**: View and modify configuration at a glance

## 🚀 Quick Start

### 📦 Installation

#### Option 1: From Release (Recommended)
1. Download `ragebait-1.3.0.vsix` from the [Releases](https://github.com/ramudaynair/Rage-Bait/releases) page
2. Open VS Code
3. Press `Ctrl+Shift+P` → "Extensions: Install from VSIX"
4. Select the downloaded `.vsix` file
5. Reload VS Code when prompted

#### Option 2: Build from Source
```bash
# Clone the repository
git clone https://github.com/ramudaynair/Rage-Bait.git
cd Rage-Bait

# Install dependencies
npm install
cd speech-server && npm install && cd ..

# Package the extension
npx vsce package

# Install in VS Code
code --install-extension ragebait-1.3.0.vsix
```

### 🎤 Speech Recognition Setup

#### 1. Start the Speech Server
```bash
# Easy way: Double-click the batch file
start-speech.bat

# Or manually:
cd speech-server
node simple-server.js
```

#### 2. Grant Microphone Permission
- Browser will auto-open to http://localhost:3847
- Click "Allow" when prompted for microphone access (first time only)
- Click "🎤 Start Listening" in the web interface

#### 3. Test It!
- Open any code file in VS Code
- Say or type trigger words like: "ugh", "fix this", "broken", "damn"
- Watch RageBait instantly destroy or fix your code! 🔥

### ⚡ Instant Usage
1. **Enable RageBait**: Extension activates automatically on VS Code startup
2. **Open the sidebar**: Click the 🔥 flame icon in the left activity bar
3. **Start coding**: Type trigger words and experience the chaos
4. **Emergency escape**: `Ctrl+Shift+P` → "🚨 Panic Undo (5x)" for instant salvation

## 🎮 Usage

### Default Trigger Words
```
"ugh", "ugh", "damn", "fix this", "help", "broken", 
"shit", "ayyo", "stupid", "hate", "why", "error", "bug", "crash"
```

### Commands
- `🔥 RageBait Trigger` - Manually trigger an action
- `🔄 Toggle RageBait` - Enable/disable the extension
- `🎤 Toggle Speech Recognition` - Enable/disable speech monitoring
- `🚨 Panic Undo (5x)` - Emergency undo multiple actions
- `⚙️ RageBait Settings` - Open settings

### Using the Sidebar
1. **Access the Control Panel**: Click the flame icon (🔥) in the VS Code activity bar (left sidebar)
2. **Monitor Status**: See real-time extension and speech recognition status
3. **Quick Actions**: Use the sidebar buttons for instant trigger, toggle, and undo
4. **Browse History**: View recent actions in the "Undo History" section
5. **Check Statistics**: Monitor your chaos vs fix ratio in the "Statistics" section
6. **One-Click Settings**: Click any configuration item to open settings

### Speech Recognition Setup
1. Allow microphone permissions when prompted
2. The extension will automatically start listening
3. Speak trigger words naturally - the extension will detect them
4. Check the status bar for speech recognition status

## Screenshots

<img width="1852" height="1032" alt="Screenshot 2025-08-15 082228" src="https://github.com/user-attachments/assets/c8f6cdc1-f823-4394-ab91-465bb748c895" />
<img width="1843" height="1031" alt="Screenshot 2025-08-15 081957" src="https://github.com/user-attachments/assets/77e2204a-8bc0-4286-9f1f-ef0b22250a36" />
<img width="1918" height="1030" alt="Screenshot 2025-08-15 081921" src="https://github.com/user-attachments/assets/4d63a458-f8c8-45a5-ae84-7ee1ed091863" />

## ⚙️ Configuration

Access settings via `File > Preferences > Settings` and search for "RageBait":

### Core Settings
- **Enable Extension**: Turn RageBait on/off
- **Enable Speech Recognition**: Control microphone monitoring
- **Trigger Words**: Customize the words that trigger actions
- **Destruction Chance**: Adjust the probability (0.0 = always fix, 1.0 = always destroy)

### Advanced Settings
- **Speech Confidence Threshold**: Minimum confidence for speech recognition (0.0-1.0)
- **Gemini API Key**: Your Google Gemini API key for AI fixes
- **Max Destruction Lines**: Limit how many lines can be destroyed
- **Enable Notifications**: Show/hide action notifications

## 🤖 AI Integration

### GitHub Copilot
- Automatically detected if Copilot extension is installed
- Used for intelligent code fixes and suggestions
- No additional setup required

### Google Gemini
1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to RageBait settings: `ragebait.geminiApiKey`
3. RageBait will use Gemini for code analysis and fixes

## 🛡️ Safety Features

### Undo System
- **Automatic State Saving**: Every action is saved for undo
- **Panic Undo**: Quickly undo multiple actions
- **Undo History**: View and selectively restore previous states
- **Export History**: Save undo history for debugging

### Error Handling
- Graceful fallbacks for all features
- No crashes under any circumstances
- Proper cleanup on deactivation
- API timeout handling

## 🎯 Examples

### Typing Trigger
```javascript
// You type: "This code is broken ugh"
// RageBait detects "ugh" and either:
// 1. Destroys random lines, or
// 2. Fixes your code with AI
```

### Speech Trigger
```
// You say: "Why is this bug so stupid?"
// RageBait detects "stupid" and "bug" and takes action
```

### Manual Trigger
```
// Press Ctrl+Shift+P → "🔥 RageBait Trigger"
// Immediately executes random action
```

## 🔧 Troubleshooting

### Speech Recognition Issues
- **Permission Denied**: Allow microphone access in browser/OS settings
- **Not Working**: Check if your browser supports Web Speech API
- **Low Accuracy**: Adjust confidence threshold in settings

### Extension Not Triggering
- Check if RageBait is enabled in settings
- Verify trigger words are spelled correctly
- Ensure you're typing complete words (not partial matches)

### Undo Not Working
- Use "🚨 Panic Undo" command from Command Palette
- Check undo history with "RageBait: Show Undo History"
- Verify the file hasn't been closed/reopened

## 🚀 Development

### Building from Source
```bash
npm install
npm run compile
vsce package
```

### Testing
```bash
npm test
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 Changelog

### v1.0.0
- Initial release
- Dual text and speech trigger system
- Four destruction methods
- AI-powered fixes with Copilot and Gemini
- Emergency undo system
- Comprehensive configuration options

## ⚖️ License

MIT License - Use at your own risk!

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/ragebait-dev/ragebait-vscode/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ragebait-dev/ragebait-vscode/discussions)

## 🎭 Disclaimer

RageBait is designed for entertainment and experimental purposes. While it includes safety features like undo functionality, you should always:

1. **Commit your work** before using RageBait
2. **Use version control** for important projects
3. **Test in safe environments** before using on production code
4. **Keep backups** of critical files

The developers are not responsible for any code loss or damage caused by using this extension. Use responsibly and have fun!

---
## Team Contributions
- **Ramudaynair**: Project lead, VS Code extension development, speech recognition system, 
- **Reyhan Hazeem**: Speech recognition system, web interface design, documentation,AI integration,documentation

**Remember**: RageBait is chaos incarnate. It will test your reflexes, your backup strategies, and your sanity. But hey, at least it might fix your code 50% of the time! 🔥
