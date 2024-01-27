function initMap() {
    var location = { lat: 38.907852, lng: -77.072807 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: location
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'My location'
    });
}

function showMaps() {
    document.getElementById('mapsDashboard').style.display = 'block';
    document.getElementById('lightDetectionDashboard').style.display = 'none';
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


