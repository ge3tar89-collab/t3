/**
 * Melodic Pattern UI Extension
 */
document.addEventListener('DOMContentLoaded', () => {
    const selects = Array.from(document.querySelectorAll('#melodic-pattern-select'));
    if (typeof MELODIC_PATTERNS_DATA !== 'undefined') {
        selects.forEach(select => {
            if (select && select.options.length === 0) {
                MELODIC_PATTERNS_DATA.forEach(pattern => {
                    const option = new Option(pattern.text, pattern.value);
                    select.appendChild(option);
                });
            }
        });
    }

    const container = document.getElementById('custom-pattern-container');
    selects.forEach(select => {
        if (!select) return;
        select.addEventListener('change', (e) => {
            if (container) container.style.display = e.target.value === 'custom' ? 'block' : 'none';
        });
        if (select.value === 'custom' && container) container.style.display = 'block';
    });

    const primarySelect = selects[0] || document.getElementById('melodic-pattern-select');
    const melodicWrapper = primarySelect ? primarySelect.parentElement : null;
    if (melodicWrapper && !document.getElementById('melodic-pattern-length')) {
        const lengthDiv = document.createElement('div');
        lengthDiv.className = 'control-group';
        lengthDiv.style.marginTop = '8px';
        lengthDiv.innerHTML = `<label for="melodic-pattern-length">Pattern Type / Length:</label>`;
        const lengthSelect = document.createElement('select');
        lengthSelect.id = 'melodic-pattern-length';
        [{v:'12',t:'1 2 (Pair)'},{v:'123',t:'1 2 3 (Three)'},{v:'1234',t:'1 2 3 4 (Four)'},{v:'12345',t:'1 2 3 4 5 (Five)'},{v:'preset',t:'Use Selected Preset'},{v:'custom',t:'Custom Sequence'}]
        .forEach(o => lengthSelect.appendChild(new Option(o.t, o.v)));
        lengthDiv.appendChild(lengthSelect);
        const customLen = document.createElement('div');
        customLen.id = 'melodic-custom-length-container';
        customLen.style.display = 'none';
        customLen.style.marginTop = '6px';
        customLen.innerHTML = `<label for="melodic-custom-length">Custom Sequence:</label><input type="text" id="melodic-custom-length" placeholder="e.g., 1 2 3 4">`;
        lengthDiv.appendChild(customLen);
        melodicWrapper.appendChild(lengthDiv);
        lengthSelect.addEventListener('change', (e) => {
            customLen.style.display = e.target.value === 'custom' ? 'block' : 'none';
        });
    }
});

if (typeof App !== 'undefined') {
    App.prototype.setupMelodicPatternControls = function() {
        const playBtn = document.getElementById('play-melodic-pattern');
        const stopBtn = document.getElementById('stop-melodic-pattern');
        const customCont = document.getElementById('custom-pattern-container');
        if (stopBtn) stopBtn.style.display = 'none';
        if (playBtn) playBtn.style.display = 'inline-block';
        if (customCont) customCont.style.display = 'none';
    };
}