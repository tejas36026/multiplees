// segmentation-worker.js
self.onmessage = function(e) {
    const { imageData, colorThreshold, minRegionSize } = e.data;
    const segments = colorBasedSegmentation(imageData, colorThreshold, minRegionSize);
    self.postMessage({
        segments: segments,
        width: imageData.width,
        height: imageData.height
    });
};

function colorBasedSegmentation(imageData, colorThreshold, minRegionSize) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const visited = new Uint8Array(width * height);
    const segments = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!visited[y * width + x]) {
                const segment = floodFill(x, y, data, visited, width, height, colorThreshold);
                if (segment.size >= minRegionSize) {
                    segments.push(Array.from(segment));
                }
            }
        }
    }

    return segments;
}

function floodFill(startX, startY, data, visited, width, height, threshold) {
    const segment = new Set();
    const stack = [{x: startX, y: startY}];
    const startColor = getPixelColor(data, startX, startY, width);

    while (stack.length > 0) {
        const {x, y} = stack.pop();
        const index = y * width + x;

        if (x < 0 || x >= width || y < 0 || y >= height || visited[index]) continue;

        const color = getPixelColor(data, x, y, width);
        if (colorDistance(color, startColor) <= threshold) {
            visited[index] = 1;
            segment.add({x, y, ...color});

            stack.push({x: x + 1, y});
            stack.push({x: x - 1, y});
            stack.push({x, y: y + 1});
            stack.push({x, y: y - 1});
        }
    }

    return segment;
}

function getPixelColor(data, x, y, width) {
    const index = (y * width + x) * 4;
    return {
        r: data[index],
        g: data[index + 1],
        b: data[index + 2]
    };
}

function colorDistance(color1, color2) {
    const dr = color1.r - color2.r;
    const dg = color1.g - color2.g;
    const db = color1.b - color2.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
}