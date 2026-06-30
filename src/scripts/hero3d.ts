import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

type PanelElement = HTMLAnchorElement & {
  dataset: DOMStringMap;
};

type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};

type LogoMaterialRuntime = {
  material: THREE.Material;
  baseOpacity: number;
};

type RuntimeState = {
  animationFrameId: number | null;
  abortController: AbortController;
  resizeObserver: ResizeObserver | null;
  renderer: THREE.WebGLRenderer | null;
  pmremGenerator: THREE.PMREMGenerator | null;
  environmentTarget: THREE.WebGLRenderTarget | null;
};

type LogoScene = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  logo: THREE.Group;
  logoBaseScale: number;
  logoFittedBox: THREE.Box3;
  stage: HTMLElement;
  panels: PanelElement[];
  panelAnchors: Map<PanelElement, THREE.Vector3>;
  pointer: PointerState;
  getActivePanel: () => PanelElement | null;
  materials: LogoMaterialRuntime[];
  lights: {
    ambient: THREE.HemisphereLight;
    key: THREE.SpotLight;
    cyan: THREE.PointLight;
    blue: THREE.PointLight;
  };
  floorMaterial: THREE.MeshStandardMaterial;
  reducedMotion: boolean;
};

const BRAND = {
  navy: 0x0c375e,
  cyan: 0x1f91a7,
  lightEdge: 0xdfe8ee
} as const;

