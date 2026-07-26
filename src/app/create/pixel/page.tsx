import { redirect } from 'next/navigation';

export default function PixelStudioPage() {
  redirect('/dashboard?tab=pixel');
}
