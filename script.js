document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const markdownsFolder = 'markdowns';
    
    // DOM elements
    const workoutList = document.getElementById('workout-list');
    const sidebarList = document.getElementById('sidebar-list');
    const markdownContent = document.getElementById('markdown-content');
    
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
    async function loadMarkdownContent(fileName) {
        try {
            const response = await fetch(`${markdownsFolder}/${fileName}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${fileName}`);
            }
            
            const markdownText = await response.text();
            const htmlContent = marked.parse(markdownText);
            markdownContent.innerHTML = htmlContent;
            
            // Update active class in sidebar
            const sidebarLinks = document.querySelectorAll('#sidebar-list a');
            sidebarLinks.forEach(link => {
                if (link.getAttribute('data-file') === fileName) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            
            // Update URL hash for bookmarking
            window.location.hash = fileName;
        } catch (error) {
            console.error('Error loading markdown:', error);
            markdownContent.innerHTML = `<div class="error-message">
                <h2>Error Loading Content</h2>
                <p>${error.message}</p>
            </div>`;
        }
    }
    
    // Function to fetch and populate workout list
    async function loadWorkoutList() {
        try {
            // In a real application, you would fetch this list from a server
            // For this example, we'll use a hardcoded list of markdown files
            const workoutFiles = [
                { name: 'Chest Workout', file: 'chest-workout.md' },
                { name: 'Leg Workout', file: 'leg-workout.md' }
                // Add more workouts as needed
            ];
            
            // Populate sidebar list
            workoutFiles.forEach(workout => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.textContent = workout.name;
                a.href = `#${workout.file}`;
                a.setAttribute('data-file', workout.file);
                a.addEventListener('click', function(e) {
                    e.preventDefault();
                    loadMarkdownContent(workout.file);
                });
                li.appendChild(a);
                sidebarList.appendChild(li);
                
                // Also add to header navigation
                const navLi = document.createElement('li');
                const navA = document.createElement('a');
                navA.textContent = workout.name;
                navA.href = `#${workout.file}`;
                navA.addEventListener('click', function(e) {
                    e.preventDefault();
                    loadMarkdownContent(workout.file);
                });
                navLi.appendChild(navA);
                workoutList.appendChild(navLi);
            });
            
            // Check if URL has a hash and load that content
            if (window.location.hash) {
                const fileName = window.location.hash.substring(1);
                loadMarkdownContent(fileName);
            }
        } catch (error) {
            console.error('Error loading workout list:', error);
        }
    }
    
    // Initialize the application
    loadWorkoutList();
    
    // Handle hash changes for browser navigation
    window.addEventListener('hashchange', function() {
        if (window.location.hash) {
            const fileName = window.location.hash.substring(1);
            loadMarkdownContent(fileName);
        }
    });
});
