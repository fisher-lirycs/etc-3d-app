import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer();
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const loader = new GLTFLoader();
let model;
loader.load(
  "audi_rs5_coupe.glb",
  (gltf) => {
    model = gltf.scene;
    model.scale.set(70, 70, 70);
    model.position.set(0, 0, 0);
    scene.add(model);
  },
  (xhr) => {
    console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`);
  },
  (error) => {
    console.error("Error", error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}
animate();

document.addEventListener("wheel", (event) => {
  const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
  model.scale.multiplyScalar(scaleFactor);
});


let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

document.addEventListener("mousedown", (event) => {
  isDragging = true;
  previousMouseX = event.clientX;
  previousMouseY = event.clientY;
});

document.addEventListener("mousemove", (event) => {
  if (!isDragging || !model) return;
  let deltaX = event.clientX - previousMouseX;
  let deltaY = event.clientY - previousMouseY;

  model.rotation.y += deltaX * 0.01;
  model.rotation.x += deltaY * 0.01;

  previousMouseX = event.clientX;
  previousMouseY = event.clientY;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});