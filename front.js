$(document).ready(function(){ 
    async function asyncOperation(url){
        var response = await fetch(url, {
            method: "GET",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response;
    }

    async function getWeatherDataByTownName(cityName, typeUrl){
            const ApiKey = "f720c35b125e4c18a38191356201110";
            var response = await Promise.all([
                await asyncOperation(`http://api.weatherapi.com/v1${typeUrl}?key=${ApiKey}&q=${cityName}&days=7`),
                await asyncOperation(`http://worldclockapi.com/api/json/est/now`)
            ]);
            if(response[0].ok && response[1].ok){
                let jsonWeather = await response[0].json();
                let jsonTime = await response[1].json();
                var result = [jsonWeather, jsonTime];
                return result;
            }
            else{
                throw new Error("error");
            }
    }

    function showCurrentWeatherProperties(data){
        $(".weather__container").eq(0).addClass("active");
        //realtime properties
        var location = data.location.name;
        var temp_c = data.current.temp_c;
        var gust_kph = data.current.gust_kph;
        var icon = data.current.condition.icon;

        $(".town_text").html(`${location} Weather Forecast<br/>`);
        $(".temp").eq(0).html(`${temp_c}°<br/>`);
        $(".weather__container img").eq(0).remove();
        $(".temp").eq(0).after(`<img src="${icon}" alt="" >`);
    }

    function showForecastWeatherProperties(data){
        //forecast properties
        for(var i = 1;i < 3;i++){
            var container = $(".weather__container").eq(i);
            container.addClass("active");

            var avrTempForecast = Math.round(data.forecast.forecastday[i].day.avgtemp_c);
            var icon = data.forecast.forecastday[i].day.condition.icon;

            //$(".location").eq(i).html(`${location}<br/>`);
            $(".temp").eq(i).html(`${avrTempForecast}°<br/>`);
            $(".weather__container img").eq(i).remove();
            $(".temp").eq(i).after(`<img src="${icon}" alt="" >`);
        }

    }

    function checkDayOfTheWeekNumber(dayOfTheWeekString){
        var dayOfTheWeek;
        switch (dayOfTheWeekString) {
            case "Sunday":
                dayOfTheWeek = "Monday";
            break;
            case "Monday":
                dayOfTheWeek = "Tuesday"
            break;
            case "Tuesday":
                dayOfTheWeek = "Wednesday"
            break;
            case "Wednesday":
                dayOfTheWeek = "Thursday"
            break;
            case "Thursday":
                dayOfTheWeek = "Friday"
            break;
            case "Friday":
                dayOfTheWeek = "Saturday"
            break;
            case "Saturday":
                dayOfTheWeek = "Sunday"
            break;
        }
        return dayOfTheWeek;
    }

    function showCurrentDate(date){
        var dayOfTheWeek = date.dayOfTheWeek;
        var secondDayOfTheWeek = checkDayOfTheWeekNumber(dayOfTheWeek);
        var thirdDayOfTheWeek = checkDayOfTheWeekNumber(secondDayOfTheWeek);

        $(".forecast__day").eq(0).html(dayOfTheWeek);
        $(".forecast__day").eq(1).html(secondDayOfTheWeek);
        $(".forecast__day").eq(2).html(thirdDayOfTheWeek);

        return [dayOfTheWeek, secondDayOfTheWeek, thirdDayOfTheWeek];
    }

    function showRowOfTable(weatherData, weekOfDay){
        $(".optional_table").addClass("active");
        for(var i = 0;i < 3;i++){
            var temp_min = weatherData.forecast.forecastday[i].day.mintemp_c;
            var temp_max = weatherData.forecast.forecastday[i].day.maxtemp_c;
            var avghumidity = weatherData.forecast.forecastday[i].day.avghumidity;
            var wind_kph = weatherData.forecast.forecastday[i].day.maxwind_kph;

            $(".day_week").eq(i).text(weekOfDay[i]);
            $(".min_temp").eq(i).text(temp_min);
            $(".max_temp").eq(i).text(temp_max);
            $(".win_speed").eq(i).text(wind_kph);
            $(".avghumidity").eq(i).text(avghumidity);
        }
    }

    $("#searchButton").click(function(){
        var cityName = $("#cityField").val();
        var typeUrl = "/forecast.json";
        console.log(cityName);
        if(cityName !== ""){
            getWeatherDataByTownName(cityName, typeUrl).then((data) => {
                showCurrentWeatherProperties(data[0]);
                showForecastWeatherProperties(data[0]);
                var date = showCurrentDate(data[1]);
                showRowOfTable(data[0], date);
            }).catch((err) =>{
                console.log(err);
                //$("#error").text("Write correct name of town!");
            });
        }
    });

    /*async function getWeatherDataByTownName(cityName, typeUrl){
        const ApiKey = "f720c35b125e4c18a38191356201110";
        var response = await fetch(`http://api.weatherapi.com/v1/current.json?key=f720c35b125e4c18a38191356201110&days=7&q=${cityName}`,{
            method: "GET",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log(response);
        return response;
    }

    $("#searchButton").click(function(){
        var cityName = $("#cityField").val();
        var typeUrl = "/current.json";
        console.log(cityName);
        if(cityName !== ""){
            getWeatherDataByTownName(cityName, typeUrl).then((data) => {
                return data.json();
            }).then((json)=>{
                $("#error").text(json.location.name);
            }).catch((err) =>{
                console.log(err);
                $("#error").text("Write correct name of town!");
            });
        }
    });*/

});