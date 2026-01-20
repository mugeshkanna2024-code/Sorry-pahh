// Dynamic Weather System with Day/Night Cycle
class AnimeWeatherSystem {
    constructor() {
        this.currentWeather = 'cherry-blossom';
        this.isNight = false;
        this.weatherIntensity = 0.5;
        this.container = null;
        this.interval = null;
        this.init();
    }
    
    init() {
        this.container = document.createElement('div');
        this.container.className = 'weather-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -3;
            opacity: 0.6;
        `;
        document.body.appendChild(this.container);
        
        // Set initial weather based on time of day
        this.setWeatherByTime();
        
        // Listen for theme changes
        document.addEventListener('themeChange', (e) => {
            this.isNight = e.detail.isNight;
            this.updateWeather();
        });
        
        // Change weather randomly every 5 minutes
        this.interval = setInterval(() => {
            this.changeWeatherRandomly();
        }, 5 * 60 * 1000);
    }
    
    setWeatherByTime() {
        const hour = new Date().getHours();
        this.isNight = hour < 6 || hour > 18;
        
        if (this.isNight) {
            this.currentWeather = 'starry-night';
        } else {
            const weathers = ['cherry-blossom', 'sunny', 'light-rain', 'snow'];
            this.currentWeather = weathers[Math.floor(Math.random() * weathers.length)];
        }
        
        this.updateWeather();
    }
    
    changeWeatherRandomly() {
        const weathers = this.isNight 
            ? ['starry-night', 'moonlight', 'meteor-shower']
            : ['cherry-blossom', 'sunny', 'light-rain', 'snow', 'autumn-leaves'];
        
        const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
        if (newWeather !== this.currentWeather) {
            this.currentWeather = newWeather;
            this.updateWeather();
            
            // Show weather change notification
            this.showWeatherChange();
        }
    }
    
    updateWeather() {
        this.container.innerHTML = '';
        
        switch (this.currentWeather) {
            case 'cherry-blossom':
                this.createCherryBlossoms();
                break;
            case 'sunny':
                this.createSunbeams();
                break;
            case 'light-rain':
                this.createRain();
                break;
            case 'snow':
                this.createSnow();
                break;
            case 'starry-night':
                this.createStars();
                break;
            case 'moonlight':
                this.createMoon();
                break;
            case 'meteor-shower':
                this.createMeteors();
                break;
            case 'autumn-leaves':
                this.createAutumnLeaves();
                break;
        }
    }
    
    createCherryBlossoms() {
        for (let i = 0; i < 50; i++) {
            const blossom = document.createElement('div');
            blossom.innerHTML = '🌸';
            blossom.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 25 + 15}px;
                left: ${Math.random() * 100}vw;
                top: -50px;
                opacity: ${Math.random() * 0.6 + 0.2};
                animation: fallBlossom ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
                filter: ${this.isNight ? 'brightness(0.8)' : 'none'};
            `;
            this.container.appendChild(blossom);
        }
        
