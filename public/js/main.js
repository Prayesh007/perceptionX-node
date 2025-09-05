// // ------------------------------------------------------------
// // app.js
// import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
// import { RGBELoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js";

// // Postprocessing
// import { EffectComposer } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/RenderPass.js";
// import { UnrealBloomPass } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/UnrealBloomPass.js";

// const scene = new THREE.Scene();

// // Camera
// const camera = new THREE.PerspectiveCamera(
//   60,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   2000
// );
// camera.position.set(0, 1, 6);

// // Renderer
// const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1.5;
// document.getElementById("container3D").appendChild(renderer.domElement);

// // Composer for postprocessing
// const composer = new EffectComposer(renderer);
// composer.addPass(new RenderPass(scene, camera));

// // Bloom effect
// const bloomPass = new UnrealBloomPass(
//   new THREE.Vector2(window.innerWidth, window.innerHeight),
//   1.2, // strength
//   0.6, // radius
//   0.0  // threshold
// );
// composer.addPass(bloomPass);

// // HDRI Environment
// new RGBELoader()
//   .setPath("https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/")
//   .load("studio_small_08_1k.hdr", function (texture) {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     scene.environment = texture;
//   });

// // Lights
// const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
// dirLight.position.set(5, 10, 7);
// scene.add(dirLight);

// // Controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// // GLTF Loader
// const loader = new GLTFLoader();
// let mixer;
// const clock = new THREE.Clock();
// let model;
// let t = 0;

// loader.load(
//   "./models/cube/scene.gltf",
//   (gltf) => {
//     model = gltf.scene;
//     scene.add(model);

//     // --- Adjust reflections ---
//     model.traverse((child) => {
//       if (child.isMesh && child.material) {
//         child.material.roughness = 0.5;
//         child.material.metalness = 0.1;
//         child.material.needsUpdate = true;
//       }
//     });

//     // Center & scale
//     const box = new THREE.Box3().setFromObject(model);
//     const size = new THREE.Vector3();
//     box.getSize(size);
//     const center = new THREE.Vector3();
//     box.getCenter(center);

//     model.position.sub(center);

//     const maxDim = Math.max(size.x, size.y, size.z);

//     // 🔹 Responsive scaling
//     const scale = window.innerWidth < 800 ? 1.7 / maxDim : 2.5 / maxDim;
//     model.scale.setScalar(scale);

//     model.position.y += 0.2;

//     // Keep camera at a good distance
//     camera.position.set(0, 1, 6);
//     controls.target.set(0, 0, 0);
//     controls.update();

//     if (gltf.animations.length) {
//       mixer = new THREE.AnimationMixer(model);
//       const action = mixer.clipAction(gltf.animations[0]);
//       action.play();
//     }

//     console.log(`✅ Model loaded with scale ${scale.toFixed(2)}`);
//   },
//   (xhr) => console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`),
//   (err) => console.error("Error loading model:", err)
// );

// // Animate
// function animate() {
//   requestAnimationFrame(animate);
//   const delta = clock.getDelta();

//   if (mixer) {
//     mixer.update(delta);
//   } else if (model) {
//     t += delta;
//     model.rotation.y += 0.5 * delta;
//     model.position.y += Math.sin(t * 2) * 0.005;
//   }

//   controls.update();
//   composer.render(); // use composer instead of renderer
// }
// animate();

// // Resize
// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   composer.setSize(window.innerWidth, window.innerHeight);
// });



// --------------------------------------------------


// ------------------------------------------------------------
// app.js
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js";

// Postprocessing
import { EffectComposer } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/UnrealBloomPass.js";

const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.set(0, 1, 6);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
document.getElementById("container3D").appendChild(renderer.domElement);

// Composer for postprocessing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// Bloom effect
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.2, // strength
  0.6, // radius
  0.0  // threshold
);
composer.addPass(bloomPass);

// HDRI Environment
new RGBELoader()
  .setPath("https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/")
  .load("studio_small_08_1k.hdr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.environment.intensity = 0.3; // 🔹 reduce reflection intensity globally
  });

// Lights
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableRotate = false; // disable manual orbit rotation
controls.enableZoom = false;   // 🔹 disable zoom (scroll + pinch)
controls.minDistance = camera.position.length();
controls.maxDistance = camera.position.length();

// GLTF Loader
const loader = new GLTFLoader();
let mixer;
const clock = new THREE.Clock();
let model;

// mouse rotation variables
let targetRotationX = 0;
let targetRotationY = 0;

let currentRotationX = 0;
let currentRotationY = 0;

// sensitivity factor (higher = more sensitive)
const sensitivity = Math.PI * 1.25; // ~135 degrees

// listen for mouse movement
document.addEventListener("mousemove", (event) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = (event.clientY / window.innerHeight) * 2 - 1;

  targetRotationY = mouseX * sensitivity; // left-right
  targetRotationX = mouseY * sensitivity; // up-down
});

loader.load(
  "./models/cube/scene.gltf",
  (gltf) => {
    model = gltf.scene;
    scene.add(model);

    model.traverse((child) => {
      if (child.isMesh && child.material) {
        // 🔹 Softer reflections
        child.material.roughness = 0.8;   // more matte
        child.material.metalness = 0.02;  // very low reflection
        child.material.envMapIntensity = 0.3; // HDRI effect toned down
        child.material.needsUpdate = true;
      }
    });

    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    model.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = window.innerWidth < 800 ? 1.7 / maxDim : 2.5 / maxDim;
    model.scale.setScalar(scale);

    model.position.y += 0.2;

    camera.position.set(0, 1, 6);
    controls.target.set(0, 0, 0);
    controls.update();

    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    }

    console.log(`✅ Model loaded with scale ${scale.toFixed(2)}`);
  },
  (xhr) => console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`),
  (err) => console.error("Error loading model:", err)
);

// Animate
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (mixer) {
    mixer.update(delta);
  }

  if (model) {
    // smooth interpolation
    currentRotationX += (targetRotationX - currentRotationX) * 0.08;
    currentRotationY += (targetRotationY - currentRotationY) * 0.08;

    model.rotation.x = currentRotationX;
    model.rotation.y = currentRotationY;
  }

  controls.update();
  composer.render();
}
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});
