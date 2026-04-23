/**
 * Fretboard Drawing Methods
 * Extends the Fretboard prototype with drawing capabilities
 */
if (typeof Fretboard !== 'undefined') {

    Fretboard.prototype.draw = function() {
        if (!this.container || !this.settings || !this.dimensions) return;

        // Clear previous content
        this.container.innerHTML = '';
        
        // Update dimensions based on number of strings and frets
        const stringCount = this.settings.tuning ? this.settings.tuning.length : 6;
        const fretCount = this.settings.endFret - this.settings.startFret;
        
        // Adjust fret spacing and string spacing based on viewport width for responsive design
        if (window.innerWidth < 600) {
            this.dimensions.fretSpacing = 40;
            this.dimensions.stringSpacing = 20;
            this.dimensions.margin.left = 60; // Ensure enough space for open strings and labels
        } else {
            this.dimensions.fretSpacing = 80;
            this.dimensions.stringSpacing = 30;
            this.dimensions.margin.left = 100; // Ensure enough space for open strings and labels
        }
        
        this.dimensions.height = Math.max(150, stringCount * this.dimensions.stringSpacing + this.dimensions.margin.top + this.dimensions.margin.bottom);
        this.dimensions.width = Math.max(100, fretCount * this.dimensions.fretSpacing + this.dimensions.margin.left + this.dimensions.margin.right);
        
        // Create SVG element
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('class', 'fretboard-svg');
        this.svg.setAttribute('viewBox', `0 0 ${this.dimensions.width} ${this.dimensions.height}`);
        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute("tabindex", "0");
        this.svg.setAttribute("role", "img");
        this.svg.setAttribute("aria-label", "Fretboard diagram for key " + this.currentKey + ", pattern " + this.currentPattern);
        this.container.appendChild(this.svg);
        
        // Attach event listener for scroll
        this.container.addEventListener("scroll", this.debouncedRedrawNotes.bind(this));
        
        // Draw the components
        this.drawFretboard();
        this.drawNotes();
    };

    // removed Fretboard.prototype.drawFretboard() -> moved to fretboard-draw-grid.js
    // removed Fretboard.prototype.drawFretMarker() -> moved to fretboard-draw-grid.js
    // removed Fretboard.prototype.drawNotes() -> moved to fretboard-draw-notes.js
    // removed Fretboard.prototype.drawNoteMarker() -> moved to fretboard-draw-notes.js
}