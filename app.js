const WORLD = {
  width: 2900,
  height: 4500,
  nodeWidth: 194,
  nodeHeight: 104,
  minZoom: 0.05,
  maxZoom: 5
};

const STORAGE_KEY = "atlante-evolutivo-state";
const STORAGE_VERSION = 18;
const LANE_START_Y = 130;
const LANE_STEP_Y = 180;

const axisSteps = [
  { key: "ai", x: 480, label: "IA e generazione" },
  { key: "digital", x: 800, label: "digitale, rete, piattaforme" },
  { key: "electronic", x: 1120, label: "elettronica e mass media" },
  { key: "industrial", x: 1380, label: "industria, elettricita, distanza" },
  { key: "print", x: 1680, label: "stampa, meccanica, archivi" },
  { key: "written", x: 2080, label: "scrittura, simboli, istituzioni" },
  { key: "oral", x: 2600, label: "corpo, oralita, esperienza diretta" }
];

const timeMarkers = axisSteps.map((step) => ({
  x: step.x,
  label: step.label
}));

function c(title, notes, icon) {
  return { title, notes, icon };
}

const laneRows = [
  {
    id: "comm-body",
    label: "Comunicazione corporea e orale",
    color: "#0f8b8d",
    icon: "speech",
    cells: [
      c("Assistenti vocali e avatar", "Voce sintetica, traduzione simultanea e conversazioni generate.", "ai"),
      c("Videochiamate, meme e vocali", "La presenza corporea diventa frammento condiviso in rete.", "video"),
      c("Radio, registrazioni e TV", "La voce pubblica entra negli spazi domestici.", "radio"),
      c("Telefono e amplificazione", "La voce viaggia a distanza e cambia il ritmo delle relazioni.", "phone"),
      c("Retorica e teatro scritto", "Gesti, formule e performance vengono codificati.", "theater"),
      c("Rituali, formule, oratoria", "La parola diventa memoria sociale e autorita.", "speech"),
      c("Gesti, postura, racconto orale", "Comunicazione faccia a faccia, imitazione, canto, racconto.", "speech")
    ]
  },
  {
    id: "comm-distance",
    label: "Comunicazione interpersonale a distanza",
    color: "#0f8b8d",
    icon: "mail",
    cells: [
      c("Agenti personali e risposte automatiche", "Messaggi suggeriti, recap, assistenti che scrivono al posto nostro.", "ai"),
      c("Email, SMS, chat e WhatsApp", "Comunicazione continua, notifiche, gruppi, presenza permanente.", "chat"),
      c("Fax, segreteria, primi cellulari", "La comunicazione personale accelera ma resta asincrona.", "phone"),
      c("Telegrafo, telefono, cartoline", "La distanza viene accorciata da reti tecniche.", "phone"),
      c("Posta moderna e giornali personali", "Scambi regolari, alfabetizzazione e identita epistolare.", "mail"),
      c("Lettere, tavolette, sigilli", "Il messaggio personale diventa oggetto trasportabile.", "mail"),
      c("Messaggeri, segnali, tamburi", "La distanza richiede corpo, tempo, memoria e fiducia.", "mail")
    ]
  },
  {
    id: "comm-public",
    label: "Comunicazione pubblica e di massa",
    color: "#0f8b8d",
    icon: "public",
    cells: [
      c("Contenuti sintetici e microtargeting", "Avatar, deepfake, campagne personalizzate e informazione automatica.", "ai"),
      c("Social, streaming, piattaforme", "Ogni utente puo pubblicare, rilanciare, monetizzare.", "social"),
      c("TV commerciale e pubblicita", "Audience di massa, palinsesto, spot, celebrita.", "tv"),
      c("Radio, cinema, propaganda", "Le masse vengono sincronizzate da media elettrici.", "radio"),
      c("Manifesti, stampa periodica", "Opinione pubblica, quotidiani, periodici e alfabetizzazione.", "newspaper"),
      c("Editti, iscrizioni, proclami", "Il potere scrive nello spazio pubblico.", "law"),
      c("Piazza, araldo, cantastorie", "La comunita ascolta insieme nello stesso luogo.", "speech")
    ]
  },
  {
    id: "write-doc",
    label: "Scrittura informativa e documentale",
    color: "#6f7d2a",
    icon: "pen",
    cells: [
      c("Classificazione e sintesi automatica", "IA per verbali, report, riassunti, traduzioni e ricerca nei documenti.", "ai"),
      c("Wiki, cloud, documenti collaborativi", "Documenti vivi, versioni, link e lavoro condiviso.", "cloud"),
      c("Database, fotocopie, modulistica digitale", "L'ufficio diventa informazione riproducibile e interrogabile.", "computer"),
      c("Dattilografia e archivi d'ufficio", "Burocrazia industriale, moduli, fascicoli e standard.", "pen"),
      c("Giornali, registri, stampa amministrativa", "La stampa aumenta tracciabilita e circolazione dei fatti.", "newspaper"),
      c("Leggi, contratti, catasti, conti", "La scrittura stabilizza obblighi, proprieta e memoria istituzionale.", "law"),
      c("Memoria orale, nodi, conteggi", "Informazione conservata in corpo, oggetti e rituali.", "book")
    ]
  },
  {
    id: "literature",
    label: "Letteratura, poesia e prosa",
    color: "#6f7d2a",
    icon: "book",
    cells: [
      c("Scrittura assistita e stili sintetici", "IA generativa, imitazione di generi, autorialita distribuita.", "ai"),
      c("Ebook, fanfiction, blog narrativi", "Lettura connessa, comunita interpretative e pubblicazione continua.", "book"),
      c("Sceneggiature, radio e TV drama", "La narrazione letteraria migra tra media audiovisivi.", "tv"),
      c("Feuilleton, riviste, bestseller", "Serialita, mercato editoriale e pubblico di massa.", "newspaper"),
      c("Romanzo moderno ed editoria", "Autore, editore, pubblico e canone diventano sistema.", "book"),
      c("Poemi, teatro, testi sacri", "Scrittura, recitazione e conservazione dei racconti fondativi.", "theater"),
      c("Miti, epica, canti orali", "Storie trasmesse da voce, memoria e performance.", "speech")
    ]
  },
  {
    id: "image",
    label: "Immagine fissa e arti visive",
    color: "#7c6f2a",
    icon: "camera",
    cells: [
      c("Generare la realta", "Suno, Veo, Sora e immagini sintetiche spostano il confine dell'autore.", "ai"),
      c("Condividere la realta", "Web, Instagram, TikTok e archivi visivi permanenti.", "social"),
      c("Digitalizzare la realta", "Fotocamere digitali, computer grafica, fotoritocco.", "camera"),
      c("Registrare la realta", "Audio e video magnetici, documentazione audiovisiva.", "film"),
      c("Riprodurre la realta", "Pellicola, stampa, cinema e copie tecniche.", "print"),
      c("Catturare la realta", "Dagherrotipo, fotografia pionieristica e sguardo meccanico.", "camera"),
      c("Simbolizzare la realta", "Disegno, pittura, icone, mappe e rappresentazione manuale.", "paint")
    ]
  },
  {
    id: "sound",
    label: "Suono, voce, rumore e musica",
    color: "#b56576",
    icon: "music",
    cells: [
      c("Musica generativa", "Modelli come Suno generano brani, voci e arrangiamenti.", "ai"),
      c("Streaming, playlist, remix social", "Ascolto personalizzato, piattaforme e circolazione virale.", "music"),
      c("CD, MP3, campionatori", "Il suono diventa file, copia, loop e database.", "music"),
      c("Radio, vinile, nastro magnetico", "Registrazione elettrica, broadcast e industria musicale.", "radio"),
      c("Partiture stampate e liuteria seriale", "Circolazione di repertori, strumenti e standard.", "print"),
      c("Notazione musicale", "Il suono viene fissato in simboli riproducibili.", "pen"),
      c("Canto, ritmo, strumenti acustici", "Musica come rito, lavoro, festa, memoria.", "music")
    ]
  },
  {
    id: "audiovisual",
    label: "Audiovisivo: cinema, TV e video",
    color: "#b56576",
    icon: "film",
    cells: [
      c("Video generativo e realta sintetiche", "Sora, Veo, avatar, doppiaggio automatico, scene non filmate.", "ai"),
      c("YouTube, TikTok, streaming", "Produzione distribuita, creator economy, video breve.", "video"),
      c("Videocamere digitali e montaggio software", "Produzione economica, desktop video, effetti.", "video"),
      c("TV, VHS, satellite", "Palinsesto domestico, registrazione, audience globale.", "tv"),
      c("Cinema sonoro e industria", "Sale, generi, star system, montaggio industriale.", "film"),
      c("Lanterna magica, fotografia sequenziale", "Preistoria tecnica dell'immagine in movimento.", "film"),
      c("Teatro, ombre, racconto performativo", "Corpi, scena, narrazione e spettatori presenti.", "theater")
    ]
  },
  {
    id: "education",
    label: "Educazione e apprendimento",
    color: "#1f8a70",
    icon: "book",
    cells: [
      c("Tutor IA e apprendimento adattivo", "Percorsi personalizzati, feedback immediato, simulazioni.", "ai"),
      c("MOOC, e-learning, tutorial", "Apprendere da piattaforme, video e comunita online.", "cloud"),
      c("Computer in aula e LIM", "Didattica multimediale, software, primi ambienti digitali.", "computer"),
      c("Scuola di massa e laboratori", "Istruzione obbligatoria, tecniche, formazione professionale.", "school"),
      c("Manuali stampati e enciclopedie", "Standardizzazione dei programmi e accesso ai testi.", "book"),
      c("Scuole, accademie, universita", "Istituzioni stabili per trasmettere saperi specialistici.", "school"),
      c("Apprendistato e imitazione", "Si impara osservando, facendo, ripetendo.", "people")
    ]
  },
  {
    id: "research",
    label: "Ricerca e produzione di conoscenza",
    color: "#1f8a70",
    icon: "search",
    cells: [
      c("Scoperta assistita da IA", "Modelli, simulazioni e generazione di ipotesi.", "ai"),
      c("Open science, motori, preprint", "Ricerca indicizzata, collaborativa e accelerata.", "search"),
      c("Banche dati e calcolo scientifico", "Dataset, modelli numerici, laboratori informatizzati.", "computer"),
      c("Laboratori industriali", "Ricerca organizzata, brevetti, grandi strumenti.", "factory"),
      c("Riviste scientifiche e accademie", "Peer review, comunita disciplinari, biblioteche.", "newspaper"),
      c("Metodo scritto e classificazioni", "Osservazioni, tavole, trattati, tassonomie.", "pen"),
      c("Osservazione, prova, tradizione", "Conoscenza pratica, orale, incorporata nei mestieri.", "search")
    ]
  },
  {
    id: "memory",
    label: "Memoria, archivi e supporti",
    color: "#1f8a70",
    icon: "book",
    cells: [
      c("Memorie sintetiche e archivi interrogabili", "IA che cerca, riassume, connette e ricostruisce tracce.", "ai"),
      c("Cloud, backup, social memory", "Archivi personali e collettivi sempre connessi.", "cloud"),
      c("Hard disk, database, CD/DVD", "Memoria digitale locale e indicizzabile.", "computer"),
      c("Nastro, microfilm, archivi industriali", "Conservazione tecnica e amministrativa su larga scala.", "film"),
      c("Biblioteche e stampa", "Depositi, cataloghi, riproduzione e conservazione del sapere.", "book"),
      c("Tavolette, codici, pergamene", "Supporti durevoli per legge, religione e amministrazione.", "book"),
      c("Corpo, oggetti, monumenti", "Memoria in rituali, luoghi, cicatrici, tombe, racconti.", "museum")
    ]
  },
  {
    id: "calculation",
    label: "Calcolo e informazione",
    color: "#1f8a70",
    icon: "chart",
    cells: [
      c("Modelli predittivi e decisioni automatiche", "Dati, machine learning, scoring e ottimizzazione.", "ai"),
      c("Internet, cloud, big data", "Informazione distribuita, ricerca e infrastrutture globali.", "cloud"),
      c("Personal computer e reti", "Calcolo domestico, fogli elettronici, basi dati.", "computer"),
      c("Macchine elettromeccaniche", "Tabulatrici, telecomunicazioni, contabilita industriale.", "grid"),
      c("Logaritmi, stampa di tavole", "Calcolo normalizzato, manuali, strumenti scientifici.", "chart"),
      c("Abaco, numerazione, algebra", "Simboli e procedure separano il calcolo dal corpo.", "chart"),
      c("Conteggio manuale e misure", "Dita, tacche, pietre, orientamento pratico.", "hand")
    ]
  },
  {
    id: "programming",
    label: "Programmazione e controllo",
    color: "#1f8a70",
    icon: "grid",
    cells: [
      c("Agentic AI e automazione autonoma", "Sistemi che pianificano, scrivono codice, eseguono task.", "ai"),
      c("App, API, piattaforme software", "Controllo mediato da software, servizi, interfacce.", "software"),
      c("Microprocessori e robotica", "Controllori, PLC, robot industriali e sensori.", "robot"),
      c("Automazione industriale", "Catene di montaggio, feedback, macchine coordinate.", "factory"),
      c("Telai Jacquard e schede perforate", "Istruzioni discrete guidano macchine ripetitive.", "grid"),
      c("Regole, algoritmi, procedure scritte", "Sequenze formali per amministrare e produrre.", "pen"),
      c("Abilita incorporata e sequenze rituali", "Tecniche ripetute nel corpo e nel mestiere.", "hand")
    ]
  },
  {
    id: "energy",
    label: "Energia",
    color: "#d62828",
    icon: "grid",
    cells: [
      c("Reti intelligenti e fusione sperimentale", "Ottimizzazione, accumulo, mix energetico e ricerca avanzata.", "ai"),
      c("Rinnovabili, batterie, smart grid", "Energia distribuita, elettrico, gestione algoritmica.", "grid"),
      c("Nucleare, gas, petrolio globale", "Grandi reti e geopolitica dell'energia.", "factory"),
      c("Carbone, vapore, elettricita", "Industria, fabbrica, illuminazione e motori.", "factory"),
      c("Mulini e macchine idrauliche", "Acqua e vento muovono produzione e trasporti.", "grid"),
      c("Animali, vela, metallurgia", "Forza biologica, fuoco controllato, tecniche dei materiali.", "fire"),
      c("Fuoco, corpo, biomassa", "Energia muscolare, legna, calore, cucina, riparo.", "fire")
    ]
  },
  {
    id: "economy",
    label: "Economia, moneta e finanza",
    color: "#d1495b",
    icon: "coin",
    cells: [
      c("Bitcoin, DeFi e smart contract", "Criptoasset, token, automazione contrattuale, finanza programmabile.", "bitcoin"),
      c("Moneta elettronica e trading online", "Pagamenti digitali, home banking, piattaforme finanziarie.", "card"),
      c("Carte, bancomat, mercati globali", "Credito elettronico, Borse interconnesse, derivati.", "card"),
      c("Borse moderne e obbligazioni industriali", "Azioni, debito pubblico, banche centrali, capitalismo industriale.", "chart"),
      c("Banconote, cambiali, contabilita stampata", "Credito, banche, registri e circolazione finanziaria.", "coin"),
      c("Moneta metallica e contratti", "Prezzi, tasse, debiti, mercati urbani.", "coin"),
      c("Baratto, dono, reciprocita", "Scambio incorporato in fiducia, parentela e obblighi sociali.", "hand")
    ]
  },
  {
    id: "labor",
    label: "Lavoro e produzione",
    color: "#d1495b",
    icon: "factory",
    cells: [
      c("Robot collaborativi e lavoro aumentato", "IA, automazione, decisioni assistite, piattaforme di lavoro.", "robot"),
      c("Gig economy e software gestionale", "App, logistica, marketplace, lavoro tracciato dai dati.", "software"),
      c("Office automation e CAD/CAM", "Computer, progettazione digitale, produttivita d'ufficio.", "computer"),
      c("Fabbrica fordista e macchine utensili", "Catena di montaggio, standard, disciplina industriale.", "factory"),
      c("Manifattura, botteghe, protoindustria", "Divisione del lavoro e strumenti meccanici.", "factory"),
      c("Corporazioni, mestieri, agricoltura organizzata", "Saperi artigiani, norme, gerarchie.", "hand"),
      c("Caccia, raccolta, coltivazione manuale", "Produzione legata a corpo, stagione e territorio.", "hand")
    ]
  },
  {
    id: "transport",
    label: "Mobilita e trasporti",
    color: "#168aad",
    icon: "car",
    cells: [
      c("Veicoli autonomi e mobilita predittiva", "Guida autonoma, routing algoritmico, droni logistici.", "robot"),
      c("GPS, sharing, app di mobilita", "Navigazione, piattaforme, consegne, mobilita on demand.", "gps"),
      c("Aerei, container, alta velocita", "Reti globali, logistica e turismo di massa.", "plane"),
      c("Ferrovia, automobile, nave a vapore", "Velocita industriale, citta, commercio e pendolarismo.", "car"),
      c("Posta, carrozze, navigazione stampata", "Mappe, orari, strade e coordinamento territoriale.", "map"),
      c("Ruota, vela, strade imperiali", "Infrastrutture stabili e controllo dello spazio.", "map"),
      c("Cammino, canoe, animali", "Mobilita lenta, orientamento locale, prossimita.", "hand")
    ]
  },
  {
    id: "health",
    label: "Salute e medicina",
    color: "#2a9d8f",
    icon: "health",
    cells: [
      c("Diagnosi assistita e medicina personalizzata", "IA clinica, genomica, simulazioni, triage automatico.", "ai"),
      c("Telemedicina e fascicolo sanitario", "Cura connessa, dati, prenotazioni e monitoraggio remoto.", "cloud"),
      c("Imaging, farmaci moderni, ICU", "Risonanza, TAC, terapie intensive e industria farmaceutica.", "health"),
      c("Vaccini, anestesia, igiene pubblica", "Medicina scientifica, ospedali moderni, statistica sanitaria.", "health"),
      c("Stampa medica e anatomia", "Manuali, tavole, universita, dissezione regolata.", "book"),
      c("Ospedali, erboristeria, teoria umorale", "Cura istituzionale, testi medici, tradizioni terapeutiche.", "health"),
      c("Sciamani, piante, cura comunitaria", "Guarigione rituale, esperienza empirica, assistenza reciproca.", "people")
    ]
  },
  {
    id: "wellbeing",
    label: "Benessere e cura di se",
    color: "#2a9d8f",
    icon: "watch",
    cells: [
      c("Coach IA e biofeedback", "Consigli automatici, salute mentale digitale, routine adattive.", "ai"),
      c("Wearable, app wellness, mindfulness online", "Monitoraggio di sonno, passi, umore e performance.", "watch"),
      c("Fitness mediatico e autoaiuto", "Programmi TV, palestre, diete, psicologia divulgativa.", "tv"),
      c("Sport moderno e tempo libero", "Disciplina del corpo, vacanza, igiene, consumo del benessere.", "sport"),
      c("Manuali di buone maniere e igiene", "Il corpo viene regolato da norme stampate.", "book"),
      c("Bagni, terme, pratiche religiose", "Cura del corpo intrecciata a status, fede e comunita.", "museum"),
      c("Riti, riposo, alimentazione locale", "Benessere come equilibrio pratico con ambiente e gruppo.", "people")
    ]
  },
  {
    id: "play",
    label: "Gioco e intrattenimento",
    color: "#8b5cf6",
    icon: "gamepad",
    cells: [
      c("Mondi generativi e NPC intelligenti", "Giochi adattivi, contenuti generati, esperienze immersive.", "ai"),
      c("Videogiochi online e streaming", "Community, e-sport, piattaforme, economie virtuali.", "gamepad"),
      c("Console, arcade, giochi elettronici", "Interazione audiovisiva e consumo domestico.", "gamepad"),
      c("Sport spettacolo e parchi moderni", "Tempo libero industriale, biglietti, massa.", "sport"),
      c("Giochi stampati, carte, romanzi popolari", "Regole e intrattenimento riproducibili.", "book"),
      c("Teatro, arene, giochi codificati", "Intrattenimento pubblico regolato da istituzioni.", "theater"),
      c("Gioco rituale, danza, competizione", "Piacere, allenamento, festa e legame sociale.", "people")
    ]
  },
  {
    id: "war",
    label: "Guerra e conflitto",
    color: "#7f1d1d",
    icon: "shield",
    cells: [
      c("Sistemi autonomi bellici", "Robot, sciami, targeting algoritmico e decisioni delegate.", "robot"),
      c("Guerra ibrida, cyber e droni militari", "Droni, satelliti, social, sabotaggio informativo e attacchi digitali.", "drone"),
      c("Missili, radar, nucleare", "Guerra totale, deterrenza, logistica globale.", "shield"),
      c("Guerra industriale", "Mitragliatrici, artiglieria, trincee, produzione di massa.", "factory"),
      c("Armi da fuoco e polvere da sparo", "Cannoni, moschetti, fortificazioni e Stati fiscali.", "shield"),
      c("Eserciti organizzati e cavalleria", "Discipline militari, imperi, gerarchie e codici.", "people"),
      c("Arco, frecce, lance, corpo a corpo", "Conflitto ravvicinato, caccia, difesa del gruppo.", "shield")
    ]
  },
  {
    id: "security",
    label: "Sicurezza e protezione",
    color: "#7f1d1d",
    icon: "id",
    cells: [
      c("Sicurezza predittiva e sorveglianza IA", "Riconoscimento, scoring, anomalie, controllo automatizzato.", "ai"),
      c("Identita digitale e cybersecurity", "SPID, password, crittografia, reputazione online.", "id"),
      c("Telecamere, allarmi, biometria", "Controllo elettronico di spazi, persone e accessi.", "camera"),
      c("Polizia moderna e assicurazioni", "Stato, statistiche, prevenzione, gestione del rischio.", "law"),
      c("Passaporti, registri, stampa di documenti", "Identita amministrativa e tracciabilita.", "id"),
      c("Mura, guardie, sigilli", "Protezione fisica, confini, custodia e autorita.", "shield"),
      c("Fuoco, rifugio, gruppo", "Sicurezza come prossimita, difesa e solidarieta.", "people")
    ]
  },
  {
    id: "law",
    label: "Diritto",
    color: "#6a994e",
    icon: "law",
    cells: [
      c("Regole algoritmiche e giustizia digitale", "Compliance automatica, smart contract, prove digitali.", "ai"),
      c("Processi telematici e norme digitali", "PEC, firme elettroniche, privacy, piattaforme giuridiche.", "id"),
      c("Diritto internazionale e diritti umani", "Organismi sovranazionali, trattati, costituzionalismo avanzato.", "law"),
      c("Codici moderni e Stato burocratico", "Leggi nazionali, tribunali, polizia, cittadinanza.", "law"),
      c("Stampa giuridica e codificazione", "Testi circolanti, commentari, uniformazione.", "book"),
      c("Diritto romano, canonico, consuetudini scritte", "Norme, contratti, proprieta e autorita testuale.", "law"),
      c("Consuetudini orali e mediazione", "Norme comunitarie, riparazione, vendetta, patto.", "speech")
    ]
  },
  {
    id: "politics",
    label: "Politica e istituzioni",
    color: "#6a994e",
    icon: "government",
    cells: [
      c("Governance algoritmica e democrazia aumentata", "Sondaggi continui, e-government, simulazioni e rischi di controllo.", "ai"),
      c("Petizioni online, open data, voto elettronico", "Partecipazione digitale, trasparenza, attivismo in rete.", "id"),
      c("Mass media, partiti di massa, welfare", "Opinione pubblica mediatica e amministrazione complessa.", "tv"),
      c("Stato-nazione e burocrazie moderne", "Censimenti, ministeri, rappresentanza, infrastrutture.", "government"),
      c("Stampa, riforme, rivoluzioni", "Pamphlet, giornali, assemblee e immaginari politici.", "newspaper"),
      c("Imperi, citta-stato, democrazia antica", "Istituzioni scritte, cittadinanza, magistrature.", "government"),
      c("Clan, capi, consigli, anziani", "Decisione collettiva fondata su parentela e prestigio.", "people")
    ]
  }
];

