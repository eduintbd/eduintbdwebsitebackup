interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo = ({ className = "", size = 40 }: LogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle - broken at top */}
      <path
        d="M95 25C85 15 72 8 60 8C30 8 8 30 8 60C8 90 30 112 60 112C90 112 112 90 112 60C112 48 108 37 100 28"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner checkmark / V shape */}
      <path
        d="M32 58L56 86L92 34"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};
