import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js';

const canvas = document.getElementById('hero-canvas');

if (canvas) {
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.z = 8.2;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene.add(new THREE.AmbientLight(0xffffff, 1.7));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const blueLight = new THREE.PointLight(0x2563eb, 28, 14);
    blueLight.position.set(-3, -1, 3);
    scene.add(blueLight);

    const orangeLight = new THREE.PointLight(0xea580c, 18, 12);
    orangeLight.position.set(3, 2, -2);
    scene.add(orangeLight);

    const core = new THREE.Group();
    scene.add(core);

    const crystal = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.38, 1),
      new THREE.MeshPhysicalMaterial({
        color: 0x3678df,
        metalness: 0.34,
        roughness: 0.24,
        clearcoat: 0.85,
        clearcoatRoughness: 0.16,
        flatShading: true
      })
    );
    core.add(crystal);

    const wireframe = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.405, 1),
      new THREE.MeshBasicMaterial({ color: 0xc6e2ff, wireframe: true, transparent: true, opacity: 0.48 })
    );
    core.add(wireframe);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.018, 10, 180),
      new THREE.MeshStandardMaterial({
        color: 0xe96b2c,
        metalness: 0.68,
        roughness: 0.28,
        emissive: 0x401707,
        emissiveIntensity: 0.35
      })
    );
    ring.rotation.set(0.9, 0.25, -0.4);
    core.add(ring);

    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(2.3, 0.008, 8, 180),
      new THREE.MeshBasicMaterial({ color: 0x5c9cff, transparent: true, opacity: 0.48 })
    );
    orbit.rotation.set(1.2, -0.65, 0.25);
    core.add(orbit);

    const nodes = [];
    const nodeGeometry = new THREE.OctahedronGeometry(0.14, 0);
    const nodeMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xea6a2c, metalness: 0.5, roughness: 0.26 }),
      new THREE.MeshStandardMaterial({ color: 0xaed9ff, metalness: 0.42, roughness: 0.22 }),
      new THREE.MeshStandardMaterial({ color: 0x245ab7, metalness: 0.45, roughness: 0.3 })
    ];

    for (let index = 0; index < 9; index += 1) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterials[index % nodeMaterials.length]);
      const angle = (index / 9) * Math.PI * 2;
      const radius = index % 2 === 0 ? 2.55 : 2.9;
      node.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.72, (index % 3 - 1) * 0.42);
      core.add(node);
      nodes.push(node);
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;
    let sceneVisible = true;
    let pointerX = 0;
    let pointerY = 0;
    let frameId = 0;

    const render = () => renderer.render(scene, camera);

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 560 ? 9.6 : 8.2;
      camera.updateProjectionMatrix();
      render();
    };

    const animate = (time) => {
      frameId = 0;
      if (!sceneVisible || reducedMotion) {
        render();
        return;
      }

      const elapsed = time * 0.00018;
      core.rotation.y = elapsed + pointerX * 0.16;
      core.rotation.x = Math.sin(elapsed * 0.7) * 0.12 + pointerY * 0.1;
      ring.rotation.z = -elapsed * 0.28 - 0.4;
      orbit.rotation.y = elapsed * 0.34 - 0.65;
      nodes.forEach((node, index) => {
        node.rotation.x = elapsed * (index % 2 ? 0.7 : -0.5) + index;
        node.rotation.y = elapsed * 0.8;
      });
      render();
      frameId = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (sceneVisible && !reducedMotion && !frameId) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const setPointer = (clientX, clientY) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = ((clientX - bounds.left) / bounds.width) * 2 - 1;
      pointerY = ((clientY - bounds.top) / bounds.height) * 2 - 1;
      if (reducedMotion) {
        core.rotation.y = pointerX * 0.16;
        core.rotation.x = pointerY * 0.1;
        render();
      }
    };

    canvas.addEventListener('pointermove', (event) => setPointer(event.clientX, event.clientY));
    canvas.addEventListener('pointerleave', () => {
      pointerX = 0;
      pointerY = 0;
    });
    canvas.addEventListener('touchmove', (event) => {
      const touch = event.touches[0];
      if (touch) setPointer(touch.clientX, touch.clientY);
    }, { passive: true });

    motionQuery.addEventListener('change', (event) => {
      reducedMotion = event.matches;
      if (reducedMotion && frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
        render();
      } else {
        startAnimation();
      }
    });

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      sceneVisible = entry.isIntersecting;
      if (sceneVisible) startAnimation();
      else if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
    });
    visibilityObserver.observe(canvas);

    new ResizeObserver(resize).observe(canvas);
    resize();
    startAnimation();
  } catch (error) {
    console.error('The 3D hero scene could not be initialized:', error);
  }
}