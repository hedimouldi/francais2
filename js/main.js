/* ============================================
   ÉcoTech 3D — Main Application
   Bright, realistic museum lighting
   ============================================ */

const EcoApp = {
    state: 'loading',
    scene: null,
    camera: null,
    renderer: null,
    clock: null,
    rooms: null,
    currentRoom: 'hall',

    init() {
        this.clock = new THREE.Clock();
        this.rooms = [HallRoom, RoomClimate, RoomEnergy, RoomCities, RoomBiodiversity, RoomRecycling];
        UI.init();
        this._startLoading();
    },

    async _startLoading() {
        try {
            UI.updateLoading(10, 'Initialisation du moteur 3D...');
            await this._delay(300);

            this._initThreeJS();
            UI.updateLoading(30, 'Construction du musée...');
            await this._delay(300);

            this._buildMuseum();
            UI.updateLoading(60, 'Création des expositions...');
            await this._delay(300);

            this._buildExhibits();
            UI.updateLoading(85, 'Configuration de l\'éclairage...');
            await this._delay(200);

            this._setupLighting();
            UI.updateLoading(95, 'Préparation de la visite...');
            await this._delay(300);

            UI.updateLoading(100, 'Prêt !');
            await this._delay(500);
            this._showWelcome();
        } catch (error) {
            console.error('Erreur au chargement:', error);
            UI.updateLoading(100, 'Erreur : ' + error.message);
            await this._delay(2000);
            this._showWelcome();
        }
    },

    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    _initThreeJS() {
        // Scene — bright background
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue outside
        this.scene.fog = new THREE.Fog(0x87CEEB, 80, 200);

        // Camera
        this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 300);
        this.camera.position.set(0, 1.7, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance',
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.5;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        document.body.appendChild(this.renderer.domElement);

        Controls.init(this.camera, this.renderer.domElement);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        console.log('Three.js initialized — bright museum mode');
    },

    _buildMuseum() {
        Museum.build(this.scene);
        console.log('Museum built, walls:', Museum.collisionWalls.length);
    },

    _buildExhibits() {
        this.rooms.forEach((room, i) => {
            try {
                room.build(this.scene);
                console.log('Room', i, 'built');
            } catch (e) {
                console.warn('Error building room', i, ':', e);
            }
        });
    },

    /**
     * Bright, natural museum lighting
     */
    _setupLighting() {
        // Strong ambient — museums are well-lit
        const ambient = new THREE.AmbientLight(0xfff8f0, 0.6);
        this.scene.add(ambient);

        // Hemisphere: warm ceiling / cool floor
        const hemi = new THREE.HemisphereLight(0xfff8e8, 0xd0e4d0, 0.5);
        this.scene.add(hemi);

        // Simulated sunlight through skylights
        const sunLight = new THREE.DirectionalLight(0xfff4e0, 0.8);
        sunLight.position.set(20, 30, 10);
        sunLight.castShadow = false;
        this.scene.add(sunLight);

        // Secondary fill light
        const fillLight = new THREE.DirectionalLight(0xe0e8ff, 0.3);
        fillLight.position.set(-15, 25, -10);
        this.scene.add(fillLight);

        console.log('Bright museum lighting active');
    },

    _showWelcome() {
        this.state = 'welcome';
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('welcome-screen').style.display = 'flex';

        document.getElementById('enter-btn').addEventListener('click', () => {
            this._startMuseum();
        });
    },

    _startMuseum() {
        this.state = 'playing';
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('hud').style.display = 'block';
        Controls.enabled = true;
        
        // Ensure player does not spawn inside the globe
        this.camera.position.set(0, 1.7, 8);

        this.renderer.domElement.requestPointerLock();
        this._animate();
    },

    showPause() {
        if (this.state !== 'playing') return;
        this.state = 'paused';
        document.getElementById('pause-menu').style.display = 'block';
        Controls.enabled = false;

        const resumeBtn = document.getElementById('resume-btn');
        const restartBtn = document.getElementById('restart-btn');

        const resumeHandler = () => {
            this.state = 'playing';
            document.getElementById('pause-menu').style.display = 'none';
            Controls.enabled = true;
            this.renderer.domElement.requestPointerLock();
            resumeBtn.removeEventListener('click', resumeHandler);
        };

        const restartHandler = () => {
            this.state = 'welcome';
            document.getElementById('pause-menu').style.display = 'none';
            document.getElementById('hud').style.display = 'none';
            document.getElementById('welcome-screen').style.display = 'flex';
            Controls.enabled = false;
            this.camera.position.set(0, 1.7, 8);
            this.camera.rotation.set(0, 0, 0);
            this.camera.quaternion.identity();
            restartBtn.removeEventListener('click', restartHandler);
        };

        resumeBtn.addEventListener('click', resumeHandler);
        restartBtn.addEventListener('click', restartHandler);
    },

    _animate() {
        if (this.state === 'loading' || this.state === 'welcome') return;

        requestAnimationFrame(() => this._animate());

        const delta = Math.min(this.clock.getDelta(), 0.05);
        const elapsed = this.clock.getElapsedTime();

        if (this.state === 'playing') {
            Controls.update(delta);
        }

        this.rooms.forEach(room => {
            try {
                if (room.update) room.update(elapsed, delta);
            } catch (e) {}
        });

        const newRoom = Museum.getPlayerRoom(this.camera.position.x, this.camera.position.z);
        if (newRoom !== this.currentRoom) {
            this.currentRoom = newRoom;
            UI.updateRoomIndicator(newRoom);
        }

        const cameraDir = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDir);
        const rotY = Math.atan2(cameraDir.x, cameraDir.z);
        UI.updateMinimap(this.camera.position.x, this.camera.position.z, rotY);

        this.renderer.render(this.scene, this.camera);
    },
};

window.EcoApp = EcoApp;

document.addEventListener('DOMContentLoaded', () => {
    EcoApp.init();
});
