import { useState } from 'react'
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Key,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Moon,
  Sun,
  Monitor,
  Languages,
  CreditCard,
  FileText,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  Search,
  Activity,
  Zap,
  Lock,
  Unlock,
  Clock,
  AlertCircle
} from 'lucide-react'
import { RicashCard, RicashStatCard } from '@/components/ui/ricash-card'
import { RicashButton, RicashIconButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashLabel } from '@/components/ui/ricash-input'
import { RicashSelect } from '@/components/ui/ricash-input'
import { RicashTextarea } from '@/components/ui/ricash-input'
import { RicashTabs, RicashTabsContent, RicashTabsList, RicashTabsTrigger } from '@/components/ui/ricash-navigation'
import { Switch } from '@/components/ui/switch'
import { RicashStatusBadge } from '@/components/ui/ricash-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

// Palette de couleurs Ricash
const RICASH_COLORS = {
  bleuFonce: '#29475B',
  dore: '#B19068',
  turquoise: '#2B8286',
  blancCasse: '#F4F2EE',
  bleuVert: '#376470'
}

export default function Settings() {
  // Theme state
  const [theme, setTheme] = useState('system')
  
  // User preferences
  const [language, setLanguage] = useState('fr')
  const [timezone, setTimezone] = useState('Europe/Paris')
  const [currency, setCurrency] = useState('EUR')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY')
  const [timeFormat, setTimeFormat] = useState('24h')
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [transactionAlerts, setTransactionAlerts] = useState(true)
  
  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [passwordExpiry, setPasswordExpiry] = useState(90)
  const [loginAttempts, setLoginAttempts] = useState(5)
  const [ipWhitelist, setIpWhitelist] = useState('')
  
  // System settings
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState('daily')
  const [dataRetention, setDataRetention] = useState(7)
  const [logLevel, setLogLevel] = useState('info')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  
  // API settings
  const [apiEnabled, setApiEnabled] = useState(true)
  const [rateLimit, setRateLimit] = useState(1000)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Production API Key', key: 'pk_live_...', created: '2024-01-15', lastUsed: '2024-01-20', status: 'active' },
    { id: '2', name: 'Test API Key', key: 'pk_test_...', created: '2024-01-10', lastUsed: '2024-01-18', status: 'active' }
  ])

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  // Handle save settings
  const handleSaveSettings = () => {
    toast.success('Paramètres sauvegardés avec succès !')
  }

  // Handle reset settings
  const handleResetSettings = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action est irréversible.')) {
      toast.info('Paramètres réinitialisés aux valeurs par défaut')
    }
  }

  // Handle API key actions
  const handleCreateApiKey = () => {
    const newKey = {
      id: String(apiKeys.length + 1),
      name: `Nouvelle clé API ${apiKeys.length + 1}`,
      key: `pk_${Math.random().toString(36).substr(2, 9)}...`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Jamais',
      status: 'active'
    }
    setApiKeys(prev => [...prev, newKey])
    toast.success('Nouvelle clé API créée !')
  }

  const handleDeleteApiKey = (keyId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette clé API ? Cette action est irréversible.')) {
      setApiKeys(prev => prev.filter(key => key.id !== keyId))
      toast.success('Clé API supprimée !')
    }
  }

  const handleToggleMaintenanceMode = () => {
    setMaintenanceMode(prev => !prev)
    toast.success(`Mode maintenance ${!maintenanceMode ? 'activé' : 'désactivé'} !`)
  }

  return (
    <div className="space-y-8 p-6 bg-[#F4F2EE] min-h-screen">
      {/* Page header avec design Ricash */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#376470]/10">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#29475B] mb-2">
            Paramètres
          </h1>
            <p className="text-lg text-[#376470] font-medium">
              Configurez vos préférences et paramètres système
          </p>
        </div>
          <div className="flex gap-3">
            <RicashButton
              variant="outline"
              size="lg"
              onClick={handleResetSettings}
            >
              <RefreshCw className="mr-2 h-5 w-5" />
            Réinitialiser
            </RicashButton>
            <RicashButton 
              variant="accent"
              size="lg"
              onClick={handleSaveSettings}
            >
              <Save className="mr-2 h-5 w-5" />
            Sauvegarder
            </RicashButton>
          </div>
        </div>
      </div>

      {/* Stats rapides avec design Ricash */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <RicashStatCard
          title="Clés API actives"
          value={apiKeys.filter(k => k.status === 'active').length.toString()}
          change="+1"
          changeType="positive"
          description="Ce mois"
          icon={Key}
          iconColor={RICASH_COLORS.turquoise}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Notifications"
          value="3"
          change="+1"
          changeType="positive"
          description="Activées"
          icon={Bell}
          iconColor={RICASH_COLORS.dore}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Sécurité"
          value="100%"
          change="+5%"
          changeType="positive"
          description="Protégé"
          icon={Shield}
          iconColor={RICASH_COLORS.bleuFonce}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Système"
          value="Stable"
          change="+0"
          changeType="neutral"
          description="Status"
          icon={Activity}
          iconColor={RICASH_COLORS.bleuVert}
          className="transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Onglets de paramètres avec design Ricash */}
      <RicashTabs defaultValue="profile" className="w-full">
        <RicashTabsList className="grid w-full grid-cols-6 bg-white rounded-2xl shadow-lg border border-[#376470]/10">
          <RicashTabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </RicashTabsTrigger>
          <RicashTabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </RicashTabsTrigger>
          <RicashTabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </RicashTabsTrigger>
          <RicashTabsTrigger value="system" className="flex items-center space-x-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Système</span>
          </RicashTabsTrigger>
          <RicashTabsTrigger value="api" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </RicashTabsTrigger>
          <RicashTabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Apparence</span>
          </RicashTabsTrigger>
        </RicashTabsList>

        {/* Onglet Profil */}
        <RicashTabsContent value="profile" className="space-y-6">
          <RicashCard>
            <div className="p-6 border-b border-[#376470]/10">
              <h3 className="text-xl font-bold text-[#29475B] mb-2">
                Informations personnelles
              </h3>
              <p className="text-[#376470]">
                Gérez vos informations de profil et préférences
              </p>
            </div>
            <div className="p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="language">Langue</RicashLabel>
                  <RicashSelect
                    id="language"
                    value={language}
                    onValueChange={setLanguage}
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                  </RicashSelect>
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="timezone">Fuseau horaire</RicashLabel>
                  <RicashSelect
                    id="timezone"
                    value={timezone}
                    onValueChange={setTimezone}
                  >
                    <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                  </RicashSelect>
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="currency">Devise</RicashLabel>
                  <RicashSelect
                    id="currency"
                    value={currency}
                    onValueChange={setCurrency}
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="XOF">XOF (CFA)</option>
                  </RicashSelect>
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="dateFormat">Format de date</RicashLabel>
                  <RicashSelect
                    id="dateFormat"
                    value={dateFormat}
                    onValueChange={setDateFormat}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </RicashSelect>
                </div>
                </div>
          </div>
          </RicashCard>
        </RicashTabsContent>

        {/* Onglet Notifications */}
        <RicashTabsContent value="notifications" className="space-y-6">
          <RicashCard>
            <div className="p-6 border-b border-[#376470]/10">
              <h3 className="text-xl font-bold text-[#29475B] mb-2">
                Préférences de notifications
              </h3>
              <p className="text-[#376470]">
                Configurez comment vous souhaitez recevoir vos notifications
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#2B8286]/5 border border-[#2B8286]/10">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-[#2B8286]" />
                    <div>
                      <div className="font-medium text-[#29475B]">Notifications par email</div>
                      <div className="text-sm text-[#376470]">Recevoir les notifications importantes par email</div>
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    className="data-[state=checked]:bg-[#2B8286]"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#B19068]/5 border border-[#B19068]/10">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-[#B19068]" />
                    <div>
                      <div className="font-medium text-[#29475B]">Notifications SMS</div>
                      <div className="text-sm text-[#376470]">Recevoir les alertes critiques par SMS</div>
                    </div>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                    className="data-[state=checked]:bg-[#B19068]"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#376470]/5 border border-[#376470]/10">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-[#376470]" />
                    <div>
                      <div className="font-medium text-[#29475B]">Notifications push</div>
                      <div className="text-sm text-[#376470]">Recevoir les notifications en temps réel</div>
                    </div>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                    className="data-[state=checked]:bg-[#376470]"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel>Alertes de sécurité</RicashLabel>
                  <Switch
                    checked={securityAlerts}
                    onCheckedChange={setSecurityAlerts}
                    className="data-[state=checked]:bg-[#2B8286]"
                  />
                </div>
                
                <div className="space-y-2">
                  <RicashLabel>Alertes de transaction</RicashLabel>
                  <Switch
                    checked={transactionAlerts}
                    onCheckedChange={setTransactionAlerts}
                    className="data-[state=checked]:bg-[#2B8286]"
                  />
                </div>
                  </div>
                </div>
          </RicashCard>
        </RicashTabsContent>

        {/* Onglet Sécurité */}
        <RicashTabsContent value="security" className="space-y-6">
          <RicashCard>
            <div className="p-6 border-b border-[#376470]/10">
              <h3 className="text-xl font-bold text-[#29475B] mb-2">
                Paramètres de sécurité
              </h3>
              <p className="text-[#376470]">
                Configurez la sécurité de votre compte et de vos données
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#2B8286]/5 border border-[#2B8286]/10">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-[#2B8286]" />
                    <div>
                      <div className="font-medium text-[#29475B]">Authentification à deux facteurs</div>
                      <div className="text-sm text-[#376470]">Ajouter une couche de sécurité supplémentaire</div>
                    </div>
                  </div>
                  <Switch
                    checked={twoFactorAuth}
                    onCheckedChange={setTwoFactorAuth}
                    className="data-[state=checked]:bg-[#2B8286]"
                  />
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</RicashLabel>
                  <RicashInput
                    id="sessionTimeout"
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(Number(e.target.value))}
                    min="5"
                    max="480"
                  />
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="passwordExpiry">Expiration du mot de passe (jours)</RicashLabel>
                  <RicashInput
                    id="passwordExpiry"
                    type="number"
                    value={passwordExpiry}
                    onChange={(e) => setPasswordExpiry(Number(e.target.value))}
                    min="30"
                    max="365"
                  />
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="loginAttempts">Tentatives de connexion max</RicashLabel>
                  <RicashInput
                    id="loginAttempts"
                    type="number"
                    value={loginAttempts}
                    onChange={(e) => setLoginAttempts(Number(e.target.value))}
                    min="3"
                    max="10"
                  />
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="ipWhitelist">Liste blanche IP (optionnel)</RicashLabel>
                  <RicashTextarea
                    id="ipWhitelist"
                    placeholder="192.168.1.1, 10.0.0.1"
                    value={ipWhitelist}
                    onChange={(e) => setIpWhitelist(e.target.value)}
                    rows={3}
                  />
          </div>
                  </div>
                </div>
          </RicashCard>
        </RicashTabsContent>

        {/* Onglet Système */}
        <RicashTabsContent value="system" className="space-y-6">
          <RicashCard>
            <div className="p-6 border-b border-[#376470]/10">
              <h3 className="text-xl font-bold text-[#29475B] mb-2">
                Paramètres système
              </h3>
              <p className="text-[#376470]">
                Configurez les paramètres avancés du système
                  </p>
                </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#B19068]/5 border border-[#B19068]/10">
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-[#B19068]" />
                    <div>
                      <div className="font-medium text-[#29475B]">Sauvegarde automatique</div>
                      <div className="text-sm text-[#376470]">Sauvegarder automatiquement les données</div>
          </div>
                  </div>
                  <Switch
                    checked={autoBackup}
                    onCheckedChange={setAutoBackup}
                    className="data-[state=checked]:bg-[#B19068]"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#376470]/5 border border-[#376470]/10">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-[#376470]" />
                    <div>
                      <div className="font-medium text-[#29475B]">Mode maintenance</div>
                      <div className="text-sm text-[#376470]">Mettre le système en mode maintenance</div>
                    </div>
                  </div>
                  <Switch
                    checked={maintenanceMode}
                    onCheckedChange={handleToggleMaintenanceMode}
                    className="data-[state=checked]:bg-[#376470]"
                  />
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="backupFrequency">Fréquence de sauvegarde</RicashLabel>
                  <RicashSelect
                    id="backupFrequency"
                    value={backupFrequency}
                    onValueChange={setBackupFrequency}
                  >
                    <option value="hourly">Toutes les heures</option>
                    <option value="daily">Quotidienne</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuelle</option>
                  </RicashSelect>
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="dataRetention">Rétention des données (jours)</RicashLabel>
                  <RicashInput
                    id="dataRetention"
                    type="number"
                    value={dataRetention}
                    onChange={(e) => setDataRetention(Number(e.target.value))}
                    min="1"
                    max="365"
                  />
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="logLevel">Niveau de log</RicashLabel>
                  <RicashSelect
                    id="logLevel"
                    value={logLevel}
                    onValueChange={setLogLevel}
                  >
                    <option value="error">Erreur</option>
                    <option value="warn">Avertissement</option>
                    <option value="info">Information</option>
                    <option value="debug">Débogage</option>
                  </RicashSelect>
                </div>
              </div>
                </div>
          </RicashCard>
        </RicashTabsContent>

        {/* Onglet API */}
        <RicashTabsContent value="api" className="space-y-6">
          <RicashCard>
            <div className="p-6 border-b border-[#376470]/10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-[#29475B] mb-2">
                    Configuration API
                  </h3>
                  <p className="text-[#376470]">
                    Gérez vos clés API et paramètres d'intégration
                    </p>
                  </div>
                <RicashButton
                  variant="accent"
                  size="lg"
                  onClick={handleCreateApiKey}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Nouvelle clé
                </RicashButton>
                </div>
                </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#2B8286]/5 border border-[#2B8286]/10">
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5 text-[#2B8286]" />
                    <div>
                      <div className="font-medium text-[#29475B]">API activée</div>
                      <div className="text-sm text-[#376470]">Permettre l'accès via l'API</div>
          </div>
                  </div>
                  <Switch
                    checked={apiEnabled}
                    onCheckedChange={setApiEnabled}
                    className="data-[state=checked]:bg-[#2B8286]"
                  />
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="rateLimit">Limite de taux (req/min)</RicashLabel>
                  <RicashInput
                    id="rateLimit"
                    type="number"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(Number(e.target.value))}
                    min="100"
                    max="10000"
                  />
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="webhookUrl">URL Webhook</RicashLabel>
                  <RicashInput
                    id="webhookUrl"
                    placeholder="https://votre-domaine.com/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                </div>
                </div>
                
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#29475B]">Clés API actives</h4>
                <div className="space-y-3">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="flex items-center justify-between p-4 rounded-xl bg-[#F4F2EE] border border-[#376470]/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#2B8286]/20 flex items-center justify-center">
                          <Key className="h-5 w-5 text-[#2B8286]" />
                        </div>
                        <div>
                          <div className="font-medium text-[#29475B]">{apiKey.name}</div>
                          <div className="text-sm text-[#376470]">{apiKey.key}</div>
                          <div className="text-xs text-[#376470]/70">
                            Créée le {apiKey.created} • Dernière utilisation: {apiKey.lastUsed}
                        </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RicashStatusBadge 
                          status="success" 
                          text="Active" 
                        />
                        <RicashIconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteApiKey(apiKey.id)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </RicashIconButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RicashCard>
        </RicashTabsContent>

        {/* Onglet Apparence */}
        <RicashTabsContent value="appearance" className="space-y-6">
          <RicashCard>
            <div className="p-6 border-b border-[#376470]/10">
              <h3 className="text-xl font-bold text-[#29475B] mb-2">
                Personnalisation de l'interface
              </h3>
              <p className="text-[#376470]">
                Personnalisez l'apparence de votre dashboard
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#29475B]">Thème</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div 
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      theme === 'light' 
                        ? 'border-[#2B8286] bg-[#2B8286]/5' 
                        : 'border-[#376470]/20 bg-white hover:border-[#376470]/40'
                    }`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Sun className="h-5 w-5 text-[#B19068]" />
                      <span className="font-medium text-[#29475B]">Clair</span>
                    </div>
                    <div className="text-sm text-[#376470]">Interface claire et lumineuse</div>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      theme === 'dark' 
                        ? 'border-[#2B8286] bg-[#2B8286]/5' 
                        : 'border-[#376470]/20 bg-white hover:border-[#376470]/40'
                    }`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Moon className="h-5 w-5 text-[#376470]" />
                      <span className="font-medium text-[#29475B]">Sombre</span>
                    </div>
                    <div className="text-sm text-[#376470]">Interface sombre et élégante</div>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      theme === 'system' 
                        ? 'border-[#2B8286] bg-[#2B8286]/5' 
                        : 'border-[#376470]/20 bg-white hover:border-[#376470]/40'
                    }`}
                    onClick={() => handleThemeChange('system')}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Monitor className="h-5 w-5 text-[#29475B]" />
                      <span className="font-medium text-[#29475B]">Système</span>
                    </div>
                    <div className="text-sm text-[#376470]">Suivre les préférences système</div>
                  </div>
                </div>
          </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="timeFormat">Format d'heure</RicashLabel>
                  <RicashSelect
                    id="timeFormat"
                    value={timeFormat}
                    onValueChange={setTimeFormat}
                  >
                    <option value="24h">24 heures</option>
                    <option value="12h">12 heures</option>
                  </RicashSelect>
                </div>
              </div>
          </div>
          </RicashCard>
        </RicashTabsContent>
      </RicashTabs>
    </div>
  )
}
