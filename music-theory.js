/**
 * Music Theory Helper Class
 * Contains data and methods for notes, intervals, scales, and chords
 */
class MusicTheory {
    constructor() {
        // Define basic music theory components
        this.notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        // removed this.intervals -> moved to music-theory-data.js
        this.intervals = (typeof MUSIC_THEORY_DATA !== 'undefined') ? MUSIC_THEORY_DATA.intervals : {};
        this.gamuts = (typeof MUSIC_THEORY_DATA !== 'undefined') ? MUSIC_THEORY_DATA.gamuts : {};
        
        // removed this.scales -> moved to music-theory-data.js -> moved to scales-data-*.js
        this.scales = (typeof window.SCALES_DATA_LIST !== 'undefined') ? window.SCALES_DATA_LIST : {};
        
        // removed this.chords, keySignatures, enharmonicPairs, noteStyles, romanNumerals, solfege, standardTunings -> moved to music-theory-data.js
        if (typeof MUSIC_THEORY_DATA !== 'undefined') {
            this.chords = MUSIC_THEORY_DATA.chords;
            this.keySignatures = MUSIC_THEORY_DATA.keySignatures;
            this.enharmonicPairs = MUSIC_THEORY_DATA.enharmonicPairs;
            this.noteStyles = MUSIC_THEORY_DATA.noteStyles;
            this.romanNumerals = MUSIC_THEORY_DATA.romanNumerals;
            this.solfege = MUSIC_THEORY_DATA.solfege;
            this.standardTunings = MUSIC_THEORY_DATA.standardTunings;
        }
        
        // removed colorThemes definition (moved to THEMES_DATA in themes-data.js)
        this.colorThemes = (typeof THEMES_DATA !== 'undefined') ? THEMES_DATA : {};
        
        this.customPatterns = JSON.parse(localStorage.getItem('customPatterns')) || {};
        
        this.loadCustomData();
    }

    loadCustomData() {
        try {
            const storedData = localStorage.getItem('manic_rules_custom_data');
            if (storedData) {
                const customData = JSON.parse(storedData);
                ['intervals', 'chords', 'scales'].forEach(type => {
                    if (customData[type]) {
                        Object.keys(customData[type]).forEach(id => {
                            if (this[type] && this[type][id]) {
                                Object.assign(this[type][id], customData[type][id]);
                            } else if (this[type] && customData[type][id].name && customData[type][id].intervals) {
                                this[type][id] = customData[type][id];
                            }
                        });
                    }
                });
            }
        } catch (e) {
            console.error('Error parsing custom data:', e);
        }
    }
    
    // removed getRelatedModes() {} -> moved to music-theory-logic.js

    // removed getRelatedChords() {} -> moved to music-theory-logic.js
    // removed getChordQualityFromIntervals() {} -> moved to music-theory-logic.js

    // removed getExpectedNotes() {} -> moved to music-theory-logic.js
    // removed getExpectedNoteForDegree() {} -> moved to music-theory-logic.js
    // removed adjustNoteToExpected() {} -> moved to music-theory-logic.js

    getScaleNotes(key, scaleType) {
        if (!this.scales[scaleType]) {
            return [];
        }
        
        const keyIndex = this.notes.indexOf(key);
        if (keyIndex === -1) {
            return [];
        }
        
        const intervals = this.scales[scaleType].intervals;
        let computed = intervals.map(interval => this.getNoteFromInterval(key, interval));
        // Generate expected note names for the scale degrees based on the tonic key.
        let expected = this.getExpectedNotes(key, computed.length);
        
        let finalNotes = computed.map((n, i) => this.adjustNoteToExpected(n, expected[i]));
        return finalNotes;
    }

