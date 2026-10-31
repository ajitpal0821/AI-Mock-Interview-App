import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface SpeechRecognitionOptions {
  continuous?: boolean;
  lang?: string;
  interimResults?: boolean;
}

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}) => {
  const { continuous = true, lang = "en-US", interimResults = true } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isManuallyStoppedRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setIsSupported(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    isManuallyStoppedRef.current = true;
    setIsRecording(false);
    setInterimTranscript("");

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn("Recognition stop error:", err);
      }
      recognitionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      toast.error("Speech Recognition Not Supported", {
        description:
          "Your browser does not support the Web Speech API. Please use Google Chrome, Microsoft Edge, or type your response.",
      });
      return;
    }

    isManuallyStoppedRef.current = false;
    setError(null);
    setInterimTranscript("");

    // 1. Explicitly prompt / verify microphone permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
    } catch (err: any) {
      console.error("Microphone permission error:", err);
      toast.error("Microphone Access Denied", {
        description: "Please allow microphone permissions in your browser bar to record audio.",
      });
      setError("Microphone permission denied");
      setIsRecording(false);
      return;
    }

    // 2. Initialize SpeechRecognition
    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsRecording(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let finalChunk = "";
        let currentInterim = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalChunk += item[0].transcript + " ";
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (finalChunk) {
          setTranscript((prev) => (prev ? `${prev} ${finalChunk.trim()}` : finalChunk.trim()));
        }
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.warn("SpeechRecognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          toast.error("Microphone Permission Denied", {
            description: "Please enable microphone access in your browser settings.",
          });
          setError(event.error);
          stopRecording();
        } else if (event.error === "network") {
          toast.error("Speech Recognition Network Error", {
            description: "Please check your network connection for online speech recognition.",
          });
          setError(event.error);
          stopRecording();
        } else if (event.error !== "no-speech") {
          setError(event.error);
        }
      };

      recognition.onend = () => {
        // Auto-reconnect if speech paused but recording was not manually stopped
        if (!isManuallyStoppedRef.current) {
          setTimeout(() => {
            if (!isManuallyStoppedRef.current && recognitionRef.current) {
              try {
                recognition.start();
                return;
              } catch (_) {
                setIsRecording(false);
                setInterimTranscript("");
              }
            }
          }, 150);
          return;
        }
        setIsRecording(false);
        setInterimTranscript("");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error("Failed to initialize SpeechRecognition:", err);
      toast.error("Speech Recognition Error", {
        description: err?.message || "Unable to start speech recognition.",
      });
      setError(err?.message || "Failed to start");
      setIsRecording(false);
    }
  }, [continuous, interimResults, lang, stopRecording]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  useEffect(() => {
    return () => {
      isManuallyStoppedRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    isRecording,
    transcript,
    setTranscript,
    interimTranscript,
    isSupported,
    error,
    startRecording,
    stopRecording,
    resetTranscript,
  };
};
