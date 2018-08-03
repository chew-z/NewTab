let shiftDown = false;
// let lon = 11.99;
// let lat = 43.28;

function search(query, engine) {
    let url = ``;
    const q = query.replace(/ /g, "+", query);
    switch (engine) {
        case "google":
        default:
            url = `https://google.com/search?q=${q}`;
            break;
        case "bookmarks":
            url = `chrome://bookmarks/?q=${q}`;
            chrome.runtime.sendMessage({
                method: "openLocalFile",
                localFileUrl: url,
            });
            break;
        case "youtube":
            url = `https://www.youtube.com/results?search_query=${q}`;
            break;
        case "spotify":
            url = `https://open.spotify.com/search/results/${q}`;
            break;
        case "github":
            url = `https://github.com/search?q=${q}`;
            break;
        case "so":
            url = `https://www.google.com/search?q=${q}+site:stackoverflow.com&hl=en`;
            break;
        case "hn":
            url = `https://hn.algolia.com/?experimental&sort=byPopularity&dateRange=pastYear&type=story&query=${q}`;
            break;
        case "imdb":
            url = `https://www.imdb.com/find?q=${q}&s=tt`;
            break;
        case "instapaper":
            url = `https://www.instapaper.com/search?q=${q}`;
            break;
    }

    if (!shiftDown) {
        window.location.replace(url);
    } else {
        $("<a>")
            .attr("href", url)
            .attr("target", "_blank")[0]
            .click();
    }
}

$(() => {
    document.body.className += " fade-out";
    $(() => {
        $("body").removeClass("fade-out");
    });

    $(window).keydown((e) => {
        if (e.keyCode === 72) {
            $(".hideable").toggleClass("hide");
        }
        if (e.keyCode === 16) {
            shiftDown = true;
        }
    });

    $(window).keyup((e) => {
        if (e.keyCode === 16) {
            shiftDown = false;
        }
    });

    $(".flexbox input, .flexbox select").keydown((e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            const query = $(".flexbox input").val();
            const engine = $(".flexbox select option:selected").val();
            search(query, engine);
        }
    });
});
