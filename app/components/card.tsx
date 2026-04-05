

export default function Card({ children, className = '' }: any) {
  return (
    <div
      className={`
        bg-white
        p-6
        rounded-xl
        border
        shadow-sm
        transition
        duration-300
        hover:shadow-md
        hover:-translate-y-1
        ${className}
      `}
    >
      {children}
    </div>
  )
}