const LOGO_ROTATION_LIMIT = {
  x: THREE.MathUtils.degToRad(6),
  y: THREE.MathUtils.degToRad(7.5),
  z: THREE.MathUtils.degToRad(1.5)
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function easeOutCubic(value: number): number {
  return 1 - Math.pow(1 - value, 3);
}

function isDarkMode(host: HTMLElement): boolean {
  const forcedTheme =
    host.dataset.theme ||
    document.documentElement.dataset.theme ||
    document.body.dataset.theme;

  if (forcedTheme) {
    return forcedTheme === "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");

    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function showFallback(host: HTMLElement, message: string): void {
  console.warn(message);
  host.dataset.fallback = "true";
  host.classList.remove("is-loading");
  host.classList.add("is-fallback");
}

function getStageSize(stage: HTMLElement): { width: number; height: number } {
  const rect = stage.getBoundingClientRect();

  return {
    width: Math.max(Math.round(rect.width), 320),
    height: Math.max(Math.round(rect.height), 260)
  };
}

function getObjectBox(object: THREE.Object3D): THREE.Box3 {
  object.updateMatrixWorld(true);

  return new THREE.Box3().setFromObject(object);
}

function centerObject(object: THREE.Object3D): void {
  const box = getObjectBox(object);
  const center = new THREE.Vector3();

  box.getCenter(center);
  object.position.sub(center);
  object.updateMatrixWorld(true);
}

function normalizeLogoByWidth(logo: THREE.Group, targetWidth = 5.95): number {
  centerObject(logo);

  const box = getObjectBox(logo);
  const size = new THREE.Vector3();

  box.getSize(size);

  const scale = targetWidth / Math.max(size.x, 1);

  logo.scale.setScalar(scale);
  centerObject(logo);

  return scale;
}

function getMaterialList(material: THREE.Material | THREE.Material[]): THREE.Material[] {
  return Array.isArray(material) ? material : [material];
}

const COLOR_TEXTURE_KEYS = [
  "map",
  "emissiveMap",
  "specularColorMap",
  "sheenColorMap"
] as const;

const DISPOSABLE_TEXTURE_KEYS = [
  "map",
  "alphaMap",
  "aoMap",
  "bumpMap",
  "clearcoatMap",
  "clearcoatNormalMap",
  "clearcoatRoughnessMap",
  "displacementMap",
  "emissiveMap",
  "envMap",
  "iridescenceMap",
  "iridescenceThicknessMap",
  "lightMap",
  "metalnessMap",
  "normalMap",
  "roughnessMap",
  "sheenColorMap",
  "sheenRoughnessMap",
  "specularColorMap",
  "specularIntensityMap",
  "transmissionMap",
  "thicknessMap"
] as const;

type MaterialWithOptionalMaps = THREE.Material & {
  alphaTest?: number;
  depthWrite?: boolean;
  opacity?: number;
  side?: THREE.Side;
  toneMapped?: boolean;
  transparent?: boolean;
} & Partial<Record<(typeof DISPOSABLE_TEXTURE_KEYS)[number], THREE.Texture | null>>;

function configureColorTexture(texture: THREE.Texture | null | undefined): void {
  if (!texture) {
    return;
  }

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
}

function materialHasLogoTexture(material: MaterialWithOptionalMaps): boolean {
  return COLOR_TEXTURE_KEYS.some((key) => material[key] instanceof THREE.Texture);
}

function prepareLogoMaterials(logo: THREE.Object3D): LogoMaterialRuntime[] {
  const materialRuntimes: LogoMaterialRuntime[] = [];
  const seenMaterials = new Set<THREE.Material>();

  logo.traverse((child: THREE.Object3D) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    const mesh = child as THREE.Mesh<
      THREE.BufferGeometry,
      THREE.Material | THREE.Material[]
    >;

    mesh.castShadow = true;
    mesh.receiveShadow = false;
    mesh.frustumCulled = false;

    getMaterialList(mesh.material).forEach((material) => {
      if (seenMaterials.has(material)) {
        return;
      }

      seenMaterials.add(material);

      const logoMaterial = material as MaterialWithOptionalMaps;
      const hasTexture = materialHasLogoTexture(logoMaterial);
      const baseOpacity = typeof logoMaterial.opacity === "number" ? logoMaterial.opacity : 1;

      COLOR_TEXTURE_KEYS.forEach((key) => configureColorTexture(logoMaterial[key]));

      if (hasTexture) {
        logoMaterial.transparent = true;
        logoMaterial.alphaTest = Math.max(logoMaterial.alphaTest || 0, 0.05);
        logoMaterial.depthWrite = true;
        logoMaterial.side = THREE.DoubleSide;

        if ("toneMapped" in logoMaterial) {
          logoMaterial.toneMapped = false;
        }
      } else {
        logoMaterial.transparent = true;
      }

      logoMaterial.opacity = 0;
      logoMaterial.needsUpdate = true;

      materialRuntimes.push({
        material,
        baseOpacity
      });
    });
  });

  return materialRuntimes;
}

function disposeMaterial(material: THREE.Material): void {
  const materialWithMaps = material as MaterialWithOptionalMaps;

  DISPOSABLE_TEXTURE_KEYS.forEach((key) => {
    const texture = materialWithMaps[key];

    if (texture instanceof THREE.Texture) {
      texture.dispose();
    }
  });

  material.dispose();
}

function disposeObject3D(object: THREE.Object3D): void {
  object.traverse((child: THREE.Object3D) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    const mesh = child as THREE.Mesh<
      THREE.BufferGeometry,
      THREE.Material | THREE.Material[]
    >;

    mesh.geometry.dispose();
    getMaterialList(mesh.material).forEach((material) => disposeMaterial(material));
  });
}

function fitCameraToBox(
  camera: THREE.PerspectiveCamera,
  box: THREE.Box3,
  aspect: number,
  viewportWidth: number
): number {
  const size = new THREE.Vector3();

  box.getSize(size);

  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const horizontalFov =
    2 * Math.atan(Math.tan(verticalFov / 2) * Math.max(aspect, 0.1));

  const distanceByHeight = (size.y / 2) / Math.tan(verticalFov / 2);
  const distanceByWidth = (size.x / 2) / Math.tan(horizontalFov / 2);

  const margin =
    viewportWidth < 420 ? 2.08 :
    viewportWidth < 640 ? 1.92 :
    viewportWidth < 960 ? 1.72 :
    viewportWidth < 1280 ? 1.58 :
    1.48;

  return Math.max(distanceByHeight, distanceByWidth) * margin;
}

