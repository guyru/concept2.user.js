// ==UserScript==
// @name         Concept2 Logbook Enhancements
// @namespace    https://github.com/guyru/concept2.user.js
// @version      1.0
// @description  Add image link and markdown export buttons to Concept2 workout pages
// @author       Guy Rutenberg
// @match        https://log.concept2.com/profile/*/log/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Extract workout ID from URL
    const urlParts = window.location.pathname.split('/');
    const workoutId = urlParts[urlParts.length - 1];

    // Only run on workout detail pages (numeric workout ID)
    if (!/^\d+$/.test(workoutId)) {
        return;
    }

    // Find the actions container to add our buttons
    const actionsDiv = document.querySelector('.actions');
    if (!actionsDiv) {
        console.error('Could not find actions div');
        return;
    }

    // Create and add the image button
    const imageButton = document.createElement('a');
    imageButton.href = `https://log.concept2.com/images/monitor/${workoutId}/medium`;
    imageButton.target = '_blank';
    imageButton.className = 'btn btn-info';
    imageButton.innerHTML = '<i class="icon-image icon-fw"></i>View Workout Image';
    imageButton.style.marginRight = '10px';

    // Create and add the markdown button
    const markdownButton = document.createElement('button');
    markdownButton.className = 'btn btn-success';
    markdownButton.innerHTML = '<i class="icon-copy icon-fw"></i>Copy as Markdown';
    markdownButton.style.marginRight = '10px';

    // Add click handler for markdown copy
    markdownButton.addEventListener('click', function() {
        const markdown = generateMarkdown();
        copyToClipboard(markdown);
    });

    // Insert buttons at the beginning of the actions div
    actionsDiv.insertBefore(imageButton, actionsDiv.firstChild);
    actionsDiv.insertBefore(markdownButton, actionsDiv.firstChild);

    function generateMarkdown() {
        // Extract workout title and user name
        const titleElement = document.querySelector('h2');
        const fullTitle = titleElement ? titleElement.textContent.trim() : 'Workout';

        // Extract date
        const dateElement = document.querySelector('.workout__details h4');
        const workoutDate = dateElement ? dateElement.textContent.trim() : 'Unknown Date';

        // Extract main workout stats
        const stats = {};
        const statElements = document.querySelectorAll('.workout__stat');
        statElements.forEach(stat => {
            const value = stat.querySelector('span');
            const label = stat.querySelector('p');
            if (value && label) {
                stats[label.textContent.trim()] = value.textContent.trim();
            }
        });

        // Extract additional stats from tables
        const additionalStats = {};
        const statTables = document.querySelectorAll('.workout__more-stats');
        statTables.forEach(table => {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const th = row.querySelector('th');
                const td = row.querySelector('td');
                if (th && td) {
                    additionalStats[th.textContent.trim()] = td.textContent.trim();
                }
            });
        });

        // Extract workout details
        const workoutDetails = {};
        const detailsSection = document.querySelector('.workout__details');
        if (detailsSection) {
            const paragraphs = detailsSection.querySelectorAll('p');
            paragraphs.forEach(p => {
                const strong = p.querySelector('strong');
                if (strong) {
                    const key = strong.textContent.trim();
                    const value = p.textContent.replace(strong.textContent, '').trim();
                    if (value) {
                        workoutDetails[key] = value;
                    }
                }
            });
        }

        // Extract intervals/splits data
        let intervalData = '';

        // Check for intervals table first, then splits table
        let tableContainer = document.querySelector('.intervals');
        let tableName = 'Intervals';

        if (!tableContainer) {
            tableContainer = document.querySelector('.splits');
            tableName = 'Splits';
        }

        if (tableContainer) {
            const table = tableContainer.querySelector('table');
            if (table) {
                // Get headers from the thead section
                const headerCells = table.querySelectorAll('thead tr th');
                const dataRows = table.querySelectorAll('tbody tr');

                if (headerCells.length > 0 && dataRows.length > 0) {
                    // Create markdown table header
                    const headers = Array.from(headerCells).map(th => {
                        const text = th.textContent.trim();
                        // Handle heart rate column which contains only an icon
                        if (text === '' && th.querySelector('.icon-heart')) {
                            return 'HR';
                        }
                        return text;
                    });
                    intervalData = `\n## ${tableName}\n\n`;
                    intervalData += '| ' + headers.join(' | ') + ' |\n';
                    intervalData += '| ' + headers.map(() => '---').join(' | ') + ' |\n';

                    // Add data rows (excluding rest rows and summary rows)
                    dataRows.forEach(row => {
                        const cells = Array.from(row.querySelectorAll('td'));
                        if (cells.length > 0 && !row.classList.contains('info')) {
                            const cellValues = cells.map(cell => cell.textContent.trim());
                            // Skip rows that seem to be rest data (contain 'r' prefix)
                            if (!cellValues.some(val => val.startsWith('r'))) {
                                intervalData += '| ' + cellValues.join(' | ') + ' |\n';
                            }
                        }
                    });
                }
            }
        }

        // Generate markdown content
        let markdown = `# ${fullTitle}\n\n`;
        markdown += `**Date:** ${workoutDate}\n\n`;
        markdown += `**Original Workout:** ${window.location.href}\n\n`;

        // Add main stats
        markdown += '## Workout Summary\n\n';
        Object.entries(stats).forEach(([key, value]) => {
            markdown += `**${key}:** ${value}\n\n`;
        });

        // Add additional stats if available
        if (Object.keys(additionalStats).length > 0) {
            markdown += '## Additional Stats\n\n';
            Object.entries(additionalStats).forEach(([key, value]) => {
                markdown += `**${key}:** ${value}\n\n`;
            });
        }

        // Add workout details
        if (Object.keys(workoutDetails).length > 0) {
            markdown += '## Workout Details\n\n';
            Object.entries(workoutDetails).forEach(([key, value]) => {
                markdown += `**${key}:** ${value}\n\n`;
            });
        }

        // Add intervals
        markdown += intervalData;

        // Add image link
        markdown += `\n## Workout Image\n\n![Workout Summary](https://log.concept2.com/images/monitor/${workoutId}/medium)\n`;

        return markdown;
    }

    function copyToClipboard(content) {
        // Use the modern Clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(content).then(function() {
                // Show success feedback
                const originalText = markdownButton.innerHTML;
                markdownButton.innerHTML = '<i class="icon-check icon-fw"></i>Copied!';
                markdownButton.disabled = true;

                setTimeout(function() {
                    markdownButton.innerHTML = originalText;
                    markdownButton.disabled = false;
                }, 2000);
            }).catch(function(err) {
                console.error('Failed to copy to clipboard:', err);
                fallbackCopyToClipboard(content);
            });
        } else {
            // Fallback for older browsers or non-secure contexts
            fallbackCopyToClipboard(content);
        }
    }

    function fallbackCopyToClipboard(content) {
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);

        // Select and copy the content
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        // Show success feedback
        const originalText = markdownButton.innerHTML;
        markdownButton.innerHTML = '<i class="icon-check icon-fw"></i>Copied!';
        markdownButton.disabled = true;

        setTimeout(function() {
            markdownButton.innerHTML = originalText;
            markdownButton.disabled = false;
        }, 2000);
    }
})();
