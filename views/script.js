var latitude, longitude;
navigator.geolocation.getCurrentPosition(location => {
  latitude = location.coords.latitude;
  longitude = location.coords.longitude;
  console.log(latitude + " " + longitude);

  // DARKSKY API

  //   var proxy = "https://cors-anywhere.herokuapp.com/";
  //   var url = `https://api.darksky.net/forecast/996566a5f7f4d7559d846314376e919f/${latitude},${longitude}?units=auto`;
  //   var finalURL = proxy + url;
  //   axios.get(finalURL).then(function(datas) {
  //     if (datas.status == 200) {
  //       console.log(datas);
  //       var data = datas.data;
  //       document.getElementById("temp").textContent = Math.trunc(data.currently.temperature)+" °C";
  //       document.getElementById("cityName").textContent = data.timezone;
  //       document.getElementById("longitude").textContent = Math.trunc(data.longitude);
  //       document.getElementById("latitude").textContent = Math.trunc(data.latitude);
  //       document.getElementById("summary").textContent = data.currently.summary;
  //       var skycons = new Skycons({ color: "#222" });
  //       skycons.set("icon", data.currently.icon);
  //       skycons.play();
  //   var d= new Date(data.currently.time * 1000);
  //   console.log(d);

  //OPENWEATHER_API

  var proxy = "https://cors-anywhere.herokuapp.com/";
  var url = `api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=dc6e05fd50246405d838573f10282c6a&units=metric`;
  // var url = "http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&APPID=dc6e05fd50246405d838573f10282c6a";
  var finalURL = proxy + url;
  axios.get(finalURL).then(function(data) {
    if (data.status == 200) {
      console.log(data);
      document.getElementById("temp").textContent =
        Math.trunc(data.data.main.temp) + " °C";
      document.getElementById("cityName").textContent = data.data.name;
      document.getElementById("longitude").textContent = data.data.coord.lon;
      document.getElementById("latitude").textContent = data.data.coord.lat;
      document.getElementById(
        "summary"
      ).textContent = data.data.weather[0].description.toUpperCase();
      document.getElementById("icon").src = `http://openweathermap.org/img/wn/${
        data.data.weather[0].icon
      }@2x.png`;
    }
  });
});

function forcastFun() {
  navigator.geolocation.getCurrentPosition(location => {
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;
    console.log(latitude + " " + longitude);
    forcastURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=dc6e05fd50246405d838573f10282c6a&units=metric`;
    axios.get(forcastURL).then(function(data) {
      if (data.status == 200) console.log(data);
      obj = data.data.list;
      var s = "";
      var forDiv = document.getElementById("forcast");
      if (forDiv.style.visibility === "visible") {
        document.getElementById("forcast").style.visibility = "hidden";
        document.getElementById("forHeading").style.visibility = "hidden";
      } else {
        document.getElementById("forcast").style.visibility = "visible";
        document.getElementById("forHeading").style.visibility = "visible";
      }
      for (var i = 2; i < 7; i++) {
        console.log(toDate(obj[i].dt));

        document.getElementById(`forc${i - 1}`).textContent = toDate(obj[i].dt);

        document.getElementById(`forc${i - 1}t`).textContent =
          Math.trunc(obj[i].main.temp) + " °C";

        document.getElementById(`forc${i - 1}s`).textContent =
          obj[i].weather[0].description;

        document.getElementById(
          `forc${i - 1}Icon`
        ).src = `http://openweathermap.org/img/wn/${
          obj[i].weather[0].icon
        }@2x.png`;
      }
    });
  });
}

function toDate(data) {
  var theDate = new Date(data * 1000);
  dateString = theDate.toGMTString();
  finalDate =
    dateString.substring(5, 11) + " : " + dateString.substring(17, 22);
  // console.log(finalDate);
  return finalDate;
}
