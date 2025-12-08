import React, { useState } from 'react';
import { ProductionOrder, ProductionOrderInput, ProductionOrderUpdateInput, ProductionOrderItemInput } from './types';
import { useProductionOrderDetail, useProductionOrderMutations } from './useProductionOrders';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { format } from 'date-fns';
import { jsonDate } from '../../utils/formatters';

interface ProductionOrderFormProps {
    order?: ProductionOrder | null;
    worksiteId: number;
    worksiteName?: string;
    onClose: () => void;
    onSaved: () => void;
}

const ProductionOrderFormContent: React.FC<ProductionOrderFormProps> = ({ 
    order, 
    worksiteId, 
    worksiteName, 
    onClose, 
    onSaved 
}) => {
    // Mutations
    const { 
        createOrder, 
        updateOrder, 
        deleteOrder, 
        createItem, 
        deleteItem, 
        createSituation, 
        deleteSituation, 
        uploadProject, 
        deleteProject 
    } = useProductionOrderMutations();

    // Queries (only if editing)
    const { items, situations, projects, refetch } = useProductionOrderDetail(order?.po_nume || null);

    // Form State (Header)
    const [poNume] = useState<number>(order?.po_nume || 0);
    const [osNume, setOsNume] = useState<string>(order?.os_nume || '');
    const [poDesc, setPoDesc] = useState<string>(order?.po_desc || '');
    const [poPlan, setPoPlan] = useState<string>(order?.po_plan || '');
    const [poSoli, setPoSoli] = useState<string>(order?.po_soli || '');
    const [poDtnc, setPoDtnc] = useState<Date>(order?.po_dtnc ? new Date(order.po_dtnc) : new Date());
    const [poDtpi, setPoDtpi] = useState<Date>(order?.po_dtpi ? new Date(order.po_dtpi) : new Date());
    const [poHrdi, setPoHrdi] = useState<number>(order?.po_hrdi || 0);
    const [psSitu, setPsSitu] = useState<string>(order?.ps_situ || '');

    // New Item State
    const [newItemDesc, setNewItemDesc] = useState<string>('');

    // New Situation State
    const [newSituation, setNewSituation] = useState<string>('');

    // Derived
    const isEditing = !!order;

    const handleSaveHeader = () => {
        if (isEditing) {
            const updateData: ProductionOrderUpdateInput = {
                po_nume: poNume,
                po_desc: poDesc,
                po_plan: poPlan,
                po_soli: poSoli,
                po_dtnc: poDtnc,
                po_dtpi: poDtpi,
                po_hrdi: poHrdi
            };
            updateOrder.mutate(updateData, {
                onSuccess: () => {
                    alert('Cabeçalho atualizado com sucesso!');
                    onSaved();
                },
                onError: () => alert('Erro ao atualizar cabeçalho.')
            });
        } else {
            const insertData: ProductionOrderInput = {
                id_clie: worksiteId,
                os_nume: osNume,
                po_desc: poDesc,
                po_plan: poPlan,
                po_soli: poSoli,
                po_dtnc: poDtnc,
                po_dtpi: poDtpi,
                po_hrdi: poHrdi,
                ps_situ: psSitu,
                pi_desc: newItemDesc
            };
            createOrder.mutate(insertData, {
                onSuccess: () => {
                    alert('Ordem criada com sucesso!');
                    onSaved();
                },
                onError: (err) => alert('Erro ao criar ordem: ' + err)
            });
        }
    };

    const handleDeleteOrder = () => {
        if (!confirm('Deseja excluir esta ordem de serviço?')) return;
        deleteOrder.mutate(poNume, {
            onSuccess: () => {
                onClose();
                onSaved();
            }
        });
    };

    const handleAddItem = () => {
        if (!newItemDesc.trim()) return;
        
        const headerData: ProductionOrderUpdateInput = {
            po_nume: poNume,
            po_desc: poDesc,
            po_plan: poPlan,
            po_soli: poSoli,
            po_dtnc: poDtnc,
            po_dtpi: poDtpi,
            po_hrdi: poHrdi
        };
        const itemData: ProductionOrderItemInput = {
            po_nume: poNume,
            pi_desc: newItemDesc
        };

        createItem.mutate({ header: headerData, item: itemData }, {
            onSuccess: () => {
                setNewItemDesc('');
                refetch();
            }
        });
    };

    const handleDeleteItem = (itemId: number) => {
        if (!confirm('Excluir item?')) return;
        deleteItem.mutate({ poNum: poNume, itemId }, {
            onSuccess: () => refetch()
        });
    };

    const handleAddSituation = () => {
        if (!newSituation.trim()) return;
        createSituation.mutate({ poNum: poNume, situation: newSituation }, {
            onSuccess: () => {
                setNewSituation('');
                setPsSitu(newSituation);
                refetch();
            }
        });
    };

    const handleDeleteSituation = (date: string, situation: string) => {
        if (!confirm('Excluir situação?')) return;
        deleteSituation.mutate({ poNum: poNume, date: new Date(date), situation }, {
            onSuccess: () => refetch()
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            uploadProject.mutate({ poNum: poNume, file }, {
                onSuccess: () => refetch()
            });
        }
    };

    const handleDeleteProject = (fileName: string) => {
        if (!confirm('Excluir arquivo?')) return;
        deleteProject.mutate({ poNum: poNume, fileName }, {
            onSuccess: () => refetch()
        });
    };

    const formatDate = (d: Date) => format(d, 'yyyy-MM-dd');

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                <h2 className="font-bold text-lg text-slate-800">
                    {isEditing ? `Editando OS #${poNume}` : 'Nova Ordem de Serviço'}
                </h2>
                <div className="flex space-x-2">
                    {isEditing && (
                        <Button variant="danger" onClick={handleDeleteOrder} size="sm">Excluir OS</Button>
                    )}
                    <Button variant="secondary" onClick={onClose} size="sm">Fechar</Button>
                    <Button variant="primary" onClick={handleSaveHeader} size="sm">Salvar Cabeçalho</Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input label="Obra (Read-only)" value={worksiteName || String(worksiteId)} readOnly />
                    <Input 
                        label="Proposta (OS)" 
                        value={osNume} 
                        onChange={(e) => setOsNume(e.target.value)}
                        readOnly={isEditing} 
                    />
                    <Input label="Descrição OS" value={poDesc} onChange={(e) => setPoDesc(e.target.value)} />
                    <Input label="Planejador" value={poPlan} onChange={(e) => setPoPlan(e.target.value)} />
                    <Input label="Solicitante" value={poSoli} onChange={(e) => setPoSoli(e.target.value)} />
                    <Input type="date" label="Necessidade" value={formatDate(poDtnc)} onChange={(e) => e.target.value && setPoDtnc(new Date(e.target.value))} />
                    <Input type="date" label="Previsão Início" value={formatDate(poDtpi)} onChange={(e) => e.target.value && setPoDtpi(new Date(e.target.value))} />
                    <Input type="number" label="Horas Disp." value={String(poHrdi)} onChange={(e) => setPoHrdi(Number(e.target.value))} />
                    
                    {!isEditing && (
                        <>
                            <Input label="Situação Inicial" value={psSitu} onChange={(e) => setPsSitu(e.target.value)} />
                            <Input label="Descrição Item Inicial" value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)} />
                        </>
                    )}
                </div>

                {isEditing && (
                    <>
                        <hr />
                        <div>
                            <h3 className="font-bold text-slate-700 mb-2">Itens</h3>
                            <div className="flex space-x-2 mb-2">
                                <Input 
                                    placeholder="Descrição do novo item" 
                                    value={newItemDesc} 
                                    onChange={(e) => setNewItemDesc(e.target.value)} 
                                    className="flex-1"
                                />
                                <Button onClick={handleAddItem} size="sm">Adicionar</Button>
                            </div>
                            <ul className="space-y-2">
                                {items.map((item) => (
                                    <li key={item.id_item} className="p-2 border rounded flex justify-between items-center bg-slate-50">
                                        <span className="text-sm"><b>{item.id_item}:</b> {item.pi_desc}</span>
                                        <button onClick={() => handleDeleteItem(item.id_item)} className="text-red-500 hover:text-red-700">
                                            <i className="material-icons text-sm">delete</i>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <hr />

                        <div>
                            <h3 className="font-bold text-slate-700 mb-2">Situações</h3>
                            <div className="flex space-x-2 mb-2">
                                <Input 
                                    placeholder="Nova situação" 
                                    value={newSituation} 
                                    onChange={(e) => setNewSituation(e.target.value)} 
                                    className="flex-1"
                                />
                                <Button onClick={handleAddSituation} size="sm">Adicionar</Button>
                            </div>
                            <ul className="space-y-2">
                                {situations.map((sit, idx) => (
                                    <li key={idx} className="p-2 border rounded flex justify-between items-center bg-slate-50">
                                        <div className="text-sm">
                                            <div className="font-medium">{sit.ps_situ}</div>
                                            <div className="text-xs text-slate-500">{jsonDate(sit.ps_data)}</div>
                                        </div>
                                        <button onClick={() => handleDeleteSituation(sit.ps_data, sit.ps_situ)} className="text-red-500 hover:text-red-700">
                                            <i className="material-icons text-sm">delete</i>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <hr />

                        <div>
                            <h3 className="font-bold text-slate-700 mb-2">Projetos (Anexos)</h3>
                            <div className="mb-2">
                                <input type="file" accept="application/pdf" onChange={handleFileUpload} className="text-sm" />
                            </div>
                            <ul className="space-y-2">
                                {projects.map((proj, idx) => (
                                    <li key={idx} className="p-2 border rounded flex justify-between items-center bg-slate-50">
                                        <a 
                                            href="#" 
                                            className="text-blue-600 hover:underline text-sm font-medium"
                                        >
                                            {proj.ex_sdir}
                                        </a>
                                        <button onClick={() => handleDeleteProject(proj.ex_sdir)} className="text-red-500 hover:text-red-700">
                                            <i className="material-icons text-sm">delete</i>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export const ProductionOrderForm: React.FC<ProductionOrderFormProps> = (props) => {
    return (
        <ProductionOrderFormContent 
            key={props.order?.po_nume || 'new'} 
            {...props} 
        />
    );
};