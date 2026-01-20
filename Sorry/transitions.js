// Page Transitions and Effects
class PageTransitions {
    constructor() {
        this.transitionElement = null;
        this.isTransitioning = false;
        this.init();
    }
    
    init() {
        this.createTransitionElement();
        this.interceptLinks();
        this.addPageLoadEffects();
    }
    
    createTransitionElement() {
        this.transitionElement = document.createElement('div');
        this.transitionElement.className = 'page-transition';
        this.transitionElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
            z-index: 9999;
            transform: scaleY(0);
            transform-origin: bottom;
            transition: transform 0.6s cubic-bezier(0.86, 0, 0.07, 1);
            pointer-events: none;
        `;
        document.body.appendChild(this.transitionElement);
    }
    
    interceptLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.target && this.isInternalLink(link.href)) {
                e.preventDefault();
                this.navigateTo(link.href);
            }
        }, true);
    }
    
    isInternalLink(href) {
        return href.includes('.html') && !href.startsWith('http') && !href.startsWith('//');
    }
    
    navigateTo(url) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Start transition
        this.transitionIn().then(() => {
            window.location.href = url;
        });
    }
    
    transitionIn() {
        return new Promise((resolve) => {
            this.transitionElement.style.transform = 'scaleY(1)';
            this.transitionElement.style.transformOrigin = 'bottom';
            
            // Add blossom particles during transition
            this.createTransitionParticles();
            
            setTimeout(resolve, 600);
        });
    }
    
    createTransitionParticles() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.innerHTML = '🌸';
                particle.style.cssText = `
                    position: fixed;
                    font-size: ${Math.random() * 25 + 15}px;
                    left: ${Math.random() * 100}vw;
                    top: ${Math.random() * 100}vh;
                    opacity: 0;
                    z-index: 10000;
                    pointer-events: none;
                    transform: scale(0);
                `;
                document.body.appendChild(particle);
                
                particle.animate([
                    { transform: 'scale(0) rotate(0deg)', opacity: 0 },
                    { transform: 'scale(1.5) rotate(180deg)', opacity: 0.8 },
                    { transform: 'scale(0) rotate(360deg)', opacity: 0 }
                ], {
                    duration: 800,
                    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                });
                
                setTimeout(() => particle.remove(), 800);
            }, i * 50);
        }
    }
    
    addPageLoadEffects() {
        // Add loading screen for first visit
        if (!sessionStorage.getItem('firstLoad')) {
            this.showLoadingScreen();
            sessionStorage.setItem('firstLoad', 'true');
        }
        
        // Page entrance animation
        this.animatePageEntrance();
    }
    
    showLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 20px; animation: float 3s ease-in-out infinite;">🌸</div>
                <div class="loading-text">
                    Loading <span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>
                </div>
                <div style="margin-top: 30px; font-size: 0.9rem; opacity: 0.7;">
                    5 Centimeters Per Second
                </div>
            </div>
        `;
        loadingScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            z-index: 9998;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        `;
        
        document.body.appendChild(loadingScreen);
        
        // Add loading animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            .loading-text {
                font-size: 1.5rem;
                color: white;
                letter-spacing: 2px;
            }
            
            .loading-dots span {
                display: inline-block;
                animation: loadingBounce 1.4s infinite;
                animation-delay: calc(var(--i) * 0.2s);
            }
            
            @keyframes loadingBounce {
                0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
                40% { transform: translateY(-10px); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Set animation delays
        const dots = loadingScreen.querySelectorAll('.loading-dots span');
        dots.forEach((dot, i) => {
            dot.style.setProperty('--i', i);
        });
        
        // Hide loading screen after 2 seconds
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            setTimeout(() => loadingScreen.remove(), 500);
        }, 2000);
    }
    
    animatePageEntrance() {
        // Animate elements sequentially
        const elements = document.querySelectorAll('.anime-card, .anime-btn, .anime-title');
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 + index * 100);
        });
        
        // Special entrance for main content
        const mainContent = document.querySelector('.page-container');
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.transition = 'opacity 0.8s ease';
            
            setTimeout(() => {
                mainContent.style.opacity = '1';
            }, 300);
        }
    }
}

// Initialize transitions
window.pageTransitions = new PageTransitions();

// Run page-specific effects after load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Add page-specific effects based on current page
        const page = window.location.pathname.split('/').pop();
        if (page === 'sorry.html') {
            // Add tear effects for apology page
            setInterval(() => {
                const tear = document.createElement('div');
                tear.style.cssText = `
                    position: fixed;
                    width: ${Math.random() * 6 + 3}px;
                    height: ${Math.random() * 12 + 8}px;
                    left: ${Math.random() * 100}vw;
                    top: -20px;
                    background: linear-gradient(to bottom, rgba(160, 210, 255, 0.9), rgba(110, 181, 255, 0.6));
                    border-radius: 50%;
                    animation: tearFall ${Math.random() * 2 + 1}s linear;
                    z-index: -1;
                    pointer-events: none;
                `;
                document.body.appendChild(tear);
                
                setTimeout(() => tear.remove(), 3000);
            }, 2000);
        }
    }, 1000);
});