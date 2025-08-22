interface Question {
  id: number;
  title: string;
  options: Array<{
    id: number;
    title: string;
  }>;
}

interface QuestionTabProps {
  question: Question;
  timeRemaining: number;
  selectedOption: number | null;
  correctOptionId: number | null;
  answerSubmitted: boolean;
  onSubmitAnswer: (optionId: number) => void;
}

export default function QuestionTab({
  question,
  timeRemaining,
  selectedOption,
  correctOptionId,
  answerSubmitted,
  onSubmitAnswer
}: QuestionTabProps) {
  const getOptionButtonClass = (optionId: number) => {
    let buttonClass = "w-full p-3 text-left border-2 rounded-lg transition-colors ";
    
    if (correctOptionId !== null) {
      // Show correct/incorrect after reveal
      if (optionId === correctOptionId) {
        buttonClass += "bg-green-100 border-green-500 text-green-800";
      } else if (optionId === selectedOption) {
        buttonClass += "bg-red-100 border-red-500 text-red-800";
      } else {
        buttonClass += "bg-gray-50 border-gray-300";
      }
    } else if (selectedOption === optionId) {
      // Show selected option
      buttonClass += "bg-blue-100 border-blue-500";
    } else {
      // Default state
      buttonClass += "border-gray-300 hover:border-blue-400 hover:bg-blue-50";
    }
    
    return buttonClass;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Question</h2>
        <div className="text-lg font-bold text-blue-600">
          Time: {timeRemaining}s
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="text-lg font-medium mb-4">{question.title}</h3>
        
        <div className="space-y-3">
          {question.options.map(option => (
            <button
              key={option.id}
              onClick={() => onSubmitAnswer(option.id)}
              disabled={answerSubmitted || timeRemaining === 0 || correctOptionId !== null}
              className={getOptionButtonClass(option.id)}
            >
              {option.title}
            </button>
          ))}
        </div>
        
        {answerSubmitted && correctOptionId === null && (
          <p className="mt-4 text-center text-green-600 font-medium">
            Answer submitted! Waiting for results...
          </p>
        )}
      </div>
    </div>
  );
}