// Save User Progress and Create Personalized Experience
class AnimeProgressTracker {
    constructor() {
        this.userData = {
            visitedPages: [],
            visitedDates: {},
            totalTime: 0,
            interactions: 0,
            favoritePage: null,
            themePreference: 'auto',
            musicEnabled: true,
            volume: 0.5,
            secretsFound: []
        };
        
        this.startTime = Date.now();
        this.init();
    }
    
    init() {
        // Load saved data
        this.loadData();
        
        // Track page visit
        this.trackPageVisit();
        
        // Track interactions
        this.trackInteractions();
        
        // Track time spent
        this.trackTimeSpent();
        
        // Auto-save every 30 seconds
        setInterval(() => this.saveData(), 30000);
        
        // Save before page unload
        window.addEventListener('beforeunload', () => this.saveData());
    }
    
    loadData() {
        try {
            const saved = localStorage.getItem('animeApologyProgress');
            if (saved) {
                this.userData = { ...this.userData, ...JSON.parse(saved) };
                console.log('Loaded user progress:', this.userData);
                
                // Apply user preferences
                this.applyPreferences();
            }
        } catch (e) {
            console.warn('Could not load saved progress:', e);
        }
    }
    
    saveData() {
        try {
            // Calculate time spent on current session
            const currentSessionTime = Date.now() - this.startTime;
            this.userData.totalTime += currentSessionTime;
            this.startTime = Date.now();
            
            localStorage.setItem('animeApologyProgress', JSON.stringify(this.userData));
            console.log('Progress saved');
        } catch (e) {
            console.warn('Could not save progress:', e);
        }
    }
    
    trackPageVisit() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (!this.userData.visitedPages.includes(currentPage)) {
            this.userData.visitedPages.push(currentPage);
        }
        
        // Record visit date
        const today = new Date().toISOString().split('T')[0];
        this.userData.visitedDates[currentPage] = today;
        
        // Update favorite page (most visited)
        this.updateFavoritePage();
        
        // Update progress tracker UI
        this.updateProgressUI();
        
        // Show welcome message for returning visitors
        if (this.userData.visitedPages.length > 1) {
            this.showWelcomeBack();
        }
    }
    
    trackInteractions() {
        // Count button clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
                this.userData.interactions++;
                
                // Check for special interactions
                if (e.target.closest('.secret-box')) {
                    this.recordSecret('secret_message');
                }
                
                if (e.target.closest('.accept-btn')) {
                    this.recordAchievement('apology_accepted');
                }
            }
        });
        
        // Count form interactions
        document.addEventListener('input', () => {
            this.userData.interactions++;
        });
    }
    
    trackTimeSpent() {
        // Track active time (not just tab open)
        let lastActive = Date.now();
        
        const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
        
        activityEvents.forEach(event => {
            document.addEventListener(event, () => {
                lastActive = Date.now();
            }, { passive: true });
        });
        
        // Check every minute if user was active
        setInterval(() => {
            const inactiveTime = Date.now() - lastActive;
            if (inactiveTime < 60000) { // 1 minute threshold
                this.userData.totalTime += 60000; // Add a minute
            }
        }, 60000);
    }
    
    updateFavoritePage() {
        // Simple implementation - last visited page becomes favorite
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.userData.favoritePage = currentPage;
    }
    
    updateProgressUI() {
        // Update progress dots
        const pages = ['index.html', 'sorry.html', 'third.html', 'fourth.html'];
        const progressDots = document.querySelectorAll('.progress-dot');
        
        pages.forEach((page, index) => {
            if (progressDots[index]) {
                if (this.userData.visitedPages.includes(page)) {
                    progressDots[index].classList.add('visited');
                }
                if (window.location.pathname.includes(page)) {
                    progressDots[index].classList.add('active');
                }
            }
        });
        
        // Update page counter
        const pageCounter = document.querySelector('.page-counter');
        if (pageCounter) {
            const currentPageNum = pages.findIndex(p => window.location.pathname.includes(p)) + 1;
            pageCounter.textContent = `Page ${currentPageNum}/4 • ${this.userData.visitedPages.length} pages visited`;
        }
        
        // Update visited count
        const visitedCount = document.getElementById('visited-count');
        if (visitedCount) {
            visitedCount.textContent = this.userData.visitedPages.length;
        }
    }
    
    applyPreferences() {
        // Apply theme preference
        if (this.userData.themePreference === 'night' || 
            (this.userData.themePreference === 'auto' && this.isNightTime())) {
            document.dispatchEvent(new CustomEvent('themeChange', {
                detail: { isNight: true }
            }));
        }
        
        // Apply music preference
        if (!this.userData.musicEnabled && window.musicPlayer) {
            window.musicPlayer.setVolume(0);
        }
    }
    
    isNightTime() {
        const hour = new Date().getHours();
        return hour < 6 || hour > 18;
    }
    
    showWelcomeBack() {
        // Don't show too often
        const lastWelcome = localStorage.getItem('lastWelcome');
        const today = new Date().toISOString().split('T')[0];
        
        if (lastWelcome !== today) {
            setTimeout(() => {
                this.createNotification(`Welcome back! You've visited ${this.userData.visitedPages.length} pages.`);
                localStorage.setItem('lastWelcome', today);
            }, 2000);
        }
    }
    
    recordSecret(secretId) {
        if (!this.userData.secretsFound.includes(secretId)) {
            this.userData.secretsFound.push(secretId);
            this.createNotification(`🎉 Secret Found! Total: ${this.userData.secretsFound.length}`);
            this.saveData();
        }
    }
    
    recordAchievement(achievementId) {
        const achievements = {
            'apology_accepted': { title: 'Forgiveness', desc: 'Accepted the apology' },
            'all_pages_visited': { title: 'Explorer', desc: 'Visited all pages' },
            'music_listener': { title: 'Music Lover', desc: 'Listened to all tracks' }
        };
        
        if (achievements[achievementId]) {
            this.createNotification(`🏆 Achievement Unlocked: ${achievements[achievementId].title}`);
        }
    }
    
    createNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            font-family: inherit;
            max-width: 300px;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }
    
    // Get statistics for display
    getStats() {
        const totalMinutes = Math.floor(this.userData.totalTime / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        return {
            pagesVisited: this.userData.visitedPages.length,
            totalTime: `${hours}h ${minutes}m`,
            interactions: this.userData.interactions,
            secretsFound: this.userData.secretsFound.length,
            favoritePage: this.userData.favoritePage
        };
    }
    
    // Reset progress (for testing)
    resetProgress() {
        if (confirm('Are you sure you want to reset all progress?')) {
            localStorage.removeItem('animeApologyProgress');
            this.userData = {
                visitedPages: [],
                visitedDates: {},
                totalTime: 0,
                interactions: 0,
                favoritePage: null,
                themePreference: 'auto',
                musicEnabled: true,
                volume: 0.5,
                secretsFound: []
            };
            location.reload();
        }
    }
}

