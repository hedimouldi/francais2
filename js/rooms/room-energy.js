/* ============================================
   ÉcoTech 3D — Room 2: Énergies Renouvelables
   ============================================ */
const RoomEnergy = {
    _anim: {},
    build(scene) {
        const pos = Museum.roomPositions.energy;
        const g = new THREE.Group();
        g.name = 'EnergyExhibits';

        // === 4 NEW DALL-E PANELS ===
        const imgPath = 'assets/panels/energy_panel_1776878172899.png';
        const p1 = EcoUtils.createImagePanel(imgPath, 'Énergie 1', 'Transition vers les énergies propres.', 5, 3.5);
        p1.position.set(pos.x - 10, 4.5, pos.z - 17.8);
        Controls.addInteractable(p1);
        g.add(p1);

        const p2 = EcoUtils.createImagePanel(imgPath, 'Énergie 2', 'Le futur de l\'énergie éolienne.', 5, 3.5);
        p2.position.set(pos.x + 10, 4.5, pos.z - 17.8);
        Controls.addInteractable(p2);
        g.add(p2);

        const p3 = EcoUtils.createImagePanel(imgPath, 'Énergie 3', 'Innovation solaire.', 5, 3.5);
        p3.position.set(pos.x - 17.8, 4.5, pos.z + 12);
        p3.rotation.y = Math.PI / 2;
        Controls.addInteractable(p3);
        g.add(p3);

        const p4 = EcoUtils.createImagePanel(imgPath, 'Énergie 4', 'Réseaux intelligents.', 5, 3.5);
        p4.position.set(pos.x + 17.8, 4.5, pos.z - 12);
        p4.rotation.y = -Math.PI / 2;
        Controls.addInteractable(p4);
        g.add(p4);

        // === WALL PAINTINGS (Legacy upgraded) ===
        const solarPaint = EcoUtils.createWallPainting(4.5, 3, (ctx, w, h) => {
            ctx.fillStyle = '#fffbe6'; ctx.fillRect(0, 0, w, h);
            const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
            sky.addColorStop(0, '#87CEEB'); sky.addColorStop(1, '#ffeebb');
            ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.5);
            ctx.beginPath(); ctx.arc(w * 0.8, h * 0.15, 50, 0, Math.PI * 2); ctx.fillStyle = '#ffd700'; ctx.fill();
            ctx.fillStyle = '#1a1a4a';
            for (let i = 0; i < 6; i++) {
                const px = 80 + i * 130; const py = h * 0.65;
                ctx.save(); ctx.translate(px, py); ctx.rotate(-0.3); ctx.fillRect(-50, -30, 100, 60); ctx.restore();
            }
            ctx.fillStyle = '#4a7856'; ctx.fillRect(0, h * 0.82, w, h * 0.18);
            ctx.font = 'bold 30px Outfit'; ctx.fillStyle = '#333'; ctx.textAlign = 'center'; ctx.fillText('☀️ Ferme Solaire', w/2, h - 20);
        });
        solarPaint.position.set(pos.x + 17.8, 3.5, pos.z + 5);
        solarPaint.rotation.y = -Math.PI / 2;
        solarPaint.userData = { interactive: true, icon: '☀️', title: 'Énergie Solaire', description: 'Les panneaux solaires convertissent la lumière en électricité.' };
        Controls.addInteractable(solarPaint);
        g.add(solarPaint);

        const windPaint = EcoUtils.createWallPainting(4.5, 3, (ctx, w, h) => {
            const sky = ctx.createLinearGradient(0, 0, 0, h);
            sky.addColorStop(0, '#5a9ad5'); sky.addColorStop(1, '#a4d4a4'); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#3a6a3a'; ctx.fillRect(0, h * 0.85, w, h * 0.15);
            ctx.font = 'bold 30px Outfit'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('🌬️ Parc Éolien', w/2, h - 20);
        });
        windPaint.position.set(pos.x + 17.8, 3.5, pos.z - 5);
        windPaint.rotation.y = -Math.PI / 2;
        windPaint.userData = { interactive: true, icon: '🌬️', title: 'Énergie Éolienne', description: 'L\'éolien fournit 7% de l\'électricité mondiale.' };
        Controls.addInteractable(windPaint);
        g.add(windPaint);

        const compPaint = EcoUtils.createWallPainting(4, 3, (ctx, w, h) => {
            ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
            ctx.font = 'bold 28px Outfit'; ctx.fillStyle = '#333'; ctx.textAlign = 'center'; ctx.fillText('⚡ Fossile vs Renouvelable', w/2, 40);
        });
        compPaint.position.set(pos.x - 17.8, 3.5, pos.z - 10); // Door is at pos.z = 0
        compPaint.rotation.y = Math.PI / 2;
        Controls.addInteractable(compPaint);
        g.add(compPaint);

        // === SHOWCASES WITH 3D PROTOTYPES ===
        
        // 1. Turbine Showcase
        const turbineShowcase = EcoUtils.createShowcase(4, 6, 4);
        turbineShowcase.group.position.set(pos.x - 5, 0, pos.z);
        
        const turbine = this._createTurbine();
        turbine.position.set(0, turbineShowcase.baseHeight - 3.5, 0); // _createTurbine tower is at y=3.5
        turbine.scale.set(0.6, 0.6, 0.6);
        turbineShowcase.group.add(turbine);
        
        const turbineHitbox = new THREE.Mesh(new THREE.BoxGeometry(4.2, 6.2, 4.2), new THREE.MeshBasicMaterial({visible:false}));
        turbineHitbox.position.y = 3;
        turbineHitbox.userData = { 
            interactive: true, icon: '🌬️', title: 'Éolienne 3D',
            description: '<p>Prototype animé d\'éolienne.</p>',
            prototypeFunc: () => {
                const t = this._createTurbine();
                t.position.y = -3;
                return t;
            }
        };
        Controls.addInteractable(turbineHitbox);
        turbineShowcase.group.add(turbineHitbox);
        g.add(turbineShowcase.group);

        // 2. Battery Showcase
        const battShowcase = EcoUtils.createShowcase(3, 4.5, 3);
        battShowcase.group.position.set(pos.x + 5, 0, pos.z + 5);

        const battGeo = new THREE.BoxGeometry(0.8, 2.5, 0.6);
        const battMat = new THREE.MeshStandardMaterial({ color: 0x2a2a3a, roughness: 0.3, metalness: 0.5 });
        const batt = new THREE.Mesh(battGeo, battMat);
        batt.position.y = battShowcase.baseHeight + 1.25;
        battShowcase.group.add(batt);

        const fillGeo = new THREE.BoxGeometry(0.65, 2, 0.45);
        const fillMat = new THREE.MeshStandardMaterial({ color: 0x00d4aa, emissive: 0x00d4aa, emissiveIntensity: 0.3, transparent: true, opacity: 0.8 });
        const fill = new THREE.Mesh(fillGeo, fillMat);
        fill.position.y = battShowcase.baseHeight + 1.0; 
        fill.scale.y = 0.5;
        battShowcase.group.add(fill);
        this._anim.batteryFill = fill;

        const battHitbox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.7, 3.2), new THREE.MeshBasicMaterial({visible:false}));
        battHitbox.position.y = 2.25;
        battHitbox.userData = { 
            interactive: true, icon: '🔋', title: 'Batterie Haute Capacité',
            description: '<p>Stockage intelligent d\'énergie.</p>',
            prototypeFunc: () => {
                const bg = new THREE.Group();
                const b = new THREE.Mesh(battGeo, battMat);
                b.position.y = 1.25;
                const f = new THREE.Mesh(fillGeo, fillMat);
                f.position.y = 1.0; f.scale.y = 0.8;
                bg.add(b); bg.add(f);
                return bg;
            }
        };
        Controls.addInteractable(battHitbox);
        battShowcase.group.add(battHitbox);
        g.add(battShowcase.group);

        scene.add(g);
    },
    _createSolarPanel() {
        const g = new THREE.Group();
        const panelGeo = new THREE.BoxGeometry(1.5, 0.05, 1);
        const panelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a4a, roughness: 0.15, metalness: 0.8 });
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.position.y = 1.5; panel.rotation.x = -Math.PI / 6; g.add(panel);
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8),
            new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7 }));
        pole.position.y = 0.75; g.add(pole);
        return g;
    },
    _createTurbine() {
        const g = new THREE.Group();
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 7, 8),
            new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.4, metalness: 0.5 }));
        tower.position.y = 3.5; g.add(tower);
        const nac = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.6),
            new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.5 }));
        nac.position.y = 7.1; g.add(nac);
        const blades = new THREE.Group();
        blades.position.set(0, 7.1, 0.35);
        for (let i = 0; i < 3; i++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.5, 0.02),
                new THREE.MeshStandardMaterial({ color: 0xffffff }));
            blade.position.y = 1.25;
            const bc = new THREE.Group(); bc.add(blade);
            bc.rotation.z = (i / 3) * Math.PI * 2;
            blades.add(bc);
        }
        g.add(blades);
        this._anim.blades = blades;
        return g;
    },
    update(time) {
        if (this._anim.blades) this._anim.blades.rotation.z = time * 2;
        if (this._anim.batteryFill) {
            const l = 0.3 + (Math.sin(time * 0.5) + 1) / 2 * 0.7;
            this._anim.batteryFill.scale.y = l;
            this._anim.batteryFill.position.y = 1 + l * 1.2;
        }
    },
};
window.RoomEnergy = RoomEnergy;
