interface DiscountBadgeProps {
  discount: number;
  size?: 'sm' | 'md' | 'lg';
}

export function DiscountBadge({ discount, size = 'md' }: DiscountBadgeProps) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <div
      className={`${sizes[size]} font-semibold bg-[#f97316] text-white rounded-lg inline-flex items-center justify-center shadow-sm`}
    >
      -{discount}%
    </div>
  );
}
