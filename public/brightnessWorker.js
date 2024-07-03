self.onmessage = function(e) {
    const { imageData, value, index } = e.data;
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] + value));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + value));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + value));
    }

    self.postMessage({ imageData, index, value });
};