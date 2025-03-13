document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const markdownsFolder = 'markdowns';
    
    // DOM elements
    const markdownContent = document.getElementById('markdown-content');
    
    // Initialize marked.js with options
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        // Allow HTML in the markdown
        html: true,
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
            // Show loading message
            markdownContent.innerHTML = `<div class="loading-message">
                <h2>Loading workout content...</h2>
            </div>`;
            
            // Get the base URL for GitHub Pages compatibility
            const baseUrl = window.location.pathname.includes('gym-list') ? 
                            '/gym-list/' : '/';
            
            // Use the full path for GitHub Pages compatibility
            const filePath = `${baseUrl}${markdownsFolder}/${fileName}`;
            console.log('Attempting to load from:', filePath);
            
            const response = await fetch(filePath);
            if (!response.ok) {
                // Try alternative path if the first one fails
                console.log('First attempt failed, trying alternative path');
                const altPath = `${markdownsFolder}/${fileName}`;
                const altResponse = await fetch(altPath);
                
                if (!altResponse.ok) {
                    throw new Error(`Failed to load ${fileName}. Status: ${response.status}`);
                }
                
                return processMarkdown(await altResponse.text());
            }
            
            return processMarkdown(await response.text());
            
        } catch (error) {
            console.error('Error loading markdown:', error);
            markdownContent.innerHTML = `<div class="error-message">
                <h2>Error Loading Content</h2>
                <p>${error.message}</p>
                <p>Please try refreshing the page or check console for details.</p>
            </div>`;
        }
    }
    
    // Process the markdown content
    function processMarkdown(markdownText) {
        // Use marked with default renderer
        const htmlContent = marked.parse(markdownText);
        markdownContent.innerHTML = htmlContent;
        
        // Process YouTube links
        const links = markdownContent.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.includes('youtube.com') || href.includes('youtu.be'))) {
                link.classList.add('video-popup');
                link.innerHTML = `<span class="video-link">${link.textContent} <i class="video-icon">▶</i></span>`;
            }
        });
        
        // Add Magnific Popup class to all img tags
        const images = markdownContent.querySelectorAll('img.exercise-image');
        images.forEach(img => {
            // Fix image paths if needed for GitHub Pages
            if (window.location.pathname.includes('gym-list') && !img.src.includes('gym-list') && img.src.includes('/images/')) {
                img.src = img.src.replace('/images/', '/gym-list/images/');
            }
            
            // Wrap the image in an anchor tag for Magnific Popup
            if (!img.parentElement.classList.contains('image-popup')) {
                const parent = img.parentElement;
                const wrapper = document.createElement('a');
                wrapper.href = img.src;
                wrapper.className = 'image-popup';
                wrapper.title = img.alt || '';
                
                // Replace the image with the wrapped version
                parent.insertBefore(wrapper, img);
                wrapper.appendChild(img);
            }
        });
        
        // Initialize Magnific Popup for images after content is loaded
        initializeMagnificPopup();
    }
    
    // Function to initialize Magnific Popup
    function initializeMagnificPopup() {
        // For images
        $('.image-popup').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1]
            },
            image: {
                titleSrc: function(item) {
                    return item.el.attr('title');
                }
            },
            zoom: {
                enabled: true,
                duration: 300
            }
        });
        
        // For YouTube videos
        $('.video-popup').magnificPopup({
            type: 'iframe',
            iframe: {
                patterns: {
                    youtube: {
                        index: 'youtube.com/',
                        id: 'v=',
                        src: 'https://www.youtube.com/embed/%id%?autoplay=1'
                    },
                    youtu: {
                        index: 'youtu.be/',
                        id: '/',
                        src: 'https://www.youtube.com/embed/%id%?autoplay=1'
                    }
                }
            }
        });
    }
    
    // Load default content (exercise-list.md) automatically
    loadMarkdownContent('exercise-list.md');
});
