import MascotPortfolioHero from './components/ui/mascot-portfolio-hero'

function App() {
  return (
    <main className="app-shell">
      <MascotPortfolioHero
        index="08/01"
        discipline="Brand studio"
        tagline="Luxury product experiences"
        collection={['Selected', 'works']}
        reel={['Creative direction', '3D product stories']}
        year="Synvex"
        initials="AI"
        badge="New"
        line2="Digital"
        line3="Presence"
        word="Craft"
        verticalTag="Studio"
        bracketed="X"
        seekingLabel="Open for"
        seeking="Brand / Web"
        href="#contact"
        services={['Strategy', 'Identity', 'Motion', 'Launch']}
        greetings={['Hey, nice to meet you.', 'We build brave digital identities.', 'Ready when you are.']}
        skin="#f0c5a1"
        beanie="#121417"
        shirt="#161a1f"
        tag="#c98d52"
        accent="#a4f7bf"
        paper="#f2efe8"
        ink="#111111"
      />
    </main>
  )
}

export default App
