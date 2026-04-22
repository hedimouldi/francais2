/* ============================================
   ÉcoTech 3D — Room 1: Climat & Réchauffement
   Bright museum style
   ============================================ */
const RoomClimate = {
    _anim: {},
    build(scene) {
        const pos = Museum.roomPositions.climate;
        const g = new THREE.Group();
        g.name = 'ClimateExhibits';

        // === 4 NEW DALL-E PANELS ===
        const imgPath = 'assets/panels/climate_panel_1776878073955.png'; // Reusing the generated one 4 times to look like a gallery
        const p1 = EcoUtils.createImagePanel(imgPath, 'Impact 1', 'Effets dévastateurs du réchauffement.', 5, 3.5);
        p1.position.set(pos.x - 10, 4.5, pos.z - 17.8);
        Controls.addInteractable(p1);
        g.add(p1);

        const p2 = EcoUtils.createImagePanel(imgPath, 'Impact 2', 'Fonte des glaces accélérée.', 5, 3.5);
        p2.position.set(pos.x + 10, 4.5, pos.z - 17.8);
        Controls.addInteractable(p2);
        g.add(p2);

        const p3 = EcoUtils.createImagePanel(imgPath, 'Impact 3', 'Hausse du niveau des mers.', 5, 3.5);
        p3.position.set(pos.x - 17.8, 4.5, pos.z + 12);
        p3.rotation.y = Math.PI / 2;
        Controls.addInteractable(p3);
        g.add(p3);

        const p4 = EcoUtils.createImagePanel(imgPath, 'Impact 4', 'Sécheresses extrêmes.', 5, 3.5);
        p4.position.set(pos.x, 4.5, pos.z + 17.8);
        p4.rotation.y = Math.PI;
        Controls.addInteractable(p4);
        g.add(p4);


        // === WALL PAINTINGS (Legacy upgraded) ===
        const glacierPaint = EcoUtils.createWallPainting(4, 3, (ctx, w, h) => {
            ctx.fillStyle = '#e0f4ff'; ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#88ccff'; ctx.beginPath(); ctx.moveTo(w*0.1, h*0.8); ctx.lineTo(w*0.25, h*0.15); ctx.lineTo(w*0.4, h*0.8); ctx.fill();
            ctx.font = 'bold 28px Outfit'; ctx.fillStyle = '#2980b9'; ctx.textAlign = 'center'; ctx.fillText('1950', w*0.25, h*0.92);
            ctx.font = '48px sans-serif'; ctx.fillStyle = '#ff4444'; ctx.fillText('→', w*0.5, h*0.5);
            ctx.fillStyle = '#aaddff'; ctx.beginPath(); ctx.moveTo(w*0.6, h*0.8); ctx.lineTo(w*0.72, h*0.45); ctx.lineTo(w*0.84, h*0.8); ctx.fill();
            ctx.font = 'bold 28px Outfit'; ctx.fillStyle = '#e74c3c'; ctx.fillText('2024', w*0.72, h*0.92);
            ctx.font = 'bold 36px Outfit'; ctx.fillStyle = '#333'; ctx.fillText('🧊 Fonte des Glaciers', w*0.5, 45);
        });
        glacierPaint.position.set(pos.x - 17.8, 3.5, pos.z - 6);
        glacierPaint.rotation.y = Math.PI / 2;
        glacierPaint.userData = { interactive: true, icon: '🧊', title: 'Fonte des Glaciers', description: 'Les glaciers ont perdu plus de 30% de leur volume.' };
        Controls.addInteractable(glacierPaint);
        g.add(glacierPaint);

        const disasterPaint = EcoUtils.createWallPainting(5, 3, (ctx, w, h) => {
            ctx.fillStyle = '#0a1520'; ctx.fillRect(0, 0, w, h);
            ctx.font = 'bold 32px Outfit'; ctx.fillStyle = '#ff6b6b'; ctx.textAlign = 'center'; ctx.fillText('Carte des Catastrophes Climatiques', w/2, 45);
        });
        disasterPaint.position.set(pos.x + 17.8, 3.5, pos.z + 10); // Door is at 0, moved to +10
        disasterPaint.rotation.y = -Math.PI / 2;
        Controls.addInteractable(disasterPaint);
        g.add(disasterPaint);

        // === SHOWCASES WITH 3D PROTOTYPES ===
        
        // 1. Globe Showcase
        const globeShowcase = EcoUtils.createShowcase(4, 5, 4);
        globeShowcase.group.position.set(pos.x - 6, 0, pos.z + 2);
        
        const gGeo = new THREE.SphereGeometry(1.2, 48, 48);
        const gTex = EcoUtils.createCanvasTexture(1024, 512, (ctx, w, h) => {
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x += 4) {
                    const temp = Math.sin(x/w*Math.PI*4)*Math.cos(y/h*Math.PI*2);
                    const heat = (temp + 1) / 2;
                    const r = Math.round(50 + heat * 200);
                    const gg = Math.round(100 - heat * 60);
                    const b = Math.round(200 - heat * 180);
                    ctx.fillStyle = `rgb(${r},${gg},${b})`; ctx.fillRect(x, y, 4, 1);
                }
            }
        });
        const gMat = new THREE.MeshStandardMaterial({ map: gTex, roughness: 0.3, metalness: 0.1 });
        const globe = new THREE.Mesh(gGeo, gMat);
        globe.position.y = globeShowcase.baseHeight + 1.5;
        
        // Interactive zone for globe
        const globeHitbox = new THREE.Mesh(new THREE.BoxGeometry(4.2, 5.2, 4.2), new THREE.MeshBasicMaterial({visible:false}));
        globeHitbox.position.y = 2.5;
        globeHitbox.userData = { 
            interactive: true, icon: '🌍', title: 'Globe du Réchauffement',
            description: '<p>Ce prototype 3D montre les températures mondiales.</p>',
            prototypeFunc: () => {
                const clone = new THREE.Mesh(gGeo, gMat);
                return clone;
            }
        };
        Controls.addInteractable(globeHitbox);
        globeShowcase.group.add(globe);
        globeShowcase.group.add(globeHitbox);
        this._anim.globe = globe;
        g.add(globeShowcase.group);

        // 2. Thermometer Showcase
        const thermoShowcase = EcoUtils.createShowcase(3, 6, 3);
        thermoShowcase.group.position.set(pos.x + 6, 0, pos.z - 8);

        const tubeGeo = new THREE.CylinderGeometry(0.25, 0.25, 3.5, 16);
        const tubeMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, transparent: true, opacity: 0.5, roughness: 0.1, metalness: 0.7 });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        tube.position.set(0, thermoShowcase.baseHeight + 2, 0);
        thermoShowcase.group.add(tube);
        
        const mercGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.5, 16);
        const mercMat = new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xcc2222, emissiveIntensity: 0.3 });
        const mercury = new THREE.Mesh(mercGeo, mercMat);
        mercury.position.y = thermoShowcase.baseHeight + 1.5;
        thermoShowcase.group.add(mercury);
        this._anim.mercury = mercury;

        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), mercMat);
        bulb.position.y = thermoShowcase.baseHeight + 0.3;
        thermoShowcase.group.add(bulb);

        const thermoHitbox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 6.2, 3.2), new THREE.MeshBasicMaterial({visible:false}));
        thermoHitbox.position.y = 3;
        thermoHitbox.userData = { 
            interactive: true, icon: '🌡️', title: 'Thermomètre Géant',
            description: '<p>Visualisation de l\'augmentation de la température.</p>',
            prototypeFunc: () => {
                const tg = new THREE.Group();
                tg.add(new THREE.Mesh(tubeGeo, tubeMat));
                tg.add(new THREE.Mesh(mercGeo, mercMat));
                tg.add(new THREE.Mesh(new THREE.SphereGeometry(0.4,16,16), mercMat));
                return tg;
            }
        };
        Controls.addInteractable(thermoHitbox);
        thermoShowcase.group.add(thermoHitbox);
        
        g.add(thermoShowcase.group);

        scene.add(g);
    },
    update(time) {
        if (this._anim.globe) this._anim.globe.rotation.y = time * 0.2;
        if (this._anim.mercury) {
            const h = 3 + Math.sin(time * 0.5) * 0.5;
            this._anim.mercury.scale.y = h / 3.5;
            this._anim.mercury.position.y = 0.5 + (h / 2);
        }
    },
};
window.RoomClimate = RoomClimate;
