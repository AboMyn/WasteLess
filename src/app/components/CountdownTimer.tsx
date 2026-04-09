import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  expiresAt: Date;
  size?: 'sm' | 'md' | 'lg';
}

export function CountdownTimer({ expiresAt, size = 'md' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = expiresAt.getTime() - Date.now();
    
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (timeLeft.expired) {
    return (
      <div className="flex items-center gap-1.5 text-destructive">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">Expired</span>
      </div>
    );
  }

  const isUrgent = timeLeft.hours < 2;
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center gap-1.5 ${isUrgent ? 'text-[#f97316]' : 'text-muted-foreground'}`}>
      <Clock className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      <span className={`${textSizes[size]} font-medium`}>
        {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left
      </span>
    </div>
  );
}
