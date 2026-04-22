/* ============================================
   ÉcoTech 3D — First-Person Controls
   ============================================ */

const Controls = {
    camera: null,
    domElement: null,
    enabled: false,

    // Movement state
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    isSprinting: false,

    // Physics
    velocity: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    walkSpeed: 8,
    sprintSpeed: 14,
    friction: 8,
    playerHeight: 1.7,
    playerRadius: 0.5,

    // Mouse look
    euler: new THREE.Euler(0, 0, 0, 'YXZ'),
    sensitivity: 0.002,
    minPitch: -Math.PI / 2.2,
    maxPitch: Math.PI / 2.2,
    isLocked: false,

    // Raycasting (interaction)
    raycaster: new THREE.Raycaster(),
    interactDistance: 5,
    hoveredObject: null,
    interactables: [],

    /**
     * Initialize controls
     */
    init(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        // Set initial camera height
        this.camera.position.y = this.playerHeight;

        // Pointer lock
        domElement.addEventListener('click', () => {
            if (!this.isLocked && this.enabled) {
                domElement.requestPointerLock();
            }
        });

        document.addEventListener('pointerlockchange', () => {
            this.isLocked = document.pointerLockElement === domElement;
            if (!this.isLocked && this.enabled) {
                // Show pause menu
                if (window.EcoApp && window.EcoApp.state === 'playing') {
                    window.EcoApp.showPause();
                }
            }
        });

        // Mouse movement
        document.addEventListener('mousemove', (e) => {
            if (!this.isLocked || !this.enabled) return;
            this.euler.setFromQuaternion(this.camera.quaternion);
            this.euler.y -= e.movementX * this.sensitivity;
            this.euler.x -= e.movementY * this.sensitivity;
            this.euler.x = Math.max(this.minPitch, Math.min(this.maxPitch, this.euler.x));
            this.camera.quaternion.setFromEuler(this.euler);
        });

        // Keyboard
        document.addEventListener('keydown', (e) => this._onKeyDown(e));
        document.addEventListener('keyup', (e) => this._onKeyUp(e));

        // Click to interact
        document.addEventListener('click', (e) => {
            if (this.isLocked && this.hoveredObject) {
                this._onInteract(this.hoveredObject);
            }
        });
    },

    _onKeyDown(e) {
        if (!this.enabled) return;
        switch (e.code) {
            case 'KeyW': case 'ArrowUp':    this.moveForward = true; break;
            case 'KeyS': case 'ArrowDown':  this.moveBackward = true; break;
            case 'KeyA': case 'ArrowLeft':  this.moveLeft = true; break;
            case 'KeyD': case 'ArrowRight': this.moveRight = true; break;
            case 'ShiftLeft': case 'ShiftRight': this.isSprinting = true; break;
            case 'KeyE':
                if (this.isLocked && this.hoveredObject) {
                    this._openPrototypeModal(this.hoveredObject);
                }
                break;
            case 'KeyH':
                const help = document.getElementById('controls-help');
                if (help) help.style.display = help.style.display === 'none' ? 'block' : 'none';
                break;
            case 'KeyM':
                const minimap = document.getElementById('minimap');
                if (minimap) minimap.style.display = minimap.style.display === 'none' ? 'block' : 'none';
                break;
            case 'Escape':
                if (this.isLocked) {
                    document.exitPointerLock();
                }
                break;
        }
    },

    _onKeyUp(e) {
        switch (e.code) {
            case 'KeyW': case 'ArrowUp':    this.moveForward = false; break;
            case 'KeyS': case 'ArrowDown':  this.moveBackward = false; break;
            case 'KeyA': case 'ArrowLeft':  this.moveLeft = false; break;
            case 'KeyD': case 'ArrowRight': this.moveRight = false; break;
            case 'ShiftLeft': case 'ShiftRight': this.isSprinting = false; break;
        }
    },

    /**
     * Update controls (called each frame)
     */
    update(delta) {
        if (!this.enabled) return;

        const speed = this.isSprinting ? this.sprintSpeed : this.walkSpeed;

        // Get forward and right vectors
        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

        // Apply movement
        this.direction.set(0, 0, 0);
        if (this.moveForward) this.direction.add(forward);
        if (this.moveBackward) this.direction.sub(forward);
        if (this.moveRight) this.direction.add(right);
        if (this.moveLeft) this.direction.sub(right);
        this.direction.normalize();

        // Smooth velocity
        this.velocity.x += (this.direction.x * speed - this.velocity.x) * Math.min(delta * this.friction, 1);
        this.velocity.z += (this.direction.z * speed - this.velocity.z) * Math.min(delta * this.friction, 1);

        // Collision detection
        const newX = this.camera.position.x + this.velocity.x * delta;
        const newZ = this.camera.position.z + this.velocity.z * delta;

        // Check collision with walls
        const canMoveX = !this._checkCollision(newX, this.camera.position.z);
        const canMoveZ = !this._checkCollision(this.camera.position.x, newZ);

        if (canMoveX) this.camera.position.x = newX;
        if (canMoveZ) this.camera.position.z = newZ;

        // Keep at player height
        this.camera.position.y = this.playerHeight;

        // Raycasting for interaction
        this._updateRaycast();
    },

    /**
     * Check collision against walls
     */
    _checkCollision(x, z) {
        const r = this.playerRadius;

        for (const wall of Museum.collisionWalls) {
            // Get wall bounding box
            if (!wall.geometry.boundingBox) {
                wall.geometry.computeBoundingBox();
            }
            const bb = wall.geometry.boundingBox.clone();
            const worldPos = new THREE.Vector3();
            wall.getWorldPosition(worldPos);

            const scale = wall.scale;
            const minX = worldPos.x + bb.min.x * scale.x - r;
            const maxX = worldPos.x + bb.max.x * scale.x + r;
            const minZ = worldPos.z + bb.min.z * scale.z - r;
            const maxZ = worldPos.z + bb.max.z * scale.z + r;

            if (x >= minX && x <= maxX && z >= minZ && z <= maxZ) {
                return true;
            }
        }
        return false;
    },

    /**
     * Update interaction raycast
     */
    _updateRaycast() {
        if (!this.isLocked) return;

        this.raycaster.set(this.camera.position, new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion));
        this.raycaster.far = this.interactDistance;

        const intersects = this.raycaster.intersectObjects(this.interactables, true);
        const prompt = document.getElementById('interact-prompt');

        if (intersects.length > 0) {
            // Find the interactable parent
            let obj = intersects[0].object;
            while (obj && !obj.userData.interactive) {
                obj = obj.parent;
            }
            if (obj && obj.userData.interactive) {
                this.hoveredObject = obj;
                if (prompt) prompt.style.display = 'flex';
                document.body.style.cursor = 'pointer';
                return;
            }
        }

        this.hoveredObject = null;
        if (prompt) prompt.style.display = 'none';
        document.body.style.cursor = 'default';
    },

    /**
     * Handle interaction with an object (click)
     */
    _onInteract(obj) {
        if (!obj.userData.interactive) return;
        this._openPrototypeModal(obj);
    },

    /**
     * Open the 3D Prototype Modal
     */
    _openPrototypeModal(obj) {
        const data = obj.userData;
        const modal = document.getElementById('prototype-modal');
        const title = document.getElementById('prototype-title');
        const desc = document.getElementById('prototype-description');
        const badges = document.getElementById('prototype-badges');
        const container = document.getElementById('prototype-3d-container');
        const closeBtn = document.getElementById('prototype-close');

        if (!modal) return;

        // Unlock pointer to interact with modal
        if (this.isLocked) {
            document.exitPointerLock();
        }

        // Setup content
        title.innerHTML = (data.icon ? data.icon + ' ' : '') + (data.title || 'Exposition');
        desc.innerHTML = data.description || '';
        
        // Show modal first so we can read clientWidth/clientHeight
        modal.style.display = 'flex';

        // Setup 3D Prototype Scene
        container.innerHTML = '';
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x040810);
        
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0, 5); // adjusted camera position for panels

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 10, 5);
        scene.add(dirLight);

        // Add prototype object if provided, else just show the original object clone
        let prototypeObj;
        if (data.prototypeFunc) {
            prototypeObj = data.prototypeFunc();
        } else if (obj) {
            prototypeObj = obj.clone();
            prototypeObj.position.set(0, 0, 0);
            prototypeObj.rotation.set(0, 0, 0);
            
            // Normalize scale and center
            const box = new THREE.Box3().setFromObject(prototypeObj);
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            if (maxDim > 0) {
                const targetSize = 3.5;
                const scale = targetSize / maxDim;
                prototypeObj.scale.setScalar(scale);
            }
            
            // Recompute box after scaling to center it
            const newBox = new THREE.Box3().setFromObject(prototypeObj);
            const center = new THREE.Vector3();
            newBox.getCenter(center);
            prototypeObj.position.sub(center);
        } else {
            prototypeObj = new THREE.Mesh(
                new THREE.BoxGeometry(1.5, 1.5, 1.5),
                new THREE.MeshStandardMaterial({ color: 0x00d4aa })
            );
        }
        scene.add(prototypeObj);

        // Animation loop for modal
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            if (prototypeObj) {
                // If it's a panel (cloned obj without prototypeFunc), rotate slightly for 3D effect
                if (!data.prototypeFunc) {
                    prototypeObj.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
                } else {
                    prototypeObj.rotation.y += 0.01;
                }
            }
            renderer.render(scene, camera);
        };
        animate();

        // Close logic
        const closeModal = () => {
            modal.style.display = 'none';
            cancelAnimationFrame(animationId);
            renderer.dispose();
            container.innerHTML = '';
            closeBtn.removeEventListener('click', closeModal);
            document.removeEventListener('keydown', onKeyDownF);
            
            // Re-lock pointer if we were playing
            if (this.enabled && window.EcoApp && window.EcoApp.state === 'playing') {
                this.domElement.requestPointerLock();
            }
        };
        closeBtn.addEventListener('click', closeModal);
        
        const onKeyDownF = (e) => {
            if (e.code === 'KeyF' || e.key === 'f' || e.key === 'F') {
                closeModal();
            }
        };
        document.addEventListener('keydown', onKeyDownF);
    },

    /**
     * Register interactable objects
     */
    addInteractable(obj) {
        this.interactables.push(obj);
    },
};

window.Controls = Controls;
