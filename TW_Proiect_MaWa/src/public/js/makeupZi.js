const chartSelect = document.getElementById("chart-select");

chartSelect.addEventListener("change", function() {
  const selectedOption = chartSelect.options[chartSelect.selectedIndex];
  const selectedURL = selectedOption.value;
  window.location.href = selectedURL;
});


// convertire catre csv
const convertToCSV = (chartData) => {
  const header = Object.keys(chartData[0]).join(",");
  const rows = chartData.map(data => Object.values(data).join(","));
  return header + "\n" + rows.join("\n");
};

// start descarcare
const downloadCSV = (csvData, fileName) => {
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};



// Attach click event listener to the export button
const exportButtonCSV = document.getElementById("exportButtonCSV");
exportButtonCSV.addEventListener("click", async () => {
  // preiau datele de la fiecare chart
  const chartData1 = await getLineChartData();
  const chartData2 = await getLineChartData1();
  const chartData3 = await getLineChartData2();
  const chartData4 = await getLineChartData3();

  // convertire ptr fiecare din charturi
  const csvData1 = convertToCSV(chartData1);
  const csvData2 = convertToCSV(chartData2);
  const csvData3 = convertToCSV(chartData3);
  const csvData4 = convertToCSV(chartData4);

  // combin datele 
  const combinedCSVData = csvData1 + "\n\n" + csvData2 + "\n\n" + csvData3 + "\n\n" + csvData4;


  const fileName = "LineCharts_data.csv";
  downloadCSV(combinedCSVData, fileName);
});


// convertire la JSON
const convertToJSON = (chartData) => {
  return JSON.stringify(chartData);
};

// start descarcare
const downloadJSON = (jsonData, fileName) => {
  const blob = new Blob([jsonData], { type: "application/json;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};



// event listener ptr buton
const exportButtonJSON = document.getElementById("exportButtonJSON");
exportButtonJSON.addEventListener("click", async () => {
  // date ptr fiecare chart
  const chartData1 = await getLineChartData();
  const chartData2 = await getLineChartData1();
  const chartData3 = await getLineChartData2();
  const chartData4 = await getLineChartData3();

  // convertire ptr datele din fiecare chart
  const jsonData1 = convertToJSON(chartData1);
  const jsonData2 = convertToJSON(chartData2);
  const jsonData3 = convertToJSON(chartData3);
  const jsonData4 = convertToJSON(chartData4);

  // combinare date
  const combinedJSONData = {
    chart1: JSON.parse(jsonData1),
    chart2: JSON.parse(jsonData2),
    chart3: JSON.parse(jsonData3),
    chart4: JSON.parse(jsonData4)
  };


  const fileName = "LineCharts_data.json";
  downloadJSON(JSON.stringify(combinedJSONData), fileName);
});



const getLineChartData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3000/api/campaniiNationale`, {
      method: "GET",
    });
    const result = await response.json();
    return result;
  };

  const getLineChartData1 = async () => {
    const response = await fetch(`http://localhost:3000/api/activitatiPrevenire`, {
      method: "GET",
    });
    const result = await response.json();
    return result;
  };
  const getLineChartData2 = async () => {
    const response = await fetch(`http://localhost:3000/api/proiecteNationale`, {
      method: "GET",
    });
    const result = await response.json();
    return result;
  };
  const getLineChartData3 = async () => {
    const response = await fetch(`http://localhost:3000/api/confiscariDroguri`, {
      method: "GET",
    });
    const result = await response.json(); 
    return result;
  };
let drog = "2C-X";
let publicData = "In mediul prescolar";
let an = 2022;
let genData = [];
let chart1 = {};
let varstaData = [];
let chart2 = {};
let chart3 = {};
let locatie = [];

let trat=[];
let chart4={};

