import React from 'react';

interface PredefinedRangesProps {
  predefinedRanges: { label: string; range: [Date, Date] }[];
  onRangeClick: (range: [Date, Date]) => void;
}

const PredefinedRanges: React.FC<PredefinedRangesProps> = ({
  predefinedRanges,
  onRangeClick,
}) => {
  return (
    <div className="predefined-ranges">
      {predefinedRanges.map((range, index) => (
        <button key={index} onClick={() => onRangeClick(range.range)}>
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default PredefinedRanges;
