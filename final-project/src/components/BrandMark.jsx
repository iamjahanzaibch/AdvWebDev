import { useId } from "react";

export default function BrandMark() {
  const gradientId = useId();

  return (
    <svg className="brand__mark" viewBox="0 0 48 48" role="img" aria-label="Booking System logo">
      <defs>
        <linearGradient id={gradientId} x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#e10e49" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="38" height="38" rx="13" fill={`url(#${gradientId})`} opacity="0.96" />
      <path
        d="M15 17.5H33V21.5H15V17.5ZM15 24H28V28H15V24ZM15 30.5H24V34.5H15V30.5Z"
        fill="#1e1e1e"
        opacity="0.95"
      />
    </svg>
  );
}
