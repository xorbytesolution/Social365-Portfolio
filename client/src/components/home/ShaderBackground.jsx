import React, { useEffect, useRef } from "react";

export default function ShaderBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });

    if (!gl) {
      console.warn("WebGL is not supported by this browser.");
      return;
    }

    const vertexShaderSource = `
      attribute vec2 aVertexPosition;

      void main() {
        gl_Position = vec4(aVertexPosition, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;

      uniform vec2 iResolution;
      uniform float iTime;

      const float overallSpeed = 0.2;
      const float lineFrequency = 0.2;
      const float warpFrequency = 0.5;
      const float warpAmplitude = 1.0;
      const float lineAmplitude = 1.0;
      const float lineSpeed = overallSpeed;
      const float warpSpeed = 0.2 * overallSpeed;
      const float offsetSpeed = 1.33 * overallSpeed;
      const float offsetFrequency = 0.5;
      const float minOffsetSpread = 0.6;
      const float maxOffsetSpread = 2.0;
      const float minLineWidth = 0.01;
      const float maxLineWidth = 0.2;
      const int linesPerGroup = 16;

      float random(float t) {
        return (
          cos(t) +
          cos(t * 1.3 + 1.3) +
          cos(t * 1.4 + 1.4)
        ) / 3.0;
      }

      float getPlasmaY(
        float x,
        float horizontalFade,
        float offset
      ) {
        return random(
          x * lineFrequency + iTime * lineSpeed
        ) * horizontalFade * lineAmplitude + offset;
      }

      float smoothLine(float position, float halfWidth, float value) {
        return 1.0 - smoothstep(
          halfWidth * 0.15,
          halfWidth,
          abs(position - value)
        );
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;

        vec2 space = (
          gl_FragCoord.xy - iResolution.xy * 0.5
        ) / iResolution.x * 2.0 * 5.0;

        float horizontalFade =
          1.0 - (cos(uv.x * 6.28318) * 0.5 + 0.5);

        space.y += random(
          space.x * warpFrequency + iTime * warpSpeed
        ) * warpAmplitude * (0.5 + horizontalFade);

        space.x += random(
          space.y * warpFrequency + iTime * warpSpeed + 2.0
        ) * warpAmplitude * horizontalFade;

        vec3 finalColor = vec3(0.0);
        float finalAlpha = 0.0;

        vec3 crimson = vec3(0.93, 0.14, 0.27);
        vec3 pink = vec3(0.91, 0.48, 0.64);
        vec3 lavender = vec3(0.59, 0.44, 0.84);

        for (int l = 0; l < linesPerGroup; l++) {
          float normalizedIndex =
            float(l) / float(linesPerGroup);

          float offsetTime = iTime * offsetSpeed;

          float offsetPosition =
            float(l) + space.x * offsetFrequency;

          float rand =
            random(offsetPosition + offsetTime) * 0.5 + 0.5;

          float halfWidth = mix(
            minLineWidth,
            maxLineWidth,
            rand * horizontalFade
          ) / 2.0;

          float offset = random(
            offsetPosition +
            offsetTime * (1.0 + normalizedIndex)
          ) * mix(
            minOffsetSpread,
            maxOffsetSpread,
            horizontalFade
          );

          float linePosition = getPlasmaY(
            space.x,
            horizontalFade,
            offset
          );

          float line = smoothLine(
            linePosition,
            halfWidth,
            space.y
          );

          float intensity = line * rand * 0.55;

          vec3 lineColor = mix(
            crimson,
            pink,
            normalizedIndex
          );

          lineColor = mix(
            lineColor,
            lavender,
            smoothstep(0.65, 1.0, uv.x) * 0.65
          );

          finalColor += lineColor * intensity;
          finalAlpha += intensity;
        }

        // Keep the center and edges soft.
        float verticalFade =
          1.0 - (cos(uv.y * 6.28318) * 0.5 + 0.5);

        finalAlpha *= verticalFade * 0.9;

        // Add subtle bright signal points.
        float signal = 0.0;

        for (int i = 0; i < 5; i++) {
          float index = float(i);

          float signalX = fract(
            index * 0.21 + iTime * 0.035
          );

          float signalY = 0.5 +
            random(index * 2.0 + iTime * 0.18) * 0.22;

          float distanceToSignal = length(
            (uv - vec2(signalX, signalY)) *
            vec2(iResolution.x / iResolution.y, 1.0)
          );

          signal += 1.0 - smoothstep(
            0.0,
            0.012,
            distanceToSignal
          );
        }

        finalColor += crimson * signal * 0.65;
        finalAlpha = clamp(
          finalAlpha + signal * 0.45,
          0.0,
          0.88
        );

        gl_FragColor = vec4(
          finalColor,
          finalAlpha
        );
      }
    `;

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);

    const fragmentShader = createShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Shader linking error:", gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "aVertexPosition");

    const resolutionLocation = gl.getUniformLocation(program, "iResolution");

    const timeLocation = gl.getUniformLocation(program, "iTime");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let animationFrame;
    let startTime = performance.now();
    let isVisible = true;
    let width = 0;
    let height = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));

      gl.viewport(0, 0, canvas.width, canvas.height);

      render();
    };

    const render = (time = performance.now()) => {
      if (!width || !height) return;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(program);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      const elapsed = reducedMotion ? 0 : (time - startTime) / 1000;

      gl.uniform1f(timeLocation, elapsed);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);

      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const animate = (time) => {
      if (!isVisible) return;

      render(time);

      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;

        if (isVisible && !reducedMotion) {
          cancelAnimationFrame(animationFrame);
          animationFrame = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(animationFrame);
        }
      },
      { threshold: 0.05 },
    );

    const resizeObserver = new ResizeObserver(resizeCanvas);

    observer.observe(canvas);
    resizeObserver.observe(canvas);

    resizeCanvas();

    if (!reducedMotion) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      resizeObserver.disconnect();

      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div className="shader-background">
      <canvas
        ref={canvasRef}
        className="shader-background__canvas"
        aria-hidden="true"
      />
    </div>
  );
}
