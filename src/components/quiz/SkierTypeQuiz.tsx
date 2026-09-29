import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { CheckCircle2Icon, ChevronRightIcon, SparklesIcon } from '../ui/Icons';
import type { SkierType } from '../../engine/types';

interface QuizQuestion {
  question: string;
  subtitle: string;
  options: {
    label: string;
    points: number; // -1 to 3
    desc: string;
  }[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    question: "1. What terrain do you primarily ski?",
    subtitle: "Select the highest difficulty you ski regularly.",
    options: [
      { label: "Gentle greens & nursery slopes", points: -1, desc: "Smooth groomed beginner terrain only" },
      { label: "Mellow blues & groomed greens", points: 0, desc: "Cruising at relaxed pace on marked trails" },
      { label: "Varied terrain (blues, groomed blacks, light moguls)", points: 1, desc: "All-mountain cruising with confidence" },
      { label: "Steep blacks, moguls, trees, off-piste & powder", points: 2, desc: "Demanding, un-groomed, steep terrain" },
    ]
  },
  {
    question: "2. What is your typical skiing speed?",
    subtitle: "Be honest about your actual sustained speed.",
    options: [
      { label: "Slow, cautious, controlled snowplow or stem christie", points: -1, desc: "Staying well below resort traffic speed" },
      { label: "Moderate speed with controlled parallel turns", points: 0, desc: "Comfortable matched turns at leisurely speeds" },
      { label: "Moderate to fast, dynamic carved turns", points: 1, desc: "Moving with the flow of the mountain" },
      { label: "Fast, aggressive, high-g turns on steep gradients", points: 2, desc: "High kinetic forces and aggressive edge angles" },
    ]
  },
  {
    question: "3. What is your binding release preference?",
    subtitle: "Your safety priority during awkward falls.",
    options: [
      { label: "Release as easily as possible at the slightest twist", points: -1, desc: "Minimize knee ligament and fracture risk above all" },
      { label: "Standard release: balance between security and release", points: 0, desc: "Standard beginner-to-intermediate release behavior" },
      { label: "Retention on firm snow, but release in real crashes", points: 1, desc: "All-mountain baseline balance" },
      { label: "Maximum retention: absolutely no pre-release in rough snow", points: 2, desc: "Premature ejection on steep terrain is a hazard" },
    ]
  },
  {
    question: "4. How often do you ski steep off-piste or terrain parks?",
    subtitle: "Air time, hard landings, and icy bumps require retention.",
    options: [
      { label: "Never, I avoid steep or uneven snow", points: 0, desc: "Groomed pistes only" },
      { label: "Occasionally when conditions are soft", points: 1, desc: "Dip into the side of the trail or light powder" },
      { label: "Regularly tackle moguls, drops, and steep bowls", points: 2, desc: "Heavy impacts, jumps, and dynamic forces" },
    ]
  },
  {
    question: "5. What is your skiing experience level?",
    subtitle: "Total time and confidence on the mountain.",
    options: [
      { label: "Novice (under 5 days on snow)", points: -1, desc: "Learning basic edge control and braking" },
      { label: "Developing intermediate (5 to 20 days)", points: 0, desc: "Navigating most blue runs smoothly" },
      { label: "Solid intermediate to advanced (20+ days across years)", points: 1, desc: "Skis almost anything open on the trail map" },
      { label: "Seasoned expert / racer / freerider", points: 2, desc: "Trained athlete or lifelong mountain resident" },
    ]
  }
];

