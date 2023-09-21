const modelViewerColor = document.querySelector("model-viewer#bottle");
modelViewerColor.src = 'garrafa_gocase_950ml.glb'
const createAndApplyTexture = async (channel, event) => {
  let texture = await modelViewerColor.createTexture(event);
  material = modelViewerColor.model.materials.find((material) => material.name === 'Estampa');
  material.pbrMetallicRoughness[channel].setTexture(texture);
};

function bottleSelected(glb) {
  modelViewerColor.src = glb
}

modelViewerColor.addEventListener("load", () => {
  modelViewerColor.animationName = 'abrirTampa'

  createAndApplyTexture(
    "baseColorTexture",
    "estampas-compress/mundo_magico-min.png"
  );

  document
    .getElementById("colorPicker")
    .addEventListener("input", function (event) {
      colorSelected(event.target.value);
    });
});

modelViewerColor.addEventListener("camera-change", () => {
  let maxTime = 1320
  let phi = modelViewerColor.getCameraOrbit().phi
  let time = 0;

  const phiMax = 1.1;
  let proportion = 1 - phi / phiMax;
  time = proportion * maxTime;
  time = Math.round(time) / 1000;
  if(time > 0)
    modelViewerColor.currentTime =  time
});

modelViewerColor.addEventListener("finished", () => {
 console.log("modelViewerColor finished")
});

function selectMaterials(names = []) {
  if (!modelViewerColor?.model?.materials)
    return []

  const materials = modelViewerColor.model.materials;
  const selectedMaterials = [];
  for (const name of names) {
    const material = materials.find((material) => material.name === name);
    if (material != null) {
      selectedMaterials.push(material);
    }
  }
  return selectedMaterials;
}

function bottleMaterial() {
  return this.selectMaterials(["MaterialCorpo", "Borracha"]);
}

function bottleCapMaterial() {
  return this.selectMaterials([
    "MaterialTampaBaixo",
    "MaterialTampaCima",
    "MaterialAlca",
    "MaterialBaseTampaCima",
    "Metal_Pino",
    "MaterialBaseTampaCima.001"
  ]);
}

function colorSelected(colorString) {
  // for bottle material
  bottleMaterial().forEach((material) => {
    material.pbrMetallicRoughness.setBaseColorFactor(colorString);
  });

  // for botte cap
  bottleCapMaterial().forEach((material) => {
    material.pbrMetallicRoughness.setBaseColorFactor(colorString);
  });
}
