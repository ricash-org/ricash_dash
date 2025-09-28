import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Settings,
  DollarSign, 
  Percent, 
  Calculator,
  Globe,
  ArrowLeftRight,
  TrendingUp,
  Building2,
  Target,
  Award,
  Shield,
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashCard } from '@/components/ui/ricash-card'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashLabel } from '@/components/ui/ricash-label'
import { RicashTextarea } from '@/components/ui/ricash-textarea'
import { RicashSelect } from '@/components/ui/ricash-input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

// Mock data pour les paramètres
const mockSettingsData = {
  fees: {
    transferFees: {
      domestic: { fixed: 2.50, percentage: 0.5, min: 1.00, max: 50.00 },
      international: { fixed: 5.00, percentage: 1.0, min: 2.00, max: 100.00 },
      premium: { fixed: 1.00, percentage: 0.25, min: 0.50, max: 25.00 }
    },
    commissionRates: {
      agents: { level1: 2.5, level2: 3.0, level3: 3.5, senior: 4.0 },
      agencies: { standard: 1.5, premium: 2.0, enterprise: 2.5 }
    }
  },
  currencyRates: {
    EUR: { rate: 1.0, symbol: '€', name: 'Euro', status: 'active' },
    USD: { rate: 1.08, symbol: '$', name: 'Dollar US', status: 'active' },
    XOF: { rate: 655.96, symbol: 'F', name: 'Franc CFA', status: 'active' },
    GBP: { rate: 0.85, symbol: '£', name: 'Livre Sterling', status: 'active' }
  },
  systemSettings: {
    maintenanceMode: false,
    autoBackup: true,
    notifications: true,
    securityLevel: 'high',
    sessionTimeout: 30
  }
}

