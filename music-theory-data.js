const MUSIC_THEORY_DATA = {
    intervals: {
        '1':  { name: 'Root/Unison', shortName: 'R',  semitones: 0,  color: '#140000', fontColor: '#FFFFFF' },
        'b2': { name: 'Minor 2nd',  shortName: 'b2', semitones: 1,  color: '#280000', fontColor: '#FFFFFF' },
        '2':  { name: 'Major 2nd',  shortName: '2',  semitones: 2,  color: '#3C0000', fontColor: '#FFFFFF' },
        '#2': { name: 'Augmented 2nd', shortName: '#2', semitones: 3, color: '#500000', fontColor: '#FFFFFF' },
        'b3': { name: 'Minor 3rd',  shortName: 'b3', semitones: 3,  color: '#640000', fontColor: '#FFFFFF' },
        '3':  { name: 'Major 3rd',  shortName: '3',  semitones: 4,  color: '#780000', fontColor: '#FFFFFF' },
        '4':  { name: 'Perfect 4th', shortName: '4',  semitones: 5,  color: '#8C0000', fontColor: '#FFFFFF' },
        '#4': { name: 'Augmented 4th', shortName: '#4', semitones: 6, color: '#8C0000', fontColor: '#FFFFFF' },
        'b5': { name: 'Diminished 5th', shortName: 'b5', semitones: 6, color: '#8C0000', fontColor: '#FFFFFF' },
        '5':  { name: 'Perfect 5th', shortName: '5',  semitones: 7,  color: '#A00000', fontColor: '#FFFFFF' },
        'b6': { name: 'Minor 6th',  shortName: 'b6', semitones: 8,  color: '#B40000', fontColor: '#FFFFFF' },
        '6':  { name: 'Major 6th',  shortName: '6',  semitones: 9,  color: '#C80000', fontColor: '#FFFFFF' },
        'b7': { name: 'Minor 7th',  shortName: 'b7', semitones: 10, color: '#DC0000', fontColor: '#FFFFFF' },
        '7':  { name: 'Major 7th',  shortName: '7',  semitones: 11, color: '#F00000', fontColor: '#FFFFFF' }
    },
    gamuts: (function() {
        const g = {
            '000001': {
                name: 'Gamut 000001',
                positions: [
                    { string: 0, fret: 5 }, { string: 0, fret: 6 },
                    { string: 1, fret: 5 }, { string: 1, fret: 6 },
                    { string: 2, fret: 5 }, { string: 2, fret: 6 },
                    { string: 3, fret: 5 }, { string: 3, fret: 6 },
                    { string: 4, fret: 5 }, { string: 4, fret: 6 },
                    { string: 5, fret: 5 }, { string: 5, fret: 6 }
                ]
            }
        };
        // Add 100 more systematically generated block gamuts
        for (let i = 2; i <= 101; i++) {
            const id = i.toString().padStart(6, '0');
            const startFret = ((i - 2) % 20) + 1;
            const span = Math.floor((i - 2) / 20) + 2;
            const positions = [];
            for (let s = 0; s < 6; s++) {
                for (let f = 0; f < span; f++) {
                    positions.push({ string: s, fret: startFret + f });
                }
            }
            g[id] = {
                name: `Gamut ${id}`,
                positions: positions
            };
        }
        // Add 100 more gamuts with specific fret patterns (e.g. 124, 134)
        const patterns = [
            [0, 1, 3], // 1-2-4
            [0, 2, 3], // 1-3-4
            [0, 2, 4], // 1-3-5
            [0, 1, 4], // 1-2-5
            [0, 1, 2, 4], // 1-2-3-5
            [0, 1, 3, 4], // 1-2-4-5
            [0, 2, 3, 4], // 1-3-4-5
            [0, 1, 2, 3, 5],
            [0, 1, 3, 5],
            [0, 1, 4, 5]
        ];
        for (let i = 102; i <= 201; i++) {
            const id = i.toString().padStart(6, '0');
            const patternIdx = (i - 102) % patterns.length;
            const p = patterns[patternIdx];
            const startFret = (((i - 102) / patterns.length) | 0) % 20 + 1;
            const positions = [];
            for (let s = 0; s < 6; s++) {
                for (const offset of p) {
                    positions.push({ string: s, fret: startFret + offset });
                }
            }
            g[id] = {
                name: `Gamut ${id} Pattern ${p.map(x => x + 1).join('')}`,
                positions: positions
            };
        }

        // NEW: Add 50 gamuts focusing on 4-string patterns (strings grouped as 6-3, 5-2, 4-1)
        // IDs 000202 - 000251
        (function addFourStringPatterns() {
            const groups = [
                { name: '6-3', strings: [5,4,3,2] }, // top-to-bottom index: string 6 -> index 5 ... string 3 -> index 2
                { name: '5-2', strings: [4,3,2,1] },
                { name: '4-1', strings: [3,2,1,0] }
            ];
            // A set of small fret patterns to place across the 4-string span
            const fourPatterns = [
                [0,1,3,5],
                [0,2,4,6],
                [1,2,3,4],
                [0,1,4,5],
                [2,3,5,7],
                [0,3,5,8],
                [1,4,6,8],
                [0,2,5,7],
                [0,1,2,3],
                [3,4,5,6]
            ];
            let startId = 202;
            for (let idx = 0; idx < 50; idx++) {
                const id = startId + idx;
                const idStr = id.toString().padStart(6, '0');
                const group = groups[idx % groups.length];
                const pattern = fourPatterns[idx % fourPatterns.length];
                // stagger start frets so patterns are distributed across the neck
                const startFret = ((idx * 3) % 16) + 1;
                const positions = [];
                // map a single pattern offset to each of the group's 4 strings so there is only one note per string
                for (let i = 0; i < group.strings.length; i++) {
                    const s = group.strings[i];
                    // assign one offset per string (wrap pattern if shorter than strings)
                    const offset = pattern[i % pattern.length];
                    positions.push({ string: s, fret: startFret + offset });
                }
                g[idStr] = {
                    name: `Gamut ${idStr} (${group.name} 4-string single-note-per-string pattern)`,
                    positions: positions
                };
            }

            // ADDITIONAL: Add 50 more 4-string single-note-per-string gamuts (IDs 000252 - 000301)
            // Use different start fret staggering and pattern rotation to diversify placements
            let extraStartId = 252;
            for (let idx = 0; idx < 50; idx++) {
                const id = extraStartId + idx;
                const idStr = id.toString().padStart(6, '0');
                const group = groups[(idx + 1) % groups.length]; // shift group selection for variety
                const pattern = fourPatterns[(idx + 3) % fourPatterns.length]; // different rotation
                // stagger start frets differently so these occupy other neck regions
                const startFret = (((idx * 4) + 5) % 18) + 1;
                const positions = [];
                for (let i = 0; i < group.strings.length; i++) {
                    const s = group.strings[i];
                    const offset = pattern[i % pattern.length];
                    positions.push({ string: s, fret: startFret + offset });
                }
                g[idStr] = {
                    name: `Gamut ${idStr} (${group.name} 4-string single-note-per-string pattern)`,
                    positions: positions
                };
            }
        })();

        return g;
    })(),
    // removed scales object -> moved to scales-data-list.js
    chords: {
        'major': { name: 'Major', intervals: ['1', '3', '5'] },
        'minor': { name: 'Minor', intervals: ['1', 'b3', '5'] },
        'diminished': { name: 'Diminished', intervals: ['1', 'b3', 'b5'] },
        'augmented': { name: 'Augmented', intervals: ['1', '3', '#5'] },
        'sus2': { name: 'Sus2', intervals: ['1', '2', '5'] },
        'sus4': { name: 'Sus4', intervals: ['1', '4', '5'] },
        'major7': { name: 'Major 7', intervals: ['1', '3', '5', '7'] },
        'dominant7': { name: 'Dominant 7', intervals: ['1', '3', '5', 'b7'] },
        'minor7': { name: 'Minor 7', intervals: ['1', 'b3', '5', 'b7'] },
        'diminished7': { name: 'Diminished 7', intervals: ['1', 'b3', 'b5', '6'] },
        'half_diminished': { name: 'Half Diminished', intervals: ['1', 'b3', 'b5', 'b7'] },
        'augmented7': { name: 'Augmented 7', intervals: ['1', '3', '#5', 'b7'] },
        'add9': { name: 'Add9', intervals: ['1', '3', '5', '2'] },
        '6': { name: '6', intervals: ['1', '3', '5', '6'] },
        'm6': { name: 'Minor 6', intervals: ['1', 'b3', '5', '6'] },
        'maj9': { name: 'Major 9', intervals: ['1', '3', '5', '7', '2'] },
        'dom9': { name: 'Dominant 9', intervals: ['1', '3', '5', 'b7', '2'] },
        'min9': { name: 'Minor 9', intervals: ['1', 'b3', '5', 'b7', '2'] },
        'maj11': { name: 'Major 11', intervals: ['1', '3', '5', '7', '2', '4'] },
        'dom11': { name: 'Dominant 11', intervals: ['1', '3', '5', 'b7', '2', '4'] },
        'min11': { name: 'Minor 11', intervals: ['1', 'b3', '5', 'b7', '2', '4'] },
        'maj13': { name: 'Major 13', intervals: ['1', '3', '5', '7', '2', '4', '6'] },
        'dom13': { name: 'Dominant 13', intervals: ['1', '3', '5', 'b7', '2', '4', '6'] },
        'min13': { name: 'Minor 13', intervals: ['1', 'b3', '5', 'b7', '2', '4', '6'] },
        '7sus4': { name: '7sus4', intervals: ['1', '4', '5', 'b7'] },
        '9sus4': { name: '9sus4', intervals: ['1', '4', '5', 'b7', '2'] },
        'add11': { name: 'Add11', intervals: ['1', '3', '5', '4'] },
        'madd11': { name: 'Minor Add11', intervals: ['1', 'b3', '5', '4'] },
        'madd9': { name: 'Minor Add9', intervals: ['1', 'b3', '5', '2'] },
        '7b9': { name: '7(b9)', intervals: ['1', '3', '5', 'b7', 'b2'] },
        '7#9': { name: '7(#9)', intervals: ['1', '3', '5', 'b7', '#2'] },
        '7#11': { name: '7(#11)', intervals: ['1', '3', '5', 'b7', '#4'] },
        '7b13': { name: '7(b13)', intervals: ['1', '3', '5', 'b7', 'b6'] },
        '7#5': { name: '7(#5)', intervals: ['1', '3', '#5', 'b7'] },
        '7b5': { name: '7(b5)', intervals: ['1', '3', 'b5', 'b7'] },
        'alt7': { name: 'Altered 7', intervals: ['1', '3', 'b5', 'b7', 'b9', '#9'] },
        'maj7#5': { name: 'Maj7(#5)', intervals: ['1', '3', '#5', '7'] },
        'maj7b5': { name: 'Maj7(b5)', intervals: ['1', '3', 'b5', '7'] },
        'm7b5': { name: 'm7(b5)', intervals: ['1', 'b3', 'b5', 'b7'] },
        'maj7#11': { name: 'Maj7(#11)', intervals: ['1', '3', '5', '7', '#4'] },
        '5': { name: '5 (Power Chord)', intervals: ['1', '5'] },
        'dim7b9': { name: 'dim7(b9)', intervals: ['1', 'b3', 'b5', '6', 'b2'] },
        'm7#5': { name: 'm7(#5)', intervals: ['1', 'b3', '#5', 'b7'] },
        '6add9': { name: '6/9', intervals: ['1', '3', '5', '6', '2'] },
        'm6add9': { name: 'm6/9', intervals: ['1', 'b3', '5', '6', '2'] },
        '7sus2': { name: '7sus2', intervals: ['1', '2', '5', 'b7'] },
        '13sus4': { name: '13sus4', intervals: ['1', '4', '5', 'b7', '6'] },
        'maj7sus2': { name: 'Maj7sus2', intervals: ['1', '2', '5', '7'] },
        'maj7sus4': { name: 'Maj7sus4', intervals: ['1', '4', '5', '7'] },
        'maj9#11': { name: 'Maj9(#11)', intervals: ['1', '3', '5', '7', '2', '#4'] },
        'maj13#11': { name: 'Maj13(#11)', intervals: ['1', '3', '5', '7', '2', '#4', '6'] },
        '9#5': { name: '9(#5)', intervals: ['1', '3', '#5', 'b7', '2'] },
        '9b5': { name: '9(b5)', intervals: ['1', '3', 'b5', 'b7', '2'] },
        '13#9': { name: '13(#9)', intervals: ['1', '3', '5', 'b7', '#2', '4', '6'] },
        '13b9': { name: '13(b9)', intervals: ['1', '3', '5', 'b7', 'b2', '4', '6'] },
        '7#9#5': { name: '7(#9#5)', intervals: ['1', '3', '#5', 'b7', '#2'] },
        '7b9#5': { name: '7(b9#5)', intervals: ['1', '3', '#5', 'b7', 'b2'] },
        '7b9b5': { name: '7(b9b5)', intervals: ['1', '3', 'b5', 'b7', 'b2'] },
        '7#9b5': { name: '7(#9b5)', intervals: ['1', '3', 'b5', 'b7', '#2'] },
        '7b9#11': { name: '7(b9#11)', intervals: ['1', '3', '5', 'b7', 'b2', '#4'] },
        '7#9#11': { name: '7(#9#11)', intervals: ['1', '3', '5', 'b7', '#2', '#4'] },
        'maj7b9': { name: 'Maj7(b9)', intervals: ['1', '3', '5', '7', 'b2'] },
        'maj7#9': { name: 'Maj7(#9)', intervals: ['1', '3', '5', '7', '#2'] },
        'maj7b5b9': { name: 'Maj7(b5b9)', intervals: ['1', '3', 'b5', '7', 'b2'] },
        'maj7#5b9': { name: 'Maj7(#5b9)', intervals: ['1', '3', '#5', '7', 'b2'] },
        'maj7#5#9': { name: 'Maj7(#5#9)', intervals: ['1', '3', '#5', '7', '#2'] },
        'm9b5': { name: 'm9(b5)', intervals: ['1', 'b3', 'b5', 'b7', '2'] },
        'm9#5': { name: 'm9(#5)', intervals: ['1', 'b3', '#5', 'b7', '2'] },
        'm11b5': { name: 'm11(b5)', intervals: ['1', 'b3', 'b5', 'b7', '2', '4'] },
        'dim9': { name: 'dim9', intervals: ['1', 'b3', 'b5', '6', '2'] },
        'aug9': { name: 'aug9', intervals: ['1', '3', '#5', 'b7', '2'] },
        'sus4b9': { name: 'sus4(b9)', intervals: ['1', '4', '5', 'b7', 'b2'] },
        'sus4#9': { name: 'sus4(#9)', intervals: ['1', '4', '5', 'b7', '#2'] },
        'm7add11': { name: 'm7(add11)', intervals: ['1', 'b3', '5', 'b7', '4'] },
        'm6add11': { name: 'm6(add11)', intervals: ['1', 'b3', '5', '6', '4'] }
    },
    keySignatures: {
        "C": {},
        "G": {"F": "#"},
        "D": {"F": "#", "C": "#"},
        "A": {"F": "#", "C": "#", "G": "#"},
        "E": {"F": "#", "C": "#", "G": "#", "D": "#"},
        "B": {"F": "#", "C": "#", "G": "#", "D": "#", "A": "#"},
        "F#": {"F": "#", "C": "#", "G": "#", "D": "#", "A": "#", "E": "#"},
        "C#": {"F": "#", "C": "#", "G": "#", "D": "#", "A": "#", "E": "#", "B": "#"},
        "F": {"B": "b"},
        "Bb": {"B": "b", "E": "b"},
        "Eb": {"B": "b", "E": "b", "A": "b"},
        "Ab": {"B": "b", "E": "b", "A": "b", "D": "b"},
        "Db": {"B": "b", "E": "b", "A": "b", "D": "b", "G": "b"},
        "Gb": {"B": "b", "E": "b", "A": "b", "D": "b", "G": "b", "C": "b"},
        "Cb": {"B": "b", "E": "b", "A": "b", "D": "b", "G": "b", "C": "b", "F": "b"}
    },
    enharmonicPairs: {
        "A#": "Bb", "Bb": "A#",
        "C#": "Db", "Db": "C#",
        "D#": "Eb", "Eb": "D#",
        "F#": "Gb", "Gb": "F#",
        "G#": "Ab", "Ab": "G#"
    },
    noteStyles: {
        shapes: ['circle', 'square', 'diamond', 'triangle', 'hexagon', 'star', 'pentagon', 'octagon', 'heart', 'cross', 
                'plus', 'arrow', 'teardrop', 'oval', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid', 'semicircle', 
                'crescent', 'ring', 'crosshair', 'donut', 'clover', 'flower', 'shield', 'crown', 'droplet', 'cloud', 
                'starburst', 'gear', 'cube', 'moon', 'sun', 'flag', 'ribbon', 'tag', 'bookmark', 'lightning', 'key'],
        fonts: [
            'Arial', 'Arial Black', 'Arial Narrow', 'Courier New', 'Georgia', 'Gill Sans', 'Helvetica', 'Impact', 
            'Lucida Sans Unicode', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana',
            'American Typewriter', 'Andale Mono', 'Baskerville', 'Big Caslon', 'Book Antiqua', 'Bookman Old Style', 
            'Brush Script MT', 'Calibri', 'Cambria', 'Candara', 'Century Gothic', 'Century Schoolbook', 
            'Comic Sans MS', 'Consolas', 'Constantia', 'Copperplate', 'Courier', 'Didot', 'Franklin Gothic Medium', 
            'Futura', 'Gadget', 'Garamond', 'Geneva', 'Goudy Old Style', 'Hoefler Text', 'Inconsolata', 
            'Lucida Bright', 'Lucida Console', 'Lucida Grande', 'Lucida Sans Typewriter', 'Monaco', 'Optima', 
            'Palatino', 'Palatino Linotype', 'Papyrus', 'Perpetua', 'Rockwell', 'Segoe UI',
            'Apple Chancery', 'Avantgarde', 'Bodoni 72', 'Bradley Hand', 'Chalkboard', 'Chalkduster', 'Charter', 
            'Cochin', 'Copperplate Gothic Bold', 'Edwardian Script ITC', 'Eras ITC', 'Eurostile', 'FangSong', 
            'Fixedsys', 'Freestyle Script', 'Harrington', 'Herculanum', 'High Tower Text', 'Jazz LET', 
            'Jokerman', 'KaiTi', 'Marker Felt', 'Mistral', 'Modern No. 20', 'Old English Text MT', 'Onyx', 
            'Party LET', 'Playbill', 'Snell Roundhand', 'Zapfino'
        ],
        effects: ['none', 'glow', 'shadow', 'outline', 'highlight', 'pulsate', 'blink', 'wobble', 'rotate', 'bounce', 
                'flip', 'shake', 'jelly', 'fade', 'grow', 'shrink', 'blur', 'vibrate', 'sparkle', 'ripple',
                'wave', 'neon', 'shatter', 'glitch', 'rainbow', 'zoom', 'twinkle', 'splash', 'heatwave',
                'chroma', 'emboss', 'metallic', 'neumorphic', 'holographic', 'retro', 'pixelate', 'sketch',
                'paint', 'grime', 'distortion', 'liquefy', 'frosted', 'carved', 'vignette', 'noise', 'sticker',
                'psychedelic', 'relief', 'foil', 'brushed', 'glazed', 'watercolor', 'comic', 'bubble', 'gradient-pulse']
    },
    romanNumerals: {
        major: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'],
        minor: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii']
    },
    solfege: {
        'C': 'Do', 'C#': 'Di', 'D': 'Re', 'D#': 'Ri', 
        'E': 'Mi', 'F': 'Fa', 'F#': 'Fi', 'G': 'Sol', 
        'G#': 'Si', 'A': 'La', 'A#': 'Li', 'B': 'Ti'
    },
    standardTunings: {
        4: ['G', 'D', 'A', 'E'],
        5: ['G', 'D', 'A', 'E', 'B'],
        6: ['E', 'A', 'D', 'G', 'B', 'E'],
        7: ['B', 'E', 'A', 'D', 'G', 'B', 'E'],
        8: ['F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E'],
        12: ['E', 'E', 'A', 'A', 'D', 'D', 'G', 'G', 'B', 'B', 'E', 'E']
    }
};