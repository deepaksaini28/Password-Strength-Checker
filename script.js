class PasswordAnalyzer {
    constructor() {
        this.passwordInput = document.getElementById('passwordInput');
        this.strengthBar = document.getElementById('strengthBar');
        this.strengthLabel = document.getElementById('strengthLabel');
        this.entropyValue = document.getElementById('entropyValue');
        this.requirementsList = document.getElementById('requirementsList');
        this.suggestionsList = document.getElementById('suggestionsList');
        this.toggleButton = document.getElementById('togglePassword');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.passwordInput.addEventListener('input', () => this.analyzePassword());
        this.toggleButton.addEventListener('click', () => this.togglePasswordVisibility());
    }

    togglePasswordVisibility() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        this.toggleButton.textContent = type === 'password' ? 'Show' : 'Hide';
    }

    analyzePassword() {
        const password = this.passwordInput.value;
        const analysis = this.calculateStrength(password);
        this.updateUI(analysis);
    }

    calculateStrength(password) {
        const length = password.length;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);

        // Calculate character set size for entropy
        let charSetSize = 0;
        if (hasLower) charSetSize += 26;
        if (hasUpper) charSetSize += 26;
        if (hasNumber) charSetSize += 10;
        if (hasSpecial) charSetSize += 32;

        // Calculate entropy
        const entropy = length * (charSetSize ? Math.log2(charSetSize) : 0);

        // Calculate strength score (0-100)
        let strengthScore = 0;
        strengthScore += length * 4;
        strengthScore += hasUpper ? 10 : 0;
        strengthScore += hasLower ? 10 : 0;
        strengthScore += hasNumber ? 10 : 0;
        strengthScore += hasSpecial ? 15 : 0;
        strengthScore = Math.min(100, strengthScore);

        // Generate suggestions
        const suggestions = [];
        if (length < 8) suggestions.push("Make your password longer (at least 8 characters)");
        if (!hasUpper) suggestions.push("Add uppercase letters");
        if (!hasLower) suggestions.push("Add lowercase letters");
        if (!hasNumber) suggestions.push("Add numbers");
        if (!hasSpecial) suggestions.push("Add special characters");
        if (/(.)\1{2,}/.test(password)) suggestions.push("Avoid repeating characters");
        if (/^[0-9]+$/.test(password)) suggestions.push("Don't use only numbers");
        if (/^[a-zA-Z]+$/.test(password)) suggestions.push("Don't use only letters");

        return {
            strength: strengthScore,
            entropy,
            requirements: {
                length: length >= 8,
                upper: hasUpper,
                lower: hasLower,
                number: hasNumber,
                special: hasSpecial
            },
            suggestions
        };
    }

    updateUI(analysis) {
        // Update strength bar
        this.strengthBar.style.width = `${analysis.strength}%`;
        this.strengthBar.className = 'strength-bar';
        if (analysis.strength < 40) {
            this.strengthBar.classList.add('weak');
            this.strengthLabel.textContent = 'Weak';
        } else if (analysis.strength < 70) {
            this.strengthBar.classList.add('medium');
            this.strengthLabel.textContent = 'Medium';
        } else {
            this.strengthBar.classList.add('strong');
            this.strengthLabel.textContent = 'Strong';
        }

        // Update entropy value
        this.entropyValue.textContent = `${Math.round(analysis.entropy)} bits`;

        // Update requirements
        document.getElementById('lengthReq').className = analysis.requirements.length ? 'valid' : 'invalid';
        document.getElementById('upperReq').className = analysis.requirements.upper ? 'valid' : 'invalid';
        document.getElementById('lowerReq').className = analysis.requirements.lower ? 'valid' : 'invalid';
        document.getElementById('numberReq').className = analysis.requirements.number ? 'valid' : 'invalid';
        document.getElementById('specialReq').className = analysis.requirements.special ? 'valid' : 'invalid';

        // Update suggestions
        this.suggestionsList.innerHTML = analysis.suggestions
            .map(suggestion => `<li>${suggestion}</li>`)
            .join('');
    }
}

// Initialize the Password Analyzer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PasswordAnalyzer();
});
