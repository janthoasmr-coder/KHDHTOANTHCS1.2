
export interface FormInputs {
  ten_bai_day: string | null;
  khoi_lop: number | null;
  so_tiet: number | null;
  ghi_chu: string | null;
}

export interface DigitalCompetencyAddress {
  hoat_dong: string;
  muc_do: string;
  minh_chung: string;
}

export interface DigitalCompetency {
  ma: string;
  mo_ta: string;
  dia_chi_tich_hop: DigitalCompetencyAddress[];
}

export interface KnowledgeItem {
  loai: 'khai_niem' | 'tinh_chat' | 'dinh_ly' | 'he_qua' | 'nhan_xet' | 'ket_luan';
  noi_dung: string;
}

export interface ExampleExercise {
  de_bai: string;
  loi_giai_chi_tiet: string;
}

export interface ActivitySteps {
  buoc_1: string;
  buoc_2: string;
  buoc_3: string;
  buoc_4: string;
}

export interface ExpectedProduct {
  tom_tat: string;
  kien_thuc_moi: KnowledgeItem[];
  vi_du: ExampleExercise[];
  bai_tap: ExampleExercise[];
}

export interface ProcedureActivity {
  ten_hoat_dong: string;
  muc_tieu: string[];
  noi_dung: string;
  san_pham: string;
  to_chuc_thuc_hien_2_cot: {
    hoat_dong_gv_hs: ActivitySteps;
    san_pham_du_kien: ExpectedProduct;
  };
  danh_gia_thuong_xuyen: string[];
  tich_hop_nls: string[];
  phuong_an_khong_thiet_bi: string;
}

export interface ProcedureSection {
  ten_phan: string;
  loai_phan: 'khoi_dong' | 'hinh_thanh_kien_thuc_moi' | 'luyen_tap' | 'van_dung' | 'tim_toi_mo_rong';
  cac_hoat_dong: ProcedureActivity[];
}

export interface DigitalCompetencyMapEntry {
  hoat_dong: string;
  ma_nls: string[];
  bieu_hien: string[];
  cong_cu_so: string[] | null;
  minh_chung: string[];
}

export interface QualityChecklist {
  dung_bo_cuc_mau: boolean;
  co_danh_gia_thuong_xuyen: boolean;
  co_dia_chi_nls: boolean;
  khong_qua_tai: boolean;
  ghi_chu_loi_neu_co: string[] | null;
}

export interface LessonPlanContent {
  thong_tin_chung: {
    dong_dau_trang: string[];
    tieu_de_bai: string;
    mon_lop_thoi_luong: string;
  };
  muc_tieu: {
    kien_thuc: string[];
    nang_luc: {
      nang_luc_chung: string[];
      nang_luc_dac_thu_toan: string[];
    };
    nang_luc_so: DigitalCompetency[];
    pham_chat: string[];
  };
  thiet_bi: {
    giao_vien: string[];
    hoc_sinh: string[];
  };
  tien_trinh: ProcedureSection[];
  huong_dan_ve_nha: string[];
}

export interface GenerationResult {
  form_inputs: FormInputs;
  lesson_plan: LessonPlanContent;
  digital_competency_map: DigitalCompetencyMapEntry[];
  quality_checklist: QualityChecklist;
  giao_an_markdown: string;
}
