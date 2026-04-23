/**
 * Chords Page Application Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const musicTheory = new MusicTheory();
    const chordListContainer = document.getElementById('chord-list');
    const intervalFilterListContainer = document.getElementById('interval-filter-list');
    const scaleFilterSelect = document.getElementById('scale-filter-select');
    const clearFiltersButton = document.getElementById('clear-filters');
    const showFavoritesCheckbox = document.getElementById('show-favorites-only');

    // Dummy app instance for lesson integration
    const dummyApp = {
        musicTheory: musicTheory,
        openLessonPage: function(key, patternType, patternId) {
            if (typeof App !== 'undefined' && App.prototype.openLessonPage) {
                App.prototype.openLessonPage.call(this, key, patternType, patternId);
            }
        },
        populateLessonTheoryDetails: function(container, key, patternType, patternId) {
            if (typeof App !== 'undefined' && App.prototype.populateLessonTheoryDetails) {
                App.prototype.populateLessonTheoryDetails.call(this, container, key, patternType, patternId);
            }
        }
    };

    // Load favorites from localStorage
    let favoriteChords = JSON.parse(localStorage.getItem('favoriteChords') || '{}');

    // Get chords, intervals, and scales from MusicTheory class
    const chords = musicTheory.chords;
    const intervals = musicTheory.intervals;
    const scales = musicTheory.scales;

    // Store all created chord item elements and their associated data
    let allChordData = [];

    // Function to populate the chord list
    function populateChords() {
        chordListContainer.innerHTML = '';
        allChordData = [];
        
        const sortedChordEntries = Object.entries(chords).sort(([, a], [, b]) => a.name.localeCompare(b.name));

        sortedChordEntries.forEach(([id, data]) => {
            const chordItemElement = document.createElement('div');
            chordItemElement.className = 'chord-item';
            
            const details = document.createElement('div');
            details.className = 'chord-details';

            // Chord Name Heading
            const nameHeading = document.createElement('h3');
            nameHeading.textContent = data.name;
            details.appendChild(nameHeading);

            // Formula Display
            const formulaPara = document.createElement('p');
            formulaPara.innerHTML = `<strong>Formula:</strong> <span class="chord-notes">${data.intervals.join(' - ')}</span>`;
            details.appendChild(formulaPara);

            // Example Spelling (C Root)
            const exampleNotes = musicTheory.getChordNotes('C', id);
            const notesPara = document.createElement('p');
            notesPara.innerHTML = `<strong>Example (C Root):</strong> <span class="chord-notes">${exampleNotes.join(' - ')}</span>`;
            details.appendChild(notesPara);

            // Description (About)
            const description = musicTheory.getChordDescription(id);
            if (description) {
                const descPara = document.createElement('p');
                descPara.innerHTML = `<strong>About:</strong> ${description}`;
                details.appendChild(descPara);
            }

            // Buttons Container
            const buttonPairContainer = document.createElement('div');
            buttonPairContainer.className = 'button-pair-container';

            // Hear Chord Button
            const hearBtn = document.createElement('button');
            hearBtn.className = 'hear-chord-button';
            hearBtn.textContent = 'Hear Chord';
            hearBtn.addEventListener('click', () => {
                window.location.href = `index.html?key=C&patternType=chord&pattern=${encodeURIComponent(id)}&action=play`;
            });

            // View on Fretboard Button
            const showBtn = document.createElement('button');
            showBtn.className = 'view-diagram-button';
            showBtn.textContent = 'Fretboard';
            showBtn.addEventListener('click', () => {
                window.location.href = `index.html?key=C&patternType=chord&pattern=${encodeURIComponent(id)}`;
            });

            // Learn Button
            const learnBtn = document.createElement('button');
            learnBtn.className = 'learn-button';
            learnBtn.textContent = 'Learn';
            learnBtn.addEventListener('click', () => {
                dummyApp.openLessonPage('C', 'chord', id);
            });

            buttonPairContainer.appendChild(hearBtn);
            buttonPairContainer.appendChild(showBtn);
            buttonPairContainer.appendChild(learnBtn);
            details.appendChild(buttonPairContainer);

            chordItemElement.appendChild(details);

            // Favorite Star Toggle
            const favButton = document.createElement('button');
            favButton.className = 'favorite-button';
            favButton.innerHTML = favoriteChords[id] ? '★' : '☆';
            if (favoriteChords[id]) favButton.classList.add('favorited');
            favButton.title = 'Toggle Favorite';
            favButton.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(id, favButton, chordItemElement);
            });
            chordItemElement.appendChild(favButton);

            chordListContainer.appendChild(chordItemElement);
            allChordData.push({ id, data, element: chordItemElement });
        });
    }

    // Populate Interval Checkboxes
    function populateIntervalFilters() {
        intervalFilterListContainer.innerHTML = '';
        const sortedIntervals = Object.entries(intervals).sort(([, a], [, b]) => a.semitones - b.semitones);
        
        sortedIntervals.forEach(([id, data]) => {
            const filterItem = document.createElement('div');
            filterItem.className = 'interval-filter-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `filter-${id}`;
            checkbox.value = id;
            checkbox.addEventListener('change', filterAndSortChords);
            
            const label = document.createElement('label');
            label.htmlFor = `filter-${id}`;
            label.textContent = data.shortName;
            
            filterItem.appendChild(checkbox);
            filterItem.appendChild(label);
            intervalFilterListContainer.appendChild(filterItem);
        });
    }

    // Populate Scale Select
    function populateScaleSelect() {
        const sortedScales = Object.entries(scales).sort(([, a], [, b]) => a.name.localeCompare(b.name));
        sortedScales.forEach(([id, data]) => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = data.name;
            scaleFilterSelect.appendChild(opt);
        });
        scaleFilterSelect.addEventListener('change', filterAndSortChords);
    }

    // Toggle Favorite Function
    function toggleFavorite(chordId, buttonElement, itemElement) {
        if (favoriteChords[chordId]) {
            delete favoriteChords[chordId];
            buttonElement.classList.remove('favorited');
            buttonElement.innerHTML = '☆';
        } else {
            favoriteChords[chordId] = true;
            buttonElement.classList.add('favorited');
            buttonElement.innerHTML = '★';
        }
        localStorage.setItem('favoriteChords', JSON.stringify(favoriteChords));
        filterAndSortChords();
    }

    // Filter Logic
    function filterAndSortChords() {
        const selectedIntervals = Array.from(intervalFilterListContainer.querySelectorAll('input[type="checkbox"]:checked'))
                                       .map(cb => cb.value);
        const selectedScaleId = scaleFilterSelect.value;
        const showOnlyFavorites = showFavoritesCheckbox.checked;

        let scaleIntervals = null;
        if (selectedScaleId && scales[selectedScaleId]) {
            scaleIntervals = scales[selectedScaleId].intervals;
        }

        allChordData.forEach(item => {
            const chordIntervals = item.data.intervals;
            
            const matchesIntervals = selectedIntervals.length === 0 || 
                                     selectedIntervals.every(int => chordIntervals.includes(int));
            
            const matchesScale = !scaleIntervals || 
                                 chordIntervals.every(int => scaleIntervals.includes(int));
            
            const matchesFavorite = !showOnlyFavorites || favoriteChords[item.id];
            
            if (matchesIntervals && matchesScale && matchesFavorite) {
                item.element.classList.remove('hidden');
            } else {
                item.element.classList.add('hidden');
            }
        });
    }

    // Clear Filters
    clearFiltersButton.addEventListener('click', () => {
        intervalFilterListContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        scaleFilterSelect.value = '';
        showFavoritesCheckbox.checked = false;
        filterAndSortChords();
    });

    showFavoritesCheckbox.addEventListener('change', filterAndSortChords);

    // Initial load
    populateChords();
    populateIntervalFilters();
    populateScaleSelect();
});