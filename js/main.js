var shiftDown = false;

// Warsaw
var lat = 52.23;
var lon = 21.01;

function setDate($) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sep', 'Oct', 'Nov', 'Dec'],
        d = new Date(),
        currentDate = days[d.getDay()] + ' | ' + d.getDate() + '&nbsp;' + months[d.getMonth()],
        mins = (d.getMinutes() > 9) ? d.getMinutes() : '0' + d.getMinutes(),
        currentTime = d.getHours() + ':' + mins,
        previousTime = $('.timeArea .time .timeInner').html();
    if (currentTime != previousTime) {
        $('.timeArea .time .timeInner').html(currentTime);
        $('.timeArea .time .date').html(currentDate);
    }
    let times = SunCalc.getTimes(new Date(), lat, lon);
    // format sunrise time from the Date object
    let sunriseStr = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
    let sunsetStr = times.sunset.getHours() + ':' + times.sunset.getMinutes();
    console.log('Sunrise: ' + sunriseStr + ' Sunset: ' + sunsetStr );
    $('#sunrise').text(sunriseStr);
    $('#sunset').text(sunsetStr);

    var toggle = true;
    setInterval(function() {
        var d = new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' });
        var parts = d.split(":");
        $('#hours').text(parts[0]);
        $('#minutes').text(parts[1]);
        $("#colon").css({ visibility: toggle?"visible":"hidden"});
        toggle=!toggle;
    },1000);
}

function search(query, engine) {
    query = query.replace(/ /g, '+', query);
    switch (engine) {
        case 'google':
        default:
            var url = 'https://google.com/search?q=' + query;
            break;
        case 'youtube':
            var url = 'https://www.youtube.com/results?search_query=' + query;
            break;
        case 'spotify':
            var url = 'https://open.spotify.com/search/results/' + query;
            break;
        case 'github':
            var url = 'https://github.com/search?q=' + query;
            break;
        case 'so':
            var url = 'https://www.google.com/search?q=' + query + '+site:stackoverflow.com&hl=en';
            break;
        case 'hn':
            var url = 'https://hn.algolia.com/?experimental&sort=byPopularity&dateRange=pastYear&type=story&query=' + query;
            break;
        case 'imdb':
            var url = 'https://www.imdb.com/find?q=' + query + '&s=tt';
            break;
    }

    if (!shiftDown) {
        window.location.replace(url);
    } else {
        $('<a>').attr('href', url).attr('target', '_blank')[0].click();
    }
}

$(function() {
    setDate($);
    let currentTime = new Date();
    // get today's sunlight times for location
    let times = SunCalc.getTimes(new Date(), lat, lon);
    if (times.sunrise <= currentTime && currentTime < times.sunset) {
        if (document.body) {
            document.body.background = "css/background_day.jpg";
            document.body.className = " day";
        }

    } else {
        if (document.body) {
            document.body.background = "css/background_night.jpg";
            document.body.className = " night";
        }
    }

    document.body.className += ' fade-out';
    $(function () {
        $('body').removeClass('fade-out');
    });

    $(window).keydown(function(e) {
        if (e.keyCode == 72) {
            $('.hideable').toggleClass('hide');
        }
        if (e.keyCode == 16) {
            shiftDown = true;
        }
    });

    $(window).keyup(function(e) {
        if (e.keyCode == 16) {
            shiftDown = false;
        }
    });

    $('.flexbox input, .flexbox select').keydown(function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            var query = $('.flexbox input').val();
            var engine = $('.flexbox select option:selected').val();
            search(query, engine);
        }
    });
});