const lanes = laneRows.map((row, index) => ({
  id: row.id,
  label: row.label,
  y: LANE_START_Y + index * LANE_STEP_Y,
  color: row.color
}));

const seedNodes = buildSeedNodes(laneRows);

function buildSeedNodes(rows) {
  const offsets = [0, 0, 0, 0, 0, 0, 0];
  return rows.flatMap((row, rowIndex) => {
    const y = LANE_START_Y + rowIndex * LANE_STEP_Y;
    return axisSteps.map((step, index) => {
      const data = row.cells[index];
      const item = node(
        `${row.id}-${step.key}`,
        row.id,
        data.title,
        step.label,
        step.x,
        y + offsets[index],
        data.icon || row.icon || "sparkles",
        data.notes
      );
      item.iconKey = data.icon || row.icon || "sparkles";
      return item;
    });
  });
}

const legacyNodePrefixes = [
  "edu-",
  "media-",
  "music-",
  "arts-",
  "work-",
  "mob-",
  "health-",
  "energy-",
  "pol-",
  "war-",
  "emo-"
];

const retiredNodeIds = new Set([
  "emotion-tribe",
  "emotion-religion",
  "emotion-fear",
  "emotion-joy",
  "emotion-fomo",
  "emotion-fatigue",
  "emotion-anxiety",
  "emotion-loneliness"
]);

function isRetiredLegacyNode(item) {
  const id = String(item?.id || "");
  return retiredNodeIds.has(id) || legacyNodePrefixes.some((prefix) => id.startsWith(prefix));
}

const impactCatalog = {
  fomo: { label: "FOMO", emoji: "😰", color: "#7c3aed" },
  consumismo: { label: "consumismo", emoji: "🛒", color: "#f97316" },
  sovraccarico: { label: "sovraccarico", emoji: "🌊", color: "#2563eb" },
  autenticita: { label: "autenticita", emoji: "?", color: "#be123c" },
  delega: { label: "delega cognitiva", emoji: "🧠", color: "#9333ea" },
  isolamento: { label: "isolamento", emoji: "◌", color: "#64748b" },
  controllo: { label: "controllo", emoji: "👁", color: "#111827" },
  disinformazione: { label: "disinformazione", emoji: "!", color: "#dc2626" },
  ansia: { label: "ansia", emoji: "!", color: "#c2410c" },
  dipendenza: { label: "dipendenza", emoji: "↻", color: "#0891b2" },
  privacy: { label: "privacy", emoji: "🔒", color: "#0f766e" },
  creativita: { label: "creativita aumentata", emoji: "✦", color: "#a16207" },
  escalation: { label: "escalation", emoji: "!", color: "#991b1b" },
  trauma: { label: "trauma", emoji: "!", color: "#581c87" },
  appartenenza: { label: "appartenenza", emoji: "🤝", color: "#15803d" },
  accessibilita: { label: "accessibilita", emoji: "♿", color: "#0369a1" },
  disuguaglianza: { label: "disuguaglianza", emoji: "≠", color: "#b45309" },
  lavoro: { label: "lavoro trasformato", emoji: "⚙", color: "#4b5563" },
  sostenibilita: { label: "sostenibilita", emoji: "🌱", color: "#16a34a" },
  accelerazione: { label: "accelerazione", emoji: "⏩", color: "#ea580c" },
  memoria: { label: "memoria estesa", emoji: "▣", color: "#475569" },
  sicurezza: { label: "sicurezza", emoji: "◆", color: "#0f172a" },
  attenzione: { label: "attenzione catturata", emoji: "◉", color: "#7c2d12" },
  cura: { label: "cura e benessere", emoji: "♥", color: "#be185d" }
};

const nodeImpacts = {
  "edu-neuro": ["delega", "privacy"],
  "edu-ai": ["delega"],
  "edu-elearning": ["isolamento"],
  "media-ai": ["delega", "disinformazione"],
  "media-social": ["fomo", "dipendenza", "disinformazione"],
  "media-email": ["sovraccarico"],
  "media-print": ["disinformazione"],
  "music-ai": ["creativita"],
  "music-stream": ["dipendenza"],
  "arts-immersive": ["isolamento"],
  "arts-gen": ["autenticita", "creativita"],
  "arts-photo": ["fomo", "sovraccarico"],
  "work-postscarcity": ["controllo"],
  "work-ai": ["ansia"],
  "work-ecom": ["consumismo", "privacy"],
  "work-search": ["ansia"],
  "work-factory": ["consumismo"],
  "mob-telepresence": ["controllo"],
  "mob-smart": ["fomo", "dipendenza", "privacy"],
  "mob-gps": ["controllo", "privacy"],
  "health-bioeng": ["ansia", "privacy"],
  "health-ai": ["delega"],
  "health-wear": ["ansia", "privacy"],
  "energy-fusion": ["ansia"],
  "energy-grid": ["controllo"],
  "pol-daos": ["controllo"],
  "pol-ai": ["privacy", "controllo"],
  "pol-gov": ["controllo"],
  "pol-vote": ["disinformazione"],
  "pol-demo": ["disinformazione"],
  "pol-code": ["controllo"],
  "war-ai": ["controllo", "escalation"],
  "war-hybrid": ["disinformazione", "ansia"],
  "war-drones": ["controllo", "trauma"],
  "war-cyber": ["disinformazione", "privacy"],
  "war-industrial": ["trauma", "escalation"],
  "war-gunpowder": ["escalation"],
  "war-armies": ["controllo", "trauma"],
  "war-bow": ["trauma"]
};

