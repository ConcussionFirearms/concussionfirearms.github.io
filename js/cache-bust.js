// cache-bust.js
document.addEventListener("DOMContentLoaded", function() {
    // Get the current timestamp to ensure the browser loads the latest version
    var version = new Date().getTime(); // This will get the unique timestamp

    // Update the href for the CSS file with the version query string
    var stylesheet = document.getElementById('stylesheet');
    if (stylesheet) {
        stylesheet.href = 'styles.css?v=' + version;
    }
});
