const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'publications', 'experience', 'awards'];

// Neo-Brutalist Custom Cursor
class NeoCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            if (this.cursor) {
                this.cursor.style.left = e.clientX + 'px';
                this.cursor.style.top = e.clientY + 'px';
            }
        });

        document.addEventListener('mousedown', () => {
            if (this.cursor) this.cursor.style.transform = 'translate(-50%, -50%) rotate(45deg) scale(0.8)';
        });

        document.addEventListener('mouseup', () => {
            if (this.cursor) this.cursor.style.transform = 'translate(-50%, -50%) rotate(45deg) scale(1)';
        });

        // Hover effect for links and buttons
        const hoverables = 'a, button, .nav-link, #avatar img';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverables)) {
                if (this.cursor) this.cursor.classList.add('hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverables)) {
                if (this.cursor) this.cursor.classList.remove('hover');
            }
        });
    }
}

// Typewriter Effect
class Typewriter {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
        this.isTyping = false;
    }

    start() {
        if (this.isTyping) return;
        this.isTyping = true;
        this.element.textContent = '';
        this.type();
    }

    type() {
        if (this.currentIndex < this.text.length) {
            this.element.textContent += this.text.charAt(this.currentIndex);
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        } else {
            this.isTyping = false;
        }
    }
}

window.addEventListener('DOMContentLoaded', event => {

    // Initialize Neo-Brutalist Cursor
    new NeoCursor();

    // Determine Page Type by element presence instead of URL string
    const detailContentEl = document.getElementById('detail-content');
    const isDetailPage = !!detailContentEl;

    // Activate Bootstrap scrollspy (only on home)
    if (!isDetailPage) {
        const mainNav = document.body.querySelector('#mainNav');
        if (mainNav) {
            new bootstrap.ScrollSpy(document.body, {
                target: '#mainNav',
                offset: 100,
            });
        };
    }

    // Navbar Toggler
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Load Config (Yaml) - Global for both pages
    fetch(content_dir + config_file)
        .then(response => {
            if (!response.ok) throw new Error('Config file not found');
            return response.text();
        })
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    const element = document.getElementById(key);
                    if (element) {
                        if (key.endsWith('-link')) {
                            element.href = yml[key];
                        } else {
                            element.innerHTML = yml[key];
                        }
                        
                        // Hero Title Typewriter (Home only)
                        if (key === 'top-section-bg-text' && !isDetailPage) {
                            const typewriter = new Typewriter(element, yml[key], 100);
                            setTimeout(() => typewriter.start(), 500);
                        }
                    }
                } catch (err) {
                    console.log("Error loading key: " + key, err)
                }
            })
        })
        .catch(error => console.error("Config load error:", error));

    if (isDetailPage) {
        // Detail Page Logic
        const urlParams = new URLSearchParams(window.location.search);
        const contentId = urlParams.get('id');
        
        if (contentId) {
            const mdPath = `${content_dir}details/${contentId}.md`;
            console.log("Fetching detail content from:", mdPath);

            fetch(mdPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(markdown => {
                    marked.use({ mangle: false, headerIds: false });
                    const html = marked.parse(markdown);
                    const headerEl = document.getElementById('detail-header');
                    const titleEl = document.getElementById('detail-title');

                    // Extract first H1 as title
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    const h1 = tempDiv.querySelector('h1');
                    
                    if (h1) {
                        const titleText = h1.textContent;
                        if (headerEl) headerEl.textContent = titleText;
                        if (titleEl) titleEl.textContent = titleText;
                        h1.remove(); 
                        detailContentEl.innerHTML = tempDiv.innerHTML;
                    } else {
                        detailContentEl.innerHTML = html;
                    }

                    // Pop-in effect
                    const detailSection = document.getElementById('detail-section');
                    if (detailSection) {
                        detailSection.style.opacity = '0';
                        detailSection.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            detailSection.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                            detailSection.style.opacity = '1';
                            detailSection.style.transform = 'translateY(0)';
                        }, 200);
                    }

                    if (window.MathJax) {
                        if (typeof MathJax.typeset === 'function') {
                            MathJax.typeset();
                        } else if (typeof MathJax.typesetPromise === 'function') {
                            MathJax.typesetPromise();
                        }
                    }
                })
                .catch(err => {
                    console.error("Content load error:", err);
                    detailContentEl.innerHTML = `
                        <div class="alert alert-danger border-4 border-dark shadow-sm rounded-0">
                            <h3>⚠️ Content Load Failed!</h3>
                            <p>Error details: <strong>${err.message}</strong></p>
                            <p>Path tried: <code>${mdPath}</code></p>
                            <a href="index.html" class="btn btn-dark mt-3 rounded-0 border-2">Back to Home</a>
                            <button onclick="location.reload()" class="btn btn-outline-dark mt-3 rounded-0 border-2 ms-2">Retry</button>
                        </div>`;
                });
        } else {
            detailContentEl.innerHTML = `<h3>No ID provided!</h3><a href="index.html">Back to Home</a>`;
        }
    } else {
        // Main Page Logic
        marked.use({ mangle: false, headerIds: false })
        section_names.forEach((name, idx) => {
            fetch(content_dir + name + '.md')
                .then(response => {
                    if (!response.ok) throw new Error(`${name}.md not found`);
                    return response.text();
                })
                .then(markdown => {
                    const html = marked.parse(markdown);
                    const element = document.getElementById(name + '-md');
                    if (element) {
                        element.innerHTML = html;
                        // Pop-in effect
                        const section = element.closest('section');
                        if (section) {
                            section.style.opacity = '0';
                            section.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                section.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                                section.style.opacity = '1';
                                section.style.transform = 'translateY(0)';
                            }, idx * 150 + 500);
                        }
                    }
                }).then(() => {
                    if (window.MathJax) {
                        if (typeof MathJax.typeset === 'function') {
                            MathJax.typeset();
                        } else if (typeof MathJax.typesetPromise === 'function') {
                            MathJax.typesetPromise();
                        }
                    }
                })
                .catch(error => console.error(`Section ${name} load error:`, error));
        });
    }

    // Brutalist Progress Bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 8px;
        background: var(--accent-pink);
        z-index: 10002;
        border-bottom: 2px solid #000;
        transition: width 0.1s linear;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
});
