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
            const response = await fetch(`${markdownsFolder}/${fileName}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${fileName}`);
            }
            
            const markdownText = await response.text();
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
            
        } catch (error) {
            console.error('Error loading markdown:', error);
            markdownContent.innerHTML = `<div class="error-message">
                <h2>Error Loading Content</h2>
                <p>${error.message}</p>
            </div>`;
        }
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
