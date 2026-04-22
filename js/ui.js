/* ============================================
   ÉcoTech 3D — UI System
   ============================================ */

const UI = {
    minimapCtx: null,
    minimapScale: 2.2,

    init() {
        const canvas = document.getElementById('minimap-canvas');
        if (canvas) {
            this.minimapCtx = canvas.getContext('2d');
        }

        // Info panel close button
        const closeBtn = document.getElementById('info-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('info-panel').style.display = 'none';
            });
        }

        // Generate welcome particles
        this._generateWelcomeParticles();
    },

    /**
     * Update room indicator
     */
    updateRoomIndicator(roomName) {
        const indicator = document.getElementById('room-indicator');
        if (!indicator) return;

        const names = {
            hall: { icon: '🏛️', text: 'Hall Central' },
            climate: { icon: '🌿', text: 'Climat & Réchauffement' },
            energy: { icon: '⚡', text: 'Énergies Renouvelables' },
            cities: { icon: '🏙️', text: 'Villes Durables' },
            biodiversity: { icon: '🌳', text: 'Biodiversité' },
            recycling: { icon: '♻️', text: 'Recyclage' },
            corridor: { icon: '🚶', text: 'Couloir' },
        };

        const info = names[roomName] || names.corridor;
        indicator.querySelector('.room-indicator-icon').textContent = info.icon;
        indicator.querySelector('.room-indicator-text').textContent = info.text;

        // Change indicator color based on room
        const colors = {
            hall: '#00d4aa',
            climate: '#4da6ff',
            energy: '#ffd700',
            cities: '#b48eff',
            biodiversity: '#2ecc71',
            recycling: '#2ecc71',
            corridor: '#888888',
        };
        indicator.style.borderColor = (colors[roomName] || '#888') + '40';
    },

    /**
     * Update minimap
     */
    updateMinimap(playerX, playerZ, playerRotY) {
        const ctx = this.minimapCtx;
        if (!ctx) return;

        const canvas = ctx.canvas;
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const scale = this.minimapScale;

        ctx.clearRect(0, 0, w, h);

        // Background
        ctx.fillStyle = 'rgba(6, 11, 24, 0.9)';
        ctx.fillRect(0, 0, w, h);

        // Draw rooms
        const rooms = {
            hall: { color: '#00d4aa', size: Museum.hallSize },
            climate: { color: '#4da6ff', size: Museum.roomWidth },
            energy: { color: '#ffd700', size: Museum.roomWidth },
            cities: { color: '#b48eff', size: Museum.roomWidth },
            biodiversity: { color: '#2ecc71', size: Museum.roomWidth },
            recycling: { color: '#2ecc71', size: Museum.roomWidth },
        };

        for (const [name, room] of Object.entries(rooms)) {
            const rPos = Museum.roomPositions[name];
            const mx = cx + (rPos.x - playerX) * scale;
            const my = cy + (rPos.z - playerZ) * scale;
            const size = room.size * scale;

            ctx.fillStyle = room.color + '20';
            ctx.strokeStyle = room.color + '60';
            ctx.lineWidth = 1;
            ctx.fillRect(mx - size/2, my - size/2, size, size);
            ctx.strokeRect(mx - size/2, my - size/2, size, size);

            // Room label
            ctx.fillStyle = room.color;
            ctx.font = '8px Inter';
            ctx.textAlign = 'center';
            const labels = {
                hall: 'Hall',
                climate: 'Climat',
                energy: 'Énergie',
                cities: 'Villes',
                biodiversity: 'Bio',
                recycling: 'Recyclage',
            };
            ctx.fillText(labels[name], mx, my + 3);
        }

        // Draw player
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-playerRotY);

        // Player triangle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(-4, 5);
        ctx.lineTo(4, 5);
        ctx.closePath();
        ctx.fill();

        // Direction line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(0, -15);
        ctx.stroke();

        ctx.restore();

        // Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, w, h);
    },

    /**
     * Generate welcome screen floating particles
     */
    _generateWelcomeParticles() {
        const container = document.getElementById('welcome-particles');
        if (!container) return;

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'welcome-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (6 + Math.random() * 6) + 's';
            particle.style.width = (2 + Math.random() * 4) + 'px';
            particle.style.height = particle.style.width;
            if (Math.random() > 0.5) {
                particle.style.background = '#ffd700';
            }
            container.appendChild(particle);
        }
    },

    /**
     * Show loading progress
     */
    updateLoading(progress, text) {
        const bar = document.getElementById('loader-bar');
        const textEl = document.getElementById('loader-text');
        if (bar) bar.style.width = progress + '%';
        if (textEl) textEl.textContent = text || 'Chargement...';
    },
};

window.UI = UI;
