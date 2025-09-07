# 🌬️ BreatheWork - Chrome Extension

A comprehensive breathing exercise Chrome extension featuring scientifically-backed breathing techniques, dynamic audio experiences, and visual guidance for mindful breathing practice.

## ✨ Features

### Core Functionality
- **8 Scientifically-Backed Techniques**: Box breathing, 4-7-8, Triangle, Wim Hof, Coherent, Bellows, Alternate Nostril, and Extended Exhale
- **Customizable Timing**: Adjust inhale, hold, and exhale durations for each technique
- **Breath Counter**: Track total breath cycles and session progress
- **Session Goals**: Set goals by breath count or duration

### Audio Features
- **7 Background Sound Options**: Rain, Ocean, Forest, Pink/Brown/White Noise, or Silent
- **Dynamic Audio Crescendo**: Volume synchronizes with breathing phases
  - Volume increases during inhale
  - Steady level during hold phases  
  - Volume decreases during exhale
- **Procedural Audio Generation**: All sounds generated in real-time (no external files needed)

### Visual Interface
- **Phase Timers**: Separate visible timers for inhale, hold, and exhale
- **Breathing Guide**: Animated expanding/contracting circle
- **Real-time Progress**: Visual feedback for current phase and session progress
- **Breath Count Display**: Prominent display of completed breath cycles

### Technical Features
- **Offline Functionality**: Works completely offline once installed
- **Manifest v3**: Modern Chrome extension architecture
- **Responsive Design**: Adapts to different screen sizes
- **Persistent Settings**: Saves user preferences and session history
- **Session Statistics**: Track total sessions, breaths, time, and streaks

## 🏗️ Architecture

### File Structure
```
/app/
├── manifest.json              # Extension configuration
├── popup.html                 # Extension popup interface
├── main.html                  # Main breathing exercise app
├── settings.html              # Settings and preferences page
├── background.js              # Service worker for data management
├── styles/                    # CSS styling files
│   ├── popup.css
│   ├── main.css
│   └── settings.css
├── scripts/                   # JavaScript functionality
│   ├── techniques.js          # Breathing technique definitions
│   ├── audio.js              # Audio management and generation
│   ├── breathing-engine.js   # Core breathing exercise logic
│   ├── popup.js              # Popup interface logic
│   ├── main.js               # Main app functionality
│   └── settings.js           # Settings page logic
├── icons/                     # Extension icons (placeholder)
└── sounds/                    # Audio files directory (procedural generation used)
```

### Core Components

#### 1. Breathing Engine (`breathing-engine.js`)
- Manages breathing sessions and timing
- Handles phase transitions and progress tracking
- Supports custom timing configurations
- Manages session goals and completion

#### 2. Audio Manager (`audio.js`)
- Generates procedural white noise variations
- Manages dynamic volume changes during breathing phases
- Supports multiple background sound types
- Uses Web Audio API for precise control

#### 3. Techniques System (`techniques.js`)
- Defines 8 scientifically-backed breathing techniques
- Provides validation for custom timing
- Includes instruction text and benefits for each technique
- Supports special technique handling (Wim Hof, etc.)

#### 4. Data Persistence (`background.js`)
- Manages user settings and preferences
- Tracks session statistics and history
- Handles data cleanup and maintenance
- Provides statistics API for other components

## 🚀 Installation & Setup

### For Development/Testing

1. **Clone or Download**: Get the extension files
2. **Open Chrome**: Navigate to `chrome://extensions/`
3. **Enable Developer Mode**: Toggle the switch in the top right
4. **Load Extension**: Click "Load unpacked" and select the `/app` directory
5. **Pin Extension**: Click the puzzle piece icon and pin BreatheWork for easy access

### For Distribution

1. **Package Extension**: Zip the entire `/app` directory
2. **Chrome Web Store**: Upload through the Chrome Developer Dashboard
3. **Add Icons**: Replace placeholder icons with actual PNG files (16x16, 32x32, 48x48, 128x128)
4. **Test Thoroughly**: Verify all features work across different Chrome versions

## 🧘‍♀️ Breathing Techniques Guide

### 1. Box Breathing (4-4-4-4)
- **Purpose**: Stress reduction, focus improvement
- **Pattern**: Inhale 4s → Hold 4s → Exhale 4s → Hold 4s
- **Benefits**: Balances nervous system, reduces anxiety

### 2. 4-7-8 Breathing
- **Purpose**: Sleep promotion, relaxation
- **Pattern**: Inhale 4s → Hold 7s → Exhale 8s
- **Benefits**: Natural relaxant, reduces anxiety

### 3. Triangle Breathing
- **Purpose**: Balance and concentration
- **Pattern**: Inhale 4s → Hold 4s → Exhale 4s
- **Benefits**: Mental clarity, nervous system balance

### 4. Wim Hof Method
- **Purpose**: Energy boost, cold resistance
- **Pattern**: 30 power breaths → retention → recovery breath
- **Benefits**: Increases energy, enhances immune function