function setupPanelInteractions(
  host: HTMLElement,
  panelsWrapper: HTMLElement,
  panels: PanelElement[],
  abortController: AbortController
): () => PanelElement | null {
  let activePanel: PanelElement | null = null;

  function setActive(panel: PanelElement | null): void {
    activePanel = panel;
    panelsWrapper.dataset.hasActive = panel ? "true" : "false";
    host.dataset.activePanel = panel?.dataset.panelId || "";

    panels.forEach((item) => {
      item.dataset.active = String(item === panel);
    });
  }

  panels.forEach((panel) => {
    panel.addEventListener("pointerenter", () => setActive(panel), {
      signal: abortController.signal
    });

    panel.addEventListener("focus", () => setActive(panel), {
      signal: abortController.signal
    });

    panel.addEventListener("pointerleave", () => setActive(null), {
      signal: abortController.signal
    });

    panel.addEventListener("blur", () => setActive(null), {
      signal: abortController.signal
    });

    panel.addEventListener(
      "pointermove",
      (event: PointerEvent) => {
        const rect = panel.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

        panel.style.setProperty("--glow-x", `${(x * 34).toFixed(2)}px`);
        panel.style.setProperty("--glow-y", `${(y * 22).toFixed(2)}px`);
        panel.style.setProperty("--tilt-x", `${clamp(-y * 3.5, -3.5, 3.5).toFixed(2)}deg`);
        panel.style.setProperty("--tilt-y", `${clamp(x * 4.5, -4.5, 4.5).toFixed(2)}deg`);
      },
      {
        passive: true,
        signal: abortController.signal
      }
    );

    panel.addEventListener(
      "pointerleave",
      () => {
        panel.style.removeProperty("--glow-x");
        panel.style.removeProperty("--glow-y");
        panel.style.removeProperty("--tilt-x");
        panel.style.removeProperty("--tilt-y");
      },
      {
        signal: abortController.signal
      }
    );
  });

  return () => activePanel;
}

function createLights(scene: THREE.Scene): LogoScene["lights"] {
  const ambient = new THREE.HemisphereLight(0xffffff, 0x061020, 1.05);

  const key = new THREE.SpotLight(
    0xffffff,
    42,
    28,
    Math.PI * 0.22,
    0.38,
    1
  );

  const cyan = new THREE.PointLight(0x26d9f4, 2.55, 16, 1.8);
  const blue = new THREE.PointLight(0x246ab7, 1.8, 16, 1.8);

  key.position.set(4.2, 4.8, 7.4);
  key.castShadow = true;

  cyan.position.set(3, 1.15, 3);
  blue.position.set(-3.1, -0.85, 1.6);

  scene.add(ambient, key, cyan, blue);

  return {
    ambient,
    key,
    cyan,
    blue
  };
}

function applyTheme(runtime: LogoScene, host: HTMLElement): void {
  const dark = isDarkMode(host);
  const { scene, renderer, lights, floorMaterial } = runtime;

  scene.fog = new THREE.FogExp2(dark ? 0x030816 : 0xf6fbff, dark ? 0.028 : 0.01);

  lights.ambient.intensity = dark ? 1.12 : 1.22;
  lights.key.intensity = dark ? 42 : 34;
  lights.cyan.intensity = dark ? 2.55 : 1.55;
  lights.blue.intensity = dark ? 1.8 : 0.95;

  renderer.toneMappingExposure = dark ? 1.1 : 1.04;

  floorMaterial.color.set(dark ? BRAND.navy : 0xe8f6fb);
  floorMaterial.opacity = dark ? 0.13 : 0.17;

  host.dataset.theme = dark ? "dark" : "light";
}