const renderPie = async (data1,data2,data3,data4) => {
    const ctx1 = document.getElementById("campaniiNationaleChart");
    const ctx2 = document.getElementById("activitatiPrevenireChart");
    const ctx3 = document.getElementById("proiecteNationaleChart");
    const ctx4=document.getElementById("confiscariChart");
     console.log('aici')
    // Diagrama pentru `http://localhost:3000/api/campaniiNationale`
    const labels3 = ["Fii liber", "Renunti si castigi", "Zile de prevenire"];
    const values3 = [data1.fii_liber, data1.renunti_si_castigi, data1.zile_de_prevenire];
    const colors3 = ["#C48143","#C48143","#C48143"];
  
    chart1 = new Chart(ctx1, {
      type: "line",
      data: {
        labels: labels3,
        datasets: [
          {
            data: values3,
            backgroundColor: colors3,
            borderColor: '#C48143'
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
          position: "bottom",
          labels: {
            fontFamily: "Trebuchet MS",
            fontSize: 12,
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Campaniile nationale din 2022",
            fontFamily: "Trebuchet MS",
            fontSize: 16,
            position: "top",
          },
        },
        scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Campaniile", 
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "Nr de beneficiari", 
              },
            },
          },
      },
    });
    // Diagrama pentru `http://localhost:3000/api/activitatiPrevenire`
    const labels4 = ["Nr activitati", "Nr copii", "Nr parinti", "Nr cadre didactive"];
    const values4 = [
        data2.nr_activitati,
        data2.nr_copii,
        data2.nr_parinti,
        data2.nr_cadre_didactice,
      ];
      const colors4 = [
        "#31356E"
      ];
       chart2 = new Chart(ctx2, {
        type: "line",
        data: {
          labels: labels4,
          datasets: [
            {
              data: values4,
              backgroundColor: colors4,
              borderColor: '#31356E'
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true,
            position: "bottom",
            labels: {
              fontFamily: "Trebuchet MS",
              fontSize: 12,
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Activitati de prevenire a consumului de droguri",
              fontFamily: "Trebuchet MS",
              fontSize: 16,
              position: "top",
            },
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Nr activitati si publicul",
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "Numerele",
              },
            },
          },
        },
      });
    // Diagrama pentru `http://localhost:3000/api/proiecteNationale`
    const labels5 = ["Adresat prescolarilor", "Adresat claselor primare", "Adresat gimnaziului", "Gimnaziu si liceu", "Adresat parintilor"];
    const values5 = [
        data3.adresat_prescolarilor,
        data3.nivel_primar,
        data3.nivel_gimnazial,
        data3.nivel_liceal,
        data3.nivel_gimnazial_si_liceal,
        data3.adresat_parintilor
        
      ];
      const colors5 = ["#0e4d1c"];
      chart3 = new Chart(ctx3, {
        type: "line",
        data: {
          labels: labels5,
          datasets: [
            {
              data: values5,
              backgroundColor: colors5,
              borderColor: '#0e4d1c'
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true,
            position: "bottom",
            labels: {
              fontFamily: "Trebuchet MS",
              fontSize: 12,
            },
          }, plugins: {
            title: {
              display: true,
              text: "Proiecte nationale in functie de publicul tinta",
              fontFamily: "Trebuchet MS",
              fontSize: 16,
              position: "top",
            },
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Publicul", 
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "Numerele",
              },
            },
          },
        },
      });
      console.log('vine')

      // Diagrama pentru `http://localhost:3000/api/confiscariDroguri`
      const labels6 = ["Grame", "Comprimate", "Doze/Buc", "Mililitri", "Nr capturi"];
      const values6 = [
        data4.grame,
        data4.comprimate,
        data4.doze_buc,
        data4.mililitri,
        data4.nr_capturi
      ];

      const colors6 = ["#895273"];
      chart4= new Chart(ctx4, {
        type: "line",
        data: {
          labels: labels6,
          datasets: [
            {
              data: values6, 
              backgroundColor: colors6,
              borderColor: '#895273'
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true,
            position: "bottom",
            labels: {
              fontFamily: "Trebuchet MS",
              fontSize: 12,
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Confiscari in functie de drog",
              fontFamily: "Trebuchet MS",
              fontSize: 16,
              position: "top",
            },
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Elemente relevante", 
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "Numerele", 
              },
            },
          },
        },
      });

      const ctx11 = ctx1.getContext("2d");
      const ctx12 = ctx2.getContext("2d");
      const ctx13 = ctx3.getContext("2d");
      const ctx14 = ctx4.getContext("2d");
     
      addExportButton("exportButtonPNG1", ctx11, "png", "chart1");
      addExportButton("exportButtonSVG1", ctx11, "svg", "chart1");
      
      addExportButton("exportButtonPNG2", ctx12, "png", "chart2");
      addExportButton("exportButtonSVG2", ctx12, "svg", "chart2");
     
      addExportButton("exportButtonPNG3", ctx13, "png", "chart3");
      addExportButton("exportButtonSVG3", ctx13, "svg", "chart3");
     
      addExportButton("exportButtonPNG4", ctx14, "png", "chart4");
      addExportButton("exportButtonSVG4", ctx14, "svg", "chart4");
     
};
   



