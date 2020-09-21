function forceDownload(blob, filename) {
  const a = document.createElement('a');
  a.download = filename;
  a.href = blob;
  // For Firefox https://stackoverflow.com/a/32226068
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Current blob size limit is around 500MB for browsers
function downloadResource(url, name) {

  const filenameFromUrl = url.split('\\').pop().split('/').pop();
  const filename = name || filenameFromUrl;
  fetch(url, {
    headers: new Headers({
      Origin: window.location.origin
    }),
    mode: 'cors'
  })
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      forceDownload(blobUrl, filename);
    })
    .catch((e) => console.error(e));
}

export {
  forceDownload,
  downloadResource
};
