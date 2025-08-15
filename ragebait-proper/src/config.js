const vscode = require('vscode');

/**
 * Configuration manager for RageBait extension
 * Handles all settings and configuration operations
 */
class RageBaitConfig {
    constructor() {
        this.configSection = 'ragebait';
    }

    /**
     * Get the current configuration object
     * @returns {vscode.WorkspaceConfiguration}
     */
    getConfig() {
        return vscode.workspace.getConfiguration(this.configSection);
    }

    /**
     * Get trigger words array
     * @returns {string[]}
     */
    getTriggerWords() {
        const config = this.getConfig();
        return config.get('triggerWords', [
            'ugh', 'ugh', 'damn', 'fix this', 'help', 'broken', 
            'shit', 'ayyo', 'stupid', 'hate', 'why', 'error', 'bug', 'crash'
        ]);
    }

    /**
     * Set trigger words array
     * @param {string[]} words 
     */
    async setTriggerWords(words) {
        const config = this.getConfig();
        await config.update('triggerWords', words, vscode.ConfigurationTarget.Global);
    }

    /**
     * Get destruction chance (0-1)
     * @returns {number}
     */
    getDestructionChance() {
        const config = this.getConfig();
        return config.get('destructionChance', 0.5);
    }

    /**
     * Set destruction chance
     * @param {number} chance 
     */
    async setDestructionChance(chance) {
        const config = this.getConfig();
        await config.update('destructionChance', chance, vscode.ConfigurationTarget.Global);
    }

    /**
     * Check if extension is enabled
     * @returns {boolean}
     */
    isEnabled() {
        const config = this.getConfig();
        return config.get('enabled', true);
    }

    /**
     * Set extension enabled state
     * @param {boolean} enabled 
     */
    async setEnabled(enabled) {
        const config = this.getConfig();
        await config.update('enabled', enabled, vscode.ConfigurationTarget.Global);
    }

    /**
     * Check if speech recognition is enabled
     * @returns {boolean}
     */
    isSpeechEnabled() {
        const config = this.getConfig();
        return config.get('speechEnabled', true);
    }

    /**
     * Set speech recognition enabled state
     * @param {boolean} enabled 
     */
    async setSpeechEnabled(enabled) {
        const config = this.getConfig();
        await config.update('speechEnabled', enabled, vscode.ConfigurationTarget.Global);
    }

    /**
     * Get speech confidence threshold
     * @returns {number}
     */
    getSpeechConfidenceThreshold() {
        const config = this.getConfig();
        return config.get('speechConfidenceThreshold', 0.7);
    }

    /**
     * Set speech confidence threshold
     * @param {number} threshold 
     */
    async setSpeechConfidenceThreshold(threshold) {
        const config = this.getConfig();
        await config.update('speechConfidenceThreshold', threshold, vscode.ConfigurationTarget.Global);
    }

    /**
     * Get Gemini API key
     * @returns {string}
     */
    getGeminiApiKey() {
        const config = this.getConfig();
        return config.get('geminiApiKey', '');
    }

    /**
     * Set Gemini API key
     * @param {string} apiKey 
     */
    async setGeminiApiKey(apiKey) {
        const config = this.getConfig();
        await config.update('geminiApiKey', apiKey, vscode.ConfigurationTarget.Global);
    }

    /**
     * Get maximum destruction lines
     * @returns {number}
     */
    getMaxDestructionLines() {
        const config = this.getConfig();
        return config.get('maxDestructionLines', 50);
    }

    /**
     * Check if notifications are enabled
     * @returns {boolean}
     */
    areNotificationsEnabled() {
        const config = this.getConfig();
        return config.get('enableNotifications', true);
    }

    /**
     * Set notifications enabled state
     * @param {boolean} enabled 
     */
    async setNotificationsEnabled(enabled) {
        const config = this.getConfig();
        await config.update('enableNotifications', enabled, vscode.ConfigurationTarget.Global);
    }

    /**
     * Get all configuration as object
     * @returns {object}
     */
    getAllConfig() {
        return {
            enabled: this.isEnabled(),
            speechEnabled: this.isSpeechEnabled(),
            triggerWords: this.getTriggerWords(),
            destructionChance: this.getDestructionChance(),
            speechConfidenceThreshold: this.getSpeechConfidenceThreshold(),
            geminiApiKey: this.getGeminiApiKey(),
            maxDestructionLines: this.getMaxDestructionLines(),
            notificationsEnabled: this.areNotificationsEnabled()
        };
    }

    /**
     * Reset all configuration to defaults
     */
    async resetToDefaults() {
        const config = this.getConfig();
        await config.update('enabled', true, vscode.ConfigurationTarget.Global);
        await config.update('speechEnabled', true, vscode.ConfigurationTarget.Global);
        await config.update('destructionChance', 0.5, vscode.ConfigurationTarget.Global);
        await config.update('speechConfidenceThreshold', 0.7, vscode.ConfigurationTarget.Global);
        await config.update('geminiApiKey', '', vscode.ConfigurationTarget.Global);
        await config.update('maxDestructionLines', 50, vscode.ConfigurationTarget.Global);
        await config.update('enableNotifications', true, vscode.ConfigurationTarget.Global);
        await config.update('triggerWords', [
            'ugh', 'ugh', 'damn', 'fix this', 'help', 'broken', 
            'shit', 'ayyo', 'stupid', 'hate', 'why', 'error', 'bug', 'crash'
        ], vscode.ConfigurationTarget.Global);
    }

    /**
     * Validate configuration values
     * @returns {object} Validation result with errors if any
     */
    validateConfig() {
        const errors = [];
        const config = this.getAllConfig();

        if (config.destructionChance < 0 || config.destructionChance > 1) {
            errors.push('Destruction chance must be between 0 and 1');
        }

        if (config.speechConfidenceThreshold < 0 || config.speechConfidenceThreshold > 1) {
            errors.push('Speech confidence threshold must be between 0 and 1');
        }

        if (config.maxDestructionLines < 1) {
            errors.push('Max destruction lines must be at least 1');
        }

        if (!Array.isArray(config.triggerWords) || config.triggerWords.length === 0) {
            errors.push('Trigger words must be a non-empty array');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

module.exports = RageBaitConfig;
