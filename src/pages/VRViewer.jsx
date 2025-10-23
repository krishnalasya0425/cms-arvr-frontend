// import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function VRViewer() {
  const [searchParams] = useSearchParams();
  const fileId = searchParams.get("file");
  const fileType = searchParams.get("type"); // pass ?type=glb or obj

  useEffect(() => {
    if (!fileId) return;
    const scene = document.querySelector("a-scene");
    const model = document.createElement("a-entity");

    const modelUrl = `http://localhost:5000/api/projects/file/${fileId}`;

    // ✅ Load model based on fileType
    if (fileType === "glb" || fileType === "gltf") {
      model.setAttribute("gltf-model", modelUrl);
    } else if (fileType === "obj") {
      model.setAttribute("obj-model", `obj: ${modelUrl}`);
    } else {
      console.warn("⚠️ Unsupported model format");
    }

    model.setAttribute("position", "0 0 -3");
    model.setAttribute("rotation", "0 180 0");
    model.setAttribute("scale", "1 1 1");
    scene.appendChild(model);

    // ✅ Auto-enter VR once scene is ready
    scene.addEventListener("loaded", () => {
      document.getElementById("loading")?.remove();
      scene.enterVR();
    });
  }, [fileId, fileType]);

  return (
    <div style={{ height: "100vh", width: "100vw", background: "#000" }}>
      <div
        id="loading"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#000",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.2rem",
          zIndex: 10,
        }}
      >
        Loading model for VR...
      </div>

      <a-scene
        vr-mode-ui="enabled: true"
        renderer="colorManagement: true;"
        embedded={false}
      >
        {/* ✅ Lighting */}
        <a-entity light="type: ambient; intensity: 1"></a-entity>
        <a-entity
          light="type: directional; intensity: 1"
          position="1 1 1"
        ></a-entity>

        {/* ✅ Camera */}
        <a-entity position="0 1.6 0">
          <a-camera wasd-controls look-controls></a-camera>
        </a-entity>
      </a-scene>
    </div>
  );
}
