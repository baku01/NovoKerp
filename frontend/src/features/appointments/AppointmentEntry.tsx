import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppointmentEntry } from './useAppointmentEntry';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { format } from 'date-fns';
import { AppointmentResource } from './types';

export const AppointmentEntry: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const idClie = parseInt(searchParams.get('idClie') || '0');
    const idOrds = parseInt(searchParams.get('idOrds') || '0');
    const clientName = searchParams.get('clientName') || '';

    const [date, setDate] = useState<Date>(new Date());
    const [selectedResources, setSelectedResources] = useState<AppointmentResource[]>([]);
    
    // Form State
    const [statusId, setStatusId] = useState<string>('');
    const [hours, setHours] = useState({
        ent1: '07:00',
        sai1: '12:00',
        ent2: '13:00',
        sai2: '17:00'
    });
    const [activityId, setActivityId] = useState<string>('');
    const [activityDesc, setActivityDesc] = useState('');
    const [justificationId, setJustificationId] = useState<string>('');
    const [responsibilityId, setResponsibilityId] = useState<string>('');
    const [observation, setObservation] = useState('');

    const { 
        resources, 
        activities, 
        statuses, 
        justifications, 
        responsibilities, 
        saveAppointment,
        isSaving 
    } = useAppointmentEntry(idClie, idOrds, date);

    // Derived Status Info
    const currentStatus = useMemo(() => 
        statuses.find(s => s.id_sirc.toString() === statusId), 
    [statuses, statusId]);

    // Handlers
    const handleToggleResource = (res: AppointmentResource) => {
        setSelectedResources(prev => {
            const exists = prev.find(r => r.id_matr === res.id_matr && r.fu_empr === res.fu_empr);
            if (exists) return prev.filter(r => r !== exists);
            return [...prev, res];
        });
    };

    const handleSave = async () => {
        if (selectedResources.length === 0) {
            alert('Selecione ao menos um recurso.');
            return;
        }
        if (!statusId) {
            alert('Selecione um status.');
            return;
        }

        // Separate Employees and Equipment
        const employees = selectedResources.filter(r => r.cb_tmdo !== 'EQP');
        const equipments = selectedResources.filter(r => r.cb_tmdo === 'EQP');

        const idsMatr = employees.map(e => `${e.id_matr}${e.fu_empr}`).join(', '); // Legacy format: "123EMPR, 456EMPR"
        // Wait, legacy `lcIdMatr += gmSmRcsoCOA[i].id_matr.toString() + gmSmRcsoCOA[i].fu_empr...`
        // Yes, concatenated ID + Company.
        
        const idsEqto = equipments.map(e => e.id_matr.toString()).join(', ');

        // Hours to Decimal
        const toDecimal = (time: string) => {
            if (!time) return 0;
            const [h, m] = time.split(':').map(Number);
            return parseFloat(`${h}.${m}`); // Legacy "Clock Decimal"
        };

        try {
            await saveAppointment({
                ids_matr: idsMatr,
                ids_eqto: idsEqto,
                // Legacy uses `sltStrcCOA` (Status Resource) vs `sltSircCOA` (Situation).
                id_strc: 1, // Assuming Active by default
                id_sirc: parseInt(statusId),
                
                ap_hent: toDecimal(hours.ent1),
                ap_hiin: toDecimal(hours.sai1),
                ap_htin: toDecimal(hours.ent2),
                ap_hter: toDecimal(hours.sai2),
                
                id_ativ: parseInt(activityId) || 0,
                ap_datv: activityDesc,
                
                id_just: parseInt(justificationId) || 0,
                id_rpju: parseInt(responsibilityId) || 0,
                ap_obju: observation,
                
                ap_feri: 0 // Checkbox for holiday? I'll skip for MVP or add later.
            });
            
            alert('Apontamento salvo!');
            setSelectedResources([]); // Clear selection
            navigate(-1);
        } catch (e) {
            alert('Erro ao salvar apontamento.');
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Novo Apontamento</h1>
                    <p className="text-sm text-slate-500">{clientName}</p>
                </div>
                <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Voltar</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Resource Selection */}
                <div className="bg-white p-4 rounded-lg shadow lg:col-span-1 flex flex-col max-h-[600px]">
                    <h2 className="font-semibold text-slate-700 mb-2">Recursos Disponíveis</h2>
                    <Input 
                        type="date" 
                        value={format(date, 'yyyy-MM-dd')} 
                        onChange={(e) => e.target.value && setDate(new Date(e.target.value))}
                        className="mb-4"
                    />
                    <div className="flex-1 overflow-y-auto space-y-2 border border-slate-100 rounded p-2">
                        {resources.map(res => (
                            <div 
                                key={`${res.id_matr}-${res.fu_empr}`}
                                onClick={() => handleToggleResource(res)}
                                className={`
                                    p-2 rounded border cursor-pointer flex justify-between items-center
                                    ${selectedResources.includes(res) 
                                        ? 'bg-blue-50 border-blue-500' 
                                        : 'hover:bg-slate-50 border-slate-200'}
                                `}
                            >
                                <div>
                                    <div className="font-medium text-sm">{res.fu_nome}</div>
                                    <div className="text-xs text-slate-500">{res.fu_func}</div>
                                </div>
                                {selectedResources.includes(res) && <span className="text-blue-600">✓</span>}
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 text-right text-sm text-slate-500">
                        {selectedResources.length} selecionados
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white p-4 rounded-lg shadow lg:col-span-2 space-y-4">
                    <h2 className="font-semibold text-slate-700">Dados do Apontamento</h2>
                    
                    <Select
                        label="Situação"
                        options={statuses.map(s => ({ value: s.id_sirc, label: s.sr_deno }))}
                        value={statusId}
                        onChange={(e) => setStatusId(e.target.value)}
                    />

                    {/* Working Fields */}
                    {currentStatus?.sr_trab === 1 && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Input label="Entrada 1" type="time" value={hours.ent1} onChange={e => setHours({...hours, ent1: e.target.value})} />
                                <Input label="Saída 1" type="time" value={hours.sai1} onChange={e => setHours({...hours, sai1: e.target.value})} />
                                <Input label="Entrada 2" type="time" value={hours.ent2} onChange={e => setHours({...hours, ent2: e.target.value})} />
                                <Input label="Saída 2" type="time" value={hours.sai2} onChange={e => setHours({...hours, sai2: e.target.value})} />
                            </div>

                            <Select
                                label="Atividade"
                                options={[{ value: '', label: 'Selecione...' }, ...activities.map(a => ({ value: a.id_ativ, label: a.at_deno }))]}
                                value={activityId}
                                onChange={(e) => setActivityId(e.target.value)}
                            />
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                    value={activityDesc}
                                    onChange={(e) => setActivityDesc(e.target.value.toUpperCase())}
                                />
                            </div>
                        </>
                    )}

                    {/* Justification Fields */}
                    {currentStatus?.sr_just === 1 && (
                        <>
                            <Select
                                label="Justificativa"
                                options={[{ value: '', label: 'Selecione...' }, ...justifications.map(j => ({ value: j.id_just, label: j.ju_deno }))]}
                                value={justificationId}
                                onChange={(e) => setJustificationId(e.target.value)}
                            />
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Observação</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                    value={observation}
                                    onChange={(e) => setObservation(e.target.value.toUpperCase())}
                                />
                            </div>
                        </>
                    )}
                    
                    <Select
                        label="Responsabilidade"
                        options={[{ value: '', label: 'Selecione...' }, ...responsibilities.map(r => ({ value: r.id_rpju, label: r.rj_deno }))]}
                        value={responsibilityId}
                        onChange={(e) => setResponsibilityId(e.target.value)}
                    />

                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                        >
                            {isSaving ? 'Salvando...' : 'Salvar Apontamento'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
