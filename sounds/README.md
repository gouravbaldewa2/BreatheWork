# BreatheWork Audio Files

This directory is intended for audio files used in the BreatheWork Chrome extension.

## Current Implementation

The extension currently uses **procedural audio generation** through the Web Audio API instead of pre-recorded files. This means:

- All white noise variations are generated mathematically in real-time
- No external audio files are needed for basic functionality
- The extension works completely offline
- Smaller file size overall

## Procedural Audio Types Generated

1. **Rain Sound** - Generated using filtered noise with wave patterns
2. **Ocean Waves** - Created with low-frequency oscillations and noise
3. **Forest Ambience** - Gentle rustling patterns with randomization
4. **Pink Noise** - Balanced frequency spectrum noise
5. **Brown Noise** - Low-frequency heavy noise
6. **White Noise** - Full spectrum random noise

## If You Want Real Audio Files

If you prefer to use actual recorded audio files instead of procedural generation:

1. Add audio files in formats: `.mp3`, `.ogg`, `.wav`
2. Update the `audio.js` file to load these files
3. Modify the `manifest.json` to include audio files as web accessible resources

## Audio File Requirements

- **Format**: MP3 or OGG for best browser compatibility
- **Length**: 30-60 seconds (will be looped)
- **Quality**: 128kbps is sufficient for background sounds
- **Volume**: Normalized to prevent sudden loud sounds
- **Looping**: Should loop seamlessly without noticeable cuts

## Legal Considerations

- Use royalty-free or Creative Commons licensed audio
- Attribute sources as required by licenses
- Consider file size impact on extension download