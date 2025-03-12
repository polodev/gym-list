/**
 * Script to generate HTML pages from markdown files
 * 
 * Usage:
 * 1. Place your markdown files in the pages_markdown folder
 * 2. Run this script with Node.js: node create-page.js your-file-name
 *    (without the .md extension)
 */

const fs = require('fs');
const path = require('path');

// Get the markdown file name from command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Please provide a markdown file name (without extension)');
    console.error('Example: node create-page.js my-page');
    process.exit(1);
}

const fileName = args[0];
const mdFilePath = path.join(__dirname, 'pages_markdown', `${fileName}.md`);
const htmlFilePath = path.join(__dirname, 'pages', `${fileName}.html`);

// Check if markdown file exists
if (!fs.existsSync(mdFilePath)) {
    console.error(`Markdown file not found: ${mdFilePath}`);
    console.error('Make sure the file exists in the pages_markdown folder');
    process.exit(1);
}

// Read the first line of the markdown file to get the title
const mdContent = fs.readFileSync(mdFilePath, 'utf8');
const firstLine = mdContent.split('\n')[0];
let pageTitle = fileName.charAt(0).toUpperCase() + fileName.slice(1);

// If the first line is a markdown heading, use it as the title
if (firstLine.startsWith('# ')) {
    pageTitle = firstLine.substring(2).trim();
}

// HTML template
const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gym - ${pageTitle}</title>
    <link rel="stylesheet" href="../style.css">
    <!-- Marked.js for Markdown conversion -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <!-- Highlight.js for code syntax highlighting (optional) -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.7.0/styles/github.min.css">
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.7.0/highlight.min.js"></script>
    <style>
        /* Additional styles specific to standalone pages */
        .page-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .back-link {
            display: inline-block;
            margin-bottom: 1rem;
            color: #495057;
            text-decoration: none;
            padding: 0.5rem 1rem;
            background-color: #e9ecef;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        
        .back-link:hover {
            background-color: #dee2e6;
        }
    </style>
</head>
<body>
    <header>
        <h1>Gym Workout List</h1>
        <nav>
            <ul>
                <li><a href="../index.html">Home</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="nutrition.html">Nutrition</a></li>
                <li><a href="${fileName}.html" class="active">${pageTitle}</a></li>
                <!-- Add more navigation links as needed -->
            </ul>
        </nav>
    </header>

    <main>
        <div class="page-container">
            <a href="../index.html" class="back-link">← Back to Home</a>
            <div id="markdown-content">
                <!-- Markdown content will be displayed here -->
                <div class="loading">Loading content...</div>
            </div>
        </div>
    </main>

    <footer>
        <p>&copy; 2025 Gym Workout List. All rights reserved.</p>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize marked.js with options
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: true,
                highlight: function(code, lang) {
                    if (hljs && lang && hljs.getLanguage(lang)) {
                        try {
                            return hljs.highlight(code, { language: lang }).value;
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    return code;
                }
            });
            
            // Function to fetch and display markdown content
            async function loadMarkdownContent() {
                try {
                    const response = await fetch('../pages_markdown/${fileName}.md');
                    if (!response.ok) {
                        throw new Error('Failed to load ${fileName}.md');
                    }
                    
                    const markdownText = await response.text();
                    const htmlContent = marked.parse(markdownText);
                    document.getElementById('markdown-content').innerHTML = htmlContent;
                } catch (error) {
                    console.error('Error loading markdown:', error);
                    document.getElementById('markdown-content').innerHTML = \`<div class="error-message">
                        <h2>Error Loading Content</h2>
                        <p>\${error.message}</p>
                    </div>\`;
                }
            }
            
            // Load the markdown content
            loadMarkdownContent();
        });
    </script>
</body>
</html>`;

// Write the HTML file
fs.writeFileSync(htmlFilePath, htmlTemplate);
console.log(`HTML page created: ${htmlFilePath}`);
console.log(`Don't forget to add a link to this page in your index.html file!`);
