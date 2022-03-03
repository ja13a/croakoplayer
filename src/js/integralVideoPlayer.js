export class IntegralVideoPlayer {
  constructor(videoSource, rootNode) {
    this.videoSource = videoSource;
    this.rootNode = rootNode;

    this.videoPlayer();
  }

  player = null;
  isChangingTime = false;
  lastVolumeValue = 1;

  videoPlayer() {
    const playerWrapper = document.createElement('div');
    playerWrapper.setAttribute('class', 'integral-video-player');

    const video = document.createElement('video');
    video.setAttribute('src', this.videoSource);
    video.setAttribute('class', 'integeral-video-player__player');
    video.currentTime = 0;

    video.addEventListener('click', (e) => e.target.paused ? this.player.play() : this.player.pause());

    this.player = video;

    playerWrapper.append(video);
    playerWrapper.append(this.controls());
    this.rootNode.append(playerWrapper);
  }

  controls() {
    const controlsWrapper = document.createElement('div');
    controlsWrapper.classList.add('integral-video-player__controls-wrapper');

    controlsWrapper.append(this.playPauseButton());
    controlsWrapper.append(this.timeRange());
    controlsWrapper.append(this.playerTime());
    controlsWrapper.append(this.volumeRange());
    controlsWrapper.append(this.fullscreenButton());

    return controlsWrapper;
  }

  playPauseButton() {
    const playPauseButton = document.createElement('button');
    playPauseButton.setAttribute('class', 'integral-video-player__button');

    const playIconElement = document.createElement('div');
    playIconElement.setAttribute('class', 'integral-video-player__icon play-icon');
    playPauseButton.append(playIconElement);

    this.player.addEventListener('ended', (e) => {
      e.preventDefault();

      playIconElement.setAttribute('class', 'integral-video-player__icon replay-icon');
    });

    this.player.addEventListener('pause', () => {
      playIconElement.setAttribute('class', 'integral-video-player__icon play-icon');
    });

    this.player.addEventListener('play', () => {
      playIconElement.setAttribute('class', 'integral-video-player__icon pause-icon');
    });

    playPauseButton.addEventListener('click', (e) => {
      e.preventDefault();

      this.player.paused ? this.player.play() : this.player.pause();
      playIconElement.setAttribute(
        'class',
        `integral-video-player__icon ${this.player.paused ? 'play-icon' : 'pause-icon'}`
      );
    });

    return playPauseButton;
  }

  timeRange() {
    const timeRange = document.createElement('input');
    timeRange.setAttribute('type', 'range');
    timeRange.setAttribute('class', 'integral-video-player__range');
    timeRange.setAttribute('step', 0.1);
    timeRange.value = 0;

    this.player.addEventListener('loadeddata', (e) => {
      e.preventDefault();

      timeRange.setAttribute('min', 0);
      timeRange.setAttribute('max', Math.floor(e.target.duration));
    });

    this.player.addEventListener('timeupdate', (e) => {
      e.preventDefault();

      !this.isChangingTime && (timeRange.value = e.target.currentTime);
    });

    timeRange.addEventListener('input', () => {
      this.isChangingTime = true;
      this.player.pause();
    });

    timeRange.addEventListener('change', (e) => {
      this.isChangingTime = false;
      this.player.play();
      !this.isChangingTime && (this.player.currentTime = e.target.value);
    });

    return timeRange;
  }

  playerTime() {
    const timeWrapper = document.createElement('div');
    timeWrapper.setAttribute('class', 'integral-video-player__time');

    this.player.addEventListener('timeupdate', (e) => {
      timeWrapper.innerHTML = this.getTime(e.target.currentTime, e.target.duration);
    });

    this.player.addEventListener('loadeddata', (e) => {
      timeWrapper.innerHTML = this.getTime(e.target.currentTime, e.target.duration);
    });

    return timeWrapper;
  }

  getTime(currentTime, duration) {
    return `${this.formatTime(currentTime)} / ${this.formatTime(duration)}`;
  }

  formatTime(timeInSeconds) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
    const seconds = Math.floor(timeInSeconds - minutes * 60 - hours * 3600);

    return `${!hours ? '' : (hours.toString().padStart(2, '0') + ':')}
      ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  volumeRange() {
    this.player.volume = 1;

    const volumeWrapper = document.createElement('div');
    volumeWrapper.setAttribute('class', 'integral-video-player__volume-wrapper');

    const volumeButton = document.createElement('button');
    volumeButton.setAttribute('class', 'integral-video-player__button');

    volumeButton.addEventListener('click', () => {
      if (this.player.volume) {
        this.lastVolumeValue = this.player.volume;
        this.player.volume = 0;
      } else {
        this.player.volume = this.lastVolumeValue;
      }
    });

    const volumeIcon = document.createElement('div');
    volumeIcon.setAttribute('class', 'integral-video-player__icon volume-icon');

    this.player.addEventListener('volumechange', (e) => {
      !e.target.volume ? volumeIcon.setAttribute('class', 'integral-video-player__icon mute-volume-icon')
        : volumeIcon.setAttribute('class', 'integral-video-player__icon volume-icon');

      volumeRange.value = e.target.volume;
    });

    const volumeRange = document.createElement('input');
    volumeRange.setAttribute('type', 'range');
    volumeRange.setAttribute('class', 'integral-video-player__range integral-video-player__volume-range');
    volumeRange.setAttribute('min', 0);
    volumeRange.setAttribute('max', 1);
    volumeRange.setAttribute('step', '0.02');

    volumeRange.addEventListener('input', (e) => {
      this.player.volume = e.target.value;
    });

    volumeButton.append(volumeIcon);
    volumeWrapper.append(volumeButton);
    volumeWrapper.append(volumeRange);

    return volumeWrapper;
  }

  fullscreenButton() {
    const fullscreenButton = document.createElement('button');
    fullscreenButton.setAttribute('class', 'integral-video-player__button');

    const fullscreenIcon = document.createElement('div');
    fullscreenIcon.setAttribute('class', 'integral-video-player__icon go-fullscreen-icon');

    fullscreenButton.addEventListener('click', () => {
      if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
        try {
          fullscreenIcon.classList.toggle('compress-fullscreen-icon');
          fullscreenIcon.classList.toggle('go-fullscreen-icon');

          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          fullscreenIcon.classList.toggle('compress-fullscreen-icon');
          fullscreenIcon.classList.toggle('go-fullscreen-icon');

          if (this.player.parentNode.requestFullscreen) {
            this.player.parentNode.requestFullscreen();
          } else if (this.player.parentNode.webkitRequestFullscreen) {
            this.player.parentNode.webkitRequestFullscreen();
          } else if (this.player.parentNode.msRequestFullscreen) {
            this.player.parentNode.msRequestFullscreen();
          }
        } catch (error) {
          console.error(error);
        }
      }
    });

    fullscreenButton.append(fullscreenIcon);

    return fullscreenButton;
  }
}