export default function Section({
  children,
  className = '',
  container = true,
}: any) {
  return (
    <section className={`py-20 ${className}`}>
      {container ? (
        <div className="max-w-6xl mx-auto px-6">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  )
}