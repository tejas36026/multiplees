self.onmessage = function(e) {
    const { imageData, value, index } = e.data;
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const max = Math.max(data[i], data[i + 1], data[i + 2]);
        const amt = (max - avg) * value;
        data[i] += data[i] === max ? 0 : amt;
        data[i + 1] += data[i + 1] === max ? 0 : amt;
        data[i + 2] += data[i + 2] === max ? 0 : amt;
    }

    self.postMessage({ imageData, index, value });
};