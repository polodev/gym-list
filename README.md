# Gym Workout List

A simple website that displays gym workout routines using markdown files for content.

## Features

- Clean, responsive design
- Markdown content rendering with marked.js
- Easy navigation between different workout routines
- Mobile-friendly layout

## Structure

- `index.html` - Main HTML structure
- `style.css` - Styling for the website
- `script.js` - JavaScript for loading and rendering markdown content
- `/markdowns/` - Directory containing markdown files for workout routines

## Usage

1. Add your workout routines as markdown files in the `/markdowns/` directory
2. Update the `workoutFiles` array in `script.js` to include your new markdown files
3. Open `index.html` in a browser to view the site

## Running Locally

You can run this site locally using any simple web server. For example:

```bash
# Using Python 3
python -m http.server

# Using Node.js with http-server
npx http-server
```

Then open your browser to http://localhost:8000 (or the port specified by your server).

## Technologies Used

- HTML5, CSS3, JavaScript
- [marked.js](https://marked.js.org/) - Markdown parser and compiler
- [highlight.js](https://highlightjs.org/) - Syntax highlighting for code blocks (optional)
