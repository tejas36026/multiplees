// perspectiveFisheyeWorker.js
self.onmessage = function(e) {
    const { imageData, value } = e.data;
    const width = imageData.width;
    const height = imageData.height;
    const pixels = imageData.data;
    
    const fisheyeIntensity = value * 2; // Fisheye intensity
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const normalizedX = (x / width - 0.5) * 2;
            const normalizedY = (y / height - 0.5) * 2;
            const distance = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
            const r = distance / Math.sqrt(2);
            const theta = Math.atan2(normalizedY, normalizedX);
            const newR = Math.pow(r, fisheyeIntensity);
            const sourceX = (newR * Math.cos(theta) + 1) * width / 2;
            const sourceY = (newR * Math.sin(theta) + 1) * height / 2;
            if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height) {
                const sourceIndex = (Math.floor(sourceX) + Math.floor(sourceY) * width) * 4;
                const targetIndex = (x + y * width) * 4;
                for (let i = 0; i < 4; i++) {
                    pixels[targetIndex + i] = pixels[sourceIndex + i];
                }
            }
        }
    }
    
    self.postMessage({ imageData: imageData });
};