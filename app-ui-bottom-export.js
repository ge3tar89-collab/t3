/**
 * UI Bottom Controls - Export Section (consolidated dropdown + Play)
 */
if (typeof App !== 'undefined') {
    App.prototype.getExportFooterHtml = function() {
        return `
        <footer id="export-footer" class="bottom-footer export-footer" style="display: none;">
            <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;width:100%;">
                <label for="export-action-select" style="font-weight:700;white-space:nowrap;">Export Action:</label>
                <select id="export-action-select" style="min-width:300px;">
                    <option value="">-- Select export action --</option>

                    <optgroup label="ZIP Exports">
                        <option value="save-scales-zip">Save All Scales as ZIP</option>
                        <option value="save-chords-zip">Save All Chords as ZIP</option>
                        <option value="save-intervals-zip">Save All Intervals as ZIP</option>
                        <option value="save-all-combined-zip">Save All (Intervals+Chords+Scales) as ZIP</option>
                        <option value="save-gamuts-zip">Save All Gamuts as ZIP</option>
                    </optgroup>

                    <optgroup label="Word Exports (single docs)">
                        <option value="save-all-combined-word">Save All to Word Document</option>
                        <option value="save-all-combined-word-v2">Save All to Word Doc V2 (2 spans)</option>
                        <option value="save-all-combined-word-v3">Save All to Word Doc V3 (Title, TOC, About)</option>
                        <option value="save-all-combined-word-v4">Save All to Word Doc V4 (All Span Presets)</option>
                        <option value="save-all-combined-word-v6">Save All to Word Doc V6 (All Spans, No About)</option>
                        <option value="save-all-slideshow-word-v5">Save Slideshow to Word Doc V5 (All Spans)</option>
                        <option value="save-all-patterns-word">Save All Patterns (pattern → all keys) to Word</option>
                        <option value="save-all-patterns-circle-word">Save All Patterns (Circle of Fifths) to Word</option>
                        <option value="save-all-patterns-circle-word-v2">Save All Patterns (Circle of Fifths) to Word V2 (1 Doc/Pattern)</option>
                        <option value="save-custom-patterns-circle-word">Save Custom Patterns (Circle of Fifths) to Word</option>
                        <option value="save-intervals-circle-word">Save Intervals (Circle of Fifths) to Word</option>
                        <option value="save-scales-circle-word">Save Scales (Circle of Fifths) to Word</option>
                        <option value="save-chords-circle-word">Save Chords (Circle of Fifths) to Word</option>
                        <option value="save-gamuts-circle-word">Save Gamuts (Circle of Fifths) to Word</option>
                    </optgroup>

                    <optgroup label="Other">
                        <option value="save-all-custom-word">Save All Custom Patterns to Word Doc</option>
                        <option value="export-info-pages-word">Export Theory & Info Pages to Word</option>
                        <option value="export-current-diagram-bottom">Export Current Diagram</option>
                    </optgroup>
                </select>

                <button id="export-play-button" style="padding:8px 14px;background:var(--primary-color);color:#fff;border-radius:6px;border:none;cursor:pointer;font-weight:700;">
                    ▶ Play
                </button>

                <div style="margin-left:auto;display:flex;gap:8px;align-items:center;">
                    <button id="export-legacy-show" style="background:transparent;border:1px solid var(--border-color);padding:6px 8px;border-radius:6px;">Show legacy buttons</button>
                </div>
            </div>

            <div id="export-legacy-buttons" style="display:none;margin-top:12px;flex-wrap:wrap;gap:8px;">
                <!-- Legacy buttons are preserved but hidden by default so existing listeners still find them -->
                <button id="save-scales-zip" style="display:none;">Save All Scales as ZIP</button>
                <button id="save-chords-zip" style="display:none;">Save All Chords as ZIP</button>
                <button id="save-intervals-zip" style="display:none;">Save All Intervals as ZIP</button>
                <button id="save-all-combined-zip" style="display:none;">Save All (Intervals+Chords+Scales) as ZIP</button>
                <button id="save-all-combined-word" style="display:none;">Save All to Word Document</button>
                <button id="save-all-combined-word-v2" style="display:none;">Save All to Word Doc V2 (2 spans)</button>
                <button id="save-all-combined-word-v3" style="display:none;">Save All to Word Doc V3</button>
                <button id="save-all-combined-word-v4" style="display:none;">Save All to Word Doc V4</button>
                <button id="save-all-slideshow-word-v5" style="display:none;">Save Slideshow to Word Doc V5</button>
                <button id="save-all-combined-word-v6" style="display:none;">Save All to Word Doc V6</button>
                <button id="save-all-custom-word" style="display:none;">Save All Custom Patterns to Word Doc</button>
                <button id="save-custom-patterns-circle-word" style="display:none;">Save Custom Patterns (CoF) to Word</button>
                <button id="save-all-patterns-word" style="display:none;">Save All Patterns to Word</button>
                <button id="save-intervals-circle-word" style="display:none;">Save Intervals (CoF) to Word</button>
                <button id="save-scales-circle-word" style="display:none;">Save Scales (CoF) to Word</button>
                <button id="save-all-patterns-circle-word" style="display:none;">Save All Patterns (CoF) to Word</button>
                <button id="save-all-patterns-circle-word-v2" style="display:none;">Save All Patterns (CoF) V2</button>
                <button id="save-chords-circle-word" style="display:none;">Save Chords (CoF) to Word</button>
                <button id="export-info-pages-word" style="display:none;">Export Theory & Info Pages to Word</button>
                <button id="save-gamuts-zip" style="display:none;">Save All Gamuts as ZIP</button>
                <button id="save-gamuts-circle-word" style="display:none;">Save Gamuts (CoF) to Word</button>
                <button id="export-current-diagram-bottom" style="display:none;">Export Current Diagram</button>
            </div>
        </footer>
        `;
    };
}