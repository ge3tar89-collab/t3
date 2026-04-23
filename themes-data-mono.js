/**
 * Mono and Grayscale Fretboard Themes Data
 */
const THEMES_DATA_MONO = {
    monoBlue: {
        background: '#E3F2FD',
        strings: '#1976D2',
        frets: '#1565C0',
        markers: '#0D47A1',
        intervals: {
            '1': '#90CAF9', 'b2': '#64B5F6', '2': '#42A5F5', 'b3': '#2196F3', '3': '#1E88E5',
            '4': '#1976D2', 'b5': '#1565C0', '5': '#0D47A1', '#5': '#82B1FF', '6': '#448AFF',
            'b7': '#2979FF', '7': '#2962FF'
        }
    },
    monoGreen: {
        background: '#E8F5E9',
        strings: '#388E3C',
        frets: '#2E7D32',
        markers: '#1B5E20',
        intervals: {
            '1': '#A5D6A7', 'b2': '#81C784', '2': '#66BB6A', 'b3': '#4CAF50', '3': '#43A047',
            '4': '#388E3C', 'b5': '#2E7D32', '5': '#1B5E20', '#5': '#B9F6CA', '6': '#69F0AE',
            'b7': '#00E676', '7': '#00C853'
        }
    },
    monoRed: {
        background: '#FFEBEE', strings: '#E53935', frets: '#C62828', markers: '#B71C1C',
        intervals: {
            '1': '#EF9A9A', 'b2': '#E57373', '2': '#EF5350', 'b3': '#F44336', '3': '#E53935',
            '4': '#D32F2F', 'b5': '#C62828', '5': '#B71C1C', '#5': '#FF8A80', '6': '#FF5252',
            'b7': '#FF1744', '7': '#D50000'
        }
    },
    grayscale: {
        background: '#FAFAFA',
        strings: '#616161',
        frets: '#424242',
        markers: '#212121',
        intervals: {
            '1': '#F5F5F5', 'b2': '#EEEEEE', '2': '#E0E0E0', 'b3': '#BDBDBD', '3': '#9E9E9E',
            '4': '#757575', 'b5': '#616161', '5': '#424242', '#5': '#BDBDBD', '6': '#9E9E9E',
            'b7': '#757575', '7': '#616161'
        }
    },
    blackAndWhite: {
        background: '#FFFFFF',
        strings: '#000000',
        frets: '#000000',
        markers: '#000000',
        intervals: {
            '1': '#000000', 'b2': '#333333', '2': '#000000', 'b3': '#333333', '3': '#000000',
            '4': '#333333', 'b5': '#000000', '5': '#333333', '#5': '#000000', '6': '#333333',
            'b7': '#000000', '7': '#333333'
        }
    }
};

if (typeof THEMES_DATA !== 'undefined') {
    Object.assign(THEMES_DATA, THEMES_DATA_MONO);
}