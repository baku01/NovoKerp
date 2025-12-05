export interface DocumentFolder {
    ex_sdir: string; // Subdirectory Name
    ex_file: number; // 0 for folder, 1 for file?
    // Other fields?
}

export interface DocumentFile {
    ex_sdir: string; // File Name
    ex_file: number;
    // Link construction requires path logic
}

export interface DocumentFilters {
    worksiteId: number; // -1 for General, 0 for Personal, >0 for Worksite
}
