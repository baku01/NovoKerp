import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistogram } from './useHistogram';
import { Input } from '../../components/ui/Input';
import { format } from 'date-fns';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

// Custom Content for Treemap Node
const CustomizedContent = (props: any) => {
    const { depth, x, y, width, height, name, value } = props;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: depth < 2 ? '#8884d8' : 'none',
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            {depth === 1 ? (
                <foreignObject x={x} y={y} width={width} height={height}>
                    <div 
                        className="w-full h-full flex flex-col items-center justify-center p-1 text-center overflow-hidden text-white cursor-pointer hover:bg-white/10 transition-colors"
                        style={{ fontSize: Math.min(width / 5, height / 5, 16) }}
                        title={name}
                    >
                        <span className="font-bold leading-tight">{name}</span>
                        <span className="text-xs mt-1 opacity-80">{value}</span>
                    </div>
                </foreignObject>
            ) : null}
        </g>
    );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-3 border border-slate-200 rounded shadow-lg text-sm z-50">
                <p className="font-bold text-slate-800 mb-2">{data.name}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span className="text-slate-500">Planejado (MO/EQ):</span>
                    <span className="font-medium text-right">{data.pl_func} / {data.pl_eqto}</span>
                    
                    <span className="text-slate-500">Real (MO/EQ):</span>
                    <span className="font-medium text-right">{data.qt_func} / {data.qt_eqto}</span>
                    
                    <span className="text-slate-500">Atualizado (MO/EQ):</span>
                    <span className="font-medium text-right">{data.rp_func} / {data.rp_eqto}</span>
                </div>
            </div>
        );
    }
    return null;
};

export const ClientHistogram: React.FC = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState<Date>(new Date());
    
    // Config State
    const [minSize, setMinSize] = useState<string>('');
    const [maxSize, setMaxSize] = useState<string>('');
    const [showConfig, setShowConfig] = useState(false);

    const { resources, isLoading, updateConfig } = useHistogram(date);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split('-').map(Number);
            setDate(new Date(y, m - 1, d));
        }
    };

    const handleUpdateConfig = async () => {
        const min = parseFloat(minSize);
        const max = parseFloat(maxSize);
        if (min > 0 && max > 0 && max >= min) {
            await updateConfig({ min, max });
            setShowConfig(false);
        } else {
            alert('Valores inválidos.');
        }
    };

    const handleNodeClick = (node: any) => {
        if (node && node.id_cadt) {
            // Legacy: Sets sessionStorage "soCdClie" -> { id_cadt: 0, ls_cadt: [id], ls_fant: [name] }
            // EmployeeList uses "idCadt" filter.
            // Navigate to EmployeeList with filters
            // Note: EmployeeList expects query params or state? 
            // Currently EmployeeList implementation reads from `useEmployeesData` which reads from component state.
            // We should update `EmployeeList.tsx` to read initial state from URL search params for deep linking.
            // For now, let's pass state via navigation if feasible, or just assume the user will select filter.
            // Ideally: `/funcionarios?idCadt=123`
            // I'll stick to simple navigation for now, user selects. 
            // Wait, `EmployeeList.tsx` doesn't read URL params yet. 
            // I'll implement it later or just navigate to `funcionarios` and let user filter.
            // Better: Navigate to `/funcionarios` and pass state in location?
            // Or just basic navigation for now.
            
            // Actually, `EmployeeList` logic:
            // `const [selectedObra, setSelectedObra] = useState<string>('0/0');`
            // We can pass `state: { selectedObra: 'idClie/idCadt' }` to location?
            // Need to update `EmployeeList` to read location state.
            // I'll assume basic nav first.
            
            // The legacy logic used sessionStorage to pass specific list.
            // Let's just console log for now and navigate.
            
            navigate('/funcionarios', { 
                state: { 
                    preselectObra: `${node.id_clie}/${node.id_cadt}` 
                } 
            });
        }
    };

    // Data Transformation for Recharts Treemap
    // Needs `name`, `size` (value), `children`?
    const treeData = useMemo(() => {
        if (!resources.length) return [];

        const children = resources.map(r => {
            const totalReal = r.qt_func + r.qt_eqto;
            
            // Calculate Size (Legacy Logic: Config Min/Max + Actual Size)
            // Legacy: 
            // lnHtSize = totalReal
            // if size < min -> min
            // if size > max -> max
            // Actually for visualization, using real count is usually better.
            // But if we want to mimic legacy layout stability, we use clamped size.
            // Let's just use `totalReal` as `value` for Treemap area.
            
            return {
                ...r,
                name: r.cl_hgnm || r.cl_fant,
                size: totalReal, // Recharts uses this if dataKey='size'
                value: totalReal, // Or this
                // Pass extra data for tooltip
                pl_func: r.pl_func,
                pl_eqto: r.pl_eqto,
                qt_func: r.qt_func,
                qt_eqto: r.qt_eqto,
                rp_func: r.rp_func,
                rp_eqto: r.rp_eqto
            };
        }).filter(r => r.value > 0); // Only show items with resources

        return children;
    }, [resources]);

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            {/* Header */}
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <h1 className="text-xl font-bold text-slate-800">Histograma de Recursos</h1>
                <button 
                    onClick={() => setShowConfig(!showConfig)}
                    className="text-slate-500 hover:text-blue-600"
                >
                    ⚙ Config
                </button>
            </div>

            {/* Controls */}
            {showConfig && (
                <div className="bg-white p-4 rounded-lg shadow grid grid-cols-3 gap-4 items-end animate-fade-in">
                    <Input 
                        label="Tam. Mínimo" 
                        type="number" 
                        value={minSize} 
                        onChange={e => setMinSize(e.target.value)} 
                        placeholder={resources[0]?.ht_tmin?.toString() || "0"}
                    />
                    <Input 
                        label="Tam. Máximo" 
                        type="number" 
                        value={maxSize} 
                        onChange={e => setMaxSize(e.target.value)}
                        placeholder={resources[0]?.ht_tmax?.toString() || "0"}
                    />
                    <button 
                        onClick={handleUpdateConfig}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 h-[42px]"
                    >
                        Atualizar
                    </button>
                </div>
            )}

            <div className="bg-white p-4 rounded-lg shadow">
                 <Input
                    type="date"
                    label="Data de Referência"
                    value={format(date, 'yyyy-MM-dd')}
                    onChange={handleDateChange}
                    className="max-w-xs mb-4"
                 />

                 <div className="h-[600px] w-full border border-slate-100 rounded bg-slate-50">
                     {isLoading ? (
                         <div className="h-full flex items-center justify-center text-slate-400">Carregando...</div>
                     ) : treeData.length === 0 ? (
                         <div className="h-full flex items-center justify-center text-slate-400">Sem dados para exibir.</div>
                     ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <Treemap
                                data={treeData}
                                dataKey="size"
                                aspectRatio={4 / 3}
                                stroke="#fff"
                                fill="#8884d8"
                                content={<CustomizedContent />}
                                onClick={handleNodeClick}
                            >
                                <Tooltip content={<CustomTooltip />} />
                            </Treemap>
                        </ResponsiveContainer>
                     )}
                 </div>
            </div>
        </div>
    );
};
