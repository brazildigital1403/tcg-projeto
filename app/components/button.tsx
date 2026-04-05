export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: any) {
  const base =
    'px-6 py-3 rounded-full transition inline-block cursor-pointer'

  const variants: any = {
    primary: 'bg-black text-white hover:opacity-90',
    secondary:
      'border border-black hover:bg-black hover:text-white',
    ghost: 'hover:bg-gray-100',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}