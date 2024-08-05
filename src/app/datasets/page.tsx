'use client';

import uploadCsv from '@/actions';

export default function Page() {
  return (
    <div className="h-full">
      <button onClick={() => uploadCsv()}>click me</button>
      <p>datasets</p>
    </div>
  );
}
