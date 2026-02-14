export default function MainBackground({children}: {children: React.ReactNode}) {
  return (
    <div className="bg-bg-primary min-h-screen w-full">
      {children}
    </div>
  )
}