import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, Settings, Eye, BookOpen, FileText, X } from 'lucide-react'

interface BionicConfig {
  boldPercentage: number
  fontSize: number
  lineHeight: number
  paragraphSpacing: number
  fontFamily: string
  marginLeft: number
  marginRight: number
  marginTop: number
  marginBottom: number
}

const BionicConverter: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [previewText, setPreviewText] = useState<string>('')
  const [showPreview, setShowPreview] = useState(false)

  const [config, setConfig] = useState<BionicConfig>({
    boldPercentage: 40,
    fontSize: 16,
    lineHeight: 1.6,
    paragraphSpacing: 1.5,
    fontFamily: 'Inter',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0])
      setDownloadUrl(null)
      setPreviewText('')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/epub+zip': ['.epub']
    },
    multiple: false
  })

  const generateBionicText = (text: string, boldPercentage: number): string => {
    return text.split(' ').map(word => {
      if (word.length <= 2) return word
      
      const boldLength = Math.ceil(word.length * (boldPercentage / 100))
      const boldPart = word.substring(0, boldLength)
      const restPart = word.substring(boldLength)
      
      return `<strong>${boldPart}</strong>${restPart}`
    }).join(' ')
  }

  const handlePreview = () => {
    if (!uploadedFile) return
    
    const sampleText = "Dies ist ein Beispieltext, der zeigt, wie Bionic Reading funktioniert. Die ersten Buchstaben jedes Wortes werden fett dargestellt, um das Lesen zu beschleunigen."
    const bionicText = generateBionicText(sampleText, config.boldPercentage)
    setPreviewText(bionicText)
    setShowPreview(true)
  }

  const handleConvert = async () => {
    if (!uploadedFile) return
    
    setIsProcessing(true)
    
    try {
      // Simuliere die Konvertierung
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Erstelle einen Download-Link (in der echten Implementierung würde hier die EPUB-Datei generiert)
      const blob = new Blob(['Simulierte EPUB-Datei'], { type: 'application/epub+zip' })
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
    } catch (error) {
      console.error('Fehler bei der Konvertierung:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const updateConfig = (key: keyof BionicConfig, value: number | string) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Bionic Reading Converter</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Konvertieren Sie EPUB-Dateien in Bionic Reading-Format mit umfangreichen 
          Anpassungsmöglichkeiten für optimale Lesbarkeit.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="h-6 w-6 text-primary-600" />
              EPUB-Datei hochladen
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
                    {isDragActive ? 'Datei hier ablegen' : 'Datei hier ablegen oder klicken'}
                  </p>
                  <p className="text-gray-500">Unterstützt: .epub</p>
                </div>
              )}
            </div>

            {uploadedFile && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handlePreview}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Vorschau
                </button>
                <button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Konvertiere...
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4" />
                      Konvertieren
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Download Section */}
          {downloadUrl && (
            <div className="card bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                <Download className="h-5 w-5" />
                Konvertierung abgeschlossen!
              </h3>
              <a
                href={downloadUrl}
                download="bionic-reading.epub"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                EPUB herunterladen
              </a>
            </div>
          )}
        </div>

        {/* Configuration Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary-600" />
              Bionic Reading Einstellungen
            </h2>

            <div className="space-y-6">
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
                      value={config.boldPercentage}
                      onChange={(e) => updateConfig('boldPercentage', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>20%</span>
                      <span className="font-medium">{config.boldPercentage}%</span>
                      <span>80%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Typografie</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schriftgröße (px)
                    </label>
                    <input
                      type="number"
                      min="12"
                      max="24"
                      value={config.fontSize}
                      onChange={(e) => updateConfig('fontSize', parseInt(e.target.value))}
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
                      value={config.lineHeight}
                      onChange={(e) => updateConfig('lineHeight', parseFloat(e.target.value))}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Spacing Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Abstände</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Absatzabstand (em)
                    </label>
                    <input
                      type="number"
                      min="1.0"
                      max="3.0"
                      step="0.1"
                      value={config.paragraphSpacing}
                      onChange={(e) => updateConfig('paragraphSpacing', parseFloat(e.target.value))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schriftart
                    </label>
                    <select
                      value={config.fontFamily}
                      onChange={(e) => updateConfig('fontFamily', e.target.value)}
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

              {/* Margin Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ränder (px)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Links
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="50"
                      value={config.marginLeft}
                      onChange={(e) => updateConfig('marginLeft', parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rechts
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="50"
                      value={config.marginRight}
                      onChange={(e) => updateConfig('marginRight', parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Oben
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="50"
                      value={config.marginTop}
                      onChange={(e) => updateConfig('marginTop', parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unten
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="50"
                      value={config.marginBottom}
                      onChange={(e) => updateConfig('marginBottom', parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Vorschau</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: previewText }}
                style={{
                  fontSize: `${config.fontSize}px`,
                  lineHeight: config.lineHeight,
                  fontFamily: config.fontFamily,
                  marginLeft: `${config.marginLeft}px`,
                  marginRight: `${config.marginRight}px`,
                  marginTop: `${config.marginTop}px`,
                  marginBottom: `${config.marginBottom}px`
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BionicConverter