function resizeRuntime(runtime: LogoScene): void {
  const { width, height } = getStageSize(runtime.stage);

  runtime.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  runtime.renderer.setSize(width, height, false);

  runtime.camera.aspect = width / height;
  runtime.camera.fov = width < 640 ? 41 : width < 960 ? 36 : 31;

  runtime.camera.position.z = fitCameraToBox(
    runtime.camera,
    runtime.logoFittedBox,
    runtime.camera.aspect,
    width
  );

  runtime.camera.position.y = width < 640 ? 0.55 : 0.36;
  runtime.camera.position.x = 0;
  runtime.camera.lookAt(0, 0, 0);
  runtime.camera.updateProjectionMatrix();
}

function projectPanel(runtime: LogoScene, panel: PanelElement): void {
  const anchor = runtime.panelAnchors.get(panel);

  if (!anchor) {
    return;
  }

  const world = anchor.clone().applyMatrix4(runtime.logo.matrixWorld);
  const projected = world.project(runtime.camera);

  const fallbackX = Number(panel.dataset.fallbackX || 50);
  const fallbackY = Number(panel.dataset.fallbackY || 50);
  const visible = projected.z > -1 && projected.z < 1;

  const rawX = visible ? (projected.x * 0.5 + 0.5) * 100 : fallbackX;
  const rawY = visible ? (-projected.y * 0.5 + 0.5) * 100 : fallbackY;

  const parallax = Number(panel.dataset.parallax || 1);

  panel.style.setProperty("--panel-x", `${clamp(rawX, 11, 89).toFixed(2)}%`);
  panel.style.setProperty("--panel-y", `${clamp(rawY, 12, 86).toFixed(2)}%`);
  panel.style.setProperty("--panel-dx", `${(runtime.pointer.x * 11 * parallax).toFixed(2)}px`);
  panel.style.setProperty("--panel-dy", `${(runtime.pointer.y * 7 * parallax).toFixed(2)}px`);
}

