import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

type Runtime = {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  sceneElement: HTMLElement;
  logoRoot?: THREE.Group;
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
};

function easeOutCubic(value: number): number {
  return 1 - Math.pow(1 - value, 3);
}

function fitCamera(runtime: Runtime): void {
  const { renderer, camera, sceneElement, logoRoot } = runtime;

  const width = Math.max(sceneElement.clientWidth, 320);
  const height = Math.max(sceneElement.clientHeight, 320);

  renderer.setSize(width, height, false);
  camera.aspect = width / height;

  if (!logoRoot) {
    camera.updateProjectionMatrix();
    return;
  }

  const box = new THREE.Box3().setFromObject(logoRoot);
  const sphere = new THREE.Sphere();

  box.getBoundingSphere(sphere);

  const radius = Math.max(sphere.radius, 1);
  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
  const limitingFov = Math.min(verticalFov, horizontalFov);

  const margin = width < 680 ? 1.9 : 1.62;
  const distance = (radius / Math.sin(limitingFov / 2)) * margin;

  camera.position.set(0, radius * 0.12, distance);
  camera.near = Math.max(distance / 100, 0.03);
  camera.far = distance * 8;
  camera.lookAt(0, 0, 0);
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
      roughness: 0.18,
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

function centerModel(model: THREE.Object3D): void {
  const box = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();

  box.getCenter(center);
  model.position.sub(center);
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

  const keyLight = new THREE.DirectionalLight(0xffffff, 4.6);
  keyLight.position.set(3.5, 5.2, 7.5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x38bdf8, 3.6);
  rimLight.position.set(-5.2, 2.1, -3.4);
  scene.add(rimLight);

  const violetLight = new THREE.PointLight(0x8b5cf6, 3.2, 16);
  violetLight.position.set(-2.8, 1.4, 3.2);
  scene.add(violetLight);

  const cyanLight = new THREE.PointLight(0x22d3ee, 2.9, 14);
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
    pmremGenerator: null
  };

  try {
    sceneElement.classList.add("is-loading");

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050816, 12, 34);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 120);

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
    renderer.toneMappingExposure = 1.2;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    cleanup.pmremGenerator = pmremGenerator;

    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    const lights = createLights(scene);

    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(modelUrl);

    const logoModel = gltf.scene;

    centerModel(logoModel);
    applyMetalMaterial(logoModel);

    const logoRoot = new THREE.Group();
    logoRoot.add(logoModel);
    logoRoot.rotation.set(-0.18, -0.38, 0.015);
    logoRoot.scale.setScalar(0.01);
    logoRoot.position.y = -0.55;

    scene.add(logoRoot);

    const runtime: Runtime = {
      renderer,
      camera,
      sceneElement,
      logoRoot
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

    sceneElement.addEventListener("pointermove", (event: PointerEvent) => {
      const rect = sceneElement.getBoundingClientRect();

      pointer.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      sceneElement.style.setProperty("--hero-pointer-x", pointer.targetX.toFixed(3));
      sceneElement.style.setProperty("--hero-pointer-y", pointer.targetY.toFixed(3));
    });

    sceneElement.addEventListener("pointerleave", () => {
      pointer.targetX = 0;
      pointer.targetY = 0;

      sceneElement.style.setProperty("--hero-pointer-x", "0");
      sceneElement.style.setProperty("--hero-pointer-y", "0");
    });

    const animationStartTime = performance.now();

    function animate(): void {
      cleanup.animationFrameId = requestAnimationFrame(animate);

      const elapsed = (performance.now() - animationStartTime) / 1000;
      const intro = Math.min(elapsed / 1.7, 1);
      const ease = easeOutCubic(intro);

      pointer.x += (pointer.targetX - pointer.x) * 0.075;
      pointer.y += (pointer.targetY - pointer.y) * 0.075;

      logoRoot.scale.setScalar(0.01 + ease * 0.99);
      logoRoot.position.y = -0.55 + ease * 0.55 + Math.sin(elapsed * 1.35) * 0.055;
      logoRoot.rotation.x += (-0.18 + pointer.y * 0.18 - logoRoot.rotation.x) * 0.055;
      logoRoot.rotation.y = -0.38 + elapsed * 0.36 + pointer.x * 0.26;
      logoRoot.rotation.z += (0.015 + pointer.x * 0.025 - logoRoot.rotation.z) * 0.05;

      setOpacity(logoRoot, ease);

      camera.position.x += (pointer.x * 0.34 - camera.position.x) * 0.04;
      camera.position.y += (0.38 + pointer.y * -0.18 - camera.position.y) * 0.04;
      camera.lookAt(0, 0.02, 0);

      lights.keyLight.position.x = 3.5 + Math.sin(elapsed * 0.85) * 0.9;
      lights.keyLight.position.y = 5.2 + Math.cos(elapsed * 0.7) * 0.6;
      lights.rimLight.intensity = 3.3 + Math.cos(elapsed * 1.4) * 0.45;
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