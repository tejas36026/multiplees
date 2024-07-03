// perspectiveTwistWorker.js
self.onmessage = function(e) {
    const { imageData, value } = e.data;
    const width = imageData.width;
    const height = imageData.height;
    const pixels = imageData.data;
    
    const twistAngle = value * Math.PI; 
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const normalizedX = (x / width - 0.5) * 2;
            const normalizedY = (y / height - 0.5) * 2;
            const distance = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
            const angle = Math.atan2(normalizedY, normalizedX) + twistAngle * (1 - distance);
            const sourceX = (Math.cos(angle) * distance + 1) * width / 2;
            const sourceY = (Math.sin(angle) * distance + 1) * height / 2;
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