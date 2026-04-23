/**
 * Main Application Class
 * Controls the UI, fretboard, and audio playback
 */
class App {
    constructor() {
        // Initialize music theory and fretboard
        this.musicTheory = new MusicTheory();
        this.fretboard = new Fretboard('fretboard', this.musicTheory);
        
        // Audio synth
        this.synth = null;
        if (typeof this.initSynth === 'function') {
            this.initSynth();
        }
        
        // State
        this.slideshowItems = [];
        this.generatedPatterns = [];
        this.tempo = 120; // Default tempo (BPM)
        this.customFilename = null; // Custom filename for exports
        this.sidebarVisible = true; // default state
        const savedSidebar = localStorage.getItem('sidebarVisible');
        if (savedSidebar !== null) {
            this.sidebarVisible = savedSidebar === 'true';
        }
        
        // NEW: Set titleVisible to true by default
        this.titleVisible = true;
        
        // Initialize collapsed state for sections
        this.collapsedSections = JSON.parse(localStorage.getItem('collapsedSections')) || {};
        
        // Instrument presets
        // removed this.instrumentPresets data object
        this.instrumentPresets = typeof INSTRUMENT_PRESETS !== 'undefined' ? INSTRUMENT_PRESETS : {};
        
        // Add 50 default chord progression patterns.
        this.chordProgressionPatterns = [];
        for (let i = 1; i <= 50; i++) {
            this.chordProgressionPatterns.push({
                id: 'cp' + i,
                name: 'Chord Progression ' + i,
                progression: 'I:4 IV:4 V:4'
            });
        }
        
        // removed lessons data initialization -> moved to app-lessons-data.js
        if (typeof this.initLessonsData === 'function') this.initLessonsData();
        
        // Add instrument and tuning dropdowns
        this.addInstrumentDropdowns();
        
        // Audio & Components
        this.audioPlayer = typeof AudioPlayer !== 'undefined' ? new AudioPlayer(this) : null;
        
        // State
        this.slideshowItems = [];
        this.generatedPatterns = [];
        this.tempo = 120; // Default tempo (BPM)
        this.customFilename = null; // Custom filename for exports
        
        // Initialize the UI
        this.initUI();
    }
    
    // removed initSynth() {} -> moved to app-playback.js
    
    /**
     * Initialize the UI and set up event listeners
     */
    initUI() {
        // Add backdrop for sidebar
        const backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        backdrop.addEventListener('click', () => this.toggleSidebar());
        document.body.appendChild(backdrop);
        
        // NEW: Inject bottom controls before they are referenced
        if (typeof this.injectBottomControls === 'function') {
            this.injectBottomControls();
        }

        // Add instrument and tuning dropdowns
        this.addInstrumentDropdowns();
        
        // Populate theme dropdowns (Must happen before loading default settings)
        this.populateThemeDropdowns();

        // Set up tuning input based on default string count
        this.updateTuningInputs();

        // Load and apply default settings (This also updates the pattern select and sets its value)
        this.loadAndApplyDefaultSettings();
        
        // Populate custom color inputs
        this.createCustomColorInputs();
        
        // Update string and fret input displays
        this.updateStringAndFretLabels();
        
        // Add fret number options
        this.addFretNumberOptions();
        
        // Add note appearance options
        this.addNoteAppearanceOptions();
        
        // Add string appearance options
        this.addStringAppearanceOptions();
        
        // Add fret appearance options
        this.addFretAppearanceOptions();
        
        // Add tempo control
        this.addTempoControl();
        
        // Add theory info display options
        this.addTheoryInfoOptions();
        
        // Init piano functionality
        if (typeof Piano !== 'undefined') {
            Piano.init(this);
        }
        
        // Add MP3 player controls
        this.addMp3PlayerControls();
        
        // Move control buttons
        this.moveControlButtons();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial fretboard draw
        this.updateFretboard();
        
        // Show music theory info
        this.updateTheoryInfo();

        // Check URL params to auto-open a pattern on load (e.g., index.html?patternType=scale&pattern=major&key=C)
        try {
            const params = new URLSearchParams(window.location.search);
            const pType = params.get('patternType');
            const pPattern = params.get('pattern');
            const pKey = params.get('key');
            if (pType) {
                const patternTypeSelect = document.getElementById('pattern-type');
                if (patternTypeSelect) {
                    patternTypeSelect.value = pType;
                    this.updatePatternSelect();
                }
            }
            if (pPattern) {
                const patternSelect = document.getElementById('pattern-select');
                if (patternSelect) {
                    // Only set if option exists (updatePatternSelect ensures options are populated)
                    const isValid = Array.from(patternSelect.options).some(o => o.value === pPattern);
                    if (isValid) patternSelect.value = pPattern;
                }
            }
            if (pKey) {
                const keySelect = document.getElementById('key-select');
                if (keySelect) {
                    // Accept sharps and flats passed in URL
                    if (Array.from(keySelect.options).some(o => o.value === pKey)) {
                        keySelect.value = pKey;
                    }
                }
            }
            // If any parameter was present, apply to fretboard
            if (pType || pPattern || pKey) {
                // Ensure UI selections applied then redraw
                this.updateFretboard();
            }
        } catch (err) {
            console.warn('Error parsing URL params:', err);
        }

        // Listen for data changes from Application Data page
        window.addEventListener('storage', (e) => {
            if (e.key === 'manic_rules_custom_data') {
                this.musicTheory.loadCustomData();
                this.updateFretboard();
            }
        });
        
        // Add melodic pattern handling
        this.setupMelodicPatternControls();
        
        // Setup chromatic tuner
        this.setupChromaticTuner();
        
        // Setup collapsible sections
        this.setupCollapsibleSections();
        
        // Add theme switching functionality
        this.setupThemeSwitching();
        
        // Init sidebar state based on user preference
        const sidebar = document.querySelector('.sidebar');
        if (this.sidebarVisible) {
            sidebar.classList.add('sidebar-visible');
            backdrop.classList.add('visible');
        } else {
            sidebar.classList.remove('sidebar-visible');
            backdrop.classList.remove('visible');
        }
    }
    
