
import React from 'react';
import { FormInputs } from '../types';

interface InputFormProps {
  onSubmit: (data: FormInputs) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = React.useState<FormInputs>({
    ten_bai_day: '',
    khoi_lop: 8,
    so_tiet: 2,
    ghi_chu: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'khoi_lop' || name === 'so_tiet' ? (value ? parseInt(value) : null) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ten_bai_day || !formData.khoi_lop || !formData.so_tiet) {
      alert("Vui lòng điền các thông tin bắt buộc!");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-xl md:rounded-2xl shadow-xl border border-slate-200 max-w-4xl mx-auto space-y-6 md:space-y-8">
      <div className="border-b border-slate-200 pb-4 md:pb-6 mb-4 md:mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-slate-900">Cấu hình bài dạy</h3>
        <p className="text-sm md:text-base text-slate-600 mt-1">Vui lòng điền chi tiết thông tin để AI soạn thảo giáo án chính xác nhất.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <div className="md:col-span-2">
          <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Tên bài dạy / Chủ đề bài học *</label>
          <input 
            required 
            name="ten_bai_day" 
            value={formData.ten_bai_day || ''} 
            onChange={handleChange} 
            className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-base md:text-lg font-semibold text-slate-950 placeholder-slate-400 bg-slate-50/50 focus:bg-white" 
            placeholder="VD: Hệ thức lượng trong tam giác vuông..." 
          />
        </div>
        
        <div>
          <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Khối lớp *</label>
          <div className="relative">
            <select 
              name="khoi_lop" 
              value={formData.khoi_lop || 8} 
              onChange={handleChange} 
              className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all bg-slate-50/50 focus:bg-white text-base font-bold text-slate-950 appearance-none cursor-pointer"
            >
              <option value="6">Toán 6</option>
              <option value="7">Toán 7</option>
              <option value="8">Toán 8</option>
              <option value="9">Toán 9</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Số tiết dạy *</label>
          <input 
            required 
            type="number" 
            name="so_tiet" 
            min="1" 
            max="10" 
            value={formData.so_tiet || ''} 
            onChange={handleChange} 
            className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-base font-bold text-slate-950 bg-slate-50/50 focus:bg-white" 
            placeholder="VD: 2" 
          />
        </div>
      </div>

      <div>
        <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Ghi chú & Yêu cầu riêng</label>
        <textarea 
          name="ghi_chu" 
          value={formData.ghi_chu || ''} 
          onChange={handleChange} 
          rows={4} 
          className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-base font-medium text-slate-950 placeholder-slate-400 bg-slate-50/50 focus:bg-white" 
          placeholder="VD: Tích hợp nhiều trò chơi, tập trung vào giải bài tập thực tế..." 
        />
      </div>

      <div className="pt-4 md:pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-5 rounded-2xl font-black text-lg md:text-xl text-white transition-all shadow-xl hover:shadow-indigo-200 transform ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] hover:-translate-y-1'}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-4">
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              ĐANG SOẠN GIÁO ÁN...
            </span>
          ) : 'BẮT ĐẦU TẠO GIÁO ÁN'}
        </button>
        <p className="text-center text-[10px] md:text-xs text-slate-400 mt-4 font-medium uppercase tracking-widest">Powered by Gemini 3 Flash AI Technology</p>
      </div>
    </form>
  );
};

export default InputForm;