const iconOptions = [
  ["auto", "Automatica"],
  ["ai", "AI / reti"],
  ["monitor", "Schermo"],
  ["book", "Libro"],
  ["university", "Universita"],
  ["speech", "Oralita"],
  ["smartphone", "Smartphone"],
  ["social", "Social"],
  ["mail", "E-mail"],
  ["phone", "Telefono"],
  ["newspaper", "Giornale"],
  ["runner", "Messaggero"],
  ["music", "Musica"],
  ["play", "Streaming"],
  ["radio", "Radio"],
  ["disc", "Disco"],
  ["camera", "Fotografia"],
  ["film", "Cinema"],
  ["pen", "Scrittura"],
  ["cave", "Origini"],
  ["cart", "Commercio"],
  ["search", "Ricerca"],
  ["factory", "Fabbrica"],
  ["coin", "Moneta"],
  ["bitcoin", "Bitcoin"],
  ["card", "Moneta elettronica"],
  ["chart", "Mercati"],
  ["bond", "Obbligazioni"],
  ["trade", "Scambio"],
  ["city", "Citta"],
  ["gps", "GPS"],
  ["car", "Auto"],
  ["train", "Ferrovia"],
  ["road", "Strada"],
  ["health", "Salute"],
  ["watch", "Wearable"],
  ["vaccine", "Vaccino"],
  ["hospital", "Ospedale"],
  ["leaf", "Natura"],
  ["robot", "Robot"],
  ["drone", "Drone"],
  ["grid", "Rete energia"],
  ["steam", "Vapore"],
  ["mill", "Mulino"],
  ["fire", "Fuoco"],
  ["id", "Identita"],
  ["government", "Governo"],
  ["vote", "Voto"],
  ["democracy", "Democrazia"],
  ["law", "Legge"],
  ["group", "Gruppo"],
  ["empathy", "Empatia"],
  ["alert", "Allarme"],
  ["target", "Bersaglio"],
  ["bow", "Arco"],
  ["shield", "Scudo"],
  ["info", "Informazione"],
  ["public", "Opinione pubblica"],
  ["ritual", "Rito"],
  ["myth", "Mito"],
  ["sparkles", "Generica"]
];

const nodeIconNames = {};

const laneDefaultIcons = Object.fromEntries(laneRows.map((row) => [row.id, row.icon || "sparkles"]));

const iconPaths = {
  ai: '<path d="M8 4.5a2.5 2.5 0 0 1 4 1.95A2.5 2.5 0 0 1 16 8.5v7a2.5 2.5 0 0 1-4 .05A2.5 2.5 0 0 1 8 17.5v-13Z"></path><path d="M12 6.5v11"></path><path d="M8 9h-3"></path><path d="M8 15h-3"></path><path d="M16 9h3"></path><path d="M16 15h3"></path><circle cx="5" cy="9" r="1.4"></circle><circle cx="5" cy="15" r="1.4"></circle><circle cx="19" cy="9" r="1.4"></circle><circle cx="19" cy="15" r="1.4"></circle>',
  monitor: '<rect x="4" y="5" width="16" height="11" rx="2"></rect><path d="M9 20h6"></path><path d="M12 16v4"></path><path d="M8 9h8"></path>',
  book: '<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5V5.5Z"></path><path d="M5 18.5A2.5 2.5 0 0 1 7.5 16H20"></path><path d="M9 7h6"></path><path d="M9 10h4"></path>',
  university: '<path d="M3 9l9-5 9 5"></path><path d="M5 10h14"></path><path d="M7 10v7"></path><path d="M12 10v7"></path><path d="M17 10v7"></path><path d="M4 19h16"></path>',
  speech: '<path d="M5 6.5h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6l-5 3v-3H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"></path><path d="M8 10h8"></path><path d="M8 13h5"></path>',
  smartphone: '<rect x="7" y="2.8" width="10" height="18.4" rx="2.2"></rect><path d="M10 5h4"></path><path d="M11 18h2"></path>',
  social: '<circle cx="8" cy="9" r="3"></circle><circle cx="16.5" cy="7" r="2.5"></circle><circle cx="16" cy="16" r="3"></circle><path d="M10.5 8.3l4-.9"></path><path d="M10.3 10.7l3.5 3.4"></path>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"></rect><path d="m4.5 7 7.5 6 7.5-6"></path>',
  phone: '<path d="M8 4.5 6 6.5c-.8.8-.5 4.9 3.4 8.8 3.9 3.9 8 4.2 8.8 3.4l2-2-4-3-1.8 1.8c-1.2-.5-2.3-1.2-3.5-2.4-1.2-1.2-2-2.5-2.4-3.5L11 7.5l-3-3Z"></path>',
  newspaper: '<path d="M4 6h13a2 2 0 0 1 2 2v11H6a2 2 0 0 1-2-2V6Z"></path><path d="M19 9h1.5v8a2 2 0 0 1-2 2"></path><path d="M7 9h6"></path><path d="M7 12h9"></path><path d="M7 15h4"></path>',
  runner: '<circle cx="13" cy="4.5" r="2"></circle><path d="M9 9l4-2 3 3"></path><path d="M12 9l-2 5"></path><path d="M10 14l-4 4"></path><path d="M13 12l4 5"></path>',
  music: '<path d="M9 18V6l10-2v12"></path><circle cx="7" cy="18" r="2.5"></circle><circle cx="17" cy="16" r="2.5"></circle>',
  play: '<rect x="3.5" y="5" width="17" height="14" rx="2"></rect><path d="m10 9 5 3-5 3V9Z"></path>',
  radio: '<rect x="4" y="9" width="16" height="10" rx="2"></rect><path d="M8 9l9-4"></path><circle cx="9" cy="14" r="2"></circle><path d="M14 13h3"></path><path d="M14 16h2"></path>',
  disc: '<circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="2"></circle><path d="M12 4a8 8 0 0 1 8 8"></path>',
  camera: '<path d="M6 8h2l1.4-2h5.2L16 8h2a2 2 0 0 1 2 2v8H4v-8a2 2 0 0 1 2-2Z"></path><circle cx="12" cy="13.5" r="3"></circle>',
  film: '<rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M8 5v14"></path><path d="M16 5v14"></path><path d="M4 9h4"></path><path d="M16 9h4"></path><path d="M4 15h4"></path><path d="M16 15h4"></path>',
  pen: '<path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"></path><path d="m14.5 6.5 3 3"></path><path d="M7 17l1 1"></path>',
  cave: '<path d="M4 20c.5-6 2.8-11 8-15 5.2 4 7.5 9 8 15"></path><path d="M8 19c.5-3.4 2-6 4-8 2 2 3.5 4.6 4 8"></path><path d="M9 7h.1"></path><path d="M15 7h.1"></path>',
  cart: '<path d="M4 5h2l2 11h10l2-8H7"></path><circle cx="10" cy="19" r="1.8"></circle><circle cx="17" cy="19" r="1.8"></circle><path d="M10 11h6"></path>',
  search: '<circle cx="10.5" cy="10.5" r="5.5"></circle><path d="m15 15 5 5"></path><path d="M8 10.5h5"></path>',
  factory: '<path d="M4 20V9l5 4V9l5 4V7h6v13H4Z"></path><path d="M8 17h2"></path><path d="M13 17h2"></path><path d="M18 11h2"></path>',
  coin: '<circle cx="12" cy="12" r="8"></circle><path d="M12 7v10"></path><path d="M15 9.5c-.8-.8-4.2-1-4.2.8 0 2.5 4.4 1.2 4.4 3.8 0 1.8-3.5 1.8-4.7.6"></path>',
  bitcoin: '<circle cx="12" cy="12" r="8"></circle><path d="M10 6v12"></path><path d="M13 6v12"></path><path d="M8.5 8h5.2a2 2 0 0 1 0 4H9"></path><path d="M9 12h5.1a2 2 0 0 1 0 4H8.5"></path>',
  card: '<rect x="3.5" y="6" width="17" height="12" rx="2"></rect><path d="M3.5 10h17"></path><path d="M7 15h4"></path><path d="M15 15h2"></path>',
  chart: '<path d="M4 19h16"></path><path d="M6 16l4-4 3 3 6-8"></path><path d="M15 7h4v4"></path>',
  bond: '<rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M7 9h10"></path><path d="M7 12h7"></path><path d="M7 16h5"></path><circle cx="16.5" cy="15.5" r="1.8"></circle>',
  trade: '<path d="M7 7h11l-3-3"></path><path d="M18 7l-3 3"></path><path d="M17 17H6l3 3"></path><path d="M6 17l3-3"></path>',
  city: '<path d="M4 20V8h5v12"></path><path d="M9 20V4h6v16"></path><path d="M15 20v-9h5v9"></path><path d="M6 11h1"></path><path d="M11 8h1"></path><path d="M17 14h1"></path>',
  gps: '<path d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11Z"></path><circle cx="12" cy="10" r="2.5"></circle>',
  car: '<path d="M5 16h14l-1.5-5a3 3 0 0 0-2.8-2H9.3a3 3 0 0 0-2.8 2L5 16Z"></path><path d="M6 16v3"></path><path d="M18 16v3"></path><circle cx="8" cy="16.5" r="1.3"></circle><circle cx="16" cy="16.5" r="1.3"></circle>',
  train: '<rect x="6" y="4" width="12" height="13" rx="2"></rect><path d="M9 21l3-4 3 4"></path><path d="M8 8h8"></path><path d="M8 12h8"></path><circle cx="9" cy="15" r="1"></circle><circle cx="15" cy="15" r="1"></circle>',
  road: '<path d="M8 21 11 3"></path><path d="m16 21-3-18"></path><path d="M12 7v2"></path><path d="M12 13v2"></path><path d="M12 19v1"></path>',
  health: '<path d="M12 20s-8-4.6-8-10a4.4 4.4 0 0 1 8-2.5A4.4 4.4 0 0 1 20 10c0 5.4-8 10-8 10Z"></path><path d="M8 12h3l1-2 2 5 1-3h3"></path>',
  watch: '<rect x="8" y="7" width="8" height="10" rx="3"></rect><path d="M9 7 10 3h4l1 4"></path><path d="m9 17 1 4h4l1-4"></path><path d="M12 10v3l2 1"></path>',
  vaccine: '<path d="m4 20 6-6"></path><path d="m14 4 6 6"></path><path d="m10 8 6 6"></path><path d="m8 10 6-6 6 6-6 6-6-6Z"></path><path d="M6 18l-2 2"></path>',
  hospital: '<path d="M5 20V5h14v15"></path><path d="M9 20v-5h6v5"></path><path d="M12 8v5"></path><path d="M9.5 10.5h5"></path>',
  leaf: '<path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Z"></path><path d="M5 19c4-5 8-8 14-14"></path>',
  robot: '<rect x="5" y="8" width="14" height="11" rx="2"></rect><path d="M12 8V4"></path><circle cx="9" cy="13" r="1.3"></circle><circle cx="15" cy="13" r="1.3"></circle><path d="M9 17h6"></path><path d="M3 12h2"></path><path d="M19 12h2"></path>',
  drone: '<path d="M8 12h8"></path><path d="M12 8v8"></path><rect x="9" y="9" width="6" height="6" rx="1.5"></rect><circle cx="5" cy="5" r="2.2"></circle><circle cx="19" cy="5" r="2.2"></circle><circle cx="5" cy="19" r="2.2"></circle><circle cx="19" cy="19" r="2.2"></circle><path d="M7 7l2 2"></path><path d="M17 7l-2 2"></path><path d="M7 17l2-2"></path><path d="M17 17l-2-2"></path>',
  grid: '<rect x="4" y="4" width="6" height="6" rx="1"></rect><rect x="14" y="4" width="6" height="6" rx="1"></rect><rect x="4" y="14" width="6" height="6" rx="1"></rect><rect x="14" y="14" width="6" height="6" rx="1"></rect><path d="M10 7h4"></path><path d="M10 17h4"></path><path d="M7 10v4"></path><path d="M17 10v4"></path>',
  steam: '<path d="M5 18h14"></path><path d="M7 18V9h8v9"></path><path d="M15 12h3v6"></path><path d="M9 6c-1-1 1-2 0-3"></path><path d="M13 6c-1-1 1-2 0-3"></path>',
  mill: '<circle cx="12" cy="12" r="2"></circle><path d="M12 4v6"></path><path d="M12 14v6"></path><path d="M4 12h6"></path><path d="M14 12h6"></path><path d="M8 8l3 3"></path><path d="m13 13 3 3"></path>',
  fire: '<path d="M12 21c4 0 7-2.8 7-6.6 0-2.8-1.6-5.2-4.8-8.4.1 2.2-.6 3.6-2.1 4.7C11.6 8.4 10.4 6.5 8.5 4 8.7 8.8 5 10.8 5 14.5 5 18.2 8 21 12 21Z"></path>',
  id: '<rect x="4" y="5" width="16" height="14" rx="2"></rect><circle cx="9" cy="11" r="2"></circle><path d="M6.8 16c.8-1.5 3.6-1.5 4.4 0"></path><path d="M14 10h4"></path><path d="M14 14h3"></path>',
  government: '<path d="M3 9l9-5 9 5"></path><path d="M5 10h14"></path><path d="M6 18h12"></path><path d="M8 10v8"></path><path d="M12 10v8"></path><path d="M16 10v8"></path>',
  vote: '<path d="M5 11h14v10H5z"></path><path d="M8 11V7h8v4"></path><path d="m9 6 2 2 4-4"></path><path d="M8 15h8"></path>',
  democracy: '<path d="M12 4 5 9v11h14V9l-7-5Z"></path><path d="M9 20v-6h6v6"></path><path d="M8 10h8"></path>',
  law: '<path d="M12 3v18"></path><path d="M5 6h14"></path><path d="m7 6-4 7h8L7 6Z"></path><path d="m17 6-4 7h8l-4-7Z"></path>',
  group: '<circle cx="8" cy="8" r="3"></circle><circle cx="16" cy="8" r="3"></circle><path d="M3 19c.9-3.2 4.4-5 8-3"></path><path d="M13 15.5c3.3-1.2 6.8.4 8 3.5"></path>',
  empathy: '<path d="M12 20s-8-4.6-8-10a4.4 4.4 0 0 1 8-2.5A4.4 4.4 0 0 1 20 10c0 5.4-8 10-8 10Z"></path><path d="M9 11h.1"></path><path d="M15 11h.1"></path><path d="M9 15c1.8 1.2 4.2 1.2 6 0"></path>',
  alert: '<path d="M12 3 2.8 20h18.4L12 3Z"></path><path d="M12 9v5"></path><path d="M12 17h.1"></path>',
  target: '<circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="4"></circle><circle cx="12" cy="12" r="1"></circle><path d="M12 2v3"></path><path d="M12 19v3"></path><path d="M2 12h3"></path><path d="M19 12h3"></path>',
  shield: '<path d="M12 3 5 6v5c0 4.6 2.8 7.8 7 10 4.2-2.2 7-5.4 7-10V6l-7-3Z"></path><path d="M12 7v10"></path><path d="M8.5 11h7"></path>',
  bow: '<path d="M7 4c5 3.4 5 13.6 0 17"></path><path d="M7 4c-2.5 5.6-2.5 11.4 0 17"></path><path d="M7 12h14"></path><path d="m17 8 4 4-4 4"></path>',
  info: '<circle cx="12" cy="12" r="9"></circle><path d="M12 10v6"></path><path d="M12 7h.1"></path>',
  public: '<circle cx="7" cy="12" r="3"></circle><circle cx="15" cy="9" r="3"></circle><circle cx="16" cy="17" r="2.5"></circle><path d="M9.5 11l2.8-1"></path><path d="M9.5 13.2l3.7 2.3"></path>',
  ritual: '<circle cx="12" cy="7" r="3"></circle><path d="M12 10v11"></path><path d="M8 14h8"></path><path d="M8 21c1.3-3 6.7-3 8 0"></path>',
  myth: '<path d="M5 19c1-6 5-11 7-16 2 5 6 10 7 16"></path><path d="M8 15c2-1.5 6-1.5 8 0"></path><path d="M9 9h.1"></path><path d="M15 9h.1"></path>',
  sparkles: '<path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"></path><path d="M5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15Z"></path><path d="M19 15l.6 1.4L21 17l-1.4.6L19 19l-.6-1.4L17 17l1.4-.6L19 15Z"></path>'
};

