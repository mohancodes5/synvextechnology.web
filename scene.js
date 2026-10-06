import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js';

const canvas = document.getElementById('hero-canvas');

if (canvas) {
  try {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf2f5f9, 9, 17.5);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.25, 8.7);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    const ambient = new THREE.AmbientLight(0xe2f0ff, 1.3);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.7);
    keyLight.position.set(4.5, 5.5, 6.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8ec5ff, 1.6);
    fillLight.position.set(-4.5, 2.5, -4.5);
    scene.add(fillLight);

    const blueBloom = new THREE.PointLight(0x2d6df6, 24, 14, 2);
    blueBloom.position.set(-2.5, 1.5, 3.2);
    scene.add(blueBloom);

    const orangeBloom = new THREE.PointLight(0xea580c, 16, 12, 2);
    orangeBloom.position.set(3.4, 2.2, -1.8);
    scene.add(orangeBloom);

    const core = new THREE.Group();
    scene.add(core);

    const baseOrb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.9, 2),
      new THREE.MeshPhysicalMaterial({
        color: 0x1d5dd8,
        emissive: 0x0a214e,
        emissiveIntensity: 0.52,
        metalness: 0.5,
        roughness: 0.22,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        sheen: 0.8,
        sheenColor: new THREE.Color(0xb8d9ff),
      })
    );
    core.add(baseOrb);

    const innerGlow = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.38, 1),
      new THREE.MeshPhysicalMaterial({
        color: 0x5fbcff,
        transparent: true,
        opacity: 0.18,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.22,
        thickness: 0.6,
      })
    );
    core.add(innerGlow);

    const wireframe = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.92, 2),
      new THREE.MeshBasicMaterial({
        color: 0xcfe8ff,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      })
    );
    core.add(wireframe);

    const topHighlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 24, 24),
      new THREE.MeshPhysicalMaterial({
        color: 0xedf7ff,
        transparent: true,
        opacity: 0.15,
        roughness: 0.2,
        metalness: 0.1,
      })
    );
    topHighlight.position.set(-0.42, 0.62, 0.9);
    core.add(topHighlight);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.1, 0.085, 32, 280),
      new THREE.MeshPhysicalMaterial({
        color: 0xdf6230,
        emissive: 0x561e0a,
        emissiveIntensity: 0.5,
        metalness: 0.92,
        roughness: 0.15,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      })
    );
    ring.rotation.set(1.12, 0.45, 0.62);
    core.add(ring);

    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(3.38, 0.028, 16, 260),
      new THREE.MeshBasicMaterial({
        color: 0x9ec7ff,
        transparent: true,
        opacity: 0.7,
      })
    );
    orbit.rotation.set(1.36, 0.84, -0.54);
    core.add(orbit);

    const nodes = [];
    const nodeGeometry = new THREE.OctahedronGeometry(0.18, 0);
    const nodeMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xf76d2d, metalness: 0.65, roughness: 0.28, emissive: 0x58220a, emissiveIntensity: 0.28 }),
      new THREE.MeshStandardMaterial({ color: 0xcfeaff, metalness: 0.55, roughness: 0.24, emissive: 0x1b3f75, emissiveIntensity: 0.16 }),
      new THREE.MeshStandardMaterial({ color: 0x2859c8, metalness: 0.7, roughness: 0.22, emissive: 0x102f75, emissiveIntensity: 0.24 }),
      new THREE.MeshStandardMaterial({ color: 0x7ecbff, metalness: 0.5, roughness: 0.2, emissive: 0x102c44, emissiveIntensity: 0.14 }),
    ];

    for (let index = 0; index < 10; index += 1) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterials[index % nodeMaterials.length]);
      const angle = (index / 10) * Math.PI * 2;
      const radius = 2.55 + (index % 2) * 0.35;
      node.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.7,
        (index % 3) * 0.38 - 0.58
      );
      node.userData = {
        angle,
        radius,
        floatSeed: index * 0.73,
      };
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
      camera.position.z = width < 560 ? 9.5 : 8.5;
      camera.updateProjectionMatrix();
      render();
    };

    const animate = (time) => {
      frameId = 0;
      if (!sceneVisible || reducedMotion) {
        render();
        return;
      }

      const elapsed = time * 0.0007;
      core.rotation.y = elapsed * 0.8 + pointerX * 0.45;
      core.rotation.x = Math.sin(elapsed * 1.3) * 0.32 + pointerY * 0.2;
      core.position.y = Math.sin(elapsed * 1.8) * 0.2;

      baseOrb.rotation.x = elapsed * 0.6;
      baseOrb.rotation.y = elapsed * 0.7;
      wireframe.rotation.x = -elapsed * 0.5;
      wireframe.rotation.y = elapsed * 0.72;
      innerGlow.rotation.x = -elapsed * 0.38;
      innerGlow.rotation.y = elapsed * 0.52;

      ring.rotation.z = elapsed * 1.36 - 0.7;
      ring.rotation.x = 1.12 + Math.sin(elapsed * 1.9) * 0.16;
      orbit.rotation.y = -elapsed * 1.08 + 0.82;
      orbit.rotation.z = Math.sin(elapsed * 1.4) * 0.42;

      nodes.forEach((node, index) => {
        const phase = elapsed * (1.1 + index * 0.08) + node.userData.floatSeed;
        node.position.x = Math.cos(node.userData.angle + phase * 1.2) * node.userData.radius;
        node.position.y = Math.sin(node.userData.angle * 1.7 + phase * 1.3) * (0.8 + index * 0.07);
        node.position.z = Math.sin(node.userData.angle + phase) * 0.75 + (index % 3) * 0.28 - 0.5;
        node.rotation.x = phase * 1.2;
        node.rotation.y = phase * 1.1;
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
        core.rotation.y = pointerX * 0.35;
        core.rotation.x = pointerY * 0.2;
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