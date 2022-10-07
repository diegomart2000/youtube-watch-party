export const getVideoId = (urlString: string) => {
  const url = new URL(urlString);
  const params1 = new URLSearchParams(url.search);

  const pathRegx = /watch|embed|v/;
  const linkType = url.pathname.match(pathRegx)?.[0];
  let videoId = '';
  switch (linkType) {
    case "watch": {
      videoId = params1.get("v") ?? '';
      break;
    }
    case "embed":
    case "v": {
      videoId = url.pathname.split("/").pop() ?? '';
      break;
    }
  }

  return videoId;
}