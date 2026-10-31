import { FormMockInterview } from '@/components/ui/form-mock-interview';
import { db } from '@/config/firebase.config';
import type { Interview } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoaderPage } from './loader-page';
import { toast } from 'sonner';

export const CreateEditPage = () => {
    const { interviewId } = useParams<{ interviewId: string }>();
    const [interview, setInterview] = useState<Interview | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInterview = async () => {
            if (interviewId && interviewId !== "create") {
                setLoading(true);
                try {
                    const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
                    if (interviewDoc.exists()) {
                        setInterview({ id: interviewId, ...interviewDoc.data() } as Interview);
                    } else {
                        toast.error("Scenario not found", {
                            description: "The requested interview scenario does not exist or has been deleted.",
                        });
                        navigate("/generate", { replace: true });
                    }
                } catch (error) {
                    console.error("Error loading scenario:", error);
                    toast.error("Error loading scenario");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchInterview();
    }, [interviewId, navigate]);

    if (loading) {
        return (
            <LoaderPage
                className="w-full h-[60vh]"
                title="Loading Scenario..."
                description="Fetching interview configuration parameters"
            />
        );
    }

    return (
        <div className="my-4 flex-col w-full">
            <FormMockInterview initialData={interview} />
        </div>
    );
};

