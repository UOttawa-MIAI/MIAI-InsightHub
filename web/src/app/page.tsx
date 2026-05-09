import { Search, BookOpen, MessageSquare, ShieldCheck, Upload } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 py-12 items-center text-center">
      <div className="max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm font-medium text-red-200 mb-4">
          <ShieldCheck size={16} />
          <span>Exclusive to MIAI Discord Members</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Uncover the truth about your <span className="text-gradient">MIAI Courses.</span>
        </h1>
        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Search the archive of syllabi and anonymous student vibes. 
          Powered by Gemini 1.5 Flash to instantly answer your questions about workload, math intensity, and more.
        </p>
      </div>

      <div className="w-full max-w-2xl relative group">
        <div className="absolute inset-0 bg-[#8f001a]/20 blur-xl rounded-full group-hover:bg-[#8f001a]/30 transition-all duration-300"></div>
        <div className="relative glass-card rounded-2xl p-2 flex items-center">
          <div className="pl-4 pr-2 text-gray-400">
            <Search size={24} />
          </div>
          <input 
            type="text" 
            placeholder="Search for a course code (e.g. AI-601) or professor..." 
            className="w-full bg-transparent border-none text-lg text-white placeholder-gray-500 focus:outline-none py-4 px-2"
          />
          <button className="bg-[#8f001a] hover:bg-[#e11d48] text-white px-6 py-3 rounded-xl font-medium transition-colors">
            Search
          </button>
        </div>
      </div>

      <div className="flex gap-4 mt-2">
        <Link href="/upload" className="flex items-center gap-2 px-4 py-2 glass rounded-full hover:bg-white/5 transition-colors text-gray-300 text-sm">
          <Upload size={16} />
          Contribute a Syllabus
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mt-8">
        <div className="glass-card rounded-2xl p-8 text-left space-y-4">
          <div className="h-12 w-12 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
            <BookOpen size={24} />
          </div>
          <h3 className="text-2xl font-semibold">Syllabus RAG</h3>
          <p className="text-gray-400">
            We digest massive PDF syllabi so you don't have to. Ask our AI any specific question and get a cited answer instantly.
          </p>
        </div>
        
        <div className="glass-card rounded-2xl p-8 text-left space-y-4">
          <div className="h-12 w-12 rounded-lg bg-[#8f001a]/20 flex items-center justify-center text-red-300">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-2xl font-semibold">Anonymous Vibes</h3>
          <p className="text-gray-400">
            Real student reviews without the risk. Submit workload ratings and tips completely anonymously.
          </p>
        </div>
      </div>
    </div>
  );
}
