/* ============================================
   ÉcoTech 3D — Room 5: Recyclage & Économie Circulaire
   ============================================ */
const RoomRecycling = {
    _anim: {},
    build(scene) {
        const pos = Museum.roomPositions.recycling;
        const g = new THREE.Group();
        g.name = 'RecyclingExhibits';

        // === 4 NEW DALL-E PANELS ===
        const imgPath = 'assets/panels/recycling_panel_1776878393692.png';
        const p1 = EcoUtils.createImagePanel(imgPath, 'Recyclage 1', 'Tri sélectif innovant.', 5, 3.5);
        p1.position.set(pos.x - 10, 4.5, pos.z - 17.8);
        Controls.addInteractable(p1);
        g.add(p1);

        const p2 = EcoUtils.createImagePanel(imgPath, 'Recyclage 2', 'Transformation des déchets.', 5, 3.5);
        p2.position.set(pos.x + 10, 4.5, pos.z - 17.8);
        Controls.addInteractable(p2);
        g.add(p2);

        const p3 = EcoUtils.createImagePanel(imgPath, 'Recyclage 3', 'Impact sur la nature.', 5, 3.5);
        p3.position.set(pos.x - 17.8, 4.5, pos.z - 12);
        p3.rotation.y = Math.PI / 2;
        Controls.addInteractable(p3);
        g.add(p3);

        const p4 = EcoUtils.createImagePanel(imgPath, 'Recyclage 4', 'Économie circulaire.', 5, 3.5);
        p4.position.set(pos.x + 17.8, 4.5, pos.z - 12);
        p4.rotation.y = -Math.PI / 2;
        Controls.addInteractable(p4);
        g.add(p4);

        // === WALL PAINTINGS (Legacy upgraded) ===
        const wheelPaint = EcoUtils.createWallPainting(4, 3.5, (ctx, w, h) => {
            ctx.fillStyle = '#f0fff0'; ctx.fillRect(0, 0, w, h);
            ctx.font = 'bold 30px Outfit'; ctx.fillStyle = '#2ecc71'; ctx.textAlign = 'center'; ctx.fillText('🔄 Cycle de l\'Économie Circulaire', w/2, 45);
            const cx = w/2, cy = h/2 + 20, r = 100; const steps = ['🏭 Produire', '🛒 Utiliser', '🗑️ Collecter', '♻️ Recycler'];
            ctx.strokeStyle = '#2ecc71'; ctx.lineWidth = 8;
            for (let i = 0; i < 4; i++) {
                const a = i * Math.PI/2 - Math.PI/4; ctx.beginPath(); ctx.arc(cx, cy, r, a + 0.2, a + Math.PI/2 - 0.2); ctx.stroke();
                const ax = cx + Math.cos(a + Math.PI/2 - 0.1) * r; const ay = cy + Math.sin(a + Math.PI/2 - 0.1) * r;
                ctx.beginPath(); ctx.arc(ax, ay, 10, 0, Math.PI*2); ctx.fill();
                const lx = cx + Math.cos(a + Math.PI/4) * (r + 70); const ly = cy + Math.sin(a + Math.PI/4) * (r + 70);
                ctx.font = '24px Inter'; ctx.fillStyle = '#333'; ctx.fillText(steps[i], lx, ly);
            }
        });
        wheelPaint.position.set(pos.x - 17.8, 3.5, pos.z - 2);
        wheelPaint.rotation.y = Math.PI / 2;
        wheelPaint.userData = { interactive: true, icon: '🔄', title: 'Économie Circulaire', description: 'Réduire, réutiliser, recycler.' };
        Controls.addInteractable(wheelPaint);
        g.add(wheelPaint);

        const sortPaint = EcoUtils.createWallPainting(4.5, 3, (ctx, w, h) => {
            ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
            ctx.font = 'bold 30px Outfit'; ctx.fillStyle = '#333'; ctx.textAlign = 'center'; ctx.fillText('♻️ Guide du Tri Sélectif', w/2, 40);
            const bins = [{c:'#eedd44',t:'Emballages & Plastiques',i:'🧴'},{c:'#4488ff',t:'Papiers & Cartons',i:'📄'},
                          {c:'#44cc44',t:'Verre',i:'🍾'},{c:'#666666',t:'Déchets non recyclables',i:'🗑️'}];
            bins.forEach((b, i) => {
                const x = 50 + i * (w/4);
                ctx.fillStyle = b.c; ctx.beginPath(); ctx.moveTo(x+20, 150); ctx.lineTo(x+100, 150); ctx.lineTo(x+90, 260); ctx.lineTo(x+30, 260); ctx.fill();
                ctx.fillStyle = '#444'; ctx.fillRect(x+10, 140, 100, 10);
                ctx.font = '40px serif'; ctx.textAlign = 'center'; ctx.fillText(b.i, x+60, 210);
                ctx.font = '18px Inter'; ctx.fillStyle = '#333';
                const words = b.t.split(' ');
                if(words.length > 2) { ctx.fillText(words[0]+' '+words[1], x+60, 290); ctx.fillText(words.slice(2).join(' '), x+60, 315); }
                else ctx.fillText(b.t, x+60, 290);
            });
        });
        sortPaint.position.set(pos.x, 3.5, pos.z - 17.8); // Front wall
        sortPaint.userData = { interactive: true, icon: '♻️', title: 'Tri Sélectif', description: 'Le recyclage commence par le tri à la source.' };
        Controls.addInteractable(sortPaint);
        g.add(sortPaint);
        
        const trashPaint = EcoUtils.createWallPainting(4, 3, (ctx, w, h) => {
            const sky = ctx.createLinearGradient(0,0,0,h); sky.addColorStop(0,'#ccccdd'); sky.addColorStop(1,'#aaaabb'); ctx.fillStyle = sky; ctx.fillRect(0,0,w,h);
            ctx.fillStyle = '#6b5e51'; ctx.beginPath(); ctx.moveTo(w*0.1, h*0.9); ctx.lineTo(w*0.4, h*0.3); ctx.lineTo(w*0.8, h*0.2); ctx.lineTo(w*0.9, h*0.9); ctx.fill();
            ctx.fillStyle = '#5a4d40'; ctx.beginPath(); ctx.moveTo(w*0.05, h*0.9); ctx.lineTo(w*0.3, h*0.5); ctx.lineTo(w*0.6, h*0.4); ctx.lineTo(w*0.8, h*0.9); ctx.fill();
            ctx.fillStyle = '#ffaa44'; ctx.fillRect(w*0.4, h*0.6, 15, 10); ctx.fillStyle = '#44aaff'; ctx.fillRect(w*0.6, h*0.7, 10, 15);
            ctx.font = 'bold 30px Outfit'; ctx.fillStyle = '#333'; ctx.textAlign = 'center'; ctx.fillText('🗑️ Montagne de Déchets', w/2, 40);
        });
        trashPaint.position.set(pos.x + 17.8, 3.5, pos.z - 2);
        trashPaint.rotation.y = -Math.PI / 2;
        trashPaint.userData = { interactive: true, icon: '🗑️', title: 'Pollution Mondiale', description: '2 milliards de tonnes de déchets produits chaque année.' };
        Controls.addInteractable(trashPaint);
        g.add(trashPaint);

        // === SHOWCASES WITH 3D PROTOTYPES ===
        
        // 1. Sorting Bins Showcase
        const binsShowcase = EcoUtils.createShowcase(8, 4, 3);
        binsShowcase.group.position.set(pos.x, 0, pos.z + 5);
        
        const binsGr = new THREE.Group();
        binsGr.position.set(0, binsShowcase.baseHeight, 0);
        const binsData = [{l:'Plastique',c:0xffcc00},{l:'Papier',c:0x4488ff},{l:'Verre',c:0x44cc44}];
        binsData.forEach((b, i) => {
            const binMat = new THREE.MeshStandardMaterial({color:b.c, roughness: 0.3, metalness:0.3});
            const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 1.5, 12), binMat);
            bMesh.position.set(-2.5 + i*2.5, 0.75, 0);
            bMesh.castShadow = true; bMesh.receiveShadow = true;
            binsGr.add(bMesh);
            const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.1, 12), new THREE.MeshStandardMaterial({color:0x444444}));
            lid.position.set(-2.5 + i*2.5, 1.55, 0); binsGr.add(lid);
            const lbl = EcoUtils.createTextSprite(b.l, {fontSize:24, color:'#fff', bgColor:'rgba(0,0,0,0.5)', scale:0.005});
            lbl.position.set(-2.5 + i*2.5, 2, 0); binsGr.add(lbl);
        });
        
        const binsHitbox = new THREE.Mesh(new THREE.BoxGeometry(7.8, 4, 2.8), new THREE.MeshBasicMaterial({visible:false}));
        binsHitbox.position.y = 2;
        binsHitbox.userData = { 
            interactive: true, icon: '♻️', title: 'Bacs de Tri 3D',
            description: '<p>Jetez dans la bonne poubelle pour le recyclage.</p>',
            prototypeFunc: () => {
                const clone = binsGr.clone();
                clone.position.y = -1;
                return clone;
            }
        };
        Controls.addInteractable(binsHitbox);
        binsShowcase.group.add(binsGr);
        binsShowcase.group.add(binsHitbox);
        g.add(binsShowcase.group);

        // 2. Conveyor Belt Showcase
        const convShowcase = EcoUtils.createShowcase(8, 3, 3);
        convShowcase.group.position.set(pos.x, 0, pos.z - 5);
        
        const convGr = new THREE.Group();
        convGr.position.set(0, convShowcase.baseHeight, 0);
        const belt = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 1), new THREE.MeshStandardMaterial({color:0x333333, roughness:0.8}));
        belt.position.y = 0.5; convGr.add(belt);
        const items = [];
        for(let i=0; i<4; i++) {
            const item = new THREE.Mesh(new THREE.BoxGeometry(0.3,0.3,0.3), new THREE.MeshStandardMaterial({color:0x44aaff}));
            item.position.set(-2.5 + i*1.5, 0.85, 0);
            convGr.add(item); items.push(item);
        }
        this._anim.items = items;
        
        const convHitbox = new THREE.Mesh(new THREE.BoxGeometry(7.8, 3, 2.8), new THREE.MeshBasicMaterial({visible:false}));
        convHitbox.position.y = 1.5;
        convHitbox.userData = { 
            interactive: true, icon: '🏭', title: 'Usine de Tri 3D',
            description: '<p>Les déchets sont triés sur des tapis roulants avant d\'être recyclés.</p>',
            prototypeFunc: () => {
                const clone = convGr.clone();
                clone.position.y = -1;
                return clone;
            }
        };
        Controls.addInteractable(convHitbox);
        convShowcase.group.add(convGr);
        convShowcase.group.add(convHitbox);
        g.add(convShowcase.group);

        scene.add(g);
    },
    update(time, delta) {
        if(this._anim.items) {
            this._anim.items.forEach(i => {
                i.position.x += 1 * delta;
                if(i.position.x > 3) i.position.x = -3;
                i.rotation.z = time * 2;
            });
        }
    }
};
window.RoomRecycling = RoomRecycling;
