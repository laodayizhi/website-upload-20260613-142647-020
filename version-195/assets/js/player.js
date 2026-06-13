(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var box = document.querySelector("[data-player]");
    var video = document.querySelector("[data-player-video]");
    if (!box || !video) {
      return;
    }

    var stream = video.getAttribute("data-stream");
    var playButtons = Array.prototype.slice.call(document.querySelectorAll("[data-play-toggle]"));
    var muteButton = document.querySelector("[data-mute-toggle]");
    var fullscreenButton = document.querySelector("[data-fullscreen]");
    var centerButton = document.querySelector(".center-play");
    var initialized = false;
    var hls = null;

    function setup() {
      if (initialized || !stream) {
        return;
      }
      initialized = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function setButtonText() {
      var paused = video.paused;
      playButtons.forEach(function (button) {
        button.textContent = paused ? "播放" : "暂停";
      });
      if (centerButton) {
        centerButton.classList.toggle("is-hidden", !paused);
      }
    }

    function playVideo() {
      setup();
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    function toggleVideo(event) {
      if (event) {
        event.preventDefault();
      }
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    }

    playButtons.forEach(function (button) {
      button.addEventListener("click", toggleVideo);
    });

    video.addEventListener("click", toggleVideo);
    video.addEventListener("play", setButtonText);
    video.addEventListener("pause", setButtonText);
    video.addEventListener("ended", setButtonText);

    if (muteButton) {
      muteButton.addEventListener("click", function () {
        video.muted = !video.muted;
        muteButton.textContent = video.muted ? "取消静音" : "静音";
      });
    }

    if (fullscreenButton) {
      fullscreenButton.addEventListener("click", function () {
        var target = box.querySelector(".video-shell") || video;
        if (target.requestFullscreen) {
          target.requestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      });
    }

    window.addEventListener("beforeunload", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });

    setup();
    setButtonText();
  });
})();
