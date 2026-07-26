import { redirect } from 'next/navigation';

export default function ContentStudioPage() {
  redirect('/dashboard?tab=content');
}
