import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "./OurProcess.css";

const processStages = [
  {
    number: "01",
    title: "Discover the Brand",
    description:
      "Understand the business, its goals, target audience, challenges, and current digital presence.",
    focus: "Discovery · Research · Understanding",
  },
  {
    number: "02",
    title: "Define the Strategy",
    description:
      "Build a clear direction around brand positioning, audience, messaging, platforms, and campaign objectives.",
    focus: "Strategy · Positioning · Direction",
  },
  {
    number: "03",
    title: "Create with Purpose",
    description:
      "Develop content ideas, creative concepts, campaign plans, and influencer collaborations according to the chosen services.",
    focus: "Content · Creativity · Campaign Planning",
  },
  {
    number: "04",
    title: "Launch & Amplify",
    description:
      "Bring the strategy to life through social media management, influencer campaigns, and digital marketing execution.",
    focus: "Execution · Publishing · Campaign Management",
  },
  {
    number: "05",
    title: "Measure & Evolve",
    description:
      "Review campaign performance, understand what works, identify opportunities, and refine the next direction.",
    focus: "Insights · Optimization · Growth",
  },
];

export default function OurProcess() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("next");

  const activeStage = processStages[activeIndex];

  const goToStage = (index) => {
    const nextIndex = (index + processStages.length) % processStages.length;

    setSlideDirection(
      index >= processStages.length || index > activeIndex ? "next" : "prev",
    );

    setActiveIndex(nextIndex);
  };

  return (
    <section className="our-process" id="our-process">
      <div className="our-process__container">
        {/* Section heading */}
        <div className="our-process__heading">
          <h2>
            Our
            <br />
            Process<span>.</span>
          </h2>

          <p>
            A clear, collaborative journey that turns
            <br />
            ideas into measurable brand growth.
          </p>
        </div>

        {/* Stage navigation */}
        <div className="our-process__tabs" role="tablist">
          {processStages.map((stage, index) => (
            <button
              key={stage.number}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              className={`our-process__tab ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => goToStage(index)}
            >
              {stage.title}
            </button>
          ))}
        </div>

        {/* Slider card */}
        <div className="our-process__slider">
          <button
            type="button"
            className="our-process__arrow our-process__arrow--left"
            onClick={() => goToStage(activeIndex - 1)}
            aria-label="Previous process stage"
          >
            <ArrowLeft />
          </button>

          <div
            className={`our-process__card slide-${slideDirection}`}
            key={activeStage.number}
          >
            {/* Video placeholder */}
            <div className="our-process__video">
              <span>VIDEO CONTENT GOES HERE</span>
            </div>

            {/* Stage information */}
            <div className="our-process__content">
              <span className="our-process__number">
                {activeStage.number} / 05
              </span>

              <h3>
                {activeStage.title}
                <span>.</span>
              </h3>

              <p className="our-process__description">
                {activeStage.description}
              </p>

              <p className="our-process__focus">
                <strong>Focus:</strong> {activeStage.focus}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="our-process__arrow our-process__arrow--right"
            onClick={() => goToStage(activeIndex + 1)}
            aria-label="Next process stage"
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
