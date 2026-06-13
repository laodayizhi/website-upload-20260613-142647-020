(function () {
    window.initMoviePlayer = function (videoId, layerId, source) {
        var video = document.getElementById(videoId);
        var layer = document.getElementById(layerId);
        var hls = null;
        var started = false;
        if (!video || !source) {
            return;
        }
        function hideLayer() {
            if (layer) {
                layer.classList.add("is-hidden");
            }
        }
        function attach() {
            if (started) {
                return;
            }
            started = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                video.addEventListener("loadedmetadata", function () {
                    video.play().catch(function () {});
                }, { once: true });
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.attachMedia(video);
                hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                    hls.loadSource(source);
                });
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        hls.destroy();
                    }
                });
            } else {
                video.src = source;
            }
        }
        function play() {
            hideLayer();
            attach();
            video.play().catch(function () {});
        }
        if (layer) {
            layer.addEventListener("click", play);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener("play", hideLayer);
        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };
})();
