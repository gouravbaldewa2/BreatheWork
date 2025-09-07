// Audio management for BreatheWork Chrome Extension

/**
 * Audio Manager Class
 * Handles background sounds with dynamic volume control based on breathing phases
 */
class AudioManager {
    constructor() {
        this.audioElement = null;
        this.currentSound = 'none';
        this.baseVolume = 0.3;
        this.isPlaying = false;
        this.fadeInterval = null;
        
        // Audio context for better control (if supported)
        this.audioContext = null;
        this.gainNode = null;
        
        this.initializeAudio();
        this.generateAudioFiles();
    }
    
    /**
     * Initialize audio element and context
     */
    initializeAudio() {
        this.audioElement = document.getElementById('audio-player') || this.createAudioElement();
        
        // Try to create audio context for better control
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioContext = new AudioContext();
                this.gainNode = this.audioContext.createGain();
                this.gainNode.connect(this.audioContext.destination);
            }
        } catch (error) {
            console.log('AudioContext not supported, using basic audio controls');
        }
        
        // Event listeners
        this.audioElement.addEventListener('loadstart', () => console.log('Audio loading started'));
        this.audioElement.addEventListener('canplay', () => console.log('Audio can play'));
        this.audioElement.addEventListener('error', (e) => console.error('Audio error:', e));
    }
    
    /**
     * Create audio element if not exists
     */
    createAudioElement() {
        const audio = document.createElement('audio');
        audio.id = 'audio-player';
        audio.loop = true;
        audio.style.display = 'none';
        document.body.appendChild(audio);
        return audio;
    }
    
    /**
     * Generate synthetic audio for different white noise types
     * Since we can't include actual audio files, we'll generate them procedurally
     */
    generateAudioFiles() {
        this.audioSources = {
            'none': null,
            'rain': this.generateRainSound(),
            'ocean': this.generateOceanSound(),
            'forest': this.generateForestSound(),
            'pink-noise': this.generatePinkNoise(),
            'brown-noise': this.generateBrownNoise(),
            'white-noise': this.generateWhiteNoise()
        };
    }
    
    /**
     * Generate procedural rain sound
     */
    generateRainSound() {
        if (!this.audioContext) return null;
        
        const bufferSize = this.audioContext.sampleRate * 2; // 2 seconds
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create rain-like noise pattern
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1 * Math.sin(i * 0.001) * (1 + Math.sin(i * 0.0001));
        }
        
        return buffer;
    }
    
    /**
     * Generate procedural ocean sound
     */
    generateOceanSound() {
        if (!this.audioContext) return null;
        
        const bufferSize = this.audioContext.sampleRate * 4; // 4 seconds
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create ocean wave-like pattern
        for (let i = 0; i < bufferSize; i++) {
            const wave1 = Math.sin(i * 0.0001) * 0.5;
            const wave2 = Math.sin(i * 0.0003) * 0.3;
            const noise = (Math.random() * 2 - 1) * 0.1;
            data[i] = (wave1 + wave2 + noise) * 0.3;
        }
        
        return buffer;
    }
    
    /**
     * Generate forest ambience
     */
    generateForestSound() {
        if (!this.audioContext) return null;
        
        const bufferSize = this.audioContext.sampleRate * 3;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create forest-like ambience with gentle rustling
        for (let i = 0; i < bufferSize; i++) {
            const rustle = Math.sin(i * 0.0005) * (Math.random() * 2 - 1) * 0.05;
            const wind = Math.sin(i * 0.00001) * 0.1;
            data[i] = rustle + wind;
        }
        
        return buffer;
    }
    
    /**
     * Generate pink noise
     */
    generatePinkNoise() {
        if (!this.audioContext) return null;
        
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
            b6 = white * 0.115926;
        }
        
        return buffer;
    }
    
    /**
     * Generate brown noise
     */
    generateBrownNoise() {
        if (!this.audioContext) return null;
        
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
        }
        
        return buffer;
    }
    
    /**
     * Generate white noise
     */
    generateWhiteNoise() {
        if (!this.audioContext) return null;
        
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1;
        }
        
        return buffer;
    }
    
    /**
     * Play background sound
     */
    async playSound(soundType) {
        if (soundType === 'none' || soundType === this.currentSound) {
            return;
        }
        
        try {
            await this.stopSound();
            
            if (this.audioContext && this.audioSources[soundType]) {
                // Use Web Audio API for procedural sounds
                await this.playProceduralSound(soundType);
            } else {
                // Fallback to basic audio for non-procedural sounds
                await this.playBasicSound(soundType);
            }
            
            this.currentSound = soundType;
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }
    
    /**
     * Play procedural sound using Web Audio API
     */
    async playProceduralSound(soundType) {
        if (!this.audioContext || !this.audioSources[soundType]) return;
        
        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.audioSources[soundType];
        this.source.loop = true;
        this.source.connect(this.gainNode);
        
        // Set initial volume
        this.gainNode.gain.setValueAtTime(this.baseVolume, this.audioContext.currentTime);
        
        this.source.start();
        this.isPlaying = true;
    }
    
    /**
     * Play sound using basic HTML5 audio (fallback)
     */
    async playBasicSound(soundType) {
        // For demo purposes, we'll use a simple oscillator for fallback
        // In a real implementation, you would load actual audio files
        if (this.audioContext) {
            this.source = this.audioContext.createOscillator();
            this.source.frequency.setValueAtTime(100, this.audioContext.currentTime);
            this.source.type = 'sawtooth';
            this.source.connect(this.gainNode);
            this.source.start();
        }
        
        this.isPlaying = true;
    }
    
    /**
     * Stop current sound
     */
    async stopSound() {
        if (this.source) {
            try {
                this.source.stop();
                this.source.disconnect();
            } catch (error) {
                // Source might already be stopped
            }
            this.source = null;
        }
        
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }
        
        this.isPlaying = false;
        this.currentSound = 'none';
    }
    
    /**
     * Set base volume (0-1)
     */
    setVolume(volume) {
        this.baseVolume = Math.max(0, Math.min(1, volume));
        
        if (this.gainNode && this.audioContext) {
            this.gainNode.gain.setValueAtTime(this.baseVolume, this.audioContext.currentTime);
        }
        
        if (this.audioElement) {
            this.audioElement.volume = this.baseVolume;
        }
    }
    
    /**
     * Fade volume for breathing phases
     * @param {string} phase - Current breathing phase
     * @param {number} progress - Progress through phase (0-1)
     */
    fadeForBreathingPhase(phase, progress = 0.5) {
        if (!this.isPlaying) return;
        
        let targetVolume = this.baseVolume;
        
        switch (phase) {
            case 'inhale':
                // Gradually increase volume during inhale
                targetVolume = this.baseVolume * (0.5 + (progress * 0.5));
                break;
                
            case 'hold':
            case 'hold1':
            case 'hold2':
                // Maintain steady volume during hold
                targetVolume = this.baseVolume;
                break;
                
            case 'exhale':
                // Gradually decrease volume during exhale
                targetVolume = this.baseVolume * (1 - (progress * 0.3));
                break;
                
            default:
                targetVolume = this.baseVolume;
        }
        
        // Apply volume change
        if (this.gainNode && this.audioContext) {
            this.gainNode.gain.setValueAtTime(targetVolume, this.audioContext.currentTime);
        }
        
        if (this.audioElement) {
            this.audioElement.volume = targetVolume;
        }
    }
    
    /**
     * Check if sound is currently playing
     */
    isCurrentlyPlaying() {
        return this.isPlaying;
    }
    
    /**
     * Get current sound type
     */
    getCurrentSound() {
        return this.currentSound;
    }
    
    /**
     * Get available sound options
     */
    getAvailableSounds() {
        return [
            { key: 'none', name: 'Silent', description: 'No background sound' },
            { key: 'rain', name: 'Rain', description: 'Gentle rainfall ambience' },
            { key: 'ocean', name: 'Ocean', description: 'Ocean waves and surf' },
            { key: 'forest', name: 'Forest', description: 'Forest ambience with gentle rustling' },
            { key: 'pink-noise', name: 'Pink Noise', description: 'Balanced frequency noise' },
            { key: 'brown-noise', name: 'Brown Noise', description: 'Deep, low-frequency noise' },
            { key: 'white-noise', name: 'White Noise', description: 'Full spectrum noise' }
        ];
    }
    
    /**
     * Cleanup resources
     */
    cleanup() {
        this.stopSound();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}