Object.assign(iconPaths, {
  theater: iconPaths.play,
  print: iconPaths.newspaper,
  school: iconPaths.university,
  people: iconPaths.group,
  video: iconPaths.play,
  tv: iconPaths.monitor,
  computer: iconPaths.monitor,
  cloud: iconPaths.grid,
  software: iconPaths.grid,
  gamepad: iconPaths.play,
  plane: iconPaths.road,
  map: iconPaths.gps,
  sport: iconPaths.runner,
  paint: iconPaths.pen,
  hand: iconPaths.ritual,
  museum: iconPaths.university
});

const coloredIconEmoji = {
  ai: "🤖",
  monitor: "🖥️",
  book: "📚",
  university: "🎓",
  speech: "🗣️",
  smartphone: "📱",
  social: "🌐",
  mail: "✉️",
  chat: "💬",
  phone: "☎️",
  newspaper: "📰",
  runner: "🏃",
  music: "🎵",
  play: "▶️",
  radio: "📻",
  disc: "💿",
  camera: "📷",
  film: "🎞️",
  pen: "✒️",
  cave: "🪨",
  cart: "🛒",
  search: "🔎",
  factory: "🏭",
  coin: "🪙",
  bitcoin: "₿",
  card: "💳",
  chart: "📈",
  bond: "📜",
  trade: "🤝",
  city: "🏙️",
  gps: "📍",
  car: "🚗",
  train: "🚆",
  road: "🛣️",
  health: "❤️",
  watch: "⌚",
  vaccine: "💉",
  hospital: "🏥",
  leaf: "🌿",
  robot: "🤖",
  drone: "✈️",
  grid: "🔌",
  steam: "♨️",
  mill: "⚙️",
  fire: "🔥",
  id: "🪪",
  government: "🏛️",
  vote: "🗳️",
  democracy: "🏛️",
  law: "⚖️",
  group: "👥",
  empathy: "💚",
  alert: "⚠️",
  target: "🎯",
  bow: "🏹",
  shield: "🛡️",
  info: "ℹ️",
  public: "📣",
  ritual: "🕯️",
  myth: "✨",
  theater: "🎭",
  print: "🖨️",
  school: "🏫",
  people: "👥",
  video: "🎬",
  tv: "📺",
  computer: "💻",
  cloud: "☁️",
  software: "🧩",
  gamepad: "🎮",
  plane: "✈️",
  map: "🗺️",
  sport: "🏃",
  paint: "🎨",
  hand: "✋",
  museum: "🏛️",
  sparkles: "✨",
  avatar: "🧑‍💻",
  memo: "📝",
  fax: "📠",
  satellite: "🛰️",
  megaphone: "📢",
  scroll: "📜",
  abacus: "🧮",
  calculator: "🔢",
  microscope: "🔬",
  dna: "🧬",
  pill: "💊",
  stethoscope: "🩺",
  brain: "🧠",
  eye: "👁️",
  moneybag: "💰",
  bank: "🏦",
  shopping: "🛍️",
  package: "📦",
  rocket: "🚀",
  ship: "🚢",
  bicycle: "🚲",
  bus: "🚌",
  ballot: "🗳️",
  handshake: "🤝",
  mask: "🎭",
  palette: "🎨",
  microphone: "🎙️",
  headphones: "🎧",
  piano: "🎹",
  bookopen: "📖",
  clipboard: "📋",
  database: "🗄️",
  folder: "🗂️",
  lock: "🔐",
  siren: "🚨",
  explosion: "💥",
  skull: "☠️",
  atom: "⚛️",
  battery: "🔋",
  oil: "🛢️",
  pickaxe: "⛏️",
  hammer: "🔨",
  joystick: "🕹️",
  trophy: "🏆",
  mapscroll: "🗺️",
  crown: "👑",
  family: "👪",
  seedling: "🌱"
};

const contextualIconRules = [
  { icon: "phone", pattern: /telefono|telegrafo|amplificazione|cellulari/i },
  { icon: "social", pattern: /social media|social\b|piattaforme|instagram|tiktok|blog|microblogging/i },
  { icon: "tv", pattern: /tv|televis|palinsesto/i },
  { icon: "newspaper", pattern: /giornali|stampa periodica|riviste|quotidiani|periodici/i },
  { icon: "university", pattern: /scuola|universit|educaz|apprendimento|tutor|student/i },
  { icon: "public", pattern: /piazza|opinione pubblica|pubblico di massa/i },
  { icon: "ritual", pattern: /rituali|formule|oratoria|rito/i },
  { icon: "megaphone", pattern: /microtarget|propaganda|pubblicita|spot|campagne|manifesti|proclami|araldo/i },
  { icon: "myth", pattern: /miti|epica|canti orali|racconto orale|cantastorie/i },
  { icon: "avatar", pattern: /avatar|assistenti vocali|agenti personali|risposte automatiche|agent/i },
  { icon: "brain", pattern: /\bai\b|intelligenza artificiale|cognitiv|sintesi automatica|scrittura assistita|stili sintetici|generativ|automatic|algoritm/i },
  { icon: "mask", pattern: /deepfake|avatar|teatro|drama|personaggi|autorialita|attori digitali/i },
  { icon: "chat", pattern: /chat|whatsapp|sms|meme|vocali|videochiamate/i },
  { icon: "fax", pattern: /fax|segreteria|primi cellulari/i },
  { icon: "mail", pattern: /posta|lettere|cartoline|sigilli|messaggeri/i },
  { icon: "scroll", pattern: /editti|iscrizioni|poemi|testi sacri|contratti|catasti|leggi/i },
  { icon: "clipboard", pattern: /verbali|report|modulistica|registri|fascicoli|documenti/i },
  { icon: "database", pattern: /database|archivi|cloud|wiki|memorie sintetiche|archivi interrogabili/i },
  { icon: "bookopen", pattern: /ebook|fanfiction|blog|romanzo|editoria|bestseller|letteratura/i },
  { icon: "palette", pattern: /pittura|disegno|immagine|arti visive|simbolizzare|generare la realta/i },
  { icon: "camera", pattern: /fotografia|dagherrotipo|catturare la realta|fotocamere/i },
  { icon: "film", pattern: /cinema|video|pellicola|registrare la realta|audiovisiv|montaggio/i },
  { icon: "microphone", pattern: /voce|radio|registrazioni|doppiaggio|cloni vocali/i },
  { icon: "headphones", pattern: /streaming|playlist|ascolto|mp3|cd/i },
  { icon: "piano", pattern: /musica|partiture|notazione|canto|ritmo|liuteria|suno/i },
  { icon: "microscope", pattern: /ricerca|scoperta|laboratori|ipotesi|review|letteratura scientifica/i },
  { icon: "dna", pattern: /genomica|bioingegneria|biometr|farmaci progettati/i },
  { icon: "stethoscope", pattern: /diagnosi|medicina|telemedicina|sanita|cliniche/i },
  { icon: "pill", pattern: /farmaci|vaccin|terapie|cura/i },
  { icon: "abacus", pattern: /abaco|conteggi|calcolo manuale|conti/i },
  { icon: "calculator", pattern: /calcolatrici|foglio elettronico|simulazioni|digital twin|quantistico/i },
  { icon: "software", pattern: /software|programmazione|codice|repo|self-healing|app/i },
  { icon: "lock", pattern: /cyber|sicurezza|passkey|identita digitale|protezione|privacy/i },
  { icon: "battery", pattern: /batterie|storage|elettric|rete elettrica|data center|smart grid/i },
  { icon: "atom", pattern: /nucleare|fusione|smr|atomo/i },
  { icon: "oil", pattern: /petrolio|carbone|fossil/i },
  { icon: "fire", pattern: /fuoco|combustione/i },
  { icon: "moneybag", pattern: /moneta|credito|finanza|mercati|trading|borsa/i },
  { icon: "bitcoin", pattern: /bitcoin|blockchain|defi|smart contract|token/i },
  { icon: "card", pattern: /pagamenti|cbdc|stablecoin|moneta elettronica/i },
  { icon: "shopping", pattern: /e-commerce|marketplace|consumismo|commercio/i },
  { icon: "package", pattern: /logistica|consegna|produzione|catena/i },
  { icon: "factory", pattern: /fabbrica|industriale|automazione dei task|lavoro|produzione/i },
  { icon: "robot", pattern: /robot|robotaxi|autonom|automazione/i },
  { icon: "drone", pattern: /drone|sciami|corridoi drone/i },
  { icon: "car", pattern: /auto|guida|mobilita autonoma|robotaxi/i },
  { icon: "train", pattern: /treno|ferrovia/i },
  { icon: "ship", pattern: /nave|mare|naval|sottomarin/i },
  { icon: "rocket", pattern: /spazio|satellit|orbitale/i },
  { icon: "siren", pattern: /allarme|emergenza|sicurezza predittiva/i },
  { icon: "explosion", pattern: /guerra|conflitto|armi|ipersonic|energia diretta|escalation/i },
  { icon: "skull", pattern: /letali|trauma|nucleare|morte/i },
  { icon: "bow", pattern: /arco|frecce|lance|corpo a corpo/i },
  { icon: "shield", pattern: /scudo|difesa|protezione|contro-droni/i },
  { icon: "law", pattern: /diritto|legale|responsabilita|giudizi|norme|tribunal/i },
  { icon: "ballot", pattern: /voto|elezioni|democrazia/i },
  { icon: "government", pattern: /governo|istituzioni|stati|pubblici|sovranita/i },
  { icon: "handshake", pattern: /baratto|dono|reciprocita|contratti/i },
  { icon: "trophy", pattern: /sport|competizione|gioco/i },
  { icon: "joystick", pattern: /videogioco|giochi|mondi generativi|npc|intrattenimento/i },
  { icon: "empathy", pattern: /benessere|coach|compagni|salute mentale|relazioni/i },
  { icon: "watch", pattern: /wearable|smart watch|monitoraggio/i },
  { icon: "leaf", pattern: /natura|rinnovabili|sostenibilita|clima/i }
];

const scenarioSources = {
  stanford: {
    label: "Stanford AI Index 2026",
    url: "https://hai.stanford.edu/ai-index/2026-ai-index-report"
  },
  epoch: {
    label: "Epoch AI",
    url: "https://epoch.ai/topics/future-of-ai"
  },
  oecd: {
    label: "OECD AI futures",
    url: "https://www.oecd.org/content/dam/oecd/en/publications/reports/2024/11/assessing-potential-future-artificial-intelligence-risks-benefits-and-policy-imperatives_8a491447/3f4e3dfb-en.pdf"
  },
  imf: {
    label: "IMF scenario AI 2026",
    url: "https://www.imf.org/-/media/files/publications/imf-notes/2026/english/insea2026002.pdf"
  },
  ai2027: {
    label: "AI Futures / AI 2027",
    url: "https://ai-2027.com/scenario.pdf"
  },
  natoHybrid: {
    label: "NATO hybrid threats",
    url: "https://www.nato.int/cps/uk/natohq/topics_156338.htm"
  },
  natoCog: {
    label: "NATO ACT cognitive warfare",
    url: "https://www.act.nato.int/activities/cognitive-warfare/"
  },
  darpaMosaic: {
    label: "DARPA Mosaic Warfare",
    url: "https://www.darpa.mil/news/features/mosaic-warfare"
  },
  atlantic: {
    label: "Atlantic Council algorithmic warfare",
    url: "https://www.atlanticcouncil.org/in-depth-research-reports/report/how-nato-can-integrate-ai-to-prevail-in-future-algorithmic-warfare/"
  },
  rand: {
    label: "RAND Future of Warfare 2030",
    url: "https://www.rand.org/content/dam/rand/pubs/research_reports/RR2800/RR2849z1/RAND_RR2849z1.pdf"
  },
  allegato: {
    label: "Allegato: guerra ibrida, liminale, cognitiva",
    url: ""
  }
};

