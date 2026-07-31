'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MaterialStatePreserver({ defaultId }: { defaultId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const idInUrl = searchParams.get('id');
    const storedId = localStorage.getItem('lastSelectedMaterialId');

    if (idInUrl) {
      // Update the stored ID when the user clicks a material
      localStorage.setItem('lastSelectedMaterialId', idInUrl);
    } else if (storedId && !idInUrl) {
      // User navigated back to /my-learning without an ID, restore the last one
      router.replace(`/my-learning?id=${storedId}`);
    } else if (!idInUrl && defaultId) {
      // First time visiting, select the newest material automatically
      router.replace(`/my-learning?id=${defaultId}`);
    }
  }, [searchParams, router, defaultId]);

  return null;
}
