;(function (window, document, undefined) {

    'use strict';

    var video = videojs('video');
    var src = video.src();

    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();
        var file = this.file.value;
        $.post('/stream', { file })
            .done(function (data) {
                video.src(src + data.magnet);
                video.play();
            })
            .fail(function () {
                alert('Oops ... Try later.');
            });
    });

})(window, document);