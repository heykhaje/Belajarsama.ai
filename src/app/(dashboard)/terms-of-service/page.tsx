import { ScrollText, AlertTriangle, Scale, CheckCircle2 } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto pb-12 text-ink-text">
      {/* Header */}
      <div className="mb-12 border-b border-surface-border pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-sky/10 text-accent-sky text-[10px] font-mono uppercase tracking-wider font-semibold mb-6">
          <ScrollText size={14} />
          Berlaku Sejak: Juli 2026
        </div>
        <h1 className="font-display text-4xl lg:text-5xl font-semibold leading-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-ink-muted text-lg max-w-2xl leading-relaxed">
          Syarat dan Ketentuan (Terms of Service) ini mengatur penggunaan aplikasi Belajarsama.ai. Dengan menggunakan layanan kami, Anda menyetujui seluruh ketentuan yang tercantum di bawah ini.
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-surface-base border border-surface-border text-ink-muted">
              <CheckCircle2 size={20} />
            </div>
            <h2 className="font-display text-2xl font-semibold">1. Penggunaan Layanan</h2>
          </div>
          <div className="pl-11 space-y-4 text-ink-muted leading-relaxed">
            <p>
              Aplikasi Belajarsama.ai disediakan sebagai platform edukasi berbasis kecerdasan buatan. Pengguna diharapkan:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Memberikan informasi pendaftaran yang akurat dan sah.</li>
              <li>Tidak menggunakan platform ini untuk tujuan ilegal, pelecehan, atau mendistribusikan konten berbahaya (malware).</li>
              <li>Menyadari bahwa respons AI dihasilkan secara otomatis dan dapat mengandung ketidakakuratan. Pengguna disarankan untuk memverifikasi fakta-fakta krusial secara mandiri.</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-surface-base border border-surface-border text-ink-muted">
              <Scale size={20} />
            </div>
            <h2 className="font-display text-2xl font-semibold">2. Hak Kekayaan Intelektual</h2>
          </div>
          <div className="pl-11 space-y-4 text-ink-muted leading-relaxed">
            <p>
              Seluruh kode sumber, desain UI/UX, logo, dan materi sistem dari aplikasi Belajarsama.ai adalah hak milik intelektual pengembang (*adji.dev*). Anda <strong>tidak diperkenankan</strong> untuk:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Mengklaim kode atau desain aplikasi ini sebagai buatan Anda sendiri tanpa atribusi.</li>
              <li>Menjual atau melisensikan ulang platform ini untuk kepentingan komersial tanpa izin tertulis.</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-surface-base border border-surface-border text-ink-muted">
              <AlertTriangle size={20} />
            </div>
            <h2 className="font-display text-2xl font-semibold">3. Batasan Tanggung Jawab (Disclaimer)</h2>
          </div>
          <div className="pl-11 space-y-4 text-ink-muted leading-relaxed">
            <div className="p-5 rounded-xl border border-red-900/30 bg-red-950/10 text-red-200/90 shadow-sm text-sm">
              <p className="font-semibold text-red-400 mb-2">Penafian Penting:</p>
              <p>Layanan Belajarsama.ai disediakan dengan basis "Sebagaimana Adanya" (*As-Is*). Pengembang tidak bertanggung jawab atas kerugian data, kegagalan akademik, atau dampak negatif apa pun yang timbul akibat kesalahan sistem, penghentian server sepihak, maupun informasi keliru yang di-generate oleh model AI.</p>
            </div>
          </div>
        </section>

        <section>
          <div className="pt-8 border-t border-surface-border">
            <h2 className="font-display text-xl font-semibold mb-3">4. Pembaruan Syarat</h2>
            <p className="text-ink-muted leading-relaxed">
              Kami berhak untuk memperbarui Terms of Service ini kapan saja. Perubahan akan berlaku seketika setelah dipublikasikan pada halaman ini. Jika Anda terus menggunakan layanan setelah pembaruan, maka Anda dianggap telah menyetujui syarat yang baru.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
