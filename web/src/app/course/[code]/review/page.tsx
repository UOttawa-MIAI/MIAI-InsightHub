"use client";

import { useState, use } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { MessageSquare, Flame, BrainCircuit, CheckCircle } from "lucide-react";

export default function VibeCheckPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const courseCode = resolvedParams.code.toUpperCase();
  
  const [workload, setWorkload] = useState(3);
  const [technicality, setTechnicality] = useState(3);
  const [vibe, setVibe] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vibe.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "Reviews"), {
        courseCode,
        workload,
        technicality,
        vibe,
        hashedStudentId: "anonymous_" + Math.random().toString(36).substring(7), // In prod, hash the NextAuth user ID
        timestamp: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit review", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="glass-card p-8 rounded-2xl text-center space-y-4 max-w-md w-full border border-green-500/20">
          <CheckCircle className="mx-auto text-green-400" size={48} />
          <h2 className="text-2xl font-bold text-white">Vibe Logged!</h2>
          <p className="text-gray-400">Your anonymous feedback for {courseCode} has been added to the InsightHub.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-[70vh] py-12 max-w-2xl mx-auto">
      <div className="w-full glass-card p-8 rounded-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-[#8f001a]/20 text-red-400 flex items-center justify-center rounded-xl mb-4">
            <MessageSquare size={24} />
          </div>
          <h1 className="text-3xl font-bold">Vibe Check: {courseCode}</h1>
          <p className="text-gray-400">Share your anonymous experience to help future students.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Workload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-white font-medium flex items-center gap-2">
                <Flame size={18} className="text-orange-500" /> Workload Intensity
              </label>
              <span className="text-gray-400 text-sm">{workload} / 5</span>
            </div>
            <input 
              type="range" min="1" max="5" value={workload}
              onChange={(e) => setWorkload(Number(e.target.value))}
              className="w-full accent-[#8f001a]"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Breeze</span>
              <span>Soul Crushing</span>
            </div>
          </div>

          {/* Technicality */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-white font-medium flex items-center gap-2">
                <BrainCircuit size={18} className="text-blue-500" /> Technical / Math Level
              </label>
              <span className="text-gray-400 text-sm">{technicality} / 5</span>
            </div>
            <input 
              type="range" min="1" max="5" value={technicality}
              onChange={(e) => setTechnicality(Number(e.target.value))}
              className="w-full accent-[#8f001a]"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>No Math</span>
              <span>Pure PhD Math</span>
            </div>
          </div>

          {/* Vibe Text */}
          <div className="space-y-2">
            <label className="text-white font-medium">What I wish I knew...</label>
            <textarea
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="The midterms are heavily based on the readings, not just the slides..."
              rows={4}
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#8f001a] transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !vibe.trim()}
            className="w-full bg-[#8f001a] hover:bg-[#e11d48] disabled:bg-gray-800 disabled:text-gray-500 text-white p-4 rounded-xl font-medium transition-colors"
          >
            {submitting ? "Submitting securely..." : "Submit Anonymous Vibe"}
          </button>
        </form>
      </div>
    </div>
  );
}
