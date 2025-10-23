import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function FBXViewer({ fileUrl }) {
  const mountRef = useRef();

  useEffect(() => {
    if (!fileUrl) return;

    const mount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      5000
    );
    camera.position.set(0, 100, 250);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lights
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 1);
    scene.add(light1);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    // Load model
    const ext = fileUrl.split(".").pop().toLowerCase();
    if (ext === "fbx") {
      const loader = new FBXLoader();
      fetch(fileUrl)
        .then((res) => res.arrayBuffer())
        .then((data) => {
          loader.parse(data, "", (object) => {
            // Auto-center and scale
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            object.position.sub(center);

            const size = box.getSize(new THREE.Vector3()).length();
            camera.position.set(0, size / 2, size * 1.5);
            controls.target.copy(center);

            object.scale.setScalar(0.5);
            scene.add(object);
          });
        })
        .catch((err) => console.error("FBX fetch/parse error:", err));
    } else if (ext === "glb" || ext === "gltf") {
      const loader = new GLTFLoader();
      loader.load(
        fileUrl,
        (gltf) => {
          const object = gltf.scene;

          // Auto-center and scale
          const box = new THREE.Box3().setFromObject(object);
          const center = box.getCenter(new THREE.Vector3());
          object.position.sub(center);

          const size = box.getSize(new THREE.Vector3()).length();
          camera.position.set(0, size / 2, size * 1.5);
          controls.target.copy(center);

          object.scale.setScalar(1);
          scene.add(object);
        },
        undefined,
        (err) => console.error("GLB/GLTF load error:", err)
      );
    }

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [fileUrl]);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
    />
  );
}
