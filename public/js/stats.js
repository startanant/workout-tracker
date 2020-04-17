// get all workout data from back-end

const dow = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

const today = moment();
const currdow = today.day();

async function initStats() {
  let stats = await API.getWorkoutsInRange({ data: { day: { $lte: moment().subtract(7, 'days').valueOf() } } });
  consolidateStats(stats);

}

initStats();

function generatePalette() {
  const arr = [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600",
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600"
  ]

  return arr;
}

function consolidateStats(data) {
  let exerciseArr = [];
  let durationArr = [];
  let weightArr = [];
  let dowduration = [0, 0, 0, 0, 0, 0, 0];
  let dowweight = [0, 0, 0, 0, 0, 0, 0];

  //loop over each workout
  data.forEach(workout => {
    //ignore it if it isn't in the last week
    if (moment(workout.day).isAfter(moment().subtract(7, 'days'))) {
      //within each workout, loop through exercises
      workout.exercises.forEach(exercise => {
        //for each exercise, look to see if it already exists in the temp array
        if (exerciseArr.indexOf(exercise.name) != -1) {
          //if so, get the index
          let i = exerciseArr.indexOf(exercise.name);
          //for the duration array, get the previous value at the same index
          //then add the new value to it
          durationArr[i] = durationArr[i] + exercise.duration;
          //do the same thing for the weight array
          weightArr[i] = weightArr[i] + exercise.weight;
        }
        else {
          //if it doesn't already exist in the array, push all three to their respective arrays
          exerciseArr.push(exercise.name);
          durationArr.push(exercise.duration);
          weightArr.push(exercise.weight);
        }
        //get dow and add total daily weight and duration
        let dow = moment(workout.day).day();
        dowduration[dow] = dowduration[dow] + exercise.duration;
        if (exercise.type === "resistance"){
          dowweight[dow] = dowweight[dow] + exercise.weight;
        }
        
      });
    }

  });
  //call the populate chart function with the three arrays
  populateChart(exerciseArr, durationArr, weightArr, dowduration, dowweight);
}

function populateChart(workouts, durations, pounds, dowduration, dowweight) {

  const colors = generatePalette();

  let line = document.querySelector("#canvas").getContext("2d");
  let bar = document.querySelector("#canvas2").getContext("2d");
  let pie = document.querySelector("#canvas3").getContext("2d");
  let pie2 = document.querySelector("#canvas4").getContext("2d");

  let lineChart = new Chart(line, {
    type: "line",
    data: {
      labels: dow,
      datasets: [
        {
          label: "Workout Duration In Minutes",
          backgroundColor: "red",
          borderColor: "red",
          data: dowduration,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: true
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ]
      }
    }
  });

  let barChart = new Chart(bar, {
    type: "bar",
    data: {
      labels: dow,
      datasets: [
        {
          label: "Pounds",
          data: dowweight,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Pounds Lifted"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });

  let pieChart = new Chart(pie, {
    type: "pie",
    data: {
      labels: workouts,
      datasets: [
        {
          label: "Excercises Performed",
          backgroundColor: colors,
          data: durations
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Duration of Excercises Performed"
      }
    }
  });

  let donutChart = new Chart(pie2, {
    type: "doughnut",
    data: {
      labels: workouts,
      datasets: [
        {
          label: "Excercises Performed",
          backgroundColor: colors,
          data: pounds
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Weight of Excercises Performed"
      }
    }
  });
}
