<img width="2000" height="600" alt="RageBait Banner" src="https://github.com/user-attachments/assets/ragebait-banner-placeholder" />

# RageBait 🔥

## Basic Details
### Team Name: Chaos Coders

### Team Members
- Team Lead: Ramudaynair - [Your College/Organization]

### Project Description
A chaotic VS Code extension that monitors your typing and speech for frustration triggers, then randomly destroys or fixes your code using AI. It's the perfect blend of chaos and productivity that nobody asked for but everyone secretly needs!

### The Problem (that doesn't exist)
Developers are too comfortable and productive while coding. There's not enough chaos and unpredictability in the development process. What if your code could fight back when you get frustrated?

### The Solution (that nobody asked for)
RageBait listens to your typing and speech, detects when you're getting frustrated (words like "wtf", "damn", "help"), and then flips a coin - either completely destroys your code or attempts to fix it using AI. It's like having a mischievous coding companion that keeps you on your toes!

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

### Project Documentation
For Software:

# Screenshots (Add at least 3)
![Extension Sidebar](https://github.com/user-attachments/assets/ragebait-sidebar-screenshot)
*RageBait control panel in VS Code sidebar showing status and quick actions*

![Speech Recognition](https://github.com/user-attachments/assets/ragebait-speech-interface)
*Web-based speech recognition interface running on localhost:3847*

![Code Destruction](https://github.com/user-attachments/assets/ragebait-destruction-demo)
*Example of RageBait randomly destroying code after detecting trigger words*

# Diagrams
![Architecture](https://github.com/user-attachments/assets/ragebait-architecture-diagram)
*RageBait system architecture showing VS Code extension, speech server, and AI integration*

### Project Demo
# Video
[RageBait Demo Video](https://github.com/ramudaynair/Rage-Bait/demo-video)
*Complete demonstration of RageBait detecting speech triggers and randomly destroying/fixing code*

# Additional Demos
- [Live Demo Website](https://rage-bait.vercel.app) - Interactive landing page
- [Speech Recognition Test](http://localhost:3847) - Test the speech detection system

## 📦 Installation
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

## Team Contributions
- **Ramudaynair**: Project lead, VS Code extension development, speech recognition system, AI integration, web interface design, documentation

---
Made with ❤️ and 🔥 at TinkerHub Useless Projects

[![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)](https://www.tinkerhub.org/)
[![Static Badge](https://img.shields.io/badge/UselessProjects--25-25?link=https%3A%2F%2Fwww.tinkerhub.org%2Fevents%2FQ2Q1TQKX6Q%2FUseless%2520Projects)](https://www.tinkerhub.org/events/Q2Q1TQKX6Q/Useless%20Projects)
[![GitHub](https://img.shields.io/badge/GitHub-ramudaynair%2FRage--Bait-orange?style=flat&logo=github)](https://github.com/ramudaynair/Rage-Bait)
