import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ui } from "../i18n/ui";
import type { Locale } from "../i18n/config";



type PanelElement = HTMLAnchorElement & {
  dataset: DOMStringMap;
};

type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
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
  pointer: PointerState;
  reducedMotion: boolean;
};

type RuntimeState = {
  animationFrameId: number | null;
  abortController: AbortController;
  resizeObserver: ResizeObserver | null;
  intersectionObserver: IntersectionObserver | null;
  renderer: THREE.WebGLRenderer | null;
  isVisible: boolean;
  isDocumentVisible: boolean;
  contextLost: boolean;
  disposed: boolean;
};

const LOGO_ROTATION_LIMIT = {
  x: THREE.MathUtils.degToRad(6),
  y: THREE.MathUtils.degToRad(7.5),
  z: THREE.MathUtils.degToRad(1.5)
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
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

function showFallback(
  host: HTMLElement,
  reason: string,
  message = reason
): void {
  console.warn(message);
  host.dataset.fallback = "true";
  host.dataset.hero3dState = "fallback";
  host.dataset.hero3dFallbackReason = reason;
  host.classList.remove("is-loading", "is-three-ready");
  host.classList.add("is-fallback");
}

function getHeroLabels(host: HTMLElement) {
  const language = host.dataset.language || document.documentElement.lang;
  const locale: Locale = language === "en" || language === "de" ? language : "es";

  return ui[locale];
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
  depthTest?: boolean;
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

/**
 * Propósito:
 * Sustituir los materiales PBR importados por una cara frontal sin iluminación
 * que reproduce la textura original del logo.
 *
 * Parámetros:
 * - logo: grupo cargado desde el GLB.
 * - renderer: renderer activo, utilizado para limitar la anisotropía.
 *
 * Retorno:
 * void.
 *
 * Contexto:
 * El GLB de producción es un billboard alpha-safe. Aplicar simultáneamente la
 * textura como baseColor y emissiveMap altera el color y puede generar bordes
 * fragmentados en WebKit. MeshBasicMaterial conserva los píxeles originales;
 * la profundidad visual procede de la perspectiva y del movimiento del grupo.
 */
function prepareLogoMaterials(
  logo: THREE.Object3D,
  renderer: THREE.WebGLRenderer
): void {
  const maxAnisotropy = Math.min(
    renderer.capabilities.getMaxAnisotropy(),
    4
  );

  logo.traverse((child: THREE.Object3D) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    const mesh = child as THREE.Mesh<
      THREE.BufferGeometry,
      THREE.Material | THREE.Material[]
    >;

    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.frustumCulled = false;

    const sourceMaterials =
      getMaterialList(mesh.material);

    const fidelityMaterials =
      sourceMaterials.flatMap((material) => {
        const source =
          material as MaterialWithOptionalMaps;

        const texture =
          source.map instanceof THREE.Texture
            ? source.map
            : source.emissiveMap instanceof
                THREE.Texture
              ? source.emissiveMap
              : null;

        if (!texture) {
          material.dispose();
          return [];
        }

        configureColorTexture(texture);
        texture.anisotropy = maxAnisotropy;

        const fidelityMaterial =
          new THREE.MeshBasicMaterial({
            alphaMap:
              source.alphaMap instanceof
              THREE.Texture
                ? source.alphaMap
                : null,
            alphaTest: 0.01,
            color: 0xffffff,
            depthTest: true,
            depthWrite: false,
            fog: false,
            map: texture,
            opacity:
              typeof source.opacity === "number"
                ? source.opacity
                : 1,
            side: THREE.FrontSide,
            toneMapped: false,
            transparent: true
          });

        fidelityMaterial.name =
          `${material.name || "IoCodeLogo"}-source-fidelity`;

        material.dispose();

        return [fidelityMaterial];
      });

    const firstFidelityMaterial =
      fidelityMaterials[0];

    if (!firstFidelityMaterial) {
      mesh.visible = false;
      return;
    }

    mesh.material =
      Array.isArray(mesh.material)
        ? fidelityMaterials
        : firstFidelityMaterial;

    mesh.renderOrder = 10;
  });
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

  /*
    Este margen controla el tamaño visual real del logo.
    Antes estaba demasiado alto y alejaba la cámara.
    No aumenta el peso del GLB ni rompe Fase 6; solo corrige encuadre.
  */
  const margin =
    viewportWidth < 420 ? 2.08 :
    viewportWidth < 640 ? 1.98 :
    viewportWidth < 960 ? 1.86 :
    viewportWidth < 1280 ? 1.76 :
    1.62;

  return Math.max(distanceByHeight, distanceByWidth) * margin;
}

function setupPanelInteractions(
  host: HTMLElement,
  panelsWrapper: HTMLElement,
  panels: PanelElement[],
  abortController: AbortController
): void {
  function setActive(panel: PanelElement | null): void {
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
}

function applyTheme(host: HTMLElement): void {
  const dark = isDarkMode(host);

  host.dataset.theme = dark ? "dark" : "light";
}

/**
 * Propósito:
 * Adaptar renderer y cámara al viewport limitando el coste del framebuffer.
 *
 * Parámetros:
 * - runtime: escena activa del Logo3D.
 *
 * Retorno:
 * void.
 *
 * Notas:
 * En pantallas táctiles se limita el DPR a 1.5. En escritorio se conserva
 * un máximo de 2. El CSS continúa trabajando en píxeles lógicos.
 */
function resizeRuntime(
  runtime: LogoScene
): void {
  const { width, height } =
    getStageSize(runtime.stage);

  const coarsePointer = window.matchMedia(
    "(hover: none) and (pointer: coarse)"
  ).matches;

  const pixelRatioLimit =
    coarsePointer || width < 960
      ? 1.5
      : 2;

  runtime.renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio || 1,
      pixelRatioLimit
    )
  );

  runtime.renderer.setSize(
    width,
    height,
    false
  );

  runtime.camera.aspect = width / height;

  runtime.camera.fov =
    width < 640
      ? 41
      : width < 960
        ? 36
        : 31;

  runtime.camera.position.z =
    fitCameraToBox(
      runtime.camera,
      runtime.logoFittedBox,
      runtime.camera.aspect,
      width
    );

  runtime.camera.position.y =
    width < 640
      ? 0.36
      : width < 960
        ? 0.22
        : 0.14;

  runtime.camera.position.x = 0;
  runtime.camera.lookAt(0, 0, 0);
  runtime.camera.updateProjectionMatrix();
}

