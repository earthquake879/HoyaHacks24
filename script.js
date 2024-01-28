async function sendTask(username, score, task) {
    username = encodeURI(username);
    score = encodeURI(score);
    task = encodeURI(task);
    const url = "https://environeer.glitch.me/task?user="+username+"&score="+score+"&task="+task;
    return await((await fetch(url)).json());
}
async function sendQuiz(username, score) {
    username = encodeURI(username);
    score = encodeURI(score);
    const url = "https://environeer.glitch.me/quiz?user="+username+"&score="+score;
    return await((await fetch(url)).json());
}
var selectedMarker = null;

function initMap() {
    var georgetown = { lat: 38.9097, lng: -77.0654 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: georgetown
    });

    // Colors for the markers
    var colors = ['blue', 'pink', 'yellow', 'purple', 'black', 'white'];
    colors.forEach(function(color) {
        var button = document.createElement('button');
        button.textContent = color.charAt(0).toUpperCase() + color.slice(1) + ' Marker';
        button.classList.add('custom-map-control-button');
        button.addEventListener('click', function() {
            addColoredMarker(color, map);
        });
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(button);
    });

    // Add the "Enter Text" button
    var enterTextButton = document.createElement('button');
    enterTextButton.textContent = 'Enter Text';
    enterTextButton.classList.add('custom-map-control-button');
    enterTextButton.onclick = function() {
        if (selectedMarker) {
            var username = prompt("Enter your username:");
            var activity = prompt("What did you do?");
            selectedMarker.setTitle(username + ": " + activity);
            sendTask(username,1,activity);
        } else {
            alert("Please select a marker first.");
        }
    };
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(enterTextButton);
}

function addColoredMarker(color, map) {
    var georgetown = { lat: 38.9097, lng: -77.0654 };
    var markerColor = getColorForMarker(color);

    var marker = new google.maps.Marker({
        position: georgetown,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: markerColor,
            fillOpacity: 0.8,
            strokeWeight: 2
        },
        draggable: true
    });

    // Add click event listener to the marker
    marker.addListener('click', function() {
        selectedMarker = marker;
    });
}

function getColorForMarker(color) {
    // Define a simple map of color names to hex values
    var colorMap = {
        'blue': '#0000FF',
        'pink': '#FFC0CB',
        'yellow': '#FFFF00',
        'purple': '#800080',
        'black': '#000000',
        'white': '#FFFFFF'
    };

    return colorMap[color] || '#FF0000'; // default to red if color not found
}







function showMaps() {
    // Hide other dashboard contents
    document.getElementById('homeDashboard').style.display = 'none';
    document.getElementById('lightDetectionDashboard').style.display = 'none';

    // Show the map dashboard content
    document.getElementById('mapContent').style.display = 'block';
}

function showEconaires() {
    // Hide any sections that shouldn't be displayed with the home page
    document.getElementById('mapContent').style.display = 'none';
    document.getElementById('lightDetectionDashboard').style.display = 'none';
  
    // Do not hide the homeDashboard here if it should stay visible
  
    // Show the Econaires quiz dashboard content
    document.getElementById('econairesDashboard').style.display = 'block'; // Change this to 'block' to show
}






function showLightDetection() {
    document.getElementById('mapsDashboard').style.display = 'none';
    document.getElementById('lightDetectionDashboard').style.display = 'block';
    openLightDetection(); // Call this function to start light detection
}
function openLightDetection() {
    const video = document.getElementById('videoElement');
    /*
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
                video.addEventListener('play', processFrame);
            })
            .catch(function (error) {
                console.log("Something went wrong with the video stream!");
            });
    }
    */
}

function processFrame() {
    if (video.paused || video.ended) {
        return;
    }

    let src = cv.imread(videoElement);
    let dst = new cv.Mat();
    let gray = new cv.Mat();
    let invert = new cv.Mat();
    let blurred = new cv.Mat();
    let sketch = new cv.Mat();

    // Convert to grayscale
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

    // Invert the grayscale image
    cv.bitwise_not(gray, invert);

    // Apply Gaussian blur to the inverted image
    cv.GaussianBlur(invert, blurred, new cv.Size(21, 21), 0, 0, cv.BORDER_DEFAULT);

    // Create the pencil sketch effect by dividing the grayscale image by the blurred image
    cv.divide(gray, blurred, sketch, 256, -1);

    // Display the result
    cv.imshow('canvasOutput', sketch);

    // Cleanup
    src.delete(); dst.delete(); gray.delete(); invert.delete(); blurred.delete(); sketch.delete();

    requestAnimationFrame(processFrame);
}

