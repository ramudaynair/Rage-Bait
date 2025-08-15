# 🔥 RageBait Installation & Testing Guide

## 📦 Quick Installation

### Prerequisites
- VS Code 1.60.0 or higher
- Node.js (for building from source)
- `vsce` package tool (for packaging)

### Install VSCE (if not already installed)
```bash
npm install -g vsce
```

### Package the Extension
```bash
# In the ragebait directory
vsce package
```

This will create a `ragebait-1.0.0.vsix` file.

### Install in VS Code
```bash
code --install-extension ragebait-1.0.0.vsix
```

Or manually:
1. Open VS Code
2. Press `Ctrl+Shift+P`
3. Type "Extensions: Install from VSIX"
4. Select the `ragebait-1.0.0.vsix` file

## 🧪 Testing the Extension

### 1. Basic Functionality Test
1. Open the included `test-ragebait.js` file
2. Type one of the trigger words: `ugh`, `damn`, `broken`, `help`
3. Watch as RageBait either destroys or fixes your code!

### 2. Speech Recognition Test
1. Ensure your microphone is connected
2. Check the status bar for "🎤 RageBait Listening"
3. Say a trigger word out loud: "This is broken"
4. Allow microphone permissions if prompted

### 3. Manual Trigger Test
1. Press `Ctrl+Shift+P`
2. Type "🔥 RageBait Trigger"
3. Press Enter to manually trigger an action

### 4. Emergency Undo Test
1. After any action, press `Ctrl+Shift+P`
2. Type "🚨 Panic Undo"
3. Press Enter to undo the last 5 actions

### 5. Configuration Test
1. Press `Ctrl+Shift+P`
2. Type "Preferences: Open Settings"
3. Search for "ragebait"
4. Modify settings like trigger words or destruction chance

## ⚙️ Configuration Examples

### Custom Trigger Words
```json
{
    "ragebait.triggerWords": [
        "chaos", "destroy", "mayhem", "fix please", "help me"
    ]
}
```

### Always Fix (Never Destroy)
```json
{
    "ragebait.destructionChance": 0.0
}
```

### Always Destroy (Never Fix)
```json
{
    "ragebait.destructionChance": 1.0
}
```

### Add Gemini API Key
```json
{
    "ragebait.geminiApiKey": "your-api-key-here"
}
```

## 🔍 Troubleshooting

### Extension Not Loading
- Check VS Code version (must be 1.60.0+)
- Reload VS Code: `Ctrl+Shift+P` → "Developer: Reload Window"
- Check the Output panel for errors

### Speech Recognition Not Working
- Allow microphone permissions
- Use Chrome/Edge (Firefox has limited support)
- Check status bar for speech recognition status
- Try toggling speech: `Ctrl+Shift+P` → "🎤 Toggle Speech Recognition"

### Trigger Words Not Detected
- Ensure RageBait is enabled: `Ctrl+Shift+P` → "🔄 Toggle RageBait"
- Check trigger words in settings
- Type complete words (not partial matches)
- Wait for cooldown period (2 seconds between triggers)

### Undo Not Working
- Use the panic undo command: `Ctrl+Shift+P` → "🚨 Panic Undo (5x)"
- Check undo history: `Ctrl+Shift+P` → "RageBait: Show Undo History"
- Undo is limited to 20 most recent actions

## 🎯 Test Scenarios

### Scenario 1: Destruction Test
1. Open `test-ragebait.js`
2. Type "this code is broken ugh"
3. Expect: Random destruction method executed
4. Use panic undo to restore

### Scenario 2: Fix Test
1. Create a file with syntax errors
2. Type "help fix this"
3. Expect: Code formatting and basic fixes applied
4. Check if improvements were made

### Scenario 3: Speech Test
1. Enable speech recognition
2. Say "This bug is stupid"
3. Expect: Action triggered by speech
4. Check status bar for confirmation

### Scenario 4: AI Fix Test (if Copilot/Gemini available)
1. Write broken code
2. Type "fix this please"
3. Expect: AI-powered code improvements
4. Compare before/after code quality

## 📊 Performance Testing

### Memory Usage
- Check Task Manager/Activity Monitor
- RageBait should use < 10MB typically
- Speech recognition adds ~5MB when active

### CPU Usage
- Should be minimal during idle
- Brief spikes during actions (< 1 second)
- Continuous speech recognition uses ~1-2% CPU

### Responsiveness
- Actions should execute immediately
- No noticeable lag in typing
- Speech recognition should respond within 1-2 seconds

## 🚨 Safety Testing

### Backup Test
1. Create a test file with important content
2. Save and commit to version control
3. Trigger RageBait destruction
4. Verify undo functionality works
5. Confirm backup/version control integrity

### Error Handling Test
1. Disconnect internet (for API tests)
2. Deny microphone permissions
3. Use invalid API keys
4. Verify graceful error handling

## 📝 Development Testing

### Code Quality
- All files should have proper JSDoc comments
- No console errors in VS Code Developer Tools
- Proper error handling in all methods

### Extension Lifecycle
- Test activation on VS Code startup
- Test deactivation when disabling extension
- Verify proper cleanup of resources

## 🎉 Success Criteria

✅ Extension installs without errors  
✅ All commands appear in Command Palette  
✅ Settings appear in VS Code preferences  
✅ Text trigger words work correctly  
✅ Speech recognition functions (in supported browsers)  
✅ Destruction methods execute safely  
✅ Fix methods improve code quality  
✅ Undo system restores previous states  
✅ Error handling prevents crashes  
✅ Performance impact is minimal  

## 🔧 Building for Distribution

### Create Release Package
```bash
# Clean build
rm -rf node_modules
npm install --production

# Package extension
vsce package

# Verify package contents
vsce ls
```

### Publish to Marketplace (Optional)
```bash
# Login to publisher account
vsce login your-publisher-name

# Publish extension
vsce publish
```

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review the console output (`Help > Toggle Developer Tools`)
3. Create an issue on GitHub with detailed error information
4. Include VS Code version, OS, and extension version

---

**Remember**: RageBait is designed to be chaotic. Always backup your work before testing! 🔥
