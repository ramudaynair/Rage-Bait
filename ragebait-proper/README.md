# 🔥 RageBait - The Chaotic VS Code Extension

[![GitHub](https://img.shields.io/badge/GitHub-ramudaynair%2FRage--Bait-orange?style=for-the-badge&logo=github)](https://github.com/ramudaynair/Rage-Bait)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-green?style=for-the-badge&logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=ragebait-dev.ragebait)

> ⚠️ **DANGER WARNING** ⚠️
> This extension will randomly DESTROY or FIX your code when you type or speak trigger words.
> Use at your own risk! Always commit your work before using RageBait!

## 🎯 What is RageBait?

RageBait is a chaotic VS Code extension that monitors both your typing AND speech for trigger words, then immediately (no warnings, no countdowns) either destroys or fixes your code with a 50/50 chance. It's designed to add an element of unpredictable chaos to your coding experience while occasionally being genuinely helpful.

## 🚨 Features

### Dual Trigger System
- **Text Monitoring**: Detects trigger words as you type
- **Speech Recognition**: Listens to your microphone for spoken trigger words
- **Immediate Action**: No delays, progress bars, or warnings - instant chaos!

### Destruction Methods (Random Selection)
- **Random Line Deletion**: Deletes 20-30% of random lines from your file
- **Function Destroyer**: Deletes the entire function where your cursor is located
- **Selection Obliterator**: Deletes selected text or current line if nothing is selected
- **File Bisector**: Deletes either the top or bottom half of your file

### Fix Methods (Priority Order)
1. **GitHub Copilot Integration**: Uses Copilot API if available
2. **Google Gemini Integration**: Uses Gemini API if API key is provided
3. **Basic Code Fixes**: Format code, fix syntax errors, add missing semicolons
4. **Language-Specific Fixes**: Tailored improvements based on file type

### Emergency Safety Features
- **Panic Undo**: Instantly undo the last 5 actions with `Ctrl+Shift+P` → "🚨 Panic Undo (5x)"
- **Undo History**: View and selectively undo previous actions
- **Configurable Settings**: Adjust destruction chance, trigger words, and more

### Sidebar Control Panel
- **RageBait Icon**: Click the flame icon (🔥) in the left sidebar to access the control panel
- **Status Monitoring**: Real-time display of extension and speech recognition status
- **Quick Actions**: One-click trigger, toggle, and undo buttons
- **Undo History**: Browse and restore previous states directly from the sidebar
- **Statistics**: Track your destruction vs fix ratio and trigger sources
- **Configuration Info**: View current settings at a glance

## 📦 Installation

### From VSIX Package
1. Download the latest `.vsix` file from releases
2. Open VS Code
3. Press `Ctrl+Shift+P` and type "Extensions: Install from VSIX"
4. Select the downloaded `.vsix` file

### From Source
```bash
git clone https://github.com/ramudaynair/Rage-Bait.git
cd Rage-Bait/ragebait-proper
npm install
vsce package
code --install-extension ragebait-1.3.1.vsix
```

## 🎮 Usage

### Default Trigger Words
```
"ugh", "shey", "damn", "thenga", "help", "ayyo",
"shit", "shey", "stupid", "hate", "why", "error", "bug", "crash"
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
1. **Start the Speech Server**:
   ```bash
   cd speech-server
   npm install
   node server.js
   ```
2. **Open Web Interface**: Navigate to `http://localhost:3847` in Chrome/Edge
3. **Allow Microphone**: Grant microphone permissions when prompted
4. **Start Listening**: Click "Start Listening" in the web interface
5. **Speak Naturally**: Say trigger words and watch the magic happen!

> **Note**: Speech recognition uses browser-based Web Speech API for better compatibility and no system dependencies.

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
// You type: "This code is ayyo ugh"
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
- **Server Not Starting**: Make sure port 3847 is available
- **Permission Denied**: Allow microphone access in browser settings
- **Not Working**: Use Chrome or Edge browser for best compatibility
- **Low Accuracy**: Adjust confidence threshold in settings
- **Connection Failed**: Ensure speech server is running on `http://localhost:3847`

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
# Clone the repository
git clone https://github.com/ramudaynair/Rage-Bait.git
cd Rage-Bait/ragebait-proper

# Install dependencies
npm install

# Install speech server dependencies
cd speech-server
npm install
cd ..

# Package the extension
vsce package
```

### Testing
```bash
# Test the extension
npm test

# Test speech server
cd speech-server
node server.js
# Open http://localhost:3847 in browser
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 Changelog

### v1.3.1 (Latest)
- Improved speech recognition with browser-based Web Speech API
- Fixed microphone dependency issues
- Enhanced error handling and troubleshooting
- Better cross-platform compatibility
- Updated trigger words and speech detection

### v1.2.0
- Added Node.js speech server
- WebSocket communication for real-time speech recognition
- Improved AI integration

### v1.0.0
- Initial release
- Dual text and speech trigger system
- Four destruction methods
- AI-powered fixes with Copilot and Gemini
- Emergency undo system
- Comprehensive configuration options

## ⚖️ License

MIT License - Use at your own risk!

## 🤝 Contributing

1. Fork the repository: `https://github.com/ramudaynair/Rage-Bait`
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly (especially with the chaos features!)
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Submit a pull request

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/ramudaynair/Rage-Bait/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ramudaynair/Rage-Bait/discussions)
- **Repository**: [https://github.com/ramudaynair/Rage-Bait](https://github.com/ramudaynair/Rage-Bait)

## 🎭 Disclaimer

RageBait is designed for entertainment and experimental purposes. While it includes safety features like undo functionality, you should always:

1. **Commit your work** before using RageBait
2. **Use version control** for important projects
3. **Test in safe environments** before using on production code
4. **Keep backups** of critical files

The developers are not responsible for any code loss or damage caused by using this extension. Use responsibly and have fun!

---

## 🔗 Links

- **🌐 Live Demo**: [RageBait Landing Page](https://rage-bait.vercel.app)
- **📦 GitHub Repository**: [https://github.com/ramudaynair/Rage-Bait](https://github.com/ramudaynair/Rage-Bait)
- **👨‍💻 Developer**: [@ramudaynair](https://github.com/ramudaynair)

**Made with 🔥 and chaos by [@ramudaynair](https://github.com/ramudaynair)**

**Remember**: RageBait is chaos incarnate. It will test your reflexes, your backup strategies, and your sanity. But hey, at least it might fix your code 50% of the time! 🔥
