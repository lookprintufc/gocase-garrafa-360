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
      console.log(modelViewerColor.model.materials)
      material = modelViewerColor.model.materials[3];
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

  modelViewerColor.addEventListener("camera-change", (e) => {
    // console.log(modelViewerColor.getCameraOrbit())
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
    }, 100);
  });
}

function interpolateScale(windowWidth) {
  const x1 = 1300;
  const y1 = 0.7450692746536267;
  const x2 = 360;
  const y2 = 0.4150692746536267;

  // Interpolação linear
  const scale = y1 + (windowWidth - x1) * (y2 - y1) / (x2 - x1);

  // Limitar o fator de escala entre 0 e 1
  return Math.min(Math.max(scale, 0), 1);
}

function generateGif() {
  // Uso da função
  spin360(true).then((blobs) => {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: "gifjs/dist/gif.worker.js",
    });

    const loadImages = blobs.map(async (blob) => {
      let url = await blob;
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(url);
        img.onload = () => {
          // Tamanho fixo do canvas
          const canvasSize = 1000;

          const windowWidth = window.innerWidth || 390; // fallback para 390 se indisponível
          const scale = interpolateScale(windowWidth);
        
          const newWidth = img.width * scale;
          const newHeight = img.height * scale;
          // Crie um canvas temporário para desenhar o fundo branco e a imagem
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Defina o tamanho do canvas para 1000x1000
          canvas.width = canvasSize;
          canvas.height = canvasSize;

          // Desenhe um retângulo branco para servir como fundo
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvasSize, canvasSize);

          // Calcule a posição x e y para desenhar a imagem no meio do canvas
          const xPos = (canvasSize - newWidth) / 2;
          const yPos = (canvasSize - newHeight) / 2;

          // Desenhe a imagem redimensionada no meio do fundo branco
          ctx.drawImage(img, xPos, yPos, newWidth, newHeight);

          // Agora você pode adicionar esse canvas como um frame no seu GIF
          gif.addFrame(canvas, { delay: 300 }); // Suponha um atraso de 300 ms
          resolve();
        };
        img.onerror = reject;
      });

    });

    Promise.all(loadImages)
      .then(() => {
        console.log(
          "Todas as imagens carregadas, iniciando a renderização do GIF..."
        );

        gif.on("progress", (p) => {
          console.log(`Progresso: ${Math.round(p * 100)}%`);
        });

        gif.on("finished", (blob) => {
          const gifUrl = URL.createObjectURL(blob);
          window.open(gifUrl); // Abre o GIF em uma nova aba
        });

        gif.render();
      })
      .catch((err) => {
        console.error("Erro ao carregar uma ou mais imagens:", err);
      });
  });
}

function details() {
  const orbitCycle = [
    "45deg 55deg 4m",
    "-60deg 110deg 2m",
    modelViewerColor.cameraOrbit,
  ];

  setTimeout(() => (modelViewerColor.cameraOrbit = orbitCycle[0]), 1000);
  setTimeout(() => (modelViewerColor.cameraOrbit = orbitCycle[1]), 4000);
  setTimeout(() => (modelViewerColor.cameraOrbit = orbitCycle[2]), 7000);
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
  return this.selectMaterials(["MaterialCorpo", "Borracha"]);
}

function bottleCapMaterial() {
  return this.selectMaterials([
    "MaterialTampaBaixo",
    "MaterialTampaCima",
    "Default",
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
