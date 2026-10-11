
"use client";

import { useState } from "react";
import { MessageResponse } from "@/components/ai-elements/message";

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [feedback, setFeedback] = useState("")
  const [form, setForm] = useState({
    topic: "",
    instructions: "",
    assignment: "",
  });

  async function handleReview() {
    if (!form.topic.trim() || !form.assignment.trim()) {
      alert("Please enter the assignment topic and text.");
      return;
    }

    setLoading(true);
    setError("");
    setFeedback("");

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to review assignment.");
      }

      setFeedback(data?.feedback || "No feedback returned.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: "topic" | "instructions" | "assignment", value: string) {
    setForm((current: typeof form) => ({ ...current, [field]: value }));
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
            <span>✦</span>
            AI-powered academic feedback
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Assignment<span className="text-indigo-600">Lens</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
            Get useful feedback on your assignment before submission.
            Identify missing requirements, improve your writing, and
            check whether your work stays on topic.
          </p>
        </header>

        {/* Assignment Form */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-semibold">
              Review your assignment
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Provide your topic, instructions, and assignment text below.
            </p>
          </div>

          <div className="space-y-6">

            {/* Topic */}
            <div>
              <label
                htmlFor="topic"
                className="mb-2 block text-sm font-semibold"
              >
                Assignment topic
                <span className="text-red-500"> *</span>
              </label>

              <input
                id="topic"
                type="text"
                value={form.topic}
                onChange={(e) => updateField("topic", e.target.value)}
                placeholder="e.g. Agile Software Development Model"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Instructions */}
            <div>
              <label
                htmlFor="instructions"
                className="mb-2 block text-sm font-semibold"
              >
                Assignment instructions
                <span className="ml-2 font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <textarea
                id="instructions"
                value={form.instructions}
                onChange={(e) => updateField("instructions", e.target.value)}
                placeholder="Paste your teacher's instructions, requirements, or grading rubric..."
                rows={3}
                className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Assignment Text */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="assignment"
                  className="text-sm font-semibold"
                >
                  Your assignment
                  <span className="text-red-500"> *</span>
                </label>

                <span className="text-xs text-slate-400">
                  Paste text below
                </span>
              </div>

              <textarea
                id="assignment"
                value={form.assignment}
                onChange={(e) => updateField("assignment", e.target.value)}
                placeholder="Paste your complete assignment text here..."
                rows={9}
                className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                Your assignment will be analyzed against the topic and
                any instructions you provide.
              </p>
            </div>

            {/* Review Button */}
            <button
              type="button"
              onClick={handleReview}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-indigo-400"
            >
              <span>{loading ? "…" : "✦"}</span>
              {loading ? "Reviewing..." : "Review Assignment"}
            </button>

            <p className="text-center text-xs text-slate-400">
              AI feedback can make mistakes. Review suggestions
              carefully before changing your work.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-slate-500">
          Built for students who want to improve their work.
        </footer>

        
{error && (
  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
    {error}
  </div>
)}

{feedback && (
  <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <div className="mb-6 border-b border-slate-100 pb-4">
      <p className="text-sm font-medium text-indigo-600">
        AssignmentLens Analysis
      </p>
      <h2 className="mt-1 text-2xl font-bold text-slate-900">
        Your Assignment Feedback
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Review these suggestions before submitting your work.
      </p>
    </div>

    <div className="text-sm leading-7 text-slate-700">
      <MessageResponse>{feedback}</MessageResponse>
    </div>
  </section>
)}

      </div>
    </main>
  );
}