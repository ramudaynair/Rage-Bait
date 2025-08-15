/**
 * Test file for RageBait extension
 * Use this file to test the extension's functionality
 */

// Test trigger words by typing them:
// Try typing: "ugh", "damn", "ayyo", "thenga", "help"

function testFunction() {
    console.log("This is a test function");
    let x = 1;
    let y = 2;
    return x + y;
}

class TestClass {
    constructor() {
        this.value = 0;
    }
    
    increment() {
        this.value++;
    }
    
    getValue() {
        return this.value;
    }
}

// Some code with intentional issues for testing fixes:
var oldVar = "should be let or const"
let missingComma = {
    prop1: "value1"
    prop2: "value2"
}

function missingBraces()
    console.log("missing braces")

// Test different trigger scenarios:
// 1. Type "ugh" anywhere in this file
// 2. Type "this is ayyo" 
// 3. Say "ugh" out loud (if speech recognition is enabled)
// 4. Use Ctrl+Shift+P and run "🔥 RageBait Trigger"

// Emergency commands to remember:
// - Ctrl+Shift+P → "🚨 Panic Undo (5x)" - Emergency undo
// - Ctrl+Shift+P → "🔄 Toggle RageBait" - Disable extension
// - Ctrl+Shift+P → "🎤 Toggle Speech Recognition" - Disable speech

console.log("RageBait test file loaded. Type trigger words at your own risk!");

// More test content to make destruction more interesting
const testArray = [1, 2, 3, 4, 5];
const testObject = {
    name: "test",
    value: 42,
    nested: {
        deep: "value"
    }
};

function anotherFunction() {
    for (let i = 0; i < 10; i++) {
        console.log(`Iteration ${i}`);
    }
}

// End of test file
