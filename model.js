let nn;

const predictButton = document.getElementById("prediction-btn");
const resultDiv = document.getElementById("result");
predictButton.style.display = "none";

predictButton.addEventListener("click", (e) => {
  e.preventDefault();
  let input1 = document.getElementById("input_one").value;
  let input2 = document.getElementById("input_two").value;
  let input3 = document.getElementById("input_three").value;
  let input4 = document.getElementById("input_four").value;
  makePrediction(
    +input1,
    +input2,
    +input3,
    +input4
  );
});

function loadData() {
  nn = ml5.neuralNetwork({
    task: "regression",
    debug: true,
  });

  const modelInfo = {
    model: "./model/model.json",
    metadata: "./model/model_meta.json",
    weights: "./model/model.weights.bin",
  };

  nn.load(modelInfo, () => console.log("Model loaded!"));

  // Show elements after loading
  predictButton.style.display = "inline-block";
}
//comuns of the dataset ur using as input
async function makePrediction(Length, Height, Diameter, Roundness) {
  if (Length && Height && Diameter && Roundness) {
    const results = await nn.predict(
      {
        input_one: Length,
        input_two: Height,
        input_three: Diameter,
        input_four: Roundness,
      },
      () => console.log("Prediction successful!")
    );
    const priceTwoDecimals = results[0].output.toFixed(2);
    resultDiv.innerText = `The roundness of this grain is around: ${priceTwoDecimals}`;
  } else {
    resultDiv.innerText = `Please fill in everthing.`;
  }
}

loadData();
