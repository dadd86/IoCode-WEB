import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

type ModelMetrics = {
  radius: number;
  center: THREE.Vector3;
};

type Runtime = {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  sceneElement: HTMLElement;
  logoRoot?: THREE.Group;
  metrics?: ModelMetrics;
};

type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};

type CleanupState = {
  animationFrameId: number | null;
  resizeObserver: ResizeObserver | null;
  renderer: THREE.WebGLRenderer | null;
  pmremGenerator: THREE.PMREMGenerator | null;
  abortController: AbortController;
};

function easeOutCubic(value: number): number {
  return 1 - Math.pow(1 - value, 3);
}

function getElementSize(sceneElement: HTMLElement): { width: number; height: number } {
  const rect = sceneElement.getBoundingClientRect();

  return {
    width: Math.max(Math.round(rect.width), 320),
    height: Math.max(Math.round(rect.height), 260)
  };
}

function getObjectMetrics(object: THREE.Object3D): ModelMetrics {
  const box = new THREE.Box3().setFromObject(object);
  const sphere = new THREE.Sphere();

  box.getBoundingSphere(sphere);

  return {
    radius: Math.max(sphere.radius, 1),
    center: sphere.center.clone()
  };
}

function centerModel(model: THREE.Object3D): void {
  const box = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();

  box.getCenter(center);
  model.position.sub(center);
}

function normalizeModel(model: THREE.Object3D, targetRadius = 2.65): void {
  centerModel(model);

  const metrics = getObjectMetrics(model);
  const scale = targetRadius / metrics.radius;

  model.scale.multiplyScalar(scale);
  centerModel(model);
}

function fitCamera(runtime: Runtime): void {
  const { renderer, camera, sceneElement, metrics } = runtime;
  const { width, height } = getElementSize(sceneElement);

  renderer.setSize(width, height, false);

  camera.aspect = width / height;

  if (!metrics) {
    camera.updateProjectionMatrix();
    return;
  }

  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
  const limitingFov = Math.min(verticalFov, horizontalFov);

  const viewportMargin =
    width < 430 ? 2.35 :
    width < 720 ? 2.05 :
    width < 1100 ? 1.72 :
    1.55;

  const distance = (metrics.radius / Math.sin(limitingFov / 2)) * viewportMargin;

  camera.position.set(
    metrics.center.x,
    metrics.center.y + metrics.radius * 0.04,
    distance
  );

  camera.near = Math.max(distance / 120, 0.03);
  camera.far = distance * 10;
  camera.lookAt(metrics.center);
  camera.updateProjectionMatrix();
}

function setOpacity(object: THREE.Object3D, opacity: number): void {
  object.traverse((child: THREE.Object3D) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    const materials: THREE.Material[] = Array.isArray(child.material)
      ? child.material
      : [child.material];

    materials.forEach((material: THREE.Material) => {
      material.transparent = opacity < 1;
      material.opacity = opacity;
      material.needsUpdate = true;
    });
  });
}

function applyMetalMaterial(model: THREE.Object3D): void {
  let index = 0;

  model.traverse((child: THREE.Object3D) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    const material = new THREE.MeshPhysicalMaterial({
      color: index % 3 === 0 ? 0x0f172a : 0xeaf8ff,
      metalness: 0.92,
      roughness: 0.2,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      reflectivity: 0.85,
      emissive: new THREE.Color(index % 3 === 0 ? 0x020617 : 0x061a2d),
      emissiveIntensity: 0.18,
      transparent: true,
      opacity: 0
    });

    child.material = material;
    child.castShadow = true;
    child.receiveShadow = true;

    index += 1;
  });
}

function disposeScene(object: THREE.Object3D): void {
  object.traverse((child: THREE.Object3D) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    child.geometry.dispose();

    const materials: THREE.Material[] = Array.isArray(child.material)
      ? child.material
      : [child.material];

    materials.forEach((material: THREE.Material) => {
      material.dispose();
    });
  });
}

function createLights(scene: THREE.Scene) {
  const hemisphereLight = new THREE.HemisphereLight(0xdff7ff, 0x07111e, 1.35);
  scene.add(hemisphereLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 4.8);
  keyLight.position.set(3.5, 5.2, 7.5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x38bdf8, 3.8);
  rimLight.position.set(-5.2, 2.1, -3.4);
  scene.add(rimLight);

  const violetLight = new THREE.PointLight(0x8b5cf6, 3.4, 16);
  violetLight.position.set(-2.8, 1.4, 3.2);
  scene.add(violetLight);

  const cyanLight = new THREE.PointLight(0x22d3ee, 3.1, 14);
  cyanLight.position.set(2.6, -1.6, 3.8);
  scene.add(cyanLight);

  return {
    keyLight,
    rimLight,
    violetLight,
    cyanLight
  };
}

