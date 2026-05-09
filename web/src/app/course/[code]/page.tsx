"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { generateCourseInsight } from "@/app/actions";
import { BookOpen, Edit3, Loader2, Sparkles, AlertCircle } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function CourseInsightPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const courseCode = resolvedParams.code.toUpperCase();
  
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsight() {
      try {
        const data = await generateCourseInsight(courseCode);
        setInsight(data.insight);
      } catch (e) {
        setInsight("Failed to fetch insight from the Oracle.");
      } finally {
        setLoading(false);
      }
    }
    fetchInsight();
  }, [courseCode]);

  return (
    <div className="flex flex-col items-center justify-start min-h-[70vh] py-12 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card p-8 rounded-2xl border-l-4 border-l-[#8f001a]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8f001a]/20 text-[#ff4d6d] text-xs font-bold uppercase tracking-wider mb-2">
            Course Overview
          </div>
          <h1 className="text-4xl font-bold">{courseCode}</h1>
        </div>
        
        <div className="flex gap-3">
          <Link 
            href={`/course/${courseCode}/review`}
            className="flex items-center gap-2 px-4 py-2 glass rounded-xl hover:bg-white/10 transition-colors text-sm font-medium"
          >
            <Edit3 size={16} /> Add Vibe Check
          </Link>
          <Link 
            href="/upload"
            className="flex items-center gap-2 px-4 py-2 bg-[#8f001a] hover:bg-[#e11d48] text-white rounded-xl transition-colors text-sm font-medium"
          >
            <BookOpen size={16} /> Upload Syllabus
          </Link>
        </div>
      </div>

      {/* AI Insight Section */}
      <div className="w-full relative group">
        <div className="absolute inset-0 bg-[#8f001a]/10 blur-xl rounded-3xl"></div>
        <div className="relative glass-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff4d6d] to-[#8f001a] flex items-center justify-center shadow-lg shadow-[#8f001a]/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Oracle Insight
            </h2>
          </div>
          
          <div className="text-lg leading-relaxed text-gray-300">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-[#ff4d6d]">
                <Loader2 size={40} className="animate-spin" />
                <p className="text-sm font-medium animate-pulse text-gray-400">Consulting the syllabus and student vibes...</p>
              </div>
            ) : insight ? (
              <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-a:text-[#ff4d6d]">
                <ReactMarkdown>{insight}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-yellow-500/80 bg-yellow-500/10 p-4 rounded-xl">
                <AlertCircle size={20} />
                <span>No insights could be generated. Try adding a vibe check first!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
