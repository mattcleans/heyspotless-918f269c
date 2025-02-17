
import React from 'react';

interface Step {
  label: string;
  value: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
}

export const Steps = ({ steps, currentStep }: StepsProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => (
        <div
          key={step.value}
          className="flex items-center"
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index <= currentStep
                ? 'bg-[#0066B3] text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {index + 1}
          </div>
          <div className="ml-2 hidden sm:block">
            <p
              className={`text-sm ${
                index <= currentStep ? 'text-[#0066B3]' : 'text-gray-500'
              }`}
            >
              {step.label}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-[2px] w-12 mx-2 ${
                index < currentStep ? 'bg-[#0066B3]' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
