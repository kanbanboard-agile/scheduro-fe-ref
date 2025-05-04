'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Globe, Info, Lock, MessageCircle, ScrollText, Shield, UserCheck, Bell, Camera, Image, Phone } from 'lucide-react';

export default function Terms() {
  const [activeTab, setActiveTab] = useState('id');

  const termsData = {
    id: [
      {
        icon: <Info className="h-7 w-7 text-[#3b82f6]" />,
        title: 'Selamat Datang di Scheduro!',
        content:
          'Scheduro adalah aplikasi manajemen tugas berbasis kanban board yang dirancang untuk membantu Anda mengatur pekerjaan dan meningkatkan produktivitas. Ketentuan Layanan ini menjelaskan aturan penggunaan aplikasi kami. Dengan menggunakan Scheduro, Anda menyetujui ketentuan ini.',
        highlight: true,
      },
      {
        icon: <UserCheck className="h-7 w-7 text-[#3b82f6]" />,
        title: '1. Akun Pengguna',
        content:
          'Untuk menggunakan Scheduro, Anda perlu membuat akun dengan informasi yang akurat (email, username, dan password). Nomor telepon opsional dapat ditambahkan untuk fitur pengingat deadline melalui WhatsApp. Anda bertanggung jawab penuh atas keamanan akun dan aktivitas yang dilakukan melalui akun Anda.',
      },
      {
        icon: <Shield className="h-7 w-7 text-[#3b82f6]" />,
        title: '2. Batasan Usia',
        content: 'Scheduro dirancang untuk pengguna berusia 13 tahun ke atas. Jika Anda berusia di bawah 13 tahun, Anda tidak diperbolehkan menggunakan aplikasi ini kecuali dengan izin dan pengawasan dari orang tua atau wali sah.',
      },
      {
        icon: <BookOpen className="h-7 w-7 text-[#3b82f6]" />,
        title: '3. Penggunaan yang Diizinkan',
        content:
          'Anda boleh menggunakan Scheduro untuk keperluan pribadi, pendidikan, atau bisnis, selama tidak melanggar hukum atau ketentuan kami. Dilarang menyebarkan konten ilegal, menyalahgunakan fitur aplikasi, atau mencoba merusak sistem kami.',
      },
      {
        icon: <Image className="h-7 w-7 text-[#3b82f6]" />,
        title: '4. Konten Pengguna',
        content:
          'Anda dapat mengunggah gambar dan konten lain ke workspace Scheduro. Anda tetap memiliki hak atas konten Anda, tetapi memberikan kami lisensi untuk menyimpan dan menampilkannya dalam aplikasi. Konten yang diunggah harus legal dan tidak melanggar hak pihak lain.',
      },
      {
        icon: <Bell className="h-7 w-7 text-[#3b82f6]" />,
        title: '5. Fitur Notifikasi dan Pengingat',
        content:
          'Scheduro menyediakan notifikasi penyemangat harian dan pengingat deadline melalui WhatsApp (jika Anda memberikan nomor telepon). Anda dapat mengatur atau menonaktifkan notifikasi ini melalui pengaturan aplikasi kapan saja.',
      },
      {
        icon: <Camera className="h-7 w-7 text-[#3b82f6]" />,
        title: '6. Izin Perangkat',
        content: 'Aplikasi kami akan meminta izin untuk akses kamera, galeri foto, dan pengiriman notifikasi. Semua izin ini opsional dan dapat Anda atur melalui pengaturan perangkat Anda.',
      },
      {
        icon: <Lock className="h-7 w-7 text-[#3b82f6]" />,
        title: '7. Privasi dan Keamanan Data',
        content: (
          <>
            Kami sangat menjaga privasi dan keamanan data Anda. Untuk memahami bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda, silakan lihat{' '}
            <a href="https://scheduro.com/privacy" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
              Kebijakan Privasi Scheduro
            </a>
          </>
        ),
      },
      {
        icon: <ScrollText className="h-7 w-7 text-[#3b82f6]" />,
        title: '8. Hak Kekayaan Intelektual',
        content:
          'Semua konten, fitur, dan fungsionalitas Scheduro (termasuk tetapi tidak terbatas pada kode, desain, logo, dan teks) adalah milik Scheduro dan dilindungi oleh hukum kekayaan intelektual. Anda tidak boleh menyalin, memodifikasi, atau mendistribusikan konten kami tanpa izin tertulis.',
      },
      {
        icon: <Globe className="h-7 w-7 text-[#3b82f6]" />,
        title: '9. Tautan Eksternal',
        content: 'Aplikasi kami mungkin berisi tautan ke situs eksternal seperti halaman FAQ di scheduro.com/faq dan halaman aplikasi di playstore.',
      },
      {
        icon: <Phone className="h-7 w-7 text-[#3b82f6]" />,
        title: '10. Perubahan Ketentuan',
        content:
          'Ketentuan ini dapat kami perbarui sewaktu-waktu. Kami akan memberi tahu Anda tentang perubahan signifikan melalui notifikasi di aplikasi atau email. Penggunaan berkelanjutan setelah perubahan berarti Anda menerima ketentuan baru.',
      },
    ],
    en: [
      {
        icon: <Info className="h-7 w-7 text-[#3b82f6]" />,
        title: 'Welcome to Scheduro!',
        content:
          'Scheduro is a kanban board-based task management app designed to help you organize work and boost your productivity. These Terms of Service outline the rules for using our app. By using Scheduro, you agree to these terms.',
        highlight: true,
      },
      {
        icon: <UserCheck className="h-7 w-7 text-[#3b82f6]" />,
        title: '1. User Account',
        content:
          "To use Scheduro, you need to create an account with accurate information (email, username, and password). An optional phone number can be added for WhatsApp deadline reminders. You're fully responsible for your account security and all activities performed through your account.",
      },
      {
        icon: <Shield className="h-7 w-7 text-[#3b82f6]" />,
        title: '2. Age Restriction',
        content: "Scheduro is designed for users 13 and up. If you're under 13, you cannot use this app without permission and supervision from a parent or legal guardian.",
      },
      {
        icon: <BookOpen className="h-7 w-7 text-[#3b82f6]" />,
        title: '3. Permitted Use',
        content: "You may use Scheduro for personal, educational, or business purposes, as long as it doesn't violate the law or our terms. It's forbidden to spread illegal content, misuse app features, or attempt to damage our systems.",
      },
      {
        icon: <Image className="h-7 w-7 text-[#3b82f6]" />,
        title: '4. User Content',
        content:
          "You can upload images and other content to Scheduro workspaces. You retain rights to your content but grant us a license to store and display it within the app. Uploaded content must be legal and not infringe on others' rights.",
      },
      {
        icon: <Bell className="h-7 w-7 text-[#3b82f6]" />,
        title: '5. Notifications and Reminders',
        content: 'Scheduro provides daily motivational notifications and deadline reminders via WhatsApp (if you provide a phone number). You can manage or disable these notifications through app settings at any time.',
      },
      {
        icon: <Camera className="h-7 w-7 text-[#3b82f6]" />,
        title: '6. Device Permissions',
        content: 'Our app will request permissions for camera access, photo gallery, and notification sending. All these permissions are optional and can be managed through your device settings.',
      },
      {
        icon: <Lock className="h-7 w-7 text-[#3b82f6]" />,
        title: '7. Privacy and Data Security',
        content: (
          <>
            We take your privacy and data security very seriously. To understand how we collect, use, and protect your data, please see{' '}
            <a href="https://scheduro.com/privacy" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
              Scheduro Privacy Policy
            </a>
          </>
        ),
      },
      {
        icon: <ScrollText className="h-7 w-7 text-[#3b82f6]" />,
        title: '8. Intellectual Property Rights',
        content:
          'All content, features, and functionality of Scheduro (including but not limited to code, design, logos, and text) belongs to Scheduro and is protected by intellectual property laws. You may not copy, modify, or distribute our content without written permission.',
      },
      {
        icon: <Globe className="h-7 w-7 text-[#3b82f6]" />,
        title: '9. External Links',
        content: 'Our app may contain links to external sites such as the FAQ page at scheduro.com/faq & application page on playstore.',
      },
      {
        icon: <Phone className="h-7 w-7 text-[#3b82f6]" />,
        title: '10. Changes to Terms',
        content: 'These terms may be updated at any time. We will notify you of significant changes via app notifications or email. Continued use after changes means you accept the new terms.',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#1e3a8a] via-[#3b82f6] to-[#93c5fd] py-16 px-6 flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto">
        <div className="bg-white/95 shadow-2xl rounded-3xl overflow-hidden border border-[#3b82f6]/30 transform hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-shadow duration-500">
          <div className="relative bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white py-10 px-8 rounded-t-3xl">
            <h1 className="text-5xl font-extrabold text-center tracking-tight drop-shadow-lg">{activeTab === 'id' ? 'Ketentuan Layanan Scheduro' : 'Scheduro Terms of Service'}</h1>
            <p className="text-center mt-2 text-lg opacity-90 font-light">{activeTab === 'id' ? 'Panduan Penggunaan untuk Produktivitas Maksimal!' : 'Usage Guidelines for Maximum Productivity!'}</p>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
          </div>

          <div className="flex justify-center gap-4 py-6 bg-[#f8fafc]">
            {['id', 'en'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 ${activeTab === tab ? 'bg-[#3b82f6] text-white shadow-lg scale-105' : 'bg-white text-[#1e3a8a] hover:bg-[#dbeafe]'}`}
              >
                {tab === 'id' ? 'Bahasa Indonesia' : 'English'}
                {activeTab === tab && <motion.span layoutId="tabUnderline" className="absolute inset-x-0 bottom-0 h-1 bg-white rounded-t-full" initial={false} transition={{ type: 'spring', stiffness: 300, damping: 20 }} />}
              </button>
            ))}
          </div>

          <div className="px-8 pb-12">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4, ease: 'easeInOut' }} className="space-y-6">
                {termsData[activeTab].map(({ icon, title, content, highlight }, index) => (
                  <PolicySection key={index} icon={icon} title={title} content={content} highlight={highlight} />
                ))}
                <div className="mt-10 text-center text-gray-600">
                  <p>
                    {activeTab === 'id' ? 'Dengan menggunakan Scheduro, Anda menyetujui ketentuan ini. Ada pertanyaan?' : 'By using Scheduro, you agree to these terms. Questions?'}{' '}
                    <a href="mailto:support@scheduro.com" className="text-[#3b82f6] font-semibold hover:underline">
                      support@scheduro.com
                    </a>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

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

Terms.getLayout = (page) => page;

export { Terms };
