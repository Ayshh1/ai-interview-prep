interface Question {
  id: number;
  question: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({ question, questionNumber, totalQuestions }: QuestionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300 border-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-300 border-red-400';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400';
    }
  };

  return (
    <div 
      className="backdrop-blur-md border border-cyan-500/10 rounded-2xl p-6"
      style={{ backgroundColor: 'rgba(25, 25, 31, 0.4)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-white">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty.toUpperCase()}
          </span>
        </div>
        <span className="text-gray-400 text-sm">
          {question.type}
        </span>
      </div>
      
      <h2 className="text-xl font-semibold text-white">
        {question.question}
      </h2>
    </div>
  );
}