// Initialize progress tracker
window.progressTracker = new AnimeProgressTracker();

// Add stats display to pages
document.addEventListener('DOMContentLoaded', () => {
    // Add stats button to navigation
    const statsBtn = document.createElement('button');
    statsBtn.className = 'nav-btn';
    statsBtn.innerHTML = '📊 Stats';
    statsBtn.onclick = () => window.progressTracker.showStatsModal();
    
    const nav = document.querySelector('.anime-nav');
    if (nav) {
        nav.appendChild(statsBtn);
    }
    
    // Add stats modal method to tracker
    window.progressTracker.showStatsModal = function() {
        const stats = this.getStats();
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(20px);
            color: white;
            padding: 30px;
            border-radius: 20px;
            z-index: 10000;
            border: 1px solid rgba(255, 255, 255, 0.2);
            min-width: 300px;
            max-width: 500px;
            width: 90%;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="text-align: right; margin-bottom: 10px;">
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">
                    ✕
                </button>
            </div>
            <h3 style="color: var(--accent-color); margin-bottom: 20px; text-align: center;">Your Journey Stats</h3>
            <div style="display: grid; gap: 15px;">
                <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    <span>Pages Visited:</span>
                    <span style="color: var(--accent-color); font-weight: bold;">${stats.pagesVisited}/4</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    <span>Time Spent:</span>
                    <span style="color: var(--accent-color); font-weight: bold;">${stats.totalTime}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    <span>Interactions:</span>
                    <span style="color: var(--accent-color); font-weight: bold;">${stats.interactions}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    <span>Secrets Found:</span>
                    <span style="color: var(--accent-color); font-weight: bold;">${stats.secretsFound}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    <span>Favorite Page:</span>
                    <span style="color: var(--accent-color); font-weight: bold;">${stats.favoritePage || 'None'}</span>
                </div>
            </div>
            <div style="margin-top: 25px; text-align: center;">
                <button onclick="window.progressTracker.resetProgress()" 
                        style="background: rgba(255, 99, 99, 0.2); color: #ff6b6b; border: 1px solid #ff6b6b; 
                               padding: 8px 20px; border-radius: 20px; cursor: pointer;">
                    Reset Progress
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    };
});