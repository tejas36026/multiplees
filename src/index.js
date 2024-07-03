
        const imageUpload = document.getElementById('imageUpload');
        const resultsContainer = document.getElementById('resultsContainer');
        const effectControls = document.getElementById('effectControls');
        const imageCountInput = document.getElementById('imageCount');
        const processButton = document.getElementById('processButton');
        const masterCheckbox = document.getElementById('masterCheckbox');

        const effects = [
            'brightness', 'hue', 'saturation', 'vintage', 'ink', 'vibrance', 'denoise',
            'hexagonalPixelate', 'invert',  'bulgePinch', 'swirl',
            'lensBlur', 'tiltShiftBlur', 'triangularBlur', 'zoomBlur', 'edgeWork',
            'dotScreen', 'colorHalftone',
             'perspectiveTilt', 'perspectiveSqueeze', 
            'perspectiveCurve', 'perspectiveTwist', 'perspectiveFisheye',
            'perspective',
            'perspectiveRotate',
            'perspectiveSkew',
            'perspectiveWarp',
            'perspectiveZoom',
            'perspectiveTunnel',
            'perspectiveSphere',
            'perspectiveCylinder',
            'perspectiveRipple',
            'perspectiveVortex',
            'perspectiveFold',
            'perspectivePixelate',
            'perspectiveEmboss',
            'perspectiveMosaic',
            'perspectiveOilPainting',
            'perspectivePosterize'



        ];

        const workers = {};
        effects.forEach(effect => {
            workers[effect] = new Worker(`${effect}Worker.js`);
        });

        let processedImages = {};
        const fastProcessButton = document.getElementById('fastProcessButton');

        processButton.addEventListener('click', processSelectedImage);
        fastProcessButton.addEventListener('click', fastProcessSelectedImage);


        masterCheckbox.addEventListener('change', toggleAllEffects);

        // Create checkboxes for each effect
        effects.forEach(effect => {
            const controlDiv = document.createElement('div');
            controlDiv.className = 'effect-control';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `${effect}Checkbox`;
            checkbox.checked = true; // Default to checked
            checkbox.addEventListener('change', updateMasterCheckbox);

            const label = document.createElement('label');
            label.htmlFor = `${effect}Checkbox`;
            label.textContent = effect;

            controlDiv.appendChild(checkbox);
            controlDiv.appendChild(label);
            effectControls.appendChild(controlDiv);
        });

        function toggleAllEffects() {
            const isChecked = masterCheckbox.checked;
            effects.forEach(effect => {
                const checkbox = document.getElementById(`${effect}Checkbox`);
                checkbox.checked = isChecked;
            });
        }

        function updateMasterCheckbox() {
            const allChecked = effects.every(effect => document.getElementById(`${effect}Checkbox`).checked);
            const anyChecked = effects.some(effect => document.getElementById(`${effect}Checkbox`).checked);
            masterCheckbox.checked = allChecked;
            masterCheckbox.indeterminate = anyChecked && !allChecked;
        }

        // function processSelectedImage() {
        //     const file = imageUpload.files[0];
        //     if (file) {
        //         const objectUrl = URL.createObjectURL(file);
        //         const img = new Image();
        //         img.onload = function() {
        //             URL.revokeObjectURL(objectUrl);
        //             processImage(img);
        //         }
        //         img.src = objectUrl;
        //     } else {
        //         alert('Please select an image first.');
        //     }
        // }
       
        function processSelectedImage() {
    processImageWithMethod(processImage);
}

function fastProcessSelectedImage() {
    processImageWithMethod(fastProcessImage);
}
       
function updateEffectDisplay(effect) {
    const effectButton = document.querySelector(`.effect-button[data-effect="${effect}"]`);
    if (effectButton) {
        effectButton.classList.add('processed');
    }
}
    
async function fastProcessImage(img) {
    processedImages = {};
    const imageCount = parseInt(imageCountInput.value);

    displayEffectButtons();

    const effectPromises = effects.map(async (effect) => {
        processedImages[effect] = [];
        const customRange = null;

        for (let i = 0; i < imageCount; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let value = getEffectValue(effect, i, imageCount, customRange);

            try {
                const processedImageData = await applyEffect(effect, imageData, value);
                ctx.putImageData(processedImageData, 0, 0);

                processedImages[effect].push({
                    value: value,
                    dataUrl: canvas.toDataURL()
                });

                updateEffectDisplay(effect);
            } catch (error) {
                console.error(`Error processing effect ${effect} for image ${i+1}:`, error);
            }
        }
    });

    await Promise.all(effectPromises);

    console.log("All effects processed");
    displayProcessedImages();
}


function processImageWithMethod(processingMethod) {
    const file = imageUpload.files[0];
    if (file) {
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = function() {
            URL.revokeObjectURL(objectUrl);
            processingMethod(img);
        }
        img.src = objectUrl;
    } else {
        alert('Please select an image first.');
    }
}

