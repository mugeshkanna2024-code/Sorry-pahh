// Advanced Particle System with Interactive Blossoms
class AnimeParticleSystem {
    constructor() {
        this.particles = [];
        this.container = null;
        this.mouse = { x: 0, y: 0 };
        this.isNight = false;
        this.init();
    }
    
    init() {
        // Create particle container
        this.container = document.createElement('div');
        this.container.className = 'particle-system';
        document.body.appendChild(this.container);
        
        // Create initial particles
        this.createParticles(100);
        
        // Mouse tracking
        document.addEventListener('mousemove', (e) => this.trackMouse(e));
        document.addEventListener('touchmove', (e) => this.trackTouch(e), { passive: true });
        
        // Click to create particles
        document.addEventListener('click', (e) => this.createClickParticles(e));
        document.addEventListener('touchstart', (e) => this.createTouchParticles(e), { passive: true });
        
        // Theme change listener
        document.addEventListener('themeChange', (e) => {
            this.isNight = e.detail.isNight;
            this.updateParticleColors();
        });
    }
    
    createParticles(count) {
        const particleTypes = ['🌸', '💮', '🌺', '🌼', '🏵️', '🥀', '🌷', '🌹', '💐', '🌻', '🌺', '🌸'];
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = this.createParticle(particleTypes);
                this.particles.push(particle);
                this.container.appendChild(particle.element);
                
                // Animate particle
                this.animateParticle(particle);
            }, i * 20);
        }
    }
    
    createParticle(types) {
        const element = document.createElement('div');
        element.className = 'particle';
        
        const type = types[Math.floor(Math.random() * types.length)];
        element.innerHTML = type;
        
        const size = Math.random() * 25 + 15;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const rotation = Math.random() * 360;
        const opacity = Math.random() * 0.6 + 0.2;
        const velocity = {
            x: (Math.random() - 0.5) * 0.5,
            y: Math.random() * 0.5 + 0.5,
            rotation: (Math.random() - 0.5) * 2
        };
        
        element.style.fontSize = `${size}px`;
        element.style.left = `${x}vw`;
        element.style.top = `${y}vh`;
        element.style.opacity = opacity;
        element.style.transform = `rotate(${rotation}deg)`;
        element.style.filter = this.isNight 
            ? 'drop-shadow(0 0 5px rgba(255,255,255,0.3))'
            : 'drop-shadow(0 0 5px rgba(0,0,0,0.2))';
        
        return {
            element,
            x: parseFloat(x),
            y: parseFloat(y),
            rotation,
            velocity,
            size,
            type,
            life: 1.0,
            decay: Math.random() * 0.001 + 0.0005
        };
    }
    
    animateParticle(particle) {
        const animate = () => {
            if (particle.life <= 0) {
                this.resetParticle(particle);
                return;
            }
            
            // Update position
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.rotation += particle.velocity.rotation;
            
            // Apply mouse attraction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 30) {
                particle.velocity.x += dx * 0.001;
                particle.velocity.y += dy * 0.001;
            }
            
            // Boundary check
            if (particle.x < -10) particle.x = 110;
            if (particle.x > 110) particle.x = -10;
            if (particle.y > 110) {
                this.resetParticle(particle);
                return;
            }
            
            // Update life
            particle.life -= particle.decay;
            
            // Update element
            particle.element.style.left = `${particle.x}vw`;
            particle.element.style.top = `${particle.y}vh`;
            particle.element.style.transform = `rotate(${particle.rotation}deg)`;
            particle.element.style.opacity = particle.life * 0.6;
            
            // Continue animation
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    resetParticle(particle) {
        particle.x = Math.random() * 100;
        particle.y = -10;
        particle.life = 1.0;
        particle.velocity = {
            x: (Math.random() - 0.5) * 0.5,
            y: Math.random() * 0.5 + 0.5,
            rotation: (Math.random() - 0.5) * 2
        };
        
        // Update color based on theme
        particle.element.style.filter = this.isNight 
            ? 'drop-shadow(0 0 5px rgba(255,255,255,0.3))'
            : 'drop-shadow(0 0 5px rgba(0,0,0,0.2))';
        
        this.animateParticle(particle);
    }
    
    updateParticleColors() {
        this.particles.forEach(particle => {
            particle.element.style.filter = this.isNight 
                ? 'drop-shadow(0 0 5px rgba(255,255,255,0.3))'
                : 'drop-shadow(0 0 5px rgba(0,0,0,0.2))';
        });
    }
    
    trackMouse(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 100;
        this.mouse.y = (e.clientY / window.innerHeight) * 100;
        
        // Create trail particles
        if (Math.random() > 0.7) {
            this.createTrailParticle(e.clientX, e.clientY);
        }
    }
    
    trackTouch(e) {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            this.mouse.x = (touch.clientX / window.innerWidth) * 100;
            this.mouse.y = (touch.clientY / window.innerHeight) * 100;
            
            // Create trail particles for touch
            if (Math.random() > 0.5) {
                this.createTrailParticle(touch.clientX, touch.clientY);
            }
        }
    }
    
    createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerHTML = '✨';
        particle.style.position = 'fixed';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.fontSize = `${Math.random() * 10 + 5}px`;
        particle.style.opacity = '0.8';
        particle.style.zIndex = '-1';
        particle.style.pointerEvents = 'none';
        
        document.body.appendChild(particle);
        
        // Animate and remove
        const animation = particle.animate([
            { transform: 'scale(1) rotate(0deg)', opacity: 0.8 },
            { transform: 'scale(0) rotate(180deg)', opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => particle.remove();
    }
    
    createClickParticles(e) {
        const count = 15;
        const types = ['🌸', '💖', '✨', '🌟', '💫'];
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.innerHTML = types[Math.floor(Math.random() * types.length)];
                particle.style.position = 'fixed';
                particle.style.left = `${e.clientX}px`;
                particle.style.top = `${e.clientY}px`;
                particle.style.fontSize = `${Math.random() * 20 + 15}px`;
                particle.style.opacity = '0.9';
                particle.style.zIndex = '999';
                particle.style.pointerEvents = 'none';
                
                document.body.appendChild(particle);
                
                // Random direction
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2 + 1;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                
                // Animate
                let x = e.clientX;
                let y = e.clientY;
                let opacity = 0.9;
                
                const animate = () => {
                    x += vx;
                    y += vy;
                    opacity -= 0.02;
                    
                    particle.style.left = `${x}px`;
                    particle.style.top = `${y}px`;
                    particle.style.opacity = opacity;
                    particle.style.transform = `rotate(${x + y}deg)`;
                    
                    if (opacity > 0) {
                        requestAnimationFrame(animate);
                    } else {
                        particle.remove();
                    }
                };
                
                animate();
            }, i * 30);
        }
        
        // Play sound if available
        this.playSound('click');
    }
    
    createTouchParticles(e) {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            this.createClickParticles({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }
    
    playSound(type) {
        // This would play a sound effect - implement with Howler.js or similar
        console.log(`Play ${type} sound`);
    }
    
    // Clean up
    destroy() {
        if (this.container) {
            this.container.remove();
        }
        this.particles = [];
    }
}

// Initialize particle system
window.particleSystem = new AnimeParticleSystem();