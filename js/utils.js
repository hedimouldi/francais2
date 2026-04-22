/* ============================================
   ÉcoTech 3D — Utility Functions
   Bright museum style
   ============================================ */

const EcoUtils = {
    // Bright museum color palette
    colors: {
        green: 0x00d4aa,
        darkGreen: 0x00b894,
        gold: 0xffd700,
        blue: 0x4da6ff,
        red: 0xff6b6b,
        purple: 0xb48eff,
        white: 0xffffff,
        dark: 0x333333,
        wallLight: 0xe8e4de,
        wood: 0x8B6914,
        warmLight: 0xfff4e0,
    },

    // Room theme colors
    roomColors: {
        hall:         { primary: 0x00d4aa, secondary: 0xffd700, ambient: 0xe8e4de },
        climate:      { primary: 0x4da6ff, secondary: 0xff6b6b, ambient: 0xdde8f0 },
        energy:       { primary: 0xffd700, secondary: 0xff9500, ambient: 0xf0ead0 },
        cities:       { primary: 0xb48eff, secondary: 0x4da6ff, ambient: 0xe8ddf0 },
        biodiversity: { primary: 0x2ecc71, secondary: 0x00d4aa, ambient: 0xddf0dd },
        recycling:    { primary: 0x2ecc71, secondary: 0x00d4aa, ambient: 0xddf0e8 },
    },

    /**
     * Create a 3D text sprite
     */
    createTextSprite(text, options = {}) {
        const fontSize = options.fontSize || 48;
        const fontFamily = options.fontFamily || 'Outfit, sans-serif';
        const color = options.color || '#333333';
        const bgColor = options.bgColor || 'transparent';
        const padding = options.padding || 20;
        const maxWidth = options.maxWidth || 800;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        ctx.font = `${options.fontWeight || 'bold'} ${fontSize}px ${fontFamily}`;

        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth - padding * 2 && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);

        const lineHeight = fontSize * 1.3;
        const textWidth = Math.min(maxWidth, Math.max(...lines.map(l => ctx.measureText(l).width)) + padding * 2);
        const textHeight = lines.length * lineHeight + padding * 2;

        canvas.width = textWidth * 2;
        canvas.height = textHeight * 2;
        ctx.scale(2, 2);

        if (bgColor !== 'transparent') {
            ctx.fillStyle = bgColor;
            ctx.beginPath();
            ctx.rect(0, 0, textWidth, textHeight);
            ctx.fill();
        }

        ctx.font = `${options.fontWeight || 'bold'} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        lines.forEach((line, i) => {
            ctx.fillText(line, textWidth / 2, padding + (i + 0.5) * lineHeight);
        });

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;

        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: options.depthTest !== undefined ? options.depthTest : true,
        });

        const sprite = new THREE.Sprite(material);
        const scale = options.scale || 0.015;
        sprite.scale.set(textWidth * scale, textHeight * scale, 1);

        return sprite;
    },

    /**
     * Create a museum wall painting (canvas with frame mounted on wall)
     */
    createWallPainting(width, height, drawFunc, options = {}) {
        const group = new THREE.Group();

        // Canvas texture
        const canvasEl = document.createElement('canvas');
        canvasEl.width = Math.round(width * 200);
        canvasEl.height = Math.round(height * 200);
        const ctx = canvasEl.getContext('2d');
        drawFunc(ctx, canvasEl.width, canvasEl.height);

        const texture = new THREE.CanvasTexture(canvasEl);
        texture.minFilter = THREE.LinearFilter;

        // Painting surface
        const paintGeo = new THREE.PlaneGeometry(width, height);
        const paintMat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.5,
            metalness: 0.05,
        });
        const painting = new THREE.Mesh(paintGeo, paintMat);
        painting.position.z = 0.03;
        group.add(painting);

        // Wooden frame
        const fw = options.frameWidth || 0.08;
        const fd = 0.06;
        const frameMat = new THREE.MeshStandardMaterial({
            color: options.frameColor || 0x8B6914,
            roughness: 0.5,
            metalness: 0.15,
        });

        // Top
        const topGeo = new THREE.BoxGeometry(width + fw * 2, fw, fd);
        const top = new THREE.Mesh(topGeo, frameMat);
        top.position.set(0, height / 2 + fw / 2, 0);
        group.add(top);

        // Bottom
        const bottom = top.clone();
        bottom.position.y = -height / 2 - fw / 2;
        group.add(bottom);

        // Left
        const sideGeo = new THREE.BoxGeometry(fw, height + fw * 2, fd);
        const left = new THREE.Mesh(sideGeo, frameMat);
        left.position.x = -width / 2 - fw / 2;
        group.add(left);

        // Right
        const right = left.clone();
        right.position.x = width / 2 + fw / 2;
        group.add(right);

        // White mat/border inside frame
        const matGeo = new THREE.PlaneGeometry(width + 0.02, height + 0.02);
        const matMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f0, roughness: 0.9 });
        const mat = new THREE.Mesh(matGeo, matMat);
        mat.position.z = 0.01;
        group.add(mat);

        return group;
    },

    /**
     * Create an info panel (bright style, for museum walls)
     */
    createInfoPanel(title, body, options = {}) {
        const width = options.width || 3;
        const height = options.height || 4;

        return this.createWallPainting(width, height, (ctx, w, h) => {
            // White background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, w, h);

            // Accent bar at top
            ctx.fillStyle = options.accentColor || '#00d4aa';
            ctx.fillRect(0, 0, w, 8);

            // Icon
            if (options.icon) {
                ctx.font = '60px serif';
                ctx.fillText(options.icon, 30, 80);
            }

            // Title
            ctx.font = 'bold 36px Outfit, sans-serif';
            ctx.fillStyle = '#222222';
            ctx.textAlign = 'left';
            const titleX = options.icon ? 100 : 30;
            ctx.fillText(title, titleX, 75);

            // Divider line
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(30, 100);
            ctx.lineTo(w - 30, 100);
            ctx.stroke();

            // Body text
            ctx.font = '24px Inter, sans-serif';
            ctx.fillStyle = '#555555';
            const lines = this._wrapText(ctx, body, w - 60, 24);
            lines.forEach((line, i) => {
                ctx.fillText(line, 30, 140 + i * 34);
            });
        }, { frameColor: options.frameColor || 0x666666 });
    },

    _wrapText(ctx, text, maxWidth, fontSize) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            if (word === '\n' || word.includes('\n')) {
                const parts = word.split('\n');
                parts.forEach((part, i) => {
                    if (i > 0) {
                        lines.push(currentLine);
                        currentLine = part;
                    } else {
                        currentLine = currentLine ? currentLine + ' ' + part : part;
                    }
                });
                continue;
            }
            const testLine = currentLine ? currentLine + ' ' + word : word;
            if (ctx.measureText(testLine).width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        return lines;
    },

    /**
     * Create floor material
     */
    createFloorMaterial(color, options = {}) {
        return new THREE.MeshStandardMaterial({
            color: color,
            roughness: options.roughness || 0.5,
            metalness: options.metalness || 0.05,
        });
    },

    /**
     * Create a glowing ring
     */
    createGlowRing(radius, color, tubeRadius) {
        const geometry = new THREE.TorusGeometry(radius, tubeRadius || 0.05, 16, 64);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5,
            roughness: 0.2,
            metalness: 0.6,
        });
        return new THREE.Mesh(geometry, material);
    },

    /**
     * Create a pedestal
     */
    createPedestal(width, height, depth, color) {
        const group = new THREE.Group();

        const baseGeo = new THREE.BoxGeometry(width, height, depth);
        const baseMat = new THREE.MeshStandardMaterial({
            color: color || 0xdddddd,
            roughness: 0.3,
            metalness: 0.1,
        });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = height / 2;
        group.add(base);

        // Top plate
        const plateGeo = new THREE.BoxGeometry(width + 0.05, 0.03, depth + 0.05);
        const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.3 });
        const plate = new THREE.Mesh(plateGeo, plateMat);
        plate.position.y = height;
        group.add(plate);

        return group;
    },

    /**
     * Create a canvas texture
     */
    createCanvasTexture(width, height, drawFunc) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        drawFunc(ctx, width, height);
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        return tex;
    },

    /**
     * Create a spotlight for exhibits
     */
    createExhibitSpotlight(color, intensity, target) {
        const light = new THREE.SpotLight(color || 0xffffff, intensity || 1, 12, Math.PI / 6, 0.5, 1);
        if (target) light.target = target;
        return light;
    },

    /**
     * Create a glass showcase (vitrine)
     */
    createShowcase(width, height, depth) {
        const group = new THREE.Group();
        
        // Base / Pedestal (High standing marble/metal look)
        const baseHeight = 1.0;
        const baseGeo = new THREE.BoxGeometry(width, baseHeight, depth);
        const baseMat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.1,
            metalness: 0.8
        });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = baseHeight / 2;
        group.add(base);

        // Glass Cover
        const glassHeight = height - baseHeight;
        const glassGeo = new THREE.BoxGeometry(width - 0.05, glassHeight, depth - 0.05);
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.05,
            transmission: 0.9, // glass effect
            transparent: true,
            opacity: 0.4,
            envMapIntensity: 1.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        const glass = new THREE.Mesh(glassGeo, glassMat);
        glass.position.y = baseHeight + glassHeight / 2;
        group.add(glass);

        // Edges (Metal frame)
        const frameMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });
        const thickness = 0.03;
        
        // Top Frame
        const topFrameGeo = new THREE.BoxGeometry(width, thickness, depth);
        const topFrame = new THREE.Mesh(topFrameGeo, frameMat);
        topFrame.position.y = height;
        group.add(topFrame);

        // Vertical Pillars
        const pillarGeo = new THREE.BoxGeometry(thickness, glassHeight, thickness);
        const positions = [
            [(width/2) - thickness/2, (depth/2) - thickness/2],
            [-(width/2) + thickness/2, (depth/2) - thickness/2],
            [(width/2) - thickness/2, -(depth/2) + thickness/2],
            [-(width/2) + thickness/2, -(depth/2) + thickness/2]
        ];
        positions.forEach(pos => {
            const pillar = new THREE.Mesh(pillarGeo, frameMat);
            pillar.position.set(pos[0], baseHeight + glassHeight/2, pos[1]);
            group.add(pillar);
        });

        return { group, baseHeight };
    },

    /**
     * Create an image panel from a URL or texture (High Standing Gallery Style)
     */
    createImagePanel(textureOrUrl, title, description, width = 4, height = 3, theme = null) {
        const group = new THREE.Group();
        
        let map = textureOrUrl;
        if (typeof textureOrUrl === 'string') {
            const loader = new THREE.TextureLoader();
            map = loader.load(textureOrUrl);
            map.colorSpace = THREE.SRGBColorSpace;
        }

        const paintGeo = new THREE.PlaneGeometry(width, height);
        const paintMat = new THREE.MeshStandardMaterial({
            map: map,
            roughness: 0.4,
            metalness: 0.1
        });
        const painting = new THREE.Mesh(paintGeo, paintMat);
        painting.position.z = 0.05;
        group.add(painting);

        // High Standing Frame (Brushed Metal/Premium Dark Wood)
        const fw = 0.1;
        const fd = 0.08;
        const frameMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.2,
            metalness: 0.8
        });

        const top = new THREE.Mesh(new THREE.BoxGeometry(width + fw * 2, fw, fd), frameMat);
        top.position.set(0, height / 2 + fw / 2, 0);
        group.add(top);

        const bottom = top.clone();
        bottom.position.y = -height / 2 - fw / 2;
        group.add(bottom);

        const left = new THREE.Mesh(new THREE.BoxGeometry(fw, height + fw * 2, fd), frameMat);
        left.position.x = -width / 2 - fw / 2;
        group.add(left);

        const right = left.clone();
        right.position.x = width / 2 + fw / 2;
        group.add(right);

        // Spotlight for the painting
        const spotLight = new THREE.SpotLight(0xfff5e6, 0.8, 10, Math.PI / 6, 0.5, 1);
        spotLight.position.set(0, height + 1, 2);
        spotLight.target = painting;
        group.add(spotLight);

        // Gallery Plaque (Cartel)
        const plaqueGeo = new THREE.BoxGeometry(0.8, 0.3, 0.02);
        const plaqueMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.3 });
        const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
        plaque.position.set(0, -height / 2 - 0.5, 0.01);
        group.add(plaque);

        const plaqueText = this.createTextSprite(title, {
            fontSize: 24, fontWeight: 'bold', color: '#111111', scale: 0.005
        });
        plaqueText.position.set(0, -height / 2 - 0.5, 0.03);
        group.add(plaqueText);

        group.userData = { 
            interactive: true, 
            icon: '🖼️', 
            title: title, 
            description: description 
        };

        if (theme) {
            group.userData.prototypeFunc = () => this.getThemePrototype(theme);
        }

        return group;
    },

    /**
     * Generates a modern, attractive 3D prototype based on the theme
     */
    getThemePrototype(theme) {
        const group = new THREE.Group();
        let mainMesh;
        
        switch(theme) {
            case 'climate':
                // Holographic glowing earth
                const earthGeo = new THREE.IcosahedronGeometry(1.5, 3);
                const earthMat = new THREE.MeshStandardMaterial({
                    color: 0x00aaff, wireframe: true, emissive: 0x0044aa, emissiveIntensity: 0.5
                });
                mainMesh = new THREE.Mesh(earthGeo, earthMat);
                const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4, 2), new THREE.MeshStandardMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.8 }));
                group.add(core);
                break;
                
            case 'energy':
                // Futuristic energy core (glowing crystal)
                const crystalGeo = new THREE.OctahedronGeometry(1.2, 0);
                const crystalMat = new THREE.MeshPhysicalMaterial({
                    color: 0xffaa00, emissive: 0xff6600, emissiveIntensity: 0.4,
                    transmission: 0.9, opacity: 1, metalness: 0, roughness: 0.1
                });
                mainMesh = new THREE.Mesh(crystalGeo, crystalMat);
                // Orbiting energy rings
                for(let i=0; i<3; i++) {
                    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.02, 16, 64), new THREE.MeshBasicMaterial({color: 0xffdd00}));
                    ring.rotation.x = Math.random() * Math.PI;
                    ring.rotation.y = Math.random() * Math.PI;
                    group.add(ring);
                }
                break;
                
            case 'cities':
                // Abstract floating city block (glass and neon)
                mainMesh = new THREE.Group();
                const buildingMat = new THREE.MeshPhysicalMaterial({
                    color: 0x4da6ff, transmission: 0.9, opacity: 1, roughness: 0.1, metalness: 0.5
                });
                for(let i=0; i<5; i++) {
                    const bw = 0.4 + Math.random()*0.4;
                    const bh = 1 + Math.random()*2;
                    const bd = 0.4 + Math.random()*0.4;
                    const b = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), buildingMat);
                    b.position.set((Math.random()-0.5)*1.5, bh/2 - 1, (Math.random()-0.5)*1.5);
                    
                    // Neon trim
                    const trim = new THREE.Mesh(new THREE.BoxGeometry(bw+0.02, 0.05, bd+0.02), new THREE.MeshBasicMaterial({color: 0x00ffff}));
                    trim.position.copy(b.position);
                    trim.position.y += bh/2;
                    mainMesh.add(trim);
                    mainMesh.add(b);
                }
                break;
                
            case 'biodiversity':
                // Abstract DNA / Tree of life structure
                mainMesh = new THREE.Group();
                const helixMat = new THREE.MeshStandardMaterial({color: 0x2ecc71, emissive: 0x00ff88, emissiveIntensity: 0.2, metalness: 0.8, roughness: 0.2});
                for(let i=0; i<20; i++) {
                    const angle = i * 0.4;
                    const y = -1.5 + (i * 0.15);
                    const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), helixMat);
                    s1.position.set(Math.cos(angle)*1, y, Math.sin(angle)*1);
                    const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), helixMat);
                    s2.position.set(Math.cos(angle+Math.PI)*1, y, Math.sin(angle+Math.PI)*1);
                    const link = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2), new THREE.MeshBasicMaterial({color: 0xaaaaaa}));
                    link.position.set(0, y, 0);
                    link.rotation.z = Math.PI/2;
                    link.rotation.y = -angle;
                    mainMesh.add(s1); mainMesh.add(s2); mainMesh.add(link);
                }
                break;
                
            case 'recycling':
                // Floating Möbius strip style geometry
                const mobGeo = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
                const mobMat = new THREE.MeshPhysicalMaterial({
                    color: 0x00ff88, metalness: 0.9, roughness: 0.1, clearcoat: 1.0, emissive: 0x004422
                });
                mainMesh = new THREE.Mesh(mobGeo, mobMat);
                break;
                
            default:
                mainMesh = new THREE.Mesh(
                    new THREE.BoxGeometry(1.5, 1.5, 1.5),
                    new THREE.MeshStandardMaterial({ color: 0xffffff })
                );
        }
        
        group.add(mainMesh);
        return group;
    },

    lerp(a, b, t) { return a + (b - a) * t; },
};

window.EcoUtils = EcoUtils;
