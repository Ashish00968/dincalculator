import { useState } from 'react';

const faqs = [
  {
    question: "How do you calculate DIN?",
    answer: "DIN is calculated using the official ISO 11088 standard in four steps: (1) Find your initial Skier Code based on weight and height; (2) Adjust the code up or down according to your Skier Type (I, II, or III); (3) Apply an age modifier if under 10 or 50+; (4) Cross-reference your final Skier Code with your Boot Sole Length (BSL in mm) on the ISO matrix."
  },
  {
    question: "What is DIN measurement?",
    answer: "DIN stands for Deutsches Institut für Normung (German Institute for Standardization). In skiing, a DIN setting measures the release torque value in decanewtons (daN) for your binding's toe and heel pieces, calibrated to release your boot safely before force causes leg or knee fractures."
  },
  {
    question: "How to use a DIN chart?",
    answer: "To use an ISO 11088 DIN chart, locate your Skier Code row based on your weight/height and ability level. Then, read across the table to find the column matching your Boot Sole Length (BSL). The intersecting number is your recommended baseline DIN setting."
  },
  {
    question: "How to adjust DIN on skis (and can I change it myself)?",
    answer: "DIN is physically adjusted by turning the tension screw located on both the toe and heel pieces until the visual indicator matches your target number. However, physical binding adjustment must always be torque-tested on calibrated diagnostic test equipment by a certified ski technician to ensure mechanical safety."
  },
  {
    question: "What should my child's DIN setting be (Kids Ski DIN)?",
    answer: "Children's DIN settings typically range from 0.75 to 3.0 depending on body weight (starting from under 13 kg / 29 lbs) and boot sole length. ISO 11088 applies specific lower-force tension curves for younger skiers to protect developing bones."
  },
  {
    question: "Does this DIN calculator support metric (kg/cm) and imperial (lbs/ft)?",
    answer: "Yes. Our calculator provides seamless one-click switching between Imperial (pounds, feet/inches) and Metric (kilograms, centimeters) with automatic geolocation detection for your regional preference."
  },
  {
    question: "How do I find my Boot Sole Length (BSL)?",
    answer: "Your Boot Sole Length (BSL) is measured in millimeters (e.g., 315mm) and is permanently embossed or stamped into the plastic on the heel lug or arch of your ski boot shell. It is different from Mondo sizing."
  },
  {
    question: "How do I determine my Skier Type (Type I, II, III)?",
    answer: "Type I is for cautious beginners who prefer easy release at lower forces. Type II is for moderate skiers skiing diverse terrain. Type III is for aggressive, fast skiers requiring higher retention to prevent pre-release under heavy g-forces."
  },
  {
    question: "Does my age affect my DIN setting?",
    answer: "Yes. Under the ISO 11088 standard, skiers under 10 years old and skiers aged 50 and older receive an automatic one-code reduction, which lowers the DIN to reduce fracture risk."
  },
  {
    question: "What happens if my DIN setting is too high?",
    answer: "If your DIN is set too high, the binding will fail to release during a twisting fall or crash, transferring high rotational stress directly into your knee ligaments (ACL/MCL) and tibia, greatly increasing injury risk."
  },
  {
    question: "What happens if my DIN setting is too low?",
    answer: "If your DIN is set too low, you may experience an accidental 'pre-release'—the binding pops open during hard turns, icy conditions, or over bumps, causing unexpected falls at speed."
  },
  {
    question: "Are DIN settings the same across all ski binding brands?",
    answer: "Yes. Because DIN is an international standard (ISO 11088 / ISO 9462), a DIN 6 on Marker bindings provides the exact same calibrated release force as a DIN 6 on Salomon, Look, Atomic, Tyrolia, or Armada bindings."
  }
];

export function AccordionFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 px-2 sm:px-0">
      <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-10 text-center tracking-tight">Frequently Asked Questions</h2>
      <div className="space-y-3 sm:space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className={`border transition-all duration-200 overflow-hidden ${
                isOpen 
                  ? 'border-accent bg-parchment rounded-2xl shadow-sm' 
                  : 'border-hairline bg-canvas rounded-xl sm:rounded-2xl hover:border-mute/50'
              }`}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between focus:outline-none"
              >
                <span className={`font-semibold text-sm sm:text-[15px] pr-4 ${isOpen ? 'text-primary' : 'text-ink'}`}>
                  {faq.question}
                </span>
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-primary' : 'text-mute'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-64 sm:max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-4 sm:px-6 sm:pb-5 text-sm text-mute leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
