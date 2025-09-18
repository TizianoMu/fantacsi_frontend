import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Funzione helper per ottenere l'immagine ritagliata come Blob
export async function getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            const croppedFile = new File([blob], fileName, { type: blob.type });
            resolve(croppedFile);
        }, 'image/png');
    });
}

const MAX_PREVIEW_WIDTH = 600; // Larghezza massima per l'anteprima del cropper

function getResizedCanvas(image, maxWidth) {
    if (image.naturalWidth <= maxWidth) {
        return null; // Nessun ridimensionamento necessario
    }

    const scale = maxWidth / image.naturalWidth;
    const canvas = document.createElement('canvas');
    canvas.width = maxWidth;
    canvas.height = image.naturalHeight * scale;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(
        image,
        0, 0,
        image.naturalWidth, image.naturalHeight,
        0, 0,
        canvas.width, canvas.height
    );
    return canvas;
}

const ImageCropper = ({ imageSrc, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        const resizedCanvas = getResizedCanvas(e.currentTarget, MAX_PREVIEW_WIDTH);
        if (resizedCanvas) {
            // Se l'immagine è stata ridimensionata, usiamo le dimensioni del canvas
            imgRef.current.src = resizedCanvas.toDataURL();
        }

        const initialCrop = centerCrop(
            makeAspectCrop({ unit: '%', width: 90 }, 1, width, height),
            width,
            height
        );
        setCrop(initialCrop);
        setCompletedCrop(initialCrop);
    }

    const handleSaveCrop = async () => {
        if (completedCrop?.width && completedCrop?.height && imgRef.current) {
            const croppedImageFile = await getCroppedImg(imgRef.current, completedCrop, "cropped_image.png");
            onCropComplete(croppedImageFile);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={c => setCompletedCrop(c)}
                aspect={1}
                circularCrop={true}
            >
                <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imageSrc}
                    onLoad={onImageLoad}
                    style={{ maxHeight: '60vh', margin: '0 auto', display: 'block' }}
                />
            </ReactCrop>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
                <button type="button" className="button cancel" onClick={onCancel}>
                    Annulla
                </button>
                <button type="button" className="button save" onClick={handleSaveCrop}>
                    Ritaglia e Salva
                </button>
            </div>
        </div>
    );
};

export default ImageCropper;