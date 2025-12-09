export interface User {
  id_user: string;
  us_nome: string;
  us_grup: string;
  us_empr: string;
  us_smd5: string;
  us_mail?: string;
  id_posi: number;
  id_oper: number;
  ws_http: string;
  ad_admi?: string;
}

// LoginResponse é equivalente a User
export type LoginResponse = User;

export interface Empresa {
  id_empr: string;
  em_fant: string;
  em_clor: string;
  st_ativ: number;
  st_pcad: number;
  em_mail: string;
  em_tela: string;
  em_thwi: number;
}
