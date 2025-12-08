import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistogram } from './useHistogram';
import { Input } from '../../components/ui/Input';
import { format } from 'date-fns';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

// Custom Content for Treemap Node
const CustomizedContent = (props: any) => {
    const { depth, x, y, width, height, name, item, onEditName } = props;

    // Legacy: id_novo > 0 -> white text
    const textColor = item?.id_novo && item.id_novo > 0 ? 'text-white' : 'text-slate-100';
    
    // Legacy font size logic (approximate)
    const fontSize = Math.min(width / 5, height / 5, 16);

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
                        className={`w-full h-full flex flex-col items-center justify-center p-1 text-center overflow-hidden cursor-pointer hover:bg-white/10 transition-colors group relative ${textColor}`}
                        style={{ fontSize }}
                        title={name}
                    >
                        <span className="font-bold leading-tight">{name}</span>
                        <span className="text-xs mt-1 opacity-80">{item.totalReal}</span>
                        
                        {/* Edit Name Action (Visible on Hover) */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditName(item);
                            }}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-black/20 hover:bg-black/40 rounded p-1 transition-opacity text-white"
                            title="Renomear Obra"
                        >
                            ✎
                        </button>
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
            <div className="bg-white p-3 border border-slate-200 rounded shadow-lg text-sm z-50 text-slate-800">
                <p className="font-bold mb-2 border-b pb-1">{data.name}</p>
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

    const { resources, isLoading, updateConfig, updateName } = useHistogram(date);

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

    const handleEditName = async (item: any) => {
        const newName = prompt("Nome da obra no histograma:", item.cl_hgnm || item.cl_fant);
        if (newName !== null && newName.trim() !== "") {
            await updateName({ 
                idClie: item.id_clie, 
                name: newName.toUpperCase() 
            });
        }
    };

    const handleNodeClick = (node: any) => {
        if (node && node.id_cadt) {
            navigate('/funcionarios', { 
                state: { 
                    preselectObra: `${node.id_clie}/${node.id_cadt}` 
                } 
            });
        }
    };

    const treeData = useMemo(() => {
        if (!resources.length) return [];

        const children = resources.map(r => {
            const totalReal = r.qt_func + r.qt_eqto;
            
            // Legacy Size Calculation (Clamping)
            let displaySize = totalReal;
            if (r.ht_tmin && displaySize < r.ht_tmin) displaySize = r.ht_tmin;
            if (r.ht_tmax && displaySize > r.ht_tmax) displaySize = r.ht_tmax;
            
            return {
                ...r,
                name: r.cl_hgnm || r.cl_fant,
                size: displaySize, // Used for visual sizing
                totalReal: totalReal, // Actual value for display text
                // Pass extra data
                pl_func: r.pl_func,
                pl_eqto: r.pl_eqto,
                qt_func: r.qt_func,
                qt_eqto: r.qt_eqto,
                rp_func: r.rp_func,
                rp_eqto: r.rp_eqto,
                id_novo: r.id_novo
            };
        }).filter(r => (r.qt_func + r.qt_eqto + r.pl_func + r.pl_eqto) > 0); // Legacy filter: show if any activity

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
                                content={<CustomizedContent onEditName={handleEditName} />}
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
