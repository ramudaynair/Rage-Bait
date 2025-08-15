# 🤖 RageBait Gemini AI Setup

## Quick Setup for AI-Powered Code Fixes

### 1. Get a Free Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Add API Key to RageBait
1. Open VS Code Settings (`Ctrl+,`)
2. Search for "ragebait"
3. Find "Gemini Api Key" setting
4. Paste your API key there
5. Save settings

### 3. Test It
1. Open any code file with errors
2. Type a trigger word like "thenga" or "ugh"
3. RageBait will now use Gemini AI to actually fix your code!

## How It Works

When RageBait triggers a "fix" action, it tries:
1. **GitHub Copilot** (if installed)
2. **Google Gemini AI** (if API key configured) ← **This actually fixes your code**
3. **Basic fixes** (formatting, syntax fixes)

## Debugging

If Gemini isn't working:
1. Check the VS Code Developer Console (`Ctrl+Shift+I`)
2. Look for messages like:
   - `🔧 RageBait: Gemini API key present: true/false`
   - `🔧 RageBait: Trying Gemini API fix...`
   - `🔧 RageBait: Gemini fix applied successfully`

## API Usage & Costs

- Gemini API has a generous free tier
- Each fix request uses minimal tokens
- You can monitor usage at [Google AI Studio](https://makersuite.google.com/)

## Privacy

- Your code is sent to Google's Gemini API for processing
- Only the current file or selection is sent
- No code is stored permanently by Google
- If privacy is a concern, leave the API key blank and use basic fixes only
