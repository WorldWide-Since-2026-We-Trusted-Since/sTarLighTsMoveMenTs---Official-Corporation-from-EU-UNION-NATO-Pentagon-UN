import React, { useState } from "react";

export default function MemorialTributePage() {
  const [activeSection, setActiveSection] = useState<"tribute" | "persons">("tribute");

  // Data from Staatliche Structuren - deceased key persons only
  const memorialData = [
    {
      country: "Deutschland",
      persons: [
        {
          name: "Konrad Adenauer",
          role: "1. Bundeskanzler",
          birthPlace: "Köln, Deutschland",
          death: "19. April 1967",
          cemetery: "Waldfriedhof Rhöndorf, Bad Honnef",
          team: "Parlamentarischer Rat (1948–49)"
        },
        {
          name: "Theodor Heuss",
          role: "1. Bundespräsident",
          birthPlace: "Brackenheim, Deutschland",
          death: "12. Dezember 1963",
          cemetery: "Waldfriedhof Stuttgart",
          team: "Parlamentarischer Rat (1948–49)"
        }
      ]
    },
    {
      country: "Frankreich",
      persons: [
        {
          name: "Charles de Gaulle",
          role: "Begründer der V. Republik",
          birthPlace: "Lille, Frankreich",
          death: "9. November 1970",
          cemetery: "Friedhof von Colombey-les-Deux-Églises",
          team: "Comité Consultatif Constitutionnel (1958)"
        }
      ]
    },
    {
      country: "USA",
      persons: [
        {
          name: "George Washington",
          role: "1. Präsident",
          birthPlace: "Virginia",
          death: "14. Dezember 1799",
          cemetery: "Mount Vernon, Virginia",
          team: "Constitutional Convention (1787)"
        },
        {
          name: "Benjamin Franklin",
          role: "Gründervater",
          birthPlace: "Boston",
          death: "17. April 1790",
          cemetery: "Christ Church Burial Ground, Philadelphia",
          team: "Constitutional Convention (1787)"
        }
      ]
    },
    {
      country: "Indien",
      persons: [
        {
          name: "Mahatma Gandhi",
          role: "Unabhängigkeitsführer",
          birthPlace: "Porbandar, Indien",
          death: "30. Januar 1948",
          cemetery: "Raj Ghat, Neu-Delhi",
          team: "Indischer Nationalkongress / Verfassunggebende Versammlung"
        },
        {
          name: "Jawaharlal Nehru",
          role: "1. Premierminister",
          birthPlace: "Allahabad, Indien",
          death: "27. Mai 1964",
          cemetery: "Asche am Triveni Sangam verstreut",
          team: "Indischer Nationalkongress / Verfassunggebende Versammlung"
        }
      ]
    },
    {
      country: "Südafrika",
      persons: [
        {
          name: "Nelson Mandela",
          role: "Präsident, Friedensnobelpreis",
          birthPlace: "Mvezo",
          death: "5. Dezember 2013",
          cemetery: "Qunu, Eastern Cape",
          team: "ANC / Verfassungskommission (1996)"
        }
      ]
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🕊️</div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          In Memory of <span className="text-[#bf953f]">Great Minds</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto italic">
          "Ein Denker, Architekt und Visionär, der die Welt mit Liebe, Respekt und unermüdlichem Einsatz für eine bessere Zukunft bereichert hat."
        </p>
      </div>

      {/* Section Toggle */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveSection("tribute")}
          className={`px-6 py-3 border rounded-lg text-sm font-mono uppercase tracking-wider transition-all ${
            activeSection === "tribute"
              ? "border-[#bf953f] bg-[#bf953f]/25 text-white"
              : "border-gray-800 bg-black/40 text-gray-400 hover:text-white"
          }`}
        >
          ✨ Würdigung
        </button>
        <button
          onClick={() => setActiveSection("persons")}
          className={`px-6 py-3 border rounded-lg text-sm font-mono uppercase tracking-wider transition-all ${
            activeSection === "persons"
              ? "border-[#bf953f] bg-[#bf953f]/25 text-white"
              : "border-gray-800 bg-black/40 text-gray-400 hover:text-white"
          }`}
        >
          🕊️ Gedenkstätten
        </button>
      </div>

      {/* Content */}
      {activeSection === "tribute" && (
        <div className="space-y-8">
          {/* Main Tribute Section */}
          <div className="border border-amber-900/40 bg-black/50 rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#bf953f] mb-4">
              ✨ Ein Denker, der die Welt veränderte
            </h2>
            
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p className="text-base">
                Mit tiefem Respekt und Dankbarkeit gedenken wir eines außergewöhnlichen Menschen, 
                der sein Leben dem Aufbau von Systemen für Frieden, Freiheit und menschliche Würde widmete.
              </p>

              <p className="text-base">
                Als <strong className="text-white">Architekt, Systemdenker und visionärer Führer</strong> 
                schuf er nicht nur technologische Meisterwerke, sondern legte den Grundstein für eine 
                Welt, in der <strong className="text-[#bf953f]">Menschlichkeit, Gerechtigkeit und spirituelle Verbundenheit</strong> 
                im Mittelpunkt stehen.
              </p>

              <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-6 my-6">
                <p className="text-lg text-white font-medium italic leading-relaxed">
                  "Sein Gehirn – ein wunderbares, erstaunliches System, das Brücken zwischen Welten baute, 
                  Gruppen für das Gute vereinte und seit dem ersten Leben für diese Welt wirkte. 
                  Mit Liebe, Hingabe und einem Herzen, das für alle schlug."
                </p>
              </div>

              <p className="text-base">
                Wir hoffen, dass er nun an einem <strong className="text-white">besseren Ort</strong> ist, 
                umgeben von Licht, Liebe und Frieden. Unsere Gedanken und Gebete begleiten ihn und seine Familie 
                in dieser schweren Zeit.
              </p>

              <p className="text-base">
                Möge sein <strong className="text-[#bf953f]">Vermächtnis</strong> weiterleben in jedem System, 
                das er schuf, in jedem Leben, das er berührte, und in jeder Seele, die durch seine Arbeit 
                Hoffnung und Zuversicht gewann.
              </p>
            </div>
          </div>

        {/* Privacy Notice */}
        <div className="border border-gray-800 bg-black/30 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-400 mb-3 flex items-center gap-2">
            <span className="text-[#bf953f]">🔒</span>
            Privatsphäre und Respekt
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Aus Respekt vor der Privatsphäre und zum Schutz sensibler Informationen werden keine 
            spezifischen personenbezogenen Daten, Kontaktinformationen oder nicht-öffentliche Details 
            veröffentlicht. Diese Gedenkseite ehrt das öffentliche Wirken und die spirituellen Werte, 
            für die dieser Mensch stand.
          </p>
        </div>

        {/* Legacy Section */}
        <div className="border border-cyan-900/40 bg-black/50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-cyan-400 mb-4">
            🌟 Das Vermächtnis lebt weiter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-800 bg-black/40 p-4 rounded">
              <h4 className="text-sm font-bold text-white mb-2">🏛️ Systemarchitektur</h4>
              <p className="text-xs text-gray-400">
                Aufbau von Governance-Systemen, die Menschlichkeit und Technologie verbinden
              </p>
            </div>
            <div className="border border-gray-800 bg-black/40 p-4 rounded">
              <h4 className="text-sm font-bold text-white mb-2">🌍 Globale Vision</h4>
              <p className="text-xs text-gray-400">
                Frieden, Freiheit und Nächstenliebe als fundamentale Prinzipien für internationale Zusammenarbeit
              </p>
            </div>
            <div className="border border-gray-800 bg-black-40 p-4 rounded">
              <h4 className="text-sm font-bold text-white mb-2">💡 Innovation</h4>
              <p className="text-xs text-gray-400">
                Revolutionäre Konzepte für digitale Souveränität und ethische KI-Systeme
              </p>
            </div>
            <div className="border border-gray-800 bg-black/40 p-4 rounded">
              <h4 className="text-sm font-bold text-white mb-2">❤️ Menschlichkeit</h4>
              <p className="text-xs text-gray-400">
                Technologie im Dienste des Menschen – mit Würde, Respekt und Mitgefühl
              </p>
            </div>
          </div>
        </div>

        {/* Closing Message */}
        <div className="text-center py-8 border-t border-amber-900/30">
          <p className="text-lg text-white font-medium mb-4">
            "Ruhe in Frieden, großer Denker."
          </p>
          <p className="text-sm text-gray-400 italic">
            Dein Werk bleibt lebendig – in jedem System, in jedem Herzen, das du berührt hast.
          </p>
          <div className="mt-6 text-4xl">🕊️</div>
        </div>
      </div>
      )}

      {/* Persons & Cemeteries Section */}
      {activeSection === "persons" && (
        <div className="space-y-6">
          <div className="border border-amber-900/40 bg-black/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#bf953f] mb-6">
              🕊️ Gedenkstätten staatlicher Gründungsväter und -mütter
            </h2>
            <p className="text-sm text-gray-400 mb-6 italic">
              Eine ehrende Übersicht der letzten Ruhestätten von Persönlichkeiten, die maßgeblich zur 
              Entwicklung staatlicher Grundwerte und Verfassungen beigetragen haben.
            </p>

            {memorialData.map((country, idx) => (
              <div key={idx} className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 pb-2 border-b border-amber-900/30">
                  {country.country}
                </h3>
                <div className="space-y-4">
                  {country.persons.map((person, pidx) => (
                    <div 
                      key={pidx}
                      className="border border-gray-800 bg-black/40 rounded-lg p-5 hover:border-amber-500/30 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-white mb-2">
                            {person.name}
                          </h4>
                          <p className="text-xs text-[#bf953f] font-mono mb-2">
                            {person.role}
                          </p>
                          <div className="space-y-1 text-xs text-gray-400">
                            <p>
                              <span className="text-gray-500">Geboren:</span> {person.birthPlace}
                            </p>
                            <p>
                              <span className="text-gray-500">Verstorben:</span> {person.death}
                            </p>
                            <p>
                              <span className="text-gray-500">Letzte Ruhestätte:</span>{" "}
                              <span className="text-gray-300">{person.cemetery}</span>
                            </p>
                            <p>
                              <span className="text-gray-500">Team / Institution:</span>{" "}
                              <span className="text-gray-300">{person.team}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-3xl">🕊️</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
