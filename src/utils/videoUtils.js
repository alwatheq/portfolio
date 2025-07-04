export const getEmbedUrl = (url) => {
  if (!url) return null;

  let videoId = null;
  let platform = null;

  // Check for YouTube URLs
  const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch && youtubeMatch[2].length === 11) {
    videoId = youtubeMatch[2];
    platform = 'youtube';
  }

  // Check for Vimeo URLs
  const vimeoRegex = /vimeo.com\/(?:video\/)?([0-9]+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    videoId = vimeoMatch[1];
    platform = 'vimeo';
  }

  if (platform === 'youtube') {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  if (platform === 'vimeo') {
    return `https://player.vimeo.com/video/${videoId}`;
  }

  // Return the original URL if it's not a recognized platform
  return url;
};
