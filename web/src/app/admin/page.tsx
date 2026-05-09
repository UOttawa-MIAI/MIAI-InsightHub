"use client";

import { useEffect, useState } from "react";
import { getPendingSyllabi, approveSyllabus, StagedSyllabus } from "@/lib/firebase/firestore";
import { Check, X, ExternalLink, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  const [syllabi, setSyllabi] = useState<StagedSyllabus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSyllabi();
  }, []);

  const fetchSyllabi = async () => {
    try {
      const data = await getPendingSyllabi();
      setSyllabi(data);
    } catch (error) {
      console.error("Failed to fetch syllabi", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (syllabus: StagedSyllabus) => {
    if (!syllabus.id) return;
    try {
      await approveSyllabus(syllabus.id, syllabus.courseCode, syllabus.fileUrl);
      setSyllabi(syllabi.filter(s => s.id !== syllabus.id));
    } catch (error) {
      console.error("Failed to approve", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[70vh] py-12 max-w-5xl mx-auto">
      <div className="w-full space-y-8">
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="w-12 h-12 bg-red-500/20 text-red-400 flex items-center justify-center rounded-xl">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400">Review community submissions before they are added to the RAG pipeline.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Syllabi</h2>
          
          {loading ? (
            <div className="text-gray-400 animate-pulse">Loading submissions...</div>
          ) : syllabi.length === 0 ? (
            <div className="glass-card p-8 text-center text-gray-400 rounded-2xl">
              No pending syllabi to review. The queue is empty!
            </div>
          ) : (
            <div className="grid gap-4">
              {syllabi.map((syllabus) => (
                <div key={syllabus.id} className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-[#8f001a] text-white text-xs font-bold px-2 py-1 rounded">
                        {syllabus.courseCode}
                      </span>
                      <span className="text-sm text-gray-400">
                        Submitted: {syllabus.submittedAt?.toDate().toLocaleDateString() || "Unknown"}
                      </span>
                    </div>
                    <a 
                      href={syllabus.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-red-400 flex items-center gap-2 font-medium transition-colors"
                    >
                      {syllabus.fileName} <ExternalLink size={14} />
                    </a>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApprove(syllabus)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors font-medium"
                    >
                      <Check size={18} /> Approve
                    </button>
                    <button 
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors font-medium"
                    >
                      <X size={18} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
