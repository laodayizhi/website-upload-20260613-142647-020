(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var video = document.querySelector('.movie-player');
    var playButton = document.querySelector('[data-play-button]');
    var message = document.querySelector('[data-player-message]');

    if (!video) {
      return;
    }

    var source = video.getAttribute('data-video-src');
    var attached = false;
    var hlsInstance = null;

    function showMessage(text) {
      if (!message) {
        return;
      }

      message.textContent = text;
      message.classList.toggle('is-visible', Boolean(text));
    }

    function hideButton() {
      if (playButton) {
        playButton.classList.add('is-hidden');
      }
    }

    function showButton() {
      if (playButton && video.paused) {
        playButton.classList.remove('is-hidden');
      }
    }

    function attachSource() {
      if (attached || !source) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (!data || !data.fatal) {
            return;
          }

          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            showMessage('播放暂时不可用');
            hlsInstance.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hlsInstance.recoverMediaError();
          } else {
            showMessage('播放暂时不可用');
          }
        });

        attached = true;
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        attached = true;
        return;
      }

      showMessage('播放暂时不可用');
    }

    function startPlay() {
      attachSource();
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          showMessage('点击画面继续播放');
        });
      }
    }

    if (playButton) {
      playButton.addEventListener('click', function () {
        showMessage('');
        hideButton();
        startPlay();
      });
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        startPlay();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      showMessage('');
      hideButton();
    });

    video.addEventListener('pause', showButton);

    video.addEventListener('ended', function () {
      showButton();
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
