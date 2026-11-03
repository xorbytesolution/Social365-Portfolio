import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * HeroSphere3D
 * Interactive 3D Refractive Glass Sphere / Growth Orb
 * Embedded directly inside the hero statement typography (inspired by KOTA London portal)
 * Responds to mouse velocity, cursor coordinates, and drag interactions.
 */
export default function HeroSphere3D({ size = 130 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || size;
    const height = container.clientHeight || size;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group for rotation
    const group = new THREE.Group();
    scene.add(group);

    // 1. Core Glass Sphere
    const sphereGeo = new THREE.SphereGeometry(1, 64, 64);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      roughness: 0.08,
      transmission: 0.92,
      thickness: 1.5,
      ior: 1.45,
      reflectivity: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      color: new THREE.Color('#ffffff'),
      attenuationColor: new THREE.Color('#f88379'),
      attenuationDistance: 1.2,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphere);

    // 2. Inner Floating Geometric Core (representing the 365 cycle)
    const innerGeo = new THREE.IcosahedronGeometry(0.55, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d82b48'),
      emissive: new THREE.Color('#14182e'),
      roughness: 0.3,
      metalness: 0.8,
      wireframe: true,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerCore);

    // 3. Orbital Ring (Growth trajectory)
    const ringGeo = new THREE.TorusGeometry(1.25, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#f88379'),
      transparent: true,
      opacity: 0.6,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    group.add(ring);

    // Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const crimsonLight = new THREE.PointLight(0xe03a52, 5, 10);
    crimsonLight.position.set(2, 2, 3);
    scene.add(crimsonLight);

    const navyLight = new THREE.PointLight(0x14182e, 4, 10);
    navyLight.position.set(-2, -2, -2);
    scene.add(navyLight);

    const salmonLight = new THREE.DirectionalLight(0xf88379, 2.5);
    salmonLight.position.set(0, 3, 2);
    scene.add(salmonLight);

    // Interactive Drag & Inertia
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let autoRotationSpeed = 0.008;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) {
        // Subtle tilt toward cursor
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotationY = normX * 0.4;
        targetRotationX = -normY * 0.4;
        return;
      }

      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch Support for mobile
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Continuous slow orbital spin
      group.rotation.y += autoRotationSpeed;
      innerCore.rotation.x -= 0.012;
      innerCore.rotation.z += 0.008;
      ring.rotation.z += 0.006;

      // Smooth damping toward mouse rotation
      group.rotation.x += (targetRotationX - group.rotation.x) * 0.06;
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      sphereGeo.dispose();
      sphereMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      className="hero-lens-container"
      title="Click and drag to explore the Social365 3D sphere"
      style={{ cursor: 'grab' }}
    />
  );
}

