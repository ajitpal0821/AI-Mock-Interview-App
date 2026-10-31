import type { Interview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { CustomBreadCrumb } from "./custom-breadcrumb"
import * as z from "zod"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@clerk/react"
import { toast } from "sonner"
import { Loader2, Trash2 } from "lucide-react"
import { Headings } from "./headings"
import { Button } from "./button"
import { Separator } from "./separator"
import { Input } from "./input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "./textarea"
import { generateAIContent } from "@/scripts"
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore"
import { db } from "@/config/firebase.config"
import ConfirmModal from "./confirm-modal"

interface FormMockInterviewProps {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z.string().min(1, "Position is required").max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Please provide a more descriptive role summary"),
  experience: z.coerce.number().min(0, "Experience must be 0 or more years"),
  techStack: z.string().min(1, "Please list at least one technology or framework"),
});

type FormData = z.infer<typeof formSchema>

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      position: "",
      description: "",
      experience: 0,
      techStack: "",
    }
  });

  const { isSubmitted } = form.formState;
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const title = initialData?.position ? `Edit Scenario · ${initialData.position}` : "New Interview Scenario";
  const breadCrumbPage = initialData?.position ? "Edit Scenario" : "New Scenario";
  const actionLabel = initialData ? "Save Changes" : "Create Scenario";

  const cleanAIResponse = (response: string) => {
    let cleanedResponse = response.trim();
    cleanedResponse = cleanedResponse.replace(/(json|```|`)/g, "");

    const jsonMatch = cleanedResponse.match(/\[.*\]/s);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
    throw new Error("Unable to parse structured interview questions from AI response.");
  };

  const generateAIResponse = async (data: FormData) => {
    const prompt = `
Generate EXACTLY 5 technical interview questions with detailed answers.

Return ONLY valid JSON (no markdown, no code blocks, no explanations).

Strict format:
[
  { "question": "string", "answer": "string" },
  { "question": "string", "answer": "string" }
]

Rules:
- Output must be a valid JSON array of 5 questions
- Do NOT include \`\`\`, "json", or any extra text
- Keep answers clear, structured, and professional
- Ensure all strings are properly escaped for JSON

Job Information:
- Job Position: ${data.position}
- Job Description: ${data.description}
- Years of Experience Required: ${data.experience}
- Tech Stack: ${data.techStack}

Return ONLY the JSON array.
`;

    const rawResponse = await generateAIContent(prompt);
    return cleanAIResponse(rawResponse || "");
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const aiResult = await generateAIResponse(data);

      if (!Array.isArray(aiResult) || aiResult.length === 0) {
        throw new Error("Invalid questions received from AI.");
      }

      if (initialData) {
        await updateDoc(doc(db, "interviews", initialData.id), {
          ...data,
          questions: aiResult,
          updateAt: serverTimestamp(),
        });
        toast.success("Scenario updated", { description: "Questions recalibrated successfully." });
      } else {
        await addDoc(collection(db, "interviews"), {
          ...data,
          userId,
          questions: aiResult,
          createdAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        });
        toast.success("Scenario created", { description: "Your 5 rehearsal questions are ready." });
      }
      navigate("/generate", { replace: true });
    } catch (error: any) {
      console.error("Error generating interview:", error);
      toast.error("Generation failed", {
        description: error?.message || "Something went wrong while generating questions. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData) return;

    try {
      setDeleting(true);
      await deleteDoc(doc(db, "interviews", initialData.id));

      // Clean up orphaned answers
      const answersQuery = query(
        collection(db, "answers"),
        where("mockIdRef", "==", initialData.id)
      );
      const answersSnap = await getDocs(answersQuery);
      const deletePromises = answersSnap.docs.map((docSnap) => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);

      toast.success("Scenario removed", {
        description: `"${initialData.position}" has been deleted.`,
      });
      setIsConfirmOpen(false);
      navigate("/generate", { replace: true });
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete scenario");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: initialData.experience,
        techStack: initialData.techStack,
      });
    }
  }, [initialData, form]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 py-2">
      {/* Breadcrumb Navigation */}
      <CustomBreadCrumb 
        breadCrumbPage={breadCrumbPage}
        breadCrumbItems={[{ label: "Interview Studio", link: "/generate" }]} 
      />

      {/* Header bar */}
      <div className="flex items-center justify-between w-full pt-2">
        <Headings 
          title={title} 
          description="Specify role parameters to generate realistic technical questions and benchmark evaluation criteria."
        />
        {initialData && (
          <Button 
            size="sm" 
            variant="outline" 
            className="rounded-full text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-8 px-3"
            onClick={() => setIsConfirmOpen(true)}
            disabled={deleting || loading}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            <span>Delete</span>
          </Button>
        )}
      </div>

      <Separator className="bg-[#d2d2d7]/50 dark:bg-neutral-800" />

      {/* Form Card */}
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full rounded-3xl border border-[#d2d2d7]/70 dark:border-neutral-800 bg-white dark:bg-[#121215] p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-6"
        >
          {/* Job Role Input */}
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Target Job Role / Position
                  </FormLabel>
                  <FormMessage className="text-xs text-red-500" />
                </div>
                <FormControl>
                  <Input
                    disabled={loading}
                    {...field}
                    value={field.value || ""}
                    className="h-11 rounded-xl bg-[#fbfbfd] dark:bg-neutral-900 border-[#d2d2d7] dark:border-neutral-700 text-sm focus-visible:ring-1 focus-visible:ring-[#1d1d1f] dark:focus-visible:ring-white"
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Job Description Textarea */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Role Responsibilities & Focus Areas
                  </FormLabel>
                  <FormMessage className="text-xs text-red-500" />
                </div>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    disabled={loading}
                    rows={4}
                    className="rounded-xl bg-[#fbfbfd] dark:bg-neutral-900 border-[#d2d2d7] dark:border-neutral-700 text-sm focus-visible:ring-1 focus-visible:ring-[#1d1d1f] dark:focus-visible:ring-white resize-none"
                    placeholder="Describe key responsibilities, systems architecture focus, or paste snippets from target job description..."
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Years of Experience */}
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Target Seniority (Years of Experience)
                  </FormLabel>
                  <FormMessage className="text-xs text-red-500" />
                </div>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    type="number"
                    min={0}
                    disabled={loading}
                    className="h-11 rounded-xl bg-[#fbfbfd] dark:bg-neutral-900 border-[#d2d2d7] dark:border-neutral-700 text-sm focus-visible:ring-1 focus-visible:ring-[#1d1d1f] dark:focus-visible:ring-white"
                    placeholder="e.g. 5"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Tech Stack */}
          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Required Technologies & Frameworks
                  </FormLabel>
                  <FormMessage className="text-xs text-red-500" />
                </div>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    disabled={loading}
                    className="h-11 rounded-xl bg-[#fbfbfd] dark:bg-neutral-900 border-[#d2d2d7] dark:border-neutral-700 text-sm focus-visible:ring-1 focus-visible:ring-[#1d1d1f] dark:focus-visible:ring-white"
                    placeholder="e.g. React, TypeScript, Next.js, GraphQL, PostgreSQL"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f5f5f7] dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => navigate("/generate")}
              className="rounded-full text-xs font-medium border-[#d2d2d7] text-[#1d1d1f] dark:text-white px-5 py-2.5 h-auto shadow-none hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white text-xs font-medium px-6 py-2.5 h-auto shadow-none transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Calibrating Questions...</span>
                </>
              ) : (
                actionLabel
              )}
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* Custom Confirmation Dialog */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Scenario?"
        description="Are you sure you want to permanently delete this scenario and all associated rehearsal responses? This action cannot be undone."
        confirmText="Delete Scenario"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};