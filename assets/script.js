const modelViewerColor = document.querySelector("model-viewer#bottle");
const createAndApplyTexture = async (channel, event) => {
  let texture = await modelViewerColor.createTexture(event);
  material = modelViewerColor.model.materials[3];
  material.pbrMetallicRoughness[channel].setTexture(texture);
};

modelViewerColor.addEventListener("load", () => {
  createAndApplyTexture(
    "baseColorTexture",
    "estampas-compress/mundo_magico-min.png"
  );

  document
    .getElementById("colorPicker")
    .addEventListener("input", function (event) {
      const colorCircle = document.getElementById("colorCircle");
      colorSelected(event.target.value);
    });
});

function selectMaterials(names = []) {
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
    "MaterialBaseTampaCima"
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
