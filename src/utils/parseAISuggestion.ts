// src/utils/parseAISuggestion.ts

export interface RoadmapHighlightItem {
  title: string;
  description: string;
  isProjectIdea?: boolean;
}

export interface ParsedAISuggestion {
  suggestedCareerPath?: string;
  learningRoadmapHighlights: RoadmapHighlightItem[]; // Changed to non-optional, defaults to empty array
}

// This regex aims to capture the main parts of each list item:
// 1. The number (e.g., "1.")
// 2. The bolded title (e.g., "**Core Skill 1:**" or "**Project Idea:**")
// 3. The description following the title.
// It handles multi-line descriptions by looking for the start of the next numbered item or end of string.
const listItemRegex =
  /(\d+\.\s*\*\*(.*?):\*\*\s*([\s\S]*?))(?=\n\d+\.\s*\*\*|$)/g;

export function parseAISuggestion(
  suggestionText: string | null | undefined
): ParsedAISuggestion {
  const parsed: ParsedAISuggestion = {
    suggestedCareerPath: undefined,
    learningRoadmapHighlights: [],
  };

  if (!suggestionText) {
    return parsed;
  }

  // Extract Suggested Career Path
  const careerPathMatch = suggestionText.match(
    /^\*\*(Suggested Career Path):\*\*\s*([\s\S]*?)(?=\n\n\*\*(Learning Roadmap Highlights):\*\*|$)/i
  );
  if (careerPathMatch && careerPathMatch[2]) {
    parsed.suggestedCareerPath = careerPathMatch[2].trim();
  }

  // Extract Learning Roadmap Highlights section
  const roadmapHighlightsSectionMatch = suggestionText.match(
    /\*\*(Learning Roadmap Highlights):\*\*\s*([\s\S]*)/i
  );
  if (roadmapHighlightsSectionMatch && roadmapHighlightsSectionMatch[2]) {
    const highlightsText = roadmapHighlightsSectionMatch[2].trim();
    let match;
    while ((match = listItemRegex.exec(highlightsText)) !== null) {
      parsed.learningRoadmapHighlights.push({
        title: match[2].trim(), // The text between ** and :**
        description: match[3].trim(), // The text after the title
        isProjectIdea: match[2].toLowerCase().includes("project idea"),
      });
    }

    // If regex doesn't find items but highlightsText exists, it might be a simple list or unformatted.
    // This part can be enhanced if needed for more flexible parsing.
    if (
      parsed.learningRoadmapHighlights.length === 0 &&
      highlightsText.length > 0 &&
      !parsed.suggestedCareerPath
    ) {
      // If career path wasn't found either, maybe the whole text is the suggestion.
      // This is a fallback; ideally, the AI follows the prompt format.
      if (!parsed.suggestedCareerPath && sections.length === 0) {
        parsed.suggestedCareerPath = suggestionText.trim(); // Or treat as a single block of highlights
      }
    }
  }

  // Fallback if no specific sections were parsed but text exists
  if (
    !parsed.suggestedCareerPath &&
    parsed.learningRoadmapHighlights.length === 0 &&
    suggestionText
  ) {
    // Attempt to treat the whole thing as a career path suggestion if no structure found
    // Or, you might want to split by paragraphs if no structure is clear
    const lines = suggestionText.split("\n");
    if (lines[0]?.toLowerCase().includes("suggested career path")) {
      parsed.suggestedCareerPath = suggestionText; // Keep as is, let component below handle bolding
    } else {
      // Add as a generic roadmap item or handle as unstructured text
      // For now, let's assume it's an unstructured suggestion if parsing fails
      parsed.suggestedCareerPath =
        "AI Suggestion (unstructured):\n" + suggestionText;
    }
  }

  return parsed;
}
