/**
 * Basic Export and Slideshow Event Listeners
 */
if (typeof App !== 'undefined') {
    App.prototype.setupExportEventsBasic = function() {
        document.getElementById('add-to-slideshow')?.addEventListener('click', () => this.addToSlideshow());
        document.getElementById('export-diagram')?.addEventListener('click', () => this.exportCurrentDiagram());
        document.getElementById('export-current-diagram-bottom')?.addEventListener('click', () => this.exportCurrentDiagram());
        document.getElementById('sidebar-add-to-slideshow')?.addEventListener('click', () => this.addToSlideshow());
        
        document.getElementById('play-slideshow')?.addEventListener('click', () => this.playSlideshow());
        document.getElementById('pause-slideshow')?.addEventListener('click', () => {
            if (this.isPlayingSlideshow) {
                this.isPausedSlideshow = !this.isPausedSlideshow;
                const pauseBtn = document.getElementById('pause-slideshow');
                if (pauseBtn) pauseBtn.textContent = this.isPausedSlideshow ? 'Resume' : 'Pause';
                this.updateFretboard();
            }
        });
        document.getElementById('export-all')?.addEventListener('click', () => this.exportAll());
        document.getElementById('clear-slideshow')?.addEventListener('click', () => this.clearSlideshow());
        
        document.getElementById('download-slideshow-template')?.addEventListener('click', () => this.downloadSlideshowTemplate());
        document.getElementById('export-slideshow-csv')?.addEventListener('click', () => this.exportSlideshowCSV());
        document.getElementById('import-slideshow-csv')?.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importSlideshowFromCSV(e.target.files[0]);
                e.target.value = '';
            }
        });

        document.getElementById('generate-all-intervals')?.addEventListener('click', () => this.generateAllIntervals());
        document.getElementById('generate-all-scales')?.addEventListener('click', () => this.generateAllScales());
        document.getElementById('generate-all-chords')?.addEventListener('click', () => this.generateAllChords());
        
        document.getElementById('export-diagrams-only')?.addEventListener('click', () => this.exportAllDiagramsOnly());
        document.getElementById('set-filename')?.addEventListener('click', () => this.setCustomFilename());
    };
}