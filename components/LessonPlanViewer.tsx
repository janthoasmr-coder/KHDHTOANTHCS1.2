
import React, { useEffect, useRef } from 'react';
import { GenerationResult, ProcedureActivity, KnowledgeItem, ExampleExercise } from '../types';

declare const katex: any;

const MathText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g);
  return (
    <span className="leading-relaxed break-words">
      {parts.map((part, index) => {
        if (!part) return null;
        let formula = '';
        let displayMode = false;
        if (part.startsWith('$$') && part.endsWith('$$')) {
          formula = part.slice(2, -2);
          displayMode = true;
        } else if (part.startsWith('$') && part.endsWith('$')) {
          formula = part.slice(1, -1);
          displayMode = false;
        } else if (part.startsWith('\\[') && part.endsWith('\\]')) {
          formula = part.slice(2, -2);
          displayMode = true;
        } else if (part.startsWith('\\(') && part.endsWith('\\)')) {
          formula = part.slice(2, -2);
          displayMode = false;
        } else {
          return <span key={index} className="whitespace-pre-wrap">{part}</span>;
        }
        try {
          const html = katex.renderToString(formula.trim(), { displayMode, throwOnError: false, trust: true });
          return (
            <span key={index} className={displayMode ? "block my-4 overflow-x-auto py-2 max-w-full" : "inline-block px-0.5 align-middle max-w-full overflow-x-auto"} dangerouslySetInnerHTML={{ __html: html }} />
          );
        } catch (e) {
          return <code key={index} className="bg-red-50 text-red-600 px-1 text-xs">{part}</code>;
        }
      })}
    </span>
  );
};

