const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'awards', 'experience', 'publications'];

// 粒子动画系统
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.createElement('div');
        this.container.className = 'particles-container';
        document.body.appendChild(this.container);
        this.init();
    }

    init() {
        for (let i = 0; i < 50; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        this.container.appendChild(particle);
        this.particles.push(particle);
    }
}

// 滚动动画观察器
class ScrollAnimations {
    constructor() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    }

    observe() {
        document.querySelectorAll('section').forEach(section => {
            this.observer.observe(section);
        });
    }
}

// 鼠标跟随效果
class MouseFollower {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'mouse-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: linear-gradient(45deg, #ff6b9d, #4ecdc4);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(this.cursor);
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 10 + 'px';
            this.cursor.style.top = e.clientY - 10 + 'px';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.transform = 'scale(1)';
        });

        document.addEventListener('mouseleave', () => {
            this.cursor.style.transform = 'scale(0)';
        });

        // 链接悬停效果
        document.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'A') {
                this.cursor.style.transform = 'scale(2)';
                this.cursor.style.background = 'linear-gradient(45deg, #a55eea, #26de81)';
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.tagName === 'A') {
                this.cursor.style.transform = 'scale(1)';
                this.cursor.style.background = 'linear-gradient(45deg, #ff6b9d, #4ecdc4)';
            }
        });
    }
}

// 打字机效果
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

    // 初始化特效
    new ParticleSystem();
    new MouseFollower();
    const scrollAnimations = new ScrollAnimations();

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
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

    // 添加滚动动画观察
    scrollAnimations.observe();

    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    const element = document.getElementById(key);
                    if (element) {
                        element.innerHTML = yml[key];
                        
                        // 为标题添加打字机效果
                        if (key === 'top-section-bg-text') {
                            const typewriter = new Typewriter(element, yml[key], 150);
                            setTimeout(() => typewriter.start(), 1000);
                        }
                    }
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }
            })
        })
        .catch(error => console.log(error));

    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                const element = document.getElementById(name + '-md');
                if (element) {
                    element.innerHTML = html;
                    element.classList.add('loading');
                    
                    // 为每个section添加进入动画
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, idx * 200);
                }
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    });

    // 添加键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    document.querySelector('a[href="#home"]').click();
                    break;
                case '2':
                    e.preventDefault();
                    document.querySelector('a[href="#awards"]').click();
                    break;
                case '3':
                    e.preventDefault();
                    document.querySelector('a[href="#experience"]').click();
                    break;
                case '4':
                    e.preventDefault();
                    document.querySelector('a[href="#publications"]').click();
                    break;
            }
        }
    });

    // 添加滚动进度条
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #ff6b9d, #4ecdc4, #a55eea);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // 添加页面加载动画
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

}); 
