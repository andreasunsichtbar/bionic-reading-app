import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, FileText, Settings, Play, CheckCircle, ArrowRight, BookOpen } from 'lucide-react'

interface ProcessingConfig {
  enableTranslation: boolean
  targetLanguage: string
  translationNotes: string
  bionicConfig: {
    boldPercentage: number
    fontSize: number
    lineHeight: number
    fontFamily: string
  }
}

interface ProcessingStep {
  name: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  error?: string
}

const PDFProcessor: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)

  const [config, setConfig] = useState<ProcessingConfig>({
    enableTranslation: false,
    targetLanguage: 'Deutsch',
    translationNotes: '',
    bionicConfig: {
      boldPercentage: 40,
      fontSize: 16,
      lineHeight: 1.6,
      fontFamily: 'Inter'
    }
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0])
      setDownloadUrl(null)
      setProcessingSteps([])
      setCurrentStep(0)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  const initializeProcessingSteps = () => {
    const steps: ProcessingStep[] = [
      { name: 'PDF extrahieren', status: 'pending', progress: 0 },
      { name: 'Text extrahieren', status: 'pending', progress: 0 }
    ]

    if (config.enableTranslation) {
      steps.push(
        { name: 'Dokument übersetzen', status: 'pending', progress: 0 },
        { name: 'Übersetzung validieren', status: 'pending', progress: 0 }
      )
    }

    steps.push(
      { name: 'Bionic Reading anwenden', status: 'pending', progress: 0 },
      { name: 'EPUB generieren', status: 'pending', progress: 0 }
    )

    setProcessingSteps(steps)
  }

  const updateStepStatus = (stepIndex: number, status: ProcessingStep['status'], progress: number, error?: string) => {
    setProcessingSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status, progress, error } : step
    ))
  }

  const processFile = async () => {
    if (!uploadedFile) return
    
    setIsProcessing(true)
    initializeProcessingSteps()
    
    try {
      // Schritt 1: PDF extrahieren
      setCurrentStep(0)
      updateStepStatus(0, 'processing', 0)
      await new Promise(resolve => setTimeout(resolve, 1500))
      updateStepStatus(0, 'completed', 100)
      
      // Schritt 2: Text extrahieren
      setCurrentStep(1)
      updateStepStatus(1, 'processing', 0)
      await new Promise(resolve => setTimeout(resolve, 2000))
      updateStepStatus(1, 'completed', 100)
      
      let currentStepIndex = 2
      
      // Schritt 3: Übersetzung (optional)
      if (config.enableTranslation) {
        setCurrentStep(currentStepIndex)
        updateStepStatus(currentStepIndex, 'processing', 0)
        
        // Simuliere Übersetzung
        for (let i = 0; i <= 100; i += 10) {
          updateStepStatus(currentStepIndex, 'processing', i)
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        updateStepStatus(currentStepIndex, 'completed', 100)
        currentStepIndex++
        
        // Übersetzung validieren
        setCurrentStep(currentStepIndex)
        updateStepStatus(currentStepIndex, 'processing', 0)
        await new Promise(resolve => setTimeout(resolve, 1000))
        updateStepStatus(currentStepIndex, 'completed', 100)
        currentStepIndex++
      }
      
      // Schritt 4: Bionic Reading anwenden
      setCurrentStep(currentStepIndex)
      updateStepStatus(currentStepIndex, 'processing', 0)
      await new Promise(resolve => setTimeout(resolve, 1500))
      updateStepStatus(currentStepIndex, 'completed', 100)
      currentStepIndex++
      
      // Schritt 5: EPUB generieren
      setCurrentStep(currentStepIndex)
      updateStepStatus(currentStepIndex, 'processing', 0)
      await new Promise(resolve => setTimeout(resolve, 2000))
      updateStepStatus(currentStepIndex, 'completed', 100)
      
      // Erstelle Download-Link
      const blob = new Blob(['Simulierte Bionic Reading EPUB-Datei'], { type: 'application/epub+zip' })
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      
    } catch (error) {
      console.error('Fehler bei der Verarbeitung:', error)
      updateStepStatus(currentStep, 'error', 0, 'Verarbeitungsfehler aufgetreten')
    } finally {
      setIsProcessing(false)
    }
  }

  const updateConfig = (key: keyof ProcessingConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const updateBionicConfig = (key: keyof ProcessingConfig['bionicConfig'], value: number | string) => {
    setConfig(prev => ({
      ...prev,
      bionicConfig: { ...prev.bionicConfig, [key]: value }
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">PDF-Verarbeiter</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Laden Sie PDF-Dateien hoch, übersetzen Sie sie optional ins Deutsche und 
          konvertieren Sie sie in Bionic Reading EPUBs. Die Verarbeitung erfolgt in der 
          optimalen Reihenfolge: Übersetzung → Bionic Reading → EPUB-Generierung.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="h-6 w-6 text-primary-600" />
              PDF-Datei hochladen
            </h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              {uploadedFile ? (
                <div className="space-y-2">
                  <FileText className="h-8 w-8 text-primary-600 mx-auto" />
                  <p className="text-lg font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive ? 'PDF hier ablegen' : 'PDF hier ablegen oder klicken'}
                  </p>
                  <p className="text-gray-500">Unterstützt: .pdf</p>
                </div>
              )}
            </div>

            {uploadedFile && (
              <div className="mt-4">
                <button
                  onClick={processFile}
                  disabled={isProcessing}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 w-full justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Verarbeite...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Verarbeitung starten
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Processing Steps */}
          {processingSteps.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verarbeitungsschritte</h3>
              <div className="space-y-4">
                {processingSteps.map((step, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {step.status === 'pending' && (
                          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                        )}
                        {step.status === 'processing' && (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                        )}
                        {step.status === 'completed' && (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        )}
                        {step.status === 'error' && (
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">!</span>
                          </div>
                        )}
                        
                        <span className={`font-medium ${
                          index === currentStep ? 'text-primary-600' : 'text-gray-700'
                        }`}>
                          {step.name}
                        </span>
                      </div>
                      
                      {step.status === 'completed' && (
                        <span className="text-sm text-green-600 font-medium">100%</span>
                      )}
                      {step.status === 'processing' && (
                        <span className="text-sm text-primary-600 font-medium">
                          {step.progress}%
                        </span>
                      )}
                    </div>
                    
                    {step.status === 'processing' && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${step.progress}%` }}
                        ></div>
                      </div>
                    )}
                    
                    {step.status === 'error' && step.error && (
                      <p className="text-sm text-red-600">{step.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Section */}
          {downloadUrl && (
            <div className="card bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Verarbeitung abgeschlossen!
              </h3>
              <a
                href={downloadUrl}
                download="bionic-reading.epub"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Bionic Reading EPUB herunterladen
              </a>
            </div>
          )}
        </div>

        {/* Configuration Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary-600" />
              Verarbeitungseinstellungen
            </h2>

            <div className="space-y-6">
              {/* Translation Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Übersetzung</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.enableTranslation}
                      onChange={(e) => updateConfig('enableTranslation', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Dokument ins Deutsche übersetzen
                    </span>
                  </label>
                  
                  {config.enableTranslation && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zielsprache
                        </label>
                        <select
                          value={config.targetLanguage}
                          onChange={(e) => updateConfig('targetLanguage', e.target.value)}
                          className="input-field"
                        >
                          <option value="Deutsch">Deutsch</option>
                          <option value="Französisch">Französisch</option>
                          <option value="Spanisch">Spanisch</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Übersetzungshinweise
                        </label>
                        <textarea
                          value={config.translationNotes}
                          onChange={(e) => updateConfig('translationNotes', e.target.value)}
                          placeholder="z.B. Fachbegriffe beibehalten, formeller Stil, etc."
                          rows={3}
                          className="input-field resize-none"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Bionic Reading Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bionic Reading</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fett-Darstellung (% der Wortlänge)
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="80"
                      value={config.bionicConfig.boldPercentage}
                      onChange={(e) => updateBionicConfig('boldPercentage', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>20%</span>
                      <span className="font-medium">{config.bionicConfig.boldPercentage}%</span>
                      <span>80%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Schriftgröße (px)
                      </label>
                      <input
                        type="number"
                        min="12"
                        max="24"
                        value={config.bionicConfig.fontSize}
                        onChange={(e) => updateBionicConfig('fontSize', parseInt(e.target.value))}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zeilenabstand
                      </label>
                      <input
                        type="number"
                        min="1.2"
                        max="2.5"
                        step="0.1"
                        value={config.bionicConfig.lineHeight}
                        onChange={(e) => updateBionicConfig('lineHeight', parseFloat(e.target.value))}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schriftart
                    </label>
                    <select
                      value={config.bionicConfig.fontFamily}
                      onChange={(e) => updateBionicConfig('fontFamily', e.target.value)}
                      className="input-field"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Arial">Arial</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Flow Info */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Verarbeitungsreihenfolge
            </h3>
            <div className="space-y-3 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>PDF extrahieren und Text extrahieren</span>
              </div>
              {config.enableTranslation && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Dokument übersetzen und validieren</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>Bionic Reading anwenden</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <span>EPUB generieren</span>
                  </div>
                </>
              )}
              {!config.enableTranslation && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Bionic Reading anwenden</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>EPUB generieren</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PDFProcessor
