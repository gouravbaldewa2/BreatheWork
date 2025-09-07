// Breathing techniques configuration and definitions

/**
 * Comprehensive breathing techniques with scientific backing
 * Each technique includes timing patterns, descriptions, and benefits
 */
const BREATHING_TECHNIQUES = {
    'box': {
        name: 'Box Breathing',
        description: '4-4-4-4 pattern. Equal inhale, hold, exhale, hold.',
        benefits: 'Reduces stress, improves focus, balances nervous system',
        phases: ['inhale', 'hold', 'exhale', 'hold'],
        defaultTiming: {
            inhale: 4,
            hold1: 4,
            exhale: 4,
            hold2: 4
        },
        instructions: {
            inhale: 'Breathe in slowly through your nose',
            hold1: 'Hold your breath gently',
            exhale: 'Exhale slowly through your mouth',
            hold2: 'Hold empty lungs gently'
        },
        minTiming: { inhale: 2, hold1: 1, exhale: 2, hold2: 1 },
        maxTiming: { inhale: 8, hold1: 8, exhale: 8, hold2: 8 }
    },
    
    '478': {
        name: '4-7-8 Breathing',
        description: 'Inhale 4, hold 7, exhale 8. Natural relaxant for sleep.',
        benefits: 'Promotes sleep, reduces anxiety, calms nervous system',
        phases: ['inhale', 'hold', 'exhale'],
        defaultTiming: {
            inhale: 4,
            hold1: 7,
            exhale: 8
        },
        instructions: {
            inhale: 'Inhale quietly through your nose',
            hold1: 'Hold your breath completely',
            exhale: 'Exhale completely through your mouth with a whoosh sound'
        },
        minTiming: { inhale: 3, hold1: 5, exhale: 6 },
        maxTiming: { inhale: 6, hold1: 10, exhale: 12 }
    },
    
    'triangle': {
        name: 'Triangle Breathing',
        description: 'Equal inhale, hold, exhale in triangular pattern.',
        benefits: 'Balances nervous system, improves concentration',
        phases: ['inhale', 'hold', 'exhale'],
        defaultTiming: {
            inhale: 4,
            hold1: 4,
            exhale: 4
        },
        instructions: {
            inhale: 'Breathe in steadily through your nose',
            hold1: 'Hold with gentle awareness',
            exhale: 'Release breath slowly and completely'
        },
        minTiming: { inhale: 3, hold1: 3, exhale: 3 },
        maxTiming: { inhale: 8, hold1: 8, exhale: 8 }
    },
    
    'wim-hof': {
        name: 'Wim Hof Method',
        description: '30 power breaths followed by retention and recovery.',
        benefits: 'Increases energy, cold resistance, immune function',
        phases: ['power-breath', 'retention', 'recovery'],
        defaultTiming: {
            'power-breath': 30, // Number of breaths
            retention: 60,     // Seconds
            recovery: 15       // Seconds
        },
        instructions: {
            'power-breath': 'Take 30 deep, powerful breaths - in through nose, out through mouth',
            retention: 'Hold your breath after the last exhale',
            recovery: 'Take a deep breath and hold for 15 seconds'
        },
        minTiming: { 'power-breath': 20, retention: 30, recovery: 10 },
        maxTiming: { 'power-breath': 40, retention: 120, recovery: 30 },
        special: true // Requires special handling
    },
    
    'coherent': {
        name: 'Coherent Breathing',
        description: '5 seconds inhale, 5 seconds exhale for heart coherence.',
        benefits: 'Improves heart rate variability, reduces stress',
        phases: ['inhale', 'exhale'],
        defaultTiming: {
            inhale: 5,
            exhale: 5
        },
        instructions: {
            inhale: 'Breathe in smoothly for 5 seconds',
            exhale: 'Breathe out smoothly for 5 seconds'
        },
        minTiming: { inhale: 4, exhale: 4 },
        maxTiming: { inhale: 7, exhale: 7 }
    },
    
    'bellows': {
        name: 'Bellows Breathing',
        description: 'Rapid, energizing breath work to increase alertness.',
        benefits: 'Increases alertness, energy, mental clarity',
        phases: ['rapid-breath'],
        defaultTiming: {
            'rapid-breath': 60 // Duration in seconds
        },
        instructions: {
            'rapid-breath': 'Breathe rapidly in and out through your nose - like a bellows'
        },
        minTiming: { 'rapid-breath': 30 },
        maxTiming: { 'rapid-breath': 120 },
        special: true // Requires special handling
    },
    
    'alternate': {
        name: 'Alternate Nostril Breathing',
        description: 'Balanced breathing through alternating nostrils.',
        benefits: 'Mental clarity, balance, focus enhancement',
        phases: ['left-inhale', 'hold', 'right-exhale', 'right-inhale', 'hold', 'left-exhale'],
        defaultTiming: {
            'left-inhale': 4,
            hold1: 2,
            'right-exhale': 4,
            'right-inhale': 4,
            hold2: 2,
            'left-exhale': 4
        },
        instructions: {
            'left-inhale': 'Block right nostril, inhale through left',
            hold1: 'Block both nostrils gently',
            'right-exhale': 'Block left nostril, exhale through right',
            'right-inhale': 'Keep left blocked, inhale through right',
            hold2: 'Block both nostrils gently',
            'left-exhale': 'Block right nostril, exhale through left'
        },
        minTiming: { 'left-inhale': 3, hold1: 1, 'right-exhale': 3, 'right-inhale': 3, hold2: 1, 'left-exhale': 3 },
        maxTiming: { 'left-inhale': 8, hold1: 4, 'right-exhale': 8, 'right-inhale': 8, hold2: 4, 'left-exhale': 8 },
        special: true // Requires special visual guidance
    },
    
    'extended': {
        name: 'Extended Exhale',
        description: 'Longer exhale than inhale for deep relaxation.',
        benefits: 'Activates parasympathetic system, promotes relaxation',
        phases: ['inhale', 'exhale'],
        defaultTiming: {
            inhale: 4,
            exhale: 8
        },
        instructions: {
            inhale: 'Inhale naturally through your nose',
            exhale: 'Exhale slowly and completely, twice as long as inhale'
        },
        minTiming: { inhale: 3, exhale: 6 },
        maxTiming: { inhale: 6, exhale: 12 }
    }
};

