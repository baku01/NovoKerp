import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/Button'; // Assuming Button component is available
import { resizeImage } from '../../utils/imageUtils';

interface StockPhotoCaptureProps {
    onCapture: (imageDataUrl: string | null) => void;
    currentPhoto?: string | null; // To display an already captured photo
}

export const StockPhotoCapture: React.FC<StockPhotoCaptureProps> = ({ onCapture, currentPhoto }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startCamera = useCallback(async () => {
        setError(null);
        onCapture(null); // Clear any previous photo when starting camera
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
                setIsCameraActive(true);
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setError('Não foi possível acessar a câmera. Verifique as permissões.');
            setIsCameraActive(false);
        }
    }, [onCapture]);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraActive(false);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, [stream]);

    const takePhoto = useCallback(async () => { // Added async here
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const originalImageDataUrl = canvas.toDataURL('image/png');
                
                // Resize the image
                const resizedImageDataUrl = await resizeImage(originalImageDataUrl, 800, 600, 0.7); // Max 800px width, 600px height, 70% quality
                
                onCapture(resizedImageDataUrl); // Pass captured photo to parent
                stopCamera(); // Stop camera after taking photo
            }
        }
    }, [onCapture, stopCamera]);

    const clearPhoto = useCallback(() => {
        onCapture(null); // Clear photo in parent
        startCamera(); // Optionally restart camera for a new photo
    }, [onCapture, startCamera]);

    useEffect(() => {
        return () => {
            stopCamera(); // Cleanup camera stream on unmount
        };
    }, [stopCamera]);

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">Captura de Foto</h3>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            {!isCameraActive && !currentPhoto && (
                <Button onClick={startCamera}>Iniciar Câmera</Button>
            )}

            {isCameraActive && (
                <div className="flex flex-col items-center space-y-4">
                    <video ref={videoRef} className="w-full max-w-sm rounded-lg border border-slate-600" autoPlay playsInline muted />
                    <Button onClick={takePhoto}>Tirar Foto</Button>
                </div>
            )}

            {currentPhoto && (
                <div className="flex flex-col items-center space-y-4">
                    <img src={currentPhoto} alt="Captured" className="w-full max-w-sm rounded-lg border border-slate-600" />
                    <div className="flex gap-2">
                        <Button onClick={clearPhoto} variant="secondary">Retirar Foto</Button>
                        <Button onClick={startCamera}>Tirar Outra Foto</Button>
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

