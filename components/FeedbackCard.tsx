interface Feedback {
  score: number;
  confidence: 'low' | 'medium' | 'high';
  strengths: string[];
  improvements: string[];
  summary: string;
}

interface FeedbackCardProps {
  feedback: Feedback;
}

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
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
    <div className="mt-6 p-6 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-cyan-400">AI Feedback</h3>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getConfidenceColor(feedback.confidence)}`}>
            {feedback.confidence.toUpperCase()} CONFIDENCE
          </span>
          <span className={`text-2xl font-bold ${getScoreColor(feedback.score)}`}>
            {feedback.score}/10
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium text-green-400 mb-2">Strengths:</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {feedback.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-yellow-400 mb-2">Improvements:</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {feedback.improvements.map((improvement, index) => (
              <li key={index}>{improvement}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-600 pt-4">
        <h4 className="font-medium text-purple-400 mb-2">Summary:</h4>
        <p className="text-gray-300">{feedback.summary}</p>
      </div>
    </div>
  );
}
