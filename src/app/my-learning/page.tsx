import UploadPdfButton from '@/components/UploadPdfButton';
import { getAllMaterials, getMaterialSummary } from '@/app/actions';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  quizzed: { label: 'Sudah Quiz', color: 'text-positive', bg: 'bg-positive/10', border: 'border-l-positive' },
  summarized: { label: 'Sudah Diringkas', color: 'text-accent-ink-blue', bg: 'bg-accent-ink-blue/10', border: 'border-l-accent-ink-blue' },
  new: { label: 'Baru', color: 'text-ink-muted', bg: 'bg-surface-border/30', border: 'border-l-ink-muted' },
};

export default async function MyLearning({ searchParams }: { searchParams: { id?: string } }) {
  const materials = await getAllMaterials();
  const selectedMaterialId = searchParams.id;
  const selectedMaterial = materials?.find(m => m.id === selectedMaterialId);
  const summary = selectedMaterialId ? await getMaterialSummary(selectedMaterialId) : null;

  return (
    <div className="flex gap-8 h-[calc(100vh-4rem)]">
      <div className="w-80 flex flex-col gap-3 overflow-y-auto pr-4 border-r border-surface-border shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-lg font-semibold">My Learning</h1>
          <UploadPdfButton />
        </div>

        {materials && materials.length > 0 ? materials.map((m) => {
          const s = statusConfig[m.status];
          return (
            <Link
              href={`/my-learning?id=${m.id}`}
              key={m.id}
              className={`block group relative bg-[#171B22] border rounded-lg p-4 cursor-pointer transition-colors duration-150 ${selectedMaterialId === m.id ? 'border-accent-ink-blue' : 'border-surface-border hover:border-ink-muted/30'}`}
            >
              <span className={`absolute left-0 top-2 bottom-2 w-[2.5px] rounded-r-full ${s.border}`} />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-ink-text">{m.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${s.bg} ${s.color}`}>
                    {s.label}
                  </span>
                </div>
              </div>
            </Link>
          );
        }) : (
          <p className="text-ink-muted text-sm mt-4 text-center">Belum ada PDF yang diunggah.</p>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#171B22]/50 border border-surface-border rounded-xl">
        {selectedMaterial ? (
          <div className="w-full max-w-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{selectedMaterial.title}</h2>
              {selectedMaterial.status !== 'new' && (
                <Link href={`/quiz/${selectedMaterial.id}`} className="bg-accent-ink-blue text-surface-base px-5 py-2 rounded-lg font-medium hover:opacity-90 transition">
                  Quiz Sekarang
                </Link>
              )}
            </div>
            
            {summary ? (
              <div className="prose prose-invert prose-p:text-ink-muted prose-headings:text-ink-text max-w-none overflow-y-auto pr-4 pb-20">
                <ReactMarkdown>{summary.summary_json?.text || "Tidak ada teks ringkasan."}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-ink-muted">
                {selectedMaterial.status === 'new' ? (
                  <p>Materi sedang diringkas, mohon tunggu beberapa saat...</p>
                ) : (
                  <p>Ringkasan tidak ditemukan.</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-ink-muted text-sm">Pilih materi untuk melihat ringkasan</p>
        )}
      </div>
    </div>
  );
}
