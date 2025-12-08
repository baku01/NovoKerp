import React, { useRef } from 'react';
import { useRdoPhotos } from './useDailyReports';
import { DailyReport } from './types';
import { jsonDate } from '../../utils/formatters';

interface Props {
    report: DailyReport;
    onClose: () => void;
}

export const DailyReportPhotos: React.FC<Props> = ({ report, onClose }) => {
    const { photos, isLoading, uploadPhoto, deletePhoto, isUploading, isDeleting } = useRdoPhotos(report);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Convert to Base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            if (base64) {
                try {
                    await uploadPhoto(base64);
                } catch (err) {
                    console.error(err);
                    alert('Erro ao enviar foto.');
                }
            }
        };
        reader.readAsDataURL(file);
        
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (fileName: string) => {
        if (window.confirm('Excluir esta foto?')) {
            try {
                await deletePhoto(fileName);
            } catch (err) {
                console.error(err);
                alert('Erro ao excluir foto.');
            }
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                    <h2 className="font-bold text-slate-800">{report.cl_fant}</h2>
                    <p className="text-sm text-slate-500">RDO: {jsonDate(report.ro_data)}</p>
                </div>
                <div className="flex space-x-2">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        capture="environment" // Prefer rear camera on mobile
                        onChange={handleFileChange}
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm font-medium flex items-center"
                    >
                        {isUploading ? 'Enviando...' : (
                            <>
                                <span className="mr-1 text-lg">+</span> Foto
                            </>
                        )}
                    </button>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 px-2 text-xl">
                        ✕
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-100">
                {isLoading ? (
                    <div className="text-center py-8 text-slate-400">Carregando fotos...</div>
                ) : photos.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 flex flex-col items-center">
                        <span className="text-4xl mb-2">📷</span>
                        <span>Nenhuma foto neste RDO.</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {photos.map((photo, idx) => (
                            <div key={idx} className="relative group bg-white p-1 rounded shadow border border-slate-200 aspect-square">
                                <img 
                                    src={photo.ro_foto} 
                                    alt={photo.nm_foto} 
                                    className="w-full h-full object-cover rounded cursor-pointer"
                                    onClick={() => window.open(photo.ro_foto, '_blank')}
                                />
                                <button
                                    onClick={() => handleDelete(photo.nm_foto)}
                                    disabled={isDeleting}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                                    title="Excluir"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
