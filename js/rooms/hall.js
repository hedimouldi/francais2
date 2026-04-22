/* ============================================
   ÉcoTech 3D — Central Hall
   Bright museum style with wall paintings
   ============================================ */

const HallRoom = {
    _globe: null,
    _rings: [],
    _particles: null,

    build(scene) {
        const pos = Museum.roomPositions.hall;
        const group = new THREE.Group();
        group.name = 'HallExhibits';

        // === HALL TITLE on wall ===
        const titlePainting = EcoUtils.createWallPainting(6, 3, (ctx, w, h) => {
            // Green gradient background
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, '#0a5e4a');
            grad.addColorStop(1, '#0a3a2e');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
            // Title
            ctx.font = 'bold 120px Outfit, sans-serif';
            ctx.fillStyle = '#00d4aa';
            ctx.textAlign = 'center';
            ctx.fillText('ÉcoTech', w / 2, h / 2 - 40);
            ctx.font = 'bold 80px Outfit, sans-serif';
            ctx.fillStyle = '#ffd700';
            ctx.fillText('3D', w / 2, h / 2 + 60);
            ctx.font = '32px Inter, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fillText('Musée Virtuel de l\'Écologie', w / 2, h / 2 + 125);
        }, { frameColor: 0x6b5010, frameWidth: 0.12 });
        titlePainting.position.set(pos.x, 4.5, pos.z + 19.5);
        titlePainting.rotation.y = Math.PI;
        group.add(titlePainting);

        // === WELCOME PANEL ===
        const welcomePanel = EcoUtils.createInfoPanel(
            'Bienvenue au Musée',
            'Bienvenue au musée virtuel ÉcoTech 3D. Ce musée est dédié à la sensibilisation environnementale et au développement durable.\n\nExplorez nos 5 salles thématiques en vous déplaçant librement.\n\nUtilisez WASD pour avancer et la souris pour regarder.',
            { icon: '🏛️', accentColor: '#00d4aa', width: 3, height: 3 }
        );
        welcomePanel.position.set(pos.x - 19.5, 3.5, pos.z + 10);
        welcomePanel.rotation.y = Math.PI / 2;
        welcomePanel.userData = {
            interactive: true, icon: '🏛️', title: 'Bienvenue',
            description: '<p>Bienvenue au musée <strong>ÉcoTech 3D</strong>. Explorez 5 salles thématiques sur l\'écologie et la technologie durable.</p>',
        };
        Controls.addInteractable(welcomePanel);
        group.add(welcomePanel);

        // === ODD PANELS (on walls) ===
        const odds = [
            { num: 4, title: 'Éducation de qualité', color: '#c5192d', desc: 'Le musée offre un apprentissage interactif sur l\'écologie.' },
            { num: 9, title: 'Innovation', color: '#f36d25', desc: 'Utilisation de la 3D et du virtuel pour innover.' },
            { num: 11, title: 'Villes durables', color: '#f99d26', desc: 'Présentation de villes intelligentes et écologiques.' },
            { num: 13, title: 'Action climatique', color: '#48773e', desc: 'Espaces dédiés au réchauffement et aux solutions.' },
            { num: 15, title: 'Vie terrestre', color: '#5dbb46', desc: 'Biodiversité, forêts et écosystèmes.' },
        ];

        odds.forEach((odd, i) => {
            const oddPainting = EcoUtils.createWallPainting(2, 2.5, (ctx, w, h) => {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, w, h);
                // Color band
                ctx.fillStyle = odd.color;
                ctx.fillRect(0, 0, w, 80);
                // ODD number
                ctx.font = 'bold 72px Outfit';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.fillText(`ODD ${odd.num}`, w / 2, 60);
                // Title
                ctx.font = 'bold 36px Outfit';
                ctx.fillStyle = odd.color;
                ctx.fillText(odd.title, w / 2, 150);
                // Description
                ctx.font = '24px Inter';
                ctx.fillStyle = '#555555';
                const lines = EcoUtils._wrapText(ctx, odd.desc, w - 60, 24);
                lines.forEach((line, li) => {
                    ctx.fillText(line, 30, 200 + li * 34);
                });
            }, { frameColor: 0x888888 });

            oddPainting.position.set(pos.x + 19.5, 3.5, pos.z - 10 + i * 5);
            oddPainting.rotation.y = -Math.PI / 2;
            oddPainting.userData = {
                interactive: true, icon: '🌍',
                title: `ODD ${odd.num} — ${odd.title}`,
                description: `<p><strong>Objectif de Développement Durable ${odd.num}</strong></p><p>${odd.desc}</p>`,
            };
            Controls.addInteractable(oddPainting);
            group.add(oddPainting);
        });

        // === DIRECTIONAL SIGNS (wall-mounted) ===
        const signs = [
            { text: '← Salle 1 — Climat', x: -19.5, z: -4, rotY: Math.PI / 2 },
            { text: 'Salle 2 — Énergies →', x: 19.5, z: -4, rotY: -Math.PI / 2 },
            { text: '↑ Salle 3 — Villes', x: 3, z: 19.5, rotY: Math.PI },
            { text: '↙ Salle 4 — Biodiversité', x: -4, z: -19.5, rotY: 0 },
            { text: '↘ Salle 5 — Recyclage', x: 4, z: -19.5, rotY: 0 },
        ];

        signs.forEach(sign => {
            const signSprite = EcoUtils.createTextSprite(sign.text, {
                fontSize: 28,
                fontWeight: '600',
                color: '#00805a',
                bgColor: 'rgba(255, 255, 255, 0.9)',
                padding: 14,
                scale: 0.008,
            });
            signSprite.position.set(pos.x + sign.x, 3, pos.z + sign.z);
            group.add(signSprite);
        });

        // === RECEPTION DESK ===
        const deskGroup = new THREE.Group();
        deskGroup.position.set(pos.x, 0, pos.z - 8);

        const deskGeo = new THREE.BoxGeometry(10, 1.1, 2.5);
        const deskMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.05, metalness: 0.5 }); // Marble
        const desk = new THREE.Mesh(deskGeo, deskMat);
        desk.position.y = 0.55;
        deskGroup.add(desk);

        const deskTopGeo = new THREE.BoxGeometry(10.2, 0.1, 2.7);
        const deskTopMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.3, metalness: 0.1 }); // Wood
        const deskTop = new THREE.Mesh(deskTopGeo, deskTopMat);
        deskTop.position.y = 1.15;
        deskGroup.add(deskTop);

        const recepLabel = EcoUtils.createTextSprite('ACCUEIL', { fontSize: 60, color: '#00d4aa', scale: 0.015 });
        recepLabel.position.set(0, 1.25, 1.4);
        deskGroup.add(recepLabel);

        // PC on desk
        const pcBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.6), new THREE.MeshStandardMaterial({ color: 0x222222 }));
        pcBase.position.set(-2, 1.25, 0);
        const pcScreen = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.05), new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x00d4aa, emissiveIntensity: 0.2 }));
        pcScreen.position.set(-2, 1.6, -0.2);
        deskGroup.add(pcBase);
        deskGroup.add(pcScreen);

        group.add(deskGroup);

        // === CENTRAL GLOBE (on pedestal) ===
        const globeGroup = new THREE.Group();
        globeGroup.position.set(pos.x, 0, pos.z);

        // Pedestal
        const pedestal = EcoUtils.createPedestal(1.8, 1.2, 1.8, 0xdddddd);
        globeGroup.add(pedestal);

        // Globe
        const globeGeo = new THREE.SphereGeometry(1.5, 64, 64);
        const globeTexture = EcoUtils.createCanvasTexture(1024, 512, (ctx, w, h) => {
            // Ocean
            ctx.fillStyle = '#2980b9';
            ctx.fillRect(0, 0, w, h);
            // Continents (simplified)
            ctx.fillStyle = '#27ae60';
            // Africa
            ctx.beginPath(); ctx.ellipse(550, 240, 55, 95, 0.1, 0, Math.PI * 2); ctx.fill();
            // Europe
            ctx.beginPath(); ctx.ellipse(520, 140, 45, 35, 0.3, 0, Math.PI * 2); ctx.fill();
            // Americas
            ctx.beginPath(); ctx.ellipse(250, 180, 35, 110, 0.1, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(220, 300, 45, 75, 0.3, 0, Math.PI * 2); ctx.fill();
            // Asia
            ctx.beginPath(); ctx.ellipse(700, 160, 90, 55, 0.2, 0, Math.PI * 2); ctx.fill();
            // Australia
            ctx.beginPath(); ctx.ellipse(800, 340, 35, 25, 0.4, 0, Math.PI * 2); ctx.fill();
            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(i * (w / 12), 0); ctx.lineTo(i * (w / 12), h); ctx.stroke(); }
            for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(0, i * (h / 6)); ctx.lineTo(w, i * (h / 6)); ctx.stroke(); }
        });

        const globeMat = new THREE.MeshStandardMaterial({
            map: globeTexture,
            roughness: 0.35,
            metalness: 0.15,
        });
        const globe = new THREE.Mesh(globeGeo, globeMat);
        globe.position.y = 2.8;
        globe.userData = {
            interactive: true, icon: '🌍', title: 'Globe Terrestre',
            description: `<p><strong>Bienvenue au Musée ÉcoTech 3D</strong></p>
                <p>Ce globe représente notre planète Terre. Explorez les 5 salles pour découvrir :</p>
                <ul style="padding-left:20px; margin:8px 0;">
                    <li>🌿 Le changement climatique</li>
                    <li>⚡ Les énergies renouvelables</li>
                    <li>🏙️ Les villes durables</li>
                    <li>🌳 La biodiversité</li>
                    <li>♻️ Le recyclage</li>
                </ul>`,
        };
        Controls.addInteractable(globe);
        globeGroup.add(globe);
        this._globe = globe;

        // Rings
        const ring1 = EcoUtils.createGlowRing(1.8, 0x00d4aa, 0.02);
        ring1.rotation.x = Math.PI / 2;
        ring1.position.y = 2.8;
        globeGroup.add(ring1);

        const ring2 = EcoUtils.createGlowRing(2.1, 0x4da6ff, 0.015);
        ring2.rotation.x = Math.PI / 3;
        ring2.rotation.z = Math.PI / 4;
        ring2.position.y = 2.8;
        globeGroup.add(ring2);
        this._rings = [ring1, ring2];

        // Spotlight on globe
        const globeSpot = new THREE.SpotLight(0xffffff, 1, 10, Math.PI / 5, 0.5);
        globeSpot.position.set(0, 7, 0);
        globeSpot.target = globe;
        globeGroup.add(globeSpot);
        globeGroup.add(globeSpot.target);

        group.add(globeGroup);

        // === WALL PAINTINGS (decorative ecology art) ===
        const artworks = [
            { draw: this._drawForestArt, x: -19.5, z: -8, rotY: Math.PI / 2, title: 'Forêt Tropicale', desc: 'Les forêts couvrent 31% des terres et abritent 80% de la biodiversité terrestre.' },
            { draw: this._drawOceanArt, x: -19.5, z: 0, rotY: Math.PI / 2, title: 'Océan Vivant', desc: 'Les océans produisent 50% de l\'oxygène et absorbent 25% du CO₂.' },
            { draw: this._drawSunsetArt, x: -8, z: 19.5, rotY: Math.PI, title: 'Coucher de Soleil', desc: 'La beauté de notre planète nous rappelle pourquoi nous devons la protéger.' },
        ];

        artworks.forEach(art => {
            const painting = EcoUtils.createWallPainting(3.5, 2.5, art.draw);
            painting.position.set(pos.x + art.x, 3.5, pos.z + art.z);
            painting.rotation.y = art.rotY;
            painting.userData = {
                interactive: true, icon: '🖼️', title: art.title,
                description: `<p>${art.desc}</p>`,
            };
            Controls.addInteractable(painting);
            group.add(painting);
        });

        scene.add(group);
    },

    // === ART DRAWING FUNCTIONS ===
    _drawForestArt(ctx, w, h) {
        // Sky
        const sky = ctx.createLinearGradient(0, 0, 0, h * 0.4);
        sky.addColorStop(0, '#87CEEB');
        sky.addColorStop(1, '#e0f0e0');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h * 0.4);
        // Forest background
        ctx.fillStyle = '#1a5a2a';
        ctx.fillRect(0, h * 0.35, w, h * 0.65);
        // Trees
        for (let i = 0; i < 12; i++) {
            const tx = (i / 12) * w + 20;
            const th = 100 + Math.random() * 200;
            const shade = Math.random() > 0.5 ? '#2d8c4e' : '#1e6b35';
            ctx.fillStyle = shade;
            ctx.beginPath();
            ctx.moveTo(tx, h * 0.6);
            ctx.lineTo(tx - 30 - Math.random() * 20, h * 0.6);
            ctx.lineTo(tx - 5 + Math.random() * 10, h * 0.6 - th);
            ctx.closePath();
            ctx.fill();
        }
        // Ground
        ctx.fillStyle = '#2d5a1e';
        ctx.fillRect(0, h * 0.85, w, h * 0.15);
    },

    _drawOceanArt(ctx, w, h) {
        // Deep ocean gradient
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#1a6b9c');
        grad.addColorStop(0.5, '#0d4a6b');
        grad.addColorStop(1, '#0a2a4a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        // Waves
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const y = 50 + i * 60;
            ctx.beginPath();
            for (let x = 0; x < w; x += 5) {
                ctx.lineTo(x, y + Math.sin(x / 30 + i) * 15);
            }
            ctx.stroke();
        }
        // Fish silhouettes
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        for (let i = 0; i < 5; i++) {
            const fx = 100 + Math.random() * (w - 200);
            const fy = 150 + Math.random() * (h - 300);
            ctx.beginPath();
            ctx.ellipse(fx, fy, 20, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        // Coral
        ctx.fillStyle = '#ff7f50';
        for (let i = 0; i < 6; i++) {
            const cx = 50 + i * (w / 6);
            ctx.beginPath();
            ctx.ellipse(cx, h - 40, 15, 30, 0, Math.PI, 0);
            ctx.fill();
        }
    },

    _drawSunsetArt(ctx, w, h) {
        // Sunset sky
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#1a0a3a');
        grad.addColorStop(0.3, '#cc4444');
        grad.addColorStop(0.5, '#ff8844');
        grad.addColorStop(0.7, '#ffcc44');
        grad.addColorStop(1, '#ffeeaa');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        // Sun
        ctx.beginPath();
        ctx.arc(w / 2, h * 0.55, 60, 0, Math.PI * 2);
        ctx.fillStyle = '#ffdd44';
        ctx.fill();
        // Mountains
        ctx.fillStyle = '#2a1a0a';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.7);
        ctx.lineTo(w * 0.2, h * 0.4);
        ctx.lineTo(w * 0.4, h * 0.65);
        ctx.lineTo(w * 0.6, h * 0.35);
        ctx.lineTo(w * 0.8, h * 0.55);
        ctx.lineTo(w, h * 0.6);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();
    },

    update(time, delta) {
        if (this._globe) this._globe.rotation.y = time * 0.15;
        if (this._rings[0]) this._rings[0].rotation.z = time * 0.3;
        if (this._rings[1]) this._rings[1].rotation.y = time * 0.2;
    },
};

window.HallRoom = HallRoom;
