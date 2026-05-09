"use client";

import { useState } from "react";
import { Upload, FileUp, CheckCircle, AlertCircle } from "lucide-react";
import { storage, db } from "@/lib/firebase/client";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [courseCode, setCourseCode] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !courseCode.trim()) return;

    setUploading(true);
    setStatus("idle");

    try {
      const storageRef = ref(storage, `staged_syllabi/${courseCode.toUpperCase()}_${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        },
        (error) => {
          console.error("Upload failed", error);
          setStatus("error");
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          await addDoc(collection(db, "StagedSyllabi"), {
            courseCode: courseCode.toUpperCase(),
            fileName: file.name,
            fileUrl: downloadURL,
            status: "pending_review",
            submittedAt: serverTimestamp(),
            // Assuming we use NextAuth and could pass userId here if needed
          });

          setStatus("success");
          setUploading(false);
          setFile(null);
          setCourseCode("");
        }
      );
    } catch (err) {
      console.error(err);
      setStatus("error");
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
      <div className="glass-card w-full max-w-lg p-8 rounded-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-red-500/20 text-red-400 flex items-center justify-center rounded-xl mb-4">
            <Upload size={24} />
          </div>
          <h1 className="text-3xl font-bold">Contribute Syllabus</h1>
          <p className="text-gray-400">
            Submit a course syllabus to be added to the RAG pipeline. All submissions are reviewed by an admin before becoming public.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl text-center space-y-3">
            <CheckCircle className="mx-auto text-green-400" size={32} />
            <h3 className="text-green-400 font-semibold text-lg">Submission Received!</h3>
            <p className="text-gray-300 text-sm">
              Thank you for contributing. An admin will review the document shortly. Once approved, it will power the InsightHub AI.
            </p>
            <button 
              onClick={() => setStatus("idle")}
              className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
            >
              Submit Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Course Code</label>
              <input
                type="text"
                placeholder="e.g. AI-601"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
                disabled={uploading}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#e11d48] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Syllabus Document (PDF)</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                  disabled={uploading}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload" 
                  className="flex items-center gap-3 w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white cursor-pointer hover:bg-black/60 transition-colors"
                >
                  <FileUp size={20} className="text-gray-400" />
                  <span className="truncate text-gray-400">
                    {file ? file.name : "Select a PDF file..."}
                  </span>
                </label>
              </div>
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <AlertCircle size={16} />
                <span>An error occurred during upload. Please try again.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || !file || !courseCode}
              className="w-full bg-[#8f001a] hover:bg-[#e11d48] disabled:bg-gray-800 disabled:text-gray-500 text-white p-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading ({Math.round(progress)}%)...
                </>
              ) : (
                "Submit for Review"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
