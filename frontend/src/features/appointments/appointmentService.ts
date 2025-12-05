import { callProcedure, createParam, apiClient } from '../../api/procedures';
import { 
    AppointmentResource, 
    AppointmentActivity, 
    AppointmentStatusOption, 
    Justification, 
    Responsibility, 
    AppointmentPayload,
    EmailConfig
} from './types';

export async function fetchResources(
    empresa: string,
    idClie: number,
    date: string
): Promise<AppointmentResource[]> {
    // Legacy: `pesquisaSomenteRecursos`
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', idClie),
        createParam('ldDrData', 'SmallDatetime', date),
    ];
    return callProcedure<AppointmentResource>('pesquisaSomenteRecursos', params);
}

export async function fetchActivities(
    empresa: string,
    idOrds: number
): Promise<AppointmentActivity[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdOrds', 'Int', idOrds),
    ];
    return callProcedure<AppointmentActivity>('pesquisaAtividades', params);
}

export async function fetchStatusOptions(empresa: string): Promise<AppointmentStatusOption[]> {
    const params = [createParam('lcIdEmpr', 'VarChar', empresa)];
    return callProcedure<AppointmentStatusOption>('pesquisaSituacoesRecurso', params);
}

export async function fetchJustifications(empresa: string): Promise<Justification[]> {
    const params = [createParam('lcIdEmpr', 'VarChar', empresa)];
    return callProcedure<Justification>('pesquisaJustificativas', params);
}

export async function fetchResponsibilities(empresa: string): Promise<Responsibility[]> {
    const params = [createParam('lcIdEmpr', 'VarChar', empresa)];
    return callProcedure<Responsibility>('pesquisaResponsabilidadeJustificativa', params);
}

export async function saveAppointment(
    userId: string,
    empresa: string,
    payload: AppointmentPayload
): Promise<any[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdApnt', 'Int', payload.id_apnt || 0),
        createParam('lnIdClie', 'Int', payload.id_clie),
        createParam('ldApData', 'SmallDatetime', payload.ap_data),
        createParam('lnIdStrc', 'Int', payload.id_strc || 0),
        createParam('lnIdJflt', 'Int', payload.id_jflt || 0),
        createParam('lcApObsr', 'VarChar', payload.ap_obsr || ''),
        createParam('lnIdOrds', 'Int', payload.id_ords),
        createParam('lnApHent', 'Decimal', payload.ap_hent || 0),
        createParam('lnApHiin', 'Decimal', payload.ap_hiin || 0),
        createParam('lnApHtin', 'Decimal', payload.ap_htin || 0),
        createParam('lnApHter', 'Decimal', payload.ap_hter || 0),
        createParam('lnIdSirc', 'Int', payload.id_sirc || 0),
        createParam('lnIdJust', 'Int', payload.id_just || 0),
        createParam('lcApObju', 'VarChar', payload.ap_obju || ''),
        createParam('lnIdRpju', 'Int', payload.id_rpju || 0),
        createParam('lnIdAtiv', 'Int', payload.id_ativ || 0),
        createParam('lnApDres', 'Decimal', payload.ap_dres ?? -1),
        createParam('lcApDatv', 'VarChar', payload.ap_datv || ''),
        createParam('lnApFeri', 'Int', payload.ap_feri || 0),
        createParam('lnIdExcl', 'Int', payload.id_excl || 0),
        createParam('lcIdMatr', 'VarChar', payload.ids_matr),
        createParam('lcIdEqto', 'VarChar', payload.ids_eqto),
    ];
    return callProcedure('insereApontamento', params);
}

export async function sendEmail(
    config: EmailConfig,
    attachments: { path: string, name: string, type: string }[] = []
): Promise<boolean> {
    // Legacy: `enviaEmail` endpoint
    // Params: `lcEnMail` (JSON string), `lcEmAnxo` (JSON string, optional)
    
    const mailData = {
        em_sndr: "planejamento.sede@gruporeall.com.br",
        em_from: "Grupo Real <planejamento.sede@gruporeall.com.br>",
        em_rcpt: config.to,
        em_host: "mail.gruporeall.com.br",
        em_pass: "@Reall@2022", // Legacy hardcoded credential, mirroring behavior
        mg_titu: config.subject,
        em_msgm: config.body,
        em_titu: config.subject
    };

    try {
        const formData = new URLSearchParams();
        formData.append('lcEnMail', encodeURIComponent(JSON.stringify(mailData)));
        if (attachments.length > 0) {
            // Map attachments to legacy format if needed
            // Legacy: an_path, an_nome, an_tipo
            const legacyAtt = attachments.map(a => ({
                an_path: a.path,
                an_nome: a.name,
                an_tipo: a.type
            }));
            formData.append('lcEmAnxo', encodeURIComponent(JSON.stringify(legacyAtt)));
        }

        const response = await apiClient.post('enviaEmail', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return response.data?.em_envi === true;
    } catch (error) {
        console.error("Email failed", error);
        return false;
    }
}