export function SkierTypeQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [resultType, setResultType] = useState<SkierType | null>(null);

  const handleSelectOption = (points: number) => {
    const nextAnswers = [...answers, points];
    setAnswers(nextAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate outcome
      const totalScore = nextAnswers.reduce((a, b) => a + b, 0);
      let calculatedType: SkierType = 'II';
      if (totalScore <= -2) {
        calculatedType = '-I';
      } else if (totalScore <= 0) {
        calculatedType = 'I';
      } else if (totalScore <= 4) {
        calculatedType = 'II';
      } else if (totalScore <= 7) {
        calculatedType = 'III';
      } else {
        calculatedType = 'III+';
      }
      setResultType(calculatedType);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResultType(null);
  };

  if (resultType) {
    const typeInfo: Record<SkierType, { title: string; badge: string; desc: string; shift: string }> = {
      '-I': {
        title: "Type -I (Cautious Novice)",
        badge: "One Row Higher (Lower DIN)",
        desc: "Recommended for cautious beginners or those returning from injury who prioritize early, low-impact binding release.",
        shift: "-1 Row from baseline"
      },
      'I': {
        title: "Type I (Cautious / Beginner)",
        badge: "Baseline Row (Standard Entry DIN)",
        desc: "Prefers cautious skiing at relaxed speeds on gentle-to-moderate terrain. Releases easily in twisting falls.",
        shift: "Standard baseline row"
      },
      'II': {
        title: "Type II (Moderate / All-Mountain)",
        badge: "One Row Lower (+1 Higher DIN)",
        desc: "The most common skier profile. Confidently skis diverse terrain at moderate speeds, balancing retention with release protection.",
        shift: "+1 Row lower on ISO chart"
      },
      'III': {
        title: "Type III (Aggressive / Expert)",
        badge: "Two Rows Lower (+2 Higher DIN)",
        desc: "Aggressive skiers on steep, challenging terrain requiring higher retention forces to prevent unwanted pre-release during high g-forces.",
        shift: "+2 Rows lower on ISO chart"
      },
      'III+': {
        title: "Type III+ (Extreme / Racer)",
        badge: "Three Rows Lower (+3 Higher DIN)",
        desc: "Manufacturer convention for competitive athletes, high-speed racers, and freeriders demanding maximum retention.",
        shift: "+3 Rows lower (Industry convention)"
      }
    };

    const info = typeInfo[resultType];

    return (
      <Card className="max-w-2xl mx-auto p-6 sm:p-8 space-y-6 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto shadow-sm">
          <SparklesIcon className="w-7 h-7" />
        </div>

        <div>
          <span className="text-xs font-mono text-accent uppercase tracking-wider block mb-1">Your Recommended Classification</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">{info.title}</h2>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-parchment border border-hairline font-mono text-xs text-primary font-semibold">
            {info.badge}
          </span>
        </div>

        <p className="text-sm text-mute leading-relaxed max-w-lg mx-auto">
          {info.desc}
        </p>

        <div className="p-4 rounded-xl bg-parchment border border-hairline text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-mute">ISO 11088 Table Shift:</span>
            <span className="font-mono font-semibold text-ink">{info.shift}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-mute">Standard Source:</span>
            <span className="font-mono text-ink">ISO 11088:2023 Edition 7</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={`/#t=${resultType}`}
            className="flex-1 py-3 px-6 rounded-full bg-primary text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-all text-center"
          >
            Apply Type {resultType} to Calculator →
          </a>
          <button
            type="button"
            onClick={handleReset}
            className="py-3 px-6 rounded-full border border-hairline bg-canvas text-ink text-sm font-medium hover:border-primary/50 transition-all cursor-pointer"
          >
            Retake Quiz
          </button>
        </div>
      </Card>
    );
  }

  const q = QUESTIONS[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / QUESTIONS.length) * 100);

  return (
    <Card className="max-w-2xl mx-auto p-6 sm:p-8 space-y-6">
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center text-xs font-mono text-mute mb-2">
          <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="w-full h-1.5 bg-input rounded-full overflow-hidden border border-hairline">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-bold text-ink">{q.question}</h2>
        <p className="text-xs text-mute mt-1">{q.subtitle}</p>
      </div>

      <div className="space-y-3 pt-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelectOption(opt.points)}
            className="w-full p-4 rounded-xl border border-hairline bg-parchment hover:border-primary/50 hover:bg-canvas text-left transition-all group cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="text-sm font-semibold text-ink group-hover:text-primary transition-colors block">
                {opt.label}
              </span>
              <span className="text-xs text-mute mt-0.5 block">{opt.desc}</span>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-mute group-hover:text-primary transition-colors shrink-0 ml-3" />
          </button>
        ))}
      </div>
    </Card>
  );
}