const futureScenarioTracks = {
  ai: {
    title: "AI / AGI / superintelligenza",
    subtitle: "Sequenza prudente di scenari 2026-2035: automazione agentica, ricerca automatizzata, AGI controversa, possibili salti verso superintelligenza.",
    color: "#7c3aed",
    sources: ["stanford", "epoch", "oecd", "imf", "ai2027"],
    events: [
      {
        year: 2026,
        confidence: "alta",
        title: "Agenti operativi, non ancora AGI condivisa",
        summary: "I modelli diventano collaboratori continui per codice, analisi, documenti e decision support. Il salto reale e organizzativo: workflow, compliance, energia e fiducia contano quanto la capacita del modello.",
        signals: "Adozione aziendale, agenti con memoria, costi di inferenza in calo, strategie nazionali e data center sovrani.",
        impacts: ["delega", "lavoro", "privacy", "sovraccarico"]
      },
      {
        year: 2027,
        confidence: "media",
        title: "Ricerca assistita e primi agenti scientifici robusti",
        summary: "Scenario accreditato ma non certo: sistemi capaci di generare ipotesi, leggere letteratura, scrivere codice sperimentale e accelerare R&D in domini delimitati.",
        signals: "Benchmark scientifici, agenti che completano task lunghi, validazione esterna dei risultati, primi incidenti da autonomia mal controllata.",
        impacts: ["creativita", "delega", "sicurezza", "disuguaglianza"]
      },
      {
        year: 2028,
        confidence: "media-bassa",
        title: "AI researcher automatizzato: soglia critica",
        summary: "Nello scenario rapido, laboratori e governi trattano l'AI researcher come moltiplicatore strategico. In scenari piu lenti resta una suite di strumenti potenti ma supervisionati.",
        signals: "Automazione di coding e ricerca AI, audit indipendenti, restrizioni su pesi dei modelli, controlli export su chip e data center.",
        impacts: ["delega", "accelerazione", "controllo", "ansia"]
      },
      {
        year: 2029,
        confidence: "media",
        title: "Automazione del lavoro cognitivo remoto",
        summary: "Molti compiti impiegatizi diventano orchestrabili da agenti. L'impatto dipende meno dal singolo modello e piu dalla capacita delle organizzazioni di ridisegnare processi e responsabilita.",
        signals: "Sostituzione di task, non solo assistenza; contratti con agenti; nuove metriche di produttivita; contenziosi su responsabilita.",
        impacts: ["lavoro", "disuguaglianza", "delega", "controllo"]
      },
      {
        year: 2030,
        confidence: "media",
        title: "AI infrastrutturale e rischio sistemico",
        summary: "L'AI diventa strato operativo di sanita, finanza, istruzione, sicurezza e burocrazia. Cresce il valore della resilienza: fallback umani, audit, tracciabilita e ridondanza.",
        signals: "AI in infrastrutture critiche, standard di sicurezza, assicurazioni per rischio AI, incidenti concatenati da agenti interconnessi.",
        impacts: ["sicurezza", "privacy", "controllo", "cura"]
      },
      {
        year: 2031,
        confidence: "bassa",
        title: "Pressione su energia, chip e dati",
        summary: "Se lo scaling continua, il collo di bottiglia si sposta su energia, supply chain, dati di qualita, verifiche scientifiche e governance dei sistemi multi-agente.",
        signals: "Accordi energetici per data center, chip dedicati, uso massiccio di dati sintetici, nuovi mercati della verifica.",
        impacts: ["sostenibilita", "disuguaglianza", "sicurezza", "accelerazione"]
      },
      {
        year: 2032,
        confidence: "bassa",
        title: "AGI debole o generalita pratica",
        summary: "Possibile comparsa di sistemi generalmente competenti in molte attivita digitali, ma l'etichetta AGI resta contestata: corpo, causalita, affidabilita e autonomia fisica sono ancora variabili decisive.",
        signals: "Agenti che imparano nuovi software, coordinano team di agenti, superano test cross-domain e restano affidabili per settimane.",
        impacts: ["delega", "lavoro", "autenticita", "sicurezza"]
      },
      {
        year: 2033,
        confidence: "bassa",
        title: "Mediana di alcune previsioni crowdsourced per AGI",
        summary: "Alcune previsioni aggregate hanno collocato la prima AI generale intorno ai primi anni 2030, mentre survey di esperti restano spesso piu tarde. La mappa deve mostrare questa divergenza.",
        signals: "Risoluzione di forecast pubblici, definizioni legali di AGI, test indipendenti su autonomia, economic value e robustezza.",
        impacts: ["ansia", "controllo", "disuguaglianza", "creativita"]
      },
      {
        year: 2034,
        confidence: "molto bassa",
        title: "Possibile divario AGI-superintelligenza",
        summary: "Se la ricerca AI viene automatizzata davvero, il passaggio da AGI a sistemi superumani potrebbe essere breve. Se i ritorni diminuiscono, resta invece una crescita potente ma non esplosiva.",
        signals: "AI che migliora architetture AI, scoperta automatica di algoritmi, fallimenti o successi di alignment su agenti autonomi.",
        impacts: ["sicurezza", "escalation", "delega", "controllo"]
      },
      {
        year: 2035,
        confidence: "molto bassa",
        title: "Biforcazione: AI governata o vantaggio strategico instabile",
        summary: "La questione non e solo tecnica: il mondo reale dipende da accordi internazionali, distribuzione dei benefici, accesso a calcolo, controllo militare e capacita di spegnere o contenere sistemi pericolosi.",
        signals: "Trattati sul calcolo, ispezioni, incidenti geopolitici legati a modelli, nuovi equilibri tra stati e grandi laboratori.",
        impacts: ["controllo", "sicurezza", "disuguaglianza", "sostenibilita"]
      }
    ]
  },
  war: {
    title: "Guerra ibrida, liminale e algoritmica",
    subtitle: "Dalla soglia grigia alla guerra cognitiva, autonoma e multi-dominio: non solo droni e cyber, ma percezione, tempo, spazio e comando algoritmico.",
    color: "#991b1b",
    sources: ["allegato", "natoHybrid", "natoCog", "darpaMosaic", "atlantic", "rand"],
    events: [
      {
        year: 2026,
        confidence: "alta",
        title: "Normalizzazione della zona grigia",
        summary: "Guerra ibrida come combinazione di cyber, proxy, sabotaggi, economia e disinformazione; guerra liminale come gestione della soglia per restare sotto la risposta militare aperta.",
        signals: "Attacchi a infrastrutture, campagne cognitive, sabotaggi negabili, pressione su energia, cavi, porti, satelliti e opinione pubblica.",
        impacts: ["ansia", "disinformazione", "controllo", "sicurezza"]
      },
      {
        year: 2027,
        confidence: "alta",
        title: "Droni, contro-droni e autonomia tattica",
        summary: "I droni restano centrali ma diventano parte di un ecosistema: sensori, guerra elettronica, munizioni circuitanti, difese a energia diretta e AI per targeting.",
        signals: "Costo per abbattimento, sciami piccoli, jam-resistance, sistemi laser/microonde, regole human-on-the-loop.",
        impacts: ["escalation", "trauma", "lavoro", "sicurezza"]
      },
      {
        year: 2028,
        confidence: "media",
        title: "Comando assistito da AI",
        summary: "Il C2 integra AI per sintesi intelligence, suggerimento piani, priorita bersagli e logistica. Il rischio e l'automazione della pressione decisionale: tempi piu brevi, meno spazio politico.",
        signals: "Decision support certificati, esercitazioni NATO, audit su bias di targeting, incidenti da fiducia eccessiva nei sistemi.",
        impacts: ["delega", "controllo", "escalation", "attenzione"]
      },
      {
        year: 2029,
        confidence: "media",
        title: "Mosaic warfare e kill web resilienti",
        summary: "La logica passa da piattaforme grandi a combinazioni riconfigurabili di sensori, effettori e nodi sacrificabili. Se un nodo cade, il mosaico si ricompone.",
        signals: "Sistemi interoperabili, sciami misti aria-mare-terra, reti mesh, software-defined warfare, procurement modulare.",
        impacts: ["accelerazione", "sicurezza", "controllo", "lavoro"]
      },
      {
        year: 2030,
        confidence: "media",
        title: "Guerra cognitiva come dominio stabile",
        summary: "Il bersaglio non e solo il dato ma il processo cognitivo: fiducia, identita, paura, coesione sociale, interpretazione della realta.",
        signals: "Deepfake persistenti, microtargeting psicologico, attacchi alla fiducia istituzionale, resilienza cognitiva nelle dottrine militari.",
        impacts: ["disinformazione", "ansia", "attenzione", "trauma"]
      },
      {
        year: 2031,
        confidence: "media-bassa",
        title: "Sciami autonomi e contro-sciami",
        summary: "La questione diventa scalare: non il singolo drone, ma gruppi che si coordinano, si riorganizzano e saturano difese. Il controllo umano diretto diventa sempre piu difficile.",
        signals: "Test di autonomia collettiva, munizioni low-cost, counter-swarm, norme internazionali su LAWS.",
        impacts: ["escalation", "trauma", "delega", "sicurezza"]
      },
      {
        year: 2032,
        confidence: "bassa",
        title: "Spazio orbitale e infrastrutture invisibili",
        summary: "Satelliti, PNT, ISR, cavi sottomarini e cloud militare diventano bersagli permanenti. La guerra puo colpire la societa senza apparire come invasione.",
        signals: "Satelliti ispettori, jamming, spoofing GPS, assicurazioni spaziali, protezione di cavi e cloud sovrani.",
        impacts: ["sicurezza", "controllo", "ansia", "sovraccarico"]
      },
      {
        year: 2033,
        confidence: "bassa",
        title: "Ipersonico, energia diretta e tempo compresso",
        summary: "Velocita e spettro elettromagnetico comprimono la finestra decisionale. Difesa e attacco si spostano verso luce, microonde, automazione e pre-delega.",
        signals: "Laser operativi, microonde anti-elettronica, ipersonico manovrante, C2 con secondi di reazione.",
        impacts: ["escalation", "sicurezza", "delega", "ansia"]
      },
      {
        year: 2034,
        confidence: "molto bassa",
        title: "Autonomia letale distribuita",
        summary: "Scenario critico: piattaforme autonome su aria, terra, mare e spazio eseguono parti della catena decisionale. Il nodo politico diventa chi autorizza, chi verifica, chi risponde.",
        signals: "Doctrine human-out-of-the-loop, responsabilita legale, incidenti transfrontalieri, sistemi autonomi navali e sottomarini.",
        impacts: ["trauma", "controllo", "sicurezza", "escalation"]
      },
      {
        year: 2035,
        confidence: "molto bassa",
        title: "Guerra algoritmica sotto soglia permanente",
        summary: "Il futuro piu plausibile non e una guerra totale continua, ma pressione permanente: soglie liminali, AI, informazione, spazio, economia e infrastrutture in stato di allarme cronico.",
        signals: "Trattati su autonomia, sistemi di attribuzione, difesa civile digitale, crisi ripetute sotto Articolo 5 o soglie equivalenti.",
        impacts: ["ansia", "controllo", "sicurezza", "disinformazione"]
      }
    ]
  }
};

const laneFutureScenarios = {
  "comm-body": {
    title: "Avatar, voce sintetica e presenza aumentata",
    horizon: "2026-2035",
    summary: "Traduzione in tempo reale, avatar personali, interfacce vocali persistenti e segnali corporei letti da sensori renderanno piu fluido parlare con persone e sistemi artificiali.",
    signals: "Assistenti vocali multimodali, occhiali AR, avatar realistici, norme su identita sintetica.",
    impacts: ["autenticita", "privacy", "delega"]
  },
  "comm-distance": {
    title: "Messaggi delegati e agenti personali",
    horizon: "2026-2035",
    summary: "La comunicazione a distanza tendera a essere filtrata da agenti: risposte automatiche, priorita, riassunti, negoziazioni e gestione dei gruppi.",
    signals: "Inbox autonome, agenti che prenotano/negoziano, certificazione dell'umano o del bot.",
    impacts: ["sovraccarico", "privacy", "isolamento"]
  },
  "comm-public": {
    title: "Media sintetici e fiducia pubblica",
    horizon: "2026-2035",
    summary: "Contenuti generati, microtargeting e verifica di provenienza renderanno centrale distinguere fonte, intenzione, manipolazione e reputazione.",
    signals: "Watermark, provenance, deepfake politici, media personalizzati in tempo reale.",
    impacts: ["disinformazione", "attenzione", "controllo"]
  },
  "write-doc": {
    title: "Documenti vivi e burocrazia automatica",
    horizon: "2026-2035",
    summary: "Contratti, verbali, report, fascicoli e pratiche diventeranno oggetti interrogabili e aggiornabili da agenti, con audit e responsabilita come nodo critico.",
    signals: "Workflow documentali AI, firme/verifiche automatiche, archivi pubblici interrogabili.",
    impacts: ["memoria", "controllo", "privacy"]
  },
  literature: {
    title: "Autorialita ibrida e nuovi generi",
    horizon: "2026-2035",
    summary: "La scrittura letteraria si aprira a coautori artificiali, personaggi generativi, romanzi personalizzati e tensioni su stile, copyright e autenticita.",
    signals: "Libri generativi, fanfiction AI, licenze sullo stile, editoria iper-personalizzata.",
    impacts: ["creativita", "autenticita", "disuguaglianza"]
  },
  image: {
    title: "Immagini generative come linguaggio ordinario",
    horizon: "2026-2035",
    summary: "La produzione visiva diventera conversazionale: generare, correggere e animare immagini sara normale quanto fotografare o scrivere.",
    signals: "Fotocamere generative, provenance visiva, archivi sintetici, dispute su realta e prova.",
    impacts: ["autenticita", "creativita", "sovraccarico"]
  },
  sound: {
    title: "Voci, musica e ambienti sonori sintetici",
    horizon: "2026-2035",
    summary: "Musica generativa, cloni vocali, doppiaggio istantaneo e sound design personale cambieranno produzione, identita e mercato dell'ascolto.",
    signals: "Voice licensing, musica infinita, filtri vocali, autenticazione della voce.",
    impacts: ["creativita", "autenticita", "dipendenza"]
  },
  audiovisual: {
    title: "Video generativo e cinema modulare",
    horizon: "2026-2035",
    summary: "Video lunghi sintetici, previsualizzazione automatica, attori digitali e montaggio agentico allargheranno la produzione audiovisiva.",
    signals: "Spot interamente generativi, serie personalizzate, attori sintetici, accordi sindacali.",
    impacts: ["attenzione", "lavoro", "autenticita"]
  },
  education: {
    title: "Tutor personali e scuola adattiva",
    horizon: "2026-2035",
    summary: "Ogni studente potra avere tutor, simulazioni e percorsi adattivi. Il problema sara garantire equita, motivazione, valutazione e presenza umana.",
    signals: "Tutor AI certificati, compiti orali, portfolio dinamici, nuove prove anti-delega.",
    impacts: ["accessibilita", "delega", "disuguaglianza"]
  },
  research: {
    title: "Scoperta assistita e laboratori automatizzati",
    horizon: "2026-2035",
    summary: "AI per ipotesi, codice, letteratura, simulazioni e robot-lab accelerera ricerca e brevetti, ma anche verifiche e riproducibilita.",
    signals: "AI scientist, laboratori robotici, review automatizzata, crisi o boom della riproducibilita.",
    impacts: ["creativita", "accelerazione", "sicurezza"]
  },
  memory: {
    title: "Memoria personale e archivi interrogabili",
    horizon: "2026-2035",
    summary: "La memoria diventera ricercabile: life logging, archivi familiari, istituzionali e aziendali, con tensione tra cura, controllo e oblio.",
    signals: "Assistenti con memoria lunga, diritto all'oblio, archivi generativi, timeline personali.",
    impacts: ["memoria", "privacy", "controllo"]
  },
  calculation: {
    title: "Calcolo come infrastruttura cognitiva",
    horizon: "2026-2035",
    summary: "Modelli, simulazioni, digital twin e calcolo specializzato sosterranno decisioni in economia, clima, sanita, logistica e sicurezza.",
    signals: "Digital twin urbani, chip AI, calcolo quantistico utile in nicchie, audit dei modelli.",
    impacts: ["delega", "controllo", "sostenibilita"]
  },
  programming: {
    title: "Software scritto da agenti",
    horizon: "2026-2035",
    summary: "La programmazione passera da scrivere codice a specificare obiettivi, testare, verificare e governare squadre di agenti software.",
    signals: "Repo gestite da agenti, test automatici, software self-healing, sicurezza supply-chain.",
    impacts: ["lavoro", "delega", "sicurezza"]
  },
  energy: {
    title: "Reti intelligenti e fame di energia",
    horizon: "2026-2035",
    summary: "Elettrificazione, data center, storage, rinnovabili, nucleare avanzato e demand response renderanno l'energia un vincolo centrale del futuro digitale.",
    signals: "Accordi data center-energia, batterie di rete, SMR, smart grid, prezzi dinamici.",
    impacts: ["sostenibilita", "controllo", "disuguaglianza"]
  },
  economy: {
    title: "Finanza tokenizzata e agenti economici",
    horizon: "2026-2035",
    summary: "Pagamenti programmabili, mercati tokenizzati, agenti che comprano/vendono e finanza AI-driven potranno aumentare efficienza e instabilita.",
    signals: "CBDC, stablecoin regolamentate, asset tokenizzati, agenti di trading personali.",
    impacts: ["consumismo", "privacy", "disuguaglianza"]
  },
  labor: {
    title: "Automazione dei task e riconfigurazione del lavoro",
    horizon: "2026-2035",
    summary: "Molti mestieri cambieranno per task: meno routine, piu supervisione, cura, creativita, verifica e coordinamento uomo-macchina.",
    signals: "Contratti AI, reskilling, settimane corte, nuovi indicatori di produttivita.",
    impacts: ["lavoro", "ansia", "disuguaglianza"]
  },
  transport: {
    title: "Mobilita autonoma e logistica predittiva",
    horizon: "2026-2035",
    summary: "Guida assistita/autonoma, droni logistici, flotte elettriche e piattaforme predittive cambieranno citta, lavoro e tempi di consegna.",
    signals: "Robotaxi, corridoi drone, logistica urbana, infrastrutture di ricarica intelligenti.",
    impacts: ["accelerazione", "sostenibilita", "sicurezza"]
  },
  health: {
    title: "Medicina preventiva e diagnosi aumentata",
    horizon: "2026-2035",
    summary: "AI diagnostica, wearable, genomica, farmaci progettati e telemedicina sposteranno la sanita verso prevenzione e personalizzazione.",
    signals: "AI cliniche certificate, trial sintetici, digital therapeutics, cartelle interoperabili.",
    impacts: ["cura", "privacy", "accessibilita"]
  },
  wellbeing: {
    title: "Compagni, coach e salute mentale digitale",
    horizon: "2026-2035",
    summary: "Coach personali, companion AI e monitoraggio continuo aiuteranno benessere e fragilita, ma potranno creare dipendenza e sostituire relazioni.",
    signals: "Companion regolati, terapia digitale, metriche emotive, wearable affettivi.",
    impacts: ["cura", "dipendenza", "isolamento"]
  },
  play: {
    title: "Mondi generativi e intrattenimento adattivo",
    horizon: "2026-2035",
    summary: "Giochi, sport, social VR e narrazioni interattive saranno generati e adattati in tempo reale al giocatore o alla comunita.",
    signals: "NPC agentici, mondi persistenti AI, sport data-driven, creator game engine.",
    impacts: ["dipendenza", "creativita", "appartenenza"]
  },
  war: {
    title: "Guerra liminale, cognitiva e autonoma",
    horizon: "2026-2035",
    summary: "La guerra tendera a restare sotto soglia: cyber, droni, sciami, spazio, cognitive warfare, mosaic warfare e comando algoritmico.",
    signals: "Sciami, jamming, deepfake strategici, armi a energia diretta, C2 assistito da AI.",
    impacts: ["escalation", "trauma", "disinformazione"]
  },
  security: {
    title: "Sicurezza predittiva e identita verificabile",
    horizon: "2026-2035",
    summary: "Identita digitale, biometria, cyberdifesa AI e sistemi predittivi cresceranno, con tensione costante tra protezione e sorveglianza.",
    signals: "Passkey, wallet identitari, SOC autonomi, attacchi AI, sorveglianza biometrica.",
    impacts: ["sicurezza", "privacy", "controllo"]
  },
  law: {
    title: "Diritto computazionale e responsabilita AI",
    horizon: "2026-2035",
    summary: "Contratti intelligenti, assistenti legali e norme su AI, dati, responsabilita e prova digitale renderanno il diritto piu computazionale.",
    signals: "AI Act applicato, contenziosi su output AI, smart contract, giudizi assistiti.",
    impacts: ["controllo", "accessibilita", "disuguaglianza"]
  },
  politics: {
    title: "Governance algoritmica e sovranita tecnologica",
    horizon: "2026-2035",
    summary: "Stati, citta e istituzioni useranno AI per servizi, sicurezza e decisioni; cresceranno sovranita digitale, propaganda sintetica e bisogno di audit democratico.",
    signals: "AI nei servizi pubblici, cloud sovrani, elezioni con deepfake, trattati su calcolo.",
    impacts: ["controllo", "disinformazione", "sicurezza"]
  }
};

