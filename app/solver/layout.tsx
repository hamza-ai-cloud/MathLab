import { SolverHeader } from '@/components/layout/SolverHeader';

export default function SolverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-deep overflow-hidden">
      <SolverHeader />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
