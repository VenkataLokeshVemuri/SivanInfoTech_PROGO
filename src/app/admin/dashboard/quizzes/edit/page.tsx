"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { backendAPI } from "@/lib/backend-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Check, Trash2, ArrowUp, ArrowDown } from "lucide-react";

type Option = { id?: number; text: string };
type Question = {
  questionId?: string;
  id?: string;
  questionText: string;
  marks?: number;
  options?: Array<Option | string>;
  correctAnswer?: number;
};
type Quiz = { id?: string; title?: string; description?: string };

export default function QuizEditorPage() {
  const router = useRouter();
  const { toast } = useToast();

  // derive quizId directly from URL search params to avoid Suspense requirement
  let quizId = "";
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Question form state
  const [questionText, setQuestionText] = useState<string>("");
  const [marks, setMarks] = useState<number>(1);
  const [options, setOptions] = useState<Option[]>([
    { id: 0, text: "" },
    { id: 1, text: "" },
  ]);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    // Read quizId from URL each time effect runs
    const params = new URLSearchParams(window.location.search);
    quizId = params.get("quizId") || "";
    if (!quizId) return;

    loadQuiz();
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const res = await backendAPI.getQuiz(quizId);
      if (res.success && res.data?.quiz) setQuiz(res.data.quiz);
    } catch (err) {
      console.error(err);
    }
  };

  const loadQuestions = async () => {
    try {
      const res = await backendAPI.getQuizQuestions(quizId);
      if (res.success && res.data?.questions)
        setQuestions(res.data.questions || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOption = () =>
    setOptions((prev) => [...prev, { id: prev.length, text: "" }]);

  const handleRemoveOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
    if (correctIndex === index) setCorrectIndex(null);
    else if (correctIndex !== null && index < correctIndex)
      setCorrectIndex(correctIndex - 1);
  };

  const moveOption = (index: number, direction: -1 | 1) => {
    setOptions((prev) => {
      const next = [...prev];
      const to = index + direction;
      if (to < 0 || to >= next.length) return prev;
      const tmp = next[to];
      next[to] = next[index];
      next[index] = tmp;
      return next;
    });

    // adjust correct index if necessary
    setCorrectIndex((ci) => {
      if (ci === null) return null;
      if (ci === index) return index + direction;
      if (ci === index + direction) return index;
      return ci;
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) =>
      prev.map((o, i) => (i === index ? { ...o, text: value } : o))
    );
  };

  const resetForm = () => {
    setQuestionText("");
    setMarks(1);
    setOptions([
      { id: 0, text: "" },
      { id: 1, text: "" },
    ]);
    setCorrectIndex(null);
  };

  const handleAddQuestion = async () => {
    if (!quizId) {
      toast({
        title: "Error",
        description: "Missing quiz id",
        variant: "destructive",
      });
      return;
    }

    const trimmedQuestion = questionText.trim();
    // Keep original indices so correctIndex refers to the same option
    const cleanOptions = options
      .map((o, i) => ({ id: i, text: (o.text || "").trim() }))
      .filter((o) => o.text.length > 0);

    if (!trimmedQuestion) {
      toast({ title: "Validation", description: "Question text required" });
      return;
    }
    if (cleanOptions.length < 2) {
      toast({
        title: "Validation",
        description: "At least 2 options required",
      });
      return;
    }
    // Ensure the selected correct option exists among non-empty options
    if (
      correctIndex === null ||
      !cleanOptions.find((c) => c.id === correctIndex)
    ) {
      toast({ title: "Validation", description: "Select the correct answer" });
      return;
    }

    setAdding(true);
    try {
      const payload = {
        // backend expects 'single_choice'|'multiple_choice' etc. UI currently supports single choice
        type: "single_choice",
        questionText: trimmedQuestion,
        marks,
        // order should be provided; append to end
        order: (questions?.length || 0) + 1,
        // correctAnswer stored as optionId string to match schema
        correctAnswer: String(correctIndex),
        options: cleanOptions.map((o) => ({
          optionId: String(o.id),
          text: o.text,
          isCorrect: String(o.id) === String(correctIndex),
        })),
      };

      console.debug("Add question payload:", payload);

      const res = await backendAPI.addQuestion(quizId, payload);
      console.debug("Add question response:", res);
      if (res.success) {
        toast({ title: "Success", description: "Question added" });
        resetForm();
        loadQuestions();
      } else {
        toast({
          title: "Error",
          description: res.error || "Failed to add question",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to add question",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-3 shadow">
              <h1 className="text-lg font-semibold">Quiz Editor</h1>
              <div className="text-sm opacity-90">
                {quiz?.title || "Untitled Quiz"}
              </div>
            </div>
            <div className="text-sm text-slate-600">
              ID:{" "}
              <span className="font-mono text-xs ml-1 text-slate-700">
                {quizId}
              </span>
            </div>
          </div>
          <div>
            <Button
              variant="secondary"
              onClick={() => router.push("/admin/dashboard/quizzes")}
              className="bg-white text-slate-700 hover:bg-slate-50 border"
            >
              Back to quizzes
            </Button>
          </div>
        </div>

        <Card className="shadow-sm border border-gray-100">
          <CardHeader className="bg-indigo-50">
            <CardTitle className="text-indigo-700">Quiz Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>Quiz ID:</strong>{" "}
                <span className="font-mono text-sm">{quizId}</span>
              </div>
              <div>
                <strong>Title:</strong>{" "}
                <span className="text-slate-800">
                  {quiz?.title || "Untitled"}
                </span>
              </div>
              <div>
                <strong>Description:</strong>{" "}
                <span className="text-slate-600">
                  {quiz?.description || "-"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-100">
          <CardHeader className="bg-violet-50">
            <CardTitle className="text-violet-700">Add Question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="mb-2">Question</Label>
                <Textarea
                  value={questionText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setQuestionText(e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div>
                  <Label>Marks</Label>
                  <Input
                    type="number"
                    value={marks}
                    min={0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setMarks(Number(e.target.value || 0))
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Options</Label>
                  <div className="space-y-3 mt-2">
                    {options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 bg-white p-3 rounded-md border transition hover:shadow-sm ${
                          correctIndex === idx
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-gray-100"
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <button
                            type="button"
                            onClick={() => setCorrectIndex(idx)}
                            aria-label={
                              correctIndex === idx
                                ? "Correct answer"
                                : `Mark option ${idx + 1} correct`
                            }
                            className={`flex items-center justify-center h-9 w-9 rounded-full ${
                              correctIndex === idx
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">
                            Option {String.fromCharCode(65 + idx)}
                          </div>
                          <Input
                            placeholder={`Option ${idx + 1}`}
                            value={opt.text}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handleOptionChange(idx, e.target.value)}
                          />
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              className="p-1 rounded hover:bg-gray-100 text-indigo-600"
                              onClick={() => moveOption(idx, -1)}
                              aria-label="Move up"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="p-1 rounded hover:bg-gray-100 text-indigo-600"
                              onClick={() => moveOption(idx, 1)}
                              aria-label="Move down"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </button>
                          </div>

                          {options.length > 2 && (
                            <button
                              type="button"
                              className="p-1 rounded text-red-600 hover:bg-red-50"
                              onClick={() => handleRemoveOption(idx)}
                              aria-label="Remove option"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddOption}
                        className="border-dashed"
                      >
                        + Add option
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleAddQuestion}
                  disabled={adding}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {adding ? "Adding..." : "Add Question"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-100">
          <CardHeader className="bg-slate-50">
            <CardTitle className="text-slate-800">
              Questions ({questions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questions.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No questions yet
                </div>
              )}
              {questions.map((q: Question) => (
                <div
                  key={q.questionId || q.id || Math.random()}
                  className={`p-3 border rounded bg-white hover:shadow-sm transition ${
                    q.correctAnswer ? "border-l-4 border-emerald-500" : ""
                  }`}
                >
                  <div className="font-medium text-slate-800">
                    {q.questionText}
                  </div>
                  <div className="text-sm text-slate-500">Marks: {q.marks}</div>
                  <ul className="list-disc pl-6 mt-2">
                    {(q.options || []).map((o: Option | string, i: number) => {
                      const isCorrect =
                        q.correctAnswer === i ||
                        (typeof o !== "string" &&
                          String(q.correctAnswer) === String((o as any).id));
                      return (
                        <li
                          key={i}
                          className={
                            isCorrect
                              ? "font-semibold text-emerald-700"
                              : "text-slate-700"
                          }
                        >
                          {typeof o === "string" ? o : (o as any).text}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
