import { createChart, updateChart } from "../libraries/scatterplot.js";

let nn;
const saveButton = document.getElementById("save-btn");

saveButton.style.display = "none";

saveButton.addEventListener("click", (e) => {
  e.preventDefault();
  nn.save();
});

function loadData() {
  Papa.parse("./data/rice.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => createNeuralNetwork(results.data),
  });
}

function createNeuralNetwork(data) {
  data.sort(() => Math.random() - 0.5);
  let trainData = data.slice(0, Math.floor(data.length * 0.8));
  let testData = data.slice(Math.floor(data.length * 0.8) + 1);

  console.table(testData);

  const options = {
    task: "regression",
    debug: true,
  };

  nn = ml5.neuralNetwork(options);

  // Adding data to the Neural Network
  for (let items of trainData) {
    let inputs = {
      input_one: items.Length,
      input_two: items.Height,
      input_three: items.Diameter,
      input_four: items.Area,
    };

    nn.addData(inputs, { output: items.Roundness });
  }

  // Normalize: Prevents that some columns have higher precedence than others
  nn.normalizeData();

  //Pass data to next function
  checkData(trainData, testData);
}

function checkData(trainData, testData) {
  console.table(testData);

  // Prepare the data for the scatterplot
  const chartdata = trainData.map((items) => ({
    x: items.Length,
    y: items.Roundness,
  }));

  // Create a scatterplot
  createChart(chartdata, "input", "predicted");

  // Pass data to next function
  startTraining(trainData, testData);
}

function startTraining(trainData, testData) {
  nn.train({ epochs: 20 }, () => finishedTraining(trainData, testData));
}

async function finishedTraining(trainData = false, testData) {
  // Empty array to push all the data in later on
  let predictions = [];
  // For loop for every possible price in CSV
  for (let pr = 1200; pr < 4000; pr += 100) {
    const testPhone = {
      input_one: testData[0].Length,
      input_two: testData[0].Height,
      input_three: testData[0].Diameter,
      input_four: testData[0].Area,
    };
    const pred = await nn.predict(testPhone);
    predictions.push({ x: pr, y: pred[0].output });
  }

  // Adds the neural network data to the chart
  updateChart("Predictions", predictions);
  console.log("Finished training!");


  saveButton.style.display = "inline";
}

loadData();