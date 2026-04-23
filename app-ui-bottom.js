/**
 * UI Bottom Controls Extension for App
 */
if (typeof App !== 'undefined') {
    // removed static HTML string template -> moved to app-ui-bottom-controls.js, app-ui-bottom-instrument.js, app-ui-bottom-appearance.js, app-ui-bottom-export.js

    App.prototype.injectBottomControls = function() {
        let controlsHtml = '';

        // Inject Export footer first so export actions appear at the top of the bottom area
        if (typeof this.getExportFooterHtml === 'function') controlsHtml += this.getExportFooterHtml();

        // Then inject primary controls and other bottom sections
        if (typeof this.getBottomControlsHtml === 'function') controlsHtml += this.getBottomControlsHtml();
        if (typeof this.getInstrumentFooterHtml === 'function') controlsHtml += this.getInstrumentFooterHtml();
        if (typeof this.getAppearanceFooterHtml === 'function') controlsHtml += this.getAppearanceFooterHtml();

        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertAdjacentHTML('beforeend', controlsHtml);
        }
    };
}