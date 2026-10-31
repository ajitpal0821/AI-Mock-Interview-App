import React from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Mic, 
  Video, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle2, 
  Layers
} from "lucide-react";
import Marquee from "react-fast-marquee";
import { MarqueImg } from "@/components/marquee-img";

const Home = () => {
  return (
    <div className="w-full flex flex-col items-center bg-white dark:bg-[#0a0a0c] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors">
      
      {/* 1. HERO SECTION */}
      <section className="w-full pt-20 pb-16 md:pt-28 md:pb-24">
        <Container className="flex flex-col items-center text-center">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#f5f5f7] dark:bg-neutral-800/80 text-[#1d1d1f] dark:text-[#f5f5f7] border border-[#d2d2d7]/40 dark:border-neutral-700/50 mb-8 transition-colors">
            <span className="font-semibold">MockAI Studio</span>
            <span className="text-[#86868b]">·</span>
            <span className="text-[#86868b]">The Standard in Technical Rehearsal</span>
          </div>

          {/* Apple-style Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-white max-w-4xl leading-[1.08] mb-6">
            Prepare with precision.
            <br />
            <span className="text-[#86868b] dark:text-[#86868b]">Perform with confidence.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[#86868b] dark:text-neutral-400 max-w-2xl leading-relaxed mb-10 font-normal">
            The intelligent rehearsal platform calibrated for modern engineering interviews. 
            Practice realistic technical scenarios, speak naturally, and receive objective, 
            granular evaluations before day one.
          </p>

          {/* CTA Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <Link to="/generate">
              <Button className="rounded-full bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white text-sm font-medium px-7 py-3 h-auto shadow-none transition-all">
                Start Practicing
              </Button>
            </Link>
            <a 
              href="#capabilities" 
              className="inline-flex items-center text-sm font-medium text-[#0071e3] hover:text-[#0077ed] hover:underline px-4 py-2 gap-1 transition-colors"
            >
              Explore Capabilities <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* 2. APPLE-STYLE PRODUCT STUDIO PREVIEW CHASSIS */}
          <div className="w-full max-w-5xl rounded-2xl md:rounded-3xl border border-[#d2d2d7]/80 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-[0_30px_90px_rgba(0,0,0,0.06)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.5)] p-4 md:p-6 text-left transition-all">
            
            {/* macOS Window Titlebar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#f5f5f7] dark:border-neutral-800/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="text-[12px] font-medium text-[#86868b] tracking-tight">
                MockAI Studio — Technical Assessment Session
              </div>
              <div className="w-12 text-right">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            {/* Inner Simulator Viewport */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-2 md:p-4">
              
              {/* Left Column: Interview Prompt & Live Audio Capture */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#f5f5f7] dark:bg-neutral-800 text-[#1d1d1f] dark:text-[#f5f5f7]">
                      Question 2 of 5
                    </span>
                    <span className="text-[11px] text-[#86868b]">
                      Senior Full-Stack Engineer
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white leading-snug">
                    "How would you design a distributed cache invalidation strategy across multi-region services while ensuring eventual consistency?"
                  </h3>
                </div>

                {/* Real-time Audio Waveform & Speech Stream */}
                <div className="p-4 rounded-xl bg-[#fbfbfd] dark:bg-neutral-900/60 border border-[#d2d2d7]/50 dark:border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#1d1d1f] dark:text-white">
                      <Mic className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Transcribing Voice Response</span>
                    </div>
                    {/* Audio frequency wave simulation */}
                    <div className="flex items-center gap-0.5 h-4">
                      {[40, 70, 95, 55, 80, 100, 60, 85, 45, 90, 65, 30].map((h, i) => (
                        <span 
                          key={i} 
                          className="w-1 bg-emerald-500 rounded-full transition-all duration-300 animate-pulse" 
                          style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[#86868b] dark:text-neutral-400 italic leading-relaxed">
                    "I would adopt a cache-aside model paired with write-through invalidation queues. Specifically, publishing invalidation events over partitioned pub-sub ensures replica caches purge stale entries..."
                  </p>
                </div>
              </div>

              {/* Right Column: Webcam Frame & Instant Scoring Widget */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* On-device Camera Stream Viewport */}
                <div className="relative aspect-video rounded-xl bg-[#1d1d1f] text-white flex flex-col items-center justify-center p-4 overflow-hidden border border-neutral-800 shadow-inner">
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>Live On-Device Camera</span>
                  </div>
                  <Video className="w-10 h-10 text-neutral-600 mb-2" />
                  <span className="text-[11px] text-neutral-400 text-center font-normal">
                    Private video stream processed locally in browser
                  </span>
                </div>

                {/* Instant Score Card */}
                <div className="p-4 rounded-xl bg-[#fbfbfd] dark:bg-neutral-900/60 border border-[#d2d2d7]/50 dark:border-neutral-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#1d1d1f] dark:text-white">
                      Instant Evaluation
                    </span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      9.4 / 10
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#86868b] dark:text-neutral-400">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Accurate distributed caching trade-offs</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#86868b] dark:text-neutral-400">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Clear, concise communication delivery</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </Container>
      </section>

      {/* 3. STATS STRIP */}
      <section className="w-full py-12 border-y border-[#d2d2d7]/60 dark:border-neutral-800/80 bg-[#fbfbfd] dark:bg-[#0e0e11]">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
                100%
              </p>
              <p className="text-xs text-[#86868b] mt-1 font-medium">
                Private & On-Device Video
              </p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
                5
              </p>
              <p className="text-xs text-[#86868b] mt-1 font-medium">
                Structured Questions Per Round
              </p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
                1–10
              </p>
              <p className="text-xs text-[#86868b] mt-1 font-medium">
                Objective Numerical Evaluation
              </p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
                &lt; 3s
              </p>
              <p className="text-xs text-[#86868b] mt-1 font-medium">
                Instant Feedback Analysis
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. APPLE-STYLE BENTO GRID: CAPABILITIES */}
      <section id="capabilities" className="w-full py-20 md:py-28">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
              Engineered Capabilities
            </h2>
            <p className="text-3xl md:text-5xl font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-white">
              Everything built for authentic readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Voice Recognition (Span 2) */}
            <div className="md:col-span-2 p-8 md:p-10 rounded-3xl bg-[#fbfbfd] dark:bg-[#121215] border border-[#d2d2d7]/60 dark:border-neutral-800 flex flex-col justify-between space-y-8">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-neutral-800 border border-[#d2d2d7]/50 dark:border-neutral-700 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-[#1d1d1f] dark:text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
                  Natural Voice Speech Recognition
                </h3>
                <p className="text-sm text-[#86868b] leading-relaxed max-w-lg">
                  Speak freely without robotic pauses. High-fidelity speech recognition captures your pacing, 
                  technical terminology, and answer structure in real time directly through your microphone.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-[#d2d2d7]/40 dark:border-neutral-800 text-xs text-[#86868b] flex items-center justify-between">
                <span>Continuous Speech-to-Text Pipeline</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
            </div>

            {/* Card 2: Privacy (Span 1) */}
            <div className="p-8 md:p-10 rounded-3xl bg-[#fbfbfd] dark:bg-[#121215] border border-[#d2d2d7]/60 dark:border-neutral-800 flex flex-col justify-between space-y-8">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-neutral-800 border border-[#d2d2d7]/50 dark:border-neutral-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#1d1d1f] dark:text-white" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
                  Zero Video Retention
                </h3>
                <p className="text-sm text-[#86868b] leading-relaxed">
                  Your webcam stream never leaves your device. Frames are handled strictly in-memory 
                  and are never uploaded or stored.
                </p>
              </div>
              <div className="text-xs font-medium text-[#1d1d1f] dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Strict On-Device Processing</span>
              </div>
            </div>

            {/* Card 3: Objective Ratings (Span 1) */}
            <div className="p-8 md:p-10 rounded-3xl bg-[#fbfbfd] dark:bg-[#121215] border border-[#d2d2d7]/60 dark:border-neutral-800 flex flex-col justify-between space-y-8">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-neutral-800 border border-[#d2d2d7]/50 dark:border-neutral-700 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#1d1d1f] dark:text-white" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
                  Objective Scoring
                </h3>
                <p className="text-sm text-[#86868b] leading-relaxed">
                  Receive a structured numerical score (1–10) alongside the benchmark expected answer 
                  to identify areas of improvement.
                </p>
              </div>
              <div className="text-xs font-medium text-[#1d1d1f] dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Standardized Rubric</span>
              </div>
            </div>

            {/* Card 4: Role Tailoring (Span 2) */}
            <div className="md:col-span-2 p-8 md:p-10 rounded-3xl bg-[#fbfbfd] dark:bg-[#121215] border border-[#d2d2d7]/60 dark:border-neutral-800 flex flex-col justify-between space-y-8">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-neutral-800 border border-[#d2d2d7]/50 dark:border-neutral-700 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-[#1d1d1f] dark:text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
                  Calibrated to Your Exact Stack
                </h3>
                <p className="text-sm text-[#86868b] leading-relaxed max-w-lg">
                  Every scenario dynamically adapts to your job title, required tech stack, and seniority 
                  level—from core data structures to complex distributed architecture.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {["React & Next.js", "System Design", "Node.js & Go", "Distributed Databases", "Behavioral / STAR"].map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-white dark:bg-neutral-900 border border-[#d2d2d7]/50 dark:border-neutral-800 text-[#1d1d1f] dark:text-neutral-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* 5. TECH ECOSYSTEM STRIP */}
      <section className="w-full py-14 border-t border-[#d2d2d7]/50 dark:border-neutral-800/80">
        <Container>
          <p className="text-center text-xs font-medium uppercase tracking-wider text-[#86868b] mb-8">
            Calibrated for technical standards across modern engineering stacks
          </p>
          <div className="opacity-60 dark:opacity-40 grayscale hover:grayscale-0 transition-all duration-300">
            <Marquee pauseOnHover speed={30}>
              <MarqueImg img="/assets/img/logo/react.png" />
              <MarqueImg img="/assets/img/logo/tailwindcss.png" />
              <MarqueImg img="/assets/img/logo/firebase.png" />
              <MarqueImg img="/assets/img/logo/microsoft.png" />
              <MarqueImg img="/assets/img/logo/zoom.png" />
              <MarqueImg img="/assets/img/logo/meet.png" />
            </Marquee>
          </div>
        </Container>
      </section>

      {/* 6. APPLE-STYLE MINIMALIST CTA SECTION */}
      <section className="w-full py-20 md:py-28 bg-[#fbfbfd] dark:bg-[#0e0e11] border-t border-[#d2d2d7]/60 dark:border-neutral-800">
        <Container className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-white leading-tight">
            Your next interview
            <br />
            begins now.
          </h2>
          <p className="text-base sm:text-lg text-[#86868b] max-w-xl mx-auto leading-relaxed">
            Practice freely with realistic interview scenarios and actionable evaluations. 
            No subscriptions required to begin.
          </p>
          <div className="pt-4 flex justify-center">
            <Link to="/generate">
              <Button className="rounded-full bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white text-sm font-medium px-8 py-3.5 h-auto shadow-none transition-all">
                Start Practicing Free
              </Button>
            </Link>
          </div>
        </Container>
      </section>

    </div>
  );
};

export default Home;