const getStatusBadge = (status) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Actif</Badge>
    case 'inactive':
      return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><Clock className="h-3 w-3" />Inactif</Badge>
    case 'maintenance':
      return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><AlertCircle className="h-3 w-3" />Maintenance</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
  }
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('fees')
  
  // États pour les formulaires
  const [feesData, setFeesData] = useState(mockSettingsData.fees)
  const [currencyData, setCurrencyData] = useState(mockSettingsData.currencyRates)
  const [systemData, setSystemData] = useState(mockSettingsData.systemSettings)

  const handleSave = async (section) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success(`Configuration ${section} sauvegardée avec succès!`)
    setIsLoading(false)
  }

  const handleReset = (section) => {
    if (window.confirm(`Êtes-vous sûr de vouloir réinitialiser la configuration ${section} ?`)) {
      toast.success(`Configuration ${section} réinitialisée`)
    }
  }

  const handleExport = () => {
    toast.success('Export de la configuration téléchargé!')
  }

  const handleImport = () => {
    toast.success('Configuration importée avec succès!')
  }

  const handleNavigateToFees = () => {
    navigate('/app/settings/fees')
  }

  const handleNavigateToRates = () => {
    navigate('/app/settings/rates')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#29475B]">
              Paramètres du Système
            </h1>
            <p className="text-[#376470]">Configurez les paramètres généraux de l'application</p>
          </div>
        </div>
        <div className="flex gap-2">
          <RicashButton variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </RicashButton>
          <RicashButton variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </RicashButton>
          <RicashButton variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </RicashButton>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-6 md:grid-cols-4">
        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Frais</h3>
            <DollarSign className="h-5 w-5 text-[#2B8286]" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#29475B]">3</div>
            <div className="text-sm text-[#376470]">Types configurés</div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Commissions</h3>
            <Percent className="h-5 w-5 text-[#B19068]" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#29475B]">7</div>
            <div className="text-sm text-[#376470]">Niveaux configurés</div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Devises</h3>
            <Globe className="h-5 w-5 text-[#2B8286]" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#29475B]">4</div>
            <div className="text-sm text-[#376470]">Taux configurés</div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Système</h3>
            <Settings className="h-5 w-5 text-[#B19068]" />
          </div>
          <div className="space-y-2">
            {getStatusBadge('active')}
            <div className="text-sm text-[#376470]">Configuration active</div>
          </div>
        </RicashCard>
      </div>

      {/* Onglets pour les configurations */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fees">Frais et Commissions</TabsTrigger>
          <TabsTrigger value="currency">Taux de Change</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
        </TabsList>

        <TabsContent value="fees" className="space-y-6">
          <RicashCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#29475B] flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Configuration des Frais et Commissions
              </h3>
              <RicashButton onClick={handleNavigateToFees}>
                <Eye className="h-4 w-4 mr-2" />
                Voir la page dédiée
              </RicashButton>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Frais de Transfert */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                  <ArrowLeftRight className="h-4 w-4" />
                  Frais de Transfert
                </h4>
                
                <div className="space-y-3">
                  {Object.entries(feesData.transferFees).map(([type, config]) => (
                    <div key={type} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-[#29475B] capitalize">
                          {type === 'domestic' ? 'Domestique' : type === 'international' ? 'International' : 'Premium'}
                        </span>
                        <span className="text-sm text-[#376470]">
                          {config.fixed}€ + {config.percentage}%
                        </span>
                      </div>
                      <div className="text-xs text-[#376470]">
                        Min: {config.min}€ - Max: {config.max}€
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commissions */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Commissions
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-[#29475B] mb-2">Agents</p>
                    <div className="space-y-2">
                      {Object.entries(feesData.commissionRates.agents).map(([level, rate]) => (
                        <div key={level} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-[#29475B] capitalize">{level}</span>
                          <span className="text-sm font-medium text-[#2B8286]">{rate}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-[#29475B] mb-2">Agences</p>
                    <div className="space-y-2">
                      {Object.entries(feesData.commissionRates.agencies).map(([type, rate]) => (
                        <div key={type} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-[#29475B] capitalize">{type}</span>
                          <span className="text-sm font-medium text-[#2B8286]">{rate}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <RicashButton
                variant="outline"
                onClick={() => handleReset('fees')}
              >
                Réinitialiser
              </RicashButton>
              <RicashButton
                onClick={() => handleSave('fees')}
                loading={isLoading}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Sauvegarder
              </RicashButton>
            </div>
          </RicashCard>
        </TabsContent>

        <TabsContent value="currency" className="space-y-6">
          <RicashCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#29475B] flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configuration des Taux de Change
              </h3>
              <RicashButton onClick={handleNavigateToRates}>
                <Eye className="h-4 w-4 mr-2" />
                Voir la page dédiée
              </RicashButton>
            </div>
            
            <div className="space-y-4">
              {Object.entries(currencyData).map(([currency, config]) => (
                <div key={currency} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-[#2B8286] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{config.symbol}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#29475B]">{config.name}</p>
                    <p className="text-sm text-[#376470]">{currency}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#29475B]">{config.rate}</span>
                    <span className="text-sm text-[#376470]">EUR</span>
                  </div>
                  <div>
                    {getStatusBadge(config.status)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <RicashButton
                variant="outline"
                onClick={() => handleReset('currency')}
              >
                Réinitialiser
              </RicashButton>
              <RicashButton
                onClick={() => handleSave('currency')}
                loading={isLoading}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Sauvegarder
              </RicashButton>
            </div>
          </RicashCard>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-6 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres Système
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-[#29475B]">Mode Maintenance</p>
                    <p className="text-sm text-[#376470]">Activer le mode maintenance</p>
                  </div>
                  <Badge className={systemData.maintenanceMode ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                    {systemData.maintenanceMode ? 'Activé' : 'Désactivé'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-[#29475B]">Sauvegarde Automatique</p>
                    <p className="text-sm text-[#376470]">Sauvegarde quotidienne</p>
                  </div>
                  <Badge className={systemData.autoBackup ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {systemData.autoBackup ? 'Activé' : 'Désactivé'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-[#29475B]">Notifications</p>
                    <p className="text-sm text-[#376470]">Alertes système</p>
                  </div>
                  <Badge className={systemData.notifications ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {systemData.notifications ? 'Activé' : 'Désactivé'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-[#29475B] mb-2">Niveau de Sécurité</p>
                  <Badge className="bg-blue-100 text-blue-800">
                    {systemData.securityLevel === 'high' ? 'Élevé' : systemData.securityLevel === 'medium' ? 'Moyen' : 'Faible'}
                  </Badge>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-[#29475B] mb-2">Timeout de Session</p>
                  <span className="text-lg font-bold text-[#2B8286]">{systemData.sessionTimeout} min</span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-[#29475B] mb-2">Dernière Sauvegarde</p>
                  <span className="text-sm text-[#376470]">2024-01-20 14:30</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <RicashButton
                variant="outline"
                onClick={() => handleReset('system')}
              >
                Réinitialiser
              </RicashButton>
              <RicashButton
                onClick={() => handleSave('system')}
                loading={isLoading}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Sauvegarder
              </RicashButton>
            </div>
          </RicashCard>
        </TabsContent>
      </Tabs>

      {/* Avertissement */}
      <RicashCard className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-2">Attention</h4>
            <p className="text-sm text-yellow-700">
              Les modifications des paramètres système affectent le comportement global de l'application. 
              Assurez-vous de bien comprendre les implications avant de modifier ces paramètres.
            </p>
          </div>
        </div>
      </RicashCard>
    </div>
  )
}
