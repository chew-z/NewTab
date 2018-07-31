var shiftDown = false;

// var background = chrome.extension.getBackgroundPage();
// let lon = 11.99;
// let lat = 43.28;

const phases = [
    { emoji: '🌚', code: ':new_moon_with_face:', name: 'New Moon', weight: 1 },
    { emoji: '🌒', code: ':waxing_crescent_moon:', name: 'Waxing Crescent', weight: 6.3825 },
    { emoji: '🌓', code: ':first_quarter_moon:', name: 'First Quarter', weight: 1 },
    { emoji: '🌔', code: ':waxing_gibbous_moon:', name: 'Waxing Gibbous', weight: 6.3825 },
    { emoji: '🌝', code: ':full_moon_with_face:', name: 'Full Moon', weight: 1 },
    { emoji: '🌖', code: ':waning_gibbous_moon:', name: 'Waning Gibbous', weight: 6.3825 },
    { emoji: '🌗', code: ':last_quarter_moon:', name: 'Last Quarter', weight: 1 },
    { emoji: '🌘', code: ':waning_crescent_moon:', name: 'Waning Crescent', weight: 6.3825 }
]

const step = function (phase) {
    const weight = phases.reduce(function (a, b) {
        return a + b.weight
    }, 0)

    phase *= weight
    for (var rv = 0; rv < phases.length; rv++) {
        phase -= phases[rv].weight
        if (phase <= 0) {
            break
        }
    }

    return rv
}

function search(query, engine) {
    query = query.replace(/ /g, '+', query);
    switch (engine) {
        case 'google':
        default:
            var url = 'https://google.com/search?q=' + query;
            break;
        case 'bookmarks':
            var url = 'chrome://bookmarks/?q=' + query;
            try {
                chrome.runtime.sendMessage({
                    method: 'openLocalFile',
                    localFileUrl: url,
                });
            } catch (e) {} 
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
        case 'instapaper':
            var url = 'https://www.instapaper.com/search?q=' + query;
            break;
    }

    if (!shiftDown) {
        window.location.replace(url);
    } else {
        $('<a>').attr('href', url).attr('target', '_blank')[0].click();
    }
}

$(function() {
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
