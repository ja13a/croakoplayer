import '~/styles/styles.scss';

import { IntegralVideoPlayer } from './js/integralVideoPlayer';
import testVideo from './videos/video.mp4';

window.onload = () => {
  (new IntegralVideoPlayer(testVideo, document.getElementById('root')));
};
