import { useState, useRef } from 'react';
import { Button } from '../../components/ui/Button';

interface Photo {
    id?: number;
    base64: string;
    name: string;
    timestamp: number;
}

interface StockPhotoManagerProps {
    itemName?: string;
    onPhotosChange?: (photos: Photo[]) => void;
}

export function StockPhotoManager({ itemName, onPhotosChange }: StockPhotoManagerProps) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];

        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem');
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            const base64 = reader.result as string;
            const newPhoto: Photo = {
                base64,
                name: file.name,
                timestamp: Date.now(),
            };

            const updatedPhotos = [...photos, newPhoto];
            setPhotos(updatedPhotos);
            onPhotosChange?.(updatedPhotos);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };

        reader.readAsDataURL(file);
    };

    const handleAddPhoto = () => {
        fileInputRef.current?.click();
    };

    const handleRemovePhoto = (index: number) => {
        const updatedPhotos = photos.filter((_, i) => i !== index);
        setPhotos(updatedPhotos);
        onPhotosChange?.(updatedPhotos);

        if (selectedPhotoIndex >= updatedPhotos.length) {
            setSelectedPhotoIndex(Math.max(0, updatedPhotos.length - 1));
        }
    };

    const openGallery = (index: number) => {
        setSelectedPhotoIndex(index);
        setIsGalleryOpen(true);
    };

    const closeGallery = () => {
        setIsGalleryOpen(false);
    };

    const nextPhoto = () => {
        setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
    };

    const prevPhoto = () => {
        setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                    Fotos {itemName && `- ${itemName}`}
                </h3>
                <Button onClick={handleAddPhoto} size="sm">
                    Adicionar Foto
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {/* Thumbnail Grid */}
            {photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                        <div
                            key={index}
                            className="relative group cursor-pointer"
                            onClick={() => openGallery(index)}
                        >
                            <img
                                src={photo.base64}
                                alt={`Foto ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-white/20 group-hover:border-blue-500 transition-all"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemovePhoto(index);
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                ×
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                {new Date(photo.timestamp).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white/5 rounded-lg border border-white/20">
                    <p className="text-slate-400">Nenhuma foto adicionada</p>
                    <p className="text-slate-500 text-sm mt-2">
                        Clique no botão acima para adicionar fotos
                    </p>
                </div>
            )}

            {/* Gallery Modal */}
            {isGalleryOpen && photos.length > 0 && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center p-8">
                        {/* Close Button */}
                        <button
                            onClick={closeGallery}
                            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
                        >
                            ×
                        </button>

                        {/* Previous Button */}
                        {photos.length > 1 && (
                            <button
                                onClick={prevPhoto}
                                className="absolute left-4 text-white text-6xl hover:text-gray-300 z-10"
                            >
                                ‹
                            </button>
                        )}

                        {/* Main Image */}
                        <div className="max-w-4xl max-h-full flex flex-col items-center">
                            <img
                                src={photos[selectedPhotoIndex].base64}
                                alt={`Foto ${selectedPhotoIndex + 1}`}
                                className="max-w-full max-h-[80vh] object-contain"
                            />
                            <div className="mt-4 text-white text-center">
                                <p className="text-lg font-semibold">
                                    {itemName || photos[selectedPhotoIndex].name}
                                </p>
                                <p className="text-sm text-slate-300">
                                    Foto {selectedPhotoIndex + 1} de {photos.length}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {new Date(photos[selectedPhotoIndex].timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Next Button */}
                        {photos.length > 1 && (
                            <button
                                onClick={nextPhoto}
                                className="absolute right-4 text-white text-6xl hover:text-gray-300 z-10"
                            >
                                ›
                            </button>
                        )}

                        {/* Thumbnails */}
                        {photos.length > 1 && (
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
                                {photos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={photo.base64}
                                        alt={`Miniatura ${index + 1}`}
                                        onClick={() => setSelectedPhotoIndex(index)}
                                        className={`h-16 w-16 object-cover rounded cursor-pointer transition-all ${
                                            index === selectedPhotoIndex
                                                ? 'ring-2 ring-blue-500 opacity-100'
                                                : 'opacity-50 hover:opacity-75'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