/**
 * Get technique configuration by key
 * @param {string} techniqueKey - The technique identifier
 * @returns {Object} Technique configuration object
 */
function getTechnique(techniqueKey) {
    return BREATHING_TECHNIQUES[techniqueKey] || BREATHING_TECHNIQUES.box;
}

/**
 * Get all available techniques as array
 * @returns {Array} Array of technique objects with keys
 */
function getAllTechniques() {
    return Object.keys(BREATHING_TECHNIQUES).map(key => ({
        key,
        ...BREATHING_TECHNIQUES[key]
    }));
}

/**
 * Validate and sanitize timing configuration
 * @param {string} techniqueKey - The technique identifier
 * @param {Object} customTiming - Custom timing object
 * @returns {Object} Validated timing object
 */
function validateTiming(techniqueKey, customTiming) {
    const technique = getTechnique(techniqueKey);
    const validatedTiming = {};
    
    Object.keys(technique.defaultTiming).forEach(phase => {
        const customValue = customTiming[phase];
        const minValue = technique.minTiming[phase];
        const maxValue = technique.maxTiming[phase];
        const defaultValue = technique.defaultTiming[phase];
        
        if (typeof customValue === 'number' && customValue >= minValue && customValue <= maxValue) {
            validatedTiming[phase] = customValue;
        } else {
            validatedTiming[phase] = defaultValue;
        }
    });
    
    return validatedTiming;
}

/**
 * Get next phase in breathing cycle
 * @param {string} techniqueKey - The technique identifier
 * @param {string} currentPhase - Current phase name
 * @returns {string} Next phase name
 */
function getNextPhase(techniqueKey, currentPhase) {
    const technique = getTechnique(techniqueKey);
    const phases = technique.phases;
    const currentIndex = phases.indexOf(currentPhase);
    
    if (currentIndex === -1) {
        return phases[0]; // Default to first phase
    }
    
    return phases[(currentIndex + 1) % phases.length];
}

/**
 * Get phase display name for UI
 * @param {string} phase - Phase identifier
 * @returns {string} Display name
 */
function getPhaseDisplayName(phase) {
    const displayNames = {
        'inhale': 'Inhale',
        'exhale': 'Exhale',
        'hold': 'Hold',
        'hold1': 'Hold',
        'hold2': 'Hold',
        'left-inhale': 'Left Inhale',
        'right-inhale': 'Right Inhale',
        'left-exhale': 'Left Exhale',
        'right-exhale': 'Right Exhale',
        'power-breath': 'Power Breath',
        'retention': 'Retain',
        'recovery': 'Recovery',
        'rapid-breath': 'Rapid Breath'
    };
    
    return displayNames[phase] || phase.charAt(0).toUpperCase() + phase.slice(1);
}

/**
 * Get breathing instruction for current phase
 * @param {string} techniqueKey - The technique identifier
 * @param {string} phase - Current phase
 * @returns {string} Instruction text
 */
function getPhaseInstruction(techniqueKey, phase) {
    const technique = getTechnique(techniqueKey);
    return technique.instructions[phase] || `${getPhaseDisplayName(phase)} phase`;
}

/**
 * Check if technique requires special handling
 * @param {string} techniqueKey - The technique identifier
 * @returns {boolean} True if special technique
 */
function isSpecialTechnique(techniqueKey) {
    const technique = getTechnique(techniqueKey);
    return technique.special === true;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BREATHING_TECHNIQUES,
        getTechnique,
        getAllTechniques,
        validateTiming,
        getNextPhase,
        getPhaseDisplayName,
        getPhaseInstruction,
        isSpecialTechnique
    };
}