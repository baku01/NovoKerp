export interface Evaluation {
    id_aval: number;
    av_data: string; // Date
    id_clie: number;
    cl_fant: string;
    id_matr: number;
    fu_nome: string;
    fu_func: string;
    id_user: string; // Evaluator
    
    // Scores (0-10)
    av_orga: number; // Organization
    av_prod: number; // Production
    av_qual: number; // Quality
    av_disc: number; // Discipline
    av_falt: number; // Absences
    av_celu: number; // Cellphone
    av_aloj: number; // Housing
    av_resc: number; // Resignation
    av_ferr: number; // Tools

    // Additional Metrics (0-10?)
    av_fabr: number; // Manufacture
    av_msol: number; // Ground Assembly
    av_malt: number; // Height Assembly
    av_tubu: number; // Piping
    av_ptaa: number; // PTA (Work Platform?)
    
    av_sgsl: number; // Suggested Salary
    av_obse: string; // Observations
}

export interface EvaluationWorksite {
    id_clie: number;
    id_cadt: number;
    cl_fant: string;
}

export interface EmployeeCandidate {
    id_matr: number;
    fu_nome: string;
    fu_func: string;
    cb_tmdo: string;
    fu_empr: string; // Company ID string?
}

export interface EvaluationFilters {
    startDate: Date | null;
    endDate: Date | null;
    worksiteId: number | null;
    employeeId: number | null;
    evaluatorId?: string;
}
