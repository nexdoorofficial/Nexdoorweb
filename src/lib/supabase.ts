import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zavdaottweujphpvgkce.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_KXqoTRIfXi9nC_szBn3p9Q_s5r1nSXm';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Uploads a base64 DataURL image or File object to Supabase Storage bucket 'site-assets'
 * and returns the public CDN URL.
 */
export async function uploadAssetToSupabase(
  dataUrlOrFile: string | File,
  folder: string = 'logos'
): Promise<string | null> {
  try {
    if (!dataUrlOrFile) return null;

    // If it's already an HTTP URL (e.g. external link or already uploaded to Supabase Storage), return as is
    if (typeof dataUrlOrFile === 'string' && dataUrlOrFile.startsWith('http')) {
      return dataUrlOrFile;
    }

    let fileToUpload: File | Blob;
    let fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    if (dataUrlOrFile instanceof File) {
      fileToUpload = dataUrlOrFile;
      const ext = dataUrlOrFile.name.split('.').pop() || 'png';
      fileName += `.${ext}`;
    } else if (typeof dataUrlOrFile === 'string' && dataUrlOrFile.startsWith('data:')) {
      // Parse base64 DataURL
      const [header, base64Data] = dataUrlOrFile.split(',');
      const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
      const ext = mime.split('/')[1] || 'png';
      fileName += `.${ext}`;

      const binaryStr = atob(base64Data);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      fileToUpload = new Blob([bytes], { type: mime });
    } else {
      return null;
    }

    const { data, error } = await supabase.storage
      .from('site-assets')
      .upload(fileName, fileToUpload, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn('Supabase storage upload fallback/error:', error.message);
      return typeof dataUrlOrFile === 'string' ? dataUrlOrFile : null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('site-assets')
      .getPublicUrl(data?.path || fileName);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.error('Error in uploadAssetToSupabase:', err);
    return typeof dataUrlOrFile === 'string' ? dataUrlOrFile : null;
  }
}