// Function to convert a canvas element to SVG data URL
function canvasToSvgDataURL(canvas) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const canvasImage = new Image();

  canvasImage.src = canvas.toDataURL("image/png");

  const svgImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
  svgImage.setAttribute("width", canvas.width/1.6);
  svgImage.setAttribute("height", canvas.height/1.6);
  svgImage.setAttributeNS("http://www.w3.org/1999/xlink", "href", canvasImage.src);

  svg.appendChild(svgImage);

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);

  return "data:image/svg+xml," + encodeURIComponent(svgString);
}

// Function to download SVG
function downloadSvg(canvas, fileName) {
  const svgDataUrl = canvasToSvgDataURL(canvas);

  const downloadLink = document.createElement("a");
  downloadLink.href = svgDataUrl;
  downloadLink.download = fileName;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
// Funcția pentru exportul diagramei ca SVG
function exportSvg(ctx, chartId) {
  const canvas = ctx.canvas;
  const fileName = `chart_${chartId}.svg`;
  downloadSvg(canvas, fileName);
}

  
// Funcția pentru adăugarea butoanelor de export
function addExportButton(buttonId, ctx, format, chartId) {
  const button = document.getElementById(buttonId);
  button.addEventListener("click", () => {
    if (format === "png") {
      exportChart(ctx, format, chartId);
    } else if (format === "svg") {
      exportSvg(ctx, chartId);
    } else {
      console.error("Formatul de export specificat nu este suportat.");
    }
  });
}

// Funcția pentru exportul diagramei în formatul specificat
function exportChart(ctx, format, chartId) {
  let imageData;
  let extension;
  if (format === "png") {
    imageData = ctx.canvas.toDataURL("image/png");
    extension = "png";
  } else {
    console.error("Formatul de export specificat nu este suportat.");
    return;
  }

  const downloadLink = document.createElement("a");
  downloadLink.href = imageData;
  downloadLink.download = `chart_${chartId}.${extension}`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}











const renderPublicSelectOptions = () => {
    const publics = new Set(varstaData.map((item) => item.activitati_prevenire));
    const publicSelectNode = document.getElementById("public-select");
    publicSelectNode.innerHTML = ""; // Clear existing options before adding new ones
  
    publics.forEach((publicData) => {
      const publicOption = `<option value="${publicData}">${publicData}</option>`;
      publicSelectNode.insertAdjacentHTML("beforeend", publicOption);
    });
  };


  const renderDrugSelectOptions2 = () => {
    const drugs2 = new Set(trat.map((item) => item.drog));
    const drugSelectNode2 = document.getElementById("drug-select2");
    drugSelectNode2.innerHTML = "";
    drugs2.forEach((drug) => {
      const drugOption2 = `<option value="${drug}">${drug}</option>`;
      drugSelectNode2.insertAdjacentHTML("beforeend", drugOption2);
    });
  };

  const updateChartData = async (publicData) => {
    const varstaDataItem= varstaData.find((item) => item.activitati_prevenire === publicData);
  
    // Actualizare date pentru diagrama 2 - `http://localhost:3000/api/activitatiPrevenire`
    chart2.data.datasets[0].data = [varstaDataItem.nr_activitati, varstaDataItem.nr_copii,varstaDataItem.nr_parinti,varstaDataItem.nr_cadre_didactice];
    chart2.update();
  };

  document.getElementById("public-select").addEventListener("change", function () {
    publicData = String(this.value); // Actualizare variabila "an" cu anul selectat
    updateChartData(publicData);
  });


  const updateChartData2 = async (drog) => {
    const tratItem= trat.find((item) => item.drog === drog);
  
    // Actualizare date pentru diagrama 2 - `http://localhost:3000/api/confiscariDroguri`
    chart4.data.datasets[0].data = [tratItem.grame, tratItem.comprimate,tratItem.doze_buc,tratItem.mililitri, tratItem.nr_capturi];
    chart4.update();
  };

  document.getElementById("drug-select2").addEventListener("change", function () {
    drog = String(this.value); // Actualizare variabila "drog" cu anul selectat
    updateChartData2(drog);
  });

  const renderPageElements = async () => {
    genData = await getLineChartData();
    varstaData = await getLineChartData1();
    locatie=await getLineChartData2();
    trat=await getLineChartData3();
    const data1 = genData[0];
    const data2 = varstaData[0];
    const data3=locatie[0];
    const data4=trat[0];
   console.log('data4',data4);
    renderPie(data1,data2,data3,data4);
    renderPublicSelectOptions();
    renderDrugSelectOptions2();
  };  
  renderPageElements();
