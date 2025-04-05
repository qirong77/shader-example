import { scene, THREE } from "../common/main";

const geometry = new THREE.PlaneGeometry(5, 5);
const material = new THREE.MeshBasicMaterial({
    color: 'gray',
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, -1);
scene.add(mesh);
