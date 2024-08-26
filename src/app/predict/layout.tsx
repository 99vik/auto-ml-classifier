export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Predict</h1>
      </div>
      {children}
    </div>
  );
}
