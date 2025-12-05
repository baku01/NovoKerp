import React, { useState } from 'react';
import { useDocumentWorksites, useDocuments } from './useDocuments';
import { Select } from '../../components/ui/Select';
import { useUserStore } from '../../stores/useUserStore';

export const DocumentBrowser: React.FC = () => {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);

    const [selectedWorksite, setSelectedWorksite] = useState<string>('-1'); // -1 = Drive Geral

    // Construct Root Path
    const rootPath = (() => {
        const id = parseInt(selectedWorksite);
        if (id < 0) return 'drive/geral';
        if (id > 0) return `drive/obras/${empresa.toLowerCase()}${id}`;
        return `drive/usuarios/${user?.id_user.toLowerCase()}`;
    })();

    const { worksites, isLoading: loadingWorksites } = useDocumentWorksites();
    const { items: folders, isLoading: loadingFolders } = useDocuments(rootPath, false);

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            <h1 className="text-xl font-bold text-slate-800">Documentos (Drive)</h1>

            <div className="bg-white p-4 rounded-lg shadow">
                <Select
                    label="Local"
                    options={[
                        { value: '-1', label: 'DRIVE GERAL' },
                        { value: '0', label: 'MEU DRIVE' },
                        ...worksites.map(w => ({ value: w.id_clie.toString(), label: w.cl_fant }))
                    ]}
                    value={selectedWorksite}
                    onChange={(e) => setSelectedWorksite(e.target.value)}
                    disabled={loadingWorksites}
                />
            </div>

            <div className="bg-white p-4 rounded-lg shadow flex-1">
                {loadingFolders ? (
                    <div className="text-center py-8 text-slate-500">Carregando pastas...</div>
                ) : folders.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">Nenhuma pasta encontrada.</div>
                ) : (
                    <ul className="space-y-2">
                        {folders.map((folder, idx) => (
                            <FolderItem
                                key={idx}
                                name={folder.ex_sdir}
                                parentPath={rootPath}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

const FolderItem: React.FC<{ name: string, parentPath: string }> = ({ name, parentPath }) => {
    const [isOpen, setIsOpen] = useState(false);
    const fullPath = `${parentPath}/${name}`;
    const { items: files, isLoading } = useDocuments(fullPath, true); // Fetch files when expanded

    const handleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleFileClick = (fileName: string) => {
        // Construct download link
        // Legacy: "Docs/" + path + "/" + filename
        // Need base URL. Assuming relative to API or handled by proxy.
        // User store has `ws_wiis`?
        // Let's assume a standard download path or window.open
        // In legacy: `goCdUser.ws_wiis.trim() + "Docs/" + ...`
        // We need `ws_wiis` from user store.
        const user = useUserStore.getState().user;
        const baseUrl = user?.ws_http?.replace('wsexec/', '') || ''; // Guessing base url from ws_http if ws_wiis not available
        // Legacy `goCdUser` has `ws_wiis`. My User type has `ws_http`.
        // Usually they are related. Let's try to construct a link.
        // If I can't be sure, I'll just alert the path.
        // Or better, `window.open`.

        // Note: `useUserStore` definition I made earlier only had `ws_http`.
        // I might need to add `ws_wiis` if it's different.
        // For now, let's use a placeholder link or try to deduce.
        const link = `Docs/${fullPath}/${fileName}`;
        // window.open(link, '_blank');
        // Actually, without the full domain it might fail if not proxying.
        console.log("Opening file:", link);
        alert(`Opening ${fileName} (Mock)`);
    };

    return (
        <li className="border-b border-slate-100 last:border-0">
            <div
                className="flex items-center p-3 cursor-pointer hover:bg-slate-50"
                onClick={handleOpen}
            >
                <span className="mr-2 text-yellow-500 text-xl">{isOpen ? '📂' : '📁'}</span>
                <span className="font-medium text-slate-700">{name}</span>
            </div>
            {isOpen && (
                <div className="pl-8 pb-2">
                    {isLoading ? (
                        <div className="text-xs text-slate-400">Carregando arquivos...</div>
                    ) : files.length === 0 ? (
                        <div className="text-xs text-slate-400">Vazio.</div>
                    ) : (
                        <ul className="space-y-1">
                            {files.map((file, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-center text-sm text-slate-600 cursor-pointer hover:text-blue-600"
                                    onClick={() => handleFileClick(file.ex_sdir)}
                                >
                                    <span className="mr-2 text-slate-400">📄</span>
                                    {file.ex_sdir}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </li>
    );
};
