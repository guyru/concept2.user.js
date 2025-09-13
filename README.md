# Concept2 Logbook Enhancements

A Greasemonkey/Tampermonkey userscript that enhances the Concept2 Logbook with additional functionality for workout data export and visualization.

## Features

### 🖼️ View Workout Image
- Adds a **"View Workout Image"** button that opens the workout summary image in a new tab
- Direct link to the high-quality workout monitor image from Concept2's servers

### 📋 Copy as Markdown
- Adds a **"Copy as Markdown"** button that generates and copies a comprehensive workout summary to your clipboard
- Perfect for sharing workouts in documentation, blogs, or personal training logs

## Installation

### Prerequisites
You need a userscript manager installed in your browser:
- **Firefox**: [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) or [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- **Chrome/Edge**: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- **Safari**: [Tampermonkey](https://apps.apple.com/us/app/tampermonkey/id1482490089)

### Install the Script
1. Go to the [raw script file](https://github.com/guyru/concept2.user.js/raw/refs/heads/master/concept2.user.js)
2. Copy the entire script content
3. Open your userscript manager dashboard
4. Create a new script
5. Paste the code and save
6. The script will automatically activate on Concept2 Logbook workout pages

Alternatively, if your userscript manager supports it, you can install directly from the raw GitHub URL.

## Usage

1. Navigate to any workout page on your Concept2 Logbook (URLs like `https://log.concept2.com/profile/*/log/*`)
2. You'll see two new buttons added next to the existing Edit/Delete buttons:
   - **🖼️ View Workout Image** - Opens the workout summary image
   - **📋 Copy as Markdown** - Copies workout data as formatted markdown

### Using the Markdown Export
1. Click the "Copy as Markdown" button
2. The button will briefly show "Copied!" to confirm success
3. Paste the markdown content anywhere you need it:
   - LLM models for analysis
   - Notion, Obsidian, or other markdown-based note apps
   - Blog posts or documentation
   - Training logs

## Technical Details

### Compatibility
- **Browsers**: Chrome, Firefox, Safari, Edge
- **Concept2 Logbook**: All workout types (RowErg, SkiErg, BikeErg)

### URL Matching
The script automatically runs on pages matching:
```
https://log.concept2.com/profile/*/log/*
```

### Privacy & Security
- **No external requests**: All data processing happens locally in your browser
- **No data collection**: The script only processes data from the current page

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Guy Rutenberg - [GitHub](https://github.com/guyru)

---

*This userscript is not affiliated with or endorsed by Concept2, Inc.*
