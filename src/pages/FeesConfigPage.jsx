import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  DollarSign, 
  Percent, 
  Calculator,
  Settings,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Building2,
  Globe,
  Target,
  Award,
  Shield,
  Edit,
  Eye,
  Trash2,
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

// Mock data pour les configurations de frais
const mockFeesConfig = {
  transferFees: {
    domestic: {
      fixed: 2.50,
      percentage: 0.5,
      min: 1.00,
      max: 50.00,
      description: 'Frais pour les transferts domestiques'
    },
    international: {
      fixed: 5.00,
      percentage: 1.0,
      min: 2.00,
      max: 100.00,
      description: 'Frais pour les transferts internationaux'
    },
    premium: {
      fixed: 1.00,
      percentage: 0.25,
      min: 0.50,
      max: 25.00,
      description: 'Frais réduits pour les comptes Premium'
    }
  },
  commissionRates: {
    agents: {
      level1: { rate: 2.5, description: 'Agents niveau 1' },
      level2: { rate: 3.0, description: 'Agents niveau 2' },
      level3: { rate: 3.5, description: 'Agents niveau 3' },
      senior: { rate: 4.0, description: 'Agents seniors' }
    },
    agencies: {
      standard: { rate: 1.5, description: 'Agences standard' },
      premium: { rate: 2.0, description: 'Agences premium' },
      enterprise: { rate: 2.5, description: 'Agences enterprise' }
    }
  },
  currencyRates: {
    EUR: { rate: 1.0, symbol: '€', name: 'Euro' },
    USD: { rate: 1.08, symbol: '$', name: 'Dollar US' },
    XOF: { rate: 655.96, symbol: 'F', name: 'Franc CFA' },
    GBP: { rate: 0.85, symbol: '£', name: 'Livre Sterling' }
  }
}

const getStatusBadge = (status) => {
  switch (status) {
    case 'actif':
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Actif</Badge>
    case 'inactif':
      return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="h-3 w-3" />Inactif</Badge>
    case 'en_attente':
      return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock className="h-3 w-3" />En attente</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
  }
}

