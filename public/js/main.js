// app.js
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

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
document.getElementById("container3D").appendChild(renderer.domElement);

// Lights
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.0));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// GLTF Loader
const loader = new GLTFLoader();
let mixer;
const clock = new THREE.Clock();
let model; // store loaded model for custom animation
let t = 0; // time counter for bobbing

loader.load(
  "./models/cube/scene.gltf", // <- all files in cube folder
  (gltf) => {
    model = gltf.scene;
    scene.add(model);

    // Center & scale the model
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Reposition so model is centered at origin
    model.position.sub(center);

    // Make it slightly bigger
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 3.2 / maxDim; // increased from 2.5
    model.scale.setScalar(scale);

    // Move model a bit upward
    model.position.y += 0.5; 

    // Re-frame camera
    const fov = camera.fov * (Math.PI / 180);
    let camZ = Math.abs((maxDim * scale) / 2 / Math.tan(fov / 2));
    camZ *= 1.5;
    camera.position.set(0, (size.y * scale) / 4, camZ);
    controls.target.set(0, 0, 0);
    controls.update();

    // Debug helper (green wireframe box) to see where model is
    // const helper = new THREE.Box3Helper(
    //   new THREE.Box3().setFromObject(model),
    //   0x00ff00
    // );
    // scene.add(helper);
    // setTimeout(() => scene.remove(helper), 3000);

    // Play first animation if exists
    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    }

    console.log("✅ Model loaded and added to scene");
  },
  (xhr) => {
    console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`);
  },
  (err) => {
    console.error("Error loading model:", err);
  }
);

// Animate
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (mixer) {
    // Run model's built-in animations if available
    mixer.update(delta);
  } else if (model) {
    // Custom animation: rotate + bob
    t += delta;
    model.rotation.y += 0.5 * delta; // slow spin
    model.position.y += Math.sin(t * 2) * 0.005; // gentle up/down bob (smaller offset since we moved it up)
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