### 5. Coherent Breathing (5-5)
- **Purpose**: Heart rate variability
- **Pattern**: Inhale 5s → Exhale 5s
- **Benefits**: Cardiovascular health, emotional balance

### 6. Bellows Breathing
- **Purpose**: Alertness and energy
- **Pattern**: Rapid rhythmic breathing
- **Benefits**: Mental clarity, increased alertness

### 7. Alternate Nostril
- **Purpose**: Mental balance
- **Pattern**: Alternating breathing through each nostril
- **Benefits**: Brain hemisphere balance, focus

### 8. Extended Exhale
- **Purpose**: Deep relaxation
- **Pattern**: Inhale 4s → Exhale 8s
- **Benefits**: Activates parasympathetic system

## 🎵 Audio System

### Procedural Generation
The extension generates all audio in real-time using mathematical algorithms:

- **Rain**: Filtered noise with wave patterns
- **Ocean**: Low-frequency oscillations with gentle noise
- **Forest**: Rustling patterns with natural randomization
- **Pink Noise**: Balanced frequency spectrum (1/f noise)
- **Brown Noise**: Low-frequency emphasis for deep relaxation
- **White Noise**: Full spectrum random noise

### Dynamic Volume Control
- **Inhale Phase**: Volume gradually increases (50% → 100% of base)
- **Hold Phases**: Volume remains steady at base level
- **Exhale Phase**: Volume gradually decreases (100% → 70% of base)

## ⚙️ Settings & Customization

### User Preferences
- **Default Technique**: Choose preferred breathing method
- **Session Goals**: Set default breath count or duration goals
- **Audio Preferences**: Default background sound and volume
- **Interface Options**: Show/hide instructions, dark mode

### Custom Timing
- **Per-Technique**: Customize timing for each breathing technique
- **Validation**: Automatic validation within safe ranges
- **Presets**: Quick access to common variations

### Statistics Tracking
- **Session Count**: Total breathing sessions completed
- **Breath Count**: Total breaths taken across all sessions
- **Time Tracking**: Total time spent in breathing exercises
- **Streak Tracking**: Consecutive days with sessions

## 🔧 Technical Implementation

### Chrome Extension APIs Used
- **Storage API**: User preferences and session data
- **Runtime API**: Background script communication
- **Tabs API**: Opening new tabs for main app
- **Action API**: Extension popup management

### Web APIs Utilized
- **Web Audio API**: Procedural audio generation and control
- **Local Storage**: Temporary session state
- **Intersection Observer**: Visual element tracking (if needed)
- **Page Visibility API**: Handling background/foreground states

### Performance Optimizations
- **Efficient Timers**: Uses `setTimeout` and `setInterval` strategically
- **Memory Management**: Proper cleanup of audio contexts and timers
- **Smooth Animations**: CSS transforms for breathing circle animations
- **Minimal Footprint**: No external dependencies

## 🧪 Testing

### Manual Testing Checklist
- [ ] All 8 breathing techniques function correctly
- [ ] Audio plays and adjusts volume during phases
- [ ] Timers display accurate countdowns
- [ ] Session statistics are saved properly
- [ ] Settings persist between sessions
- [ ] Responsive design works on different screen sizes
- [ ] Keyboard shortcuts function as expected

### Browser Compatibility
- **Chrome**: v88+ (Manifest v3 requirement)
- **Edge**: v88+ (Chromium-based)
- **Opera**: v74+ (Chromium-based)

## 🚨 Known Issues & Limitations

### Current Limitations
1. **Audio Context**: Requires user interaction to start audio (browser policy)
2. **Mobile Support**: Optimized for desktop Chrome, mobile experience may vary
3. **Icon Placeholders**: Needs actual icon files for production release

### Future Enhancements
- **Progress Tracking**: Weekly/monthly breathing progress charts
- **Reminders**: Notification system for regular practice
- **Advanced Statistics**: Detailed session analytics
- **Export Data**: Backup and restore functionality
- **Community Features**: Share achievements and techniques

## 📝 License & Credits

### Open Source Components
- **Web Audio API**: Browser-native audio generation
- **CSS Grid/Flexbox**: Modern layout systems
- **Chrome Extension APIs**: Google Chrome platform

### Attribution
- Breathing techniques based on scientific research and traditional practices
- UI/UX inspired by modern wellness applications
- Audio generation algorithms adapted from digital signal processing techniques

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Make changes in the `/app` directory
3. Test in Chrome with developer mode
4. Submit pull request with detailed description

### Areas for Contribution
- **Icon Design**: Create professional extension icons
- **Audio Enhancement**: Improve procedural audio generation
- **New Techniques**: Add additional breathing methods
- **Accessibility**: Improve screen reader compatibility
- **Mobile Optimization**: Enhance mobile browser experience

## 📞 Support

For issues, questions, or feature requests:
1. Check the existing documentation
2. Review known issues section
3. Create detailed issue reports
4. Provide steps to reproduce problems

---

**Made with ❤️ for better breathing and wellness**

*BreatheWork v1.0.0 - Comprehensive Chrome Extension for Mindful Breathing*