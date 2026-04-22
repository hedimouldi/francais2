/* ============================================
   ÉcoTech 3D — Museum Geometry Builder
   Bright, realistic museum style
   ============================================ */

const Museum = {
    // Dimensions
    roomWidth: 36,
    roomDepth: 36,
    roomHeight: 10,
    hallWidth: 40,
    hallDepth: 40,
    hallHeight: 12,
    corridorWidth: 8,
    wallThickness: 0.35,
    doorWidth: 5,
    doorHeight: 5.5,
    doorFrameWidth: 0.2,
    doorFrameDepth: 0.5,

    // Colors - bright museum palette
    colors: {
        wallLight: 0xe8e4de,       // Light cream/gray walls
        wallAccent: 0xd8d4ce,      // Slightly darker accent
        floorCarpet: 0x537d5e,     // Green carpet
        floorWood: 0xc4a05a,       // Wood parquet
        ceiling: 0xf0ece6,         // Off-white ceiling
        doorFrame: 0x8B6914,       // Wood door frame
        skyBlue: 0x87CEEB,         // Sky blue for skylights
        trim: 0xcccccc,            // Gray trim
    },

    // Room positions (center of each room)
    roomPositions: {
        hall:         { x: 0, z: 0 },
        climate:      { x: -60, z: 0 },
        energy:       { x: 60, z: 0 },
        cities:       { x: 0, z: 60 },
        biodiversity: { x: -36, z: -56 },
        recycling:    { x: 36, z: -56 },
    },

    // Collision walls
    collisionWalls: [],

    /**
     * Build the entire museum
     */
    build(scene) {
        const group = new THREE.Group();
        group.name = 'Museum';
        this.collisionWalls = [];

        // ===== CENTRAL HALL =====
        this._buildRoom(group, 0, 0, this.hallWidth, this.hallDepth, this.hallHeight, {
            floorType: 'carpet',
            doors: [
                { wall: 'left', pos: 0, label: '🌿 Salle 1 - Climat' },
                { wall: 'right', pos: 0, label: '⚡ Salle 2 - Énergies' },
                { wall: 'back', pos: 0, label: '🏙️ Salle 3 - Villes' },
                { wall: 'front', pos: -10, label: '🌳 Salle 4 - Biodiversité' },
                { wall: 'front', pos: 10, label: '♻️ Salle 5 - Recyclage' },
            ],
            skylights: true,
            ceilingLights: 6,
            label: 'Hall Central',
        });

        // ===== ROOMS =====
        const roomConfigs = [
            { name: 'climate', x: -60, z: 0, door: 'right', doorPos: 0 },
            { name: 'energy', x: 60, z: 0, door: 'left', doorPos: 0 },
            { name: 'cities', x: 0, z: 60, door: 'front', doorPos: 0 },
            { name: 'biodiversity', x: -36, z: -56, door: 'back', doorPos: 0 },
            { name: 'recycling', x: 36, z: -56, door: 'back', doorPos: 0 },
        ];

        const roomLabels = {
            climate: 'Salle 1 - Climat',
            energy: 'Salle 2 - Énergies',
            cities: 'Salle 3 - Villes Durables',
            biodiversity: 'Salle 4 - Biodiversité',
            recycling: 'Salle 5 - Recyclage',
        };

        roomConfigs.forEach(r => {
            this._buildRoom(group, r.x, r.z, this.roomWidth, this.roomDepth, this.roomHeight, {
                floorType: 'wood',
                doors: [{ wall: r.door, pos: r.doorPos }],
                skylights: true,
                ceilingLights: 4,
                label: roomLabels[r.name],
            });
        });

        // ===== CORRIDORS =====
        // Hall to Climate (left)
        this._buildCorridor(group, -this.hallWidth / 2, 0, this.roomPositions.climate.x + this.roomWidth / 2, 0);
        // Hall to Energy (right)
        this._buildCorridor(group, this.hallWidth / 2, 0, this.roomPositions.energy.x - this.roomWidth / 2, 0);
        // Hall to Cities (back)
        this._buildCorridorVertical(group, 0, this.hallDepth / 2, 0, this.roomPositions.cities.z - this.roomDepth / 2);
        // Hall to Biodiversity (front-left, L-shaped)
        this._buildLCorridor(group, -10, -this.hallDepth / 2, -36, -56 + this.roomDepth / 2);
        // Hall to Recycling (front-right, L-shaped)
        this._buildLCorridor(group, 10, -this.hallDepth / 2, 36, -56 + this.roomDepth / 2);

        // Ground plane
        const groundGeo = new THREE.PlaneGeometry(300, 300);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x3a5a3a, roughness: 1 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.02;
        group.add(ground);

        scene.add(group);
        return group;
    },

    /**
     * Build a room with bright museum aesthetics
     */
    _buildRoom(parent, cx, cz, width, depth, height, options = {}) {
        const t = this.wallThickness;
        const hw = width / 2;
        const hd = depth / 2;
        const doors = options.doors || [];

        // ---- FLOOR ----
        const floorMat = this._createFloorMaterial(options.floorType || 'carpet', width, depth);
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(cx, 0.01, cz);
        parent.add(floor);

        // ---- CEILING ----
        const ceilMat = new THREE.MeshStandardMaterial({ color: this.colors.ceiling, roughness: 0.9, metalness: 0 });
        const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), ceilMat);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(cx, height, cz);
        parent.add(ceiling);

        // ---- WALLS with door openings ----
        const leftDoors = doors.filter(d => d.wall === 'left').map(d => d.pos);
        const rightDoors = doors.filter(d => d.wall === 'right').map(d => d.pos);
        const frontDoors = doors.filter(d => d.wall === 'front').map(d => d.pos);
        const backDoors = doors.filter(d => d.wall === 'back').map(d => d.pos);

        this._buildWall(parent, cx - hw, cz, t, depth, height, 'x', leftDoors);
        this._buildWall(parent, cx + hw, cz, t, depth, height, 'x', rightDoors);
        this._buildWall(parent, cx, cz - hd, width, t, height, 'z', frontDoors);
        this._buildWall(parent, cx, cz + hd, width, t, height, 'z', backDoors);

        // ---- DOOR FRAMES ----
        doors.forEach(d => {
            this._buildDoorFrame(parent, cx, cz, hw, hd, height, d);
        });

        // ---- CEILING LIGHTS (recessed spotlights) ----
        if (options.ceilingLights) {
            this._addCeilingLights(parent, cx, cz, width, depth, height, options.ceilingLights);
        }

        // ---- SKYLIGHTS (clerestory windows) ----
        if (options.skylights) {
            this._addSkylights(parent, cx, cz, width, depth, height);
        }

        // ---- ROOM LABEL ----
        if (options.label) {
            // Put label near a door entrance  
            const firstDoor = doors[0];
            if (firstDoor) {
                const labelSprite = EcoUtils.createTextSprite(options.label, {
                    fontSize: 36,
                    fontWeight: '600',
                    color: '#555555',
                    scale: 0.012,
                });
                labelSprite.position.set(cx, height - 1, cz);
                parent.add(labelSprite);
            }
        }

        // ---- BASEBOARD TRIM ----
        this._addBaseboard(parent, cx, cz, width, depth);
    },

    /**
     * Build a wall with door openings  
     */
    _buildWall(parent, wx, wz, lenX, lenZ, height, faceAxis, doorPositions) {
        const wallMat = new THREE.MeshStandardMaterial({
            color: this.colors.wallLight,
            roughness: 0.85,
            metalness: 0,
        });

        const dw = this.doorWidth;
        const dh = this.doorHeight;

        if (!doorPositions || doorPositions.length === 0) {
            const geo = new THREE.BoxGeometry(lenX, height, lenZ);
            const mesh = new THREE.Mesh(geo, wallMat);
            mesh.position.set(wx, height / 2, wz);
            parent.add(mesh);
            this.collisionWalls.push(mesh);
            return;
        }

        const wallLength = faceAxis === 'z' ? lenX : lenZ;
        const wallThick = faceAxis === 'z' ? lenZ : lenX;
        const sorted = [...doorPositions].sort((a, b) => a - b);

        let currentPos = -wallLength / 2;
        const segments = [];

        for (const doorCenter of sorted) {
            const doorStart = doorCenter - dw / 2;
            const doorEnd = doorCenter + dw / 2;

            if (currentPos < doorStart) {
                segments.push({ center: currentPos + (doorStart - currentPos) / 2, length: doorStart - currentPos, height, yOff: 0 });
            }
            const lintelH = height - dh;
            if (lintelH > 0.1) {
                segments.push({ center: doorCenter, length: dw, height: lintelH, yOff: dh });
            }
            currentPos = doorEnd;
        }

        if (currentPos < wallLength / 2) {
            const segLen = wallLength / 2 - currentPos;
            segments.push({ center: currentPos + segLen / 2, length: segLen, height, yOff: 0 });
        }

        for (const seg of segments) {
            let geo, mesh;
            if (faceAxis === 'z') {
                geo = new THREE.BoxGeometry(seg.length, seg.height, wallThick);
                mesh = new THREE.Mesh(geo, wallMat);
                mesh.position.set(wx + seg.center, seg.yOff + seg.height / 2, wz);
            } else {
                geo = new THREE.BoxGeometry(wallThick, seg.height, seg.length);
                mesh = new THREE.Mesh(geo, wallMat);
                mesh.position.set(wx, seg.yOff + seg.height / 2, wz + seg.center);
            }
            parent.add(mesh);
            if (seg.yOff === 0) this.collisionWalls.push(mesh);
        }
    },

    /**
     * Build a wooden door frame
     */
    _buildDoorFrame(parent, cx, cz, hw, hd, roomHeight, door) {
        const frameMat = new THREE.MeshStandardMaterial({
            color: this.colors.doorFrame,
            roughness: 0.5,
            metalness: 0.1,
        });
        const fw = this.doorFrameWidth;
        const fd = this.doorFrameDepth;
        const dw = this.doorWidth;
        const dh = this.doorHeight;

        let fx, fz, isXWall;

        switch (door.wall) {
            case 'left':
                fx = cx - hw; fz = cz + door.pos; isXWall = true; break;
            case 'right':
                fx = cx + hw; fz = cz + door.pos; isXWall = true; break;
            case 'front':
                fx = cx + door.pos; fz = cz - hd; isXWall = false; break;
            case 'back':
                fx = cx + door.pos; fz = cz + hd; isXWall = false; break;
        }

        if (isXWall) {
            // Left/right wall — frame runs along Z
            // Left post
            const leftPost = new THREE.Mesh(new THREE.BoxGeometry(fd, dh, fw), frameMat);
            leftPost.position.set(fx, dh / 2, fz - dw / 2);
            parent.add(leftPost);
            // Right post
            const rightPost = new THREE.Mesh(new THREE.BoxGeometry(fd, dh, fw), frameMat);
            rightPost.position.set(fx, dh / 2, fz + dw / 2);
            parent.add(rightPost);
            // Top beam
            const topBeam = new THREE.Mesh(new THREE.BoxGeometry(fd, fw, dw + fw * 2), frameMat);
            topBeam.position.set(fx, dh, fz);
            parent.add(topBeam);
        } else {
            // Front/back wall — frame runs along X
            const leftPost = new THREE.Mesh(new THREE.BoxGeometry(fw, dh, fd), frameMat);
            leftPost.position.set(fx - dw / 2, dh / 2, fz);
            parent.add(leftPost);
            const rightPost = new THREE.Mesh(new THREE.BoxGeometry(fw, dh, fd), frameMat);
            rightPost.position.set(fx + dw / 2, dh / 2, fz);
            parent.add(rightPost);
            const topBeam = new THREE.Mesh(new THREE.BoxGeometry(dw + fw * 2, fw, fd), frameMat);
            topBeam.position.set(fx, dh, fz);
            parent.add(topBeam);
        }
    },

    /**
     * Add recessed ceiling lights
     */
    _addCeilingLights(parent, cx, cz, width, depth, height, count) {
        const gridSize = Math.ceil(Math.sqrt(count));
        const spacingX = width / (gridSize + 1);
        const spacingZ = depth / (gridSize + 1);

        for (let i = 1; i <= gridSize; i++) {
            for (let j = 1; j <= gridSize; j++) {
                if ((i - 1) * gridSize + j > count) break;

                const lx = cx - width / 2 + i * spacingX;
                const lz = cz - depth / 2 + j * spacingZ;

                // Light fixture (dark disk)
                const fixtureGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.08, 16);
                const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.7 });
                const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
                fixture.position.set(lx, height - 0.04, lz);
                parent.add(fixture);

                // Light bulb glow
                const glowGeo = new THREE.CircleGeometry(0.3, 16);
                const glowMat = new THREE.MeshStandardMaterial({
                    color: 0xfffff0,
                    emissive: 0xfffff0,
                    emissiveIntensity: 0.8,
                });
                const glow = new THREE.Mesh(glowGeo, glowMat);
                glow.rotation.x = Math.PI / 2;
                glow.position.set(lx, height - 0.09, lz);
                parent.add(glow);

                // Actual point light
                const light = new THREE.PointLight(0xfff8e8, 0.6, 12, 1.5);
                light.position.set(lx, height - 0.3, lz);
                parent.add(light);
            }
        }
    },

    /**
     * Add clerestory skylights near the top of walls
     */
    _addSkylights(parent, cx, cz, width, depth, height) {
        const skyGeo = new THREE.PlaneGeometry(1, 1);
        const skyMat = new THREE.MeshStandardMaterial({
            color: this.colors.skyBlue,
            emissive: this.colors.skyBlue,
            emissiveIntensity: 0.4,
            roughness: 0.1,
            metalness: 0.1,
        });

        const windowH = 1.2;
        const windowW = 2;
        const windowY = height - 0.8;
        const gap = 3;

        const hw = width / 2;
        const hd = depth / 2;

        // Back wall skylights
        const countX = Math.floor(width / (windowW + gap));
        for (let i = 0; i < countX; i++) {
            const wx = cx - (countX - 1) * (windowW + gap) / 2 + i * (windowW + gap);

            // Back wall
            const win1 = new THREE.Mesh(new THREE.PlaneGeometry(windowW, windowH), skyMat);
            win1.position.set(wx, windowY, cz + hd - 0.1);
            win1.rotation.y = Math.PI;
            parent.add(win1);

            // Front wall
            const win2 = new THREE.Mesh(new THREE.PlaneGeometry(windowW, windowH), skyMat);
            win2.position.set(wx, windowY, cz - hd + 0.1);
            parent.add(win2);
        }

        // Side wall skylights
        const countZ = Math.floor(depth / (windowW + gap));
        for (let i = 0; i < countZ; i++) {
            const wz = cz - (countZ - 1) * (windowW + gap) / 2 + i * (windowW + gap);

            // Left wall
            const win3 = new THREE.Mesh(new THREE.PlaneGeometry(windowW, windowH), skyMat);
            win3.position.set(cx - hw + 0.1, windowY, wz);
            win3.rotation.y = Math.PI / 2;
            parent.add(win3);

            // Right wall
            const win4 = new THREE.Mesh(new THREE.PlaneGeometry(windowW, windowH), skyMat);
            win4.position.set(cx + hw - 0.1, windowY, wz);
            win4.rotation.y = -Math.PI / 2;
            parent.add(win4);
        }

        // Skylight frame strips (blue dividers)
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x4488aa, roughness: 0.3, metalness: 0.5 });
        // Horizontal strip at bottom of skylights on back wall
        const stripGeo = new THREE.BoxGeometry(width, 0.08, 0.1);
        const strip1 = new THREE.Mesh(stripGeo, frameMat);
        strip1.position.set(cx, windowY - windowH / 2, cz + hd - 0.05);
        parent.add(strip1);
        const strip2 = new THREE.Mesh(stripGeo, frameMat);
        strip2.position.set(cx, windowY - windowH / 2, cz - hd + 0.05);
        parent.add(strip2);
    },

    /**
     * Add baseboard trim along the bottom of walls
     */
    _addBaseboard(parent, cx, cz, width, depth) {
        const baseH = 0.15;
        const baseD = 0.05;
        const baseMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.4 });

        const hw = width / 2;
        const hd = depth / 2;

        // Front/back baseboards
        const fbGeo = new THREE.BoxGeometry(width, baseH, baseD);
        const front = new THREE.Mesh(fbGeo, baseMat);
        front.position.set(cx, baseH / 2, cz - hd + baseD / 2);
        parent.add(front);
        const back = new THREE.Mesh(fbGeo, baseMat);
        back.position.set(cx, baseH / 2, cz + hd - baseD / 2);
        parent.add(back);

        // Left/right baseboards
        const lrGeo = new THREE.BoxGeometry(baseD, baseH, depth);
        const left = new THREE.Mesh(lrGeo, baseMat);
        left.position.set(cx - hw + baseD / 2, baseH / 2, cz);
        parent.add(left);
        const right = new THREE.Mesh(lrGeo, baseMat);
        right.position.set(cx + hw - baseD / 2, baseH / 2, cz);
        parent.add(right);
    },

    /**
     * Build horizontal corridor
     */
    _buildCorridor(parent, x1, z, x2, zIgnored) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const len = maxX - minX;
        const midX = (minX + maxX) / 2;
        const w = this.corridorWidth;
        const hw = w / 2;
        const h = this.roomHeight;
        const t = this.wallThickness;

        const wallMat = new THREE.MeshStandardMaterial({ color: this.colors.wallLight, roughness: 0.85, metalness: 0 });

        // Floor
        const floorMat = this._createFloorMaterial('carpet', len, w);
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(len, w), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(midX, 0.02, z);
        parent.add(floor);

        // Ceiling
        const ceilMat = new THREE.MeshStandardMaterial({ color: this.colors.ceiling, roughness: 0.9 });
        const ceil = new THREE.Mesh(new THREE.PlaneGeometry(len, w), ceilMat);
        ceil.rotation.x = Math.PI / 2;
        ceil.position.set(midX, h, z);
        parent.add(ceil);

        // Side walls
        const topWall = new THREE.Mesh(new THREE.BoxGeometry(len, h, t), wallMat);
        topWall.position.set(midX, h / 2, z + hw);
        parent.add(topWall);
        this.collisionWalls.push(topWall);

        const botWall = new THREE.Mesh(new THREE.BoxGeometry(len, h, t), wallMat);
        botWall.position.set(midX, h / 2, z - hw);
        parent.add(botWall);
        this.collisionWalls.push(botWall);

        // Corridor light
        const light = new THREE.PointLight(0xfff8e8, 0.4, 15);
        light.position.set(midX, h - 0.5, z);
        parent.add(light);

        // Light fixture
        const fixtureGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.06, 16);
        const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7 });
        const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
        fixture.position.set(midX, h - 0.03, z);
        parent.add(fixture);
    },

    /**
     * Build vertical corridor (along Z)
     */
    _buildCorridorVertical(parent, x, z1, xIgnored, z2) {
        const minZ = Math.min(z1, z2);
        const maxZ = Math.max(z1, z2);
        const len = maxZ - minZ;
        const midZ = (minZ + maxZ) / 2;
        const w = this.corridorWidth;
        const hw = w / 2;
        const h = this.roomHeight;
        const t = this.wallThickness;

        const wallMat = new THREE.MeshStandardMaterial({ color: this.colors.wallLight, roughness: 0.85, metalness: 0 });

        // Floor
        const floorMat = this._createFloorMaterial('carpet', w, len);
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, len), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(x, 0.02, midZ);
        parent.add(floor);

        // Ceiling
        const ceil = new THREE.Mesh(new THREE.PlaneGeometry(w, len), new THREE.MeshStandardMaterial({ color: this.colors.ceiling, roughness: 0.9 }));
        ceil.rotation.x = Math.PI / 2;
        ceil.position.set(x, h, midZ);
        parent.add(ceil);

        // Side walls
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(t, h, len), wallMat);
        leftWall.position.set(x - hw, h / 2, midZ);
        parent.add(leftWall);
        this.collisionWalls.push(leftWall);

        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(t, h, len), wallMat);
        rightWall.position.set(x + hw, h / 2, midZ);
        parent.add(rightWall);
        this.collisionWalls.push(rightWall);

        // Light
        const light = new THREE.PointLight(0xfff8e8, 0.4, 15);
        light.position.set(x, h - 0.5, midZ);
        parent.add(light);
    },

    /**
     * Build L-shaped corridor
     */
    _buildLCorridor(parent, hallDoorX, hallZ, roomX, roomZ) {
        const w = this.corridorWidth;
        const h = this.roomHeight;
        const t = this.wallThickness;
        const hw = w / 2;
        const wallMat = new THREE.MeshStandardMaterial({ color: this.colors.wallLight, roughness: 0.85, metalness: 0 });

        const cornerZ = roomZ + 4;

        // Vertical segment (from hall down)
        const vMinZ = Math.min(hallZ, cornerZ);
        const vMaxZ = Math.max(hallZ, cornerZ);
        const vLen = vMaxZ - vMinZ;
        const vMidZ = (vMinZ + vMaxZ) / 2;

        // Vertical floor
        const vFloor = new THREE.Mesh(new THREE.PlaneGeometry(w, vLen), this._createFloorMaterial('carpet', w, vLen));
        vFloor.rotation.x = -Math.PI / 2;
        vFloor.position.set(hallDoorX, 0.02, vMidZ);
        parent.add(vFloor);

        // Vertical ceiling
        const vCeil = new THREE.Mesh(new THREE.PlaneGeometry(w, vLen), new THREE.MeshStandardMaterial({ color: this.colors.ceiling, roughness: 0.9 }));
        vCeil.rotation.x = Math.PI / 2;
        vCeil.position.set(hallDoorX, h, vMidZ);
        parent.add(vCeil);

        // Vertical walls
        const vl = new THREE.Mesh(new THREE.BoxGeometry(t, h, vLen), wallMat);
        vl.position.set(hallDoorX - hw, h / 2, vMidZ);
        parent.add(vl);
        this.collisionWalls.push(vl);

        const vr = new THREE.Mesh(new THREE.BoxGeometry(t, h, vLen), wallMat);
        vr.position.set(hallDoorX + hw, h / 2, vMidZ);
        parent.add(vr);
        this.collisionWalls.push(vr);

        // Light
        const vLight = new THREE.PointLight(0xfff8e8, 0.3, 12);
        vLight.position.set(hallDoorX, h - 0.5, vMidZ);
        parent.add(vLight);

        // Horizontal segment
        const hMinX = Math.min(hallDoorX, roomX);
        const hMaxX = Math.max(hallDoorX, roomX);
        const hLen = hMaxX - hMinX + w;
        const hMidX = (hMinX + hMaxX) / 2;

        if (hLen > 1) {
            const hFloor = new THREE.Mesh(new THREE.PlaneGeometry(hLen, w), this._createFloorMaterial('carpet', hLen, w));
            hFloor.rotation.x = -Math.PI / 2;
            hFloor.position.set(hMidX, 0.02, cornerZ);
            parent.add(hFloor);

            const hCeil = new THREE.Mesh(new THREE.PlaneGeometry(hLen, w), new THREE.MeshStandardMaterial({ color: this.colors.ceiling, roughness: 0.9 }));
            hCeil.rotation.x = Math.PI / 2;
            hCeil.position.set(hMidX, h, cornerZ);
            parent.add(hCeil);

            const ht = new THREE.Mesh(new THREE.BoxGeometry(hLen, h, t), wallMat);
            ht.position.set(hMidX, h / 2, cornerZ + hw);
            parent.add(ht);
            this.collisionWalls.push(ht);

            const hb = new THREE.Mesh(new THREE.BoxGeometry(hLen, h, t), wallMat);
            hb.position.set(hMidX, h / 2, cornerZ - hw);
            parent.add(hb);
            this.collisionWalls.push(hb);

            const hLight = new THREE.PointLight(0xfff8e8, 0.3, 12);
            hLight.position.set(hMidX, h - 0.5, cornerZ);
            parent.add(hLight);
        }

        // Short connector down to room
        const connZ1 = cornerZ;
        const connZ2 = roomZ + this.roomDepth / 2;
        if (Math.abs(connZ1 - connZ2) > 0.5) {
            this._buildCorridorVertical(parent, roomX, connZ1, roomX, connZ2);
        }
    },

    /**
     * Create floor material (carpet or wood parquet)
     */
    _createFloorMaterial(type, width, depth) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        if (type === 'wood') {
            // Wood parquet pattern
            ctx.fillStyle = '#c4a05a';
            ctx.fillRect(0, 0, 512, 512);
            // Herringbone pattern
            const plankW = 40;
            const plankH = 100;
            for (let y = -plankH; y < 520; y += plankH) {
                for (let x = -plankW; x < 520; x += plankW * 2) {
                    const shade = 0.9 + Math.random() * 0.2;
                    const r = Math.round(196 * shade);
                    const g = Math.round(160 * shade);
                    const b = Math.round(90 * shade);
                    ctx.fillStyle = `rgb(${r},${g},${b})`;
                    ctx.fillRect(x, y, plankW - 1, plankH - 1);
                    const shade2 = 0.85 + Math.random() * 0.2;
                    const r2 = Math.round(186 * shade2);
                    const g2 = Math.round(150 * shade2);
                    const b2 = Math.round(80 * shade2);
                    ctx.fillStyle = `rgb(${r2},${g2},${b2})`;
                    ctx.fillRect(x + plankW, y + plankH / 2, plankW - 1, plankH - 1);
                }
            }
            // Grain lines
            ctx.strokeStyle = 'rgba(0,0,0,0.06)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 80; i++) {
                const gy = Math.random() * 512;
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(512, gy + (Math.random() - 0.5) * 20); ctx.stroke();
            }
        } else {
            // Green carpet
            ctx.fillStyle = '#537d5e';
            ctx.fillRect(0, 0, 512, 512);
            // Carpet texture noise
            for (let i = 0; i < 5000; i++) {
                const x = Math.random() * 512;
                const y = Math.random() * 512;
                const brightness = 0.85 + Math.random() * 0.3;
                const r = Math.round(83 * brightness);
                const g = Math.round(125 * brightness);
                const b = Math.round(94 * brightness);
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, y, 2, 2);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(Math.max(2, width / 6), Math.max(2, depth / 6));

        return new THREE.MeshStandardMaterial({
            map: texture,
            roughness: type === 'wood' ? 0.4 : 0.9,
            metalness: type === 'wood' ? 0.05 : 0,
        });
    },

    /**
     * Get room display name
     */
    _getRoomDisplayName(name) {
        const names = {
            hall: 'Hall Central',
            climate: '🌿 Climat & Réchauffement',
            energy: '⚡ Énergies Renouvelables',
            cities: '🏙️ Villes Durables',
            biodiversity: '🌳 Biodiversité',
            recycling: '♻️ Recyclage',
        };
        return names[name] || name;
    },

    /**
     * Determine which room the player is in
     */
    getPlayerRoom(playerX, playerZ) {
        for (const [name, pos] of Object.entries(this.roomPositions)) {
            const halfW = name === 'hall' ? this.hallWidth / 2 : this.roomWidth / 2;
            const halfD = name === 'hall' ? this.hallDepth / 2 : this.roomDepth / 2;
            if (playerX >= pos.x - halfW - 2 && playerX <= pos.x + halfW + 2 &&
                playerZ >= pos.z - halfD - 2 && playerZ <= pos.z + halfD + 2) {
                return name;
            }
        }
        return 'corridor';
    },
};

window.Museum = Museum;