const ProductRenderer: React.FC<{ product: ProcedureActivity['to_chuc_thuc_hien_2_cot']['san_pham_du_kien'] }> = ({ product }) => {
  return (
    <div className="space-y-4 text-black text-sm md:text-base">
      {product.tom_tat && (
        <div className="font-bold underline italic text-slate-800 border-b border-slate-100 pb-1 mb-2">
          <MathText text={product.tom_tat} />
        </div>
      )}
      
      {product.kien_thuc_moi?.length > 0 && (
        <div className="space-y-2">
          {product.kien_thuc_moi.map((k: KnowledgeItem, idx: number) => (
            <div key={idx} className="bg-slate-50 p-2 md:p-3 rounded-lg border-l-4 border-slate-400">
              <span className="font-bold uppercase text-[8px] md:text-[9px] tracking-widest text-slate-500 block mb-1">{k.loai}</span>
              <MathText text={k.noi_dung} />
            </div>
          ))}
        </div>
      )}

      {product.vi_du?.length > 0 && (
        <div className="space-y-3 md:space-y-4 mt-4 md:mt-5">
          {product.vi_du.map((v: ExampleExercise, idx: number) => (
            <div key={idx} className="border border-slate-200 p-3 md:p-4 rounded-lg bg-white">
              <p className="font-bold text-slate-900 mb-1 md:mb-2 text-xs md:text-sm">Ví dụ {idx + 1}: <MathText text={v.de_bai} /></p>
              <div className="mt-2 text-slate-700 pl-3 border-l-2 border-indigo-200 py-1">
                <span className="italic font-bold text-[10px] md:text-xs text-indigo-600">Lời giải:</span>
                <div className="mt-1"><MathText text={v.loi_giai_chi_tiet} /></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {product.bai_tap?.length > 0 && (
        <div className="space-y-3 md:space-y-4 mt-4 md:mt-5">
          {product.bai_tap.map((b: ExampleExercise, idx: number) => (
            <div key={idx} className="border border-slate-200 p-3 md:p-4 rounded-lg bg-white">
              <p className="font-bold text-slate-900 mb-1 md:mb-2 text-xs md:text-sm">Bài tập {idx + 1}: <MathText text={b.de_bai} /></p>
              <div className="mt-2 text-slate-700 pl-3 border-l-2 border-slate-300 py-1">
                <span className="italic font-bold text-[10px] md:text-xs text-slate-500">Hướng dẫn:</span>
                <div className="mt-1"><MathText text={b.loi_giai_chi_tiet} /></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LessonPlanViewer: React.FC<{ data: GenerationResult }> = ({ data }) => {
  const { lesson_plan, digital_competency_map, form_inputs } = data;
  const docRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();
  
  const handleDownloadDocx = () => {
    if (!docRef.current) return;
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><style>body { font-family: 'Times New Roman', serif; font-size: 13pt; } table { border-collapse: collapse; width: 100%; } td, th { border: 1px solid black; padding: 5px; vertical-align: top; }</style></head><body>`;
    const footer = "</body></html>";
    const html = header + docRef.current.innerHTML + footer;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Giao_An_${lesson_plan.thong_tin_chung.tieu_de_bai.replace(/\s+/g, '_')}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 md:py-8 px-2 md:px-4 no-print-bg">
      {/* Sticky Toolbar for Mobile and Desktop */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-sm p-3 md:p-4 mb-6 md:mb-8 rounded-xl border border-slate-200 shadow-lg flex flex-col sm:flex-row justify-between items-center gap-3 no-print">
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0">
             <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          </div>
          <div>
            <h2 className="text-sm md:text-lg font-bold text-slate-800 line-clamp-1">Giáo án đã sẵn sàng</h2>
            <p className="text-[8px] md:text-[10px] text-slate-500 uppercase font-semibold">Chuẩn 5512 & 3456</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={handleDownloadDocx} className="flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 text-[10px] md:text-xs transition-colors">
            Tải Word
          </button>
          <button onClick={handlePrint} className="flex-1 sm:flex-none px-4 md:px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md text-[10px] md:text-xs transition-transform active:scale-95">
            IN GIÁO ÁN
          </button>
        </div>
      </div>

      <div ref={docRef} className="bg-white p-6 md:p-[20mm] shadow-xl md:shadow-2xl lesson-document mx-auto print:p-0 print:shadow-none min-h-screen md:min-h-[297mm] text-black border border-slate-100 rounded-xl print:rounded-none overflow-x-hidden">
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 mb-6 md:mb-10 text-[11pt] md:text-[13pt]">
          <div className="text-left">
            <p className="font-bold">Trường: ............................................</p>
            <p className="font-bold">Tổ: ....................................................</p>
          </div>
          <div className="md:text-right">
            <p className="font-bold">Giáo viên: .........................................</p>
          </div>
        </div>

        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-[13pt] md:text-[15pt] font-bold uppercase mb-2">KẾ HOẠCH BÀI DẠY</h1>
          <p className="text-[12pt] md:text-[14pt] font-bold uppercase px-2">TÊN BÀI DẠY: {lesson_plan.thong_tin_chung.tieu_de_bai}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11pt] md:text-[13pt]">
            <p>Môn: <span className="font-bold">Toán học</span></p>
            <p>Lớp: <span className="font-bold">{form_inputs?.khoi_lop || '.......'}</span></p>
            <p>Thời lượng: <span className="font-bold">{form_inputs?.so_tiet || '...'} tiết</span></p>
          </div>
        </div>

        {/* Section I: Objectives */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-[12pt] md:text-[14pt] font-bold uppercase border-b border-black pb-1 mb-3 md:mb-4">I. MỤC TIÊU</h2>
          <div className="ml-2 md:ml-4 space-y-3 md:space-y-4 text-[11pt] md:text-[13pt]">
            <div>
              <p className="font-bold italic">1. Kiến thức:</p>
              <ul className="list-disc ml-6 md:ml-8 mt-1 space-y-1">
                {lesson_plan.muc_tieu.kien_thuc.map((k, i) => <li key={i}><MathText text={k} /></li>)}
              </ul>
            </div>
            <div>
              <p className="font-bold italic">2. Năng lực:</p>
              <div className="ml-2 md:ml-4 mt-1 space-y-2">
                <p><strong>- Năng lực chung:</strong> {lesson_plan.muc_tieu.nang_luc.nang_luc_chung.join('; ')}.</p>
                <p><strong>- Năng lực đặc thù:</strong> {lesson_plan.muc_tieu.nang_luc.nang_luc_dac_thu_toan.join('; ')}.</p>
                <div className="mt-2 bg-slate-50 p-2 md:p-3 rounded-lg border border-slate-200">
                  <p className="font-bold text-indigo-700 text-[10pt] md:text-sm">Năng lực số (CV 3456):</p>
                  <ul className="list-disc ml-5 md:ml-6 mt-1 space-y-1 text-[10pt] md:text-[12pt]">
                    {lesson_plan.muc_tieu.nang_luc_so.map((nls, i) => (
                      <li key={i}><span className="font-bold">{nls.ma}:</span> {nls.mo_ta}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <p className="font-bold italic">3. Phẩm chất:</p>
              <ul className="list-disc ml-6 md:ml-8 mt-1">
                {lesson_plan.muc_tieu.pham_chat.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Section II: Equipment */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-[12pt] md:text-[14pt] font-bold uppercase border-b border-black pb-1 mb-3 md:mb-4">II. THIẾT BỊ DẠY HỌC</h2>
          <div className="ml-2 md:ml-4 space-y-1 text-[11pt] md:text-[13pt]">
            <p><strong>- Giáo viên:</strong> {lesson_plan.thiet_bi.giao_vien.join(', ')}.</p>
            <p><strong>- Học sinh:</strong> {lesson_plan.thiet_bi.hoc_sinh.join(', ')}.</p>
          </div>
        </div>

        {/* Section III: Procedure */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-[12pt] md:text-[14pt] font-bold uppercase border-b border-black pb-1 mb-3 md:mb-4">III. TIẾN TRÌNH DẠY HỌC</h2>
          {lesson_plan.tien_trinh.map((section, sIdx) => (
            <div key={sIdx} className="mb-6 md:mb-8">
              <h3 className="text-[11pt] md:text-[13pt] font-bold uppercase mb-3 bg-slate-100 p-2 rounded">{section.ten_phan}</h3>
              {section.cac_hoat_dong.map((act, aIdx) => (
                <div key={aIdx} className="mb-5 md:mb-6 ml-1 md:ml-2" style={{ pageBreakInside: 'avoid' }}>
                  <h4 className="font-bold text-[11pt] md:text-[12pt] mb-2">Hoạt động {aIdx + 1}: {act.ten_hoat_dong}</h4>
                  <div className="ml-2 md:ml-4 space-y-2 text-[10.5pt] md:text-[12pt]">
                    <p><strong>a) Mục tiêu:</strong> {act.muc_tieu.join('; ')}.</p>
                    <p><strong>b) Nội dung:</strong> <MathText text={act.noi_dung} /></p>
                    <p><strong>c) Sản phẩm:</strong> <MathText text={act.san_pham} /></p>
                    <div className="mt-4">
                      <p className="font-bold mb-2">d) Tổ chức thực hiện:</p>
                      <div className="overflow-x-auto -mx-2 md:mx-0">
                        <table className="w-full border-collapse border border-black min-w-[600px] text-sm md:text-base">
                          <thead>
                            <tr className="bg-slate-50">
                              <th className="border border-black p-2 w-1/2 font-bold text-center">Hoạt động GV - HS</th>
                              <th className="border border-black p-2 w-1/2 font-bold text-center">Sản phẩm dự kiến</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-black p-2 md:p-3 align-top space-y-3 md:space-y-4">
                                <div>
                                  <p className="font-bold italic text-[10pt] md:text-[11pt]">Bước 1: Chuyển giao nhiệm vụ</p>
                                  <MathText text={act.to_chuc_thuc_hien_2_cot.hoat_dong_gv_hs.buoc_1} />
                                </div>
                                <div>
                                  <p className="font-bold italic text-[10pt] md:text-[11pt]">Bước 2: Thực hiện nhiệm vụ</p>
                                  <MathText text={act.to_chuc_thuc_hien_2_cot.hoat_dong_gv_hs.buoc_2} />
                                </div>
                                <div>
                                  <p className="font-bold italic text-[10pt] md:text-[11pt]">Bước 3: Báo cáo, thảo luận</p>
                                  <MathText text={act.to_chuc_thuc_hien_2_cot.hoat_dong_gv_hs.buoc_3} />
                                </div>
                                <div>
                                  <p className="font-bold italic text-[10pt] md:text-[11pt]">Bước 4: Kết luận, nhận định</p>
                                  <MathText text={act.to_chuc_thuc_hien_2_cot.hoat_dong_gv_hs.buoc_4} />
                                </div>
                              </td>
                              <td className="border border-black p-2 md:p-3 align-top bg-slate-50/20">
                                <ProductRenderer product={act.to_chuc_thuc_hien_2_cot.san_pham_du_kien} />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Section IV: Digital Competency Table */}
        <div className="mt-8 md:mt-10" style={{ pageBreakInside: 'avoid' }}>
          <h2 className="text-[11pt] md:text-[13pt] font-bold uppercase text-center mb-4 px-2">IV. BẢNG ÁNH XẠ NĂNG LỰC SỐ (CV 3456)</h2>
          <div className="overflow-x-auto -mx-2 md:mx-0">
            <table className="w-full border-collapse border border-black min-w-[500px] text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-black p-2 font-bold text-center w-[25%]">Hoạt động</th>
                  <th className="border border-black p-2 font-bold text-center w-[15%]">Mã NLS</th>
                  <th className="border border-black p-2 font-bold text-center">Biểu hiện & Minh chứng</th>
                </tr>
              </thead>
              <tbody>
                {digital_competency_map.map((row, i) => (
                  <tr key={i}>
                    <td className="border border-black p-2 font-bold">{row.hoat_dong}</td>
                    <td className="border border-black p-2 text-center font-mono font-bold text-indigo-700">{row.ma_nls.join(', ')}</td>
                    <td className="border border-black p-2">
                      <p>{row.bieu_hien.join('; ')}</p>
                      <p className="mt-1 italic text-slate-600">Minh chứng: {row.minh_chung.join('; ')}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section V: Homework */}
        <div className="mt-6 md:mt-8">
          <h2 className="text-[12pt] md:text-[14pt] font-bold uppercase border-b border-black pb-1 mb-3 md:mb-4">V. HƯỚNG DẪN VỀ NHÀ</h2>
          <ul className="list-disc ml-6 md:ml-8 text-[11pt] md:text-[13pt] space-y-1">
            {lesson_plan.huong_dan_ve_nha.map((item, i) => <li key={i}><MathText text={item} /></li>)}
          </ul>
        </div>

        {/* Signature Section */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 text-center text-[11pt] md:text-[13pt]" style={{ pageBreakInside: 'avoid' }}>
          <div className="order-2 md:order-1">
            <p className="font-bold uppercase">Xác nhận của Tổ chuyên môn</p>
            <div className="h-20 md:h-24"></div>
          </div>
          <div className="order-1 md:order-2">
            <p className="italic">........, ngày .... tháng .... năm 202...</p>
            <p className="font-bold uppercase mt-1 md:mt-2">Người soạn thảo</p>
            <div className="h-20 md:h-24"></div>
            <p className="font-bold uppercase">........................................</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanViewer;
