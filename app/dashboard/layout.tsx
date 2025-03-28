export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div>{children}</div>
    </main>
  );
}