    getChordNotes(key, chordType) {
        if (!this.chords[chordType]) {
            return [];
        }
        
        const keyIndex = this.notes.indexOf(key);
        if (keyIndex === -1) {
            return [];
        }
        
        const intervals = this.chords[chordType].intervals;
        let computed = intervals.map(interval => this.getNoteFromInterval(key, interval));
        let expected = this.getExpectedNotes(key, computed.length);
        let finalNotes = computed.map((n, i) => this.adjustNoteToExpected(n, expected[i]));
        return finalNotes;
    }

    getCustomNotes(key, customId) {
        if (!this.customPatterns || !this.customPatterns[customId]) return [];
        const intervals = this.customPatterns[customId].intervals;
        let computed = intervals.map(interval => this.getNoteFromInterval(key, interval)).filter(Boolean);
        return computed;
    }

    /**
     * Get a note based on a starting note and interval
     */
    getNoteFromInterval(startNote, interval) {
        const startIndex = this.notes.indexOf(startNote);
        if (startIndex === -1) {
            return null;
        }
        
        // Handle special case: map #2 to b3 (they're enharmonic equivalents)
        if (interval === '#2') {
            interval = 'b3';
        }
        
        const semitones = this.intervals[interval]?.semitones || 0;
        const noteIndex = (startIndex + semitones) % 12;
        return this.notes[noteIndex];
    }
    
    /**
     * Get interval between two notes
     */
    getInterval(startNote, endNote) {
        const startIndex = this.notes.indexOf(startNote);
        const endIndex = this.notes.indexOf(endNote);
        
        if (startIndex === -1 || endIndex === -1) {
            return null;
        }
        
        let semitones = (endIndex - startIndex + 12) % 12;
        
        // Find the interval based on semitones
        for (const [intervalName, data] of Object.entries(this.intervals)) {
            if (data.semitones === semitones) {
                return intervalName;
            }
        }
        
        return null;
    }
    
    /**
     * Get Roman numeral for a scale degree
     */
    getRomanNumeral(scaleDegree, isMajor = true) {
        const index = scaleDegree - 1;
        if (index < 0 || index >= 7) return '';
        return isMajor ? this.romanNumerals.major[index] : this.romanNumerals.minor[index];
    }
    
    /**
     * Get default tuning for a given number of strings
     */
    getDefaultTuning(stringCount) {
        // Return the standard tuning if it exists
        if (this.standardTunings[stringCount]) {
            return [...this.standardTunings[stringCount]];
        }
        
        // For non-standard string counts, generate something reasonable
        if (stringCount <= 3) {
            return Array(stringCount).fill().map((_, i) => {
                const index = (7 + i * 5) % 12; // Perfect 4ths
                return this.notes[index];
            });
        } else {
            // Add lower strings
            const baseTuning = [...this.standardTunings[6]]; // Guitar tuning
            
            if (stringCount < 6) {
                return baseTuning.slice(0, stringCount);
            } else {
                // Add lower strings
                const extraLow = Array(stringCount - 6).fill().map((_, i) => {
                    const noteIndex = (this.notes.indexOf('E') - (i + 1) * 5 + 12) % 12;
                    return this.notes[noteIndex];
                });
                return [...extraLow, ...baseTuning];
            }
        }
    }
    
    // removed getChordInversions() {} -> moved to music-theory-logic.js
    // removed getScaleDescription() {} -> moved to music-theory-logic.js
    // removed getChordDescription() {} -> moved to music-theory-logic.js
    // removed getIntervalQuality() {} -> moved to music-theory-logic.js
    // removed getIntervalConsonance() {} -> moved to music-theory-logic.js
    // removed getChordFromRoman() {} -> moved to music-theory-logic.js

    /**
     * Get the frequency for a note at a specific octave
     */
    getNoteFrequency(note, octave) {
        const A4 = 440;
        const A4Index = this.notes.indexOf('A');
        const noteIndex = this.notes.indexOf(note);
        if (noteIndex === -1) return null;
        const halfStepsFromA4 = (noteIndex - A4Index) + (octave - 4) * 12;
        return A4 * Math.pow(2, halfStepsFromA4 / 12);
    }
}