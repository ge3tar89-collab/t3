/**
 * Lessons Data Extension for App
 * Contains 10 curated lessons for guitarists
 */

if (typeof App !== 'undefined') {
    App.prototype.initLessonsData = function() {
        this.lessons = [
            {
                title: "1. The Major Scale (Ionian)",
                description: "The foundation of Western music. Essential for understanding melody, harmony, and all other scales.",
                patternType: "scale",
                patternId: "major",
                text: "The Major scale consists of 7 notes with the formula: Whole, Whole, Half, Whole, Whole, Whole, Half. On guitar, it creates the bright, 'happy' sound found in countless pop and classical songs.",
                steps: [
                    "Identify the Root note on the E or A string.",
                    "Practice the 3-notes-per-string pattern for fluid movement.",
                    "Play the scale ascending and descending in one position.",
                    "Try jumping between the 1st, 3rd, and 5th degrees to hear the major triad."
                ],
                relatedSlides: ["major", "dorian", "phrygian", "lydian", "mixolydian", "natural_minor", "locrian"]
            },
            {
                title: "2. The Natural Minor Scale",
                description: "The primary 'sad' or 'serious' scale. Essential for rock, metal, and soulful ballads.",
                patternType: "scale",
                patternId: "natural_minor",
                text: "Also known as the Aeolian mode, the Natural Minor scale features a lowered 3rd, 6th, and 7th. It is the relative minor of the major scale and provides a melancholic harmonic character.",
                steps: [
                    "Compare the Natural Minor to its relative Major (3 frets up).",
                    "Focus on the 'darker' quality of the flat 6th and flat 7th.",
                    "Practice alternating between a Minor chord and its Natural Minor scale.",
                    "Listen to the resolution when moving from the 2nd (9th) back to the Root."
                ],
                relatedSlides: ["natural_minor", "harmonic_minor", "melodic_minor", "dorian", "phrygian"]
            },
            {
                title: "3. The Minor Pentatonic",
                description: "The absolute essential for rock and blues lead guitar. Easy to play and sounds great everywhere.",
                patternType: "scale",
                patternId: "pentatonic_minor",
                text: "A five-note scale (1, b3, 4, 5, b7). It removes the half-steps from the natural minor scale, making it incredibly versatile for improvisation without 'wrong' notes.",
                steps: [
                    "Master 'Position 1' (the box shape).",
                    "Practice string skipping between the G and E strings.",
                    "Try bending the b3 and b7 notes slightly for a bluesy feel.",
                    "Connect the scale across the entire fretboard using 'diagonal' patterns."
                ],
                relatedSlides: ["pentatonic_minor", "blues", "natural_minor", "dorian"]
            },
            {
                title: "4. The Major Pentatonic",
                description: "A sweet, uplifting five-note scale. The sound of country, gospel, and the 'Allman Brothers' style rock.",
                patternType: "scale",
                patternId: "pentatonic_major",
                text: "Derived from the Major scale (1, 2, 3, 5, 6). It provides a more melodic, vocal-like quality to solos compared to the grit of the minor pentatonic.",
                steps: [
                    "Visualize the 'Box 2' of the minor pentatonic as the 'Box 1' of major.",
                    "Focus on the major 3rd to provide the 'sweet' sound.",
                    "Practice over a Major IV-V progression.",
                    "Combine with the minor pentatonic for a sophisticated blues-rock sound."
                ],
                relatedSlides: ["pentatonic_major", "major", "major_blues", "mixolydian"]
            },
            {
                title: "5. The Blues Scale",
                description: "Adding the 'Blue Note' to the minor pentatonic for that quintessential bluesy tension.",
                patternType: "scale",
                patternId: "blues",
                text: "This scale adds the 'b5' (diminished fifth) to the minor pentatonic. This 'blue note' provides the characteristic 'growl' and tension-release resolution central to blues music.",
                steps: [
                    "Find the 'blue note' on the A string and G string in position 1.",
                    "Practice sliding into the 5th from the b5.",
                    "Create 'riffs' that start on the Root and peak at the b5.",
                    "Play the blues scale over a Dominant 7th chord."
                ],
                relatedSlides: ["blues", "pentatonic_minor", "mixolydian", "dorian"]
            },
            {
                title: "6. Building Major Chords",
                description: "Learn how the Root, 3rd, and 5th combine to create the most stable sound in music.",
                patternType: "chord",
                patternId: "major",
                text: "A major triad is built using the 1st, 3rd, and 5th degrees of the major scale. On guitar, we often stack these notes across multiple octaves to create full-sounding open and barre chords.",
                steps: [
                    "Locate triads on the top three strings (G, B, E).",
                    "Understand how changing just one note (the 3rd) creates a minor chord.",
                    "Practice 'arpeggiating' the chord notes one by one.",
                    "Learn the 'CAGED' system shapes for the major chord."
                ],
                relatedSlides: ["major", "major7", "add9", "lydian"]
            },
            {
                title: "7. Power Chords (Perfect 5ths)",
                description: "The backbone of rock, punk, and metal. High energy and low complexity.",
                patternType: "chord",
                patternId: "5",
                text: "Technically a 'dyad' because it only contains two notes (Root and 5th). Power chords are stable, 'neutral' sounding, and work perfectly with high distortion levels.",
                steps: [
                    "Practice the 2-finger shape on the E and A strings.",
                    "Add the octave (the root again) for a fuller '3-note' power chord.",
                    "Work on fast transitions between chords along the neck.",
                    "Use palm muting for a percussive, heavy sound."
                ],
                relatedSlides: ["5", "major", "minor", "sus2", "sus4"]
            },
            {
                title: "8. The Dorian Mode",
                description: "A sophisticated, 'cool' jazz-rock sound. Perfect for improvising over minor 7th chords.",
                patternType: "scale",
                patternId: "dorian",
                text: "The 2nd mode of the major scale. It's a minor scale with a raised 6th, giving it a brighter, more open character than the natural minor. Common in funk and Santana-style rock.",
                steps: [
                    "Identify the major 6th interval - this is the 'Dorian' sound.",
                    "Practice over a i-IV progression (e.g., Am7 to D7).",
                    "Mix Dorian with the minor pentatonic.",
                    "Notice how the major 6th creates a sense of optimism compared to Aeolian."
                ],
                relatedSlides: ["dorian", "natural_minor", "mixolydian", "melodic_minor"]
            },
            {
                title: "9. The Mixolydian Mode",
                description: "The sound of classic rock, blues-rock, and funk. Used over dominant 7th chords.",
                patternType: "scale",
                patternId: "mixolydian",
                text: "The 5th mode of the major scale. It's a major scale with a lowered 7th. It has a slightly bluesy, dominant feel that drives progressions forward.",
                steps: [
                    "Compare Mixolydian to the Major scale - only the 7th is different.",
                    "Emphasize the b7 when playing over a Dominant 7 chord.",
                    "Try the 'Mixolydian-Blues' connection by adding the b3 as a passing tone.",
                    "Play funk-style rhythms using the top half of the scale."
                ],
                relatedSlides: ["mixolydian", "major", "dominant7", "blues", "lydian_dominant"]
            },
            {
                title: "10. Harmonic Minor Tension",
                description: "Exotic, dark, and neoclassical. Used to create strong resolution in minor keys.",
                patternType: "scale",
                patternId: "harmonic_minor",
                text: "A natural minor scale with a raised 7th degree. This 'leading tone' creates a wide, exotic leap between the b6 and 7, popular in Middle Eastern music and neoclassical metal (Yngwie Malmsteen style).",
                steps: [
                    "Find the major 7th - it's just one fret below the root.",
                    "Practice the 'Spanish' sounding Phrygian Dominant mode (the 5th mode).",
                    "Use Harmonic Minor over the V7 chord in a minor key.",
                    "Experiment with fast, linear runs that emphasize the augmented 2nd interval."
                ],
                relatedSlides: ["harmonic_minor", "phrygian_dominant", "natural_minor", "melodic_minor", "hungarian_minor"]
            }
        ];
        
        localStorage.setItem('lessons', JSON.stringify(this.lessons));
    };
}