function animateRuntime(runtime: LogoScene, state: RuntimeState, startTime: number): void {
  state.animationFrameId = window.requestAnimationFrame((now) => {
    const elapsed = (now - startTime) / 1000;
    const intro = easeOutCubic(clamp(elapsed / 1.35, 0, 1));
    const activePanel = runtime.getActivePanel();
    const hasActivePanel = Boolean(activePanel);
    const motionFactor = runtime.reducedMotion ? 0 : hasActivePanel ? 0.18 : 1;

    runtime.pointer.x += (runtime.pointer.targetX - runtime.pointer.x) * 0.045;
    runtime.pointer.y += (runtime.pointer.targetY - runtime.pointer.y) * 0.045;

    runtime.materials.forEach(({ material, baseOpacity }) => {
      const logoMaterial = material as THREE.Material & { opacity?: number };

      if (typeof logoMaterial.opacity === "number") {
        logoMaterial.opacity = baseOpacity * intro;
      }
    });

    runtime.logo.scale.setScalar(runtime.logoBaseScale * (0.9 + 0.1 * intro));

    runtime.logo.position.z = THREE.MathUtils.lerp(runtime.logo.position.z, 0, 0.08);

    runtime.logo.position.y = THREE.MathUtils.lerp(
      runtime.logo.position.y,
      -0.02 + Math.sin(elapsed) * 0.01 * motionFactor,
      0.045
    );

    const targetRotationX = clamp(
      -0.02 + runtime.pointer.y * 0.018 * motionFactor,
      -LOGO_ROTATION_LIMIT.x,
      LOGO_ROTATION_LIMIT.x
    );

    const targetRotationY = clamp(
      hasActivePanel
        ? -0.035
        : -0.055 +
            Math.sin(elapsed * 0.32) * 0.035 * motionFactor +
            runtime.pointer.x * 0.02 * motionFactor,
      -LOGO_ROTATION_LIMIT.y,
      LOGO_ROTATION_LIMIT.y
    );

    const targetRotationZ = clamp(
      runtime.pointer.x * -0.004 * motionFactor,
      -LOGO_ROTATION_LIMIT.z,
      LOGO_ROTATION_LIMIT.z
    );

    runtime.logo.rotation.x = THREE.MathUtils.lerp(
      runtime.logo.rotation.x,
      targetRotationX,
      0.045
    );

    runtime.logo.rotation.y = THREE.MathUtils.lerp(
      runtime.logo.rotation.y,
      targetRotationY,
      0.04
    );

    runtime.logo.rotation.z = THREE.MathUtils.lerp(
      runtime.logo.rotation.z,
      targetRotationZ,
      0.045
    );

    runtime.camera.position.x = THREE.MathUtils.lerp(
      runtime.camera.position.x,
      runtime.pointer.x * 0.105 * motionFactor,
      0.04
    );

    runtime.camera.position.y = THREE.MathUtils.lerp(
      runtime.camera.position.y,
      0.36 - runtime.pointer.y * 0.06 * motionFactor,
      0.04
    );

    runtime.camera.lookAt(
      runtime.pointer.x * 0.018 * motionFactor,
      -runtime.pointer.y * 0.012 * motionFactor,
      0
    );

    runtime.lights.key.position.x =
      3.8 + Math.sin(elapsed * 0.55) * 0.3 * motionFactor;

    runtime.lights.cyan.position.set(
      Math.cos(elapsed * 0.62) * 3,
      1.15,
      3 + Math.sin(elapsed * 0.62) * 0.55
    );

    runtime.lights.blue.position.set(
      Math.sin(elapsed * 0.5) * 3.1,
      -0.85,
      1.6
    );

    runtime.logo.updateMatrixWorld(true);

    runtime.panels.forEach((panel) => projectPanel(runtime, panel));

    runtime.renderer.render(runtime.scene, runtime.camera);

    animateRuntime(runtime, state, startTime);
  });
}

