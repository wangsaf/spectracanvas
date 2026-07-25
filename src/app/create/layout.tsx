import Sidebar from '@/components/shared/sidebar';

const sidebarItems = [
  { label: 'BRAND', href: '/create/brand', icon: 'B' },
  { label: 'PIXEL', href: '/create/pixel', icon: 'P' },
  { label: 'CONTENT', href: '/create/content', icon: 'C' },
];

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <Sidebar items={sidebarItems} title="CREATE" />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
