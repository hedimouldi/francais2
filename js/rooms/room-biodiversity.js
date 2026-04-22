/* ============================================
   ÉcoTech 3D — Room 4: Biodiversité
   ============================================ */
const RoomBiodiversity = {
    _anim: {},
    build(scene) {
        const pos = Museum.roomPositions.biodiversity;
        const g = new THREE.Group();
        g.name = 'BiodiversityExhibits';

        // === 4 NEW DALL-E PANELS ===
        const imgPath = 'assets/panels/biodiversity_panel_1776878333581.png';
        const p1 = EcoUtils.createImagePanel(imgPath, 'Bio 1', 'Protection des espèces.', 5, 3.5, 'biodiversity');
        p1.position.set(pos.x - 10, 4.5, pos.z - 17.8); // Front wall
        Controls.addInteractable(p1);
        g.add(p1);

        const p2 = EcoUtils.createImagePanel(imgPath, 'Bio 2', 'Restauration des habitats.', 5, 3.5, 'biodiversity');
        p2.position.set(pos.x + 10, 4.5, pos.z - 17.8);
        Controls.addInteractable(p2);
        g.add(p2);

        const p3 = EcoUtils.createImagePanel(imgPath, 'Bio 3', 'Océans propres.', 5, 3.5, 'biodiversity');
        p3.position.set(pos.x - 17.8, 4.5, pos.z - 10); // Left wall
        p3.rotation.y = Math.PI / 2;
        Controls.addInteractable(p3);
        g.add(p3);

        const p4 = EcoUtils.createImagePanel(imgPath, 'Bio 4', 'Forêts préservées.', 5, 3.5, 'biodiversity');
        p4.position.set(pos.x + 17.8, 4.5, pos.z - 10); // Right wall
        p4.rotation.y = -Math.PI / 2;
        Controls.addInteractable(p4);
        g.add(p4);

        // === WALL PAINTINGS (Legacy upgraded) ===
        const animalArts = [
            { name: 'Éléphant d\'Afrique', emoji: '🐘', draw: (ctx, w, h) => {
                ctx.fillStyle = '#f5e6d0'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#c4a882'; ctx.fillRect(0, h*0.75, w, h*0.25);
                ctx.fillStyle = '#666666'; ctx.beginPath(); ctx.ellipse(w*0.5, h*0.5, 120, 80, 0, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(w*0.35, h*0.38, 50, 45, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillRect(w*0.32, h*0.55, 20, 100); ctx.fillRect(w*0.42, h*0.55, 20, 100); ctx.fillRect(w*0.55, h*0.55, 20, 100); ctx.fillRect(w*0.62, h*0.55, 20, 100);
                ctx.beginPath(); ctx.moveTo(w*0.3, h*0.45); ctx.quadraticCurveTo(w*0.25, h*0.7, w*0.28, h*0.75); ctx.lineWidth = 12; ctx.strokeStyle = '#666'; ctx.stroke();
                ctx.font = 'bold 28px Outfit'; ctx.fillStyle = '#5a3a1a'; ctx.textAlign = 'center'; ctx.fillText('🐘 Éléphant d\'Afrique', w/2, 35);
            }},
            { name: 'Tigre', emoji: '🐅', draw: (ctx, w, h) => {
                ctx.fillStyle = '#e8f0e0'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#2d5a1e'; ctx.fillRect(0, h*0.7, w, h*0.3);
                ctx.fillStyle = '#e67e22'; ctx.beginPath(); ctx.ellipse(w*0.5, h*0.48, 100, 50, 0, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(w*0.35, h*0.4, 35, 30, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillRect(w*0.38, h*0.55, 15, 70); ctx.fillRect(w*0.45, h*0.55, 15, 70); ctx.fillRect(w*0.55, h*0.55, 15, 70); ctx.fillRect(w*0.6, h*0.55, 15, 70);
                ctx.strokeStyle = '#333'; ctx.lineWidth = 4; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(w*0.42+i*16, h*0.42); ctx.lineTo(w*0.42+i*16, h*0.55); ctx.stroke(); }
                ctx.font = 'bold 28px Outfit'; ctx.fillStyle = '#333'; ctx.textAlign = 'center'; ctx.fillText('🐅 Tigre du Bengale', w/2, 35);
            }},
            { name: 'Baleine Bleue', emoji: '🐋', draw: (ctx, w, h) => {
                const ocean = ctx.createLinearGradient(0, 0, 0, h); ocean.addColorStop(0, '#1a6b9c'); ocean.addColorStop(1, '#0a3a6a');
                ctx.fillStyle = ocean; ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = '#4488aa'; ctx.beginPath(); ctx.ellipse(w*0.5, h*0.5, 160, 50, 0, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.moveTo(w*0.7, h*0.45); ctx.lineTo(w*0.85, h*0.3); ctx.lineTo(w*0.85, h*0.65); ctx.fill();
                ctx.fillStyle = '#88bbcc'; ctx.beginPath(); ctx.ellipse(w*0.32, h*0.52, 100, 35, 0, 0, Math.PI); ctx.fill();
                ctx.beginPath(); ctx.arc(w*0.28, h*0.47, 5, 0, Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill();
                ctx.fillStyle = 'rgba(255,255,255,0.3)'; [60,40,25,35,45].forEach((s,i) => { ctx.beginPath(); ctx.arc(w*0.2+i*30, h*0.25+i*15, s/5, 0, Math.PI*2); ctx.fill(); });
                ctx.font = 'bold 28px Outfit'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('🐋 Baleine Bleue', w/2, 35);
            }},
        ];

        animalArts.forEach((art, i) => {
            const p = EcoUtils.createWallPainting(3.5, 2.8, art.draw);
            p.position.set(pos.x - 17.8, 3.5, pos.z - 2 + i * 5);
            p.rotation.y = Math.PI / 2;
            p.userData = { interactive: true, icon: art.emoji || '🐾', title: art.name, description: 'Protéger chaque espèce est crucial.' };
            Controls.addInteractable(p);
            g.add(p);
        });

        const ecosystems = [
            { name: 'Forêt Tropicale', draw: (ctx, w, h) => {
                ctx.fillStyle = '#1a5a2a'; ctx.fillRect(0, 0, w, h);
                for (let i = 0; i < 15; i++) {
                    const tx = Math.random() * w; const th = 100 + Math.random() * 250; ctx.fillStyle = ['#2d8c4e','#1e6b35','#3a9e5a'][Math.floor(Math.random()*3)];
                    ctx.beginPath(); ctx.moveTo(tx-25,h); ctx.lineTo(tx,h-th); ctx.lineTo(tx+25,h); ctx.fill();
                }
                ctx.font = 'bold 28px Outfit'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('🌴 Forêt Tropicale', w/2, 35);
            }},
            { name: 'Récif Corallien', draw: (ctx, w, h) => {
                const grad = ctx.createLinearGradient(0, 0, 0, h); grad.addColorStop(0, '#2288cc'); grad.addColorStop(1, '#0a4a6a');
                ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
                const coralColors = ['#ff7f50','#ff6b6b','#ffaa44','#ff88cc'];
                for (let i = 0; i < 10; i++) { ctx.fillStyle = coralColors[i%4]; const cx = 40 + i*(w/10); for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.ellipse(cx+j*12, h-30-j*20, 15, 25, 0, Math.PI, 0); ctx.fill(); } }
                ctx.fillStyle = '#ffd700'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(100+i*150, 150+i*30, 15, 8, 0.1*i, 0, Math.PI*2); ctx.fill(); }
                ctx.font = 'bold 28px Outfit'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('🐠 Récif Corallien', w/2, 35);
            }},
        ];

        ecosystems.forEach((eco, i) => {
            const p = EcoUtils.createWallPainting(3.5, 2.8, eco.draw);
            p.position.set(pos.x + 17.8, 3.5, pos.z - 2 + i * 5);
            p.rotation.y = -Math.PI / 2;
            p.userData = { interactive: true, icon: '🌍', title: eco.name, description: 'Écosystèmes essentiels.' };
            Controls.addInteractable(p);
            g.add(p);
        });

        const extinct = [
            { name: 'Dodo', year: '1681', emoji: '🦤' },
            { name: 'Tigre de Tasmanie', year: '1936', emoji: '🐅' },
            { name: 'Rhinocéros', year: '2018', emoji: '🦏' },
        ];

        extinct.forEach((sp, i) => {
            const p = EcoUtils.createWallPainting(2.2, 2.8, (ctx, w, h) => {
                ctx.fillStyle = '#fff5f5'; ctx.fillRect(0, 0, w, h); ctx.save(); ctx.translate(w/2, h/2-20); ctx.rotate(-0.2);
                ctx.font = 'bold 48px Outfit'; ctx.fillStyle = 'rgba(255,50,50,0.2)'; ctx.textAlign = 'center'; ctx.fillText('DISPARU', 0, 0); ctx.restore();
                ctx.font = '80px serif'; ctx.textAlign = 'center'; ctx.fillText(sp.emoji, w/2, 120);
                ctx.font = 'bold 28px Outfit'; ctx.fillStyle = '#cc3333'; ctx.fillText(sp.name, w/2, 200);
            }, { frameColor: 0x993333 });
            p.position.set(pos.x - 6 + i * 6, 3.5, pos.z - 17.8); // Front wall
            p.userData = { interactive: true, icon: sp.emoji, title: sp.name + ' — Disparu', description: `Espèce éteinte.` };
            Controls.addInteractable(p);
            g.add(p);
        });

        const stats = EcoUtils.createInfoPanel('La Biodiversité',
            '• 8.7 millions d\'espèces sur Terre\n• 1 million menacées d\'extinction\n• 68% de déclin depuis 1970',
            { icon: '📊', accentColor: '#27ae60', width: 3, height: 3.5 });
        stats.position.set(pos.x + 10, 3.5, pos.z + 17.8);
        stats.rotation.y = Math.PI;
        Controls.addInteractable(stats);
        g.add(stats);

        // === SHOWCASES WITH 3D PROTOTYPES ===
        const animals = [
            { name: 'Éléphant', color: 0x888888, x: -6, z: 0, s: 0.8 },
            { name: 'Panda', color: 0xf0f0f0, x: -2, z: 4, s: 0.6 },
            { name: 'Tigre', color: 0xe67e22, x: 2, z: 0, s: 0.7 },
            { name: 'Baleine', color: 0x4488aa, x: 6, z: 4, s: 1 },
        ];
        
        animals.forEach((a, i) => {
            const sh = EcoUtils.createShowcase(2.5, 3.5, 2.5);
            sh.group.position.set(pos.x + a.x, 0, pos.z + a.z);
            
            const body = new THREE.Mesh(new THREE.DodecahedronGeometry(a.s * 0.6, 1),
                new THREE.MeshStandardMaterial({ color: a.color, roughness: 0.5, flatShading: true }));
            body.position.y = sh.baseHeight + a.s * 0.5;
            sh.group.add(body);
            
            const head = new THREE.Mesh(new THREE.DodecahedronGeometry(a.s * 0.35, 1),
                new THREE.MeshStandardMaterial({ color: a.color, roughness: 0.5, flatShading: true }));
            head.position.set(a.s * 0.4, body.position.y + a.s * 0.4, 0);
            sh.group.add(head);
            
            this._anim['animal_' + i] = body;
            
            const hitbox = new THREE.Mesh(new THREE.BoxGeometry(2.7, 3.7, 2.7), new THREE.MeshBasicMaterial({visible:false}));
            hitbox.position.y = 1.75;
            hitbox.userData = { 
                interactive: true, icon: '🐾', title: 'Prototype 3D : ' + a.name,
                description: '<p>Une modélisation 3D d\'animal.</p>',
                prototypeFunc: () => {
                    const bg = new THREE.Group();
                    const b = new THREE.Mesh(new THREE.DodecahedronGeometry(a.s * 0.6, 1), new THREE.MeshStandardMaterial({ color: a.color, flatShading: true }));
                    const h = new THREE.Mesh(new THREE.DodecahedronGeometry(a.s * 0.35, 1), new THREE.MeshStandardMaterial({ color: a.color, flatShading: true }));
                    h.position.set(a.s * 0.4, a.s * 0.4, 0);
                    bg.add(b); bg.add(h);
                    return bg;
                }
            };
            Controls.addInteractable(hitbox);
            sh.group.add(hitbox);
            
            g.add(sh.group);
        });

        scene.add(g);
    },
    update(time) {
        for (const k in this._anim) {
            if (k.startsWith('animal_')) {
                this._anim[k].rotation.y = time * 0.3;
            }
        }
    },
};
window.RoomBiodiversity = RoomBiodiversity;
