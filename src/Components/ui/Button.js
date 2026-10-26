const variantClasses = {
  primary: "bg-[#844de9] text-white hover:bg-[#7337df] shadow-sm",
  secondary:
    "border border-[#844de9] text-[#844de9] bg-transparent hover:bg-[#844de9] hover:text-white",
  danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
};

const sizeClasses = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-xs font-semibold",
  lg: "h-11 px-5 text-sm font-semibold",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#844de9] cursor-pointer";
  const variantCls = variantClasses[variant] ?? variantClasses.primary;
  const sizeCls = sizeClasses[size] ?? sizeClasses.md;
  const disabledCls =
    disabled || isLoading ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${variantCls} ${sizeCls} ${disabledCls} ${className}`.trim()}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
}
