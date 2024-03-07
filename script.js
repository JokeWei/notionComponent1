var rotateDiv = document.getElementById('rot');
var rotateIcons = document.getElementById('rot-icons');
var clickRotateDiv = document.getElementById('click-rot');
var angle = 0;

clickRotateDiv.onclick = function() {
  angle += 60;
  rotateDiv.style.transform = 'rotate(' + angle + 'deg)';
  rotateIcons.style.transform = 'rotate(' + angle + 'deg)';
};

var step = 2;
var color1 = 'rgba(0,0,0,0.5)';
var color2 = 'rgba(0,0,0,0.1)';

var gradient = ' conic-gradient(';
for (var i = 0; i < 360; i += step) {
  var color = i % (2 * step) === 0 ? color1 : color2;
  gradient += color + ' ' + i + 'deg, ';
}
gradient = gradient.slice(0, -2) + '), rgb(85 93 108)'; 

rotateDiv.style.background = gradient;


var toggles = document.querySelectorAll('.toggle');
var tempElement = document.querySelector('.temp');

let isAnimating = false; // Add flag to indicate if animation is active

toggles.forEach(function(toggle) {
  toggle.addEventListener('click', function() {
    if (this.classList.contains('active') || isAnimating) { // Check if animation is active
      return;
    }
    toggles.forEach(function(toggle) {
      toggle.classList.remove('active');
    });
    this.classList.add('active');
    var tempValue = parseFloat(tempElement.textContent);
    if (this.id === 'toggle-cel') {
      var celsius = Math.round((tempValue - 32) * 5 / 9);
      tempElement.textContent = celsius + '°C';
    } else if (this.id === 'toggle-far') {
      var fahrenheit = Math.round(tempValue * 9 / 5 + 32);
      tempElement.textContent = fahrenheit + '°F';
    }
  });
});

let currentTempC = 34; // Initialize with the initial temperature in Fahrenheit
const CLOUDS = "clouds";
const SUNSET = "sunset";
const MOON = "moon";
const STORM = "storm";
const SNOW = "snow";

// cubic ease in/out function
function easeInOutCubic(t) {
  return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
}

function changeTemp(element, newTemp) {
  let unit = element.innerHTML.includes("C") ? "°C" : "°F";
  let currentTemp = unit === "°C" ? currentTempC : Math.round(currentTempC * 9 / 5 + 32);
  let finalTemp = unit === "°C" ? newTemp : Math.round(newTemp * 9 / 5 + 32);

  let duration = 2000; // Duration of the animation in milliseconds
  let startTime = null;

  function animate(currentTime) {
    if (startTime === null) {
      startTime = currentTime;
    }

    let elapsed = currentTime - startTime;
    let progress = Math.min(elapsed / duration, 1);
    progress = easeInOutCubic(progress);

    let tempNow = Math.round(currentTemp + (progress * (finalTemp - currentTemp)));
    element.innerHTML = `${tempNow}${unit}`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Update currentTempC once the animation is complete
      currentTempC = newTemp;
      isAnimating = false; // Reset the flag when animation is done
    }
  }

  isAnimating = true; // Set flag when animation starts
  requestAnimationFrame(animate);
}


window.onload = function() {
  const sixths = Array.from(document.querySelectorAll('.sixths'));
  let index = 0;

  document.querySelector('#rot-icons').addEventListener('click', () => {
    sixths[index].classList.remove('active');
    index = (index + 1) % sixths.length;
    sixths[index].classList.add('active');
    document.querySelector('#mountains').classList = "";
    console.log("class: ", document.querySelector('#mountains').classList);
    if (index == 0) {
      console.log("sun");
    } else if (index == 1) {
      console.log("sunset");
      document.querySelector('#mountains').classList.add(SUNSET);
    } else if (index == 2) {
      console.log("moon");
      document.querySelector('#mountains').classList.add(MOON);
    } else if (index == 3) {
      console.log("clouds");
      document.querySelector('#mountains').classList.add(CLOUDS);
    } else if (index == 4) {
      console.log("storm");
      document.querySelector('#mountains').classList.add(STORM);
    } else if (index == 5) {
      console.log("snow");
      document.querySelector('#mountains').classList.add(SNOW);
    }

    let loadingBar = document.querySelector('.loading-bar');
    loadingBar.classList.add('active');
  
    setTimeout(() => {
      loadingBar.classList.remove('active');
    }, 1200);
  });
  
  //debug
  // return;
  
  fetch("https://devapi.qweather.com/v7/weather/now?location=101120206&key=8391ba0e22444445a04e9dd00318067d")
    .then(response => response.json())
    .then(data => {
      console.log(data)
      let tempValue = data.now.temp;
      let icon = parseInt(data.now.icon);
      let text = data.now.text;
      let curTime = new Date(Date.parse(data.updateTime));
    
      changeTemp(tempElement, tempValue);
      
      // remove all class
      document.querySelector('#mountains').classList = "";
      
      // update svg class by weather
      if (icon === 100) {
        sixths[index].classList.remove('active');
        index = 0;
        sixths[index].classList.add('active');
      }
      if (icon >= 101 && icon <= 104) {
        sixths[index].classList.remove('active');
        index = 3;
        sixths[index].classList.add('active');
        document.querySelector('#mountains').classList.add(CLOUDS);
      }
      if (icon >= 300 && icon <= 399) {
        sixths[index].classList.remove('active');
        index = 4;
        sixths[index].classList.add('active');
        document.querySelector('#mountains').classList.add(STORM);
      }
      if (icon >= 400 && icon <= 499) {
        sixths[index].classList.remove('active');
        index = 5;
        sixths[index].classList.add('active');
        document.querySelector('#mountains').classList.add(SNOW);
      }
      // update by time
      if (curTime.getHours() >= 18 && curTime.getHours() <= 20) {
        sixths[index].classList.remove('active');
        index = 1;
        sixths[index].classList.add('active');
        document.querySelector('#mountains').classList.add(SUNSET);
      } else if (curTime.getHours() >= 21 || curTime.getHours() <= 5) {
        sixths[index].classList.remove('active');
        index = 2;
        sixths[index].classList.add('active');
        document.querySelector('#mountains').classList.add(MOON);
      }

      let loadingBar = document.querySelector('.loading-bar');
      loadingBar.classList.add('active');
    
      setTimeout(() => {
        loadingBar.classList.remove('active');
      }, 1200);
  });
  
  var startButton = document.querySelector(".inner-power");
  var clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  startButton.dispatchEvent(clickEvent);
};