self.onmessage = function(e) {
    const { imageData, value, index } = e.data;
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    const size = value;
    const rx = Math.sqrt(3) * size / 2;
    const ry = size / 2;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const hx = Math.round(x / rx) * rx;
            const hy = Math.round(y / ry) * ry;
            const dx = x - hx;
            const dy = y - hy;

            let centerX, centerY;
            if ((Math.abs(dx) * 3 > size) || (Math.abs(dy) * 2 > size)) {
                centerX = Math.round(x / (rx * 2)) * (rx * 2);
                centerY = Math.round(y / (ry * 2)) * (ry * 2);
            } else {
                centerX = hx;
                centerY = hy;
            }

            centerX = Math.max(0, Math.min(width - 1, centerX));
            centerY = Math.max(0, Math.min(height - 1, centerY));

            const sourceIndex = (Math.floor(centerY) * width + Math.floor(centerX)) * 4;
            const targetIndex = (y * width + x) * 4;

            data[targetIndex] = data[sourceIndex];
            data[targetIndex + 1] = data[sourceIndex + 1];
            data[targetIndex + 2] = data[sourceIndex + 2];
        }
    }

    self.postMessage({ imageData, index, value });
};