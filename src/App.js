import React, { useState, useEffect } from 'react';
import { colors } from './colors';
import { PiChampagneThin, PiChurchThin } from "react-icons/pi";
import { CiClock2, CiLocationOn, CiHeart, CiCalendar, CiGift } from "react-icons/ci";

export default function WeddingWebsite() {
  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    email: '',
    attending: '',
    guests: '1',
    dietaryRestrictions: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Si on est tout en haut, toujours afficher le header
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scroll vers le bas - cacher le header
        setIsHeaderVisible(false);
      } else {
        // Scroll vers le haut - afficher le header
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!rsvpForm.name || !rsvpForm.attending) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const scriptUrl = process.env.REACT_APP_GOOGLE_SCRIPT_URL;
      
      if (!scriptUrl || scriptUrl.includes('YOUR_SCRIPT_ID')) {
        throw new Error('L\'URL du script Google n\'est pas configurée. Veuillez configurer la variable REACT_APP_GOOGLE_SCRIPT_URL dans votre fichier .env');
      }
      
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script nécessite no-cors
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rsvpForm)
      });
      
      // Avec mode: 'no-cors', nous ne pouvons pas lire la réponse
      // donc nous supposons que c'est un succès si aucune erreur n'est levée
      setSubmitted(true);
      setRsvpForm({
        name: '',
        email: '',
        attending: '',
        guests: '1',
        dietaryRestrictions: ''
      });
      
      // Réinitialiser après 5 secondes
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
      
    } catch (err) {
      console.error('Erreur lors de l\'envoi:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'envoi de votre réponse. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setRsvpForm({
      ...rsvpForm,
      [e.target.name]: e.target.value
    });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // 80px pour compenser la hauteur du menu
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className={`min-h-screen ${colors.background.main}`}>
      {/* Navigation Menu */}
      <nav 
        className={`fixed top-0 left-0 right-0 ${colors.background.nav} shadow-md transition-transform duration-300`} 
        style={{
          zIndex: 9999,
          transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button onClick={() => scrollToSection('home')} className={`text-2xl font-parisienne ${colors.primary.text} cursor-pointer bg-transparent border-none`}>Léa & Thomas</button>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('home')} className={`font-cormorant ${colors.text.main} ${colors.primary.textHover} transition-colors bg-transparent border-none cursor-pointer`}>Accueil</button>
              <button onClick={() => scrollToSection('story')} className={`font-cormorant ${colors.text.main} ${colors.primary.textHover} transition-colors bg-transparent border-none cursor-pointer`}>Notre Histoire</button>
              <button onClick={() => scrollToSection('details')} className={`font-cormorant ${colors.text.main} ${colors.primary.textHover} transition-colors bg-transparent border-none cursor-pointer`}>Détails</button>
              <button onClick={() => scrollToSection('rsvp')} className={`font-cormorant ${colors.text.main} ${colors.primary.textHover} transition-colors bg-transparent border-none cursor-pointer`}>RSVP</button>
              <button onClick={() => scrollToSection('registry')} className={`font-cormorant ${colors.text.main} ${colors.primary.textHover} transition-colors bg-transparent border-none cursor-pointer`}>Liste</button>
              <button onClick={() => scrollToSection('travel')} className={`font-cormorant ${colors.text.main} ${colors.primary.textHover} transition-colors bg-transparent border-none cursor-pointer`}>Hébergement</button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden ${colors.text.main} focus:outline-none bg-transparent border-none cursor-pointer`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              <button onClick={() => scrollToSection('home')} className={`block w-full text-left ${colors.text.main} ${colors.primary.textHover} transition-colors bg-transparent border-none cursor-pointer`}>Accueil</button>
              <button onClick={() => scrollToSection('story')} className={`block w-full text-left ${colors.text.main} ${colors.primary.textHover} transition-colors bg-transparent border-none cursor-pointer`}>Notre Histoire</button>
              <button onClick={() => scrollToSection('details')} className={`block w-full text-left ${colors.text.main} ${colors.primary.textHover} transition-colors bg-transparent border-none cursor-pointer`}>Détails</button>
              <button onClick={() => scrollToSection('rsvp')} className={`block w-full text-left ${colors.text.main} ${colors.primary.textHover} transition-colors bg-transparent border-none cursor-pointer`}>RSVP</button>
              <button onClick={() => scrollToSection('registry')} className={`block w-full text-left ${colors.text.main} ${colors.primary.textHover} transition-colors bg-transparent border-none cursor-pointer`}>Liste</button>
              <button onClick={() => scrollToSection('travel')} className={`block w-full text-left ${colors.text.main} ${colors.primary.textHover} transition-colors bg-transparent border-none cursor-pointer`}>Hébergement</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{backgroundImage: `url('${process.env.PUBLIC_URL}/images/lagona-rouge.jpg')`}}>
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="text-center z-10 px-4 py-20">
          <CiHeart className={`w-16 h-16 ${colors.text.hero} mx-auto mb-6 animate-pulse drop-shadow-lg`} />
          <h1 className={`text-6xl md:text-8xl font-parisienne ${colors.text.hero} mb-4 drop-shadow-lg`}>Léa & Thomas</h1>
          <p className={`text-2xl md:text-3xl ${colors.text.hero} mb-8 drop-shadow-lg`}>se marient !</p>
          <div className={`flex items-center justify-center gap-4 ${colors.text.hero} drop-shadow-lg`}>
            <CiCalendar className="w-6 h-6" />
            <p className="text-2xl md:text-2xl">27 juin 2026</p>
          </div>
          <div className="mt-8">
            <button onClick={() => scrollToSection('rsvp')} className={`${colors.primary.bg} ${colors.primary.text} px-8 py-3 rounded-full text-2xl ${colors.primary.bgHover} transition-colors inline-block shadow-lg cursor-pointer`}>
              Répondre
            </button>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Colonne gauche - Texte avec titre */}
          <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 flex flex-col justify-center text-center">
            <h2 className={`text-4xl md:text-5xl font-parisienne ${colors.primary.text} mb-8`}>Notre Histoire</h2>
            <p className={`text-xl ${colors.text.main} mb-6 text-justify`}>
            Tout a commencé il y a cinq ans, un soir au théâtre. Au programme : une pièce humoristique sur la vie de couple. Dans la salle, que des duos bien installés dans leur routine amoureuse. Et nous deux, seuls célibataires perdus au milieu de cette assemblée, à rire (un peu gênés) des blagues sur les disputes pour le choix du film du samedi soir.
            </p>
            <p className={`text-xl ${colors.text.main} mb-6 text-justify`}>
            À la sortie, Léa m'a lancé une invitation qui allait tout changer : "Tu veux rencontrer mon chat ?" Et voici comment vous vous retrouvez passager d'une C3, direction le 93. Qui est d'ailleurs plus joli que ce à quoi on peut s'attendre.
            </p>
            <p className={`text-xl ${colors.text.main} mb-6 text-justify`}>
            Ensuite, tout s'est enchaîné à une vitesse folle. Nous avons commencé à nous voir souvent, très souvent même. Puis est venu un appartement à deux, des voyages improvisés, et finalement des valises bouclées pour plusieurs mois en Amérique latine où l'on a appris qu'on pouvait passer 24h/24 ensemble sans se taper dessus. C'était bon signe.
            </p>
            <p className={`text-xl ${colors.text.main} text-justify`}>
            Aujourd'hui, on a décidé de prolonger l'aventure. Et parce qu'on vous aime bien, on voulait vous en faire profiter. Alors enfilez votre plus belle tenue et préparez-vous à célébrer notre amour !
            </p>
          </div>
          
          {/* Colonne droite - Image */}
          <div className="rounded-lg overflow-hidden shadow-lg h-full">
            <img 
              src={`${process.env.PUBLIC_URL}/images/face-a-face.jpg`}
              alt="Léa et Thomas à Come" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section id="details" className={`py-20 px-4 ${colors.background.light}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl md:text-5xl font-parisienne ${colors.primary.text} text-center mb-16`}>Programme</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ceremony */}
            <div className={`${colors.background.card} rounded-lg overflow-hidden shadow-lg`}>
              <img src={`${process.env.PUBLIC_URL}/images/eglise-senechas-site.png`} alt="Eglise de Senechas" className="w-full h-80 object-cover" />
              <div className="p-8">
                <h3 className={`text-3xl font-parisienne ${colors.primary.text} mb-6 flex items-center gap-3`}>
                  <PiChurchThin className="w-6 h-6" />
                  Cérémonie
                </h3>
                <div className={`space-y-4 ${colors.text.main}`}>
                  <div className="flex items-start gap-3">
                    <CiClock2 className={`w-5 h-5 mt-1 ${colors.primary.icon}`} />
                    <div>
                      <p className="font-semibold">15h00</p>
                      <p className="text-lg">Promis, on se dira "Oui" !</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CiLocationOn className={`w-5 h-5 mt-1 ${colors.primary.icon}`} />
                    <div>
                      <p className="font-semibold">Eglise Notre Dame de l'Assomption</p>
                      <p className="text-lg">Place de l'Eglise</p>
                      <p className="text-lg">30450 Senechas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reception */}
            <div className={`${colors.background.card} rounded-lg overflow-hidden shadow-lg`}>
              <img src={`${process.env.PUBLIC_URL}/images/mas-nouveau-site.avif`} alt="Mas Nouveau" className="w-full h-80 object-cover" />
              <div className="p-8">
                <h3 className={`text-3xl font-parisienne ${colors.primary.text} mb-6 flex items-center gap-3`}>
                  <PiChampagneThin className="w-6 h-6" />
                  Réception
                </h3>
                <div className={`space-y-4 ${colors.text.main}`}>
                  <div className="flex items-start gap-3">
                    <CiClock2 className={`w-5 h-5 mt-1 ${colors.primary.icon}`} />
                    <div>
                      <p className="font-semibold">17h00</p>
                      <p className="text-lg">Cocktail, buffet et animations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CiLocationOn className={`w-5 h-5 mt-1 ${colors.primary.icon}`} />
                    <div>
                      <p className="font-semibold">Mas Nouveau</p>
                      <p className="text-lg">Avenue Pierre Olivier</p>
                      <p className="text-lg">30450 Genolhac</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className={`py-20 px-4 bg-gradient-to-br ${colors.background.gradient}`}>
        <div className="max-w-2xl mx-auto">
          <h2 className={`text-4xl md:text-5xl font-parisienne ${colors.primary.text} text-center mb-4`}>Une petite confirmation ?</h2>
          <p className={`text-center text-xl ${colors.text.main} mb-12`}>Merci de répondre avant le 1er mars 2026</p>
          
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            {submitted ? (
              <div className="text-center py-8">
                <CiHeart className={`w-16 h-16 ${colors.primary.icon} mx-auto mb-4`} />
                <h3 className={`text-2xl font-parisienne ${colors.primary.text} mb-2`}>Merci !</h3>
                <p className={`text-xl ${colors.text.main}`}>Nous avons bien reçu votre réponse et avons hâte de célébrer avec vous !</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="text-lg">{error}</p>
                  </div>
                )}
                
                <div>
                  <label className={`block text-lg ${colors.text.main} font-semibold mb-2`}>Vos noms et prénoms *</label>
                  <input
                    type="text"
                    name="name"
                    value={rsvpForm.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-2 border ${colors.border.default} rounded-lg focus:ring-2 ${colors.primary.ring} focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-lg ${colors.text.main} font-semibold mb-2`}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={rsvpForm.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-2 border ${colors.border.default} rounded-lg focus:ring-2 ${colors.primary.ring} focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className={`block text-lg ${colors.text.main} font-semibold mb-2`}>Serez-vous présent(e) ? *</label>
                  <select
                    name="attending"
                    value={rsvpForm.attending}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-2 border ${colors.border.default} rounded-lg focus:ring-2 ${colors.primary.ring} focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    required
                  >
                    <option value="">Veuillez sélectionner</option>
                    <option value="yes">Accepte avec joie</option>
                    <option value="no">Decline avec regret</option>
                  </select>
                </div>

                {rsvpForm.attending === 'yes' && (
                  <>
                    <div>
                      <label className={`block text-lg ${colors.text.main} font-semibold mb-2`}>Nombre d'invités</label>
                      <select
                        name="guests"
                        value={rsvpForm.guests}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={`w-full px-4 py-2 border ${colors.border.default} rounded-lg focus:ring-2 ${colors.primary.ring} focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-lg ${colors.text.main} font-semibold mb-2`}>Restrictions alimentaires</label>
                      <textarea
                        name="dietaryRestrictions"
                        value={rsvpForm.dietaryRestrictions}
                        onChange={handleChange}
                        disabled={isLoading}
                        rows="3"
                        className={`w-full px-4 py-2 border ${colors.border.default} rounded-lg focus:ring-2 ${colors.primary.ring} focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                        placeholder="Merci de nous indiquer vos allergies ou restrictions alimentaires"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${colors.primary.bg} ${colors.primary.text} py-3 rounded-lg text-2xl font-semibold ${colors.primary.bgHover} transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer la réponse'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Registry */}
      <section id="registry" className={`py-20 px-4 ${colors.background.light}`}>
        <div className="max-w-4xl mx-auto text-center">
          <CiGift className={`w-12 h-12 ${colors.primary.icon} mx-auto mb-6`} />
          <h2 className={`text-4xl md:text-5xl font-parisienne ${colors.primary.text} mb-6`}>Liste de Mariage</h2>
          <p className={`text-xl ${colors.text.main} mb-8`}>
            Votre présence à notre mariage est le plus beau des cadeaux. Cependant, si vous souhaitez nous honorer d'un cadeau, vous pouvez consulter notre liste de mariage :
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://www.millemercismariage.com/leathomastrompette/liste.html" target="_blank" rel="noopener noreferrer" className={`${colors.primary.bg} ${colors.primary.text} px-8 py-3 rounded-lg ${colors.primary.bgHover} transition-colors`}>
              Notre liste de mariage
            </a>
          </div>
        </div>
      </section>

      {/* Travel & Accommodations */}
      <section id="travel" className={`py-20 px-4 ${colors.background.card}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-4xl md:text-5xl font-parisienne ${colors.primary.text} text-center mb-12`}>Hébergement & Transport</h2>
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h3 className={`text-3xl font-parisienne ${colors.primary.text} mb-4`}>Où dormir ?</h3>
            <div className="space-y-4 mb-8">
              <p className={`text-xl ${colors.text.main}`}>Nous sommes actuellement en train de recenser les hôtels disponibles à proximité du lieu de la cérémonie. N'hésitez pas à nous contacter si vous souhaitez déjà réserver votre chambre.</p>
            </div>
            
            <h3 className={`text-3xl font-parisienne ${colors.primary.text} mb-4`}>Comment s'y rendre ?</h3>
            <p className={`text-xl ${colors.text.main}`}>
              Si vous ne disposez pas d'un véhicule, il est possible de se rendre à Genolhac par le train, 1h20 depuis Nîmes.
            </p>
            <p className={`text-xl ${colors.text.main}`}>
              Il faudra cependant s'organiser pour se rendre au lieu de la cérémonie. N'hésitez pas à nous contacter si vous souhaitez de l'aide pour trouver un covoiturage.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${colors.footer.bg} ${colors.text.white} py-12 px-4 text-center`}>
        <CiHeart className="w-8 h-8 mx-auto mb-4" />
        <p className="text-2xl font-parisienne mb-2">Léa & Thomas</p>
        <p className={`text-xl ${colors.text.light}`}>27 juin 2026</p>
        <p className="text-linen-200 text-xl mt-4">Nous avons hâte de célébrer avec vous !</p>
      </footer>
    </div>
  );
}