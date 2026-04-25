import type { Interview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { CustomBreadCrumb } from "./custom-breadcrumb"
import { BreadcrumbItem, BreadcrumbPage } from "./breadcrumb"
import * as z from "zod"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Form } from "@/components/ui/form"
import { useAuth } from "@clerk/react"
import { toast } from "sonner"
import { Heading, Loader, Trash2 } from "lucide-react"
import { Headings } from "./headings"
import { Button } from "./button"
import { Separator } from "./separator"
import { Input } from "./input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "./textarea"
import { is } from "zod/v4/locales"
import { aiConfig, genAI, model } from "@/scripts"
import { ThinkingLevel } from "@google/genai"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { db } from "@/config/firebase.config"
interface FormMockInterview {
  initialData: Interview | null
}
const formSchema = z.object({
  position: z.string().min(1, "Position is required")
    .max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  experience: z.coerce.number().min(0, "Experience cannot be empty or negative"),
  techStack: z.string().min(1, "Tech stack must be at aleat a character"),
});
type FormData = z.infer<typeof formSchema>

export const FormMockInterview = ({ initialData }: FormMockInterview) => {

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {}
  })

  const { isValid, isSubmitted } = form.formState;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const title = initialData?.position ? initialData?.position : "Create a new Mock Interview";
  const breadCrumbPage = initialData?.position ? initialData?.position : "Create"

  const actions = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData ? ({ title: "Updated!", description: "Changes Saved Successfully" }) :
    { title: "Created", description: "New Mock Interview Created" };

  const cleanAIResponse = (response: string) => {

    let cleanedResponse = response.trim();

    cleanedResponse = cleanedResponse.replace(/(json|```|`)/g, "");

    const jsonMatch = cleanedResponse.match(/\[.*\]/s);
    if (jsonMatch) {
      try {
        const jsonData = JSON.parse(jsonMatch[0]);
        return jsonData;
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return cleanedResponse;
      }
    }
  }
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
- Output must be a valid JSON array
- Do NOT include \`\`\`, "json", or any extra text
- Do NOT include backslashes (\\), regex patterns, or escape sequences like \\s or \\d
- Keep answers clear, structured, and professional
- Ensure all strings are properly escaped for JSON

Job Information:
- Job Position: ${data?.position}
- Job Description: ${data?.description}
- Years of Experience Required: ${data?.experience}
- Tech Stack: ${data?.techStack}

The questions should evaluate:
- Core concepts
- Practical problem-solving
- Real-world experience
- Best practices in ${data?.techStack}

Return ONLY the JSON array.
`;


    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: aiConfig 
    });

    const aiResult = response.text;
    console.log("Cleaned AI Result:", aiResult);
    const cleanedResult = cleanAIResponse(aiResult ? aiResult : "");
    console.log("Cleaned AI Result:", cleanedResult);
    return cleanedResult;
  };
  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      if (initialData) {
        const aiResult = await generateAIResponse(data);
        await updateDoc(doc(db, "interviews", initialData.id), {
          ...data,
          questions: aiResult,
          updateAt: serverTimestamp()
        })
        toast(toastMessage.title, { description: toastMessage.description });
      }
      else {

        if (isValid) {
          const aiResult = await generateAIResponse(data);
          await addDoc(collection(db, "interviews"), {
            ...data,
            userId,
            questions: aiResult,
            createdAt: serverTimestamp(),
            updateAt: serverTimestamp()
          })
          toast(toastMessage.title, { description: toastMessage.description });
        }
      }
      navigate("/generate",{replace:true});
    } catch {
      console.log("Error");
      toast.error("Error..", {
        description: "Something went wrong,Please try again later",
      });
    }
    finally {
      setLoading(false);
    }

  }
  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: initialData.experience,
        techStack: initialData.techStack
      })
    }
  }, [initialData, form])
  return (
    <div className="w-full flex-col space-y-4">
      <CustomBreadCrumb breadCrumbPage={breadCrumbPage}
        breadCrumbItems={[{ label: 'Mock Interviews', link: "/generate" }]} />
      <div className="mt-4 flex items-center justify-between w-full">
        <Headings title={title} isSubHeading />
        {
          initialData && (
            <Button size={"icon"} variant={"ghost"}><Trash2 className="min-w-4 min-h4 text-red-500"></Trash2></Button>
          )
        }
      </div>
      <Separator className="my-4" />
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-8 rounded-lg flex flex-col items-start justify-start gap-6 shadow-md">
          <FormField control={form.control} name="position" render={({ field }) => (
            <div className="w-full">
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel className="text-sm font-medium">Job Role/Position</FormLabel>
                  <FormMessage className="text-sm text-red-500" />
                </div>
                <FormControl>
                  <Input disabled={loading}{...field} value={field.value || ""} className="h-12" placeholder="eg: Software Engineer" />
                </FormControl>
              </FormItem>

            </div>
          )} />
          <FormField control={form.control} name="description" render={({ field }) => (
            <div className="w-full">
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel className="text-sm font-medium">Job Description</FormLabel>
                  <FormMessage className="text-sm text-red-500" />
                </div>
                <FormControl>
                  <Textarea {...field} value={field.value || ""} disabled={loading} className="h-12" placeholder="Describe the job role and responsibilities..." />
                </FormControl>
              </FormItem>

            </div>
          )} />
          <FormField control={form.control} name="experience" render={({ field }) => (
            <div className="w-full">
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel className="text-sm font-medium">Years of Experience</FormLabel>
                  <FormMessage className="text-sm text-red-500" />
                </div>
                <FormControl>
                  <Input {...field} value={field.value || ""} type="number" disabled={loading} className="h-12" placeholder="eg: 5" />
                </FormControl>
              </FormItem>

            </div>
          )} />
          <FormField control={form.control} name="techStack" render={({ field }) => (
            <div className="w-full">
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel className="text-sm font-medium">Tech Stack</FormLabel>
                  <FormMessage className="text-sm text-red-500" />
                </div>
                <FormControl>
                  <Textarea {...field} value={field.value || ""} disabled={loading} className="h-12" placeholder="Angular,React,TypeScript" />
                </FormControl>
              </FormItem>

            </div>
          )} />
          <div className="w-full flex items-center justify-center gap-6 ">
            <Button type="reset" size={"sm"} variant={"outline"} disabled={isSubmitted || loading}>
              Reset
            </Button>

            <Button type="submit" size={"sm"} disabled={loading || !isValid}>
              {loading ? (<Loader className="text-gray-50 animate-spin" />) : (actions)}
            </Button>
          </div>


        </form>
      </FormProvider>
    </div>

  )
}