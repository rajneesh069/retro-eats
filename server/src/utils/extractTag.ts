export const findTagWithHighestConfidence = (tags: Array<{ confidence: number, tag: { en: string } }>) => {
    
    const highestConfidenceTag = tags.reduce((max, current) => {
      return (current.confidence > max.confidence) ? current : max;
    }, tags[0]);
  
    return highestConfidenceTag;
  };