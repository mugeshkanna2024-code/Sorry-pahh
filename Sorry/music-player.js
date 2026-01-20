// Anime-Style Background Music Player
class AnimeMusicPlayer {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.currentTrack = 0;
        this.volume = 0.3;
        this.tracks = [
            { name: "Spring of Life", artist: "Perfume", duration: "4:00" },
            { name: "Sparkle", artist: "RADWIMPS", duration: "4:56" },
            { name: "Nandemonaiya", artist: "RADWIMPS", duration: "5:44" },
            { name: "Katawaredoki", artist: "RADWIMPS", duration: "2:50" },
            { name: "Zenzenzense", artist: "RADWIMPS", duration: "4:45" }
        ];
        
        this.init();
    }
    
    init() {
        this.createPlayer();
        this.loadTrack(0);
        
        // Load saved volume
        const savedVolume = localStorage.getItem('animePlayerVolume');
        if (savedVolume) {
            this.volume = parseFloat(savedVolume);
            this.setVolume(this.volume);
        }
        
        // Load saved playback state
        const savedState = localStorage.getItem('animePlayerState');
        if (savedState === 'playing') {
            setTimeout(() => this.togglePlay(), 1000);
        }
    }
    
    createPlayer() {
        // Create player container
        this.player = document.createElement('div');
        this.player.className = 'music-player';
        this.player.innerHTML = `
            <button class="music-btn prev-btn">⏮</button>
            <button class="music-btn play-btn">▶</button>
            <button class="music-btn next-btn">⏭</button>
            <input type="range" class="volume-slider" min="0" max="1" step="0.01" value="${this.volume}">
            <div class="track-info" style="color: white; font-size: 0.8rem; min-width: 100px;">
                <div class="track-name">Loading...</div>
                <div class="track-artist"></div>
            </div>
        `;
        document.body.appendChild(this.player);
        
        // Add event listeners
        this.player.querySelector('.play-btn').addEventListener('click', () => this.togglePlay());
        this.player.querySelector('.prev-btn').addEventListener('click', () => this.previousTrack());
        this.player.querySelector('.next-btn').addEventListener('click', () => this.nextTrack());
        this.player.querySelector('.volume-slider').addEventListener('input', (e) => {
            this.setVolume(e.target.value);
        });
    }
    
    loadTrack(index) {
        this.currentTrack = index;
        
        // Update track info
        const track = this.tracks[this.currentTrack];
        this.player.querySelector('.track-name').textContent = track.name;
        this.player.querySelector('.track-artist').textContent = track.artist;
        
        // Create audio element (using placeholder - replace with actual music files)
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
        
        // Note: In a real implementation, you would load actual audio files
        // For now, we'll create a dummy audio element
        this.audio = new Audio();
        this.audio.volume = this.volume;
        
        // Simulate track loading
        this.audio.addEventListener('loadeddata', () => {
            console.log(`Loaded: ${track.name}`);
        });
        
        // Handle track end
        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });
    }
    
    togglePlay() {
        if (!this.audio) return;
        
        if (this.isPlaying) {
            this.audio.pause();
            this.player.querySelector('.play-btn').textContent = '▶';
            localStorage.setItem('animePlayerState', 'paused');
        } else {
            // Create visualizer effect when playing
            this.createVisualizer();
            
            this.player.querySelector('.play-btn').textContent = '⏸';
            localStorage.setItem('animePlayerState', 'playing');
            
            // Simulate playing (in real app, this would play actual audio)
            console.log(`Playing: ${this.tracks[this.currentTrack].name}`);
            
            // Create floating notes effect
            if (this.isPlaying) {
                this.createMusicNotes();
            }
        }
        
        this.isPlaying = !this.isPlaying;
    }
    
    previousTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) {
            this.togglePlay();
            setTimeout(() => this.togglePlay(), 100);
        }
    }
    
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) {
            this.togglePlay();
            setTimeout(() => this.togglePlay(), 100);
        }
    }
    
    setVolume(value) {
        this.volume = parseFloat(value);
        if (this.audio) {
            this.audio.volume = this.volume;
        }
        localStorage.setItem('animePlayerVolume', this.volume);
        
        // Visual feedback
        const slider = this.player.querySelector('.volume-slider');
        const percent = this.volume * 100;
        slider.style.background = `linear-gradient(to right, var(--accent-color) ${percent}%, rgba(255, 255, 255, 0.2) ${percent}%)`;
    }
    
    createVisualizer() {
        // Create visualizer container
        if (this.visualizer) {
            this.visualizer.remove();
        }
        
        this.visualizer = document.createElement('div');
        this.visualizer.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 200px;
            height: 60px;
            display: flex;
            align-items: flex-end;
            gap: 2px;
            z-index: 999;
            opacity: 0.7;
        `;
        
        // Create bars
        for (let i = 0; i < 40; i++) {
            const bar = document.createElement('div');
            bar.style.cssText = `
                width: 4px;
                height: ${Math.random() * 50 + 10}px;
                background: linear-gradient(to top, var(--accent-color), var(--primary-color));
                border-radius: 2px;
                transition: height 0.2s ease;
            `;
            this.visualizer.appendChild(bar);
            
            // Animate bars
            setInterval(() => {
                if (this.isPlaying) {
                    bar.style.height = `${Math.random() * 50 + 10}px`;
                }
            }, 100 + i * 10);
        }
        
        document.body.appendChild(this.visualizer);
    }
    
    createMusicNotes() {
        // Create floating music notes
        const notes = ['♪', '♫', '♬', '🎵', '🎶'];
        
        const createNote = () => {
            if (!this.isPlaying) return;
            
            const note = document.createElement('div');
            note.textContent = notes[Math.floor(Math.random() * notes.length)];
            note.style.cssText = `
                position: fixed;
                font-size: ${Math.random() * 30 + 20}px;
                left: ${Math.random() * 100}vw;
                top: 100vh;
                color: var(--accent-color);
                opacity: 0;
                z-index: -1;
                pointer-events: none;
                text-shadow: 0 0 10px currentColor;
            `;
            document.body.appendChild(note);
            
            // Animate
            const duration = Math.random() * 3000 + 2000;
            note.animate([
                { transform: 'translateY(0) scale(1)', opacity: 0 },
                { transform: 'translateY(-100px) scale(1.2)', opacity: 0.8 },
                { transform: 'translateY(-300px) scale(0.5)', opacity: 0 }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            // Remove after animation
            setTimeout(() => note.remove(), duration);
            
            // Schedule next note
            setTimeout(createNote, Math.random() * 1000 + 500);
        };
        
        createNote();
    }
    
    // Clean up
    destroy() {
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
        if (this.player) {
            this.player.remove();
        }
        if (this.visualizer) {
            this.visualizer.remove();
        }
    }
}

// Initialize music player
window.musicPlayer = new AnimeMusicPlayer();