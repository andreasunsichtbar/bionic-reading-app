import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, FileText, Settings, Play, Pause, CheckCircle, AlertCircle } from 'lucide-react'

interface TranslationConfig {
  targetLanguage: string
  translationNotes: string
  chunkSize: number
  preserveFormatting: boolean
  includeOriginal: boolean
}

interface TranslationChunk {
  id: number
  originalText: string
  translatedText: string
  status: 'pending' | 'translating' | 'completed' | 'error'
  error?: string
}

const Translator: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [chunks, setChunks] = useState<TranslationChunk[]>([])
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const [config, setConfig] = useState<TranslationConfig>({
    targetLanguage: 'Deutsch',
    translationNotes: '',
    chunkSize: 1000,
    preserveFormatting: true,
    includeOriginal: false
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0])
      setDownloadUrl(null)
      setChunks([])
      setCurrentChunkIndex(0)
      setProgress(0)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  })

  const splitTextIntoChunks = (text: string, chunkSize: number): string[] => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const chunks: string[] = []
    let currentChunk = ''

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim())
        currentChunk = sentence
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim())
    }

    return chunks
  }

  const simulateOpenAITranslation = async (text: string, notes: string): Promise<string> => {
    // Simuliere OpenAI API-Aufruf
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    // Simuliere Übersetzung (in der echten Implementierung würde hier die OpenAI API aufgerufen)
    const translations = {
      'Hello world': 'Hallo Welt',
      'This is a test': 'Das ist ein Test',
      'The quick brown fox': 'Der schnelle braune Fuchs',
      'jumps over the lazy dog': 'springt über den faulen Hund'
    }
    
    // Simuliere eine realistische Übersetzung
    let translated = text
    Object.entries(translations).forEach(([en, de]) => {
      translated = translated.replace(new RegExp(en, 'gi'), de)
    })
    
    // Füge zufällige deutsche Wörter hinzu
    const germanWords = ['und', 'der', 'die', 'das', 'in', 'zu', 'mit', 'von', 'für', 'auf']
    const words = translated.split(' ')
    if (words.length > 3) {
      const randomIndex = Math.floor(Math.random() * (words.length - 2)) + 1
      words[randomIndex] = germanWords[Math.floor(Math.random() * germanWords.length)]
      translated = words.join(' ')
    }
    
    // Beziehe Hinweise in die Simulation ein (z.B. formell/informell)
    if (notes && notes.toLowerCase().includes('formell')) {
      translated = translated.replace(/du\b/gi, 'Sie')
    }
    if (notes && notes.toLowerCase().includes('locker')) {
      translated = translated.replace(/Sie\b/gi, 'du')
    }
    
    return translated
  }

  const processFile = async () => {
    if (!uploadedFile) return
    
    setIsProcessing(true)
    setProgress(0)
    
    try {
      // Simuliere Datei-Extraktion
      const sampleText = `This is a sample document that demonstrates the translation capabilities of our system. 
      
      The document contains multiple paragraphs and sentences that will be processed in chunks. 
      
      Each chunk will be sent to the OpenAI API for translation, and the results will be combined into a final translated document.
      
      This approach allows us to handle large documents efficiently while maintaining context and formatting.`
      
      const textChunks = splitTextIntoChunks(sampleText, config.chunkSize)
      const translationChunks: TranslationChunk[] = textChunks.map((chunk, index) => ({
        id: index,
        originalText: chunk,
        translatedText: '',
        status: 'pending'
      }))
      
      setChunks(translationChunks)
      setCurrentChunkIndex(0)
      
      // Übersetze Chunks sequenziell
      for (let i = 0; i < translationChunks.length; i++) {
        if (isPaused) {
          setCurrentChunkIndex(i)
          break
        }
        
        setCurrentChunkIndex(i)
        setChunks(prev => prev.map((chunk, index) => 
          index === i ? { ...chunk, status: 'translating' } : chunk
        ))
        
        try {
          const translatedText = await simulateOpenAITranslation(
            translationChunks[i].originalText, 
            config.translationNotes
          )
          
          setChunks(prev => prev.map((chunk, index) => 
            index === i ? { ...chunk, translatedText, status: 'completed' } : chunk
          ))
          
          setProgress(((i + 1) / translationChunks.length) * 100)
        } catch (error) {
          setChunks(prev => prev.map((chunk, index) => 
            index === i ? { ...chunk, status: 'error', error: 'Übersetzungsfehler' } : chunk
          ))
        }
      }
      
      // Erstelle Download-Link
      const allTranslatedText = translationChunks
        .filter(chunk => chunk.status === 'completed')
        .map(chunk => chunk.translatedText)
        .join('\n\n')
      
      const blob = new Blob([allTranslatedText], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      
    } catch (error) {
      console.error('Fehler bei der Verarbeitung:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const updateConfig = (key: keyof TranslationConfig, value: string | number | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Dokument-Übersetzer</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Übersetzen Sie große Dokumente ins Deutsche mit der OpenAI API. 
          Dokumente werden in sinnvolle Einheiten aufgeteilt und sequenziell übersetzt.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="h-6 w-6 text-primary-600" />
              Dokument hochladen
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
                  <p className="text-gray-500">Unterstützt: .txt, .pdf, .doc, .docx</p>
                </div>
              )}
            </div>

            {uploadedFile && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={processFile}
                  disabled={isProcessing}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Übersetze...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Übersetzung starten
                    </>
                  )}
                </button>
                
                {isProcessing && (
                  <button
                    onClick={togglePause}
                    className="btn-secondary flex items-center gap-2"
                  >
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    {isPaused ? 'Fortsetzen' : 'Pausieren'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Progress Section */}
          {isProcessing && chunks.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Übersetzungsfortschritt</h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Fortschritt</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                Chunk {currentChunkIndex + 1} von {chunks.length} wird verarbeitet...
              </div>
            </div>
          )}

          {/* Download Section */}
          {downloadUrl && (
            <div className="card bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Übersetzung abgeschlossen!
              </h3>
              <a
                href={downloadUrl}
                download="translated-document.txt"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Übersetzung herunterladen
              </a>
            </div>
          )}
        </div>

        {/* Configuration Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary-600" />
              Übersetzungseinstellungen
            </h2>

            <div className="space-y-6">
              {/* Basic Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Grundeinstellungen</h3>
                <div className="space-y-4">
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
                      <option value="Italienisch">Italienisch</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chunk-Größe (Zeichen)
                    </label>
                    <input
                      type="number"
                      min="500"
                      max="2000"
                      step="100"
                      value={config.chunkSize}
                      onChange={(e) => updateConfig('chunkSize', parseInt(e.target.value))}
                      className="input-field"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Kleinere Chunks = bessere Übersetzungsqualität, aber langsamer
                    </p>
                  </div>
                </div>
              </div>

              {/* Translation Notes */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Übersetzungshinweise</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spezielle Anweisungen für die Übersetzung
                  </label>
                  <textarea
                    value={config.translationNotes}
                    onChange={(e) => updateConfig('translationNotes', e.target.value)}
                    placeholder="z.B. Fachbegriffe beibehalten, formeller Stil, etc."
                    rows={4}
                    className="input-field resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Diese Hinweise werden bei jeder Übersetzung an die OpenAI API gesendet
                  </p>
                </div>
              </div>

              {/* Advanced Options */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Erweiterte Optionen</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.preserveFormatting}
                      onChange={(e) => updateConfig('preserveFormatting', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Formatierung beibehalten
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.includeOriginal}
                      onChange={(e) => updateConfig('includeOriginal', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Originaltext mit einbeziehen
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chunks Overview */}
      {chunks.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Übersetzungsübersicht</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {chunks.map((chunk) => (
              <div key={chunk.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Chunk {chunk.id + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    {chunk.status === 'pending' && (
                      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    )}
                    {chunk.status === 'translating' && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    )}
                    {chunk.status === 'completed' && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {chunk.status === 'error' && (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Original</p>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {chunk.originalText}
                    </p>
                  </div>
                  
                  {chunk.status === 'completed' && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Übersetzung</p>
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {chunk.translatedText}
                      </p>
                    </div>
                  )}
                  
                  {chunk.status === 'error' && (
                    <div>
                      <p className="text-xs font-medium text-red-500 mb-1">Fehler</p>
                      <p className="text-sm text-red-600">
                        {chunk.error}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Translator
