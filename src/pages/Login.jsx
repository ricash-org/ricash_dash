import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowRight,
  Phone,
  Send,
  Clock,
  Clipboard
} from 'lucide-react'
import richashLogo from '@/assets/richash.png'
import bgRicash from '@/assets/bgrichash.jpg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { RicashSelect } from '@/components/ui/ricash-input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { trackUiEvent } from '@/lib/ui-events'

export default function Login() {
  const { login, requestOtp } = useAuth()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const COUNTRIES = [
    { name: 'Sénégal', dialCode: '+221', placeholder: '77 000 00 00' },
    { name: 'Côte d\'Ivoire', dialCode: '+225', placeholder: '07 00 00 00 00' },
    { name: 'Mali', dialCode: '+223', placeholder: '70 00 00 00' },
    { name: 'Guinée', dialCode: '+224', placeholder: '620 00 00 00' },
    { name: 'Bénin', dialCode: '+229', placeholder: '90 00 00 00' },
    { name: 'Togo', dialCode: '+228', placeholder: '90 00 00 00' },
    { name: 'France', dialCode: '+33', placeholder: '6 00 00 00 00' }
  ]
  const [country, setCountry] = useState(COUNTRIES[0])
  const [phoneLocal, setPhoneLocal] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [resendIn, setResendIn] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const phoneInputRef = useRef(null)
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    const phoneRegex = /^\+?[0-9\s]{8,15}$/
    if (!phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis'
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Numéro de téléphone invalide'
    }
    // N'exiger l'OTP que s'il a été envoyé
    if (otpSent && otp.length !== 4) {
      newErrors.otp = 'Entrez le code OTP à 4 chiffres'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      // Premier clic: appeler requestOtp et afficher le champ
      if (!otpSent) {
        await requestOtp(phone)
        trackUiEvent('otp_request_login', { phone })
        setErrors({})
        setOtp('')
        setOtpSent(true)
        setResendIn(60)
        return
      }
      await login({ phone, otp })
      trackUiEvent('login_success', { phoneMasked: maskedPhone })
      
      // Redirection vers le dashboard après connexion réussie
      navigate('/app/dashboard')
      
    } catch (error) {
      trackUiEvent('login_error', { message: error.message })
      console.error('Erreur de connexion:', error)
      setErrors({ 
        general: error.message || 'Erreur de connexion. Veuillez réessayer.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    const phoneRegex = /^\+?[0-9\s]{8,15}$/
    if (!phone.trim()) {
      setErrors({ phone: 'Le numéro de téléphone est requis' })
      return
    }
    if (!phoneRegex.test(phone)) {
      setErrors({ phone: 'Numéro de téléphone invalide' })
      return
    }
    setErrors({})
    await requestOtp(phone)
    trackUiEvent('otp_resend_login', { phone })
    setOtp('')
    setOtpSent(true)
    setResendIn(60)
  }

  const handlePasteOtp = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const digits = (text || '').replace(/\D/g, '').slice(0, 4)
      if (digits.length === 4) setOtp(digits)
    } catch {}
  }

  const formatLocalPhone = (value) => {
    const digits = value.replace(/\D/g, '')
    return digits.replace(/(.{2})/g, '$1 ').trim()
  }

  const maskedPhone = useMemo(() => {
    if (!phone) return ''
    const compact = phone.replace(/\s+/g, '')
    if (compact.length <= 8) return phone
    const visibleStart = compact.slice(0, 4)
    const visibleEnd = compact.slice(-2)
    const maskedMid = '••••••'
    return `${visibleStart} ${maskedMid} ${visibleEnd}`
  }, [phone])

  useEffect(() => {
    const full = `${country.dialCode} ${phoneLocal}`.trim()
    setPhone(full)
  }, [country, phoneLocal])

  useEffect(() => {
    if (!otpSent || resendIn <= 0) return
    const id = setInterval(() => {
      setResendIn(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [otpSent, resendIn])

  const isPhoneEntryValid = useMemo(() => {
    const digits = (country.dialCode + phoneLocal).replace(/\D/g, '')
    return digits.length >= 10
  }, [country, phoneLocal])

  const attemptLoginWithOtp = async () => {
    if (!otpSent || otp.length !== 4 || isLoading || isAutoSubmitting) return
    setIsAutoSubmitting(true)
    setIsLoading(true)
    try {
      await login({ phone, otp })
      navigate('/app/dashboard')
    } catch (error) {
      setErrors(prev => ({ ...prev, otp: error.message || 'Code OTP invalide' }))
    } finally {
      setIsLoading(false)
      setIsAutoSubmitting(false)
    }
  }

  useEffect(() => {
    if (otpSent && otp.length === 4) {
      attemptLoginWithOtp()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, otpSent])

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgRicash})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay sombre pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Overlay avec les couleurs Ricash */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#29475B]/20 via-[#376470]/30 to-[#2B8286]/20"></div>
      
      {/* Particules flottantes animées */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#2B8286] rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-[#B19068] rounded-full animate-pulse opacity-80"></div>
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-[#376470] rounded-full animate-bounce opacity-70"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#29475B] rounded-full animate-ping opacity-50"></div>
      </div>

      {/* Main login container */}
      <div className="relative w-full max-w-md z-10">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden border border-[#B19068]/20">
          <CardHeader className={`text-center ${otpSent ? 'pb-4' : 'pb-6'}`}>
            {/* Logo Ricash avec animation d'entrée */}
            <div className="mx-auto mb-1 flex items-center justify-center animate-fade-in-down">
              <img 
                src={richashLogo} 
                alt="Ricash Logo" 
                className={`${otpSent ? 'w-32 h-32' : 'w-40 h-40'} object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-300`}
              />
            </div>
            
            <CardTitle className="text-2xl font-bold text-[#29475B] mb-0 animate-fade-in-up">
              Tableau de bord Ricash
            </CardTitle>
            <CardDescription className="text-[#376470] text-base animate-fade-in-up delay-100 mb-1">
              Connectez-vous à votre espace d'administration
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 md:p-5">
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* General error avec animation */}
              {errors.general && (
                <div role="alert" aria-live="assertive" className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl animate-shake">
                  {errors.general}
                </div>
              )}

              {/* Connexion par téléphone */}
              <div className="space-y-2">
                <div className="grid gap-3 md:grid-cols-[0.9fr,1.1fr] md:items-end">
                  <div className="space-y-1">
                  <Label className="text-sm font-semibold text-[#29475B]">Pays</Label>
                  <RicashSelect
                    value={country.dialCode}
                    onValueChange={(v) => {
                      const c = COUNTRIES.find(x => x.dialCode === v) || COUNTRIES[0]
                      setCountry(c)
                    }}
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.dialCode} value={c.dialCode}>{c.name} ({c.dialCode})</option>
                    ))}
                  </RicashSelect>
                  </div>
                  <div className="space-y-1 group">
                  <Label htmlFor="phone" className="text-sm font-semibold text-[#29475B]">Numéro de téléphone</Label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#2B8286]" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={country.placeholder}
                      value={phoneLocal}
                      onChange={(e) => setPhoneLocal(formatLocalPhone(e.target.value))}
                      className={`pl-12 h-12 rounded-xl bg-white text-[#29475B] placeholder:text-[#9aa6b2] transition-all ${
                        errors.phone
                          ? 'border-2 border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-2 border-[#E8F4F8] focus:border-[#2B8286] focus:ring-2 focus:ring-[#2B8286]/20'
                      }`}
                      ref={phoneInputRef}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600 font-medium animate-fade-in">{errors.phone}</p>
                  )}
                  </div>
                </div>
                {otpSent && (
                  <div className="mt-2 rounded-2xl border border-[#E8F4F8] bg-white/70 p-3 md:p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-[#29475B]">Code OTP</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-[#376470] hover:bg-[#2B8286]/10"
                        onClick={() => { setOtpSent(false); setOtp(''); setResendIn(0); setTimeout(()=> phoneInputRef.current?.focus(), 0) }}
                      >
                        Modifier le numéro
                      </Button>
                    </div>
                    <InputOTP 
                      maxLength={4} 
                      value={otp} 
                      onChange={(v) => setOtp((v || '').replace(/\D/g, '').slice(0, 4))}
                      autoFocus
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      aria-invalid={!!errors.otp}
                      containerClassName="gap-5 md:gap-6 lg:gap-8 justify-center py-1"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className={`h-12 w-12 md:h-14 md:w-14 text-lg md:text-xl rounded-xl md:rounded-2xl bg-white text-[#29475B] border-2 transition-all shadow-sm ${errors.otp ? 'border-red-400 data-[active=true]:border-red-500 ring-2 ring-red-100' : 'border-[#E8F4F8] data-[active=true]:border-[#2B8286] focus-within:ring-2 focus-within:ring-[#2B8286]/20'}`} />
                        <InputOTPSlot index={1} className={`h-12 w-12 md:h-14 md:w-14 text-lg md:text-xl rounded-xl md:rounded-2xl bg-white text-[#29475B] border-2 transition-all shadow-sm ${errors.otp ? 'border-red-400 data-[active=true]:border-red-500 ring-2 ring-red-100' : 'border-[#E8F4F8] data-[active=true]:border-[#2B8286] focus-within:ring-2 focus-within:ring-[#2B8286]/20'}`} />
                        <InputOTPSlot index={2} className={`h-12 w-12 md:h-14 md:w-14 text-lg md:text-xl rounded-xl md:rounded-2xl bg-white text-[#29475B] border-2 transition-all shadow-sm ${errors.otp ? 'border-red-400 data-[active=true]:border-red-500 ring-2 ring-red-100' : 'border-[#E8F4F8] data-[active=true]:border-[#2B8286] focus-within:ring-2 focus-within:ring-[#2B8286]/20'}`} />
                        <InputOTPSlot index={3} className={`h-12 w-12 md:h-14 md:w-14 text-lg md:text-xl rounded-xl md:rounded-2xl bg-white text-[#29475B] border-2 transition-all shadow-sm ${errors.otp ? 'border-red-400 data-[active=true]:border-red-500 ring-2 ring-red-100' : 'border-[#E8F4F8] data-[active=true]:border-[#2B8286] focus-within:ring-2 focus-within:ring-[#2B8286]/20'}`} />
                      </InputOTPGroup>
                    </InputOTP>
                    <div className="text-xs text-[#376470] text-center" aria-live="polite">
                      Saisissez le code à 4 chiffres. Code envoyé à <span className="font-semibold text-[#29475B]">{maskedPhone || phone}</span>.
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button type="button" variant="ghost" size="sm" onClick={handlePasteOtp}>
                        <Clipboard className="h-3.5 w-3.5 mr-1" /> Coller
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleSendOtp}
                        disabled={!isPhoneEntryValid || resendIn > 0}
                        className={`text-[#2B8286] hover:bg-[#2B8286]/10 ${!isPhoneEntryValid ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {resendIn > 0 ? `Renvoyer dans ${resendIn}s` : (<><Send className="h-4 w-4 mr-2" /> Renvoyer le code</>)}
                      </Button>
                    </div>
                    <div className="h-1 w-full bg-[#E8F4F8] rounded overflow-hidden" aria-hidden="true">
                      <div className="h-1 bg-[#2B8286]" style={{ width: `${Math.min(100, Math.max(0, (60 - resendIn) * (100/60)))}%` }} />
                    </div>
                    {errors.otp && (
                      <p className="text-sm text-red-600 font-medium animate-fade-in" aria-live="polite">{errors.otp}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Login button futuriste */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-[#29475B] to-[#376470] hover:from-[#376470] hover:to-[#2B8286] text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-70 relative overflow-hidden group"
              >
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {isLoading ? (
                  <div className="flex items-center space-x-3 relative z-10">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connexion en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 relative z-10">
                    <span>Se connecter</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
              </Button>
              {/* Register agent link removed as per request */}
            </form>

            {/* Footer note avec animation */}
            <div className="mt-6 text-center animate-fade-in-up delay-300">
              <div className="flex items-center justify-center gap-2 text-xs text-[#376470] opacity-80">
                <div className="w-1 h-1 bg-[#2B8286] rounded-full"></div>
                <span>© 2025 Ricash. Tous droits réservés.</span>
                <div className="w-1 h-1 bg-[#2B8286] rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Styles CSS personnalisés pour les animations */}
      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in-up 0.4s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  )
}
