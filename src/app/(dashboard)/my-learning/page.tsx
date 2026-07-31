import UploadPdfButton from '@/components/UploadPdfButton';
import { getAllMaterials, getMaterialSummary } from '@/app/actions';
import Link from 'next/link';
import StreamingSummary from '@/components/StreamingSummary';
import DeleteMaterialButton from '@/components/DeleteMaterialButton';
import MaterialStatePreserver from './MaterialStatePreserver';
import { GraduationCap } from 'lucide-react';
import { Suspense } from 'react';

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  quizzed: { label: 'Sudah Quiz', color: 'text-positive', bg: 'bg-positive/10', border: 'border-l-positive' },
  summarized: { label: 'Sudah Diringkas', color: 'text-accent-sky', bg: 'bg-accent-sky/10', border: 'border-l-accent-sky' },
  new: { label: 'Baru', color: 'text-ink-muted', bg: 'bg-white/5', border: 'border-l-ink-muted' },
};

export default async function MyLearning({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  let materials: any[] = [];
  let summary: any = null;
  
  try {
    materials = await getAllMaterials() || [];
  } catch (e) {
    console.error('[MyLearning] Failed to fetch materials:', e);
  }
  
  const resolvedParams = await searchParams;
  const selectedMaterialId = resolvedParams.id;
  const selectedMaterial = materials?.find(m => m.id === selectedMaterialId);
  
  if (selectedMaterialId) {
    try {
      summary = await getMaterialSummary(selectedMaterialId);
    } catch (e) {
      console.error('[MyLearning] Failed to fetch summary:', e);
    }
  }

  return (
    <div className="flex gap-8 h-[calc(100vh-4rem)]">
      <Suspense fallback={null}>
        <MaterialStatePreserver defaultId={materials?.[0]?.id} />
      </Suspense>
      
      <div className="w-80 flex flex-col gap-3 overflow-y-auto pr-4 border-r border-surface-border shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-display text-lg font-semibold text-ink-text">My Learning</h1>
          <UploadPdfButton />
        </div>

        {materials && materials.length > 0 ? materials.map((m) => {
          const s = statusConfig[m.status];
          return (
            <Link
              href={`/my-learning?id=${m.id}`}
              key={m.id}
              className={`block group relative bg-surface-raised border rounded-lg p-4 cursor-pointer transition-all duration-200 shadow-sm ${selectedMaterialId === m.id ? 'border-accent-sky/40 ring-1 ring-accent-sky/20' : 'border-surface-border hover:border-zinc-300'}`}
            >
              <span className={`absolute left-0 top-2 bottom-2 w-[2.5px] rounded-r-full ${selectedMaterialId === m.id ? 'bg-accent-sky' : s.border}`} />
              <div className="ml-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-sm font-medium text-ink-text truncate pt-1">{m.title}</h3>
                  <DeleteMaterialButton materialId={m.id} title={m.title} />
                </div>
                <div className="flex items-center gap-2 mt-1">
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

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface-raised border border-surface-border rounded-xl shadow-sm">
        {selectedMaterial ? (
          <div className="w-full max-w-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-sky" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">Materi</span>
                </div>
                <h2 className="font-display text-2xl font-semibold text-ink-text">{selectedMaterial.title}</h2>
              </div>
              {selectedMaterial.status !== 'new' && (
                <Link href={`/quiz/${selectedMaterial.id}`} className="btn-academic">
                  Quiz Sekarang
                </Link>
              )}
            </div>
            
            {(() => {
              // Extract and clean summary text
              let summaryText = '';
              if (summary) {
                const sj = summary.summary_json;
                
                if (sj?.text && typeof sj.text === 'string') {
                  summaryText = sj.text
                    .replace(/<think>[\s\S]*?<\/think>/g, '')
                    .replace(/<think>[\s\S]*$/, '')
                    .trim();
                }
                
                if (!summaryText && sj?.sections) {
                  summaryText = `# ${sj.title || selectedMaterial.title}\n\n` + 
                    sj.sections.map((s: any) => `## ${s.heading}\n${s.key_points.map((k: any) => `- ${k}`).join('\n')}`).join('\n\n') +
                    (sj.overall_takeaways ? `\n\n## Kesimpulan\n${sj.overall_takeaways.map((k: any) => `- ${k}`).join('\n')}` : '');
                }
              }
              
              if (!summaryText) {
                // If summary doesn't exist or is empty, trigger streaming generation
                return (
                  <StreamingSummary 
                    key={selectedMaterial.id}
                    materialId={selectedMaterial.id} 
                    status="new"
                  />
                );
              }
              
              return (
                <StreamingSummary 
                  key={selectedMaterial.id}
                  materialId={selectedMaterial.id} 
                  initialSummaryText={summaryText}
                  status={selectedMaterial.status}
                />
              );
            })()}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-ink-muted">
            <GraduationCap size={32} className="opacity-30" />
            <p className="text-sm">Pilih materi untuk melihat ringkasan</p>
          </div>
        )}
      </div>
    </div>
  );
}