async function initHero(host: HTMLElement): Promise<void> {
  if (host.dataset.hero3dInitialized === "true") {
    return;
  }

  host.dataset.hero3dInitialized = "true";

  const stage = host.querySelector<HTMLElement>("[data-hero-stage]");
  const viewer = host.querySelector<HTMLElement>("[data-hero-viewer]");
  const panelsWrapper = host.querySelector<HTMLElement>("[data-hero-panels]");
  const panels = [...host.querySelectorAll<PanelElement>("[data-panel-id]")];
  const modelUrl = host.dataset.modelUrl;

  if (!stage || !viewer || !panelsWrapper || panels.length === 0 || !modelUrl) {
    showFallback(host, "Faltan elementos obligatorios para inicializar el hero 3D.");
    return;
  }

  if (!hasWebGL()) {
    showFallback(host, "WebGL no está disponible. Se activa fallback visual y enlaces HTML.");
    return;
  }

  const state: RuntimeState = {
    animationFrameId: null,
    abortController: new AbortController(),
    resizeObserver: null,
    renderer: null,
    pmremGenerator: null,
    environmentTarget: null
  };

  try {
    host.classList.add("is-loading");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 120);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });

    state.renderer = renderer;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    viewer.innerHTML = "";
    viewer.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnvironment = new RoomEnvironment();

    state.pmremGenerator = pmremGenerator;
    state.environmentTarget = pmremGenerator.fromScene(roomEnvironment, 0.035);

    scene.environment = state.environmentTarget.texture;

    const lights = createLights(scene);

    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(modelUrl);

    const logo = gltf.scene;

    scene.add(logo);

    const materials = prepareLogoMaterials(logo);

    const logoBaseScale = normalizeLogoByWidth(logo, 5.95);

    logo.position.y = -0.02;
    logo.rotation.set(-0.02, -0.055, 0);
    logo.updateMatrixWorld(true);

    const logoFittedBox = getObjectBox(logo);

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: BRAND.navy,
      roughness: 0.74,
      metalness: 0.03,
      transparent: true,
      opacity: 0.11
    });

    const floor = new THREE.Mesh(new THREE.CircleGeometry(4.8, 96), floorMaterial);

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.9;
    floor.receiveShadow = true;

    scene.add(floor);

    const panelAnchors = new Map<PanelElement, THREE.Vector3>();

    panels.forEach((panel) => {
      panelAnchors.set(
        panel,
        new THREE.Vector3(
          Number(panel.dataset.anchorX || 0),
          Number(panel.dataset.anchorY || 0),
          Number(panel.dataset.anchorZ || 0)
        )
      );
    });

    const pointer: PointerState = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    };

    stage.addEventListener(
      "pointermove",
      (event: PointerEvent) => {
        const rect = stage.getBoundingClientRect();

        pointer.targetX = clamp(
          ((event.clientX - rect.left) / rect.width - 0.5) * 2,
          -1,
          1
        );

        pointer.targetY = clamp(
          ((event.clientY - rect.top) / rect.height - 0.5) * 2,
          -1,
          1
        );

        stage.style.setProperty("--hero-pointer-x", pointer.targetX.toFixed(3));
        stage.style.setProperty("--hero-pointer-y", pointer.targetY.toFixed(3));
      },
      {
        passive: true,
        signal: state.abortController.signal
      }
    );

    stage.addEventListener(
      "pointerleave",
      () => {
        pointer.targetX = 0;
        pointer.targetY = 0;

        stage.style.setProperty("--hero-pointer-x", "0");
        stage.style.setProperty("--hero-pointer-y", "0");
      },
      {
        passive: true,
        signal: state.abortController.signal
      }
    );

    const getActivePanel = setupPanelInteractions(
      host,
      panelsWrapper,
      panels,
      state.abortController
    );

    const runtime: LogoScene = {
      scene,
      camera,
      renderer,
      logo,
      logoBaseScale,
      logoFittedBox,
      stage,
      panels,
      panelAnchors,
      pointer,
      getActivePanel,
      materials,
      lights,
      floorMaterial,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
    };

    const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleThemeChange = () => applyTheme(runtime, host);

    window.addEventListener("themechange", handleThemeChange, {
      signal: state.abortController.signal
    });

    colorSchemeQuery.addEventListener("change", handleThemeChange, {
      signal: state.abortController.signal
    });

    applyTheme(runtime, host);

    resizeRuntime(runtime);

    state.resizeObserver = new ResizeObserver(() => resizeRuntime(runtime));
    state.resizeObserver.observe(stage);

    host.classList.remove("is-loading");
    host.classList.add("is-three-ready");

    const startTime = performance.now();

    animateRuntime(runtime, state, startTime);

    window.addEventListener(
      "pagehide",
      () => {
        if (state.animationFrameId !== null) {
          window.cancelAnimationFrame(state.animationFrameId);
        }

        state.abortController.abort();
        state.resizeObserver?.disconnect();

        disposeObject3D(scene);

        state.environmentTarget?.dispose();
        state.pmremGenerator?.dispose();
        state.renderer?.dispose();

        viewer.innerHTML = "";
      },
      {
        once: true
      }
    );
  } catch (error) {
    if (state.animationFrameId !== null) {
      window.cancelAnimationFrame(state.animationFrameId);
    }

    state.abortController.abort();
    state.resizeObserver?.disconnect();
    state.environmentTarget?.dispose();
    state.pmremGenerator?.dispose();
    state.renderer?.dispose();

    viewer.innerHTML = "";

    showFallback(
      host,
      error instanceof Error
        ? error.message
        : "Error inesperado en el hero 3D."
    );
  }
}

document.querySelectorAll<HTMLElement>("[data-hero3d]").forEach((host) => {
  void initHero(host);
});