function onOpenCvReady() {
    document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    
    // Continue with your light detection logic here
    // ...
}

function processFrame() {
    if (video.paused || video.ended) {
        return;
    }

    // Read the video frame into an OpenCV.js Mat object
    let src = cv.imread(videoElement);
    let dst = new cv.Mat();
    let gray = new cv.Mat();
    let invert = new cv.Mat();
    let blurred = new cv.Mat();
    let sketch = new cv.Mat();

    // Convert to grayscale
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

    // Invert the grayscale image
    cv.bitwise_not(gray, invert);

    // Apply Gaussian blur to the inverted image
    cv.GaussianBlur(invert, blurred, new cv.Size(21, 21), 0, 0, cv.BORDER_DEFAULT);

    // Blend the grayscale image with the blurred negative image
    cv.divide(gray, blurred, sketch, 256, -1);

    // Display the result
    cv.imshow('canvasOutput', sketch);

    // Cleanup
    src.delete();
    gray.delete();
    invert.delete();
    blurred.delete();
    sketch.delete();

    // Request the next frame to keep the video playing
    requestAnimationFrame(processFrame);
}

// Start the video and processing
openLightDetection();


function submitQuiz() {
    // Prompt for the username
    var username = prompt("Please enter your username to submit your answers:");
    
    // Check if the username is entered
    if (username === null || username.trim() === "") {
        alert("Username is required to submit the quiz.");
        return; // Exit the function if no username is entered
    }
    
    // Initialize score
    var score = 0;
    
    // Correct answers for the quiz
    var correctAnswers = {
        q1: 'd', qg2: 'c', q3: 'c', q4: 'd',
        q5: 'a', q6: 'c', q7: 'c', q8: 'b',
        q9: 'b', q10: 'd'
    };
    
    // Iterate over each question and check answers
    for (var i = 1; i <= 10; i++) {
        var question = 'q' + i;
        var selectedValue = document.querySelector('input[name="' + question + '"]:checked');
        
        // If the selected answer matches the correct answer, increment the score
        if (selectedValue && selectedValue.value === correctAnswers[question]) {
            score++;
        }
    }
    sendQuiz(username, score);
    // Show the score
    document.getElementById('userScore').textContent = score;
    document.getElementById('quizResult').style.display = 'block';
    
    // Optionally, you can also display the username
    // You might want to add a place in your HTML to show the username
    // For example: <div id="usernameDisplay"></div>
    // document.getElementById('usernameDisplay').textContent = "Username: " + username;
    
    // Now, you could also do something with the username and score,
    // like sending them to a server or using them in further logic
}


function removeSelectedMarker() {
    if (selectedMarker) {
        selectedMarker.setMap(null); // Removes the marker from the map
        markers = markers.filter(marker => marker !== selectedMarker);
        selectedMarker = null;
    } else {
        alert("No marker selected!");
    }
}
// Data for the appliances based on the uploaded image
const appliancesData = [
    { name: "Refrigerator", power: 73, hours: 4320, annual: 315 },
    { name: "Mini-fridge", power: 45, hours: 4320, annual: 194 },
    { name: "Water heater", power: 2000, hours: 168, annual: 336 },
    { name: "Washing machine", power: 500, hours: 36, annual: 18 },
    { name: "Dryer", power: 3000, hours: 27, annual: 81 },
    { name: "Iron", power: 1200, hours: 180, annual: 216 },
    { name: "Fan (small/ceiling)", power: 50, hours: 3600, annual: 180 },
    { name: "Microwave", power: 1200, hours: 12, annual: 14 },
    { name: "Television", power: 80, hours: 1200, annual: 96 },
    { name: "Sound system", power: 60, hours: 900, annual: 54 },
    { name: "A/C night time (1hp)", power: 900, hours: 1207, annual: 1086 },
    { name: "A/C day time (1.5hp)", power: 1210, hours: 603, annual: 730 },
    { name: "Lighting (dorm)", power: 40, hours: 800, annual: 32 },
    { name: "Vacuum cleaner", power: 1200, hours: 45, annual: 54 },
    { name: "Laptop PC (charging)", power: 80, hours: 720, annual: 58 },
    { name: "Cell Phone (charging)", power: 5, hours: 2920, annual: 15 },
    { name: "Xbox One", power: 112, hours: 360, annual: 138 },
    { name: "Playstation 4", power: 137, hours: 360, annual: 102 },
    { name: "Nintendo Switch", power: 18, hours: 360, annual: 53 }
];


