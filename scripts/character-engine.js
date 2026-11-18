/**
 * Tab Guardian - 3D Character Engine
 * Procedural Three.js cartoon characters with walking, speech, and button-stomping animations.
 */

(function () {
  'use strict';

  // Palette & Materials Helper
  function createMat(color, options = {}) {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: options.roughness !== undefined ? options.roughness : 0.3,
      metalness: options.metalness !== undefined ? options.metalness : 0.1,
      emissive: options.emissive || 0x000000,
      emissiveIntensity: options.emissiveIntensity || 0,
      ...options
    });
  }

  /**
   * Character 1: GUARDIAN ROBOT
   * Sci-fi friendly android with glowing visor, antenna bulb, chest display, and articulated limbs.
   */
  function buildGuardianRobot() {
    const root = new THREE.Group();
    const mats = {
      body: createMat(0x0ea5e9),       // Vivid Sky Blue
      accent: createMat(0x0284c7),     // Darker Cyan
      joints: createMat(0x64748b),     // Slate Gray
      visor: createMat(0xfacc15, { emissive: 0xfacc15, emissiveIntensity: 0.7 }), // Glowing Amber/Yellow
      antennaBulb: createMat(0x22c55e, { emissive: 0x22c55e, emissiveIntensity: 0.8 }), // Green Signal
      chestScreen: createMat(0x1e293b, { emissive: 0x06b6d4, emissiveIntensity: 0.4 })
    };

    // Body (Torso)
    const torsoGeo = new THREE.BoxGeometry(1.3, 1.4, 0.9);
    const torso = new THREE.Mesh(torsoGeo, mats.body);
    torso.position.y = 1.6;
    root.add(torso);

    // Chest Screen
    const chestGeo = new THREE.PlaneGeometry(0.7, 0.5);
    const chest = new THREE.Mesh(chestGeo, mats.chestScreen);
    chest.position.set(0, 1.6, 0.46);
    root.add(chest);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 2.7, 0);
    const headGeo = new THREE.BoxGeometry(1.1, 0.9, 0.9);
    const head = new THREE.Mesh(headGeo, mats.body);
    headGroup.add(head);

    // Visor Eyes
    const visorGeo = new THREE.BoxGeometry(0.8, 0.3, 0.1);
    const visor = new THREE.Mesh(visorGeo, mats.visor);
    visor.position.set(0, 0.05, 0.46);
    headGroup.add(visor);

    // Head Antenna
    const antPoleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8);
    const antPole = new THREE.Mesh(antPoleGeo, mats.joints);
    antPole.position.set(0, 0.6, 0);
    headGroup.add(antPole);

    const antBulbGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const antBulb = new THREE.Mesh(antBulbGeo, mats.antennaBulb);
    antBulb.position.set(0, 0.8, 0);
    headGroup.add(antBulb);

    root.add(headGroup);

    // Arms
    function makeArm(isLeft) {
      const armGroup = new THREE.Group();
      const sign = isLeft ? -1 : 1;
      armGroup.position.set(sign * 0.85, 2.1, 0);

      // Shoulder joint
      const shoulderGeo = new THREE.SphereGeometry(0.16, 10, 10);
      const shoulder = new THREE.Mesh(shoulderGeo, mats.joints);
      armGroup.add(shoulder);

      // Limb
      const limbGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.9, 8);
      const limb = new THREE.Mesh(limbGeo, mats.accent);
      limb.position.y = -0.45;
      armGroup.add(limb);

      // Hand / Fist
      const handGeo = new THREE.SphereGeometry(0.18, 10, 10);
      const hand = new THREE.Mesh(handGeo, mats.joints);
      hand.position.y = -0.95;
      armGroup.add(hand);

      return armGroup;
    }

    const leftArm = makeArm(true);
    const rightArm = makeArm(false);
    root.add(leftArm);
    root.add(rightArm);

    // Legs
    function makeLeg(isLeft) {
      const legGroup = new THREE.Group();
      const sign = isLeft ? -1 : 1;
      legGroup.position.set(sign * 0.4, 0.9, 0);

      // Thigh
      const legGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.8, 8);
      const leg = new THREE.Mesh(legGeo, mats.accent);
      leg.position.y = -0.4;
      legGroup.add(leg);

      // Foot
      const footGeo = new THREE.BoxGeometry(0.32, 0.2, 0.5);
      const foot = new THREE.Mesh(footGeo, mats.joints);
      foot.position.set(0, -0.85, 0.1);
      legGroup.add(foot);

      return legGroup;
    }

    const leftLeg = makeLeg(true);
    const rightLeg = makeLeg(false);
    root.add(leftLeg);
    root.add(rightLeg);

    return {
      type: 'robot',
      name: 'Guardian Robot',
      root,
      head: headGroup,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      extra: { antBulb }
    };
  }

  /**
   * Character 2: CHIBI DETECTIVE
   * Stylized investigator in a warm trench coat, fedora hat, and badge.
   */
  function buildChibiDetective() {
    const root = new THREE.Group();
    const mats = {
      skin: createMat(0xfde047),       // Cute cartoon yellow/skin tone
      coat: createMat(0xd97706),       // Amber/Caramel Trench Coat
      coatTrim: createMat(0xb45309),   // Darker Coat Hem
      hat: createMat(0x78350f),        // Deep Brown Fedora
      hatBand: createMat(0x1e293b),    // Black Ribbon
      eyes: createMat(0x0f172a),       // Dark Eyes
      badge: createMat(0xfacc15, { emissive: 0xfacc15, emissiveIntensity: 0.5 }),
      shoes: createMat(0x451a03)
    };

    // Coat (Torso)
    const torsoGeo = new THREE.ConeGeometry(0.9, 1.5, 12);
    const torso = new THREE.Mesh(torsoGeo, mats.coat);
    torso.position.y = 1.55;
    root.add(torso);

    // Badge on chest
    const badgeGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 6);
    const badge = new THREE.Mesh(badgeGeo, mats.badge);
    badge.rotation.x = Math.PI / 2;
    badge.position.set(0.2, 1.7, 0.42);
    root.add(badge);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 2.65, 0);

    const headGeo = new THREE.SphereGeometry(0.65, 16, 16);
    const head = new THREE.Mesh(headGeo, mats.skin);
    headGroup.add(head);

    // Eyes
    [-0.22, 0.22].forEach(x => {
      const eyeGeo = new THREE.SphereGeometry(0.09, 8, 8);
      const eye = new THREE.Mesh(eyeGeo, mats.eyes);
      eye.position.set(x, 0.05, 0.58);
      headGroup.add(eye);
    });

    // Fedora Hat
    const hatGroup = new THREE.Group();
    hatGroup.position.set(0, 0.45, 0);

    // Hat brim
    const brimGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.06, 16);
    const brim = new THREE.Mesh(brimGeo, mats.hat);
    hatGroup.add(brim);

    // Hat crown
    const crownGeo = new THREE.CylinderGeometry(0.55, 0.65, 0.55, 16);
    const crown = new THREE.Mesh(crownGeo, mats.hat);
    crown.position.y = 0.3;
    hatGroup.add(crown);

    // Hat ribbon band
    const bandGeo = new THREE.CylinderGeometry(0.66, 0.66, 0.12, 16);
    const band = new THREE.Mesh(bandGeo, mats.hatBand);
    band.position.y = 0.12;
    hatGroup.add(band);

    headGroup.add(hatGroup);
    root.add(headGroup);

    // Arms
    function makeArm(isLeft) {
      const armGroup = new THREE.Group();
      const sign = isLeft ? -1 : 1;
      armGroup.position.set(sign * 0.65, 2.0, 0);

      const armGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8);
      const arm = new THREE.Mesh(armGeo, mats.coat);
      arm.position.y = -0.4;
      armGroup.add(arm);

      // Hand
      const handGeo = new THREE.SphereGeometry(0.14, 8, 8);
      const hand = new THREE.Mesh(handGeo, mats.skin);
      hand.position.y = -0.85;
      armGroup.add(hand);

      return armGroup;
    }

    const leftArm = makeArm(true);
    const rightArm = makeArm(false);
    root.add(leftArm);
    root.add(rightArm);

    // Legs
    function makeLeg(isLeft) {
      const legGroup = new THREE.Group();
      const sign = isLeft ? -1 : 1;
      legGroup.position.set(sign * 0.3, 0.8, 0);

      const legGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.7, 8);
      const leg = new THREE.Mesh(legGeo, mats.hatBand);
      leg.position.y = -0.35;
      legGroup.add(leg);

      const shoeGeo = new THREE.BoxGeometry(0.24, 0.18, 0.42);
      const shoe = new THREE.Mesh(shoeGeo, mats.shoes);
      shoe.position.set(0, -0.75, 0.08);
      legGroup.add(shoe);

      return legGroup;
    }

    const leftLeg = makeLeg(true);
    const rightLeg = makeLeg(false);
    root.add(leftLeg);
    root.add(rightLeg);

    return {
      type: 'detective',
      name: 'Chibi Detective',
      root,
      head: headGroup,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      extra: { hat: hatGroup }
    };
  }

  /**
   * Character 3: WISE CARTOON CAT
   * Adorable feline with perky ears, whiskers, white paws, and an expressive swinging tail.
   */
  function buildWiseCat() {
    const root = new THREE.Group();
    const mats = {
      fur: createMat(0xf97316),        // Playful Ginger Orange
      furBelly: createMat(0xffedd5),   // Soft Cream Belly
      innerEar: createMat(0xf472b6),   // Cute Pink
      eyes: createMat(0x06b6d4, { emissive: 0x06b6d4, emissiveIntensity: 0.3 }), // Cyan Cat Eyes
      nose: createMat(0xf43f5e),       // Pink Nose
      paws: createMat(0xffffff),       // White Paws
      collar: createMat(0x8b5cf6),     // Violet Collar
      bell: createMat(0xfacc15, { emissive: 0xfacc15, emissiveIntensity: 0.6 }) // Gold Bell
    };

    // Body (Round playful shape)
    const bodyGeo = new THREE.SphereGeometry(0.85, 16, 16);
    const body = new THREE.Mesh(bodyGeo, mats.fur);
    body.scale.set(0.9, 1.1, 0.85);
    body.position.y = 1.4;
    root.add(body);

    // Belly patch
    const bellyGeo = new THREE.SphereGeometry(0.65, 12, 12);
    const belly = new THREE.Mesh(bellyGeo, mats.furBelly);
    belly.scale.set(0.7, 0.9, 0.4);
    belly.position.set(0, 1.35, 0.55);
    root.add(belly);

    // Collar with Bell
    const collarGeo = new THREE.TorusGeometry(0.55, 0.06, 8, 20);
    const collar = new THREE.Mesh(collarGeo, mats.collar);
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 2.1, 0);
    root.add(collar);

    const bellGeo = new THREE.SphereGeometry(0.12, 10, 10);
    const bell = new THREE.Mesh(bellGeo, mats.bell);
    bell.position.set(0, 2.05, 0.58);
    root.add(bell);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 2.65, 0);

    const headGeo = new THREE.SphereGeometry(0.75, 16, 16);
    const head = new THREE.Mesh(headGeo, mats.fur);
    head.scale.set(1.1, 0.95, 0.95);
    headGroup.add(head);

    // Cat Ears
    [-0.45, 0.45].forEach(x => {
      const earGroup = new THREE.Group();
      earGroup.position.set(x, 0.6, 0);
      earGroup.rotation.z = x > 0 ? -0.2 : 0.2;

      const outerEarGeo = new THREE.ConeGeometry(0.3, 0.5, 4);
      const outerEar = new THREE.Mesh(outerEarGeo, mats.fur);
      outerEar.rotation.y = Math.PI / 4;
      earGroup.add(outerEar);

      const innerEarGeo = new THREE.ConeGeometry(0.2, 0.4, 4);
      const innerEar = new THREE.Mesh(innerEarGeo, mats.innerEar);
      innerEar.rotation.y = Math.PI / 4;
      innerEar.position.z = 0.06;
      earGroup.add(innerEar);

      headGroup.add(earGroup);
    });

    // Eyes
    [-0.26, 0.26].forEach(x => {
      const eyeGeo = new THREE.SphereGeometry(0.12, 10, 10);
      const eye = new THREE.Mesh(eyeGeo, mats.eyes);
      eye.scale.set(1, 1.3, 0.5);
      eye.position.set(x, 0.06, 0.68);
      headGroup.add(eye);
    });

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.08, 0.08, 3);
    const nose = new THREE.Mesh(noseGeo, mats.nose);
    nose.rotation.x = -Math.PI / 2;
    nose.rotation.z = Math.PI;
    nose.position.set(0, -0.08, 0.78);
    headGroup.add(nose);

    root.add(headGroup);

    // Front Paws / Arms
    function makeArm(isLeft) {
      const armGroup = new THREE.Group();
      const sign = isLeft ? -1 : 1;
      armGroup.position.set(sign * 0.55, 1.8, 0.1);

      const armGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.75, 8);
      const arm = new THREE.Mesh(armGeo, mats.fur);
      arm.position.y = -0.35;
      armGroup.add(arm);

      const pawGeo = new THREE.SphereGeometry(0.17, 10, 10);
      const paw = new THREE.Mesh(pawGeo, mats.paws);
      paw.position.y = -0.75;
      armGroup.add(paw);

      return armGroup;
    }

    const leftArm = makeArm(true);
    const rightArm = makeArm(false);
    root.add(leftArm);
    root.add(rightArm);

    // Back Legs
    function makeLeg(isLeft) {
      const legGroup = new THREE.Group();
      const sign = isLeft ? -1 : 1;
      legGroup.position.set(sign * 0.35, 0.8, 0);

      const legGeo = new THREE.CylinderGeometry(0.15, 0.14, 0.65, 8);
      const leg = new THREE.Mesh(legGeo, mats.fur);
      leg.position.y = -0.3;
      legGroup.add(leg);

      const footGeo = new THREE.BoxGeometry(0.28, 0.18, 0.42);
      const foot = new THREE.Mesh(footGeo, mats.paws);
      foot.position.set(0, -0.65, 0.08);
      legGroup.add(foot);

      return legGroup;
    }

    const leftLeg = makeLeg(true);
    const rightLeg = makeLeg(false);
    root.add(leftLeg);
    root.add(rightLeg);

    // Animated Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 1.0, -0.7);

    const tailPart1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.5, 8), mats.fur);
    tailPart1.position.y = 0.25;
    tailPart1.rotation.x = -0.6;
    tailGroup.add(tailPart1);

    const tailPart2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.5, 8), mats.paws);
    tailPart2.position.set(0, 0.6, -0.25);
    tailPart2.rotation.x = 0.4;
    tailGroup.add(tailPart2);

    root.add(tailGroup);

    return {
      type: 'cat',
      name: 'Wise Cartoon Cat',
      root,
      head: headGroup,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      extra: { tail: tailGroup }
    };
  }

  /**
   * Main Scene & Animation Manager
   */
  class MascotStage {
    constructor(canvasContainer) {
      this.container = canvasContainer;
      this.width = canvasContainer.clientWidth || 900;
      this.height = canvasContainer.clientHeight || 450;

      // Three.js Scene
      this.scene = new THREE.Scene();

      // Camera
      this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000);
      this.camera.position.set(0, 2.3, 10);
      this.camera.lookAt(0, 1.8, 0);

      // Renderer with transparency
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = false;
      this.container.appendChild(this.renderer.domElement);

      // Lighting
      const ambient = new THREE.AmbientLight(0xffffff, 0.85);
      this.scene.add(ambient);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
      dirLight.position.set(5, 12, 10);
      this.scene.add(dirLight);

      const fillLight = new THREE.PointLight(0x38bdf8, 0.5, 20);
      fillLight.position.set(-6, 4, 4);
      this.scene.add(fillLight);

      // Active Mascot Reference
      this.mascot = null;
      this.isRunning = false;
      this.clock = new THREE.Clock();

      // Bound render loop
      this.render = this.render.bind(this);
    }

    loadMascot(type) {
      if (this.mascot) {
        this.scene.remove(this.mascot.root);
      }

      if (type === 'robot') {
        this.mascot = buildGuardianRobot();
      } else if (type === 'detective') {
        this.mascot = buildChibiDetective();
      } else if (type === 'cat') {
        this.mascot = buildWiseCat();
      } else {
        // Random
        const pick = ['robot', 'detective', 'cat'][Math.floor(Math.random() * 3)];
        return this.loadMascot(pick);
      }

      this.scene.add(this.mascot.root);
      // Start position: way off-screen to the left
      this.mascot.root.position.set(-8.5, 0, 0);
      this.mascot.root.rotation.y = Math.PI / 2; // Facing right (towards center)

      return this.mascot;
    }

    start() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.clock.start();
        this.render();
      }
    }

    stop() {
      this.isRunning = false;
    }

    destroy() {
      this.stop();
      if (this.renderer && this.renderer.domElement) {
        this.renderer.domElement.remove();
        this.renderer.dispose();
      }
    }

    render() {
      if (!this.isRunning) return;
      requestAnimationFrame(this.render);

      const delta = this.clock.getDelta();
      const time = this.clock.getElapsedTime();

      // Tail / Antenna ambient effects
      if (this.mascot && this.mascot.extra) {
        if (this.mascot.extra.tail) {
          this.mascot.extra.tail.rotation.y = Math.sin(time * 6) * 0.4;
          this.mascot.extra.tail.rotation.z = Math.cos(time * 3) * 0.15;
        }
        if (this.mascot.extra.antBulb) {
          const intensity = 0.5 + Math.sin(time * 8) * 0.5;
          this.mascot.extra.antBulb.material.emissiveIntensity = intensity;
        }
      }

      this.renderer.render(this.scene, this.camera);
    }

    /**
     * Executes the complete user-requested 5-second choreography:
     * Phase 1: Walk in from the left (~1.5s)
     * Phase 2: Turn to user, show speech bubble (~2.0s)
     * Phase 3: Walk to [X] button, stomp/click it (~0.8s)
     * Phase 4: Walk off-screen and vanish (~1.0s)
     * Phase 5: onComplete callback (Triggers tab closure)
     */
    runChoreography(callbacks = {}) {
      if (!this.mascot) return;
      const m = this.mascot;
      const startTime = performance.now();

      // State tracking
      let phase = 'WALK_IN';
      let phaseStartTime = startTime;

      // Coordinate targets in 3D world space
      const startX = -8.5;
      const speechX = -1.2;
      const buttonTargetX = 3.2;
      const exitTargetX = 10.5;

      const animateStep = (now) => {
        if (!this.isRunning) return;

        const totalElapsed = (now - startTime) / 1000;
        const phaseElapsed = (now - phaseStartTime) / 1000;

        // --- PHASE 1: WALK IN FROM LEFT ---
        if (phase === 'WALK_IN') {
          const duration = 2.2;
          const progress = Math.min(phaseElapsed / duration, 1.0);
          const easeOut = 1 - Math.pow(1 - progress, 2);

          m.root.position.x = startX + (speechX - startX) * easeOut;
          m.root.rotation.y = Math.PI / 2; // Facing right

          // Smooth cartoon walk cycle
          const stepSpeed = 9;
          m.leftLeg.rotation.x = Math.sin(phaseElapsed * stepSpeed) * 0.55;
          m.rightLeg.rotation.x = -Math.sin(phaseElapsed * stepSpeed) * 0.55;
          m.leftArm.rotation.x = -Math.sin(phaseElapsed * stepSpeed) * 0.5;
          m.rightArm.rotation.x = Math.sin(phaseElapsed * stepSpeed) * 0.5;
          m.head.position.y = (m.type === 'cat' ? 2.65 : 2.7) + Math.abs(Math.sin(phaseElapsed * stepSpeed)) * 0.08;

          if (progress >= 1.0) {
            // Arrived at speech position!
            phase = 'SPEECH';
            phaseStartTime = now;
            m.leftLeg.rotation.x = 0;
            m.rightLeg.rotation.x = 0;
            m.leftArm.rotation.x = 0;
            m.rightArm.rotation.x = 0;
            if (callbacks.onSpeechStart) callbacks.onSpeechStart();
          }
        }

        // --- PHASE 2: SPEECH BUBBLE & DIRECT ADDRESS ---
        else if (phase === 'SPEECH') {
          const duration = 3.5;
          const progress = Math.min(phaseElapsed / duration, 1.0);

          // Turn gently towards camera
          m.root.rotation.y = (Math.PI / 2) * (1 - Math.min(progress * 2.0, 1));

          // Expressive comedic nodding & gesturing
          m.head.rotation.x = Math.sin(phaseElapsed * 4) * 0.15;
          m.leftArm.rotation.x = -0.4 + Math.sin(phaseElapsed * 4.5) * 0.25;
          m.rightArm.rotation.x = -0.5 - Math.sin(phaseElapsed * 4.5) * 0.25;

          if (progress >= 1.0) {
            phase = 'WALK_TO_BUTTON';
            phaseStartTime = now;
            if (callbacks.onSpeechEnd) callbacks.onSpeechEnd();
          }
        }

        // --- PHASE 3A: WALK TO [X] BUTTON ---
        else if (phase === 'WALK_TO_BUTTON') {
          const duration = 1.4;
          const progress = Math.min(phaseElapsed / duration, 1.0);

          m.root.rotation.y = Math.PI / 2; // Face right towards button
          m.root.position.x = speechX + (buttonTargetX - speechX) * progress;

          // Deliberate walk stride
          const stepSpeed = 10;
          m.leftLeg.rotation.x = Math.sin(phaseElapsed * stepSpeed) * 0.6;
          m.rightLeg.rotation.x = -Math.sin(phaseElapsed * stepSpeed) * 0.6;
          m.leftArm.rotation.x = -Math.sin(phaseElapsed * stepSpeed) * 0.5;
          m.rightArm.rotation.x = Math.sin(phaseElapsed * stepSpeed) * 0.5;

          if (progress >= 1.0) {
            phase = 'STOMP_BUTTON';
            phaseStartTime = now;
          }
        }

        // --- PHASE 3B: STOMP / CLICK [X] BUTTON ---
        else if (phase === 'STOMP_BUTTON') {
          const duration = 1.2;
          const progress = Math.min(phaseElapsed / duration, 1.0);

          m.root.position.x = buttonTargetX;
          m.root.rotation.y = Math.PI / 3; // Angled toward user and button

          // Comedic wind-up with pause, then SLAM
          if (progress < 0.45) {
            // Wind up right arm / paw high with dramatic anticipation
            const windUp = progress / 0.45;
            m.rightArm.rotation.x = -Math.PI * 0.75 * windUp;
            m.head.rotation.x = -0.35 * windUp;
          } else if (progress < 0.7) {
            // SLAM down vigorously onto button!
            m.rightArm.rotation.x = 0.85;
            m.head.rotation.x = 0.3;
            if (!this.hasTriggeredClickCallback) {
              this.hasTriggeredClickCallback = true;
              if (callbacks.onButtonClick) callbacks.onButtonClick();
            }
          } else {
            // Recoil & smile
            m.rightArm.rotation.x = 0.1;
            m.head.rotation.x = 0;
          }

          if (progress >= 1.0) {
            phase = 'WALK_OUT';
            phaseStartTime = now;
            this.hasTriggeredClickCallback = false;
          }
        }

        // --- PHASE 4: WALK OUT & VANISH OFF-SCREEN ---
        else if (phase === 'WALK_OUT') {
          const duration = 1.8;
          const progress = Math.min(phaseElapsed / duration, 1.0);
          const easeIn = progress * progress;

          m.root.rotation.y = Math.PI / 2; // Scurry forward off screen
          m.root.position.x = buttonTargetX + (exitTargetX - buttonTargetX) * easeIn;

          // Confident exit trot
          const stepSpeed = 11;
          m.leftLeg.rotation.x = Math.sin(phaseElapsed * stepSpeed) * 0.65;
          m.rightLeg.rotation.x = -Math.sin(phaseElapsed * stepSpeed) * 0.65;
          m.leftArm.rotation.x = -Math.sin(phaseElapsed * stepSpeed) * 0.55;
          m.rightArm.rotation.x = Math.sin(phaseElapsed * stepSpeed) * 0.55;

          // Vanish fade
          if (progress > 0.6) {
            const fade = 1 - (progress - 0.6) / 0.4;
            if (callbacks.onFadeOut) callbacks.onFadeOut(fade);
          }

          if (progress >= 1.0) {
            phase = 'COMPLETE';
            if (callbacks.onComplete) callbacks.onComplete();
            return;
          }
        }

        requestAnimationFrame(animateStep);
      };

      requestAnimationFrame(animateStep);
    }
  }

  // Expose to window namespace
  window.TabGuardian3D = {
    MascotStage,
    buildGuardianRobot,
    buildChibiDetective,
    buildWiseCat
  };

})();
