import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * HeroSculpture3D
 * - High-resolution 3:2 studio composition (/assets/about-sculpture.png)
 * - Dynamic view-frustum calculation ensuring the image scales to maximum size
 *   without ever clipping or overflowing the container
 * - 16x anisotropic filtering & 2.5x pixel ratio for crystal-clear texture resolution
 * - Subtle physical curvature & clearcoat gloss catching moving specular reflections
 * - Interactive pointer tilt & drag with smooth inertia damping (60fps)
 */
export default function HeroSculpture3D({
  className = "",
  interactive = true,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --------------------------------------------------
    // 1. SCENE, CAMERA & RENDERER SETUP
    // --------------------------------------------------
    const scene = new THREE.Scene();

    // 34° Perspective camera with balanced FOV
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    // High pixel ratio for retina/4K displays without blur
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    container.appendChild(renderer.domElement);

    // Root Group for 3D physics & orientation
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --------------------------------------------------
    // 2. CALIBRATED STUDIO LIGHTING (Rich & Vibrant)
    // --------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.7);
    scene.add(ambientLight);

    // Key light creates specular highlights that glide across the glossy cards
    const keyLight = new THREE.PointLight(0xffffff, 22, 18);
    keyLight.position.set(3.2, 2.8, 4.5);
    scene.add(keyLight);

    // Soft warm coral-pink fill light
    const fillLight = new THREE.PointLight(0xff8da1, 16, 14);
    fillLight.position.set(-3.4, -2.0, 3.0);
    scene.add(fillLight);

    // Top-down soft rim light
    const topRimLight = new THREE.DirectionalLight(0xfff0f5, 2.0);
    topRimLight.position.set(0, 4.5, 3.5);
    scene.add(topRimLight);

    // --------------------------------------------------
    // 3. 3:2 ASPECT RATIO MESH GEOMETRY (6.0 x 4.0)
    // --------------------------------------------------
    const meshWidth = 6.0;
    const meshHeight = 4.0;
    const segments = 40;

    const geometry = new THREE.PlaneGeometry(
      meshWidth,
      meshHeight,
      segments,
      segments,
    );

    // Add gentle physical 3D curvature so light rolls across the surface
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z =
        -Math.pow(x / (meshWidth / 2), 2) * 0.14 -
        Math.pow(y / (meshHeight / 2), 2) * 0.08;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    // Material with physical clearcoat gloss for rich reflections
    const material = new THREE.MeshPhysicalMaterial({
      transparent: true,
      roughness: 0.14,
      metalness: 0.02,
      clearcoat: 0.9,
      clearcoatRoughness: 0.06,
      reflectivity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    rootGroup.add(mesh);

    // Floating contact shadow beneath the mesh to ground it
    const shadowGeo = new THREE.PlaneGeometry(6.2, 4.2);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext("2d");
    const gradient = sctx.createRadialGradient(64, 64, 10, 64, 64, 60);
    gradient.addColorStop(0, "rgba(216, 43, 72, 0.22)");
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.08)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    sctx.fillStyle = gradient;
    sctx.fillRect(0, 0, 128, 128);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, -0.15, -0.32);
    rootGroup.add(shadowMesh);

    // Load texture with maximum anisotropy & mipmap filtering
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "/assets/about-sculpture.png",
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        // Maximum anisotropy eliminates texture blurring at angles
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.needsUpdate = true;
        material.map = texture;
        material.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.error("Error loading about-sculpture texture:", err);
      },
    );

    // --------------------------------------------------
    // 4. PRECISE VIEW-FRUSTUM FRAMING (Never Cut Off)
    // --------------------------------------------------
    const updateFraming = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      camera.aspect = width / height;

      // Fill 94% of the container for grand visual scale with a safe padding buffer
      const fillRatio = 0.94;
      const vFovRad = THREE.MathUtils.degToRad(camera.fov);
      const visibleH_at_z1 = 2 * Math.tan(vFovRad / 2);

      const zToFitHeight = meshHeight / fillRatio / visibleH_at_z1;
      const zToFitWidth =
        meshWidth / fillRatio / camera.aspect / visibleH_at_z1;

      // Taking Math.max ensures neither width nor height is ever cropped
      camera.position.z = Math.max(zToFitHeight, zToFitWidth);
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(updateFraming);
    resizeObserver.observe(container);
    updateFraming();

    // --------------------------------------------------
    // 5. INTERACTION & MOUSE PARALLAX TILT
    // --------------------------------------------------
    let pointerX = 0;
    let pointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    let targetLightX = 3.2;
    let targetLightY = 2.8;

    let isDragging = false;
    let previousX = 0;
    let previousY = 0;

    const onPointerMove = (e) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      if (!isDragging) {
        pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

        targetRotationY = pointerX * 0.16;
        targetRotationX = -pointerY * 0.12;

        targetLightX = 3.2 + pointerX * 2.0;
        targetLightY = 2.8 + pointerY * 1.5;
        return;
      }

      targetRotationY += (e.clientX - previousX) * 0.005;
      targetRotationX += (e.clientY - previousY) * 0.005;

      previousX = e.clientX;
      previousY = e.clientY;
    };

    const onPointerDown = (e) => {
      if (!interactive) return;
      isDragging = true;
      previousX = e.clientX;
      previousY = e.clientY;
      container.style.cursor = "grabbing";
      if (container.setPointerCapture) {
        container.setPointerCapture(e.pointerId);
      }
    };

    const onPointerUp = (e) => {
      isDragging = false;
      container.style.cursor = interactive ? "grab" : "default";
      if (
        e &&
        container.hasPointerCapture &&
        container.hasPointerCapture(e.pointerId)
      ) {
        container.releasePointerCapture(e.pointerId);
      }
    };

    if (interactive) {
      container.style.cursor = "grab";
      container.style.touchAction = "pan-y";

      container.addEventListener("pointerdown", onPointerDown);
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerup", onPointerUp);
      container.addEventListener("pointercancel", onPointerUp);
      container.addEventListener("pointerleave", onPointerUp);
    }

    // --------------------------------------------------
    // 6. ANIMATION LOOP (Smooth Inertia & Floating Motion)
    // --------------------------------------------------
    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth interpolation for butter-smooth damping
      currentPointerX += (pointerX - currentPointerX) * 0.05;
      currentPointerY += (pointerY - currentPointerY) * 0.05;

      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.04;
      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.04;

      // Specular highlight rolls smoothly with light coordinates
      keyLight.position.x += (targetLightX - keyLight.position.x) * 0.05;
      keyLight.position.y += (targetLightY - keyLight.position.y) * 0.05;

      // Gentle organic breathing motion
      rootGroup.position.y = Math.sin(elapsed * 0.8) * 0.04;
      rootGroup.position.x = Math.cos(elapsed * 0.6) * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // --------------------------------------------------
    // 7. CLEANUP & MEMORY DISPOSAL
    // --------------------------------------------------
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("pointerleave", onPointerUp);

      const disposedGeometries = new Set();
      const disposedMaterials = new Set();

      scene.traverse((obj) => {
        if (obj.geometry && !disposedGeometries.has(obj.geometry)) {
          disposedGeometries.add(obj.geometry);
          obj.geometry.dispose();
        }

        if (obj.material) {
          const mats = Array.isArray(obj.material)
            ? obj.material
            : [obj.material];
          mats.forEach((m) => {
            if (!disposedMaterials.has(m)) {
              disposedMaterials.add(m);
              if (m.map) m.map.dispose();
              m.dispose();
            }
          });
        }
      });

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return (
    <div
      className={`about-visual-wrapper ${className}`}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "920px",
        height: "clamp(540px, 68vh, 760px)",
        minHeight: "480px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Three.js 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        title="Click and drag to interact with the 3D studio artwork"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 2,
        }}
        role="img"
        aria-label="Interactive 3D Social365 Studio Artwork"
      />

      {/* Ambient Radial Brand Glow behind the 3D Model */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "90%",
          height: "80%",
          background:
            "radial-gradient(circle, rgba(224, 58, 82, 0.24) 0%, rgba(248, 131, 121, 0.12) 45%, transparent 70%)",
          filter: "blur(75px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </div>
  );
}
