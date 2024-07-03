// perspectiveSqueezeWorker.js
self.onmessage = function(e) {
    const { imageData, value } = e.data;
    const width = imageData.width;
    const height = imageData.height;
    const pixels = imageData.data;
    
    const squeeze = 1 - value * 0.5;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const normalizedX = (x / width - 0.5) * 2;
            const sourceX = (normalizedX * squeeze + 1) * width / 2;
            if (sourceX >= 0 && sourceX < width) {
                const sourceIndex = (Math.floor(sourceX) + y * width) * 4;
                const targetIndex = (x + y * width) * 4;
                for (let i = 0; i < 4; i++) {
                    pixels[targetIndex + i] = pixels[sourceIndex + i];
                }
            }
        }
    }
    
    self.postMessage({ imageData: imageData });
};