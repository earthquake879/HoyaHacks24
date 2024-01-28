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
    document.getElementById('homeDashboard').style.display = 'none'; // Hide home dashboard
    document.getElementById('mapContent').style.display = 'block'; // Show map content
    initMap(); // Initialize the map if needed
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
    var score = 0;
    var totalQuestions = 10;
    var form = document.getElementById('quizForm');
    var userScore = document.getElementById('userScore');
    var resultSection = document.getElementById('quizResult');

    // Example logic for checking an answer
    var q1 = form['q1'].value;
    if(q1 === 'd') { score++; }
    // Repeat for all questions...

    // Display the score
    userScore.textContent = score.toString();
    resultSection.style.display = 'block';
}
function submitQuiz() {
    var score = 0;
    var correctAnswers = {
        q1: 'd', q2: 'c', q3: 'c', q4: 'd',
        q5: 'a', q6: 'c', q7: 'c', q8: 'b',
        q9: 'b', q10: 'd'
    };
    
    for (var i = 1; i <= 10; i++) {
        var question = 'q' + i;
        var selectedValue = document.querySelector('input[name="' + question + '"]:checked');
        
        if (selectedValue && selectedValue.value === correctAnswers[question]) {
            score++;
        }
    }
    
    // Display the score
    document.getElementById('userScore').textContent = score;
    document.getElementById('quizResult').style.display = 'block';
}
