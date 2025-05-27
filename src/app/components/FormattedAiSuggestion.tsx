// src/app/components/FormattedAiSuggestion.tsx
"use client";

import React from "react";
import { Target } from "lucide-react";

interface FormattedAiSuggestionProps {
  suggestionText: string | null | undefined;
}

const FormattedAiSuggestion: React.FC<FormattedAiSuggestionProps> = ({
  suggestionText,
}) => {
  if (!suggestionText) {
    return (
      <p className="text-gray-400 italic">
        No career suggestion available yet. Complete your questionnaire to get
        one!
      </p>
    );
  }

  // Only look for the career path section
  const careerPathMatch = suggestionText.match(
    /^\*\*Suggested Career Path:\*\*\s*(.*)/im
  );

  if (!careerPathMatch) {
    return (
      <div className="space-y-2">
        {suggestionText.split("\n").map((paragraph, index) => (
          <p
            key={index}
            className="text-gray-200 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: paragraph.replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>"
              ),
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Target size={28} className="text-yellow-300 mr-3 flex-shrink-0" />
        <h3 className="text-xl font-semibold text-yellow-200">
          Suggested Career Path
        </h3>
      </div>
      <p
        className="text-gray-100 leading-relaxed whitespace-pre-wrap pl-10"
        dangerouslySetInnerHTML={{
          __html: careerPathMatch[1].replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
          ),
        }}
      />
    </div>
  );
};

export default FormattedAiSuggestion;