function getPanelFloatSeed(panel: PanelElement): number {
  const id = panel.dataset.panelId || "panel";

  return [...id].reduce((total, character) => {
    return total + character.charCodeAt(0);
  }, 0);
}

function projectPanel(runtime: LogoScene, panel: PanelElement, elapsed: number): void {
  const fallbackX = Number(panel.dataset.fallbackX || 50);
  const fallbackY = Number(panel.dataset.fallbackY || 50);
  const parallax = Number(panel.dataset.parallax || 1);
  const seed = getPanelFloatSeed(panel);

  const sideDirection = fallbackX < 50 ? -1 : fallbackX > 50 ? 1 : 0;
  const verticalDirection = fallbackY < 50 ? -1 : fallbackY > 50 ? 1 : 0;

  const orbitalX =
    Math.sin(elapsed * 0.52 + seed * 0.017) * 0.9 * parallax;

  const orbitalY =
    Math.cos(elapsed * 0.48 + seed * 0.013) * 0.72 * parallax;

  const edgeBreathingX =
    Math.sin(elapsed * 0.28 + seed * 0.01) * 0.18 * sideDirection;

  const edgeBreathingY =
    Math.cos(elapsed * 0.24 + seed * 0.01) * 0.14 * verticalDirection;

  const pointerX = runtime.pointer.x * 0.34 * parallax;
  const pointerY = runtime.pointer.y * 0.26 * parallax;

  const nextX = clamp(
    fallbackX + orbitalX + edgeBreathingX + pointerX,
    18,
    82
  );

  const nextY = clamp(
    fallbackY + orbitalY + edgeBreathingY + pointerY,
    18,
    82
  );

  const translateX =
    Math.sin(elapsed * 0.72 + seed * 0.019) * 6.4 * parallax +
    runtime.pointer.x * 5.8 * parallax;

  const translateY =
    Math.cos(elapsed * 0.64 + seed * 0.015) * 5.2 * parallax +
    runtime.pointer.y * 5.2 * parallax;

  const lift =
    Math.sin(elapsed * 0.58 + seed * 0.021) * 4.2 * parallax;

  panel.style.setProperty("--panel-x", `${nextX.toFixed(2)}%`);
  panel.style.setProperty("--panel-y", `${nextY.toFixed(2)}%`);
  panel.style.setProperty("--panel-dx", `${translateX.toFixed(2)}px`);
  panel.style.setProperty("--panel-dy", `${translateY.toFixed(2)}px`);
  panel.style.setProperty("--panel-lift", `${lift.toFixed(2)}px`);
}

