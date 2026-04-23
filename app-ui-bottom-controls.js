/**
 * UI Bottom Controls - Main Controls Section
 */
if (typeof App !== 'undefined') {
    App.prototype.getBottomControlsHtml = function() {
        return `
        <footer id="controls-bottom" class="bottom-footer" style="display: none;">
            <div class="control-group">
                <label for="key-select">Key:</label>
                <select id="key-select">
                    <option value="C">C</option>
                    <option value="G">G</option>
                    <option value="D">D</option>
                    <option value="A">A</option>
                    <option value="E">E</option>
                    <option value="B">B</option>
                    <option value="F#">F#</option>
                    <option value="C#">C#</option>
                    <option value="F">F</option>
                    <option value="A#">A#</option>
                    <option value="D#">D#</option>
                    <option value="G#">G#</option>
                </select>
            </div>

            <div class="control-group" style="display:flex;align-items:center;gap:10px;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <input type="checkbox" id="show-fret-numbers" checked style="width:auto;">
                    <label for="show-fret-numbers" style="margin:0;">Show Fret Numbers</label>
                </div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <label for="fret-numbers-shape" style="margin:0;">Fret Number Shape:</label>
                    <select id="fret-numbers-shape" style="min-width:100px;">
                        <option value="none" selected>None (Hidden)</option>
                        <option value="pill">Pill</option>
                        <option value="circle">Circle</option>
                        <option value="square">Square</option>
                    </select>
                </div>
            </div>

            <div class="control-group" style="display:flex;align-items:center;gap:10px;">
                <button id="chromatic-tuner-toggle" style="width:auto;">Show Chromatic Tuner</button>
            </div>
            <div class="control-group">
                <label for="pattern-type">Pattern Type:</label>
                <select id="pattern-type">
                    <option value="scale">Scale</option>
                    <option value="chord">Chord</option>
                    <option value="interval">Interval</option>
                    <option value="gamut">Gamut</option>
                    <option value="grid">Grid (3-Fret Spans)</option>
                    <option value="grid2">Grid (2-Fret Spans)</option>
                    <option value="custom">Custom</option>
                </select>
            </div>

            <div class="control-group" id="custom-pattern-import-group" style="display: none; flex-direction: column; gap: 5px;">
                <label for="custom-pattern-import">Import (Name | 0123456789AB):</label>
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    <input type="text" id="custom-pattern-import" placeholder="My Pattern | 024579B" style="flex: 1; min-width: 150px;">
                    <button id="btn-import-custom" style="width: auto;">Import</button>
                    <label for="import-custom-csv" style="margin: 0; padding: 0 12px; background: var(--secondary-color); color: #fff; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: normal; font-size: 14px; white-space: nowrap;" title="Import from CSV (Requires 'Name' and 'Pattern' columns)">CSV</label>
                    <input type="file" id="import-custom-csv" accept=".csv" style="display: none;">
                    <button id="btn-add-all-to-custom" style="width: auto; background-color: #f39c12; color: white; padding: 0 10px; border-radius: 4px; font-size: 14px; display: flex; align-items: center; justify-content: center;" title="Add all built-in patterns to custom">All</button>
                    <button id="btn-delete-all-custom" style="width: auto; background-color: #e74c3c; color: white; padding: 0 10px; border-radius: 4px; font-size: 14px; display: flex; align-items: center; justify-content: center;" title="Delete all custom patterns">🗑️</button>
                </div>
            </div>
            
            <div class="control-group">
                <label for="pattern-select">Pattern:</label>
                <select id="pattern-select">
                    <!-- Options will be populated based on pattern type -->
                </select>
            </div>
            <div class="control-group">
                <label for="start-fret">Start Fret:</label>
                <input type="number" id="start-fret" min="0" max="24" value="0">
            </div>
            <div class="control-group">
                <label for="end-fret">End Fret:</label>
                <input type="number" id="end-fret" min="1" max="24" value="12">
            </div>

            <!-- Capo controls -->
            <div class="control-group" style="display:flex;align-items:center;gap:8px;">
                <label style="display:flex;align-items:center;gap:6px;margin-bottom:0;">
                    <input type="checkbox" id="capo-enable" style="width:auto;">
                    <span>Enable Capo</span>
                </label>
                <label for="capo-fret" style="margin:0;">Capo Fret:</label>
                <input type="number" id="capo-fret" min="0" max="24" value="0" style="width:70px;">
            </div>
            <div class="control-group">
                <label for="display-mode">Display Mode:</label>
                <select id="display-mode">
                    <option value="intervals">Intervals</option>
                    <option value="notes">Notes</option>
                    <option value="roman">Roman Numerals</option>
                    <option value="solfege">Solfège (Do Re Mi)</option>
                    <option value="none">No Text</option>
                </select>
            </div>
            <div class="control-group">
                <label for="color-theme">Color Theme:</label>
                <select id="color-theme">
                    <option value="default">Default</option>
                    <option value="custom">Custom</option>
                </select>
            </div>
            <div class="control-group">
                <label for="page-theme">Page Theme:</label>
                <select id="page-theme">
                    <!-- Options populated dynamically in app-ui.js -->
                </select>
            </div>
            <div class="control-group">
                <label for="font-size">Base Font Size:</label>
                <select id="font-size">
                    <option value="small">Small</option>
                    <option value="medium" selected>Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                </select>
            </div>
            <div class="control-group">
                <label for="slideshow-bpm">Slideshow BPM:</label>
                <input type="number" id="slideshow-bpm" min="10" max="300" value="60" style="width: 60px;">
            </div>
            <div class="control-group">
                <label for="slideshow-loop">Loop:</label>
                <input type="checkbox" id="slideshow-loop" style="width: auto;">
            </div>
            <div class="control-group">
                <label for="slideshow-duration">Duration (measures):</label>
                <input type="number" id="slideshow-duration" min="0.1" step="0.1" value="1" style="width: 60px;">
            </div>
            <div class="control-group">
                 <button id="sidebar-add-to-slideshow">Add to Slideshow</button>
            </div>

            <!-- Moved slideshow export & CSV controls into bottom area -->
            <div class="control-group" style="display:flex;gap:8px;align-items:center;">
                <button id="export-all" style="background:#000;color:#fff;padding:8px 12px;">Export All</button>
                <button id="export-diagrams-only" style="background:#000;color:#fff;padding:8px 12px;">Export Diagrams Only</button>
                <button id="set-filename" style="background:#f39c12;color:#fff;padding:8px 12px;">Set Filename</button>
                <button id="clear-slideshow" style="background:#e74c3c;color:#fff;padding:8px 12px;">Clear Slideshow</button>
            </div>
            <div class="control-group" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                <button id="download-slideshow-template" style="background:#7f8c8d;color:#fff;padding:8px 12px;">Download Full Template</button>
                <button id="export-slideshow-csv" style="background:#34495e;color:#fff;padding:8px 12px;">Export Current to CSV</button>
                <label for="import-slideshow-csv" style="margin:0;"><span style="background:var(--secondary-color);color:#fff;padding:8px 12px;border-radius:4px;cursor:pointer;">Import CSV File</span></label>
                <input type="file" id="import-slideshow-csv" accept=".csv" style="display: none;">
            </div>
            <div class="control-group" style="display: flex; gap: 5px;">
                <button id="play-slideshow" style="flex: 1;">Play Slideshow</button>
                <button id="pause-slideshow" style="flex: 1; display: none; background-color: var(--secondary-color);">Pause</button>
            </div>

            <!-- Melodic pattern quick controls moved to bottom -->
            <div class="control-group" style="display:flex;align-items:center;gap:8px;width:100%;">
                <label for="melodic-pattern-select" style="margin:0;font-weight:700;">Melodic Pattern:</label>
                <select id="melodic-pattern-select" style="min-width:160px;"></select>
                <button id="play-melodic-pattern" style="padding:6px 10px;background:var(--primary-color);color:#fff;border-radius:6px;">Play</button>
                <button id="step-melodic-pattern" style="padding:6px 10px;background:#95a5a6;color:#fff;border-radius:6px;">Step</button>
                <label style="margin-left:8px;font-weight:700;">BPM:</label>
                <input id="melodic-tempo" type="number" min="20" max="300" value="120" style="width:70px;">
            </div>
        </footer>
        `;
    };
}