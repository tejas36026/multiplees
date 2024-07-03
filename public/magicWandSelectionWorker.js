self.onmessage = function(e) {
    const { imageData, tolerance } = e.data;
    const width = imageData.width;
    const height = imageData.height;
    const mask = new Uint8Array(width * height);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (mask[y * width + x] === 0) {
                floodFill(imageData, mask, x, y, tolerance, width, height);
            }
        }
    }

    const maskImageData = new ImageData(width, height);
    for (let i = 0; i < mask.length; i++) {
        const index = i * 4;
        maskImageData.data[index] = maskImageData.data[index + 1] = maskImageData.data[index + 2] = 255;
        maskImageData.data[index + 3] = mask[i];
    }

    self.postMessage({ maskImageData });
};

function floodFill(imageData, mask, startX, startY, tolerance, width, height) {
    const stack = [{x: startX, y: startY}];
    const targetColor = getColorAt(imageData, startX, startY);
    const label = Math.floor(Math.random() * 254) + 1; // Random label between 1 and 255

    while (stack.length) {
        const {x, y} = stack.pop();
        if (x < 0 || x >= width || y < 0 || y >= height || mask[y * width + x] !== 0) continue;

        const currentColor = getColorAt(imageData, x, y);
        if (colorDistance(targetColor, currentColor) <= tolerance) {
            mask[y * width + x] = label;
            stack.push({x: x + 1, y: y}, {x: x - 1, y: y}, {x: x, y: y + 1}, {x: x, y: y - 1});
        }
    }
}

function getColorAt(imageData, x, y) {
    const index = (y * imageData.width + x) * 4;
    return [
        imageData.data[index],
        imageData.data[index + 1],
        imageData.data[index + 2]
    ];
}

function colorDistance(color1, color2) {
    return Math.sqrt(
        Math.pow(color1[0] - color2[0], 2) +
        Math.pow(color1[1] - color2[1], 2) +
        Math.pow(color1[2] - color2[2], 2)
    );
}