function animateRuntime(runtime: LogoScene, state: RuntimeState, startTime: number): void {
  state.animationFrameId = window.requestAnimationFrame((now) => {
    const elapsed = (now - startTime) / 1000;
    const motionFactor = runtime.reducedMotion ? 0 : 1;

    runtime.pointer.x += (runtime.pointer.targetX - runtime.pointer.x) * 0.045;
    runtime.pointer.y += (runtime.pointer.targetY - runtime.pointer.y) * 0.045;

    const breathingScale =
      1 + Math.sin(elapsed * 0.72) * 0.018 * motionFactor;

    runtime.logo.scale.setScalar(runtime.logoBaseScale * breathingScale);

    const idleFloatY = Math.sin(elapsed * 0.92) * 0.13 * motionFactor;
    const idleFloatZ = Math.cos(elapsed * 0.76) * 0.075 * motionFactor;

    runtime.logo.position.y = THREE.MathUtils.lerp(
      runtime.logo.position.y,
      idleFloatY,
      0.06
    );

    runtime.logo.position.z = THREE.MathUtils.lerp(
      runtime.logo.position.z,
      idleFloatZ,
      0.06
    );

    const targetRotationX = clamp(
      -0.018 +
        Math.sin(elapsed * 0.5) * 0.042 * motionFactor +
        runtime.pointer.y * 0.03 * motionFactor,
      -LOGO_ROTATION_LIMIT.x,
      LOGO_ROTATION_LIMIT.x
    );

   const targetRotationY = clamp(
      -0.045 +
        Math.sin(elapsed * 0.56) * 0.15 * motionFactor +
        runtime.pointer.x * 0.04 * motionFactor,
      -LOGO_ROTATION_LIMIT.y,
      LOGO_ROTATION_LIMIT.y
    );

    const targetRotationZ = clamp(
      Math.sin(elapsed * 0.44) * 0.024 * motionFactor +
        runtime.pointer.x * -0.008 * motionFactor,
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

    const targetCameraX = runtime.pointer.x * 0.105 * motionFactor;

    runtime.camera.position.x = THREE.MathUtils.lerp(
      runtime.camera.position.x,
      targetCameraX,
      0.04
    );

    runtime.camera.position.y = THREE.MathUtils.lerp(
      runtime.camera.position.y,
      0.14 - runtime.pointer.y * 0.04 * motionFactor,
      0.04
    );

    runtime.camera.lookAt(
      runtime.pointer.x * 0.018 * motionFactor,
      -runtime.pointer.y * 0.012 * motionFactor,
      0
    );

    runtime.logo.updateMatrixWorld(true);

    runtime.panels.forEach((panel) => projectPanel(runtime, panel, elapsed));

    runtime.renderer.render(runtime.scene, runtime.camera);

    if (runtime.reducedMotion || !state.isVisible || !state.isDocumentVisible) {
      state.animationFrameId = null;
      return;
    }

    animateRuntime(runtime, state, startTime);
  });
}

export async function initHero(host: HTMLElement): Promise<void> {
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
    const labels = getHeroLabels(host);
    showFallback(
      host,
      "missing-elements",
      labels.heroMissingElementsLog
    );
    return;
  }

  if (!hasWebGL()) {
    const labels = getHeroLabels(host);
    showFallback(
      host,
      "webgl-unavailable",
      labels.heroWebglUnavailableLog
    );
    return;
  }

  const state: RuntimeState = {
    animationFrameId: null,
    abortController: new AbortController(),
    resizeObserver: null,
    intersectionObserver: null,
    renderer: null,
    isVisible: true,
    isDocumentVisible: document.visibilityState === "visible",
    contextLost: false,
    disposed: false
  };

  let sceneToDispose: THREE.Scene | null = null;

  try {
    host.classList.add("is-loading");

    const scene = new THREE.Scene();
    sceneToDispose = scene;
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 120);

    /**
     * Perfil GPU:
     * - Desktop: antialias y preferencia de alto rendimiento.
     * - Touch/tablet: menor framebuffer y sin antialias MSAA.
     *
     * El modelo actual no necesita recibir sombras para conservar legibilidad.
     */
    const coarsePointer = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: !coarsePointer,
      alpha: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: coarsePointer
        ? "default"
        : "high-performance"
    });

    state.renderer = renderer;

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.NoToneMapping;

    renderer.shadowMap.enabled = false;
    renderer.setClearColor(0x000000, 0);
    renderer.sortObjects = true;

    viewer.innerHTML = "";
    viewer.appendChild(renderer.domElement);

    const loader = new GLTFLoader();

    const gltf = await loader.loadAsync(modelUrl);

    const logo = gltf.scene;

    scene.add(logo);

    prepareLogoMaterials(logo, renderer);

    const logoBaseScale = normalizeLogoByWidth(logo, 4.8);

    logo.position.y = 0;
    logo.rotation.set(-0.02, -0.055, 0);
    logo.updateMatrixWorld(true);

    const logoFittedBox = getObjectBox(logo);

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

    setupPanelInteractions(
      host,
      panelsWrapper,
      panels,
      state.abortController
    );

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const runtime: LogoScene = {
      scene,
      camera,
      renderer,
      logo,
      logoBaseScale,
      logoFittedBox,
      stage,
      panels,
      pointer,
      reducedMotion: reducedMotionQuery.matches
    };

    function startAnimation(): void {
      if (state.disposed) {
        return;
      }

      host.dataset.hero3dAnimationState = "running";

      if (state.animationFrameId !== null) {
        return;
      }

      animateRuntime(runtime, state, performance.now());
    }

    function stopAnimation(animationState: string): void {
      if (state.animationFrameId !== null) {
        window.cancelAnimationFrame(state.animationFrameId);
        state.animationFrameId = null;
      }

      host.dataset.hero3dAnimationState = animationState;
    }

    function syncAnimationState(): void {
      if (state.disposed) {
        return;
      }

      if (state.contextLost) {
        stopAnimation("paused-context-lost");
        return;
      }

      if (runtime.reducedMotion) {
        stopAnimation("paused-reduced-motion");
        runtime.renderer.render(runtime.scene, runtime.camera);
        return;
      }

      if (!state.isDocumentVisible) {
        stopAnimation("paused-document-hidden");
        runtime.renderer.render(runtime.scene, runtime.camera);
        return;
      }

      if (!state.isVisible) {
        stopAnimation("paused-offscreen");
        runtime.renderer.render(runtime.scene, runtime.camera);
        return;
      }

      startAnimation();
    }

    function disposeRuntime(reason: string): void {
      if (state.disposed) {
        return;
      }

      state.disposed = true;
      stopAnimation("disposed");
      host.dataset.hero3dDisposeReason = reason;

      state.abortController.abort();
      state.resizeObserver?.disconnect();
      state.intersectionObserver?.disconnect();

      disposeObject3D(scene);
      state.renderer?.dispose();

      viewer?.replaceChildren();
      delete host.dataset.hero3dInitialized;
      delete host.dataset.hero3dRequested;
      delete host.dataset.hero3dLoadDuration;
      host.dataset.hero3dState = "deferred";
      host.classList.remove("is-loading", "is-three-ready");
    }

    document.addEventListener(
      "visibilitychange",
      () => {
        state.isDocumentVisible = document.visibilityState === "visible";
        syncAnimationState();
      },
      {
        signal: state.abortController.signal
      }
    );

    state.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        state.isVisible = Boolean(entry?.isIntersecting);
        syncAnimationState();
      },
      {
        root: null,
        threshold: 0.05
      }
    );

    state.intersectionObserver.observe(stage);

    reducedMotionQuery.addEventListener(
      "change",
      (event: MediaQueryListEvent) => {
        runtime.reducedMotion = event.matches;
        syncAnimationState();
      },
      {
        signal: state.abortController.signal
      }
    );

    const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleThemeChange = () => applyTheme(host);

    window.addEventListener("themechange", handleThemeChange, {
      signal: state.abortController.signal
    });

    colorSchemeQuery.addEventListener("change", handleThemeChange, {
      signal: state.abortController.signal
    });

    applyTheme(host);

    resizeRuntime(runtime);

    state.resizeObserver = new ResizeObserver(() => resizeRuntime(runtime));
    state.resizeObserver.observe(stage);

    renderer.domElement.addEventListener(
      "webglcontextlost",
      (event: Event) => {
        const labels = getHeroLabels(host);
        event.preventDefault();
        state.contextLost = true;
        stopAnimation("paused-context-lost");
        showFallback(
          host,
          "webgl-context-lost",
          labels.heroContextLostLog
        );
      },
      {
        signal: state.abortController.signal
      }
    );

    renderer.domElement.addEventListener(
      "webglcontextrestored",
      () => {
        if (state.disposed) {
          return;
        }

        state.contextLost = false;
        applyTheme(host);
        resizeRuntime(runtime);

        host.dataset.fallback = "false";
        host.dataset.hero3dState = "ready";
        delete host.dataset.hero3dFallbackReason;
        host.classList.remove("is-loading", "is-fallback");
        host.classList.add("is-three-ready");

        syncAnimationState();
      },
      {
        signal: state.abortController.signal
      }
    );

    host.dataset.fallback = "false";
    host.dataset.hero3dLogoMode =
      "source-texture-fidelity";
    host.dataset.hero3dState = "ready";
    delete host.dataset.hero3dFallbackReason;
    host.classList.remove("is-loading", "is-fallback");
    host.classList.add("is-three-ready");

    syncAnimationState();

    window.addEventListener(
      "pagehide",
      () => {
        disposeRuntime("pagehide");
      },
      {
        once: true,
        signal: state.abortController.signal
      }
    );
  } catch (error) {
    if (state.animationFrameId !== null) {
      window.cancelAnimationFrame(state.animationFrameId);
    }

    state.abortController.abort();
    state.resizeObserver?.disconnect();
    state.intersectionObserver?.disconnect();
    state.disposed = true;

    if (sceneToDispose) {
      disposeObject3D(sceneToDispose);
    }

    state.renderer?.dispose();

    viewer.replaceChildren();
    host.dataset.hero3dAnimationState = "disposed";

    showFallback(
      host,
      "runtime-error",
      error instanceof Error ? error.message : getHeroLabels(host).heroUnexpectedErrorLog
    );
  
  }

}
