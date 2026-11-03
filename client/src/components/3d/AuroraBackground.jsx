import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * AuroraBackground
 * High-performance WebGL Chromatic Aurora Shader
 * Shifts gently with time, cursor coordinates, and scroll velocity.
 * Tuned with Social365's brand palette (Navy, Crimson, Salmon, Warm Peach, and Iridescent Violet).
 */
export default function AuroraBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Uniforms
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScrollVelocity: { value: 0 },
    };

    // Vertex Shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Fragment Shader - Living Chromatic Fluid Mesh
    const fragmentShader = `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform float uScrollVelocity;

      // Simplex noise approximation
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                           -0.577350269189626,  // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
              + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / uResolution.xy;
        st.x *= uResolution.x / uResolution.y;

        // Smooth time & mouse interaction
        float t = uTime * 0.15;
        vec2 mouseOffset = (uMouse - 0.5) * 0.25;

        // Fluid distortion waves
        float n1 = snoise(st * 1.2 + vec2(t * 0.6, -t * 0.4) + mouseOffset);
        float n2 = snoise(st * 2.1 - vec2(t * 0.5, t * 0.7) + n1 * 0.4);
        float n3 = snoise(st * 0.8 + vec2(n2 * 0.5, t * 0.3));

        // Social365 Harmonic Palette:
        // Deep Obsidian Navy (#14182E -> 0.078, 0.094, 0.180)
        // Vibrant Crimson (#D82B48 -> 0.847, 0.168, 0.282)
        // Radiant Salmon (#F88379 -> 0.972, 0.513, 0.474)
        // Warm Peach Gold (#FFA07A -> 1.0, 0.627, 0.478)
        // Soft Iridescent Violet (#5E35B1 -> 0.368, 0.207, 0.694)
        // Canvas Soft Cream (#F8F9FA -> 0.972, 0.976, 0.980)

        vec3 cCanvas = vec3(0.972, 0.976, 0.980);
        vec3 cNavy = vec3(0.08, 0.10, 0.20);
        vec3 cCrimson = vec3(0.85, 0.18, 0.30);
        vec3 cSalmon = vec3(0.98, 0.54, 0.49);
        vec3 cViolet = vec3(0.48, 0.28, 0.75);
        vec3 cPeach = vec3(1.0, 0.72, 0.55);

        // Blend aurora layers
        float weight1 = smoothstep(-0.6, 0.8, n1);
        float weight2 = smoothstep(-0.4, 0.9, n2);
        float weight3 = smoothstep(-0.5, 0.7, n3);

        vec3 auroraColor = mix(cCanvas, cViolet, weight1 * 0.28);
        auroraColor = mix(auroraColor, cCrimson, weight2 * 0.35);
        auroraColor = mix(auroraColor, cSalmon, weight3 * 0.40);
        auroraColor = mix(auroraColor, cPeach, (n1 * n2) * 0.25);

        // Add soft ambient grain for filmic texture
        float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.025;
        auroraColor += grain;

        gl_FragColor = vec4(auroraColor, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse & Scroll Tracking
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - e.clientY / window.innerHeight;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = Math.abs(currentScrollY - lastScrollY) * 0.05;
      lastScrollY = currentScrollY;
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      uniforms.uTime.value += delta;

      // Smooth mouse lerp
      uniforms.uMouse.value.x += (targetMouseX - uniforms.uMouse.value.x) * 0.05;
      uniforms.uMouse.value.y += (targetMouseY - uniforms.uMouse.value.y) * 0.05;

      // Dampen scroll velocity
      scrollVelocity *= 0.92;
      uniforms.uScrollVelocity.value = scrollVelocity;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="aurora-canvas-wrap" aria-hidden="true" />;
}

