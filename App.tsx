
import React, { useState, useEffect, useRef } from 'react';
import { CBSE_TOPICS } from './constants';
import { Difficulty, Worksheet } from './types';
import { generateWorksheetData } from './services/geminiService';
import { 
  BookOpen, 
  GraduationCap, 
  BrainCircuit, 
  FileDown, 
  CheckCircle2, 
  RefreshCw, 
  ChevronLeft, 
  Lightbulb,
  Zap,
  Target,
  Trophy,
  ArrowRight,
  Sparkles,
  Rocket,
  Star,
  Calculator,
  AlertCircle,
  Hash,
  ShieldCheck,
  FileText,
  Printer
} from 'lucide-react';

// Declare global html2pdf for TypeScript
declare var html2pdf: any;

type View = 'landing' | 'setup' | 'worksheet';

const DAILY_LIMIT = 10;

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [grade, setGrade] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [isGraded, setIsGraded] = useState(false);
  const [visibleSolutions, setVisibleSolutions] = useState<{ [key: number]: boolean }>({});
  const [limitReached, setLimitReached] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const worksheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const checkAndIncrementLimit = (): boolean => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const key = 'mathmaster_limit_v3';
      const stored = JSON.parse(localStorage.getItem(key) || '{}');
      
      if (stored.date !== today) {
        const reset = { count: 1, date: today };
        localStorage.setItem(key, JSON.stringify(reset));
        return true;
      }

      if (stored.count >= DAILY_LIMIT) return false;

      stored.count += 1;
      localStorage.setItem(key, JSON.stringify(stored));
      return true;
    } catch {
      return true;
    }
  };

  const handleGenerate = async () => {
    if (!grade || !topic) return;
    setError(null);

    if (!checkAndIncrementLimit()) {
      setLimitReached(true);
      return;
    }

    setLoading(true);
    setUserAnswers({});
    setIsGraded(false);
    setVisibleSolutions({});
    
    try {
      const data = await generateWorksheetData(grade, topic, difficulty, numQuestions);
      setWorksheet(data);
      setView('worksheet');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Math engine is busy. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!worksheetRef.current || !worksheet) return;
    
    // Check if library is loaded
    if (typeof html2pdf === 'undefined') {
      setError("PDF library is still loading or blocked by a browser extension. Please try standard print (Ctrl+P).");
      return;
    }

    setIsExporting(true);
    const element = worksheetRef.current;
    const fileName = `MathMaster_${worksheet.title.replace(/\s+/g, '_')}_${grade.replace(/\s+/g, '')}.pdf`;
    
    const opt = {
      margin: [15, 15, 15, 15],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Use html2pdf global
    html2pdf().set(opt).from(element).save().then(() => {
      setIsExporting(false);
    }).catch((err: any) => {
      console.error("PDF Export failed:", err);
      setIsExporting(false);
      setError("Internal PDF export failed. Please use 'Print' -> 'Save as PDF' from your browser menu.");
    });
  };

  const reset = () => {
    setGrade(null);
    setTopic(null);
    setWorksheet(null);
    setError(null);
    setView('setup');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-8 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
          <Sparkles className="absolute inset-0 m-auto text-blue-600 w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 animate-pulse">Generating Magic...</h2>
        <p className="mt-4 text-slate-500 font-medium text-lg">Our AI teacher is writing {grade} questions for you!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-50 px-4 sm:px-6 h-20 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('landing')}>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-2xl shadow-xl shadow-blue-100 group-hover:rotate-6 transition-transform">
            <GraduationCap className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Math<span className="text-blue-600">Master</span>
            </h1>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">AI Academy India</span>
          </div>
        </div>
        <nav className="flex items-center gap-6">
          {view !== 'landing' && (
            <button onClick={() => setView('landing')} className="text-sm font-black text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1">
              <ChevronLeft size={16} /> Home
            </button>
          )}
        </nav>
      </header>

      <main className="flex-grow">
        {/* Alerts */}
        {error && (
          <div className="max-w-4xl mx-auto mt-6 px-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl flex items-center justify-between animate-in slide-in-from-top-4">
              <div className="flex items-center gap-3 text-red-800 font-bold">
                <AlertCircle size={20} /> {error}
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-black">×</button>
            </div>
          </div>
        )}

        {limitReached && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full text-center space-y-6 shadow-2xl animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto">
                <ShieldCheck className="text-amber-600 w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-slate-900">Break Time!</h3>
              <p className="text-slate-600 text-lg font-medium leading-relaxed">
                You've created {DAILY_LIMIT} worksheets today. To keep the service fast for everyone, please come back tomorrow!
              </p>
              <button onClick={() => setLimitReached(false)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all">
                Close
              </button>
            </div>
          </div>
        )}

        {view === 'landing' && (
          <div className="animate-in fade-in duration-700">
            <section className="py-24 px-4 text-center">
              <div className="max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-5 py-2 rounded-full text-sm font-black mb-8 border border-blue-100">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>Trusted by 10,000+ Indian Parents & Teachers</span>
                </div>
                <h2 className="text-6xl sm:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
                  Smart Math Worksheets <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">Generated in Seconds</span>
                </h2>
                <p className="text-xl sm:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
                  Professional Class 1-8 worksheets tailored for CBSE and NCERT syllabus. From counting to calculus, we make practice fun.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button 
                    onClick={() => setView('setup')}
                    className="w-full sm:w-auto px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white font-black text-2xl rounded-[2rem] shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                  >
                    Start Generating <ArrowRight size={28} />
                  </button>
                  <div className="flex items-center gap-3 text-slate-400 font-bold uppercase tracking-widest text-xs">
                    <CheckCircle2 className="text-green-500" size={18} /> No Sign-up Required
                  </div>
                </div>
              </div>
            </section>

            {/* Benefit Grid */}
            <section className="bg-white py-24 border-y border-slate-100">
              <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { icon: Target, color: 'blue', title: 'CBSE Aligned', desc: 'Questions strictly follow the latest NCERT guidelines and curriculum.' },
                  { icon: Zap, color: 'orange', title: 'Instant PDF Export', desc: 'Save high-quality PDFs ready for home or classroom printing instantly.' },
                  { icon: Trophy, color: 'green', title: 'Olympiad Level', desc: 'Special mode for competitive exam preparation like IMO and NSTSE.' }
                ].map((item, idx) => (
                  <article key={idx} className="group p-10 rounded-[2.5rem] bg-slate-50 hover:bg-white border-4 border-transparent hover:border-blue-50 transition-all">
                    <div className={`w-16 h-16 bg-${item.color === 'blue' ? 'blue' : item.color === 'orange' ? 'orange' : 'green'}-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-slate-100 group-hover:rotate-12 transition-transform`}>
                      <item.icon size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">{item.desc}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {view === 'setup' && (
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-12 animate-in slide-in-from-bottom-6">
            <header className="text-center space-y-2">
              <h2 className="text-4xl font-black text-slate-900">Worksheet Setup</h2>
              <p className="text-slate-500 font-medium text-lg">Customize your math challenge</p>
            </header>

            <div className="space-y-10">
              <section className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <span className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-blue-100">1</span>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Select Class</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.keys(CBSE_TOPICS).map(g => (
                    <button 
                      key={g} 
                      onClick={() => { setGrade(g); setTopic(null); }}
                      className={`p-6 rounded-2xl border-4 transition-all text-left group ${grade === g ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 bg-slate-50 hover:border-blue-100'}`}
                    >
                      <div className={`font-black text-2xl ${grade === g ? 'text-blue-700' : 'text-slate-700'}`}>{g}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Mathematics</div>
                    </button>
                  ))}
                </div>
              </section>

              {grade && (
                <section className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm animate-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="bg-orange-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-orange-100">2</span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Choose Topic</h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {CBSE_TOPICS[grade].map(t => (
                      <button 
                        key={t} 
                        onClick={() => setTopic(t)}
                        className={`px-5 py-3 rounded-xl border-2 font-bold transition-all ${topic === t ? 'bg-orange-500 border-orange-500 text-white shadow-xl scale-105' : 'bg-white border-slate-100 text-slate-600 hover:border-orange-300'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {topic && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
                  <section className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <span className="bg-green-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg">3</span>
                      <h3 className="text-2xl font-black text-slate-800">Difficulty</h3>
                    </div>
                    <div className="space-y-3">
                      {Object.values(Difficulty).map(d => (
                        <button 
                          key={d} 
                          onClick={() => setDifficulty(d)}
                          className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${difficulty === d ? 'border-green-500 bg-green-50' : 'border-slate-50 bg-slate-50 hover:border-green-200'}`}
                        >
                          <span className="block font-black text-slate-800 text-lg">{d.split('(')[0]}</span>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{d.split('(')[1].replace(')', '')}</span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <span className="bg-purple-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg">4</span>
                      <h3 className="text-2xl font-black text-slate-800">Questions</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[5, 10, 15, 20].map(n => (
                        <button 
                          key={n} 
                          onClick={() => setNumQuestions(n)}
                          className={`p-6 rounded-2xl border-4 font-black text-3xl transition-all ${numQuestions === n ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-inner' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-purple-200'}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {topic && (
                <button 
                  onClick={handleGenerate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-8 rounded-[2.5rem] shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 transition-all hover:-translate-y-1 active:scale-95 text-3xl animate-in slide-in-from-bottom-6"
                >
                  <Rocket size={40} />
                  Build My Worksheet
                </button>
              )}
            </div>
          </div>
        )}

        {view === 'worksheet' && worksheet && (
          <div className="max-w-5xl mx-auto px-4 py-12 space-y-8 print:m-0 print:p-0 print:w-full">
            <div className="sticky top-24 z-40 bg-white/90 backdrop-blur-md p-4 rounded-3xl border-2 border-slate-100 shadow-2xl flex items-center justify-between print:hidden">
              <button onClick={reset} className="flex items-center text-slate-500 hover:text-blue-600 font-black transition-colors px-4 py-2 rounded-xl hover:bg-slate-50">
                <ChevronLeft size={20} /> New
              </button>
              <div className="flex items-center gap-3">
                <button onClick={handleGenerate} className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-colors" title="Regenerate">
                  <RefreshCw size={24} />
                </button>
                <button 
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className={`px-8 py-3.5 rounded-2xl font-black text-white shadow-xl transition-all flex items-center gap-3 ${isExporting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
                >
                  {isExporting ? <RefreshCw className="animate-spin" size={24} /> : <FileDown size={24} />}
                  {isExporting ? 'Creating PDF...' : 'Download PDF'}
                </button>
                <button onClick={() => window.print()} className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 hidden sm:flex">
                  <Printer size={24} />
                </button>
              </div>
            </div>

            <article ref={worksheetRef} className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden worksheet-container print:border-none print:shadow-none print:rounded-none">
              <div className="px-12 py-20 text-center border-b-4 border-slate-50 relative print:py-10">
                <div className="absolute top-10 right-10 text-slate-50 print:hidden" aria-hidden="true"><Calculator size={120} /></div>
                <h2 className="text-4xl font-black text-slate-900 mb-8 print:text-3xl print:mb-4">{worksheet.title}</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  <span className="px-6 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-[0.2em] print:bg-slate-100 print:text-slate-900">
                    Grade: {worksheet.grade}
                  </span>
                  <span className="px-6 py-2 bg-orange-100 text-orange-700 rounded-full text-xs font-black uppercase tracking-[0.2em] print:bg-slate-100 print:text-slate-900">
                    Topic: {worksheet.topic}
                  </span>
                  <span className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-[0.2em] print:bg-slate-100 print:text-slate-900">
                    {worksheet.difficulty.split('(')[0]}
                  </span>
                </div>
              </div>

              <div className="p-12 sm:p-20 space-y-20 print:p-0 print:pt-10 print:space-y-12">
                {worksheet.questions.map((q, idx) => (
                  <section key={q.id} className="relative group page-break-avoid">
                    <div className="flex items-start gap-8">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl flex-shrink-0 shadow-lg print:border-2 print:bg-white print:text-slate-900 print:shadow-none">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-8">
                        <h4 className="text-2xl font-bold text-slate-800 leading-snug print:text-xl">
                          {q.question}
                        </h4>
                        
                        {q.type === 'MCQ' && q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
                            {q.options.map((opt, oIdx) => (
                              <label key={oIdx} className={`p-6 border-4 rounded-[2rem] flex items-center gap-6 cursor-pointer transition-all print:border-slate-200 print:rounded-xl print:p-4 ${userAnswers[q.id] === opt ? 'border-blue-600 bg-blue-50/50' : 'bg-white border-slate-50 hover:bg-slate-50'}`}>
                                <input type="radio" name={`q-${q.id}`} className="hidden" checked={userAnswers[q.id] === opt} onChange={() => setUserAnswers({...userAnswers, [q.id]: opt})} />
                                <span className={`w-10 h-10 rounded-xl border-4 flex items-center justify-center font-black text-sm uppercase ${userAnswers[q.id] === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-300'}`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span className="text-xl font-bold text-slate-700 print:text-lg">{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === 'Short Answer' && (
                          <div className="mt-4">
                            <div className="w-full bg-slate-50 border-4 border-transparent rounded-[1.5rem] px-8 py-6 text-xl font-bold text-slate-800 print:bg-white print:border-b-2 print:border-slate-200 print:rounded-none print:px-0">
                               <input 
                                 type="text" 
                                 className="w-full bg-transparent outline-none placeholder:text-slate-300"
                                 placeholder="Type your answer here..."
                                 value={userAnswers[q.id] || ''}
                                 onChange={(e) => setUserAnswers({...userAnswers, [q.id]: e.target.value})}
                               />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 pt-4 print:hidden">
                          <button onClick={() => setVisibleSolutions({...visibleSolutions, [q.id]: !visibleSolutions[q.id]})} className="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
                            <Lightbulb size={18} />
                            {visibleSolutions[q.id] ? "Hide Guide" : "Solve it!"}
                          </button>
                        </div>

                        {visibleSolutions[q.id] && (
                          <div className="bg-blue-50/50 p-8 rounded-[2rem] border-l-8 border-blue-600 animate-in slide-in-from-top-4 print:hidden">
                            <h5 className="text-[10px] font-black text-blue-800 uppercase tracking-[0.3em] mb-4">Master's Hint & Solution:</h5>
                            <p className="text-slate-700 text-lg font-medium leading-relaxed whitespace-pre-wrap">{q.solution}</p>
                          </div>
                        )}

                        {isGraded && (
                          <div className={`mt-6 p-6 rounded-2xl font-black text-lg flex items-center gap-4 animate-in zoom-in print:hidden ${userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim() ? 'bg-green-500' : 'bg-red-500'}`}>
                               {userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim() ? '✓' : '!'}
                             </div>
                             <span>{userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim() ? "Correct! Amazing work." : `The correct answer is: ${q.answer}`}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              <div className="hidden print:flex flex-col items-center p-12 border-t-2 mt-20 text-slate-300">
                <div className="flex items-center gap-3 mb-3">
                   <FileText size={20} />
                   <span className="text-xs font-black uppercase tracking-[0.4em]">MathMaster Official AI Academy Document</span>
                </div>
                <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-60">
                   <span>ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                   <span>•</span>
                   <span>CBSE {grade} Mathematics</span>
                   <span>•</span>
                   <span>{new Date().toLocaleDateString('en-IN')}</span>
                </div>
              </div>

              <div className="px-12 py-16 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 print:hidden">
                 <div>
                    <h3 className="text-3xl font-black mb-2">Practice Done? 🎉</h3>
                    <p className="text-slate-400 text-xl font-medium">Review your answers or challenge yourself again.</p>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setIsGraded(true)} className="px-10 py-5 bg-green-500 hover:bg-green-600 text-white rounded-[1.5rem] font-black text-xl shadow-2xl transition-all active:scale-95">
                      Check Answers
                    </button>
                    <button onClick={reset} className="px-10 py-5 bg-white text-slate-900 rounded-[1.5rem] font-black text-xl shadow-2xl transition-all hover:bg-slate-100 active:scale-95">
                      Start New
                    </button>
                 </div>
              </div>
            </article>
          </div>
        )}
      </main>

      <footer className="bg-white py-24 px-6 border-t border-slate-100 text-center print:hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-10">
            <GraduationCap className="text-blue-600 w-10 h-10" />
            <h2 className="text-3xl font-black text-slate-900">MathMaster</h2>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
            MathMaster Academy India is dedicated to providing high-quality, AI-powered mathematics resources aligned with CBSE and NCERT guidelines to every student for free.
          </p>
          <div className="flex justify-center gap-12 text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-12">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Academy</span>
            <span>Teachers</span>
          </div>
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em]">
            &copy; 2024 MathMaster AI Academy • Made for Indian Classrooms
          </div>
        </div>
      </footer>
    </div>
  );
}
