const modelViewerColor = document.querySelector("model-viewer#bottle");
const createAndApplyTexture = async (channel, event, text = "") => {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  let img = new Image();
  img.src = event;

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    ctx.font = "90px Great Vibes";
    ctx.fillStyle = "#AE2965";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    var x = canvas.width / 2;
    var y = canvas.height / 2;

    ctx.fillText(text, x, y);

    canvas.toBlob(async (blob) => {
      const texture = await modelViewerColor.createTexture(
        URL.createObjectURL(blob)
      );
      material = modelViewerColor.model.materials[11];
      material.pbrMetallicRoughness[channel].setTexture(texture);
    }, "image/png");
  };
  // material[channel].setTexture(texture);
};

modelViewerColor.addEventListener("load", () => {
  const changeColor = (event) => {
    const material = modelViewerColor.materialFromPoint(
      event.clientX,
      event.clientY
    );
    if (material != null) {
      console.log(material.name);
      material.pbrMetallicRoughness.setBaseColorFactor([
        Math.random(),
        Math.random(),
        Math.random(),
      ]);
    }
  };

  // modelViewerColor.addEventListener("click", changeColor);
  createAndApplyTexture(
    "baseColorTexture",
    "estampas-compress/mundo mágico-min.png"
  );

  //
  document
    .getElementById("colorPicker")
    .addEventListener("input", function (event) {
      const colorCircle = document.getElementById("colorCircle");
      colorSelected(event.target.value);
    });
});

function textoTeste(event) {
  let text = document.getElementById("teste");
  createAndApplyTexture(
    "baseColorTexture",
    "estampas-compress/corações flutuantes-min.png",
    text.value
  );
}

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
  return this.selectMaterials(["Textura garrafa", "Material.004"]);
}

function bottleCapMaterial() {
  return this.selectMaterials([
    "tampa boca",
    "anel ",
    "onda",
    "logo cima",
    "textura tampa 2",
    "peça tampa",
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
