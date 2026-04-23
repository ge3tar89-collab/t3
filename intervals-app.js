document.addEventListener('DOMContentLoaded', () => {
    const musicTheory = new MusicTheory();
    const intervalListContainer = document.getElementById('interval-list');
    const chordFilterSelect = document.getElementById('chord-filter-select');
    const scaleFilterSelect = document.getElementById('scale-filter-select');
    const clearFiltersButton = document.getElementById('clear-interval-filters'); // Use the new ID

    // Get intervals, chords, and scales from MusicTheory class
    const intervals = musicTheory.intervals;
    const chords = musicTheory.chords;
    const scales = musicTheory.scales;

    let allIntervalData = []; // Keep track of interval elements and their data

    // Sort intervals by semitone count for initial display logic
    const sortedIntervals = Object.entries(intervals).sort(([, a], [, b]) => a.semitones - b.semitones);

    // Populate the list
    sortedIntervals.forEach(([id, data]) => {
        const intervalItemElement = document.createElement('div');
        intervalItemElement.className = 'interval-item';
        intervalItemElement.dataset.intervalId = id; // Store interval ID for filtering
        intervalItemElement.dataset.intervalName = data.name; // Store name for sorting

        // Main container for swatch and details
        const mainContentDiv = document.createElement('div');
        mainContentDiv.style.display = 'flex';
        mainContentDiv.style.alignItems = 'center';
        mainContentDiv.style.width = '100%'; // Ensure it takes full width for details

        // Color swatch
        const colorSwatch = document.createElement('div');
        colorSwatch.className = 'interval-color-swatch';
        colorSwatch.style.backgroundColor = data.color;
        mainContentDiv.appendChild(colorSwatch);

        // Details
        const details = document.createElement('div');
        details.className = 'interval-details';

        const nameHeading = document.createElement('h3');
        nameHeading.textContent = `${data.name} (${data.shortName})`;
        details.appendChild(nameHeading);

        const semitonesPara = document.createElement('p');
        semitonesPara.textContent = `Semitones: ${data.semitones}`;
        details.appendChild(semitonesPara);

        mainContentDiv.appendChild(details);
        intervalItemElement.appendChild(mainContentDiv);

        // --- Add MP3 Player ---
        const audioPlayer = document.createElement('audio');
        audioPlayer.controls = true;
        // Set dummy path using forward slashes
        audioPlayer.src = 'C:/dummy.mp3';
        audioPlayer.style.width = '100%'; // Make player fit width
        audioPlayer.style.marginTop = '15px'; // Add space above player
        audioPlayer.style.height = '40px'; // Standard height
        intervalItemElement.appendChild(audioPlayer); // Append the audio player

        // --- Create Show on Fretboard Button ---
        const showLink = document.createElement('a');
        // default to key C; open main app with patternType=interval and the interval id
        showLink.href = `index.html?key=C&patternType=interval&pattern=${encodeURIComponent(id)}`;
        showLink.target = '_self';
        showLink.style.textDecoration = 'none';
        showLink.style.display = 'inline-block';
        showLink.style.marginTop = '8px';

        const showButton = document.createElement('button');
        showButton.textContent = 'Show on Fretboard';
        showButton.className = 'view-diagram-button';
        showButton.style.display = 'inline-block';
        showButton.style.marginTop = '8px';

        showLink.appendChild(showButton);
        intervalItemElement.appendChild(showLink);

        // Don't append yet, store data and element
        allIntervalData.push({ id, data, element: intervalItemElement });
    });

    // Populate Chord Filter Dropdown
    const sortedChords = Object.entries(chords).sort(([, a], [, b]) => a.name.localeCompare(b.name));
    sortedChords.forEach(([id, data]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = data.name;
        chordFilterSelect.appendChild(option);
    });

    // Populate Scale Filter Dropdown
    const sortedScales = Object.entries(scales).sort(([, a], [, b]) => a.name.localeCompare(b.name));
    sortedScales.forEach(([id, data]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = data.name;
        scaleFilterSelect.appendChild(option);
    });

    // Filter and Sort Function for Intervals
    function filterAndSortIntervals() {
        const selectedChordId = chordFilterSelect.value;
        const selectedScaleId = scaleFilterSelect.value;

        let allowedIntervals = null; // Set of intervals to show

        if (selectedChordId) {
            allowedIntervals = new Set(chords[selectedChordId]?.intervals || []);
        } else if (selectedScaleId) {
            allowedIntervals = new Set(scales[selectedScaleId]?.intervals || []);
        }

        // 1. Filter the interval data
        const visibleIntervalsData = allIntervalData.filter(itemData => {
            const intervalId = itemData.id;
            // If a filter is active, check if the interval is allowed
            if (allowedIntervals) {
                return allowedIntervals.has(intervalId);
            }
            return true; // Otherwise, show all intervals
        });

        // 2. Sort the filtered data alphabetically by name
        visibleIntervalsData.sort((a, b) => a.data.name.localeCompare(b.data.name));

        // 3. Update the DOM
        intervalListContainer.innerHTML = ''; // Clear the container
        visibleIntervalsData.forEach(itemData => {
            intervalListContainer.appendChild(itemData.element); // Append sorted visible items
            itemData.element.classList.remove('hidden'); // Ensure it's visible
        });

    }

    // Event Listeners
    chordFilterSelect.addEventListener('change', () => {
        if (chordFilterSelect.value) {
            scaleFilterSelect.value = ''; // Reset scale filter if chord is selected
        }
        filterAndSortIntervals(); // Call the updated function
    });

    scaleFilterSelect.addEventListener('change', () => {
        if (scaleFilterSelect.value) {
            chordFilterSelect.value = ''; // Reset chord filter if scale is selected
        }
        filterAndSortIntervals(); // Call the updated function
    });

    clearFiltersButton.addEventListener('click', () => {
        chordFilterSelect.value = '';
        scaleFilterSelect.value = '';
        filterAndSortIntervals(); // Show all intervals, sorted
    });

    // Initial population and sort/filter run (shows all initially, sorted)
    filterAndSortIntervals();
});