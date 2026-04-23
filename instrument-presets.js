const INSTRUMENT_PRESETS = {
    'acoustic_guitar': { name: 'Acoustic Guitar', strings: 6, tunings: {
        'standard': ['E', 'A', 'D', 'G', 'B', 'E'],
        'whole_step_down': ['D', 'G', 'C', 'F', 'A', 'D']
    }},
    'electric_guitar': { name: 'Electric Guitar', strings: 6, tunings: {
        'standard': ['E', 'A', 'D', 'G', 'B', 'E'],
        'half_step_down': ['D#', 'G#', 'C#', 'F#', 'A#', 'D#']
    }},
    'classical_guitar': { name: 'Classical Guitar', strings: 6, tunings: {
        'standard': ['E', 'A', 'D', 'G', 'B', 'E'],
        'whole_step_down': ['D', 'G', 'C', 'F', 'A', 'D']
    }},
    'seven_string_guitar': { name: '7-String Guitar', strings: 7, tunings: {
        'standard': ['B', 'E', 'A', 'D', 'G', 'B', 'E'],
        'whole_step_down': ['A', 'D', 'G', 'C', 'F', 'A', 'D']
    }},
    'twelve_string_guitar': { name: '12-String Guitar', strings: 6, tunings: {
        'standard': ['E', 'A', 'D', 'G', 'B', 'E'],
        'half_step_down': ['D#', 'G#', 'C#', 'F#', 'A#', 'D#']
    }},
    'four_string_bass': { name: '4-String Bass Guitar', strings: 4, tunings: {
        'standard': ['E', 'A', 'D', 'G'],
        'whole_step_down': ['D', 'G', 'C', 'F']
    }},
    'five_string_bass': { name: '5-String Bass Guitar', strings: 5, tunings: {
        'standard': ['B', 'E', 'A', 'D', 'G'],
        'alternate': ['E', 'A', 'D', 'G', 'C']
    }},
    'six_string_bass': { name: '6-String Bass Guitar', strings: 6, tunings: {
        'standard': ['B', 'E', 'A', 'D', 'G', 'B'],
        'alternate': ['E', 'A', 'D', 'G', 'B', 'E']
    }},
    // Additional instruments
    'eight_string_guitar': { name: '8-String Guitar', strings: 8, tunings: {
        'standard': ['F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E'],
        'drop_e': ['E', 'B', 'E', 'A', 'D', 'G', 'B', 'E']
    }},
    'baritone_guitar': { name: 'Baritone Guitar', strings: 6, tunings: {
        'standard': ['B', 'E', 'A', 'D', 'F#', 'B'],
        'drop_a': ['A', 'E', 'A', 'D', 'F#', 'B']
    }},
    'resonator_guitar': { name: 'Resonator Guitar', strings: 6, tunings: {
        'standard': ['E', 'A', 'D', 'G', 'B', 'E'],
        'open_g': ['D', 'G', 'D', 'G', 'B', 'D']
    }},
    'tenor_guitar': { name: 'Tenor Guitar', strings: 4, tunings: {
        'standard': ['C', 'G', 'D', 'A'],
        'chicago': ['D', 'G', 'B', 'E']
    }},
    'violin': { name: 'Violin', strings: 4, tunings: {
        'standard': ['G', 'D', 'A', 'E'],
        'drop_d': ['G', 'D', 'A', 'D']
    }},
    'viola': { name: 'Viola', strings: 4, tunings: {
        'standard': ['C', 'G', 'D', 'A'],
        'scordatura': ['C', 'G', 'D', 'G']
    }},
    'cello': { name: 'Cello', strings: 4, tunings: {
        'standard': ['C', 'G', 'D', 'A'],
        'drop_g': ['C', 'G', 'D', 'G']
    }},
    'double_bass': { name: 'Double Bass', strings: 4, tunings: {
        'standard': ['E', 'A', 'D', 'G'],
        'orchestral': ['F#', 'B', 'E', 'A']
    }},
    'five_string_banjo': { name: '5-String Banjo', strings: 5, tunings: {
        'standard': ['G', 'D', 'G', 'B', 'D'],
        'double_c': ['G', 'C', 'G', 'C', 'D']
    }},
    'four_string_banjo': { name: '4-String Banjo', strings: 4, tunings: {
        'standard': ['C', 'G', 'D', 'A'],
        'chicago': ['D', 'G', 'B', 'E']
    }},
    'six_string_banjo': { name: '6-String Banjo', strings: 6, tunings: {
        'standard': ['E', 'A', 'D', 'G', 'B', 'E'],
        'open_g': ['D', 'G', 'D', 'G', 'B', 'D']
    }},
    'mandolin': { name: 'Mandolin', strings: 4, tunings: {
        'standard': ['G', 'D', 'A', 'E'],
        'open_g': ['G', 'D', 'G', 'B']
    }},
    'mandola': { name: 'Mandola', strings: 4, tunings: {
        'standard': ['C', 'G', 'D', 'A'],
        'octave_mandolin': ['G', 'D', 'A', 'E']
    }},
    'ukulele_soprano': { name: 'Soprano Ukulele', strings: 4, tunings: {
        'standard': ['G', 'C', 'E', 'A'],
        'low_g': ['G', 'C', 'E', 'A'] // Low G instead of high G
    }},
    'ukulele_tenor': { name: 'Tenor Ukulele', strings: 4, tunings: {
        'standard': ['G', 'C', 'E', 'A'],
        'low_g': ['G', 'C', 'E', 'A'] // Low G instead of high G
    }},
    'ukulele_baritone': { name: 'Baritone Ukulele', strings: 4, tunings: {
        'standard': ['D', 'G', 'B', 'E'],
        'alternate': ['C', 'G', 'B', 'E']
    }},
    'lap_steel': { name: 'Lap Steel Guitar', strings: 6, tunings: {
        'c6': ['C', 'E', 'G', 'A', 'C', 'E'],
        'open_g': ['D', 'G', 'D', 'G', 'B', 'D']
    }},
    'pedal_steel': { name: 'Pedal Steel Guitar', strings: 10, tunings: {
        'e9': ['B', 'D', 'E', 'F#', 'G#', 'B', 'E', 'G#', 'D#', 'F#'],
        'c6': ['C', 'F', 'A', 'C', 'E', 'G', 'A', 'C', 'E', 'G']
    }},
    'dobro': { name: 'Dobro', strings: 6, tunings: {
        'open_g': ['G', 'B', 'D', 'G', 'B', 'D'],
        'open_d': ['D', 'A', 'D', 'F#', 'A', 'D']
    }},
    'koto': { name: 'Koto', strings: 13, tunings: {
        'hira_joshi': ['D', 'G', 'A', 'A#', 'D', 'G', 'A', 'A#', 'D', 'G', 'A', 'A#', 'D'],
        'in_scale': ['E', 'F#', 'A', 'B', 'C', 'E', 'F#', 'A', 'B', 'C', 'E', 'F#', 'A']
    }},
    'sitar': { name: 'Sitar', strings: 7, tunings: {
        'standard': ['C', 'C#', 'G', 'C', 'C#', 'G', 'C'],
        'alternative': ['C#', 'D', 'G#', 'C#', 'D', 'G#', 'C#']
    }},
    'charango': { name: 'Charango', strings: 5, tunings: {
        'standard': ['G', 'C', 'E', 'A', 'E'],
        'argentina': ['A', 'D', 'F#', 'B', 'F#']
    }},
    'bouzouki': { name: 'Irish Bouzouki', strings: 4, tunings: {
        'standard': ['G', 'D', 'A', 'E'],
        'irish': ['G', 'D', 'A', 'D']
    }},
    'oud': { name: 'Oud', strings: 6, tunings: {
        'arabic': ['C', 'F', 'A', 'D', 'G', 'C'],
        'turkish': ['D', 'E', 'A', 'B', 'E', 'A']
    }}
};