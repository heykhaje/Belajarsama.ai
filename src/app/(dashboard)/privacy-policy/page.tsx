import { Shield, Lock, FileText, CheckCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto pb-12 text-ink-text">
      {/* Header */}
      <div className="mb-12 border-b border-surface-border pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-sky/10 text-accent-sky text-[10px] font-mono uppercase tracking-wider font-semibold mb-6">
          <Shield size={14} />
          Updated: Juli 2026
        </div>
        <h1 className="font-display text-4xl lg:text-5xl font-semibold leading-tight mb-4">
          Kebijakan Privasi
        </h1>
        <p className="text-ink-muted text-lg max-w-2xl leading-relaxed">
          Di Belajarsama.ai, privasi dan keamanan data Anda adalah prioritas utama kami. Dokumen ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-surface-base border border-surface-border text-ink-muted">
              <FileText size={20} />
            </div>
            <h2 className="font-display text-2xl font-semibold">1. Informasi yang Kami Kumpulkan</h2>
          </div>
          <div className="pl-11 space-y-4 text-ink-muted leading-relaxed">
            <p>
              Kami hanya mengumpulkan informasi yang esensial untuk memberikan pengalaman belajar terbaik bagi Anda. Saat Anda mendaftar atau menggunakan layanan kami, kami dapat mengumpulkan:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Data Identitas:</strong> Nama lengkap dan alamat email yang Anda berikan saat pendaftaran.</li>
              <li><strong>Data Pembelajaran:</strong> Riwayat jadwal belajar, kuis yang diselesaikan, dan preferensi materi AI.</li>
              <li><strong>Data Otomatis:</strong> Alamat IP, jenis browser, dan data teknis dasar (melalui *cookies*) guna mengoptimalkan kinerja aplikasi.</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-surface-base border border-surface-border text-ink-muted">
              <Lock size={20} />
            </div>
            <h2 className="font-display text-2xl font-semibold">2. Penggunaan & Keamanan Data</h2>
          </div>
          <div className="pl-11 space-y-4 text-ink-muted leading-relaxed">
            <p>
              Belajarsama.ai menggunakan standar enkripsi industri (Supabase Auth) untuk memastikan bahwa data Anda tidak dapat diakses oleh pihak yang tidak bertanggung jawab. Kami menggunakan data Anda semata-mata untuk:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle size={18} className="text-accent-sky flex-shrink-0 mt-0.5" />
                <span>Personalisasi materi dari kecerdasan buatan (Gemini & Groq).</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={18} className="text-accent-sky flex-shrink-0 mt-0.5" />
                <span>Mengelola akses dan status login akun Anda secara aman.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={18} className="text-accent-sky flex-shrink-0 mt-0.5" />
                <span>Memperbaiki bug dan melakukan analisis pemakaian server.</span>
              </li>
            </ul>
            <p className="mt-4 p-4 rounded-lg bg-accent-sky/5 border border-accent-sky/20 text-ink-text text-sm">
              Kami <strong>TIDAK PERNAH</strong> menjual belikan, menyewakan, atau mendistribusikan data personal Anda kepada pihak ketiga atau agen periklanan mana pun.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-surface-base border border-surface-border text-ink-muted">
              <Shield size={20} />
            </div>
            <h2 className="font-display text-2xl font-semibold">3. Hak Pengguna</h2>
          </div>
          <div className="pl-11 space-y-4 text-ink-muted leading-relaxed">
            <p>
              Sebagai pengguna, Anda memiliki kendali penuh atas data Anda di ekosistem Belajarsama.ai:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Hak Akses:</strong> Anda bebas meninjau informasi profil yang tersimpan di sistem kami kapan saja melalui menu Pengaturan.</li>
              <li><strong>Hak Koreksi:</strong> Anda dapat mengubah Nama Lengkap atau Foto Profil secara mandiri dan *real-time*.</li>
              <li><strong>Hak Penghapusan (Right to be Forgotten):</strong> Jika Anda ingin menghapus seluruh jejak akun dan riwayat belajar Anda, silakan hubungi tim dukungan kami.</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="pt-8 border-t border-surface-border">
            <h2 className="font-display text-xl font-semibold mb-3">4. Hubungi Kami</h2>
            <p className="text-ink-muted leading-relaxed">
              Apabila Anda memiliki pertanyaan, keraguan, atau keluhan terkait Kebijakan Privasi ini, silakan hubungi pengembang sistem kami melalui portal portofolio resmi: <a href="https://adjiprasetyo-lilac.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-accent-sky hover:underline font-medium">adji.dev</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