async function processImage(img) {
    // console.log("Starting processImage function");
    processedImages = {};
    const imageCount = parseInt(imageCountInput.value);
    // console.log(`Processing ${imageCount} images for each effect`);

    displayEffectButtons(); // Create buttons immediately

    for (const effect of effects) {
        // console.log(`Processing effect: ${effect}`);
        processedImages[effect] = [];
        const customRange = null;

        for (let i = 0; i < imageCount; i++) {
            // console.log(`Processing image ${i+1} for effect ${effect}`);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let value = getEffectValue(effect, i, imageCount, customRange);

            try {
                const processedImageData = await applyEffect(effect, imageData, value);
                ctx.putImageData(processedImageData, 0, 0);

                processedImages[effect].push({
                    value: value,
                    dataUrl: canvas.toDataURL()
                });

                // Update display after each image is processed
                updateEffectDisplay(effect);
            } catch (error) {
                console.error(`Error processing effect ${effect} for image ${i+1}:`, error);
            }
        }
    }

    console.log("All effects processed");
}

function displayProcessedImages() {
            resultsContainer.innerHTML = '';
            for (const effect in processedImages) {
                const images = processedImages[effect];
                if (images && images.length > 0) {
                    const effectDiv = document.createElement('div');
                    effectDiv.className = 'effect-results';
                    const effectTitle = document.createElement('h3');
                    effectTitle.textContent = effect;
                    effectDiv.appendChild(effectTitle);

                    images.forEach((imgData, index) => {
                        const wrapper = document.createElement('div');
                        wrapper.className = 'canvas-wrapper';
                        const img = new Image();
                        img.src = imgData.dataUrl;
                        wrapper.appendChild(img);
                        effectDiv.appendChild(wrapper);
                    });

                    resultsContainer.appendChild(effectDiv);
                }
            }
        }

        function applyEffect(effect, imageData, value) {
            return new Promise((resolve, reject) => {
                if (!workers[effect]) {
                    reject(new Error(`Worker for effect ${effect} not found`));
                    return;
                }

                workers[effect].onmessage = function(e) {
                    if (e.data.error) {
                        reject(new Error(e.data.error));
                    } else {
                        resolve(e.data.imageData);
                    }
                };

                workers[effect].onerror = function(error) {
                    reject(error);
                };

                workers[effect].postMessage({
                    imageData: imageData,
                    value: value
                });
            });
        }

        function displayEffectButtons() {
    effectControls.innerHTML = '';
    effects.forEach(effect => {
        const button = document.createElement('button');
        button.className = 'effect-button';
        button.textContent = effect;
        button.dataset.effect = effect;
        button.dataset.active = 'true'; // All effects start as active
        button.addEventListener('mouseenter', () => displayEffectImages(effect));
        // button.addEventListener('mouseleave', () => resultsContainer.innerHTML = '');
        button.addEventListener('click', () => toggleEffect(button));
        button.addEventListener('click', () => displayEffectImages(effect));

        effectControls.appendChild(button);
    });
}

function toggleEffect(button) {
    button.dataset.active = button.dataset.active === 'true' ? 'false' : 'true';
    button.classList.toggle('inactive');
}



function displayEffectImages(effect) {
    resultsContainer.innerHTML = '';
    const images = processedImages[effect];

    if (images && images.length > 0) {
        images.forEach((imgData, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'canvas-wrapper';
            const img = new Image();
            img.src = imgData.dataUrl;
            wrapper.appendChild(img);
            resultsContainer.appendChild(wrapper);
        });
    } else {
        resultsContainer.textContent = 'Processing...';
    }
}
        function getEffectValue(effect, index, count, customRange) {
            const t = index / (count - 1);
            if (customRange && customRange.length === 2) {
                return customRange[0] + t * (customRange[1] - customRange[0]);
            }

            switch(effect) {
                case 'brightness': return Math.floor(t * 510) - 255; // -255 to 255
                case 'hue': return Math.floor(t * 360); // 0 to 359
                case 'saturation': return t * 2; // 0 to 2
                case 'vintage': return t; // 0 to 1
                case 'ink': return t * 4; // 0 to 4
                case 'vibrance': return t * 2 - 1; // -1 to 1
                case 'denoise': return t * 50; // 0 to 50
                case 'hexagonalPixelate': return t * 50 + 1; // 1 to 51
                case 'invert': return t; // 0 to 1
                case 'perspective': return [t, 1-t, t, 1-t]; // 0 to 1 for each corner
                case 'bulgePinch': return [t, t * 2 - 1]; // 0 to 1 for strength, -1 to 1 for radius
                case 'swirl': return (t - 0.5) * 10; // -5 to 5
                case 'lensBlur': return t * 50; // 0 to 50
                case 'tiltShiftBlur': return [t, 1-t]; // 0 to 1 for start and end
                case 'triangularBlur': return t * 50; // 0 to 50
                case 'zoomBlur': return [t, t]; // 0 to 1 for strength and center
                case 'edgeWork': return t * 10 + 1; // 1 to 11
                case 'dotScreen': return t * 10; // 0 to 10
                case 'colorHalftone': return t * 10; // 0 to 10
                case 'perspectiveTilt':
                    // return t; // 0 to 1

                default: return t;
            }
        }

