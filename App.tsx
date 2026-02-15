
import React, { useState, useEffect, useRef } from 'react';
import { CURRICULUM, SUBJECT_COLORS } from './constants';
import { Difficulty, Worksheet } from './types';
import { generateWorksheetData } from './services/geminiService';
import { 
  GraduationCap, 
  BrainCircuit, 
  FileDown, 
  CheckCircle2, 
  RefreshCw, 
  ChevronLeft, 
  Lightbulb,
  ArrowRight,
  Sparkles,
  Rocket,
  Star,
  Calculator,
  AlertCircle,
  FileText,
  Printer,
  Book,
  Microscope,
  Languages,
  Globe,
  Settings,
  Quote,
  Zap,
  Heart,
  Target,
  Trophy,
  Smile,
  Compass,
  Palette
} from 'lucide-react';

declare var html2pdf: any;

type View = 'landing' | 'setup' | 'worksheet';

const DAILY_LIMIT = 15;

const MOTIVATIONAL_QUOTES = [
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.", author: "Dr. Seuss" },
  { text: "Every expert was once a beginner. Keep practicing, little champion!", author: "Anonymous" },
  { text: "Mistakes are proof that you are trying. Keep going, you're doing great!", author: "Unknown" },
  { text: "Learning is the only thing the mind never exhausts, never fears, and never regrets.", author: "Leonardo da Vinci" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" }
];

const BENEFITS = [
  { icon: Target, title: "Sharp Focus", text: "Regular practice turns tough concepts into easy wins. Master your focus like a pro!", color: "blue" },
  { icon: Zap, title: "Super Speed", text: "Solve problems in the blink of an eye. Faster practice means more time for fun!", color: "orange" },
  { icon: Trophy, title: "Winner's Mindset", text: "Every sheet you finish is a level-up for your brain. Grow your confidence!", color: "purple" }
];

const SubjectIcon = ({ subject, size = 24 }: { subject: string, size?: number }) => {
  switch (subject) {
    case 'Mathematics': return <Calculator size={size} />;
    case 'Science': return <Microscope size={size} />;
    case 'English': return <Languages size={size} />;
    case 'Social Science': return <Globe size={size} />;
    case 'EVS': return <Book size={size} />;
    default: return <Book size={size} />;
  }
};

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [grade, setGrade] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
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
  const [randomQuote, setRandomQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  const worksheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'landing') {
      setRandomQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }
  }, [view]);

  const checkLimit = () => {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem('pwai_usage') || '{}');
    if (stored.date !== today) return true;
    return stored.count < DAILY_LIMIT;
  };

  const incrementLimit = () => {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem('pwai_usage') || '{}');
    const count = (stored.date === today ? stored.count : 0) + 1;
    localStorage.setItem('pwai_usage', JSON.stringify({ date: today, count }));
  };

  const handleGenerate = async () => {
    if (!grade || !subject || !topic) return;
    if (!checkLimit()) {
      setLimitReached(true);
      return;
    }

    setLoading(true);
    setError(null);
    setUserAnswers({});
    setIsGraded(false);
    setVisibleSolutions({});
    
    try {
      const data = await generateWorksheetData(grade, subject, topic, difficulty, numQuestions);
      setWorksheet(data);
      setView('worksheet');
      incrementLimit();
    } catch (err) {
      setError("AI Engine is busy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!worksheetRef.current || !worksheet) return;
    if (typeof html2pdf === 'undefined') {
      setError("PDF library error. Try Ctrl+P.");
      return;
    }

    setIsExporting(true);
    const element = worksheetRef.current;
    const fileName = `PracticeWithAI_${worksheet.subject}_${grade.replace(/\s+/g, '_')}.pdf`;
    
    const opt = {
      margin: [10, 10, 10, 10],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save().then(() => setIsExporting(false)).catch(() => setIsExporting(false));
  };

  const reset = () => {
    setGrade(null);
    setSubject(null);
    setTopic(null);
    setError(null);
    setView('setup');
  };

  const currentThemeColor = subject ? SUBJECT_COLORS[subject] || 'blue' : 'blue';

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <div className="relative mb-10">
          <div className={`w-32 h-32 border-[12px] border-slate-50 border-t-${currentThemeColor}-500 rounded-full animate-spin`}></div>
          <Rocket className={`absolute inset-0 m-auto text-${currentThemeColor}-500 w-10 h-10 animate-bounce`} />
        </div>
        <h2 className="text-4xl font-black text-slate-800 animate-pulse text-center">Launching Your Lesson!</h2>
        <p className="mt-4 text-slate-500 font-medium text-lg max-w-sm text-center">Our AI teacher is picking the best {subject} questions for {grade}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-200 antialiased relative">
      <div className="blob top-[-200px] left-[-200px]"></div>
      <div className="blob bottom-[-200px] right-[-200px] bg-purple-200"></div>

      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-xl border-b sticky top-0 z-50 px-6 sm:px-10 h-24 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('landing')}>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-[1.25rem] shadow-xl shadow-blue-200 group-hover:rotate-12 transition-all">
            <BrainCircuit className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
              Practice<span className="text-blue-600">WithAI</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Level up your learning</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        </div>
        <nav className="flex items-center gap-8">
          {view === 'landing' && (
            <div className="hidden lg:flex items-center gap-8 font-bold text-slate-500">
              <a href="#benefits" className="hover:text-blue-600 transition-colors">Benefits</a>
              <a href="#subjects" className="hover:text-blue-600 transition-colors">Subjects</a>
              <button onClick={() => setView('setup')} className="px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
                <Rocket size={18} /> Start Free
              </button>
            </div>
          )}
          {view !== 'landing' && (
            <button onClick={() => setView('landing')} className="text-lg font-black text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2">
              <ChevronLeft size={24} /> Home
            </button>
          )}
        </nav>
      </header>

      <main className="flex-grow">
        {error && (
          <div className="max-w-4xl mx-auto mt-8 px-4">
            <div className="bg-red-50 border-2 border-red-100 p-6 rounded-[2rem] flex items-center justify-between shadow-lg">
              <span className="flex items-center gap-4 text-red-800 font-bold text-lg"><AlertCircle size={24} /> {error}</span>
              <button onClick={() => setError(null)} className="text-red-400 font-black text-2xl">×</button>
            </div>
          </div>
        )}

        {limitReached && (
          <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full text-center space-y-8 shadow-2xl border-4 border-blue-50">
               <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner"><Settings className="text-blue-600 w-12 h-12 animate-spin-slow" /></div>
               <div>
                 <h3 className="text-4xl font-black mb-4">Energy Refill! ⚡</h3>
                 <p className="text-slate-500 font-medium text-lg leading-relaxed">You've generated {DAILY_LIMIT} worksheets today. That's amazing progress! Rest your brain and come back tomorrow for more fun learning.</p>
               </div>
               <button onClick={() => setLimitReached(false)} className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-2xl hover:bg-black transition-all">Got it!</button>
            </div>
          </div>
        )}

        {view === 'landing' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
            {/* Hero Section */}
            <section className="relative pt-24 pb-20 px-6 text-center overflow-hidden">
              <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div className="text-left space-y-10">
                  <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full text-sm font-black shadow-xl shadow-slate-200/50 border border-slate-100 animate-bounce">
                     <Smile className="text-yellow-400" size={20} /> 
                     <span className="uppercase tracking-[0.2em] text-slate-600">Fun Practice for Future Leaders</span>
                  </div>
                  
                  <h2 className="text-6xl sm:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter">
                    Make Every <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">Lesson Fun!</span>
                  </h2>
                  
                  <p className="text-xl sm:text-2xl text-slate-500 max-w-xl font-medium leading-relaxed">
                    Personalized worksheets for Class 1 to 10. Master your subjects with AI-powered practice that feels like a game!
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <button onClick={() => setView('setup')} className="group px-12 py-7 bg-blue-600 hover:bg-blue-700 text-white font-black text-2xl rounded-[2rem] shadow-2xl shadow-blue-200 transition-all hover:-translate-y-2 active:scale-95 flex items-center gap-4">
                      Create a Sheet <Rocket size={32} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-xs">
                       <CheckCircle2 className="text-green-500" /> Free & Unlimited Practice
                    </div>
                  </div>
                </div>

                {/* Joyful Hero Image */}
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-[4rem] blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-white">
                    <img 
                      src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1200" 
                      alt="Joyful students learning together" 
                      className="w-full h-[600px] object-cover"
                    />
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute -top-10 -left-10 bg-white p-6 rounded-[2rem] shadow-2xl animate-bounce" style={{animationDuration: '3s'}}>
                    <Calculator className="text-blue-500" size={40} />
                  </div>
                  <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-[2rem] shadow-2xl animate-bounce" style={{animationDuration: '4s'}}>
                    <Microscope className="text-green-500" size={40} />
                  </div>
                </div>
              </div>
            </section>

            {/* Redesigned Quote Section */}
            <section className="py-24 px-6 relative overflow-hidden">
               <div className="max-w-5xl mx-auto">
                 <div className="bg-white rounded-[4rem] p-16 shadow-2xl border-2 border-slate-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-20 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                       <Palette size={200} />
                    </div>
                    <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                       <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 shadow-inner">
                          <Quote size={40} className="fill-current" />
                       </div>
                       <blockquote className="text-4xl sm:text-5xl font-black text-slate-800 leading-tight italic">
                         "{randomQuote.text}"
                       </blockquote>
                       <div className="flex items-center gap-4">
                          <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
                          <span className="text-2xl font-black text-blue-600 uppercase tracking-widest">{randomQuote.author}</span>
                          <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
                       </div>
                    </div>
                 </div>
               </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-32 px-6 bg-white/40">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-24 space-y-4">
                  <h3 className="text-4xl sm:text-6xl font-black text-slate-900">Why Daily Practice?</h3>
                  <p className="text-xl text-slate-500 font-medium">It's not just about grades, it's about building a brighter future!</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                   {BENEFITS.map((b, i) => (
                     <div key={i} className="bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-100/50 border-2 border-slate-50 hover:-translate-y-4 transition-all duration-500 group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${b.color}-50 rounded-full -mr-16 -mt-16 opacity-50`}></div>
                        <div className={`w-20 h-20 rounded-[1.5rem] bg-${b.color}-100 flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform shadow-lg`}>
                          <b.icon className={`text-${b.color}-600`} size={40} />
                        </div>
                        <h4 className="text-3xl font-black text-slate-900 mb-4">{b.title}</h4>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed">{b.text}</p>
                     </div>
                   ))}
                </div>
              </div>
            </section>
            
            {/* Subjects Grid */}
            <section id="subjects" className="py-32 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                  <div className="max-w-xl text-left">
                    <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs mb-4">
                       <Compass size={16} /> Explore Curriculum
                    </div>
                    <h3 className="text-5xl font-black text-slate-900 mb-6">Choose Your Mission</h3>
                    <p className="text-xl text-slate-500 font-medium">Select a subject and let's start your brain-workout today!</p>
                  </div>
                  <button onClick={() => setView('setup')} className="px-10 py-5 bg-slate-900 text-white font-black rounded-3xl text-xl hover:bg-black transition-all flex items-center gap-3 shadow-xl">
                    View All Classes <ArrowRight size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                   {[
                     { name: "Mathematics", icon: Calculator, color: "blue", img: "https://images.unsplash.com/photo-1509228463558-ce2ec3306971?auto=format&fit=crop&q=80&w=600" },
                     { name: "Science", icon: Microscope, color: "green", img: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=600" },
                     { name: "English", icon: Languages, color: "purple", img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600" },
                     { name: "Social Science", icon: Globe, color: "orange", img: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=600" }
                   ].map((s, i) => (
                     <div key={i} onClick={() => {setSubject(s.name); setView('setup');}} className="group relative overflow-hidden rounded-[2.5rem] aspect-[4/5] cursor-pointer shadow-2xl transition-all hover:scale-[1.02] border-4 border-white">
                       <img src={s.img} alt={s.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end">
                         <div className={`w-14 h-14 bg-${s.color}-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-12 transition-transform`}>
                           <s.icon size={28} />
                         </div>
                         <h4 className="text-3xl font-black text-white">{s.name}</h4>
                         <p className="text-white/60 font-bold uppercase tracking-widest text-xs mt-2 group-hover:text-white transition-colors">Start Practice</p>
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 px-6">
               <div className="max-w-6xl mx-auto bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[4rem] p-20 text-center text-white relative overflow-hidden shadow-3xl">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                  <div className="relative z-10 space-y-10">
                    <h3 className="text-5xl sm:text-7xl font-black tracking-tight">Ready to Level Up?</h3>
                    <p className="text-xl sm:text-3xl text-blue-100 font-medium max-w-3xl mx-auto">Master any subject, anytime. Create your first custom worksheet in just 30 seconds!</p>
                    <button onClick={() => setView('setup')} className="px-20 py-10 bg-white text-blue-700 font-black text-4xl rounded-[3rem] shadow-2xl transition-all hover:-translate-y-2 active:scale-95 hover:bg-blue-50">
                      Let's Start! <Rocket className="inline ml-4" size={48} />
                    </button>
                  </div>
               </div>
            </section>
          </div>
        )}

        {view === 'setup' && (
          <div className="max-w-5xl mx-auto px-6 py-20 space-y-16 animate-in slide-in-from-bottom-8 duration-700">
            <header className="text-center space-y-4">
              <h2 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">Setup Your Mission</h2>
              <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">Follow the steps below to build your perfect custom worksheet.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-12 text-left">
                <section className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-100 border-2 border-slate-50">
                  <div className="flex items-center gap-6 mb-10">
                    <span className="bg-slate-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">1</span>
                    <h3 className="text-3xl font-black">Select Your Class</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.keys(CURRICULUM).map(g => (
                      <button key={g} onClick={() => { setGrade(g); setSubject(null); setTopic(null); }}
                        className={`p-6 rounded-[1.75rem] border-4 transition-all text-center group ${grade === g ? 'border-blue-500 bg-blue-50' : 'border-slate-50 bg-slate-50 hover:border-blue-200'}`}>
                        <div className={`font-black text-3xl mb-1 ${grade === g ? 'text-blue-700' : 'text-slate-700'}`}>{g.replace('Class ', '')}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</div>
                      </button>
                    ))}
                  </div>
                </section>

                {grade && (
                  <section className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-100 border-2 border-slate-50 animate-in slide-in-from-bottom-6 duration-500">
                    <div className="flex items-center gap-6 mb-10">
                      <span className="bg-slate-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">2</span>
                      <h3 className="text-3xl font-black">Choose a Subject</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.keys(CURRICULUM[grade]).map(s => {
                        const sColor = SUBJECT_COLORS[s] || 'blue';
                        return (
                          <button key={s} onClick={() => { setSubject(s); setTopic(null); }}
                            className={`p-8 rounded-[2rem] border-4 transition-all flex items-center gap-6 text-left ${subject === s ? `border-${sColor}-500 bg-${sColor}-50` : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${subject === s ? `bg-${sColor}-500 text-white` : 'bg-white text-slate-400'}`}>
                              <SubjectIcon subject={s} size={28} />
                            </div>
                            <div>
                              <span className={`font-black text-2xl block ${subject === s ? `text-${sColor}-700` : 'text-slate-700'}`}>{s}</span>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Core Module</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                {subject && (
                  <section className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-100 border-2 border-slate-50 animate-in slide-in-from-bottom-6 duration-500">
                    <div className="flex items-center gap-6 mb-10">
                      <span className="bg-slate-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">3</span>
                      <h3 className="text-3xl font-black">Pick Your Topic</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {CURRICULUM[grade!][subject].map(t => (
                        <button key={t} onClick={() => setTopic(t)}
                          className={`px-8 py-5 rounded-[1.25rem] border-4 font-black text-lg transition-all ${topic === t ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-105' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-400'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <div className="lg:col-span-4 text-left">
                 <div className="sticky top-32 space-y-8">
                    {topic ? (
                      <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-100 border-2 border-slate-50 space-y-10 animate-in fade-in zoom-in duration-500">
                         <div>
                            <h4 className="font-black text-2xl mb-6 flex items-center gap-3">
                              <Star className="text-yellow-400 fill-current" size={24} /> Challenge Level
                            </h4>
                            <div className="space-y-3">
                              {Object.values(Difficulty).map(d => (
                                <button key={d} onClick={() => setDifficulty(d)} 
                                  className={`w-full p-6 rounded-2xl border-4 text-left font-black transition-all ${difficulty === d ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-50 bg-slate-50'}`}>
                                  {d.split('(')[0]}
                                </button>
                              ))}
                            </div>
                         </div>
                         
                         <div>
                            <h4 className="font-black text-2xl mb-6 flex items-center gap-3">
                              <Zap className="text-orange-500" size={24} /> Questions
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              {[5, 10, 15, 20].map(n => (
                                <button key={n} onClick={() => setNumQuestions(n)} 
                                  className={`p-6 rounded-2xl border-4 font-black text-3xl transition-all ${numQuestions === n ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-50 bg-slate-50 text-slate-400'}`}>
                                  {n}
                                </button>
                              ))}
                            </div>
                         </div>

                         <button onClick={handleGenerate} className="group w-full bg-blue-600 text-white font-black py-8 rounded-[2rem] shadow-2xl shadow-blue-200 text-3xl flex items-center justify-center gap-4 hover:bg-blue-700 active:scale-95 transition-all">
                           Launch <Rocket size={40} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                         </button>
                      </div>
                    ) : (
                      <div className="bg-slate-100/50 p-12 rounded-[3rem] border-4 border-dashed border-slate-200 text-center text-slate-400">
                         <Sparkles size={64} className="mx-auto mb-6 opacity-30" />
                         <p className="font-black text-xl leading-relaxed">Select Grade, Subject & Topic to reveal settings!</p>
                      </div>
                    )}

                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl relative overflow-hidden">
                       <Quote className="mb-4 opacity-50 relative z-10" size={32} />
                       <p className="text-xl font-bold italic mb-4 leading-relaxed relative z-10">"{randomQuote.text}"</p>
                       <div className="h-1 w-12 bg-white/30 rounded-full relative z-10"></div>
                       <Sparkles className="absolute -bottom-4 -right-4 opacity-10" size={100} />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {view === 'worksheet' && worksheet && (
          <div className="max-w-5xl mx-auto px-4 py-16 space-y-12 print:m-0 print:p-0 print:w-full">
            <div className="sticky top-28 z-40 glass-card p-6 rounded-[2.5rem] shadow-2xl flex flex-wrap items-center justify-between gap-6 print:hidden">
              <button onClick={reset} className="flex items-center gap-2 text-slate-500 font-black hover:text-blue-600 px-6 py-3 rounded-2xl hover:bg-slate-100 transition-all">
                <ChevronLeft size={24} /> Back to Setup
              </button>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleExportPDF} 
                  disabled={isExporting} 
                  className={`px-10 py-5 rounded-[1.5rem] font-black text-white shadow-xl flex items-center gap-4 transition-all ${isExporting ? 'bg-slate-400' : 'bg-slate-900 hover:bg-black active:scale-95'}`}
                >
                  {isExporting ? <RefreshCw className="animate-spin" size={24} /> : <FileDown size={24} />} 
                  {isExporting ? 'Preparing PDF...' : 'Download PDF'}
                </button>
                <button onClick={() => window.print()} className="p-5 bg-blue-50 text-blue-600 rounded-[1.5rem] hover:bg-blue-100 transition-all hidden sm:block">
                  <Printer size={28} />
                </button>
              </div>
            </div>

            <article ref={worksheetRef} className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden worksheet-container print:border-none print:shadow-none print:rounded-none">
              <div className="hidden print:flex items-center justify-between p-12 border-b-2 border-slate-50 mb-10">
                 <div className="flex items-center gap-3">
                    <BrainCircuit className="text-blue-600" size={32} />
                    <span className="text-2xl font-black">Practice<span className="text-blue-600">WithAI</span></span>
                 </div>
                 <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom AI Practice Sheet</div>
                    <div className="text-xs font-bold text-slate-900">{new Date().toLocaleDateString()}</div>
                 </div>
              </div>

              <div className={`px-12 py-24 text-center bg-gradient-to-b from-${currentThemeColor}-50 to-white relative`}>
                <div className="absolute top-12 right-12 opacity-5 print:hidden"><SubjectIcon subject={worksheet.subject} size={180} /></div>
                <h2 className="text-5xl font-black text-slate-900 mb-8 print:text-4xl">{worksheet.title}</h2>
                <div className="flex flex-wrap justify-center gap-4">
                   <span className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg">GRADE: {worksheet.grade}</span>
                   <span className={`px-8 py-3 bg-${currentThemeColor}-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg`}>{worksheet.subject}</span>
                   <span className="px-8 py-3 bg-white text-slate-500 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg border border-slate-100">{worksheet.difficulty.split('(')[0]}</span>
                </div>
              </div>

              <div className="p-12 sm:p-24 space-y-24 print:p-0 print:pt-12 print:space-y-16 text-left">
                {worksheet.questions.map((q, idx) => (
                  <section key={q.id} className="relative group page-break-avoid">
                    <div className="flex items-start gap-10">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-xl print:shadow-none print:border-2">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-10">
                        <h4 className="text-3xl font-bold text-slate-800 leading-tight print:text-2xl">{q.question}</h4>
                        
                        {q.type === 'MCQ' && q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
                            {q.options.map((opt, oIdx) => (
                              <label key={oIdx} className={`group p-8 border-4 rounded-[2.5rem] flex items-center gap-8 cursor-pointer transition-all ${userAnswers[q.id] === opt ? 'border-blue-500 bg-blue-50' : 'bg-white border-slate-50 hover:bg-slate-50'}`}>
                                <input type="radio" name={`q-${q.id}`} className="hidden" onChange={() => setUserAnswers({...userAnswers, [q.id]: opt})} />
                                <span className={`w-12 h-12 rounded-[1rem] flex items-center justify-center font-black text-sm uppercase transition-all ${userAnswers[q.id] === opt ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-300 border-2'}`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span className="text-xl font-bold text-slate-700">{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === 'Short Answer' && (
                          <div className="w-full bg-slate-50 border-4 border-transparent rounded-[2rem] px-10 py-8 text-2xl font-bold shadow-inner print:bg-white print:border-slate-100 print:shadow-none">
                             <input type="text" placeholder="Write your answer here..." className="w-full bg-transparent outline-none placeholder:text-slate-300" value={userAnswers[q.id] || ''} onChange={(e) => setUserAnswers({...userAnswers, [q.id]: e.target.value})} />
                          </div>
                        )}

                        <div className="flex items-center gap-6 pt-6 print:hidden">
                          <button onClick={() => setVisibleSolutions({...visibleSolutions, [q.id]: !visibleSolutions[q.id]})} className="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-3 hover:bg-blue-50 px-6 py-3 rounded-2xl transition-all">
                            <Lightbulb size={24} className={visibleSolutions[q.id] ? "text-yellow-400 fill-current" : ""} /> 
                            {visibleSolutions[q.id] ? "Hide Explained Solution" : "Show Explained Solution"}
                          </button>
                        </div>

                        {visibleSolutions[q.id] && (
                          <div className="bg-slate-900 p-10 rounded-[3rem] text-white animate-in slide-in-from-top-6 duration-500 shadow-2xl relative print:hidden">
                            <Quote className="absolute top-6 left-6 opacity-20" size={40} />
                            <div className="ml-10">
                              <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 mb-6 text-left">Expert Breakdown</h5>
                              <p className="text-xl font-medium leading-relaxed opacity-90 text-left">{q.solution}</p>
                            </div>
                          </div>
                        )}

                        {isGraded && (
                          <div className={`mt-8 p-8 rounded-[2rem] font-black text-2xl flex items-center gap-6 animate-in zoom-in duration-500 shadow-lg ${userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} print:hidden`}>
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim() ? 'bg-green-500' : 'bg-red-500'}`}>
                                {userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim() ? '✓' : '!'}
                             </div>
                             <span>{userAnswers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim() ? "You Got It! Great Job!" : `The Correct Answer: ${q.answer}`}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              <div className="px-12 py-24 bg-gradient-to-br from-slate-900 to-black text-white flex flex-col items-center text-center gap-12 print:hidden">
                 <div className="max-w-2xl">
                    <Trophy size={80} className="text-yellow-400 mx-auto mb-8 animate-bounce" />
                    <h3 className="text-5xl font-black mb-6">Practice Complete! 🎉</h3>
                    <p className="text-white/60 text-2xl font-medium leading-relaxed">You've finished your custom session. Ready to see how you did or start a new challenge?</p>
                 </div>
                 <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
                    <button onClick={() => setIsGraded(true)} className="flex-1 py-8 bg-green-500 hover:bg-green-600 text-white rounded-[2rem] font-black text-3xl shadow-2xl active:scale-95 transition-all">Check Scores</button>
                    <button onClick={reset} className="flex-1 py-8 bg-white text-slate-900 rounded-[2rem] font-black text-3xl shadow-2xl hover:bg-slate-100 active:scale-95 transition-all">New Mission</button>
                 </div>
              </div>
            </article>
          </div>
        )}
      </main>

      <footer className="bg-white py-32 border-t border-slate-100 text-center print:hidden relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-center gap-4 mb-10 group cursor-default">
            <div className="bg-slate-900 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg"><BrainCircuit className="text-white w-8 h-8" /></div>
            <h2 className="text-4xl font-black text-slate-900">PracticeWithAI</h2>
          </div>
          <p className="text-slate-500 font-medium text-xl mb-16 leading-relaxed">Empowering students with the power of Artificial Intelligence. Your personal tutor for every subject, every grade, and every day.</p>
          
          <div className="flex flex-wrap justify-center gap-10 text-sm font-black text-slate-400 uppercase tracking-[0.4em] mb-16">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Curriculum</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>

          <div className="text-[12px] font-black text-slate-300 uppercase tracking-[0.5em]">
            &copy; 2024 PracticeWithAI • Made with <Heart className="inline text-red-400 fill-current mx-1" size={12} /> for the next generation
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-30"></div>
      </footer>
    </div>
  );
}
