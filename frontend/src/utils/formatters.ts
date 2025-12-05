/**
 * Format CPF (Brazilian individual taxpayer registry)
 */
export function formatCpf(cpf: string): string {
    if (!cpf) return '';

    const cleaned = cpf.trim().replace(/\D/g, '');

    if (cleaned.length !== 11) return cpf;

    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Format CNPJ (Brazilian company taxpayer registry)
 */
export function formatCnpj(cnpj: string): string {
    if (!cnpj || cnpj.trim().length === 0) return '';

    const cleaned = cnpj.trim().replace(/\D/g, '');

    if (cleaned.length !== 14) return cnpj;

    return cleaned.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
    );
}

/**
 * Format phone number
 */
export function formatTelefone(phone: string): string {
    if (!phone || phone.trim().length === 0) return '';

    const cleaned = phone.trim().replace(/\D/g, '');

    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return phone;
}

/**
 * Format mobile number
 */
export function formatCelular(mobile: string): string {
    if (!mobile || mobile.trim().length === 0) return '';

    const cleaned = mobile.trim().replace(/\D/g, '');

    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    }

    return mobile;
}

/**
 * Format currency to Brazilian Real
 */
export function brMoney(value: number): string {
    if (isNaN(value)) value = 0;

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

/**
 * Format decimal number
 */
export function brDecimal(value: number, decimals: number = 2): string {
    if (isNaN(value)) value = 0;

    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/**
 * Format date from ISO string to Brazilian format
 */
export function jsonDate(isoDate: string | null): string {
    if (!isoDate) return '';

    try {
        const date = new Date(isoDate.replace(/-/g, '/').replace(/T.+/, ''));

        if (date.getFullYear() === 1900) return '';

        return date.toLocaleDateString('pt-BR');
    } catch (error) {
        return '';
    }
}

/**
 * Format time from ISO string
 */
export function jsonHora(isoDate: string | null): string {
    if (!isoDate) return '';

    try {
        const date = new Date(isoDate);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const timeStr = `${hours}:${minutes}:${seconds}`;

        return timeStr === '00:00:00' ? '' : timeStr;
    } catch (error) {
        return '';
    }
}
