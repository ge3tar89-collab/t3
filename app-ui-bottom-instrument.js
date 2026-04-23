/**
 * UI Bottom Controls - Instrument Setup Section
 */
if (typeof App !== 'undefined') {
    App.prototype.getInstrumentFooterHtml = function() {
        return `
        <footer id="instrument-footer" class="instrument-setup appearance-bottom-section" style="display: none;">
            <div style="grid-column: 1 / -1; width: 100%;">
                <h3 style="margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 5px; font-size: 1.1em; color: var(--primary-color);">Instrument Setup</h3>
            </div>
            <div class="control-group" id="string-count-group">
                <label for="string-count">Number of Strings:</label>
                <input type="number" id="string-count" min="1" max="20" value="6">
            </div>
            <div id="tuning-container" style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 10px; width: 100%;"></div>
        </footer>
        `;
    };
}