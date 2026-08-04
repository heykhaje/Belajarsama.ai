'use server'

import { createClient } from '@/lib/supabase/server';
import { generateQuiz as geminiQuiz } from '@/lib/ai/gemini';
import { revalidatePath } from 'next/cache';

async function getAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized");
  }
  return { supabase, user };
}

export async function uploadMaterial(formData: FormData) {
  try {
    const { supabase, user } = await getAuth();
    const file = formData.get('file') as File;
    if (!file) return { error: "File tidak ditemukan" };

  // 1. Upload to Supabase Storage
  const fileName = `${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('materials')
    .upload(fileName, file);
    
  if (uploadError) return { error: "Gagal upload PDF ke storage: " + uploadError.message };

  const { data: publicUrlData } = supabase.storage.from('materials').getPublicUrl(fileName);
  const pdfUrl = publicUrlData.publicUrl;

  // 2. Extract text
  // Fetch pristine buffer from Supabase to prevent Next.js FormData mangling in Vercel
  const pdfResponse = await fetch(pdfUrl);
  const downloadedBuffer = Buffer.from(await pdfResponse.arrayBuffer());

  const pdfParse = require('pdf-parse');
  const pdfData = await pdfParse(downloadedBuffer);
  let extractedText = pdfData.text.replace(/\u0000/g, '').replace(/\x00/g, '');

  if (!extractedText || extractedText.trim() === '') {
    // Optionally remove from storage if extraction fails
    await supabase.storage.from('materials').remove([fileName]);
    return { error: "Gagal mengekstrak teks dari PDF. Pastikan PDF tidak hanya berisi gambar." };
  }

  // 3. Simpan ke database
  const { data: material, error: dbError } = await supabase
    .from('materials')
    .insert({
      user_id: user.id,
      title: file.name.replace('.pdf', ''),
      pdf_url: pdfUrl,
      extracted_text: extractedText,
      status: 'new'
    })
    .select()
    .single();

    if (dbError) return { error: "Gagal menyimpan ke database: " + dbError.message };

    revalidatePath('/my-learning');
    return { success: true, material };
  } catch (error: any) {
    console.error("Upload Error:", error);
    return { error: error.message || "Terjadi kesalahan sistem saat memproses PDF" };
  }
}

export async function uploadTextMaterial(data: { title: string, text: string }) {
  try {
    const { supabase, user } = await getAuth();
    
    if (!data.text || data.text.trim() === '') {
      return { error: "Teks tidak boleh kosong" };
    }
    
    const title = data.title || 'Materi Teks';

    const { data: material, error: dbError } = await supabase
      .from('materials')
      .insert({
        user_id: user.id,
        title: title,
        pdf_url: null,
        extracted_text: data.text,
        status: 'new'
      })
      .select()
      .single();

    if (dbError) return { error: "Gagal menyimpan ke database: " + dbError.message };

    revalidatePath('/my-learning');
    return { success: true, material };
  } catch (error: any) {
    console.error("Upload Text Error:", error);
    return { error: error.message || "Terjadi kesalahan sistem saat menyimpan teks" };
  }
}

export async function deleteMaterial(materialId: string) {
  const { supabase } = await getAuth();
  // 1. Dapatkan info materi untuk mengambil nama file di storage
  const { data: material, error: fetchError } = await supabase
    .from('materials')
    .select('pdf_url')
    .eq('id', materialId)
    .single();

  if (fetchError) throw new Error("Gagal mengambil data materi: " + fetchError.message);

  // 2. Hapus file dari Storage (jika ada pdf_url)
  if (material?.pdf_url) {
    const urlParts = material.pdf_url.split('/');
    const fileName = urlParts[urlParts.length - 1]; // Mengambil bagian akhir URL (nama file)
    
    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from('materials')
        .remove([fileName]);
        
      if (storageError) {
        console.error("Gagal menghapus file dari storage:", storageError);
      }
    }
  }

  // 3. Hapus data dari Database
  const { error: dbError } = await supabase
    .from('materials')
    .delete()
    .eq('id', materialId);

  if (dbError) throw new Error("Gagal menghapus materi dari database: " + dbError.message);

  revalidatePath('/my-learning');
}

export async function generateSummary(materialId: string) {
  // Summary should be done via API route streaming now.
  throw new Error("Gunakan streaming API untuk merangkum.");
}

export async function generateQuiz(materialId: string) {
  const { supabase } = await getAuth();
  const { data: material } = await supabase.from('materials').select('*').eq('id', materialId).single();
  if (!material) throw new Error("Material not found");

  const quizData = await geminiQuiz(material.extracted_text);

  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .insert({
      material_id: materialId,
      questions_json: quizData
    })
    .select()
    .single();

  if (quizError) throw new Error("Gagal menyimpan quiz: " + quizError.message);

  return quiz;
}

export async function submitQuizAttempt(materialId: string, score: number, answersJson: any) {
  const { supabase, user } = await getAuth();
  const { error } = await supabase
    .from('quiz_attempts')
    .insert({
      material_id: materialId,
      user_id: user.id,
      score,
      answers_json: answersJson
    });

  if (error) throw new Error("Gagal menyimpan hasil quiz: " + error.message);

  await supabase.from('materials').update({ status: 'quizzed' }).eq('id', materialId);
  revalidatePath('/my-learning');
  revalidatePath('/analytics');
  
  return true;
}

export async function createSchedule(data: { title: string, scheduled_at: string, linked_material_id?: string, recurring?: string }) {
  const { supabase, user } = await getAuth();
  const { error } = await supabase
    .from('schedules')
    .insert({
      user_id: user.id,
      ...data
    });

  if (error) throw new Error("Gagal membuat jadwal: " + error.message);
  revalidatePath('/schedule');
  return true;
}

export async function getUpcomingSchedules() {
  const { supabase, user } = await getAuth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('user_id', user.id)
    .gte('scheduled_at', today.toISOString())
    .order('scheduled_at', { ascending: true });
    
  if (error) throw new Error(error.message);
  return data;
}

export async function completeAndDeleteSchedule(scheduleId: string) {
  const { supabase } = await getAuth();
  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', scheduleId);
    
  if (error) throw new Error("Gagal menghapus jadwal: " + error.message);
  revalidatePath('/schedule');
  return true;
}

export async function getAllMaterials() {
  const { supabase, user } = await getAuth();
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('user_id', user.id)
    .order('uploaded_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getMaterialSummary(materialId: string) {
  const { supabase } = await getAuth();
  const { data, error } = await supabase
    .from('material_summaries')
    .select('*')
    .eq('material_id', materialId)
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) return null;
  return data?.[0] || null;
}

export async function getWeeklyProgress() {
  const { supabase, user } = await getAuth();
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', user.id)
    .gte('completed_at', startOfWeek.toISOString());
    
  if (error) return { quizCount: 0, avgScore: 0 };
  
  const count = data.length;
  const avg = count > 0 ? data.reduce((acc, curr) => acc + curr.score, 0) / count : 0;
  return { quizCount: count, avgScore: Math.round(avg) };
}

export async function getSchedulesByMonth(month: number, year: number) {
  const { supabase, user } = await getAuth();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59);
  
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('user_id', user.id)
    .gte('scheduled_at', startDate.toISOString())
    .lte('scheduled_at', endDate.toISOString())
    .order('scheduled_at', { ascending: true });
    
  if (error) throw new Error(error.message);
  return data;
}

export async function getAnalyticsData() {
  const { supabase, user } = await getAuth();
  const { data: attempts, error } = await supabase
    .from('quiz_attempts')
    .select('*, materials(title)')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: true });
    
  if (error) return { lineData: [], barData: [], stats: { avgScore: 0, totalQuiz: 0, bestMaterial: '-' } };
  
  // Process for Line Chart (scores over time)
  const lineData = attempts.map(a => ({
    date: new Date(a.completed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    score: a.score
  }));
  
  // Process for Bar Chart (average score per material)
  const materialScores: Record<string, { total: number, count: number }> = {};
  attempts.forEach(a => {
    const title = (a.materials as any)?.title || 'Unknown';
    if (!materialScores[title]) materialScores[title] = { total: 0, count: 0 };
    materialScores[title].total += a.score;
    materialScores[title].count += 1;
  });
  
  const barData = Object.keys(materialScores).map(title => ({
    name: title,
    score: Math.round(materialScores[title].total / materialScores[title].count)
  }));
  
  const totalQuiz = attempts.length;
  const avgScore = totalQuiz > 0 ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / totalQuiz) : 0;
  
  let bestMaterial = '-';
  let highestScore = -1;
  barData.forEach(b => {
    if (b.score > highestScore) {
      highestScore = b.score;
      bestMaterial = b.name;
    }
  });

  return { lineData, barData, stats: { avgScore, totalQuiz, bestMaterial } };
}


