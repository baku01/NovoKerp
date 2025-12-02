import React, { useState, useEffect, useMemo } from 'react';

// Helper function to format date for JSON/API
const objectDateToSqlString = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

// Helper function to parse HTML date input to Date object
const htmlDateToObject = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

// Helper function to format date for display
const jsonDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

// Helper function to format decimals
const brDecimal = (value) => {
    return value ? value.toFixed(2).replace('.', ',') : '0,00';
};

// Simple Gauge Component (SVG based)
const Gauge = ({ value, size = 100, color = 'green', label, subLabel }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value * circumference);

    return (
        <div style={{ width: size, height: size, position: 'relative', display: 'inline-block', margin: '5px' }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth="10"
                />
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 50 50)"
                    strokeLinecap="round"
                />
            </svg>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                width: '100%'
            }}>
                <div style={{ fontSize: size * 0.2, fontWeight: 'bold', color: color }}>
                    {label}
                </div>
                {subLabel && (
                    <div style={{ fontSize: size * 0.1, color: '#666' }}>
                        {subLabel}
                    </div>
                )}
            </div>
        </div>
    );
};

const DashboardClient = ({ user, companyId, baseUrl }) => {
    // Use props or fallback to globals if available (for legacy compatibility)
    const currentUser = user || window.goCdUser;
    const currentCompanyId = companyId || window.gcIdEmpr;
    const apiBaseUrl = baseUrl || (currentUser && currentUser.ws_http ? currentUser.ws_http.trim() : '');

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHourType, setSelectedHourType] = useState('OC_QTHR'); // or 'PL_QTHR'
    const [works, setWorks] = useState([]);
    const [divergences, setDivergences] = useState([]);
    const [pendings, setPendings] = useState([]);
    const [hours, setHours] = useState([]);
    const [loading, setLoading] = useState(false);

    // Helper to fetch data
    const fetchData = async (procedure, params) => {
        const sqlParams = encodeURIComponent(JSON.stringify(params));
        const url = `${apiBaseUrl}chamadaProcedure?lcWkIsql=${sqlParams}&lcWkProc=${procedure}`;

        try {
            const response = await fetch(url);
            // The original code uses JSONP or expects JSON. 
            // Assuming the backend returns JSON for fetch. 
            // If it's strictly JSONP, we might need a different approach, 
            // but standard fetch works for most modern endpoints.
            // Given the legacy code used $.ajax with dataType: "jsonp", 
            // this might be a cross-origin request.
            // For this migration, we'll assume standard JSON response.
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${procedure}:`, error);
            return [];
        }
    };

    const refreshData = async () => {
        if (!currentUser || !currentCompanyId) return;

        setLoading(true);
        const dateStr = objectDateToSqlString(selectedDate);

        try {
            // 1. Fetch Works (Obras)
            const worksParams = [
                { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: currentUser.id_user.trim().toUpperCase() },
                { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: currentCompanyId },
                { pa_nome: "ldCaData", pa_tipo: "SmallDatetime", pa_valo: dateStr },
            ];
            const worksData = await fetchData('pesquisaDashboardObras', worksParams);
            setWorks(worksData);

            // 2. Fetch Divergences
            const divParams = [
                { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: currentUser.id_user.trim().toUpperCase() },
                { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: currentCompanyId },
                { pa_nome: "ldCaData", pa_tipo: "SmallDatetime", pa_valo: dateStr },
            ];
            const divData = await fetchData('pesquisaDashboardApontamentosDivergentes', divParams);
            setDivergences(divData);

            // 3. Fetch Pendings
            const pendParams = [
                { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: currentUser.id_user.trim().toUpperCase() },
                { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: currentCompanyId },
                { pa_nome: "ldCaData", pa_tipo: "SmallDatetime", pa_valo: dateStr },
            ];
            const pendData = await fetchData('pesquisaDashboardApontamentosPendentes', pendParams);
            setPendings(pendData);

            // 4. Fetch Hours
            const hoursParams = [
                { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: currentCompanyId },
                { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: null },
                { pa_nome: "ldAhData", pa_tipo: "SmallDatetime", pa_valo: dateStr },
            ];
            const hoursData = await fetchData('pesquisaHorasPremio', hoursParams);
            setHours(hoursData);

        } catch (error) {
            console.error("Error refreshing dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, [selectedDate]);

    const handleDateChange = (e) => {
        const newDate = htmlDateToObject(e.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (newDate > today) {
            setSelectedDate(today);
        } else {
            setSelectedDate(newDate);
        }
    };

    const handleCardClick = (work) => {
        // Logic to store in session and redirect
        sessionStorage.setItem("soCdClie", JSON.stringify(work));
        // Assuming a global redirect function exists or using window.location
        if (window.redireciona) {
            window.redireciona("custom/gre/dash/DashOsLcto.html", "DashOsLcto.html");
        } else {
            window.location.href = "DashOsLcto.html";
        }
    };

    // Process data for rendering
    const processedWorks = useMemo(() => {
        return works.map(work => {
            // Calculate metrics
            let plannedHours = 0;
            try {
                if (parseInt(work[selectedHourType]) > 0) {
                    plannedHours = parseInt(work[selectedHourType]);
                }
            } catch (e) { }

            const divergence = divergences.find(d => parseInt(d.id_cadt) === parseInt(work.id_cadt));
            const divergenceCount = divergence ? parseInt(divergence.qt_dvrg) : 0;

            const pending = pendings.find(p => parseInt(p.id_cadt) === parseInt(work.id_cadt));
            const pendingCount = pending ? parseInt(pending.qt_pndt) : 0;
            const totalPending = pending ? parseInt(pending.qt_tota) : 0;
            const pendingPercent = totalPending > 0 ? (pendingCount / totalPending) * 100 : 0;

            const rdoPending = parseInt(work.cl_qrdo) - parseInt(work.cl_qaro);
            const rdoTotal = parseInt(work.cl_qrdo);
            const rdoPercent = rdoTotal > 0 ? (rdoPending / rdoTotal) * 100 : 0;

            // Calculate gauge values
            let consumedHours = 0;
            let workedHours = 0;
            let totalMinutes = 0;

            hours.forEach(h => {
                if (parseInt(work.id_clie) === parseInt(h.id_clie)) {
                    totalMinutes += Math.floor(h.ah_hora) * 60 + (parseFloat(h.ah_hora) % 1) * 100;
                }
            });

            consumedHours = (parseInt(work.re_hrap) || 0) + Math.floor(totalMinutes / 60);
            workedHours = (parseInt(work.re_htap) || 0) + Math.floor(totalMinutes / 60);

            const baseHours = plannedHours === 0 ? 1 : plannedHours;
            const consumedPercent = (consumedHours / baseHours) * 100;
            const workedPercent = (workedHours / baseHours) * 100;

            return {
                ...work,
                plannedHours,
                divergenceCount,
                pendingCount,
                totalPending,
                pendingPercent,
                rdoPending,
                rdoTotal,
                rdoPercent,
                consumedPercent,
                workedPercent
            };
        });
    }, [works, divergences, pendings, hours, selectedHourType]);

    const getGaugeColor = (percent) => {
        if (percent <= 70) return 'rgba(0, 255, 0, 1)';
        if (percent <= 90) return 'rgba(255, 255, 0, 1)';
        if (percent <= 100) return 'rgba(255, 165, 0, 1)';
        return 'rgba(255, 0, 0, 1)';
    };

    return (
        <div className="dashboard-container" style={{ padding: '10px' }}>
            <div className="filters" style={{ marginBottom: '20px' }}>
                <div className="row">
                    <div className="col">
                        <label>Data Posição:</label>
                        <input
                            type="date"
                            id="datDataDCC"
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={handleDateChange}
                            style={{ width: '100%', padding: '5px' }}
                        />
                    </div>
                    <div className="col">
                        <label>Tipo Horas:</label>
                        <select
                            id="sltHoraDCC"
                            value={selectedHourType}
                            onChange={(e) => setSelectedHourType(e.target.value)}
                            style={{ width: '100%', padding: '5px' }}
                        >
                            <option value="OC_QTHR">Orçadas</option>
                            <option value="PL_QTHR">Planejadas</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading && <div>Carregando...</div>}

            <div className="works-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {processedWorks.map((work, index) => (
                    <div
                        key={work.id_cadt || index}
                        className="work-card"
                        onClick={() => handleCardClick(work)}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            padding: '15px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            backgroundColor: '#fff',
                            color: '#333'
                        }}
                    >
                        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{work.cl_fant.trim().toUpperCase()}</div>

                        <div className="gauges">
                            <Gauge
                                value={work.workedPercent / 100}
                                size={100}
                                color={getGaugeColor(work.workedPercent)}
                                label={`${brDecimal(work.workedPercent)}%`}
                                subLabel="trabalhadas"
                            />
                            <Gauge
                                value={work.consumedPercent / 100}
                                size={150}
                                color={getGaugeColor(work.consumedPercent)}
                                label={`${brDecimal(work.consumedPercent)}%`}
                                subLabel="totais consumidas"
                            />
                        </div>

                        <div className="details" style={{ textAlign: 'left', marginTop: '10px', fontSize: '0.9em' }}>
                            <div><b>{selectedHourType === 'OC_QTHR' ? 'hras orçadas:' : 'hras plan.:'}</b> {work.plannedHours}:00</div>
                            <div><b>último:</b> {jsonDate(work.ap_data)}</div>
                            <div><b>apt. dvrgnt.:</b> {work.divergenceCount}</div>
                            <div><b>apt. pend.:</b> {work.pendingCount} / {work.totalPending} = {brDecimal(work.pendingPercent)}%</div>
                            <div><b>rdo pend.:</b> {work.rdoPending} / {work.rdoTotal} = {brDecimal(work.rdoPercent)}%</div>
                            <div><b>desvio anterior:</b> {brDecimal(work.cl_dant)}%</div>
                            <div><b>avanço:</b> {brDecimal(work.cl_pavc)}%</div>
                            <div><b>data avanço:</b> {jsonDate(work.cl_dsac)}</div>
                            <div><b>avanço plan.:</b> {brDecimal(work.cl_papl)}%</div>
                            <div><b>desvio:</b> {brDecimal(work.cl_pavc - work.cl_papl)}%</div>
                            <div><b>mod:</b> {work.qt_modi}</div>
                            <div><b>mod atualização:</b> {work.qt_moda}</div>
                            <div><b>prev. término:</b> {jsonDate(work.cl_dtpt)}</div>
                            <div><b>término atualização:</b> {jsonDate(work.cl_dttr)}</div>
                            <div><b>término plan.:</b> {jsonDate(work.cl_dttp)}</div>
                            <div><b>encarregado:</b> {work.cl_enca.trim().toUpperCase()}</div>
                            <div><b>planejador:</b> {work.cl_plan.trim().toUpperCase()}</div>
                            <div><b>a faturar:</b> {brDecimal(work.cl_paft)}%</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardClient;