        // Add CSS for animation
        if (!document.querySelector('#blossom-animation')) {
            const style = document.createElement('style');
            style.id = 'blossom-animation';
            style.textContent = `
                @keyframes fallBlossom {
                    0% { transform: translateY(0) rotate(0deg) translateX(0); opacity: 0; }
                    10% { opacity: ${Math.random() * 0.7 + 0.3}; }
                    90% { opacity: ${Math.random() * 0.5 + 0.1}; }
                    100% { transform: translateY(100vh) rotate(360deg) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    createSunbeams() {
        for (let i = 0; i < 5; i++) {
            const beam = document.createElement('div');
            beam.style.cssText = `
                position: absolute;
                top: 0;
                left: ${20 + i * 15}%;
                width: 2px;
                height: 100%;
                background: linear-gradient(to bottom, transparent, rgba(255, 255, 200, 0.3), transparent);
                transform: rotate(${i * 10 - 20}deg);
                animation: sunbeam 8s ease-in-out infinite;
                animation-delay: ${i * 1}s;
            `;
            this.container.appendChild(beam);
        }
    }
    
    createRain() {
        for (let i = 0; i < 100; i++) {
            const drop = document.createElement('div');
            drop.style.cssText = `
                position: absolute;
                width: 1px;
                height: ${Math.random() * 30 + 20}px;
                left: ${Math.random() * 100}vw;
                top: -50px;
                background: linear-gradient(to bottom, transparent, rgba(160, 210, 255, 0.7));
                animation: rainFall ${Math.random() * 1 + 0.5}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            this.container.appendChild(drop);
        }
    }
    
    createSnow() {
        for (let i = 0; i < 100; i++) {
            const flake = document.createElement('div');
            flake.innerHTML = '❄';
            flake.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 20 + 10}px;
                left: ${Math.random() * 100}vw;
                top: -50px;
                opacity: ${Math.random() * 0.8 + 0.2};
                animation: snowFall ${Math.random() * 10 + 5}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
                filter: blur(${Math.random()}px);
            `;
            this.container.appendChild(flake);
        }
    }
    
    createStars() {
        for (let i = 0; i < 200; i++) {
            const star = document.createElement('div');
            star.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                background: white;
                border-radius: 50%;
                opacity: ${Math.random() * 0.8 + 0.2};
                animation: twinkle ${Math.random() * 3 + 2}s infinite alternate;
                animation-delay: ${Math.random() * 3}s;
            `;
            this.container.appendChild(star);
        }
    }
    
    createMoon() {
        const moon = document.createElement('div');
        moon.style.cssText = `
            position: absolute;
            top: 20%;
            right: 15%;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle at 30% 30%, #fff, #f0f0f0);
            border-radius: 50%;
            box-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
            opacity: 0.8;
        `;
        this.container.appendChild(moon);
        
        // Add craters
        for (let i = 0; i < 5; i++) {
            const crater = document.createElement('div');
            crater.style.cssText = `
                position: absolute;
                width: ${Math.random() * 20 + 10}px;
                height: ${Math.random() * 20 + 10}px;
                background: rgba(200, 200, 200, 0.3);
                border-radius: 50%;
                top: ${Math.random() * 80 + 10}%;
                left: ${Math.random() * 80 + 10}%;
            `;
            moon.appendChild(crater);
        }
    }
    
    createMeteors() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const meteor = document.createElement('div');
                meteor.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 30px;
                    left: ${Math.random() * 100}vw;
                    top: -30px;
                    background: linear-gradient(to bottom, transparent, white, transparent);
                    transform: rotate(45deg);
                    animation: meteor ${Math.random() * 2 + 1}s linear;
                    box-shadow: 0 0 10px white;
                `;
                this.container.appendChild(meteor);
                
                setTimeout(() => meteor.remove(), 3000);
            }, i * 2000);
        }
    }
    
    createAutumnLeaves() {
        const leaves = ['🍁', '🍂', '🍃'];
        for (let i = 0; i < 40; i++) {
            const leaf = document.createElement('div');
            leaf.innerHTML = leaves[Math.floor(Math.random() * leaves.length)];
            leaf.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 25 + 15}px;
                left: ${Math.random() * 100}vw;
                top: -50px;
                opacity: ${Math.random() * 0.7 + 0.3};
                animation: autumnFall ${Math.random() * 15 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
                filter: ${this.isNight ? 'brightness(0.6)' : 'none'};
            `;
            this.container.appendChild(leaf);
        }
    }
    
    showWeatherChange() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transform: translateX(100%);
            transition: transform 0.5s ease;
            font-family: inherit;
        `;
        
        const weatherNames = {
            'cherry-blossom': '🌸 Cherry Blossoms',
            'sunny': '☀️ Sunny Day',
            'light-rain': '🌧️ Light Rain',
            'snow': '❄️ Snowfall',
            'starry-night': '🌌 Starry Night',
            'moonlight': '🌙 Moonlight',
            'meteor-shower': '☄️ Meteor Shower',
            'autumn-leaves': '🍂 Autumn Leaves'
        };
        
        notification.textContent = `Weather Changed: ${weatherNames[this.currentWeather]}`;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    // Change weather manually
    setWeather(weatherType) {
        if (this.currentWeather !== weatherType) {
            this.currentWeather = weatherType;
            this.updateWeather();
            this.showWeatherChange();
        }
    }
    
    // Clean up
    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        if (this.container) {
            this.container.remove();
        }
    }
}

// Initialize weather system
window.weatherSystem = new AnimeWeatherSystem();