// Add checkboxes and input fields for each appliance on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calculatorForm');
    appliancesData.forEach(appliance => {
        const div = document.createElement('div');
        div.className = 'appliance';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = appliance.name.toLowerCase().replace(/\s+/g, '') + 'Checkbox';
        checkbox.name = 'appliance';
        checkbox.value = appliance.name;

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = appliance.name;

        const hoursInput = document.createElement('input');
        hoursInput.type = 'number';
        hoursInput.id = appliance.name.toLowerCase().replace(/\s+/g, '') + 'Hours';
        hoursInput.placeholder = 'Hours Used';

        div.appendChild(checkbox);
        div.appendChild(label);
        div.appendChild(hoursInput);
        form.appendChild(div);
    });
});

// Function to calculate and display the results
function submitCalculator() {
    // Prevent default form submission if needed
    if (event) event.preventDefault();

    const resultsDiv = document.getElementById('calculatorResult');
    resultsDiv.innerHTML = ''; // Clear previous results
    resultsDiv.style.display = 'block';

    // Create and append the table
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    ['Appliance', 'Power (watts)', 'Input Hours', 'Total Power (Wh)', 'Annual kWh'].forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    // Calculate and create a row for each checked appliance with user-entered hours
    appliancesData.forEach(appliance => {
        const checkbox = document.getElementById(appliance.name.toLowerCase().replace(/\s+/g, '') + 'Checkbox');
        if (checkbox && checkbox.checked) {
            const hoursInput = document.getElementById(appliance.name.toLowerCase().replace(/\s+/g, '') + 'Hours');
            const inputHours = parseFloat(hoursInput.value) || 0; // Use 0 if input is empty or invalid
            const totalPower = appliance.power * inputHours; // Total power in Wh
            const annualKWh = (appliance.power * inputHours * 365) / 1000; // Annual consumption in kWh

            const row = table.insertRow();
            [appliance.name, appliance.power, inputHours, totalPower.toFixed(2), annualKWh.toFixed(2)].forEach(cellText => {
                const cell = row.insertCell();
                cell.textContent = cellText;
            });
        }
    });

    resultsDiv.appendChild(table);
}

function showCalculator() {
    // Hide other sections
    document.getElementById('homeDashboard').style.display = 'none';
    document.getElementById('mapContent').style.display = 'none';
    document.getElementById('econairesDashboard').style.display = 'none';
    document.getElementById('lightDetectionDashboard').style.display = 'none';

    // Show the Calculator dashboard
    document.getElementById('calculatorDashboard').style.display = 'block';
}
function submitCalculator() {
    const resultsDiv = document.getElementById('calculatorResult');
    resultsDiv.innerHTML = ''; // Clear previous results
    resultsDiv.style.display = 'block';

    // Create and append the table
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    ['Appliance', 'Power (watts)', 'Input Hours', 'Total Power (Wh)', 'Annual kWh'].forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    // Calculate and create a row for each checked appliance with user-entered hours
    appliancesData.forEach(appliance => {
        const checkbox = document.getElementById(appliance.name.toLowerCase().replace(/\s+/g, '') + 'Checkbox');
        if (checkbox.checked) {
            const hoursInput = document.getElementById(appliance.name.toLowerCase().replace(/\s+/g, '') + 'Hours');
            const inputHours = parseFloat(hoursInput.value) || 0; // Use 0 if input is empty or invalid
            const totalPower = appliance.power * inputHours; // Total power in Wh
            const annualKWh = (appliance.power * inputHours * 365) / 1000; // Annual consumption in kWh

            const row = table.insertRow();
            [appliance.name, appliance.power, inputHours, totalPower.toFixed(2), annualKWh.toFixed(2)].forEach(cellText => {
                const cell = row.insertCell();
                cell.textContent = cellText;
            });
        }
    });

    resultsDiv.appendChild(table);
}
    