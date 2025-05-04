'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Info, Lock, MessageCircle, ScrollText, Shield, UserCheck, Bell, Camera, Phone, Image } from 'lucide-react';

export default function PrivacyPolicy() {
  const [activeTab, setActiveTab] = useState('id');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#1e3a8a] via-[#3b82f6] to-[#93c5fd] py-16 px-6 flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto">
        <div className="bg-white/95 shadow-2xl rounded-3xl overflow-hidden border border-[#3b82f6]/30 transform hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-shadow duration-500">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white py-10 px-8 rounded-t-3xl">
            <h1 className="text-5xl font-extrabold text-center tracking-tight drop-shadow-lg">{activeTab === 'id' ? 'Kebijakan Privasi Scheduro' : 'Scheduro Privacy Policy'}</h1>
            <p className="text-center mt-2 text-lg opacity-90 font-light">{activeTab === 'id' ? 'Privasi Pengguna Adalah Prioritas Utama Kami!' : 'User Privacy is Our Top Priority!'}</p>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-4 py-6 bg-[#f8fafc]">
            <button
              onClick={() => handleTabChange('id')}
              className={`relative px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 ${activeTab === 'id' ? 'bg-[#3b82f6] text-white shadow-lg scale-105' : 'bg-white text-[#1e3a8a] hover:bg-[#dbeafe]'}`}
            >
              Bahasa Indonesia
              {activeTab === 'id' && <motion.span layoutId="tabUnderline" className="absolute inset-x-0 bottom-0 h-1 bg-white rounded-t-full" initial={false} transition={{ type: 'spring', stiffness: 300, damping: 20 }} />}
            </button>
            <button
              onClick={() => handleTabChange('en')}
              className={`relative px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 ${activeTab === 'en' ? 'bg-[#3b82f6] text-white shadow-lg scale-105' : 'bg-white text-[#1e3a8a] hover:bg-[#dbeafe]'}`}
            >
              English
              {activeTab === 'en' && <motion.span layoutId="tabUnderline" className="absolute inset-x-0 bottom-0 h-1 bg-white rounded-t-full" initial={false} transition={{ type: 'spring', stiffness: 300, damping: 20 }} />}
            </button>
          </div>

          {/* Konten Kebijakan Privasi */}
          <div className="px-8 pb-12">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4, ease: 'easeInOut' }} className="space-y-6">
                {activeTab === 'id' && (
                  <>
                    <PolicySection
                      icon={<Info className="h-7 w-7 text-[#3b82f6]" />}
                      title="Pendahuluan"
                      content="Selamat datang di Scheduro! Kami berkomitmen untuk melindungi privasi pengguna sebagai pengguna aplikasi manajemen tugas berbasis kanban ini. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi data pengguna."
                      highlight
                    />
                    <PolicySection
                      icon={<UserCheck className="h-7 w-7 text-[#3b82f6]" />}
                      title="1. Data yang Kami Kumpulkan"
                      content="Kami mengumpulkan data berikut: (a) Informasi akun seperti nama, email, dan nomor telepon opsional yang pengguna berikan saat mendaftar; (b) Data tugas seperti judul tugas, deskripsi, dan status yang pengguna masukkan; (c) Konten yang diunggah ke workspace; (d) Data teknis seperti alamat IP, jenis perangkat, dan log penggunaan untuk meningkatkan layanan."
                    />
                    <PolicySection
                      icon={<Shield className="h-7 w-7 text-[#3b82f6]" />}
                      title="2. Tujuan Pengumpulan Data"
                      content="Data pengguna digunakan untuk: (a) Menyediakan dan menjalankan fungsi Scheduro, seperti menyimpan dan mengelola tugas; (b) Mengirim notifikasi penyemangat harian dan pengingat deadline melalui WhatsApp; (c) Meningkatkan pengalaman pengguna melalui analisis teknis."
                    />
                    <PolicySection
                      icon={<Lock className="h-7 w-7 text-[#3b82f6]" />}
                      title="3. Keamanan Data"
                      content="Data pengguna disimpan dengan enkripsi AES-256 di server aman kami. Aplikasi menggunakan koneksi HTTPS yang aman. Kami menerapkan langkah-langkah keamanan untuk melindungi data dari akses tidak sah, perubahan, atau penghapusan. Tidak ada sistem yang 100% aman, jadi gunakan aplikasi dengan bijak."
                    />
                    <PolicySection
                      icon={<Image className="h-7 w-7 text-[#3b82f6]" />}
                      title="4. Penyimpanan Konten"
                      content="Konten yang diunggah pengguna ke workspace disimpan menggunakan layanan AWS S3. Meskipun kami menggunakan layanan pihak ketiga untuk penyimpanan, keamanan data tetap menjadi prioritas kami. Konten hanya dapat diakses oleh pengguna yang memiliki izin dalam workspace tersebut."
                    />
                    <PolicySection
                      icon={<Bell className="h-7 w-7 text-[#3b82f6]" />}
                      title="5. Notifikasi dan Pengingat"
                      content="Aplikasi menggunakan OneSignal untuk mengirimkan notifikasi penyemangat harian. Untuk pengingat deadline, kami menggunakan WhatsApp API bagi pengguna yang telah memberikan nomor telepon mereka. Nomor telepon pengguna akan dibagikan ke WhatsApp API hanya untuk tujuan pengiriman pengingat deadline."
                    />
                    <PolicySection
                      icon={<Camera className="h-7 w-7 text-[#3b82f6]" />}
                      title="6. Izin Perangkat"
                      content="Aplikasi kami akan selalu meminta izin pengguna sebelum mengakses kamera, galeri foto, atau mengirimkan notifikasi ke perangkat. Pengguna dapat mencabut izin ini kapan saja melalui pengaturan perangkat mereka."
                    />
                    <PolicySection
                      icon={<ScrollText className="h-7 w-7 text-[#3b82f6]" />}
                      title="7. Berbagi Data"
                      content="Kami tidak membagikan data pribadi pengguna dengan pihak ketiga, kecuali: (a) Diwajibkan oleh hukum atau proses hukum; (b) Untuk melindungi hak dan keamanan Scheduro serta pengguna lain; (c) Dengan pihak ketiga yang diperlukan untuk operasi aplikasi (AWS S3, OneSignal, dan WhatsApp API untuk fungsi yang dijelaskan di atas)."
                    />
                    <PolicySection
                      icon={<Globe className="h-7 w-7 text-[#3b82f6]" />}
                      title="8. Tautan Eksternal"
                      content="Aplikasi kami mencakup tautan ke situs eksternal, seperti halaman FAQ di scheduro.com/#faq dan halaman aplikasi kami di playstore. "
                    />
                    <PolicySection
                      icon={<Phone className="h-7 w-7 text-[#3b82f6]" />}
                      title="9. Penyimpanan dan Penghapusan Data"
                      content="Data pengguna disimpan selama akun aktif. Jika pengguna menghapus akun, data akan dihapus dalam 30 hari. Pengguna dapat meminta penghapusan data kapan saja dengan menghubungi kami di support@scheduro.com, termasuk penghapusan nomor telepon dari sistem kami dan layanan WhatsApp API."
                    />
                    <PolicySection
                      icon={<UserCheck className="h-7 w-7 text-[#3b82f6]" />}
                      title="10. Hak Pengguna"
                      content="Pengguna berhak: (a) Mengakses data yang kami simpan tentang mereka; (b) Meminta perbaikan jika ada kesalahan; (c) Meminta penghapusan data; (d) Menolak penggunaan data untuk analitik (jika ada); (e) Mencabut izin untuk mendapatkan notifikasi atau pengingat deadline. Hubungi kami untuk melaksanakan hak ini."
                    />
                    <PolicySection
                      icon={<Shield className="h-7 w-7 text-[#3b82f6]" />}
                      title="11. Kepatuhan Terhadap Peraturan"
                      content="Kami berkomitmen untuk mematuhi semua peraturan yang berlaku, termasuk peraturan undang-undang privasi data dan kebijakan dari platform seperti Google Play Store. Kami memastikan bahwa aplikasi ini memenuhi semua persyaratan hukum dan pedoman yang ditetapkan oleh pihak berwenang serta platform distribusi aplikasi."
                    />

                    <div className="mt-10 text-center text-gray-600">
                      <p>
                        Ada pertanyaan atau permintaan terkait privasi? Hubungi kami di{' '}
                        <a href="mailto:support@scheduro.com" className="text-[#3b82f6] font-semibold hover:underline">
                          support@scheduro.com
                        </a>
                        .
                      </p>
                    </div>
                  </>
                )}

                {activeTab === 'en' && (
                  <>
                    <PolicySection
                      icon={<Info className="h-7 w-7 text-[#3b82f6]" />}
                      title="Introduction"
                      content="Welcome to Scheduro! We are committed to protecting user privacy as a user of this kanban board-based task management app. This Privacy Policy explains how we collect, use, store, and protect user data."
                      highlight
                    />
                    <PolicySection
                      icon={<UserCheck className="h-7 w-7 text-[#3b82f6]" />}
                      title="1. Data We Collect"
                      content="We collect the following data: (a) Account information like name, email, and optional phone number provided during registration; (b) Task data such as task titles, descriptions, and statuses you input; (c) Content uploaded to workspaces; (d) Technical data like IP address, device type, and usage logs to improve our service."
                    />
                    <PolicySection
                      icon={<Shield className="h-7 w-7 text-[#3b82f6]" />}
                      title="2. Purpose of Data Collection"
                      content="User data is used to: (a) Provide and operate Scheduro's features, like storing and managing tasks; (b) Send daily motivational notifications and deadline reminders via WhatsApp; (c) Enhance user experience through technical analysis."
                    />
                    <PolicySection
                      icon={<Lock className="h-7 w-7 text-[#3b82f6]" />}
                      title="3. Data Security"
                      content="User data is stored with AES-256 encryption on secure servers. The app uses secure HTTPS connections. We implement security measures to protect it from unauthorized access, alteration, or deletion. However, no system is 100% secure, so use the app responsibly."
                    />
                    <PolicySection
                      icon={<Image className="h-7 w-7 text-[#3b82f6]" />}
                      title="4. Content Storage"
                      content="Content uploaded by users to workspaces is stored using AWS S3 services. While we use this third-party storage service, data security remains our priority. Content can only be accessed by users with appropriate permissions in the workspace."
                    />
                    <PolicySection
                      icon={<Bell className="h-7 w-7 text-[#3b82f6]" />}
                      title="5. Notifications and Reminders"
                      content="The app uses OneSignal to send daily motivational notifications. For deadline reminders, we use the WhatsApp API for users who have provided their phone numbers. User phone numbers are shared with the WhatsApp API solely for the purpose of sending deadline reminders."
                    />
                    <PolicySection
                      icon={<Camera className="h-7 w-7 text-[#3b82f6]" />}
                      title="6. Device Permissions"
                      content="Our app will always request user permission before accessing the camera, photo gallery, or sending notifications to the device. Users can revoke these permissions at any time through their device settings."
                    />
                    <PolicySection
                      icon={<ScrollText className="h-7 w-7 text-[#3b82f6]" />}
                      title="7. Data Sharing"
                      content="We do not share user personal data with third parties, except: (a) When required by law or legal processes; (b) To protect the rights and security of Scheduro and its users; (c) With third parties necessary for app operations (AWS S3, OneSignal, and WhatsApp API for the functions described above)."
                    />
                    <PolicySection icon={<Globe className="h-7 w-7 text-[#3b82f6]" />} title="8. External Links" content="Our app includes links to external sites, such as our FAQ page at scheduro.com/faq and playstore application page." />
                    <PolicySection
                      icon={<Phone className="h-7 w-7 text-[#3b82f6]" />}
                      title="9. Data Retention and Deletion"
                      content="User data is retained as long as the account is active. If a user deletes their account, data will be removed within 30 days. Users can request data deletion at any time by contacting us at support@scheduro.com, including removal of phone numbers from our system and the WhatsApp API service."
                    />
                    <PolicySection
                      icon={<UserCheck className="h-7 w-7 text-[#3b82f6]" />}
                      title="10. User Rights"
                      content="Users have the right to: (a) Access the data we store about them; (b) Request corrections if there are errors; (c) Request data deletion; (d) Opt out of data use for analytics (if applicable); (e) Revoke permission to receive notifications or deadline reminders. Contact us to exercise these rights."
                    />
                    <PolicySection
                      icon={<Shield className="h-7 w-7 text-[#3b82f6]" />}
                      title="11. Compliance with Regulations"
                      content="We are committed to complying with all applicable regulations, including data privacy laws and policies from platforms like the Google Play Store. We ensure that this app meets all legal requirements and guidelines established by regulatory authorities and application distribution platforms."
                    />

                    <div className="mt-10 text-center text-gray-600">
                      <p>
                        For more details, you can always check our{' '}
                        <a href="https://scheduro.com/policy" className="text-blue-500 hover:underline">
                          full policy
                        </a>
                        .
                      </p>
                    </div>
                    <div className="mt-10 text-center text-gray-600">
                      <p>
                        Have questions or privacy requests? Reach us at{' '}
                        <a href="mailto:support@scheduro.com" className="text-[#3b82f6] font-semibold hover:underline">
                          support@scheduro.com
                        </a>
                        .
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <div className="mt-12 flex justify-center pb-8">
              <div className="flex items-center gap-3 text-sm text-gray-500 bg-[#f8fafc] py-3 px-6 rounded-full shadow-inner">
                <MessageCircle className="h-5 w-5 text-[#3b82f6]" />
                <span>{activeTab === 'id' ? 'Butuh bantuan? Kontak tim kami!' : 'Need help? Contact our team!'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PolicySection({ icon, title, content, highlight = false }) {
  return (
    <motion.div
      className={`rounded-2xl p-6 ${highlight ? 'bg-gradient-to-br from-[#3b82f6]/20 to-[#1e3a8a]/10 border border-[#3b82f6]/40' : 'bg-[#f8fafc] border border-gray-200'} shadow-md hover:shadow-lg transition-all duration-300`}
      whileHover={{ y: -5 }}
    >
      <div className="flex gap-5">
        <div className="mt-1 shrink-0">{icon}</div>
        <div>
          <h3 className={`font-semibold ${highlight ? 'text-2xl text-[#1e3a8a] tracking-tight' : 'text-xl text-[#3b82f6]'} mb-3`}>{title}</h3>
          <p className="text-gray-700 leading-relaxed text-base">{content}</p>
        </div>
      </div>
    </motion.div>
  );
}

PrivacyPolicy.getLayout = (page) => page;

export { PrivacyPolicy };
