import { H3 } from './typography';

export const SuggestionsList = ({ text }: { text: string }) => {
  const formatSuggestions = (text: string) => {
    const numberedPattern =
      /(\d+)\.\s*\*\*([^*]+?):\*\*\s*([^1-9]+?)(?=\d+\.\s*\*\*|$)/gs;
    const suggestions = [];
    let match: any;

    // biome-ignore lint/suspicious/noAssignInExpressions: <trust me>
    while ((match = numberedPattern.exec(text)) !== null) {
      const number = match[1].trim();
      const title = match[2].trim();
      const content = match[3].trim();
      suggestions.push({ title, content, number });
    }

    if (suggestions.length === 0) {
      const simpleNumberedPattern = /(\d+)\.\s*([^1-9]+?)(?=\d+\.|$)/gs;
      // biome-ignore lint/suspicious/noAssignInExpressions: <trust me>
      while ((match = simpleNumberedPattern.exec(text)) !== null) {
        const number = match[1].trim();
        const content = match[2].trim();

        const titleMatch = content.match(/\*\*([^*]+?)\*\*:\s*(.*)/s);
        if (titleMatch) {
          suggestions.push({
            title: titleMatch[1].trim(),
            content: titleMatch[2].trim(),
            number,
          });
        } else {
          const parts = content.split(':');
          if (parts.length > 1) {
            suggestions.push({
              title: parts[0].trim(),
              content: parts.slice(1).join(':').trim(),
              number,
            });
          } else {
            suggestions.push({
              title: `Suggestion ${number}`,
              content: content.trim(),
              number,
            });
          }
        }
      }
    }

    if (suggestions.length === 0) {
      const bulletPattern = /\*\*([^*]+?):\*\*\s*([^*]+?)(?=\s*\*\*|$)/g;
      // biome-ignore lint/suspicious/noAssignInExpressions: <trust me>
      while ((match = bulletPattern.exec(text)) !== null) {
        const title = match[1].trim();
        const content = match[2].trim();
        suggestions.push({ title, content });
      }
    }

    if (suggestions.length === 0) {
      const sentences = text.split(/\.\s+/).filter((s) => s.trim().length > 0);
      const keyWords = [
        'Formatting',
        'Quantify',
        'Tailor',
        'Elaborate',
        'Opening',
        'Body',
        'Closing',
        'Introduction',
        'Conclusion',
      ];

      sentences.forEach((sentence, index) => {
        const trimmed = sentence.trim();
        if (trimmed) {
          const foundKey = keyWords.find((key) =>
            trimmed.toLowerCase().includes(key.toLowerCase()),
          );

          if (foundKey) {
            const content = trimmed.replace(/^[^:]*:\s*/, '').trim();
            suggestions.push({
              title: foundKey,
              content: `${content}.`,
              number: (index + 1).toString(),
            });
          } else {
            suggestions.push({
              title: `Suggestion ${index + 1}`,
              content: `${trimmed}.`,
              number: (index + 1).toString(),
            });
          }
        }
      });
    }

    return suggestions;
  };

  const suggestions = formatSuggestions(text);

  return (
    <div className="p-4 space-y-4">
      <H3 className="font-semibold text-lg text-secondary-text">
        Cover Letter Suggestions
      </H3>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-3 h-3 bg-secondary-text/10 rounded-full flex items-center justify-center mt-1">
              <div className="w-2 h-2 bg-secondary-text rounded-full" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="font-medium text-secondary-text text-sm">
                {suggestion.title}
              </div>
              <div className="text-sm text-secondary-text leading-relaxed">
                {suggestion.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