export default function FeesConfigPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('transfer-fees')
  
  // États pour les formulaires
  const [transferFees, setTransferFees] = useState(mockFeesConfig.transferFees)
  const [commissionRates, setCommissionRates] = useState(mockFeesConfig.commissionRates)
  const [currencyRates, setCurrencyRates] = useState(mockFeesConfig.currencyRates)

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/settings')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux paramètres
          </RicashButton>
          <div>
            <h1 className="text-3xl font-bold text-[#29475B]">
              Configuration des Frais et Commissions
            </h1>
            <p className="text-[#376470]">Gérez les frais de transfert et les taux de commission</p>
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
            <h3 className="text-lg font-semibold text-[#29475B]">Frais Transferts</h3>
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
            <h3 className="text-lg font-semibold text-[#29475B]">Statut</h3>
            <Settings className="h-5 w-5 text-[#B19068]" />
          </div>
          <div className="space-y-2">
            {getStatusBadge('actif')}
            <div className="text-sm text-[#376470]">Configuration active</div>
          </div>
        </RicashCard>
      </div>

      {/* Onglets pour les configurations */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transfer-fees">Frais de Transfert</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="currency-rates">Taux de Change</TabsTrigger>
        </TabsList>

        <TabsContent value="transfer-fees" className="space-y-6">
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-6 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Configuration des Frais de Transfert
            </h3>
            
            <div className="grid gap-6 md:grid-cols-3">
              {Object.entries(transferFees).map(([type, config]) => (
                <div key={type} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-[#29475B] mb-4 capitalize">
                    {type === 'domestic' ? 'Domestique' : type === 'international' ? 'International' : 'Premium'}
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                        Frais fixes (€)
                      </RicashLabel>
                      <RicashInput
                        type="number"
                        step="0.01"
                        value={config.fixed}
                        onChange={(e) => setTransferFees(prev => ({
                          ...prev,
                          [type]: { ...prev[type], fixed: parseFloat(e.target.value) }
                        }))}
                      />
                    </div>
                    
                    <div>
                      <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                        Pourcentage (%)
                      </RicashLabel>
                      <RicashInput
                        type="number"
                        step="0.01"
                        value={config.percentage}
                        onChange={(e) => setTransferFees(prev => ({
                          ...prev,
                          [type]: { ...prev[type], percentage: parseFloat(e.target.value) }
                        }))}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                          Min (€)
                        </RicashLabel>
                        <RicashInput
                          type="number"
                          step="0.01"
                          value={config.min}
                          onChange={(e) => setTransferFees(prev => ({
                            ...prev,
                            [type]: { ...prev[type], min: parseFloat(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                          Max (€)
                        </RicashLabel>
                        <RicashInput
                          type="number"
                          step="0.01"
                          value={config.max}
                          onChange={(e) => setTransferFees(prev => ({
                            ...prev,
                            [type]: { ...prev[type], max: parseFloat(e.target.value) }
                          }))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                        Description
                      </RicashLabel>
                      <RicashTextarea
                        value={config.description}
                        onChange={(e) => setTransferFees(prev => ({
                          ...prev,
                          [type]: { ...prev[type], description: e.target.value }
                        }))}
                        rows={2}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <RicashButton
                variant="outline"
                onClick={() => handleReset('transfer-fees')}
              >
                Réinitialiser
              </RicashButton>
              <RicashButton
                onClick={() => handleSave('transfer-fees')}
                loading={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Sauvegarder
              </RicashButton>
            </div>
          </RicashCard>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-6">
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-6 flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Configuration des Commissions
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Commissions Agents */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Commissions Agents
                </h4>
                
                <div className="space-y-4">
                  {Object.entries(commissionRates.agents).map(([level, config]) => (
                    <div key={level} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-[#29475B]">{config.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <RicashInput
                          type="number"
                          step="0.1"
                          value={config.rate}
                          onChange={(e) => setCommissionRates(prev => ({
                            ...prev,
                            agents: {
                              ...prev.agents,
                              [level]: { ...prev.agents[level], rate: parseFloat(e.target.value) }
                            }
                          }))}
                          className="w-20"
                        />
                        <span className="text-sm text-[#376470]">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commissions Agences */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Commissions Agences
                </h4>
                
                <div className="space-y-4">
                  {Object.entries(commissionRates.agencies).map(([type, config]) => (
                    <div key={type} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-[#29475B]">{config.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <RicashInput
                          type="number"
                          step="0.1"
                          value={config.rate}
                          onChange={(e) => setCommissionRates(prev => ({
                            ...prev,
                            agencies: {
                              ...prev.agencies,
                              [type]: { ...prev.agencies[type], rate: parseFloat(e.target.value) }
                            }
                          }))}
                          className="w-20"
                        />
                        <span className="text-sm text-[#376470]">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <RicashButton
                variant="outline"
                onClick={() => handleReset('commissions')}
              >
                Réinitialiser
              </RicashButton>
              <RicashButton
                onClick={() => handleSave('commissions')}
                loading={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Sauvegarder
              </RicashButton>
            </div>
          </RicashCard>
        </TabsContent>

        <TabsContent value="currency-rates" className="space-y-6">
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-6 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Configuration des Taux de Change
            </h3>
            
            <div className="space-y-4">
              {Object.entries(currencyRates).map(([currency, config]) => (
                <div key={currency} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-[#2B8286] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{config.symbol}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#29475B]">{config.name}</p>
                    <p className="text-sm text-[#376470]">{currency}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RicashInput
                      type="number"
                      step="0.0001"
                      value={config.rate}
                      onChange={(e) => setCurrencyRates(prev => ({
                        ...prev,
                        [currency]: { ...prev[currency], rate: parseFloat(e.target.value) }
                      }))}
                      className="w-32"
                    />
                    <span className="text-sm text-[#376470]">EUR</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <RicashButton
                variant="outline"
                onClick={() => handleReset('currency-rates')}
              >
                Réinitialiser
              </RicashButton>
              <RicashButton
                onClick={() => handleSave('currency-rates')}
                loading={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
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
              Les modifications des frais et commissions affectent immédiatement tous les nouveaux transferts. 
              Assurez-vous de bien tester les configurations avant de les appliquer en production.
            </p>
          </div>
        </div>
      </RicashCard>
    </div>
  )
}
