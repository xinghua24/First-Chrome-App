chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('transform.html', {
    'outerBounds': {
      'width': 900,
      'height': 900
    }
  });
});