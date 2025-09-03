// // Import the THREE.js library
// import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// // To allow for the camera to move around the scene
// import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// // To allow for importing the .gltf file
// import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// // Create a Three.JS Scene
// const scene = new THREE.Scene();
// // Create a new camera with positions and angles
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// // Set which object to render
// // You can change 'cube' to the name of the folder containing your new model
// let objToRender = 'cube';

// // Keep the 3D object on a global variable so we can access it later
// let object;

// // OrbitControls allow the camera to move around the scene
// let controls;

// // Variables to handle animation
// let mixer; // This will play the animations from the GLTF file
// const clock = new THREE.Clock(); // This will track time for smooth animation updates

// // Instantiate a loader for the .gltf file
// const loader = new GLTFLoader();

// // Load the file
// loader.load(
//     `./models/${objToRender}/scene.gltf`,
//     function (gltf) {
//         // If the file is loaded, add it to the scene
//         object = gltf.scene;
//         // Scale down the object to make it much smaller
//         object.scale.set(0.05, 0.05, 0.05);
//         scene.add(object);

//         // Check if the loaded model has any animations
//         if (gltf.animations && gltf.animations.length) {
//             mixer = new THREE.AnimationMixer(object);
//             // Iterate over all animation clips and play them
//             gltf.animations.forEach((clip) => {
//                 mixer.clipAction(clip).play();
//             });
//         }
//     },
//     function (xhr) {
//         // While it is loading, log the progress
//         console.log(`Loading model: ${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`);
//     },
//     function (error) {
//         // If there is an error, log it
//         console.error("An error occurred loading the GLTF model:", error);
//     }
// );

// // Instantiate a new renderer and set its size
// const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Enable alpha for a transparent background
// renderer.setSize(window.innerWidth, window.innerHeight);

// // Add the renderer to the DOM
// document.getElementById("container3D").appendChild(renderer.domElement);

// // Set how far the camera will be from the 3D model
// // We've adjusted this value to prevent the cube from being too big at the start
// camera.position.z = 25; 

// // The background is now handled by the renderer's alpha property, making the canvas transparent
// // and allowing the HTML/CSS background to show through.

// // Add lights to the scene for better visibility of the details
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
// directionalLight1.position.set(10, 10, 10);
// scene.add(directionalLight1);

// const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
// directionalLight2.position.set(-10, -10, -10);
// scene.add(directionalLight2);


// // This adds controls to the camera, so we can rotate / zoom it with the mouse
// controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // Provides a smoother, more natural feel
// controls.dampingFactor = 0.25;
// controls.maxDistance = 50; // Prevents the user from zooming in too far
// controls.minDistance = 20; // Prevents the user from zooming out too far

// // Render the scene
// function animate() {
//     requestAnimationFrame(animate);

//     // Update the animation mixer with the time elapsed since the last frame
//     const delta = clock.getDelta();
//     if (mixer) {
//         mixer.update(delta);
//     }
//     
//     // Update the orbit controls
//     controls.update();

//     // Render the scene with the standard renderer
//     renderer.render(scene, camera);
// }

// // Add a listener to the window, so we can resize the window and the camera
// window.addEventListener("resize", function () {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });

// // Start the 3D rendering
// animate();





// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();
// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Set which object to render
// You can change 'cube' to the name of the folder containing your new model
let objToRender = 'cube';

// Keep the 3D object on a global variable so we can access it later
let object;

// OrbitControls allow the camera to move around the scene
let controls;

// Variables to handle animation
let mixer; // This will play the animations from the GLTF file
const clock = new THREE.Clock(); // This will track time for smooth animation updates

// Variables for mouse rotation
let mouseX = 0;
let mouseY = 0;
let targetRotationY = 0;
let targetRotationX = 0;

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the file
loader.load(
    `./models/${objToRender}/scene.gltf`,
    function (gltf) {
        // If the file is loaded, add it to the scene
        object = gltf.scene;
        // Scale down the object to make it much smaller
        object.scale.set(0.05, 0.05, 0.05);
        scene.add(object);

        // Check if the loaded model has any animations
        if (gltf.animations && gltf.animations.length) {
            mixer = new THREE.AnimationMixer(object);
            // Iterate over all animation clips and play them
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
        }
    },
    function (xhr) {
        // While it is loading, log the progress
        console.log(`Loading model: ${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`);
    },
    function (error) {
        // If there is an error, log it
        console.error("An error occurred loading the GLTF model:", error);
    }
);

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Enable alpha for a transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

// Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// Set how far the camera will be from the 3D model
// We've adjusted this value to prevent the cube from being too big at the start
camera.position.z = 25; 

// The background is now handled by the renderer's alpha property, making the canvas transparent
// and allowing the HTML/CSS background to show through.

// Add lights to the scene for better visibility of the details
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight1.position.set(10, 10, 10);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-10, -10, -10);
scene.add(directionalLight2);


// This adds controls to the camera, so we can rotate / zoom it with the mouse
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Provides a smoother, more natural feel
controls.dampingFactor = 0.25;
controls.maxDistance = 50; // Prevents the user from zooming in too far
controls.minDistance = 20; // Prevents the user from zooming out too far
controls.enableRotate = false; // Disable OrbitControls rotation to use mouse movement

// Add mousemove listener to update the target rotation
document.addEventListener('mousemove', (event) => {
    // Normalize mouse coordinates to a range of -1 to 1
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Set the target rotation based on mouse position
    targetRotationY = mouseX * (Math.PI / 2); // Adjusting the sensitivity of Y rotation
    targetRotationX = mouseY * (Math.PI / 2); // Adjusting the sensitivity of X rotation
});

// Render the scene
function animate() {
    requestAnimationFrame(animate);

    // Update the animation mixer with the time elapsed since the last frame
    const delta = clock.getDelta();
    if (mixer) {
        mixer.update(delta);
    }
    
    // Smoothly rotate the object towards the target rotation
    if (object) {
        object.rotation.y += (targetRotationY - object.rotation.y) * 0.05;
        object.rotation.x += (targetRotationX - object.rotation.x) * 0.05;
    }

    // Update the orbit controls (for zooming and panning)
    controls.update();

    // Render the scene with the standard renderer
    renderer.render(scene, camera);
}

// Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the 3D rendering
animate();