    // removed toggleSidebar() {} -> moved to app-ui-layout.js
    
    // removed setupEventListeners() {} -> moved to app-events.js
    // removed updateTuningInputs() {} -> moved to app-instrument.js
    // removed updatePatternSelect() {} -> moved to app-ui.js
    // removed populateThemeDropdowns() {} -> moved to app-ui.js
    // removed createCustomColorInputs() {} -> moved to app-ui-appearance.js
    // removed addColorPicker() {} -> moved to app-ui-appearance.js
    
    // removed updateStringAndFretLabels() {} -> moved to app-state.js
    // removed getCurrentTuning() {} -> moved to app-state.js
    // removed getVisibleStrings() {} -> moved to app-state.js
    // removed getStringStartFrets() {} -> moved to app-state.js
    // removed getStringEndFrets() {} -> moved to app-state.js
    // removed getCustomColors() {} -> moved to app-state.js
    // removed updateFretboard() {} -> moved to app-state.js
    
    // removed playCurrentPattern() {} -> moved to app-playback.js
    // removed animateNoteMarker() {} -> moved to app-playback.js
    
    // removed addToSlideshow() {} -> moved to slideshow.js
    // removed updateSlideshowDisplay() {} -> moved to slideshow.js
    // removed playSlideshow() {} -> moved to slideshow.js
    // removed waitWithStop() {} -> moved to slideshow.js
    // removed exportCurrentDiagram() {} -> moved to app-export.js
    // removed exportAll() {} -> moved to app-export.js
    // removed exportAllDiagramsOnly() {} -> moved to app-export.js
    // removed setCustomFilename() {} -> moved to app-export.js
    // removed clearSlideshow() {} -> moved to slideshow.js
    
    // removed pattern generator logic -> moved to pattern-generator.js
    
    /**
     * Add slideshow duration input to controls
     */
    addSlideshowDurationInput() {
        // This function is now handled differently - the elements are directly in the HTML
        // We can keep this method for compatibility, but it doesn't need to add elements
    }
    

    
    /**
     * Add tempo control to the fretboard controls
     */
    addTempoControl() {
        // We've moved this to moveControlButtons, 
        // so this method remains but doesn't add to the DOM directly
    }
    
    // removed moveControlButtons() {} -> moved to app-ui-layout.js
    
    // removed addTheoryInfoOptions() {} -> moved to app-theory-info.js
    // removed updateTheoryInfo() {} -> moved to app-theory-info.js
    // removed addScaleDescription() {} -> moved to app-theory-info.js
    // removed addInfoItem() {} -> moved to app-theory-info.js
    // removed getRelatedModes() {} -> moved to music-theory.js
    // removed getChordInversions() {} -> moved to music-theory.js
    // removed getScaleDescription() {} -> moved to music-theory.js
    // removed getChordDescription() {} -> moved to music-theory.js
    // removed getIntervalQuality() {} -> moved to music-theory.js
    // removed getIntervalConsonance() {} -> moved to music-theory.js
    // removed openLessonPage() {} -> moved to app-theory-info.js
    // removed populateLessonTheoryDetails() {} -> moved to app-theory-info.js
    
    // removed toggleSidebar() {} -> moved to app-ui-layout.js

    // removed showLessonEditorButton(), removeLessonEditorButton(), openLessonEditor() -> moved to app-theory-lessons.js
    // removed setupMelodicPatternControls() -> moved to melodic-patterns.js
    
    // removed playMelodicPattern() {}
    // removed extrapolatePattern() {}
    // removed stopMelodicPattern() {}
    
}
    
