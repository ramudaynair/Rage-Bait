# Changelog

All notable changes to the RageBait extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-01-15

### 🎉 Sidebar Control Panel Added

#### Added
- **Sidebar Integration**
  - Custom RageBait icon (🔥) in VS Code activity bar
  - Three-panel sidebar view: Control Panel, Undo History, Statistics
  - Real-time status monitoring for extension and speech recognition
  - One-click action buttons for trigger, toggle, and undo operations

- **Enhanced User Interface**
  - Visual status indicators with color coding
  - Quick access to all RageBait functions from sidebar
  - Interactive undo history with click-to-restore functionality
  - Live statistics tracking destruction vs fix ratios
  - Configuration overview with direct settings access

- **Improved Commands**
  - New sidebar-specific commands for refresh, clear history, export
  - Context menus for sidebar items
  - Enhanced command palette integration

## [1.0.0] - 2024-01-15

### 🎉 Initial Release

#### Added
- **Dual Trigger System**
  - Text monitoring for trigger words while typing
  - Speech recognition using HTML5 Web Speech API
  - Immediate action execution (no delays or warnings)

- **Destruction Methods**
  - Random Line Deletion: Removes 20-30% of random lines
  - Function Destroyer: Deletes entire function at cursor location
  - Selection Obliterator: Deletes selected text or current line
  - File Bisector: Removes top or bottom half of file

- **AI-Powered Fix System**
  - GitHub Copilot integration for intelligent code fixes
  - Google Gemini API integration with custom API key support
  - Automatic fallback chain: Copilot → Gemini → Basic Fixes

- **Basic Fix Methods**
  - Document formatting using VS Code's built-in formatter
  - Language-specific fixes for JavaScript, Python, Java, C#, HTML, CSS, JSON, XML
  - Generic fixes: trailing whitespace removal, line ending normalization
  - Syntax error detection and automatic quick fixes

- **Emergency Safety Features**
  - Panic Undo: Instantly undo last 5 actions
  - Single Action Undo: Undo individual actions
  - Undo History Viewer: Browse and selectively restore previous states
  - Undo History Export: Save history as JSON for debugging

- **Speech Recognition Features**
  - Continuous listening with auto-restart
  - Confidence threshold filtering
  - Visual feedback in webview interface
  - Status bar integration with real-time status
  - Manual start/stop controls

- **Configuration System**
  - Enable/disable extension and speech recognition
  - Customizable trigger words array
  - Adjustable destruction vs fix probability (0.0-1.0)
  - Speech confidence threshold setting
  - Gemini API key configuration
  - Maximum destruction lines limit
  - Notification preferences

- **User Interface**
  - Command Palette integration for all features
  - Status bar speech recognition indicator
  - Contextual notifications with action buttons
  - Settings UI integration with VS Code preferences

- **Developer Features**
  - Comprehensive error handling and logging
  - Performance optimization for minimal VS Code impact
  - Proper resource cleanup on deactivation
  - Extensive code documentation and comments

#### Commands Added
- `🔥 RageBait Trigger` - Manual trigger activation
- `🔄 Toggle RageBait` - Enable/disable extension
- `🎤 Toggle Speech Recognition` - Control speech monitoring
- `🚨 Panic Undo (5x)` - Emergency multi-action undo
- `⚙️ RageBait Settings` - Quick access to settings
- `RageBait: Single Undo` - Undo last action only
- `RageBait: Show Undo History` - Browse undo history
- `RageBait: Clear Undo History` - Reset undo stack
- `RageBait: Export Undo History` - Save history as JSON

#### Configuration Options Added
- `ragebait.enabled` - Master enable/disable switch
- `ragebait.speechEnabled` - Speech recognition toggle
- `ragebait.triggerWords` - Array of trigger words
- `ragebait.destructionChance` - Probability of destruction vs fixing
- `ragebait.speechConfidenceThreshold` - Speech recognition sensitivity
- `ragebait.geminiApiKey` - Google Gemini API key
- `ragebait.maxDestructionLines` - Destruction safety limit
- `ragebait.enableNotifications` - Notification preferences

#### Technical Implementation
- **Extension Architecture**: Modular design with separate classes for each feature
- **Text Monitoring**: Real-time document change detection with word boundary matching
- **Speech Recognition**: Webview-based implementation using HTML5 Speech Recognition API
- **AI Integration**: Axios-based HTTP client for Gemini API calls
- **Undo System**: Comprehensive state management with metadata tracking
- **Error Handling**: Graceful degradation and user-friendly error messages

#### Default Trigger Words
```json
[
  "ugh", "ugh", "damn", "fix this", "help", "broken",
  "shit", "ayyo", "stupid", "hate", "why", "error", "bug", "crash"
]
```

#### Supported Languages
- **Full Support**: JavaScript, TypeScript, Python, Java, C#, C++, C
- **Partial Support**: HTML, CSS, JSON, XML
- **Generic Support**: All other file types with basic fixes

#### Browser Compatibility (Speech Recognition)
- ✅ Chrome/Chromium-based browsers
- ✅ Edge (Chromium)
- ❌ Firefox (limited support)
- ❌ Safari (no support)

#### Performance Characteristics
- **Memory Usage**: < 10MB typical
- **CPU Impact**: Minimal during idle, brief spikes during actions
- **Startup Time**: < 500ms activation
- **Speech Recognition**: Continuous with auto-restart

#### Security Features
- **API Key Storage**: Secure VS Code settings storage
- **Permission Handling**: Graceful microphone permission requests
- **Data Privacy**: No data sent to external services except configured APIs
- **Sandbox Isolation**: Speech recognition runs in isolated webview

### 🔧 Technical Notes

#### Dependencies
- `axios`: HTTP client for API calls
- `vscode`: VS Code extension API
- No additional runtime dependencies

#### File Structure
```
ragebait/
├── package.json              # Extension manifest
├── README.md                 # Documentation
├── CHANGELOG.md             # This file
├── .vscodeignore           # Package exclusions
└── src/
    ├── extension.js         # Main entry point
    ├── config.js           # Configuration management
    ├── speechRecognition.js # Speech recognition system
    └── commands/
        ├── deleteLines.js   # Destruction methods
        ├── copilotFix.js   # AI-powered fixes
        ├── basicFixes.js   # Fallback fixes
        └── undoAction.js   # Undo system
```

#### Known Limitations
- Speech recognition requires Chromium-based browser engine
- Copilot integration depends on GitHub Copilot extension
- Gemini API requires internet connection and valid API key
- Undo system limited to 20 most recent actions

#### Future Roadmap
- Additional AI provider integrations (OpenAI, Claude)
- More sophisticated destruction algorithms
- Custom trigger word patterns and regex support
- Team/workspace sharing of configurations
- Telemetry and usage analytics (opt-in)
- Mobile/web VS Code support

---

## [Unreleased]

### Planned Features
- OpenAI GPT integration for code fixes
- Custom destruction method plugins
- Regex-based trigger patterns
- Workspace-specific configurations
- Usage statistics and analytics
- Integration with more AI coding assistants

### Known Issues
- Speech recognition may not work in Firefox
- Large files (>10k lines) may experience slower destruction methods
- Undo history is lost when VS Code is restarted

---

For more information, visit the [GitHub repository](https://github.com/ragebait-dev/ragebait-vscode).
