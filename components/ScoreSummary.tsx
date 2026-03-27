interface ScoreSummaryProps {
  averageScore: number;
  confidence: 'low' | 'medium' | 'high';
  totalQuestions: number;
  role: string;
}

export default function ScoreSummary({ averageScore, confidence, totalQuestions, role }: ScoreSummaryProps) {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-500/20 text-green-300 border-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400';
      case 'low': return 'bg-red-500/20 text-red-300 border-red-400';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 5) return 'text-red-400';
    if (score < 8) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div 
      className="backdrop-blur-md border border-cyan-500/10 rounded-2xl p-8 text-center"
      style={{ backgroundColor: 'rgba(25, 25, 31, 0.4)' }}
    >
      <div className="mb-6">
        <div className={`text-6xl font-bold mb-2 ${getScoreColor(averageScore)}`}>
          {averageScore}
        </div>
        <div className="text-2xl text-gray-300 mb-4">out of 10</div>
        <div className={`inline-block px-4 py-2 rounded-full text-lg font-medium border ${getConfidenceColor(confidence)}`}>
          {confidence.toUpperCase()} CONFIDENCE
        </div>
      </div>

      <div className="text-gray-300 mb-6">
        <p className="text-lg">{role}</p>
        <p className="text-sm">{totalQuestions} Questions Completed</p>
      </div>
    </div>
  );
}