let state = {
  nodes: [],
  selectedId: null,
  query: "",
  activeLanes: new Set(lanes.map((lane) => lane.id)),
  showFlows: true,
  showImpacts: true,
  zoom: 0.82,
  interactionMode: "navigate",
  sidebarVisible: true,
  topbarVisible: true,
  scenarioVisible: true,
  scenarioTrack: "ai"
};

let dragState = null;
let panState = null;
let suppressNextClick = false;

const worldSizer = document.getElementById("worldSizer");
const world = document.getElementById("world");
const stageScroller = document.getElementById("stageScroller");
const flowsSvg = document.getElementById("flowsSvg");
const timeAxis = document.getElementById("timeAxis");
const lanesLayer = document.getElementById("lanesLayer");
const futureLayer = document.getElementById("futureLayer");
const nodesLayer = document.getElementById("nodesLayer");
const laneFilters = document.getElementById("laneFilters");
const inspector = document.getElementById("inspector");
const stats = document.getElementById("stats");
const searchInput = document.getElementById("searchInput");
const zoomInput = document.getElementById("zoomInput");
const flowsToggle = document.getElementById("flowsToggle");
const impactsToggle = document.getElementById("impactsToggle");
const impactLegend = document.getElementById("impactLegend");
const modeButtons = document.querySelectorAll("[data-mode]");
const scenarioTrackButtons = document.querySelectorAll("[data-scenario-track]");
const appShell = document.querySelector(".app-shell");
const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
const toggleTopbarBtn = document.getElementById("toggleTopbarBtn");
const toggleScenarioBtn = document.getElementById("toggleScenarioBtn");
const scenarioTitle = document.getElementById("scenarioTitle");
const scenarioContent = document.getElementById("scenarioContent");
const scenarioSourcesEl = document.getElementById("scenarioSources");

function node(id, lane, label, era, x, y, icon, notes) {
  return {
    id,
    lane,
    label,
    era,
    x,
    y,
    icon,
    notes,
    image: ""
  };
}

