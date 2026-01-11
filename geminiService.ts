
import { GoogleGenAI, Type } from "@google/genai";
import { FormInputs, GenerationResult } from "./types";

const SCHEMA = {
  type: Type.OBJECT,
  required: [
    "lesson_plan",
    "digital_competency_map",
    "giao_an_markdown"
  ],
  properties: {
    lesson_plan: {
      type: Type.OBJECT,
      required: ["thong_tin_chung", "muc_tieu", "thiet_bi", "tien_trinh", "huong_dan_ve_nha"],
      properties: {
        thong_tin_chung: {
          type: Type.OBJECT,
          required: ["dong_dau_trang", "tieu_de_bai", "mon_lop_thoi_luong"],
          properties: {
            dong_dau_trang: { type: Type.ARRAY, items: { type: Type.STRING } },
            tieu_de_bai: { type: Type.STRING },
            mon_lop_thoi_luong: { type: Type.STRING }
          }
        },
        muc_tieu: {
          type: Type.OBJECT,
          required: ["kien_thuc", "nang_luc", "nang_luc_so", "pham_chat"],
          properties: {
            kien_thuc: { type: Type.ARRAY, items: { type: Type.STRING } },
            nang_luc: {
              type: Type.OBJECT,
              required: ["nang_luc_chung", "nang_luc_dac_thu_toan"],
              properties: {
                nang_luc_chung: { type: Type.ARRAY, items: { type: Type.STRING } },
                nang_luc_dac_thu_toan: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            nang_luc_so: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["ma", "mo_ta"],
                properties: {
                  ma: { type: Type.STRING },
                  mo_ta: { type: Type.STRING },
                  dia_chi_tich_hop: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        hoat_dong: { type: Type.STRING },
                        muc_do: { type: Type.STRING },
                        minh_chung: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            pham_chat: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        thiet_bi: {
          type: Type.OBJECT,
          properties: {
            giao_vien: { type: Type.ARRAY, items: { type: Type.STRING } },
            hoc_sinh: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        tien_trinh: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["ten_phan", "loai_phan", "cac_hoat_dong"],
            properties: {
              ten_phan: { type: Type.STRING },
              loai_phan: { type: Type.STRING },
              cac_hoat_dong: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["ten_hoat_dong", "muc_tieu", "to_chuc_thuc_hien_2_cot"],
                  properties: {
                    ten_hoat_dong: { type: Type.STRING },
                    muc_tieu: { type: Type.ARRAY, items: { type: Type.STRING } },
                    noi_dung: { type: Type.STRING },
                    san_pham: { type: Type.STRING },
                    to_chuc_thuc_hien_2_cot: {
                      type: Type.OBJECT,
                      required: ["hoat_dong_gv_hs", "san_pham_du_kien"],
                      properties: {
                        hoat_dong_gv_hs: {
                          type: Type.OBJECT,
                          required: ["buoc_1", "buoc_2", "buoc_3", "buoc_4"],
                          properties: {
                            buoc_1: { type: Type.STRING },
                            buoc_2: { type: Type.STRING },
                            buoc_3: { type: Type.STRING },
                            buoc_4: { type: Type.STRING }
                          }
                        },
                        san_pham_du_kien: {
                          type: Type.OBJECT,
                          properties: {
                            tom_tat: { type: Type.STRING },
                            kien_thuc_moi: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { loai: { type: Type.STRING }, noi_dung: { type: Type.STRING } } } },
                            vi_du: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { de_bai: { type: Type.STRING }, loi_giai_chi_tiet: { type: Type.STRING } } } },
                            bai_tap: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { de_bai: { type: Type.STRING }, loi_giai_chi_tiet: { type: Type.STRING } } } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        huong_dan_ve_nha: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    digital_competency_map: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["hoat_dong", "ma_nls", "bieu_hien", "minh_chung"],
        properties: {
          hoat_dong: { type: Type.STRING },
          ma_nls: { type: Type.ARRAY, items: { type: Type.STRING } },
          bieu_hien: { type: Type.ARRAY, items: { type: Type.STRING } },
          minh_chung: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    },
    quality_checklist: {
      type: Type.OBJECT,
      properties: {
        dung_bo_cuc_mau: { type: Type.BOOLEAN },
        co_danh_gia_thu_xuyen: { type: Type.BOOLEAN }
      }
    },
    giao_an_markdown: { type: Type.STRING }
  }
};

const SYSTEM_INSTRUCTION = `Bạn là Chatbot chuyên gia soạn "Kế hoạch bài dạy (giáo án)" môn Toán THCS theo Công văn 5512/BGDĐT và tích hợp Năng lực số (CV 3456).

QUY TẮC MÃ NĂNG LỰC SỐ (NLS) - BẮT BUỘC:
- Định dạng mã NLS phải là: [STT].[STT].TC1[ký tự] (cho Lớp 6, 7) HOẶC [STT].[STT].TC2[ký tự] (cho Lớp 8, 9).
- Ví dụ Lớp 6, 7: 3.1.TC1a, 4.2.TC1b.
- Ví dụ Lớp 8, 9: 5.2.TC2b, 1.3.TC2a.

QUY TẮC TOÁN HỌC:
- Sử dụng LaTeX chuẩn: inline bọc bởi $, block bọc bởi $$. 

QUY TẮC HÀNH CHÍNH:
- Để trống tên trường, tổ, giáo viên bằng "....................".`;

export const generateLessonPlan = async (inputs: FormInputs): Promise<GenerationResult> => {
  if (!process.env.API_KEY) {
    throw new Error("Hệ thống thiếu API Key. Vui lòng cấu hình môi trường.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Soạn giáo án chi tiết cho bài học: "${inputs.ten_bai_day}"
    Khối lớp: ${inputs.khoi_lop}
    Số tiết: ${inputs.so_tiet}
    Yêu cầu đặc biệt: ${inputs.ghi_chu || "Không có"}
    
    Yêu cầu:
    1. Soạn thảo đầy đủ các bước theo Công văn 5512.
    2. Tích hợp ít nhất 3 mã năng lực số phù hợp (TC${inputs.khoi_lop && inputs.khoi_lop <= 7 ? '1' : '2'}).
    3. Các công thức toán học phải trình bày bằng LaTeX.
    4. Phần "Sản phẩm dự kiến" cần có các ví dụ và bài tập có lời giải chi tiết.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: SCHEMA,
        temperature: 0.1
      }
    });

    if (!response.text) {
      throw new Error("Model không trả về dữ liệu văn bản.");
    }

    const result = JSON.parse(response.text.trim());
    
    return {
      ...result,
      form_inputs: inputs
    } as GenerationResult;
  } catch (error: any) {
    console.error("Gemini Service Error Detail:", error);
    // Xử lý lỗi từ Google API thường có dạng object lồng nhau
    const errorMsg = error?.message || error?.error?.message || "Lỗi máy chủ AI (500). Vui lòng thử lại sau giây lát.";
    throw new Error(errorMsg);
  }
};
