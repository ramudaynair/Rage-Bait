<img width="3188" height="1202" alt="frame (3)" src="https://github.com/user-attachments/assets/517ad8e9-ad22-457d-9538-a9e62d137cd7" />

# [RageBait] 🎯

## Basic Details
### Team Name: [Ryze]

### Team Members
- **Ram U Nair** – Toc H Institute of Science and Technology
- **Reyhan Hazeem** – Toc H Institute of Science and Technology

---

### Project Description
A chaotic VS Code extension that listens to your voice for trigger words and even catches them when you type, then randomly either **destroys** or **fixes** your code.  
Because who needs predictability?


---

### The Problem (that definitely exists)
Programmers get frustrated — code breaks, bugs pile up, and sanity slips.  
There’s no dramatic flair to those moments (just tears).

---

### The Solution (nobody asked for it)
RageBait turns your frustration into unpredictable action.  
Say “ugh” or “shey”? The code either gets AI rescued or obliterated, but always with style.

---

## Technical Details

### Technologies Used
- **Software**: JavaScript, VS Code Extension API, Node.js, GitHub Copilot API, Google Gemini API
- **Tools**: vsce, npm, Web Speech API (via local speech server)

---

### Installation
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
- Say or type trigger words like: "ugh", "shey", "shit", "damn"
- Watch RageBait instantly destroy or fix your code! 🔥


## Screenshot
<img width="1918" height="1030" alt="Screenshot 2025-08-15 081921" src="https://github.com/user-attachments/assets/7e590826-03bb-4a0a-a14d-ade60578b1cf" />
<img width="1852" height="1032" alt="Screenshot 2025-08-15 082228" src="https://github.com/user-attachments/assets/5f021f60-640a-4e51-861a-438a5d17b648" />
<img width="1843" height="1031" alt="Screenshot 2025-08-15 081957" src="https://github.com/user-attachments/assets/357914eb-3cc6-470e-9416-651454e7fa71" />

## Team Contributions

Ram U Nair: Core VS Code extension logic, speech integration, chaos engine 
Reyhan Hazeem: UI components, AI-fix chain integration, control panel design

## Disclaimer

RageBait is designed for entertainment and experimental purposes. While it includes safety features like undo functionality, you should always:

1. **Commit your work** before using RageBait
2. **Use version control** for important projects
3. **Test in safe environments** before using on production code
4. **Keep backups** of critical files

The developers are not responsible for any code loss or damage caused by using this extension. Use responsibly and have fun!
