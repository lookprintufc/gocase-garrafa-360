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
  let hasParamStamp = false
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.forEach((value, key) => {
    if (key === 'stamp') {
      hasParamStamp = true
      createAndApplyTexture('baseColorTexture', value);
    }
  });

  modelViewerColor.animationName = 'abrirTampa'

  if(!hasParamStamp) {
    createAndApplyTexture(
      "baseColorTexture",
      "estampas-compress/mundo_magico-min.png"
    );
  }

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

async function spin360(changeColor=false) {
  let blobs = [];
  let currentDegree = 0;
  const increment = 30;

  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      currentDegree += increment;
      let urlBlob = generateBlob(); // Aguarde até que o blob seja gerado
      blobs.push(urlBlob);

      if(changeColor) {
        if (currentDegree >= 0 && currentDegree < 120) {
          colorSelected('#e8e8e8')
        } else if (currentDegree >= 120 && currentDegree < 240) {
          colorSelected('#BDE9C9')
        } else if (currentDegree >= 240 && currentDegree < 360) {
          colorSelected('#F5CABF')
        }
      }
        

      if (currentDegree >= 340) {
        clearInterval(intervalId);
        currentDegree = 0;

        resolve(blobs); // Resolve a promise quando todos os blobs forem gerados
      }

      const [_, pitch, radius] = modelViewerColor.cameraOrbit.split(" ");
      modelViewerColor.cameraOrbit = `${currentDegree}deg ${pitch} ${radius}`;
    }, 60);
  });
}

async function downloadPrint() {
  const url = await generateBlob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(url);
  a.target = "_blank";
  a.click();
}

function generateBlob() {
  return modelViewerColor.toBlob({ mimeType: "image/png" });
}

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
