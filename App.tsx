
import React, { useState } from 'react';
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
  MousePointer2,
  Layout,
  Pencil,
  Rocket,
  Star,
  Calculator,
  Smile
} from 'lucide-react';

type View = 'landing' | 'setup' | 'worksheet';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [grade, setGrade] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [loading, setLoading] = useState(false);
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [checked, setChecked] = useState(false);
  const [showSolutions, setShowSolutions] = useState<{ [key: number]: boolean }>({});

  const handleGenerate = async () => {
    if (!grade || !topic) return;
    setLoading(true);
    setUserAnswers({});
    setChecked(false);
    setShowSolutions({});
    try {
      const data = await generateWorksheetData(grade, topic, difficulty);
      setWorksheet(data);
      setView('worksheet');
    } catch (error) {
      alert("Something went wrong while generating the worksheet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGrade(null);
    setTopic(null);
    setWorksheet(null);
    setDifficulty(Difficulty.EASY);
    setView('setup');
  };

  const goHome = () => {
    setView('landing');
    setWorksheet(null);
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 animate-bounce"><Calculator size={48} className="text-blue-500" /></div>
          <div className="absolute bottom-20 right-10 animate-pulse"><Star size={64} className="text-yellow-400" /></div>
          <div className="absolute top-1/2 left-1/4 animate-spin-slow"><Rocket size={40} className="text-red-400" /></div>
        </div>
        <div className="relative">
          <div className="w-24 h-24 border-8 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <BrainCircuit className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 w-8 h-8" />
        </div>
        <h2 className="mt-8 text-3xl font-black text-slate-800 text-center">Crunching Numbers...</h2>
        <p className="mt-3 text-slate-500 font-medium text-lg animate-pulse">Our AI teacher is picking the best questions for you!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={goHome}>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl group-hover:rotate-6 transition-transform shadow-lg shadow-blue-200">
              <GraduationCap className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                Math<span className="text-blue-600">Master</span>
              </h1>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">AI Academy</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1 px-3 py-1 bg-slate-100 rounded-full">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-xs font-bold text-slate-500 uppercase">CBSE Curriculum</span>
            </div>
            {view !== 'landing' && (
              <button 
                onClick={goHome}
                className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={16} /> Home
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {view === 'landing' && (
          <div className="animate-in fade-in duration-700">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white pt-16 pb-24 sm:pt-24 sm:pb-32">
              <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
                <div className="inline-flex items-center space-x-2 bg-white border border-blue-100 shadow-sm text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-8 transform hover:scale-105 transition-transform cursor-default">
                  <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>The World's Smartest CBSE Worksheet Engine</span>
                </div>
                <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-tight mb-8">
                  Make Math Your <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">Superpower</span> 🚀
                </h1>
                <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                  Custom AI worksheets for CBSE Classes 1-8. Whether you're mastering basics or aiming for the Olympiad, we've got you covered.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button 
                    onClick={() => setView('setup')}
                    className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center space-x-3"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                  <div className="flex items-center gap-2 text-slate-400 font-bold">
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                    <span>No Login Required</span>
                  </div>
                </div>
              </div>

              {/* Decorative Floating Icons */}
              <div className="hidden lg:block absolute top-1/4 left-20 animate-bounce-slow opacity-40">
                <div className="bg-yellow-100 p-4 rounded-3xl"><Calculator className="text-yellow-600 w-10 h-10" /></div>
              </div>
              <div className="hidden lg:block absolute top-1/3 right-24 animate-float opacity-40">
                <div className="bg-purple-100 p-4 rounded-3xl"><Pencil className="text-purple-600 w-10 h-10" /></div>
              </div>
              <div className="hidden lg:block absolute bottom-1/4 left-32 animate-pulse opacity-40">
                <div className="bg-green-100 p-4 rounded-3xl"><Smile className="text-green-600 w-10 h-10" /></div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-white py-24 border-y border-slate-100">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-20">
                  <h2 className="text-4xl font-black text-slate-900 mb-4">Amazing Practice Experience</h2>
                  <p className="text-slate-500 text-lg max-w-2xl mx-auto">Everything you need to boost your math confidence and score higher in exams.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="group bg-blue-50/50 p-10 rounded-[2.5rem] border-2 border-transparent hover:border-blue-200 hover:bg-white hover:shadow-2xl transition-all">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200 transform group-hover:scale-110 transition-transform">
                      <Target className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">Precision CBSE</h3>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                      Our topics are updated weekly to match exactly what is taught in CBSE & NCERT classrooms across India.
                    </p>
                  </div>
                  <div className="group bg-orange-50/50 p-10 rounded-[2.5rem] border-2 border-transparent hover:border-orange-200 hover:bg-white hover:shadow-2xl transition-all">
                    <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-orange-200 transform group-hover:scale-110 transition-transform">
                      <Zap className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">Visual Solutions</h3>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                      Don't just get the answer. Our AI explains the "How" and "Why" behind every solution with simple steps.
                    </p>
                  </div>
                  <div className="group bg-green-50/50 p-10 rounded-[2.5rem] border-2 border-transparent hover:border-green-200 hover:bg-white hover:shadow-2xl transition-all">
                    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-green-200 transform group-hover:scale-110 transition-transform">
                      <Trophy className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">Olympiad Prep</h3>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                      Advanced level questions that prepare you for IMO, Asset, and other competitive math exams early on.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How it Works - Modern Guide */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
               <div className="max-w-6xl mx-auto px-4 relative z-10">
                  <div className="bg-slate-900 rounded-[3rem] p-10 sm:p-20 flex flex-col lg:flex-row items-center gap-16 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="flex-1 space-y-12">
                       <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">Ready in 3 <br/> Simple Steps</h2>
                       <div className="space-y-10">
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 font-black text-2xl border border-white/20">1</div>
                             <p className="text-white/80 text-xl font-bold">Pick your Class & Topic</p>
                          </div>
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-orange-400 font-black text-2xl border border-white/20">2</div>
                             <p className="text-white/80 text-xl font-bold">Select Difficulty Level</p>
                          </div>
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-green-400 font-black text-2xl border border-white/20">3</div>
                             <p className="text-white/80 text-xl font-bold">Practice & Succeed!</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => setView('setup')}
                         className="group px-8 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-blue-50 transition-colors flex items-center gap-3"
                       >
                         <span>Launch Workshop Creator</span>
                         <Rocket className="w-5 h-5 text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       </button>
                    </div>
                    <div className="flex-1 w-full flex justify-center">
                       <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 backdrop-blur-sm w-full max-w-sm transform hover:rotate-2 transition-transform shadow-2xl">
                          <div className="bg-white rounded-2xl p-6 space-y-6">
                             <div className="flex justify-between items-center">
                                <div className="h-3 w-20 bg-slate-100 rounded"></div>
                                <div className="h-3 w-10 bg-blue-100 rounded"></div>
                             </div>
                             <div className="space-y-3">
                                <div className="h-4 w-full bg-slate-50 rounded"></div>
                                <div className="h-4 w-5/6 bg-slate-50 rounded"></div>
                             </div>
                             <div className="flex gap-2">
                                <div className="h-12 flex-1 bg-blue-50 rounded-xl border-2 border-blue-600"></div>
                                <div className="h-12 flex-1 bg-slate-50 rounded-xl"></div>
                                <div className="h-12 flex-1 bg-slate-50 rounded-xl"></div>
                             </div>
                             <div className="h-12 w-full bg-blue-600 rounded-xl flex items-center justify-center">
                                <Sparkles className="text-white w-5 h-5" />
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </section>
          </div>
        )}

        {view === 'setup' && (
          <div className="max-w-5xl mx-auto px-4 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
            {/* Header for Setup */}
            <div className="text-center">
              <h2 className="text-4xl font-black text-slate-900 mb-3">Setup Your Lesson</h2>
              <p className="text-slate-500 font-medium text-lg">Tell us what you want to practice today!</p>
            </div>

            {/* Step 1: Grade Selection */}
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center space-x-3 mb-8">
                <span className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-blue-100">1</span>
                <h3 className="text-2xl font-black text-slate-800">Choose Your Class</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.keys(CBSE_TOPICS).map((g) => (
                  <button
                    key={g}
                    onClick={() => { setGrade(g); setTopic(null); }}
                    className={`p-6 rounded-2xl border-4 transition-all text-left group relative overflow-hidden ${
                      grade === g 
                        ? 'border-blue-600 bg-blue-50/50 shadow-xl' 
                        : 'border-slate-50 bg-slate-50/50 hover:border-blue-200 hover:bg-white'
                    }`}
                  >
                    {grade === g && <div className="absolute top-0 right-0 p-2"><CheckCircle2 className="text-blue-600 w-5 h-5" /></div>}
                    <div className={`font-black text-2xl ${grade === g ? 'text-blue-700' : 'text-slate-700'}`}>{g}</div>
                    <div className="text-sm font-bold opacity-40 uppercase tracking-tighter">CBSE Math</div>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2: Topic Selection */}
            {grade && (
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center space-x-3 mb-8">
                  <span className="bg-orange-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-orange-100">2</span>
                  <h3 className="text-2xl font-black text-slate-800">Select Topic</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {CBSE_TOPICS[grade].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${
                        topic === t 
                          ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-100 scale-105' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-orange-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Step 3: Difficulty & Generate */}
            {topic && (
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center space-x-3 mb-8">
                  <span className="bg-green-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-green-100">3</span>
                  <h3 className="text-2xl font-black text-slate-800">Pick Difficulty</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                  {Object.values(Difficulty).map((d) => (
                    <button 
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex flex-col p-6 rounded-2xl border-4 text-left transition-all ${
                        difficulty === d 
                          ? 'border-green-500 bg-green-50/50 shadow-xl' 
                          : 'border-slate-50 bg-slate-50/50 hover:border-green-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                         <span className={`text-sm font-black uppercase tracking-widest ${
                           d.includes('Easy') ? 'text-green-600' : d.includes('Medium') ? 'text-orange-600' : 'text-red-600'
                         }`}>
                           {d.split(' ')[0]}
                         </span>
                         {difficulty === d && <CheckCircle2 className="text-green-600 w-5 h-5" />}
                      </div>
                      <span className="font-black text-xl text-slate-900">{d.split('(')[1]?.replace(')', '') || d}</span>
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleGenerate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-blue-100 flex items-center justify-center space-x-4 transition-all hover:-translate-y-1 active:scale-95 text-2xl"
                >
                  <BrainCircuit className="w-8 h-8" />
                  <span>Generate My Worksheet</span>
                </button>
              </section>
            )}
          </div>
        )}

        {view === 'worksheet' && worksheet && (
          <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 print:m-0 print:p-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-24 bg-white/80 backdrop-blur-lg py-4 px-6 rounded-2xl z-40 border shadow-xl print:hidden animate-in slide-in-from-top-6 duration-500">
              <button 
                onClick={handleReset}
                className="flex items-center text-slate-500 hover:text-blue-600 transition-colors font-black"
              >
                <ChevronLeft className="w-6 h-6 mr-1" /> New Worksheet
              </button>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleGenerate}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 flex items-center transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
                </button>
                <button 
                  onClick={handleDownload}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5"
                >
                  <FileDown className="w-4 h-4 mr-2" /> Print PDF
                </button>
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden print:shadow-none print:border-none print:rounded-none">
              <div className="bg-gradient-to-br from-slate-50 to-white border-b px-10 py-16 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Calculator size={120} /></div>
                <div className="absolute bottom-0 left-0 p-8 opacity-10 pointer-events-none -rotate-12"><Star size={100} /></div>
                
                <h2 className="text-4xl font-black text-slate-900 mb-6 relative z-10">{worksheet.title}</h2>
                <div className="flex flex-wrap justify-center gap-6 text-sm font-black uppercase tracking-widest relative z-10">
                  <div className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl">
                    <GraduationCap className="w-5 h-5 mr-2"/> {worksheet.grade}
                  </div>
                  <div className="flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-2xl">
                    <BookOpen className="w-5 h-5 mr-2"/> {worksheet.topic}
                  </div>
                  <div className={`px-4 py-2 rounded-2xl ${
                    worksheet.difficulty.includes('Easy') ? 'bg-green-100 text-green-700' :
                    worksheet.difficulty.includes('Medium') ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {worksheet.difficulty}
                  </div>
                </div>
              </div>

              <div className="p-10 sm:p-16 space-y-20">
                {worksheet.questions.map((q, idx) => (
                  <div key={q.id} className="group relative">
                    <div className="flex items-start space-x-6 sm:space-x-8">
                      <div className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-xl shadow-xl shadow-slate-200 transform group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-6">
                        <p className="text-2xl font-bold text-slate-800 leading-snug">{q.question}</p>
                        
                        {q.type === 'MCQ' && q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 print:grid-cols-2">
                            {q.options.map((opt, oIdx) => (
                              <label 
                                key={oIdx}
                                className={`flex items-center p-5 border-4 rounded-[1.5rem] cursor-pointer transition-all print:border-slate-200 ${
                                  userAnswers[q.id] === opt 
                                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-lg' 
                                    : 'hover:bg-slate-50 bg-white border-slate-50'
                                }`}
                              >
                                <input 
                                  type="radio" 
                                  name={`q-${q.id}`} 
                                  value={opt}
                                  checked={userAnswers[q.id] === opt}
                                  onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                                  className="hidden"
                                />
                                <span className={`w-10 h-10 flex items-center justify-center border-4 rounded-xl mr-4 text-lg font-black uppercase transition-colors ${
                                  userAnswers[q.id] === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-300 border-slate-100'
                                }`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span className="text-xl font-bold">{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === 'Short Answer' && (
                          <div className="mt-6">
                            <input 
                              type="text"
                              placeholder="Write your answer here..."
                              className="w-full bg-slate-50 rounded-2xl px-6 py-5 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none text-xl font-bold text-slate-800 border-2 border-transparent focus:border-blue-600 transition-all print:border-b-2 print:border-slate-200 print:rounded-none print:px-0"
                              value={userAnswers[q.id] || ''}
                              onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                            />
                          </div>
                        )}

                        <div className="pt-6 flex items-center space-x-6 print:hidden">
                          <button 
                            onClick={() => setShowSolutions({ ...showSolutions, [q.id]: !showSolutions[q.id] })}
                            className="text-blue-600 text-base font-black flex items-center hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors"
                          >
                            <Lightbulb className="w-5 h-5 mr-2" />
                            {showSolutions[q.id] ? "Hide Steps" : "Show Steps"}
                          </button>
                        </div>

                        {showSolutions[q.id] && (
                          <div className="bg-blue-50 rounded-3xl border-l-8 border-blue-600 p-8 mt-4 animate-in slide-in-from-top-4 duration-300">
                            <h4 className="text-blue-800 font-black text-sm mb-3 uppercase tracking-widest">Step-by-Step Lesson:</h4>
                            <p className="text-slate-800 text-lg whitespace-pre-wrap leading-relaxed font-medium">{q.solution}</p>
                          </div>
                        )}

                        {checked && (
                          <div className={`mt-4 p-4 rounded-2xl flex items-center font-black text-lg animate-in zoom-in duration-300 ${
                            userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim()
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                               userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim() ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                               {userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim() ? <CheckCircle2 className="text-white w-5 h-5" /> : <span className="text-white">×</span>}
                            </div>
                            {userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim() 
                              ? "Fantastic! You got it right." 
                              : `Almost! The answer is: ${q.answer}`}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Completion Section */}
              <div className="bg-slate-900 px-10 py-16 text-white flex flex-col md:flex-row items-center justify-between print:hidden">
                <div className="mb-8 md:mb-0 text-center md:text-left">
                  <h3 className="text-3xl font-black mb-2">Practice Complete! 🎉</h3>
                  <p className="text-slate-400 text-xl font-medium">Ready to see how you did today?</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => setChecked(true)}
                    className="flex-1 md:flex-none px-10 py-5 bg-green-500 hover:bg-green-600 text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-green-900/20 transition-all hover:-translate-y-1 active:scale-95"
                  >
                    Check Answers
                  </button>
                </div>
              </div>
              
              {/* Printed Version Footer */}
              <div className="hidden print:flex flex-col items-center p-12 border-t mt-20 text-slate-400">
                <div className="flex items-center gap-2 mb-2">
                   <GraduationCap className="w-5 h-5" />
                   <span className="font-bold">MathMaster AI Academy</span>
                </div>
                <p className="text-sm font-medium">CBSE Personalized Learning • Worksheet ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-16 px-4 bg-white border-t border-slate-100 text-center print:hidden">
        <div className="max-w-6xl mx-auto">
           <div className="flex items-center justify-center space-x-2 mb-6 grayscale opacity-60">
              <GraduationCap className="text-slate-600 w-6 h-6" />
              <h2 className="text-xl font-black tracking-tight text-slate-800">
                Math<span className="text-blue-600">Master</span>
              </h2>
           </div>
           <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
             Providing high-quality math resources for the Indian education system. Empowering students to excel in CBSE and competitive exams through AI.
           </p>
           <div className="mt-8 flex justify-center gap-8 text-sm font-black text-slate-400 uppercase tracking-widest">
              <span>Class 1-8</span>
              <span>•</span>
              <span>NCERT Aligned</span>
              <span>•</span>
              <span>Free for All</span>
           </div>
           <div className="mt-12 text-slate-300 text-xs font-bold uppercase tracking-widest">
             &copy; 2024 MathMaster AI Academy • Made for India
           </div>
        </div>
      </footer>
    </div>
  );
}

// Add these to a global style or within index.html to support custom animations
// .animate-float { animation: float 6s ease-in-out infinite; }
// .animate-bounce-slow { animation: bounce 4s ease-in-out infinite; }
// .animate-spin-slow { animation: spin 10s linear infinite; }
// @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
