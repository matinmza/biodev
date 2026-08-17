// Applies the saved theme before the app hydrates, so there is no flash.
(function () {
  try {
    var stored = localStorage.getItem("matinos-theme");
    var dark =
      stored === "dark" ||
      ((!stored || stored === "system") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    var classes = document.documentElement.classList;
    classes.toggle("dark", dark);
    classes.toggle("light", !dark);
  } catch (_) {
    /* localStorage unavailable — CSS media-query fallback still applies */
  }
})();