async function initHero3d(): Promise<void> {
  const sceneElement = document.getElementById("hero3dScene");
  const canvas = document.getElementById("hero3dCanvas") as HTMLCanvasElement | null;

  if (!sceneElement || !canvas) {
    return;
  }

  const modelUrl = sceneElement.getAttribute("data-model-url");

  if (!modelUrl) {
    sceneElement.classList.add("is-fallback");
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    sceneElement.classList.add("is-fallback");
    return;
  }

  const cleanup: CleanupState = {
    animationFrameId: null,
    resizeObserver: null,
    renderer: null,
    pmremGenerator: null,
    abortController: new AbortController()
  };

  try {
    sceneElement.classList.add("is-loading");

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050816, 12, 34);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 160);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });

    cleanup.renderer = renderer;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    cleanup.pmremGenerator = pmremGenerator;

    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    const lights = createLights(scene);

    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(modelUrl);

    const logoModel = gltf.scene;

    normalizeModel(logoModel, 2.65);
    applyMetalMaterial(logoModel);

    const logoRoot = new THREE.Group();
    logoRoot.add(logoModel);
    logoRoot.rotation.set(-0.16, -0.32, 0.015);
    logoRoot.scale.setScalar(1);
    logoRoot.position.set(0, 0, 0);

    scene.add(logoRoot);

    const metrics = getObjectMetrics(logoRoot);

    const runtime: Runtime = {
      renderer,
      camera,
      sceneElement,
      logoRoot,
      metrics
    };

    fitCamera(runtime);

    const resizeObserver = new ResizeObserver(() => fitCamera(runtime));
    cleanup.resizeObserver = resizeObserver;
    resizeObserver.observe(sceneElement);

    sceneElement.classList.remove("is-loading");
    sceneElement.classList.add("is-three-ready");

    const pointer: PointerState = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    };

    sceneElement.addEventListener(
      "pointermove",
      (event: PointerEvent) => {
        const rect = sceneElement.getBoundingClientRect();

        pointer.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

        sceneElement.style.setProperty("--hero-pointer-x", pointer.targetX.toFixed(3));
        sceneElement.style.setProperty("--hero-pointer-y", pointer.targetY.toFixed(3));
      },
      { signal: cleanup.abortController.signal }
    );

    sceneElement.addEventListener(
      "pointerleave",
      () => {
        pointer.targetX = 0;
        pointer.targetY = 0;

        sceneElement.style.setProperty("--hero-pointer-x", "0");
        sceneElement.style.setProperty("--hero-pointer-y", "0");
      },
      { signal: cleanup.abortController.signal }
    );

    const animationStartTime = performance.now();

    function animate(): void {
      cleanup.animationFrameId = requestAnimationFrame(animate);

      const elapsed = (performance.now() - animationStartTime) / 1000;
      const intro = Math.min(elapsed / 1.6, 1);
      const ease = easeOutCubic(intro);

      pointer.x += (pointer.targetX - pointer.x) * 0.075;
      pointer.y += (pointer.targetY - pointer.y) * 0.075;

      logoRoot.scale.setScalar(0.78 + ease * 0.22);
      logoRoot.position.y = Math.sin(elapsed * 1.25) * 0.045;

      logoRoot.rotation.x += (-0.16 + pointer.y * 0.16 - logoRoot.rotation.x) * 0.055;
      logoRoot.rotation.y = -0.32 + elapsed * 0.34 + pointer.x * 0.24;
      logoRoot.rotation.z += (0.015 + pointer.x * 0.022 - logoRoot.rotation.z) * 0.05;

      setOpacity(logoRoot, ease);

      const target = runtime.metrics?.center ?? new THREE.Vector3(0, 0, 0);

      camera.position.x += (pointer.x * 0.26 - camera.position.x) * 0.035;
      camera.position.y += (target.y + 0.16 + pointer.y * -0.14 - camera.position.y) * 0.035;
      camera.lookAt(target.x, target.y, target.z);

      lights.keyLight.position.x = 3.5 + Math.sin(elapsed * 0.85) * 0.9;
      lights.keyLight.position.y = 5.2 + Math.cos(elapsed * 0.7) * 0.6;
      lights.rimLight.intensity = 3.4 + Math.cos(elapsed * 1.4) * 0.45;
      lights.violetLight.position.x = Math.sin(elapsed * 1.1) * 3.1;
      lights.cyanLight.position.x = Math.cos(elapsed * 1.15) * 3.0;

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener(
      "pagehide",
      () => {
        if (cleanup.animationFrameId !== null) {
          cancelAnimationFrame(cleanup.animationFrameId);
        }

        cleanup.abortController.abort();
        cleanup.resizeObserver?.disconnect();
        disposeScene(scene);
        cleanup.pmremGenerator?.dispose();
        cleanup.renderer?.dispose();
      },
      { once: true }
    );
  } catch (error) {
    console.warn("3D logo could not be initialized. SVG fallback is used.", error);
    sceneElement.classList.remove("is-loading");
    sceneElement.classList.add("is-fallback");
  }
}

void initHero3d();