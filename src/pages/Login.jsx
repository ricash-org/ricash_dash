import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight
} from 'lucide-react'
import axios from 'axios' // ⬅️ Importe Axios
import richashLogo from '@/assets/richash.png'
import bgRicash from '@/assets/bgrichash.jpg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

// Dans Login.jsx - REMPLACEZ handleSubmit par ceci :
const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (!validateForm()) return

  setIsLoading(true)
  
  try {
    console.log('🔄 Tentative de connexion avec:', formData.email)
    
    // ⬇️ UTILISEZ UNIQUEMENT LE CONTEXTE D'AUTHENTIFICATION
    await login({
      email: formData.email,
      password: formData.password
    })

    console.log('✅ Connexion réussie via AuthContext!')
    
    // ⬇️ REDIRECTION SIMPLIFIÉE
    console.log('➡️ Redirection vers le dashboard...')
    navigate('/app/dashboard', { replace: true })
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error)
    setErrors({ 
      general: error.message || 'Erreur de connexion. Veuillez réessayer.' 
    })
  } finally {
    setIsLoading(false)
  }
}
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
          <CardHeader className="text-center pb-6">
            {/* Logo Ricash avec animation d'entrée */}
            <div className="mx-auto mb-1 flex items-center justify-center animate-fade-in-down">
              <img 
                src={richashLogo} 
                alt="Ricash Logo" 
                className="w-40 h-40 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            <CardTitle className="text-2xl font-bold text-[#29475B] mb-0 animate-fade-in-up">
              Tableau de bord Ricash
            </CardTitle>
            <CardDescription className="text-[#376470] text-base animate-fade-in-up delay-100 mb-2">
              Connectez-vous à votre espace d'administration
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* General error avec animation */}
              {errors.general && (
                <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl animate-shake">
                  {errors.general}
                </div>
              )}

              {/* Email field avec design Ricash */}
              <div className="space-y-1 group">
                <Label htmlFor="email" className="text-sm font-semibold text-[#29475B] group-focus-within:text-[#2B8286] transition-colors duration-300">
                  Adresse email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#2B8286] group-focus-within:text-[#29475B] transition-all duration-300 group-focus-within:scale-110 drop-shadow-sm z-10" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@ricash.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-12 h-12 border-2 rounded-xl transition-all duration-300 ${
                      errors.email 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                        : 'border-[#E8F4F8] focus:border-[#2B8286] focus:ring-[#2B8286]/20 hover:border-[#B19068]'
                    } bg-white/90 backdrop-blur-sm text-[#29475B] placeholder-[#376470]/60 hover:shadow-lg focus:shadow-xl`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 font-medium animate-fade-in">{errors.email}</p>
                )}
              </div>

              {/* Password field avec design Ricash */}
              <div className="space-y-1 group">
                <Label htmlFor="password" className="text-sm font-semibold text-[#29475B] group-focus-within:text-[#2B8286] transition-colors duration-300">
                  Mot de passe
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#2B8286] group-focus-within:text-[#29475B] transition-all duration-300 group-focus-within:scale-110 drop-shadow-sm z-10" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-12 pr-12 h-12 border-2 rounded-xl transition-all duration-300 ${
                      errors.password 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                        : 'border-[#E8F4F8] focus:border-[#2B8286] focus:ring-[#2B8286]/20 hover:border-[#B19068]'
                    } bg-white/90 backdrop-blur-sm text-[#29475B] placeholder-[#376470]/60 hover:shadow-lg focus:shadow-xl`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#2B8286] hover:text-[#29475B] transition-all duration-300 hover:scale-110 z-10"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 font-medium animate-fade-in">{errors.password}</p>
                )}
              </div>

              {/* Remember me and forgot password */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-3 group">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', checked)}
                    className="data-[state=checked]:bg-[#2B8286] data-[state=checked]:border-[#2B8286] hover:scale-110 transition-transform duration-200"
                  />
                  <Label 
                    htmlFor="remember" 
                    className="text-sm text-[#29475B] cursor-pointer font-medium group-hover:text-[#2B8286] transition-colors duration-300"
                  >
                    Se souvenir de moi
                  </Label>
                </div>
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-sm text-[#2B8286] hover:text-[#29475B] p-0 font-medium hover:underline transition-all duration-300 hover:scale-105"
                >
                  Mot de passe oublié ?
                </Button>
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
