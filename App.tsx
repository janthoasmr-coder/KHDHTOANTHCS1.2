
import React, { useState } from 'react';
import InputForm from './components/InputForm';
import LessonPlanViewer from './components/LessonPlanViewer';
import { FormInputs, GenerationResult } from './types';
import { generateLessonPlan } from './geminiService';

const App: React.FC = () => {
  const [phase, setPhase] = useState<'A' | 'B'>('A');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartGeneration = async (inputs: FormInputs) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateLessonPlan(inputs);
      setResult(data);
      setPhase('B');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error("Generation Error Log:", err);
      const message = typeof err === 'string' ? err : (err.message || JSON.stringify(err));
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 flex flex-col font-sans text-slate-900 overflow-x-hidden">
      {/* Navbar Chuyên nghiệp - Hiệu ứng Glassmorphism */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 no-print shadow-md">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-blue-600 p-1.5 md:p-2 rounded-lg text-white shrink-0 shadow-lg shadow-blue-200">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-none">MathPlan AI</h1>
              <p className="text-[8px] md:text-[10px] text-blue-600 uppercase font-black tracking-widest mt-0.5">Trợ lý Giáo án Số</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {phase === 'B' && (
              <button 
                onClick={() => { setPhase('A'); setError(null); }}
                className="text-[10px] md:text-xs font-bold bg-blue-50 text-blue-700 px-3 md:px-4 py-2 rounded-lg hover:bg-blue-100 transition-all border border-blue-200"
              >
                SOẠN MỚI
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-3 md:px-4 py-8 md:py-16">
        {error && (
          <div className="max-w-4xl mx-auto mb-6 md:mb-8 bg-white border-l-8 border-red-500 text-red-800 p-4 md:p-6 rounded-xl shadow-2xl flex flex-col gap-1 md:gap-2 animate-bounce-short" role="alert">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <strong className="font-bold text-base md:text-lg">Lỗi khởi tạo giáo án</strong>
            </div>
            <p className="text-sm md:text-base pl-8 text-slate-700">{error}</p>
            <button onClick={() => setError(null)} className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-widest mt-3 self-start pl-8 hover:underline">Đóng thông báo</button>
          </div>
        )}

        {phase === 'A' ? (
          <div className="animate-fade-in">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tighter px-4 drop-shadow-lg">
                Thiết kế Giáo án Toán chuẩn 5512
              </h2>
              <p className="text-blue-100 max-w-2xl mx-auto text-base md:text-xl px-6 leading-relaxed font-medium">
                Ứng dụng AI thông minh hỗ trợ giáo viên soạn thảo kế hoạch bài dạy chi tiết, tích hợp năng lực số nhanh chóng và chính xác.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl"></div>
              <InputForm onSubmit={handleStartGeneration} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          <div className="animate-fade-in relative">
            <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-3xl rounded-3xl -z-10"></div>
            {result && <LessonPlanViewer data={result} />}
          </div>
        )}
      </main>

      <footer className="bg-indigo-950/80 backdrop-blur-md py-8 md:py-12 no-print">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
            </div>
          </div>
          <p className="text-xs md:text-sm font-bold text-blue-200 tracking-wider uppercase">MathPlan AI Premium v2.5</p>
          <p className="text-[10px] md:text-xs text-blue-400 mt-2">Giải pháp soạn thảo giáo án số hóa hàng đầu cho giáo viên Toán THCS</p>
        </div>
      </footer>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-short { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .animate-bounce-short { animation: bounce-short 2s infinite ease-in-out; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
