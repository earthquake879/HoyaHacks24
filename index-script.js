const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  const crd = pos.coords;

  console.log("Your current position is:");
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
// If user has not visited site before, ask for location permissions
if (!localStorage.getItem('locationPerms') === null) {
  console.log("First time?")

  // Get permission
  navigator.geolocation.getCurrentPosition((position) => {
    // Set to true if it works
    localStorage.setItem('locationPerms', true);
  }, (error) => {
    // It didn't work, set to false
    localStorage.setItem('locationPerms', false);
    console.log("Location permission denied, cannot continue.")
  })
}