function getLane(id) {
  return lanes.find((lane) => lane.id === id) || lanes[0];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function uid() {
  return `node-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    state.nodes = structuredClone(seedNodes);
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    const nodes = Array.isArray(parsed.nodes) ? parsed.nodes : seedNodes;
    const needsMigration = parsed.version !== STORAGE_VERSION || hasInvalidGeometry(nodes);
    state.nodes = needsMigration ? mergeSeedNodes(nodes) : nodes.map((item) => normalizeNode(item));
    state.selectedId = parsed.selectedId || null;
    state.interactionMode = parsed.interactionMode === "edit" ? "edit" : "navigate";
    state.sidebarVisible = parsed.sidebarVisible !== false;
    state.topbarVisible = parsed.topbarVisible !== false;
    state.scenarioVisible = parsed.scenarioVisible !== false;
    state.scenarioTrack = futureScenarioTracks[parsed.scenarioTrack] ? parsed.scenarioTrack : "ai";
    if (needsMigration) saveState();
  } catch {
    state.nodes = structuredClone(seedNodes);
  }
}

function hasInvalidGeometry(nodes) {
  return nodes.some((item) => !Number.isFinite(Number(item.x)) || !Number.isFinite(Number(item.y)));
}

function mergeSeedNodes(savedNodes) {
  const savedById = new Map(savedNodes.map((item) => [item.id, item]));
  const seedIds = new Set(seedNodes.map((item) => item.id));
  const mergedSeeds = seedNodes.map((seed) => {
    const saved = savedById.get(seed.id);
    if (!saved) return normalizeNode(seed);
    return normalizeNode({
      ...seed,
      image: saved.image || seed.image,
      iconKey: saved.iconKey || seed.iconKey || "",
      notes: seed.notes || saved.notes
    });
  });
  const laneIds = new Set(lanes.map((lane) => lane.id));
  const customNodes = savedNodes
    .filter((item) => !seedIds.has(item.id) && !isRetiredLegacyNode(item) && laneIds.has(item.lane))
    .map((item) => normalizeNode(item));
  return [...mergedSeeds, ...customNodes];
}

function normalizeNode(item) {
  return {
    id: item.id || uid(),
    lane: getLane(item.lane).id,
    label: String(item.label || "Nodo"),
    era: String(item.era || "presente"),
    x: clamp(Number(item.x) || 420, 70, WORLD.width - WORLD.nodeWidth - 70),
    y: clamp(Number(item.y) || getLane(item.lane).y, 82, WORLD.height - WORLD.nodeHeight - 30),
    icon: String(item.icon || "AI"),
    iconKey: String(item.iconKey || ""),
    notes: String(item.notes || ""),
    image: String(item.image || ""),
    impacts: Array.isArray(item.impacts) ? item.impacts.filter((key) => impactCatalog[key]) : []
  };
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: STORAGE_VERSION,
      nodes: state.nodes,
      selectedId: state.selectedId,
      interactionMode: state.interactionMode,
      sidebarVisible: state.sidebarVisible,
      topbarVisible: state.topbarVisible,
      scenarioVisible: state.scenarioVisible,
      scenarioTrack: state.scenarioTrack
    })
  );
}

function render() {
  renderAxis();
  renderLanes();
  renderFilters();
  renderImpactLegend();
  renderNodes();
  renderFlows();
  renderFutureLayer();
  renderInspector();
  renderStats();
  applyZoom();
  renderInteractionMode();
  renderChromeVisibility();
}

function renderImpactLegend() {
  const sourceNodes = state.nodes.length ? state.nodes : seedNodes;
  const used = new Set(sourceNodes.flatMap((item) => getNodeImpactKeys(item)));
  impactLegend.innerHTML = Object.entries(impactCatalog)
    .filter(([key]) => used.has(key))
    .map(
      ([key, impact]) => `
        <span class="impact-chip legend-chip" style="--impact-color:${impact.color}" data-impact="${escapeAttr(key)}">
          <span class="impact-emoji">${escapeHtml(impact.emoji)}</span>
          ${escapeHtml(impact.label)}
        </span>
      `
    )
    .join("");
}

function renderAxis() {
  timeAxis.innerHTML = `
    <div class="axis-rail">
      <div class="axis-arrow">passato &rarr; presente &rarr; futuro, da destra a sinistra</div>
    </div>
    ${timeMarkers
      .map((marker) => `<div class="time-marker" style="left:${marker.x}px"><span>${escapeHtml(marker.label)}</span></div>`)
      .join("")}
  `;
}

function renderLanes() {
  lanesLayer.innerHTML = lanes
    .map(
      (lane) => `
        <div
          class="lane ${state.activeLanes.has(lane.id) ? "" : "lane-hidden"}"
          data-label="${escapeAttr(lane.label)}"
          style="top:${lane.y - 38}px;height:104px;--lane-color:${lane.color}"
        ></div>
      `
    )
    .join("");
}

function renderFilters() {
  const counts = lanes.reduce((acc, lane) => {
    acc[lane.id] = state.nodes.filter((item) => item.lane === lane.id).length;
    return acc;
  }, {});

  laneFilters.innerHTML = lanes
    .map(
      (lane) => `
        <label class="filter-pill" style="--lane-color:${lane.color}">
          <input type="checkbox" data-filter="${lane.id}" ${state.activeLanes.has(lane.id) ? "checked" : ""} />
          <span class="filter-name">${escapeHtml(lane.label)}</span>
          <span class="filter-count">${counts[lane.id] || 0}</span>
        </label>
      `
    )
    .join("");
}

function nodeMatches(item) {
  const query = state.query.trim().toLowerCase();
  const active = state.activeLanes.has(item.lane);
  if (!active) return false;
  if (!query) return true;
  const impactText = getNodeImpacts(item)
    .map((impact) => `${impact.label} ${impact.emoji}`)
    .join(" ");
  const text = `${item.label} ${item.era} ${item.notes} ${getLane(item.lane).label} ${impactText}`.toLowerCase();
  return text.includes(query);
}

const laneImpactDefaults = {
  "comm-body": ["appartenenza", "autenticita"],
  "comm-distance": ["privacy", "sovraccarico"],
  "comm-public": ["disinformazione", "attenzione"],
  "write-doc": ["memoria", "controllo"],
  literature: ["creativita", "appartenenza"],
  image: ["autenticita", "creativita"],
  sound: ["creativita", "dipendenza"],
  audiovisual: ["attenzione", "autenticita"],
  education: ["accessibilita", "delega"],
  research: ["creativita", "memoria"],
  memory: ["memoria", "privacy"],
  calculation: ["delega", "controllo"],
  programming: ["lavoro", "delega"],
  energy: ["sostenibilita", "controllo"],
  economy: ["consumismo", "disuguaglianza"],
  labor: ["lavoro", "ansia"],
  transport: ["accelerazione", "sostenibilita"],
  health: ["cura", "privacy"],
  wellbeing: ["cura", "ansia"],
  play: ["dipendenza", "appartenenza"],
  war: ["trauma", "escalation"],
  security: ["sicurezza", "controllo"],
  law: ["controllo", "disuguaglianza"],
  politics: ["controllo", "disinformazione"]
};

const stepImpactDefaults = {
  ai: ["delega", "creativita"],
  digital: ["sovraccarico", "privacy"],
  electronic: ["attenzione", "dipendenza"],
  industrial: ["lavoro", "accelerazione"],
  print: ["memoria", "accessibilita"],
  written: ["controllo", "memoria"],
  oral: ["appartenenza", "isolamento"]
};

function getStepKey(item) {
  const id = String(item.id || "");
  return axisSteps.find((step) => id.endsWith(`-${step.key}`))?.key || "";
}

function inferImpactKeys(item) {
  const lane = getLane(item.lane);
  const text = `${item.id} ${item.label} ${item.notes || ""} ${lane.label}`.toLowerCase();
  const keys = [];
  const add = (...items) => items.forEach((key) => keys.push(key));

  add(...(laneImpactDefaults[item.lane] || []));
  add(...(stepImpactDefaults[getStepKey(item)] || []));

  if (/social|tiktok|instagram|whatsapp|notific|piattaform|chat|creator|streaming/.test(text)) add("fomo", "sovraccarico", "dipendenza");
  if (/pubblicit|marketing|e-commerce|consum|spot|marketplace|bestseller|credito|trading|debit/.test(text)) add("consumismo");
  if (/deepfake|disinform|propaganda|microtarget|campagn|avatar|synthetic|sintetic/.test(text)) add("autenticita", "disinformazione");
  if (/sorveglianza|biometr|scoring|sicurezza predittiva|controllo automat/.test(text)) add("privacy", "controllo");
  if (/guerra|bellic|armi|droni militari|cyber|nucleare|sabotaggio/.test(text)) add("ansia", "trauma", "escalation");
  if (/tutor|apprendimento|educaz|scuola|universit|coach/.test(text)) add("creativita", "delega");
  if (/diagnosi|medicina|salute|cura|benessere|telemedicina|wearable/.test(text)) add("cura", "ansia", "privacy");
  if (/automazione|robot|agentic|algoritm|ia|generativ|automatic/.test(text)) add("delega", "creativita");
  if (/archiv|memoria|cloud|database|document/.test(text)) add("memoria", "sovraccarico", "privacy");
  if (/baratto|dono|reciproc|gruppo|comunit|rito|piazza/.test(text)) add("appartenenza");
  if (/bitcoin|blockchain|borsa|mercato azionario|obbligaz|moneta|credito|finanza/.test(text)) add("privacy", "disuguaglianza", "consumismo");
  if (/energia|elettric|petrolio|carbone|fusione|rinnovabil|rete elettrica/.test(text)) add("sostenibilita", "controllo");
  if (/trasport|gps|auto|treno|nave|aereo|strada|ruota/.test(text)) add("accelerazione", "sostenibilita");
  if (/identita|legge|diritto|voto|democrazia|govern|stato|tribunal/.test(text)) add("controllo", "sicurezza");
  if (/gioco|videogioco|sport|intrattenimento|gamification/.test(text)) add("dipendenza", "appartenenza");
  if (/poesia|romanzo|racconto|miti|teatro|arte|pittura|immagine|musica|cinema/.test(text)) add("creativita", "attenzione");

  return keys.length ? keys : ["attenzione"];
}

function getNodeImpactKeys(item) {
  const direct = Array.isArray(item.impacts) ? item.impacts : [];
  return [...new Set([...(nodeImpacts[item.id] || []), ...inferImpactKeys(item), ...direct])].filter((key) => impactCatalog[key]);
}

function getNodeImpacts(item) {
  return getNodeImpactKeys(item).map((key) => ({ key, ...impactCatalog[key] }));
}

function renderImpactTags(item) {
  if (!state.showImpacts) return "";
  const impacts = getNodeImpacts(item);
  if (!impacts.length) return "";
  return `
    <div class="impact-strip" aria-label="Impatti trasversali">
      ${impacts
        .slice(0, 3)
        .map(
          (impact) => `
            <span class="impact-chip" style="--impact-color:${impact.color}" title="${escapeAttr(impact.label)}">
              <span class="impact-emoji">${escapeHtml(impact.emoji)}</span>
              ${escapeHtml(impact.label)}
            </span>
          `
        )
        .join("")}
    </div>
  `;
}

function resolveIconName(item) {
  const seededIcon = item.icon || laneDefaultIcons[item.lane] || "";
  const manuallyPicked = item.iconKey && item.iconKey !== "auto" && item.iconKey !== seededIcon;
  if (manuallyPicked && isKnownIcon(item.iconKey)) return item.iconKey;
  return inferContextualIconName(item) || nodeIconNames[item.id] || seededIcon || laneDefaultIcons[item.lane] || "sparkles";
}

function isKnownIcon(iconName) {
  return Boolean(iconPaths[iconName] || coloredIconEmoji[iconName]);
}

function inferContextualIconName(item) {
  const lane = getLane(item.lane);
  const text = `${item.id} ${item.label} ${item.notes || ""} ${lane.label}`.toLowerCase();
  const rule = contextualIconRules.find((entry) => entry.pattern.test(text));
  return rule?.icon || "";
}

function renderIcon(item) {
  const iconName = resolveIconName(item);
  const emojiIcon = coloredIconEmoji[iconName];
  if (emojiIcon) {
    return `<span class="emoji-icon" aria-hidden="true">${escapeHtml(emojiIcon)}</span>`;
  }
  return `
    <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      ${iconPaths[iconName] || iconPaths.sparkles}
    </svg>
  `;
}

function renderVisual(item) {
  if (item.image) return `<img src="${escapeAttr(item.image)}" alt="" />`;
  return renderIcon(item);
}

function renderNodes() {
  clearHiddenSelection();
  nodesLayer.innerHTML = state.nodes
    .map((item) => {
      const lane = getLane(item.lane);
      const visible = nodeMatches(item);
      const selected = item.id === state.selectedId;
      const visual = renderVisual(item);

      return `
        <article
          class="node ${selected ? "selected" : ""} ${visible ? "" : "filtered-out"}"
          style="left:${item.x}px;top:${item.y}px;--node-color:${lane.color}"
          data-id="${escapeAttr(item.id)}"
          data-visible="${visible ? "true" : "false"}"
          tabindex="0"
          aria-label="${escapeAttr(item.label)}"
        >
          <div class="node-visual">${visual}</div>
          <div>
            <p class="node-title">${escapeHtml(item.label)}</p>
            <p class="node-meta">${escapeHtml(item.era)}</p>
          </div>
          ${renderImpactTags(item)}
        </article>
      `;
    })
    .join("");
}

function clearHiddenSelection() {
  const selected = getSelectedNode();
  if (selected && !nodeMatches(selected)) {
    state.selectedId = null;
    saveState();
  }
}

function renderFlows() {
  flowsSvg.setAttribute("viewBox", `0 0 ${WORLD.width} ${WORLD.height}`);
  flowsSvg.setAttribute("width", WORLD.width);
  flowsSvg.setAttribute("height", WORLD.height);

  if (!state.showFlows) {
    flowsSvg.innerHTML = "";
    return;
  }

  const defs = `
    <defs>
      <filter id="flowGlow" x="-10%" y="-60%" width="120%" height="220%">
        <feGaussianBlur stdDeviation="4" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
      ${lanes
        .map(
          (lane) => `
            <marker id="arrow-${lane.id}" markerWidth="12" markerHeight="12" refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,8 L11,4 z" fill="${lane.color}" opacity="0.28"></path>
            </marker>
          `
        )
        .join("")}
    </defs>
  `;

  const paths = lanes
    .map((lane, laneIndex) => {
      const laneNodes = state.nodes
        .filter((item) => item.lane === lane.id && nodeMatches(item))
        .sort((a, b) => b.x - a.x);

      return laneNodes
        .slice(0, -1)
        .map((from, index) => {
          const to = laneNodes[index + 1];
          const x1 = from.x + 12;
          const y1 = from.y + WORLD.nodeHeight / 2;
          const x2 = to.x + WORLD.nodeWidth - 12;
          const y2 = to.y + WORLD.nodeHeight / 2;
          const dx = Math.abs(x1 - x2);
          const bend = Math.max(96, dx * 0.34);
          const direction = (laneIndex + index) % 2 === 0 ? 1 : -1;
          const wave = direction * (22 + (index % 3) * 8);
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2 + wave;
          const path = [
            `M ${x1} ${y1}`,
            `C ${x1 - bend} ${y1 + wave}, ${midX + bend * 0.28} ${midY}, ${midX} ${midY}`,
            `C ${midX - bend * 0.28} ${midY}, ${x2 + bend} ${y2 - wave}, ${x2} ${y2}`
          ].join(" ");
          return `
            <path class="flow-ribbon-shadow" d="${path}" fill="none" stroke="${lane.color}" />
            <path class="flow-ribbon" d="${path}" fill="none" stroke="${lane.color}" marker-end="url(#arrow-${lane.id})" />
            <path class="flow-ribbon-light" d="${path}" fill="none" stroke="${lane.color}" />
          `;
        })
        .join("");
    })
    .join("");

  flowsSvg.innerHTML = `${defs}${paths}`;
}

function renderStats() {
  const visibleCount = state.nodes.filter((item) => nodeMatches(item)).length;
  stats.textContent = `${visibleCount} nodi visibili / ${state.nodes.length} totali`;
}

function renderFutureLayer() {
  if (!futureLayer) return;
  futureLayer.classList.toggle("future-hidden", !state.scenarioVisible);
  futureLayer.innerHTML = `
    <div class="future-band-label">
      <span>Futuro prossimo</span>
      <strong>2026-2035</strong>
    </div>
    ${lanes
      .map((lane) => {
        const scenario = laneFutureScenarios[lane.id];
        if (!scenario) return "";
        const active = state.activeLanes.has(lane.id);
        const matches = futureScenarioMatches(lane, scenario);
        const hidden = !active || !matches;
        return `
          <article
            class="future-card ${hidden ? "future-card-hidden" : ""}"
            style="top:${lane.y - 54}px;--future-color:${lane.color}"
            data-lane="${escapeAttr(lane.id)}"
          >
            <div class="future-card-head">
              <span class="future-horizon">${escapeHtml(scenario.horizon)}</span>
              <span class="future-lane">${escapeHtml(shortenLaneLabel(lane.label))}</span>
            </div>
            <h4>${escapeHtml(scenario.title)}</h4>
            <p>${escapeHtml(scenario.summary)}</p>
            <p class="future-signals"><strong>Segnali:</strong> ${escapeHtml(scenario.signals)}</p>
            <div class="future-impacts">${renderScenarioImpactChips(scenario.impacts)}</div>
          </article>
        `;
      })
      .join("")}
  `;
}

function futureScenarioMatches(lane, scenario) {
  const query = state.query.trim().toLowerCase();
  if (!query) return true;
  const impactText = (scenario.impacts || [])
    .map((key) => impactCatalog[key]?.label || key)
    .join(" ");
  const text = `${lane.label} ${scenario.title} ${scenario.summary} ${scenario.signals} ${impactText}`.toLowerCase();
  return text.includes(query);
}

function shortenLaneLabel(label) {
  return String(label)
    .replace("Comunicazione ", "Com. ")
    .replace("informativa e documentale", "info e documentale")
    .replace("Ricerca e produzione di conoscenza", "Ricerca e conoscenza")
    .replace("Audiovisivo: cinema, TV e video", "Audiovisivo")
    .replace("Economia, moneta e finanza", "Economia e finanza");
}

function renderScenarioImpactChips(keys = []) {
  return keys
    .map((key) => {
      const impact = impactCatalog[key];
      if (!impact) return "";
      return `
        <span class="impact-chip compact-impact" style="--impact-color:${impact.color}" title="${escapeAttr(impact.label)}">
          <span class="impact-emoji">${escapeHtml(impact.emoji)}</span>
          ${escapeHtml(impact.label)}
        </span>
      `;
    })
    .join("");
}

function renderScenarioDock() {
  const track = futureScenarioTracks[state.scenarioTrack] || futureScenarioTracks.ai;
  scenarioTitle.textContent = track.title;
  scenarioTrackButtons.forEach((button) => {
    const active = button.dataset.scenarioTrack === state.scenarioTrack;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });

  scenarioContent.innerHTML = `
    <p class="scenario-subtitle">${escapeHtml(track.subtitle)}</p>
    <div class="scenario-years" style="--scenario-color:${track.color}">
      ${track.events.map(renderScenarioEvent).join("")}
    </div>
  `;

  scenarioSourcesEl.innerHTML = `
    <span>Fonti e tracce:</span>
    ${track.sources
      .map((sourceKey) => {
        const source = scenarioSources[sourceKey];
        if (!source) return "";
        if (!source.url) return `<span class="source-chip">${escapeHtml(source.label)}</span>`;
        return `<a class="source-chip" href="${escapeAttr(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.label)}</a>`;
      })
      .join("")}
  `;
}

function renderScenarioEvent(event) {
  const impactMarkup = (event.impacts || [])
    .map((key) => {
      const impact = impactCatalog[key];
      if (!impact) return "";
      return `
        <span class="impact-chip compact-impact" style="--impact-color:${impact.color}" title="${escapeAttr(impact.label)}">
          <span class="impact-emoji">${escapeHtml(impact.emoji)}</span>
          ${escapeHtml(impact.label)}
        </span>
      `;
    })
    .join("");

  return `
    <article class="scenario-card">
      <div class="scenario-year">${escapeHtml(event.year)}</div>
      <div class="scenario-card-body">
        <div class="scenario-card-top">
          <h4>${escapeHtml(event.title)}</h4>
          <span class="confidence">${escapeHtml(event.confidence)}</span>
        </div>
        <p>${escapeHtml(event.summary)}</p>
        <p class="scenario-signals"><strong>Segnali:</strong> ${escapeHtml(event.signals)}</p>
        <div class="scenario-impacts">${impactMarkup}</div>
      </div>
    </article>
  `;
}

function renderInspector() {
  const selected = getSelectedNode();
  if (!selected) {
    inspector.innerHTML = document.getElementById("emptyInspectorTemplate").innerHTML;
    return;
  }

  const laneOptions = lanes
    .map((lane) => `<option value="${lane.id}" ${lane.id === selected.lane ? "selected" : ""}>${escapeHtml(lane.label)}</option>`)
    .join("");
  const iconSelectOptions = iconOptions
    .map(([value, label]) => `<option value="${value}" ${value === (selected.iconKey || "auto") ? "selected" : ""}>${escapeHtml(label)}</option>`)
    .join("");
  const selectedLane = getLane(selected.lane);
  const visual = renderVisual(selected);
  const selectedImpacts = getNodeImpacts(selected);
  const selectedImpactMarkup = selectedImpacts.length
    ? selectedImpacts
        .map(
          (impact) => `
            <span class="impact-chip" style="--impact-color:${impact.color}">
              <span class="impact-emoji">${escapeHtml(impact.emoji)}</span>
              ${escapeHtml(impact.label)}
            </span>
          `
        )
        .join("")
    : `<span class="note">Nessun impatto trasversale assegnato.</span>`;

  inspector.innerHTML = `
    <form class="inspector-form">
      <div class="image-preview">
        <div class="preview-box" style="--node-color:${selectedLane.color}">${visual}</div>
        <div>
          <strong>${escapeHtml(selected.label)}</strong>
          <p class="note">${escapeHtml(selectedLane.label)}</p>
        </div>
      </div>

      <label class="field">
        <span>Titolo</span>
        <input data-field="label" value="${escapeAttr(selected.label)}" />
      </label>

      <label class="field">
        <span>Ambito</span>
        <select data-field="lane">${laneOptions}</select>
      </label>

      <div class="form-grid">
        <label class="field">
          <span>Era</span>
          <input data-field="era" value="${escapeAttr(selected.era)}" />
        </label>
        <label class="field">
          <span>Tipo icona</span>
          <select data-field="iconKey">${iconSelectOptions}</select>
        </label>
      </div>

      <div class="form-grid">
        <label class="field">
          <span>X</span>
          <input data-field="x" type="number" value="${Math.round(selected.x)}" />
        </label>
        <label class="field">
          <span>Y</span>
          <input data-field="y" type="number" value="${Math.round(selected.y)}" />
        </label>
      </div>

      <label class="field">
        <span>Descrizione</span>
        <textarea data-field="notes">${escapeHtml(selected.notes)}</textarea>
      </label>

      <div class="field">
        <span>Impatti trasversali</span>
        <div class="impact-list">${selectedImpactMarkup}</div>
      </div>

      <label class="field">
        <span>URL immagine o data URL</span>
        <input data-field="image" value="${escapeAttr(selected.image)}" placeholder="lascia vuoto per usare l'icona" />
      </label>

      <label class="field">
        <span>Carica immagine</span>
        <input id="imageUpload" type="file" accept="image/*" />
      </label>

      <label class="field">
        <span>Prompt AI suggerito</span>
        <textarea id="promptBox" readonly>${escapeHtml(makeImagePrompt(selected))}</textarea>
      </label>

      <div class="node-actions">
        <button id="copyPromptBtn" type="button">Copia prompt</button>
        <button id="snapLaneBtn" type="button">Allinea corsia</button>
      </div>
      <div class="node-actions">
        <button id="duplicateBtn" type="button">Duplica</button>
        <button id="deleteBtn" class="ghost-danger" type="button">Elimina</button>
      </div>
    </form>
  `;
}

function getSelectedNode() {
  return state.nodes.find((item) => item.id === state.selectedId) || null;
}

function makeImagePrompt(item) {
  const lane = getLane(item.lane);
  return [
    `Icona editoriale pulita per "${item.label}"`,
    `ambito: ${lane.label}`,
    `periodo: ${item.era}`,
    "stile coerente da atlante storico, sfondo trasparente, leggibile a piccole dimensioni, niente testo nell'immagine"
  ].join(", ");
}

function applyZoom() {
  const scaledWidth = WORLD.width * state.zoom;
  const scaledHeight = WORLD.height * state.zoom;
  document.documentElement.style.setProperty("--world-width", `${WORLD.width}px`);
  document.documentElement.style.setProperty("--world-height", `${WORLD.height}px`);
  document.documentElement.style.setProperty("--node-width", `${WORLD.nodeWidth}px`);
  document.documentElement.style.setProperty("--node-height", `${WORLD.nodeHeight}px`);
  worldSizer.style.setProperty("--scaled-world-width", `${scaledWidth}px`);
  worldSizer.style.setProperty("--scaled-world-height", `${scaledHeight}px`);
  world.style.transform = `scale(${state.zoom})`;
}

function renderInteractionMode() {
  stageScroller.dataset.mode = state.interactionMode;
  modeButtons.forEach((button) => {
    const active = button.dataset.mode === state.interactionMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function renderChromeVisibility() {
  appShell.classList.toggle("sidebar-hidden", !state.sidebarVisible);
  appShell.classList.toggle("topbar-hidden", !state.topbarVisible);
  appShell.classList.toggle("scenario-hidden", !state.scenarioVisible);
  if (futureLayer) futureLayer.classList.toggle("future-hidden", !state.scenarioVisible);

  toggleSidebarBtn.textContent = state.sidebarVisible ? "Nascondi menu" : "Mostra menu";
  toggleTopbarBtn.textContent = state.topbarVisible ? "Nascondi alto" : "Mostra alto";
  toggleScenarioBtn.textContent = state.scenarioVisible ? "Nascondi scenari" : "Mostra scenari";
  toggleSidebarBtn.setAttribute("aria-pressed", state.sidebarVisible ? "true" : "false");
  toggleTopbarBtn.setAttribute("aria-pressed", state.topbarVisible ? "true" : "false");
  toggleScenarioBtn.setAttribute("aria-pressed", state.scenarioVisible ? "true" : "false");
}

function getViewportCenterWorldPoint() {
  const scrollerRect = stageScroller.getBoundingClientRect();
  return screenToWorld({
    clientX: scrollerRect.left + scrollerRect.width / 2,
    clientY: scrollerRect.top + scrollerRect.height / 2
  });
}

function setZoom(nextZoom) {
  const center = getViewportCenterWorldPoint();
  state.zoom = clamp(nextZoom, WORLD.minZoom, WORLD.maxZoom);
  applyZoom();
  syncZoomInput();

  stageScroller.scrollLeft = clamp(
    center.x * state.zoom - stageScroller.clientWidth / 2,
    0,
    Math.max(0, WORLD.width * state.zoom - stageScroller.clientWidth)
  );
  stageScroller.scrollTop = clamp(
    center.y * state.zoom - stageScroller.clientHeight / 2,
    0,
    Math.max(0, WORLD.height * state.zoom - stageScroller.clientHeight)
  );
}

function setZoomAt(nextZoom, point) {
  const before = screenToWorld(point);
  const scrollerRect = stageScroller.getBoundingClientRect();
  state.zoom = clamp(nextZoom, WORLD.minZoom, WORLD.maxZoom);
  applyZoom();
  syncZoomInput();

  stageScroller.scrollLeft = clamp(
    before.x * state.zoom - (point.clientX - scrollerRect.left),
    0,
    Math.max(0, WORLD.width * state.zoom - stageScroller.clientWidth)
  );
  stageScroller.scrollTop = clamp(
    before.y * state.zoom - (point.clientY - scrollerRect.top),
    0,
    Math.max(0, WORLD.height * state.zoom - stageScroller.clientHeight)
  );
}

function syncZoomInput() {
  zoomInput.value = String(Math.round(state.zoom * 100));
}

function screenToWorld(point) {
  const rect = world.getBoundingClientRect();
  const scaleX = rect.width ? WORLD.width / rect.width : 1 / state.zoom;
  const scaleY = rect.height ? WORLD.height / rect.height : 1 / state.zoom;
  return {
    x: (point.clientX - rect.left) * scaleX,
    y: (point.clientY - rect.top) * scaleY
  };
}

function selectNode(id) {
  state.selectedId = id;
  saveState();
  renderNodes();
  renderFlows();
  renderInspector();
}

function updateSelectedField(field, value) {
  const selected = getSelectedNode();
  if (!selected) return;

  if (field === "x" || field === "y") {
    const max = field === "x" ? WORLD.width - WORLD.nodeWidth - 70 : WORLD.height - WORLD.nodeHeight - 30;
    selected[field] = clamp(Number(value) || 0, 70, max);
  } else if (field === "lane") {
    selected.lane = getLane(value).id;
  } else {
    selected[field] = value;
  }

  saveState();
  renderNodes();
  renderFlows();
  renderStats();

  const promptBox = document.getElementById("promptBox");
  if (promptBox) promptBox.value = makeImagePrompt(selected);
}

function addNode() {
  const lane = lanes[0];
  const item = node(uid(), lane.id, "Nuovo nodo", "presente", 360, lane.y - 8, "NEW", "Aggiungi una descrizione breve.");
  item.iconKey = "sparkles";
  item.impacts = [];
  state.nodes.push(item);
  state.selectedId = item.id;
  saveState();
  render();
  showToast("Nodo creato");
}

function duplicateSelected() {
  const selected = getSelectedNode();
  if (!selected) return;
  const copy = {
    ...structuredClone(selected),
    id: uid(),
    label: `${selected.label} copia`,
    x: clamp(selected.x + 38, 70, WORLD.width - WORLD.nodeWidth - 70),
    y: clamp(selected.y + 32, 82, WORLD.height - WORLD.nodeHeight - 30)
  };
  state.nodes.push(copy);
  state.selectedId = copy.id;
  saveState();
  render();
  showToast("Nodo duplicato");
}

function deleteSelected() {
  const selected = getSelectedNode();
  if (!selected) return;
  state.nodes = state.nodes.filter((item) => item.id !== selected.id);
  state.selectedId = null;
  saveState();
  render();
  showToast("Nodo eliminato");
}

function snapSelectedToLane() {
  const selected = getSelectedNode();
  if (!selected) return;
  selected.y = getLane(selected.lane).y - 8;
  saveState();
  render();
  showToast("Nodo allineato");
}

function exportJson() {
  const payload = {
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    nodes: state.nodes
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "atlante-evolutivo.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function importJson(file) {
  if (!file) return;
  file
    .text()
    .then((text) => {
      const parsed = JSON.parse(text);
      const nodes = Array.isArray(parsed.nodes) ? parsed.nodes : parsed;
      if (!Array.isArray(nodes)) throw new Error("Formato non valido");
      const laneIds = new Set(lanes.map((lane) => lane.id));
      state.nodes = nodes
        .filter((item) => !isRetiredLegacyNode(item) && laneIds.has(item.lane))
        .map((item) => normalizeNode(item));
      state.selectedId = state.nodes[0]?.id || null;
      saveState();
      render();
      showToast("Mappa importata");
    })
    .catch(() => showToast("Import non valido"));
}

function resetMap() {
  const ok = window.confirm("Ripristinare la mappa iniziale? Le modifiche salvate nel browser saranno sostituite.");
  if (!ok) return;
  state.nodes = structuredClone(seedNodes);
  state.selectedId = null;
  saveState();
  render();
  showToast("Mappa ripristinata");
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 1800);
}

function setupEvents() {
  document.getElementById("addNodeBtn").addEventListener("click", addNode);
  document.getElementById("exportBtn").addEventListener("click", exportJson);
  document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
  document.getElementById("importFile").addEventListener("change", (event) => importJson(event.target.files?.[0]));
  document.getElementById("resetBtn").addEventListener("click", resetMap);
  document.getElementById("showAllBtn").addEventListener("click", () => {
    state.activeLanes = new Set(lanes.map((lane) => lane.id));
    renderLanes();
    renderFilters();
    renderNodes();
    renderFlows();
    renderFutureLayer();
    renderStats();
  });

  document.getElementById("hideAllBtn").addEventListener("click", () => {
    state.activeLanes = new Set();
    renderLanes();
    renderFilters();
    renderNodes();
    renderFlows();
    renderFutureLayer();
    renderStats();
  });

  searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderNodes();
    renderFlows();
    renderFutureLayer();
    renderStats();
  });

  flowsToggle.addEventListener("change", (event) => {
    state.showFlows = event.target.checked;
    renderFlows();
  });

  impactsToggle.addEventListener("change", (event) => {
    state.showImpacts = event.target.checked;
    renderNodes();
    renderInspector();
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.interactionMode = button.dataset.mode === "edit" ? "edit" : "navigate";
      renderInteractionMode();
      saveState();
    });
  });

  toggleSidebarBtn.addEventListener("click", () => {
    state.sidebarVisible = !state.sidebarVisible;
    renderChromeVisibility();
    saveState();
  });

  toggleTopbarBtn.addEventListener("click", () => {
    state.topbarVisible = !state.topbarVisible;
    renderChromeVisibility();
    saveState();
  });

  toggleScenarioBtn.addEventListener("click", () => {
    state.scenarioVisible = !state.scenarioVisible;
    renderFutureLayer();
    renderChromeVisibility();
    saveState();
  });

  scenarioTrackButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const track = button.dataset.scenarioTrack;
      if (!futureScenarioTracks[track]) return;
      state.scenarioTrack = track;
      state.scenarioVisible = true;
      renderScenarioDock();
      renderChromeVisibility();
      saveState();
    });
  });

  zoomInput.addEventListener("input", (event) => {
    setZoom(Number(event.target.value) / 100);
  });

  stageScroller.addEventListener(
    "wheel",
    (event) => {
      if (event.target.closest("input, textarea, select")) return;
      event.preventDefault();
      const factor = Math.exp(-event.deltaY * 0.0012);
      setZoomAt(state.zoom * factor, { clientX: event.clientX, clientY: event.clientY });
    },
    { passive: false }
  );

  laneFilters.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-filter]");
    if (!checkbox) return;
    const laneId = checkbox.dataset.filter;
    if (checkbox.checked) {
      state.activeLanes.add(laneId);
    } else {
      state.activeLanes.delete(laneId);
    }
    renderLanes();
    renderNodes();
    renderFlows();
    renderFutureLayer();
    renderStats();
  });

  nodesLayer.addEventListener("pointerdown", startDrag);
  stageScroller.addEventListener("pointerdown", startPan);
  nodesLayer.addEventListener("click", (event) => {
    if (suppressNextClick) {
      suppressNextClick = false;
      event.preventDefault();
      return;
    }
    const nodeElement = event.target.closest(".node");
    if (!nodeElement) return;
    selectNode(nodeElement.dataset.id);
  });
  nodesLayer.addEventListener("keydown", (event) => {
    const nodeElement = event.target.closest(".node");
    if (!nodeElement || event.key !== "Enter") return;
    selectNode(nodeElement.dataset.id);
  });

  inspector.addEventListener("input", (event) => {
    const field = event.target.dataset.field;
    if (!field) return;
    updateSelectedField(field, event.target.value);
  });

  inspector.addEventListener("change", (event) => {
    const field = event.target.dataset.field;
    if (field) updateSelectedField(field, event.target.value);

    if (event.target.id === "imageUpload") {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        updateSelectedField("image", String(reader.result || ""));
        renderInspector();
        showToast("Immagine caricata");
      };
      reader.readAsDataURL(file);
    }
  });

  inspector.addEventListener("click", (event) => {
    if (event.target.id === "duplicateBtn") duplicateSelected();
    if (event.target.id === "deleteBtn") deleteSelected();
    if (event.target.id === "snapLaneBtn") snapSelectedToLane();
    if (event.target.id === "copyPromptBtn") {
      const selected = getSelectedNode();
      if (!selected) return;
      navigator.clipboard?.writeText(makeImagePrompt(selected));
      showToast("Prompt copiato");
    }
  });
}

function startDrag(event) {
  if (state.interactionMode !== "edit") return;
  const nodeElement = event.target.closest(".node");
  if (!nodeElement) return;
  if (event.button !== 0) return;

  const selected = state.nodes.find((item) => item.id === nodeElement.dataset.id);
  if (!selected) return;

  selectNode(selected.id);
  const startPoint = screenToWorld(event);
  dragState = {
    id: selected.id,
    offsetX: startPoint.x - selected.x,
    offsetY: startPoint.y - selected.y,
    pointerId: event.pointerId,
    moved: false
  };

  window.addEventListener("pointermove", onDragMove);
  window.addEventListener("pointerup", stopDrag, { once: true });
  event.preventDefault();

  function onDragMove(moveEvent) {
    if (!dragState) return;
    const item = state.nodes.find((entry) => entry.id === dragState.id);
    if (!item) return;
    const point = screenToWorld(moveEvent);
    item.x = clamp(point.x - dragState.offsetX, 70, WORLD.width - WORLD.nodeWidth - 70);
    item.y = clamp(point.y - dragState.offsetY, 82, WORLD.height - WORLD.nodeHeight - 30);
    dragState.moved = true;
    renderNodes();
    renderFlows();
  }

  function stopDrag() {
    window.removeEventListener("pointermove", onDragMove);
    if (dragState) {
      dragState = null;
      saveState();
      renderInspector();
    }
  }
}

function startPan(event) {
  if (event.button !== 0) return;
  if (event.target.closest(".node") && state.interactionMode === "edit") return;
  if (event.target.closest("button, input, select, textarea, label")) return;

  panState = {
    startX: event.clientX,
    startY: event.clientY,
    scrollLeft: stageScroller.scrollLeft,
    scrollTop: stageScroller.scrollTop,
    moved: false
  };

  stageScroller.classList.add("panning");
  window.addEventListener("pointermove", onPanMove);
  window.addEventListener("pointerup", stopPan, { once: true });
  event.preventDefault();

  function onPanMove(moveEvent) {
    if (!panState) return;
    const dx = moveEvent.clientX - panState.startX;
    const dy = moveEvent.clientY - panState.startY;
    if (Math.abs(dx) + Math.abs(dy) > 5) panState.moved = true;
    stageScroller.scrollLeft = panState.scrollLeft - (moveEvent.clientX - panState.startX);
    stageScroller.scrollTop = panState.scrollTop - (moveEvent.clientY - panState.startY);
  }

  function stopPan() {
    window.removeEventListener("pointermove", onPanMove);
    stageScroller.classList.remove("panning");
    if (panState?.moved) {
      suppressNextClick = true;
      window.setTimeout(() => {
        suppressNextClick = false;
      }, 0);
    }
    panState = null;
  }
}

loadState();
setupEvents();
render();
window.setTimeout(() => {
  stageScroller.scrollLeft = 0;
  stageScroller.scrollTop = 0;
}, 0);
