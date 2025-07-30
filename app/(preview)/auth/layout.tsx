export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="transition-opacity duration-300 opacity-100 animate-fade-in">
      {children}
    </div>
  );
}
