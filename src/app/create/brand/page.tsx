import { redirect } from 'next/navigation';

export default function BrandStudioPage() {
  redirect('/dashboard?tab=brand');
}
