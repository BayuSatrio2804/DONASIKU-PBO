import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiCheckCircle, FiUpload, FiFileText, FiClock } from 'react-icons/fi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { register } from '../../services/authService';
import { validateEmail, validatePassword } from '../../utils/validation';
import api from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donatur',
    phone: '',
    address: '',
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, document: 'Ukuran file maksimal 5MB' }));
        return;
      }
      setDocumentFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setDocumentPreview(reader.result);
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, document: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Nama harus diisi';
    }

    if (!formData.email) {
      newErrors.email = 'Email harus diisi';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    // Penerima must upload document
    if (formData.role === 'penerima' && !documentFile) {
      newErrors.document = 'Dokumen verifikasi wajib diunggah untuk Penerima';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // For penerima, we need to upload document along with registration
      if (formData.role === 'penerima' && documentFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('nama', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('role', formData.role);
        formDataToSend.append('noTelepon', formData.phone || '');
        formDataToSend.append('alamat', formData.address || '');
        formDataToSend.append('document', documentFile);

        try {
          await api.post('/auth/register', formDataToSend, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } catch (error) {
          // Fallback to regular register if multipart fails
          await register(formData);
        }

        setRegistrationSuccess(true);
      } else {
        await register(formData);
        navigate('/login', {
          state: { message: 'Registrasi berhasil! Silakan login.' }
        });
      }
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show success page for Penerima after registration
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4 pt-40 pb-20">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiClock className="text-4xl text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pendaftaran Diterima!</h2>
            <p className="text-gray-600 mb-6">
              Akun Anda sedang <span className="font-semibold text-yellow-600">menunggu verifikasi</span> dari Admin.
              Kami akan memverifikasi dokumen yang Anda upload.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Status:</strong> Menunggu Verifikasi Admin
              </p>
              <p className="text-xs text-yellow-600 mt-2">
                Anda akan menerima notifikasi setelah akun diverifikasi. Coba login setelah beberapa saat.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                to="/cek-status-verifikasi"
                className="block w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Cek Status Verifikasi
              </Link>
              <Link
                to="/login"
                className="block w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition"
              >
                Kembali ke Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 pt-40 pb-20">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Daftar Donasiku</h2>
            <p className="text-gray-600">Buat akun untuk mulai berbagi kebaikan</p>
          </div>

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start space-x-2">
              <FiAlertCircle className="flex-shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Nama Lengkap"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              error={errors.name}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              error={errors.password}
              required
            />

            <Input
              label="Konfirmasi Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Ulangi password"
              error={errors.confirmPassword}
              required
            />

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Daftar Sebagai <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.role === 'donatur' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="donatur"
                    checked={formData.role === 'donatur'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">Donatur</div>
                    <div className="text-sm text-gray-600">Saya ingin memberikan donasi</div>
                  </div>
                </label>
                <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.role === 'penerima' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="penerima"
                    checked={formData.role === 'penerima'}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">Penerima</div>
                    <div className="text-sm text-gray-600">Saya ingin menerima donasi (wajib verifikasi)</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Document Upload - Only for Penerima */}
            {formData.role === 'penerima' && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <FiFileText className="text-yellow-600" />
                  <label className="font-semibold text-gray-800">
                    Dokumen Verifikasi <span className="text-red-500">*</span>
                  </label>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Upload KTP/SIM/Surat Keterangan untuk verifikasi identitas. Admin akan mereview dokumen Anda.
                </p>

                <div className="border-2 border-dashed border-yellow-300 rounded-lg p-4 text-center hover:border-yellow-400 transition">
                  {documentPreview ? (
                    <div className="space-y-2">
                      <img src={documentPreview} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
                      <p className="text-sm text-green-600 font-medium">✓ Dokumen terupload</p>
                      <button
                        type="button"
                        onClick={() => { setDocumentFile(null); setDocumentPreview(null); }}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Hapus & Ganti
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <FiUpload className="mx-auto text-3xl text-yellow-500 mb-2" />
                      <p className="text-sm text-gray-600">Klik untuk upload dokumen</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF (max 5MB)</p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleDocumentChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {errors.document && (
                  <p className="text-red-500 text-sm mt-2">{errors.document}</p>
                )}

                <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Catatan:</strong> Setelah mendaftar, akun Anda akan menunggu persetujuan Admin.
                    Anda dapat login setelah akun diverifikasi.
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Memproses...' : formData.role === 'penerima' ? 'Daftar & Ajukan Verifikasi' : 'Daftar Sekarang'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                Login di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;