import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Languages, FileText, Zap, Download, Settings } from 'lucide-react'

const Home: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Bionic Reading Converter',
      description: 'Konvertieren Sie EPUB-Dateien in Bionic Reading-Format mit umfangreichen Konfigurationsmöglichkeiten.',
      href: '/bionic-converter',
      color: 'bg-blue-500'
    },
    {
      icon: Languages,
      title: 'Dokument-Übersetzer',
      description: 'Übersetzen Sie große Dokumente ins Deutsche mit der OpenAI API und benutzerdefinierten Übersetzungshinweisen.',
      href: '/translator',
      color: 'bg-green-500'
    },
    {
      icon: FileText,
      title: 'PDF-Verarbeiter',
      description: 'Laden Sie PDF-Dateien hoch, übersetzen Sie sie optional und konvertieren Sie sie in Bionic Reading EPUBs.',
      href: '/pdf-processor',
      color: 'bg-purple-500'
    }
  ]

  const benefits = [
    {
      icon: Zap,
      title: 'Schnelleres Lesen',
      description: 'Bionic Reading hilft dabei, Texte schneller zu erfassen und zu verstehen.'
    },
    {
      icon: Download,
      title: 'Einfacher Export',
      description: 'Exportieren Sie Ihre verarbeiteten Dokumente als EPUB für alle gängigen E-Reader.'
    },
    {
      icon: Settings,
      title: 'Flexible Konfiguration',
      description: 'Passen Sie Schriftarten, Abstände und Bionic Reading-Parameter nach Ihren Wünschen an.'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Willkommen bei{' '}
          <span className="text-primary-600">Bionic Reading</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Eine umfassende Plattform für Bionic Reading, Übersetzungen und Dokumentenverarbeitung. 
          Optimieren Sie Ihre Lesegeschwindigkeit und übersetzen Sie Dokumente mit KI-Unterstützung.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/bionic-converter" className="btn-primary text-lg px-8 py-3">
            Jetzt starten
          </Link>
          <Link to="/pdf-processor" className="btn-secondary text-lg px-8 py-3">
            PDF hochladen
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link
              key={feature.title}
              to={feature.href}
              className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </Link>
          )
        })}
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Warum Bionic Reading?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div key={benefit.title} className="text-center space-y-4">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Bereit für besseres Lesen?
        </h2>
        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Laden Sie Ihre ersten Dokumente hoch und erleben Sie den Unterschied, 
          den Bionic Reading für Ihre Lesegeschwindigkeit machen kann.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/bionic-converter" className="bg-white text-primary-700 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
            EPUB konvertieren
          </Link>
          <Link to="/pdf-processor" className="border-2 border-white text-white hover:bg-white hover:text-primary-700 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
            PDF verarbeiten
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
