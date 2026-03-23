import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExpandableTextProps {
  text: string;
  lines?: number;
  className?: string;
  buttonClassName?: string;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({ 
  text, 
  lines = 3, 
  className = '',
  buttonClassName = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight);
        const maxHeight = lineHeight * lines;
        setNeedsTruncation(textRef.current.scrollHeight > maxHeight);
      }
    };
    
    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [text, lines]);

  return (
    <div className="relative">
      <p
        ref={textRef}
        className={`${className} ${!isExpanded ? 'line-clamp-3' : ''}`}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: isExpanded ? undefined : lines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {text}
      </p>
      {needsTruncation && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`text-blue-600 font-bold text-sm mt-1 hover:underline ${buttonClassName}`}
        >
          {isExpanded ? 'Show Less' : 'Show More...'}
        </button>
      )}
    </div>
  );
};
