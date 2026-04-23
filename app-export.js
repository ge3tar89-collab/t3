/**
 * Export Extension for App
 */
if (typeof App !== 'undefined') {
    App.prototype.exportCurrentDiagram = function() {
        const info = this.fretboard.getCurrentInfo();
        const customFilename = this.customFilename || `${info.tuning}-${info.key}-${info.patternType}-${info.pattern}.jpg`;
        
        // Do not change visibility of the theory info panel when exporting;
        // export should not force the info panel to unhide.
        this.fretboard.exportImage(customFilename);
    };

    App.prototype.exportAll = async function() {
        if (this.slideshowItems.length === 0) {
            alert('No items to export');
            return;
        }
        
        const exportBtn = document.getElementById('export-all');
        const originalText = exportBtn.textContent;
        exportBtn.textContent = 'Exporting...';
        exportBtn.disabled = true;
        
        const stopExportBtn = document.createElement('button');
        stopExportBtn.textContent = 'Stop Exporting';
        stopExportBtn.style.backgroundColor = '#e74c3c';
        stopExportBtn.style.marginLeft = '10px';
        stopExportBtn.addEventListener('click', () => {
            this.stopExporting = true;
            stopExportBtn.disabled = true;
            stopExportBtn.textContent = 'Stopping...';
        });
        exportBtn.insertAdjacentElement('afterend', stopExportBtn);
        
        this.stopExporting = false;
        
        let i = 0;
        for (i = 0; i < this.slideshowItems.length; i++) {
            if (this.stopExporting) break;
            
            const item = this.slideshowItems[i];
            exportBtn.textContent = `Exporting ${i+1}/${this.slideshowItems.length}...`;
            
            this.fretboard.updatePattern(item.info.key, item.info.patternType, item.info.pattern);
            this.updateTheoryInfo(item.info.key, item.info.patternType, item.info.pattern);
            
            const filename = this.customFilename ? `${i+1}_${this.customFilename}` : item.filename;
            await this.fretboard.exportImage(filename);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (stopExportBtn.parentNode) stopExportBtn.parentNode.removeChild(stopExportBtn);
        exportBtn.textContent = originalText;
        exportBtn.disabled = false;
        
        if (this.stopExporting) alert(`Export stopped after ${i} diagrams`);
        else alert(`Exported ${this.slideshowItems.length} diagrams`);
    };

    App.prototype.exportAllDiagramsOnly = async function() {
        if (this.slideshowItems.length === 0) {
            alert('No items to export');
            return;
        }
        
        const exportBtn = document.getElementById('export-diagrams-only');
        const originalText = exportBtn.textContent;
        exportBtn.textContent = 'Exporting...';
        exportBtn.disabled = true;
        
        const stopExportBtn = document.createElement('button');
        stopExportBtn.textContent = 'Stop Exporting';
        stopExportBtn.style.backgroundColor = '#e74c3c';
        stopExportBtn.style.marginLeft = '10px';
        stopExportBtn.addEventListener('click', () => {
            this.stopExporting = true;
            stopExportBtn.disabled = true;
            stopExportBtn.textContent = 'Stopping...';
        });
        exportBtn.insertAdjacentElement('afterend', stopExportBtn);
        
        this.stopExporting = false;
        
        const theoryPanel = document.getElementById('theory-info-panel');
        if (theoryPanel) theoryPanel.style.display = 'none';
        
        let i = 0;
        for (i = 0; i < this.slideshowItems.length; i++) {
            if (this.stopExporting) break;
            
            const item = this.slideshowItems[i];
            exportBtn.textContent = `Exporting ${i+1}/${this.slideshowItems.length}...`;
            
            this.fretboard.updatePattern(item.info.key, item.info.patternType, item.info.pattern);
            
            const filename = this.customFilename ? `${i+1}_diagram_${this.customFilename}` : `diagram_${item.filename}`;
            await this.fretboard.exportImage(filename);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (theoryPanel) theoryPanel.style.display = 'block';
        if (stopExportBtn.parentNode) stopExportBtn.parentNode.removeChild(stopExportBtn);
        exportBtn.textContent = originalText;
        exportBtn.disabled = false;
        
        if (this.stopExporting) alert(`Export stopped after ${i} diagrams`);
        else alert(`Exported ${this.slideshowItems.length} diagrams without theory info`);
    };

    App.prototype.setCustomFilename = function() {
        const filename = prompt('Enter custom filename for exports (without extension):', this.customFilename || '');
        if (filename !== null) {
            this.customFilename = filename.trim();
            const label = document.getElementById('current-custom-filename');
            if (label) {
                label.textContent = this.customFilename ? `Prefix: ${this.customFilename}` : '';
            }
            alert(`Filename set to: ${this.customFilename || 'Default'}`);
        }
    };
}