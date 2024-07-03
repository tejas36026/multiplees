// perspectiveCurveWorker.js
self.onmessage = function(e) {
    const { imageData, value } = e.data;
    const width = imageData.width;
    const height = imageData.height;
    const pixels = imageData.data;
    
    const curveIntensity = value * 0.2; // Curve intensity
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const normalizedX = (x / width - 0.5) * 2;
            const normalizedY = (y / height - 0.5) * 2;
            const distortion = 1 + curveIntensity * (normalizedX * normalizedX);
            const sourceY = (normalizedY / distortion + 1) * height / 2;
            if (sourceY >= 0 && sourceY < height) {
                const sourceIndex = (x + Math.floor(sourceY) * width) * 4;
                const targetIndex = (x + y * width) * 4;
                for (let i = 0; i < 4; i++) {
                    pixels[targetIndex + i] = pixels[sourceIndex + i];
                }
            }
        }
    }
    
    self.postMessage({ imageData: imageData });
};