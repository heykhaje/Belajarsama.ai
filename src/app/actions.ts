'use server'

import { supabase } from '@/lib/supabase/client';
import { generateSummary as geminiSummary, generateQuiz as geminiQuiz } from '@/lib/ai/gemini';
import { revalidatePath } from 'next/cache';

// Workaround for pdf-parse no default export error (moved inside function to avoid DOMMatrix error)

// Note: To simplify MVP, we are assuming a single default user ID.
// In a real app, you would get this from Supabase Auth session.
const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000000'; // Replace with an actual UUID from your DB or handle auth properly

export async function uploadMaterial(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) throw new Error("File tidak ditemukan");

  const buffer = Buffer.from(await file.arrayBuffer());
  
  // 1. Extract text
  const pdfParse = require('pdf-parse');
  const pdfData = await pdfParse(buffer);
  const extractedText = pdfData.text;

  if (!extractedText || extractedText.trim() === '') {
    throw new Error("Gagal mengekstrak teks dari PDF. Pastikan PDF tidak hanya berisi gambar.");
  }

  // 2. Upload to Supabase Storage (optional, but requested in PRD)
  const fileName = `${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('materials')
    .upload(fileName, file);
    
  if (uploadError) throw new Error("Gagal upload PDF ke storage: " + uploadError.message);

  const { data: publicUrlData } = supabase.storage.from('materials').getPublicUrl(fileName);
  const pdfUrl = publicUrlData.publicUrl;

  // 3. Simpan ke database
  const { data: material, error: dbError } = await supabase
    .from('materials')
    .insert({
      user_id: DEFAULT_USER_ID,
      title: file.name.replace('.pdf', ''),
      pdf_url: pdfUrl,
      extracted_text: extractedText,
      status: 'new'
    })
    .select()
    .single();

  if (dbError) throw new Error("Gagal menyimpan ke database: " + dbError.message);

  revalidatePath('/my-learning');
  return material;
}

export async function generateSummary(materialId: string) {
  const { data: material } = await supabase.from('materials').select('*').eq('id', materialId).single();
  if (!material) throw new Error("Material not found");

  const summaryData = await geminiSummary(material.extracted_text);

  const { error: summaryError } = await supabase
    .from('material_summaries')
    .insert({
      material_id: materialId,
      summary_json: summaryData
    });

  if (summaryError) throw new Error("Gagal menyimpan ringkasan: " + summaryError.message);

  await supabase.from('materials').update({ status: 'summarized' }).eq('id', materialId);
  revalidatePath('/my-learning');
  
  return summaryData;
}

export async function generateQuiz(materialId: string) {
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
  const { error } = await supabase
    .from('quiz_attempts')
    .insert({
      material_id: materialId,
      user_id: DEFAULT_USER_ID,
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
  const { error } = await supabase
    .from('schedules')
    .insert({
      user_id: DEFAULT_USER_ID,
      ...data
    });

  if (error) throw new Error("Gagal membuat jadwal: " + error.message);
  revalidatePath('/schedule');
  return true;
}

export async function getTodaySchedules() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('user_id', DEFAULT_USER_ID)
    .gte('scheduled_at', today.toISOString())
    .lt('scheduled_at', tomorrow.toISOString())
    .order('scheduled_at', { ascending: true });
    
  if (error) throw new Error(error.message);
  return data;
}

export async function markScheduleDone(scheduleId: string) {
  const { error } = await supabase
    .from('schedules')
    .update({ status: 'done' })
    .eq('id', scheduleId);
    
  if (error) throw new Error(error.message);
  revalidatePath('/schedule');
  return true;
}

export async function getAllMaterials() {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('user_id', DEFAULT_USER_ID)
    .order('uploaded_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getMaterialSummary(materialId: string) {
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
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', DEFAULT_USER_ID)
    .gte('completed_at', startOfWeek.toISOString());
    
  if (error) return { quizCount: 0, avgScore: 0 };
  
  const count = data.length;
  const avg = count > 0 ? data.reduce((acc, curr) => acc + curr.score, 0) / count : 0;
  return { quizCount: count, avgScore: Math.round(avg) };
}

export async function getSchedulesByMonth(month: number, year: number) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59);
  
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('user_id', DEFAULT_USER_ID)
    .gte('scheduled_at', startDate.toISOString())
    .lte('scheduled_at', endDate.toISOString())
    .order('scheduled_at', { ascending: true });
    
  if (error) throw new Error(error.message);
  return data;
}

export async function getAnalyticsData() {
  const { data: attempts, error } = await supabase
    .from('quiz_attempts')
    .select('*, materials(title)')
    .eq('user_id', DEFAULT_USER_ID)
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
