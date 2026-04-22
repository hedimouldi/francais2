/* ============================================
   ÉcoTech 3D — Room 3: Villes Durables
   ============================================ */
const RoomCities = {
    _anim: {},
    build(scene) {
        const pos = Museum.roomPositions.cities;
        const g = new THREE.Group();
        g.name = 'CitiesExhibits';

        // === 4 NEW DALL-E PANELS ===
        const imgPath = 'assets/panels/cities_panel_1776878264364.png';
        const p1 = EcoUtils.createImagePanel(imgPath, 'Ville 1', 'Mobilité verte.', 5, 3.5, 'cities');
        p1.position.set(pos.x - 10, 4.5, pos.z - 17.8);
        Controls.addInteractable(p1);
        g.add(p1);

        const p2 = EcoUtils.createImagePanel(imgPath, 'Ville 2', 'Bâtiments intelligents.', 5, 3.5, 'cities');
        p2.position.set(pos.x + 10, 4.5, pos.z - 17.8);
        Controls.addInteractable(p2);
        g.add(p2);

        const p3 = EcoUtils.createImagePanel(imgPath, 'Ville 3', 'Agriculture urbaine.', 5, 3.5, 'cities');
        p3.position.set(pos.x - 17.8, 4.5, pos.z - 12);
        p3.rotation.y = Math.PI / 2;
        Controls.addInteractable(p3);
        g.add(p3);

        const p4 = EcoUtils.createImagePanel(imgPath, 'Ville 4', 'Gestion des flux.', 5, 3.5, 'cities');
        p4.position.set(pos.x + 17.8, 4.5, pos.z - 12);
        p4.rotation.y = -Math.PI / 2;
        Controls.addInteractable(p4);
        g.add(p4);

        // === WALL PAINTINGS (Legacy upgraded) ===
        const cityPaint = EcoUtils.createWallPainting(5, 3.5, (ctx, w, h) => {
            const sky = ctx.createLinearGradient(0, 0, 0, h * 0.4);
            sky.addColorStop(0, '#1a0a3a'); sky.addColorStop(1, '#4a2a8a');
            ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.4);
            const bColors = ['#2a3a5a', '#3a4a6a', '#4a5a7a', '#2a4a5a'];
            const buildings = [{x:50,w:80,h:350},{x:140,w:60,h:280},{x:220,w:100,h:400},{x:340,w:70,h:320},
                {x:430,w:90,h:380},{x:540,w:60,h:250},{x:620,w:110,h:420},{x:750,w:70,h:300},{x:840,w:80,h:360}];
            buildings.forEach((b, i) => {
                ctx.fillStyle = bColors[i % bColors.length];
                ctx.fillRect(b.x, h - b.h, b.w, b.h);
                ctx.fillStyle = 'rgba(255,215,0,0.4)';
                for (let wy = h - b.h + 15; wy < h - 20; wy += 25) {
                    for (let wx = b.x + 10; wx < b.x + b.w - 10; wx += 18) { ctx.fillRect(wx, wy, 8, 12); }
                }
                if (i % 3 === 0) { ctx.fillStyle = '#1a1a4a'; ctx.fillRect(b.x + 5, h - b.h - 5, b.w - 10, 5); }
                if (i % 3 === 1) { ctx.fillStyle = '#2ecc71'; ctx.fillRect(b.x + 5, h - b.h - 4, b.w - 10, 4); }
            });
            ctx.fillStyle = 'rgba(0,212,170,0.6)';
            ctx.beginPath(); ctx.ellipse(300, 120, 15, 6, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(600, 80, 12, 5, 0.2, 0, Math.PI * 2); ctx.fill();
            ctx.font = 'bold 30px Outfit'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('🏙️ Ville Durable du Futur', w/2, h - 15);
        });
        cityPaint.position.set(pos.x, 3.5, pos.z + 17.8);
        cityPaint.rotation.y = Math.PI;
        cityPaint.userData = { interactive: true, icon: '🏙️', title: 'Ville Futuriste', description: 'Les smart cities intègrent panneaux solaires et transports électriques.' };
        Controls.addInteractable(cityPaint);
        g.add(cityPaint);

        const transportPaint = EcoUtils.createInfoPanel('Transport Intelligent',
            'Les villes durables adoptent :\n\n🚆 Métro automatique\n🚌 Bus électriques\n🚲 Vélos en libre-service\n🚗 Voitures autonomes\n🚶 Zones piétonnes',
            { icon: '🚆', accentColor: '#b48eff', width: 3, height: 3.5 });
        transportPaint.position.set(pos.x + 17.8, 3.5, pos.z - 5);
        transportPaint.rotation.y = -Math.PI / 2;
        Controls.addInteractable(transportPaint);
        g.add(transportPaint);

        const greenPaint = EcoUtils.createWallPainting(4, 3, (ctx, w, h) => {
            ctx.fillStyle = '#e8f5e8'; ctx.fillRect(0, 0, w, h);
            ctx.font = 'bold 32px Outfit'; ctx.fillStyle = '#27ae60'; ctx.textAlign = 'center'; ctx.fillText('🌿 Toits Végétalisés', w/2, 40);
            ctx.fillStyle = '#778899'; ctx.fillRect(w*0.25, h*0.35, w*0.5, h*0.55);
            ctx.fillStyle = '#aaddff';
            for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) ctx.fillRect(w*0.3 + c*80, h*0.4 + r*60, 40, 30);
            ctx.fillStyle = '#27ae60'; ctx.fillRect(w*0.2, h*0.3, w*0.6, h*0.08);
            ctx.fillStyle = '#1a8a3a';
            for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(w*0.22 + i*(w*0.56/7), h*0.3, 12, Math.PI, 0); ctx.fill(); }
            ctx.font = '22px Inter'; ctx.fillStyle = '#555'; ctx.textAlign = 'left';
            ctx.fillText('• Réduction température : -5°C', 40, h - 80); ctx.fillText('• Économie d\'énergie : -25%', 40, h - 50); ctx.fillText('• Absorption CO₂ et pluie', 40, h - 20);
        });
        greenPaint.position.set(pos.x - 17.8, 3.5, pos.z + 3);
        greenPaint.rotation.y = Math.PI / 2;
        Controls.addInteractable(greenPaint);
        g.add(greenPaint);

        // === SHOWCASES WITH 3D PROTOTYPES ===
        
        // 1. City Diorama Showcase
        const cityShowcase = EcoUtils.createShowcase(12, 4, 12);
        cityShowcase.group.position.set(pos.x, 0, pos.z);
        
        const cityModel = new THREE.Group();
        cityModel.position.set(0, cityShowcase.baseHeight, 0);
        const platform = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 0.3, 32),
            new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.2, metalness: 0.3 }));
        platform.position.y = 0.15;
        cityModel.add(platform);
        
        const bData = [{x:-2,z:-1.5,w:0.8,h:2.5,d:0.8,c:0x5577aa},{x:0,z:-2,w:1,h:3.5,d:0.7,c:0x6688bb},
            {x:2,z:-1,w:0.7,h:2,d:0.7,c:0x5588aa},{x:-1.5,z:1,w:0.9,h:1.8,d:0.9,c:0x4477aa},
            {x:1,z:1.5,w:1.2,h:2.8,d:0.8,c:0x6699bb},{x:-3,z:0,w:0.6,h:1.5,d:0.6,c:0x557799}];
        bData.forEach(b => {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d),
                new THREE.MeshStandardMaterial({ color: b.c, roughness: 0.4, metalness: 0.2 }));
            mesh.position.set(b.x, 0.3 + b.h / 2, b.z);
            cityModel.add(mesh);
            if (Math.random() > 0.4) {
                const roof = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.8, 0.1, b.d * 0.8),
                    new THREE.MeshStandardMaterial({ color: 0x2ecc71 }));
                roof.position.set(b.x, 0.3 + b.h + 0.05, b.z);
                cityModel.add(roof);
            }
        });
        
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2; const d = 3 + Math.random();
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.5, 6),
                new THREE.MeshStandardMaterial({ color: 0x6b4226 }));
            trunk.position.set(Math.cos(a) * d, 0.55, Math.sin(a) * d);
            cityModel.add(trunk);
            const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6),
                new THREE.MeshStandardMaterial({ color: 0x2ecc71 }));
            foliage.position.set(Math.cos(a) * d, 0.85, Math.sin(a) * d);
            cityModel.add(foliage);
        }
        const car = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.2),
            new THREE.MeshStandardMaterial({ color: 0x00d4aa, emissive: 0x00d4aa, emissiveIntensity: 0.2 }));
        car.position.y = 0.4;
        cityModel.add(car);
        this._anim.car = car;
        
        const cityHitbox = new THREE.Mesh(new THREE.BoxGeometry(11.8, 4, 11.8), new THREE.MeshBasicMaterial({visible:false}));
        cityHitbox.position.y = 2;
        cityHitbox.userData = { 
            interactive: true, icon: '🏙️', title: 'Maquette Ville Durable',
            description: '<p>Une maquette interactive.</p>',
            prototypeFunc: () => {
                const clone = cityModel.clone();
                clone.position.y = -1;
                return clone;
            }
        };
        Controls.addInteractable(cityHitbox);
        
        cityShowcase.group.add(cityModel);
        cityShowcase.group.add(cityHitbox);
        g.add(cityShowcase.group);

        scene.add(g);
    },
    update(time) {
        if (this._anim.car) {
            this._anim.car.position.x = Math.cos(time * 0.8) * 3;
            this._anim.car.position.z = Math.sin(time * 0.8) * 3;
            this._anim.car.rotation.y = -time * 0.8 + Math.PI / 2;
        }
    },
};
window.RoomCities = RoomCities;
