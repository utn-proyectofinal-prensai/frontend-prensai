interface TopicBadgeProps {
  topic?: { id: number; name: string } | null;
  className?: string;
}

export default function TopicBadge({ topic, className = '' }: TopicBadgeProps) {
  if (!topic) {
    return <span className={`text-white/50 ${className}`}>-</span>;
  }

  return (
    <span 
      className={`inline-block bg-green-500/20 text-green-300 rounded-md text-xs font-medium ${className}`}
      style={{ padding: '0.5rem 0.75rem' }}
    >
      {topic.name}
    </span>
  );
}

