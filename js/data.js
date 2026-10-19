
/* =========================================================
   CURIO MUSEUM
   Shared Data
   Exhibits, Timeline, Facts, Categories and Quiz
   ========================================================= */

"use strict";

(function () {
    const exhibits = [
        {
            id: "tutankhamun",
            title: "Tutankhamun's Tomb",
            category: "Ancient Civilizations",
            categoryId: "ancient-civilizations",
            period: "Ancient Egypt",
            date: "1323 BCE",
            discoveryYear: 1922,
            location: "Valley of the Kings, Egypt",
            image: "https://images.unsplash.com/photo-1767938072548-112727a13266?auto=format&fit=crop&w=1200&q=85",
            imageAlt: "Golden Egyptian funerary mask",
            shortDescription:
                "A remarkable royal tomb that revealed extraordinary treasures from ancient Egyptian life.",
            description:
                "Tutankhamun's tomb was discovered by archaeologist Howard Carter in the Valley of the Kings in 1922. Its collection of funerary objects, jewelry, furniture and ceremonial treasures offered an extraordinary glimpse into royal life and ancient Egyptian beliefs.",
            facts: [
                "The tomb was discovered in 1922.",
                "Howard Carter led the archaeological excavation.",
                "The burial chamber contained a richly decorated royal sarcophagus.",
                "The discovery greatly increased public interest in ancient Egypt."
            ],
            significance:
                "The discovery helped historians and archaeologists understand ancient Egyptian burial customs, craftsmanship and royal culture.",
            featured: true,
            tags: ["Egypt", "Archaeology", "Pharaoh", "Artifacts"]
        },
        {
            id: "hubble-telescope",
            title: "The Hubble Space Telescope",
            category: "Science & Technology",
            categoryId: "science",
            period: "Modern Era",
            date: "1990 CE",
            discoveryYear: 1990,
            location: "Low Earth orbit",
            image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=85",
            imageAlt: "Earth viewed from space",
            shortDescription:
                "A space telescope that transformed our view of distant galaxies, stars and the universe.",
            description:
                "Launched in 1990, the Hubble Space Telescope observes the universe above Earth's atmosphere. Its detailed observations have helped scientists investigate distant galaxies, stellar evolution, nebulae and the expansion of the universe.",
            facts: [
                "Hubble launched aboard Space Shuttle Discovery in April 1990.",
                "It observes the universe from above Earth's atmosphere.",
                "Its observations have contributed to thousands of scientific studies.",
                "Astronauts serviced and upgraded the telescope during several missions."
            ],
            significance:
                "Hubble demonstrates how space-based observation can reveal objects and phenomena that are difficult to study from the ground.",
            featured: true,
            tags: ["Space", "Astronomy", "NASA", "Universe"]
        },
        {
            id: "rosetta-stone",
            title: "The Rosetta Stone",
            category: "History & Language",
            categoryId: "history",
            period: "Ancient Egypt",
            date: "196 BCE",
            discoveryYear: 1799,
            location: "Originally from Egypt",
            image: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1200&q=85",
            imageAlt: "Historical artifacts displayed in a museum",
            shortDescription:
                "An inscribed stone that helped scholars unlock the meaning of Egyptian hieroglyphs.",
            description:
                "The Rosetta Stone carries a decree written in three scripts: hieroglyphic, Demotic and ancient Greek. Because scholars could understand ancient Greek, the inscriptions provided an essential clue to deciphering Egyptian hieroglyphs.",
            facts: [
                "French soldiers found the stone in Egypt in 1799.",
                "Its inscription contains three versions of a decree.",
                "Jean-François Champollion made a major breakthrough in decipherment in 1822.",
                "The stone is held by the British Museum."
            ],
            significance:
                "The stone became a key to reading ancient Egyptian inscriptions and understanding a civilization's written history.",
            featured: true,
            tags: ["Language", "Egypt", "Writing", "Archaeology"]
        },
        {
            id: "great-wall",
            title: "The Great Wall of China",
            category: "Ancient Civilizations",
            categoryId: "ancient-civilizations",
            period: "Ancient & Imperial China",
            date: "7th century BCE onward",
            discoveryYear: null,
            location: "Northern China",
            image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=85",
            imageAlt: "The Great Wall winding across mountainous terrain",
            shortDescription:
                "A vast network of fortifications built and expanded across different Chinese dynasties.",
            description:
                "The Great Wall of China is a network of walls and fortifications constructed over many centuries. Different states and dynasties built and expanded sections for defense, border control and communication.",
            facts: [
                "Construction began in different regions during ancient times.",
                "Several dynasties expanded or rebuilt sections of the wall.",
                "Materials varied according to the local landscape.",
                "The Ming dynasty built many of the best-known surviving sections."
            ],
            significance:
                "The Great Wall illustrates the engineering, military planning and political ambitions of successive Chinese states.",
            featured: true,
            tags: ["China", "Architecture", "Engineering", "History"]
        },
        {
            id: "apollo-11",
            title: "Apollo 11 Moon Landing",
            category: "Science & Technology",
            categoryId: "science",
            period: "Space Age",
            date: "1969 CE",
            discoveryYear: 1969,
            location: "Moon",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85",
            imageAlt: "Earth and space viewed from orbit",
            shortDescription:
                "The historic mission that carried the first humans to walk on the Moon.",
            description:
                "NASA's Apollo 11 mission landed astronauts Neil Armstrong and Buzz Aldrin on the Moon in July 1969, while Michael Collins remained in lunar orbit. The mission marked a major achievement in human space exploration.",
            facts: [
                "Apollo 11 launched on 16 July 1969.",
                "Neil Armstrong and Buzz Aldrin walked on the lunar surface.",
                "Michael Collins remained in orbit around the Moon.",
                "The astronauts returned safely to Earth on 24 July 1969."
            ],
            significance:
                "Apollo 11 demonstrated the capabilities of human spaceflight and became a defining milestone in the history of exploration.",
            featured: true,
            tags: ["Moon", "NASA", "Spaceflight", "Exploration"]
        },
        {
            id: "leonardo-sketches",
            title: "Leonardo da Vinci's Sketches",
            category: "Art & Inventions",
            categoryId: "inventions",
            period: "Renaissance",
            date: "15th–16th century",
            discoveryYear: null,
            location: "Renaissance Italy",
            image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85",
            imageAlt: "Historic drawings and works of art",
            shortDescription:
                "Drawings that reveal the connections between art, observation, anatomy and engineering.",
            description:
                "Leonardo da Vinci's notebooks contain studies of human anatomy, water, flight, machines and the natural world. His drawings show how close observation and artistic skill could support scientific investigation.",
            facts: [
                "Leonardo worked across art, engineering and natural observation.",
                "His notebooks contain drawings and written reflections.",
                "Some designs explored machines that were not practical to build at the time.",
                "His studies remain important to the history of Renaissance thought."
            ],
            significance:
                "Leonardo's notebooks represent a creative approach to learning that combines observation, experimentation and imagination.",
            featured: false,
            tags: ["Renaissance", "Art", "Engineering", "Inventions"]
        },
        {
            id: "printing-press",
            title: "The Printing Press",
            category: "Art & Inventions",
            categoryId: "inventions",
            period: "Renaissance Europe",
            date: "c. 1450 CE",
            discoveryYear: null,
            location: "Mainz, present-day Germany",
            image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=85",
            imageAlt: "Books arranged on library shelves",
            shortDescription:
                "A printing revolution that helped written knowledge travel farther and faster.",
            description:
                "Johannes Gutenberg developed a practical movable-type printing system in Europe during the fifteenth century. Printing made it possible to produce many copies of a text more efficiently than copying each by hand.",
            facts: [
                "Gutenberg's printing work developed during the fifteenth century.",
                "Movable metal type could be rearranged to print different texts.",
                "Printing helped books circulate more widely.",
                "The technology contributed to major changes in European learning."
            ],
            significance:
                "The spread of printing transformed publishing, education and the circulation of ideas.",
            featured: false,
            tags: ["Books", "Printing", "Education", "Inventions"]
        },
        {
            id: "amazon-rainforest",
            title: "The Amazon Rainforest",
            category: "Nature",
            categoryId: "nature",
            period: "Natural World",
            date: "Present day",
            discoveryYear: null,
            location: "South America",
            image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85",
            imageAlt: "Dense green forest canopy",
            shortDescription:
                "An immense tropical ecosystem known for its extraordinary biodiversity.",
            description:
                "The Amazon rainforest spans a vast area of South America and supports an exceptional variety of plants, animals and microorganisms. Its ecosystems influence regional water cycles and store significant amounts of carbon.",
            facts: [
                "The Amazon basin includes many different habitats.",
                "Its rivers and forests support a great diversity of life.",
                "Indigenous communities have longstanding relationships with the region.",
                "Deforestation and climate change threaten parts of the ecosystem."
            ],
            significance:
                "The Amazon illustrates the importance of biodiversity, ecological connections and conservation.",
            featured: true,
            tags: ["Rainforest", "Wildlife", "Biodiversity", "Environment"]
        },
        {
            id: "stonehenge",
            title: "Stonehenge",
            category: "Ancient Civilizations",
            categoryId: "ancient-civilizations",
            period: "Prehistoric Britain",
            date: "c. 3000–2000 BCE",
            discoveryYear: null,
            location: "Wiltshire, England",
            image: "https://images.unsplash.com/photo-1599833975787-5c143f373c30?auto=format&fit=crop&w=1200&q=85",
            imageAlt: "Ancient stone monument under an open sky",
            shortDescription:
                "A prehistoric monument whose stones preserve clues to ancient communities and rituals.",
            description:
                "Stonehenge was built and modified over many centuries. Its large stones, surrounding earthworks and carefully arranged spaces continue to prompt research into prehistoric engineering, ceremonial practices and the movement of materials.",
            facts: [
                "The monument developed over multiple construction phases.",
                "Some of its stones were transported over considerable distances.",
                "Its original purposes are still studied and debated.",
                "Stonehenge is part of a wider prehistoric landscape."
            ],
            significance:
                "Stonehenge reveals the planning, cooperation and cultural practices of prehistoric communities.",
            featured: false,
            tags: ["Prehistory", "Archaeology", "Monuments", "Britain"]
        },
        {
            id: "blue-whale",
            title: "The Blue Whale",
            category: "Nature",
            categoryId: "nature",
            period: "Natural World",
            date: "Present day",
            discoveryYear: null,
            location: "Oceans worldwide",
            image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1200&q=85",
            imageAlt: "A whale swimming in the ocean",
            shortDescription:
                "The largest known animal, adapted to life in the open ocean.",
            description:
                "The blue whale is a marine mammal that feeds mainly on small crustaceans called krill. Despite its enormous size, it relies on filtering large volumes of seawater to collect these tiny animals.",
            facts: [
                "Blue whales are mammals and breathe air.",
                "Their diet consists mainly of krill.",
                "They communicate using low-frequency sounds.",
                "Ship strikes, entanglement and ocean changes remain conservation concerns."
            ],
            significance:
                "Blue whales demonstrate the remarkable adaptations of marine mammals and the importance of ocean conservation.",
            featured: false,
            tags: ["Ocean", "Wildlife", "Marine Life", "Conservation"]
        },
        {
            id: "light-bulb",
            title: "The Electric Light Bulb",
            category: "Art & Inventions",
            categoryId: "inventions",
            period: "Industrial & Modern Era",
            date: "19th century",
            discoveryYear: null,
            location: "Developed through work in multiple countries",
            image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=85",
            imageAlt: "A glowing light bulb",
            shortDescription:
                "An invention refined by many researchers that changed everyday life after dark.",
            description:
                "The practical electric light bulb emerged through decades of experimentation by multiple inventors. Improvements in filaments, electrical systems and manufacturing helped electric lighting become more widely available.",
            facts: [
                "Many inventors contributed to electric lighting.",
                "Practical incandescent lamps improved during the nineteenth century.",
                "Electric lighting changed homes, workplaces and public spaces.",
                "Modern lighting technologies include LEDs and other efficient systems."
            ],
            significance:
                "Electric lighting shows how scientific research, engineering and infrastructure can combine to transform daily life.",
            featured: false,
            tags: ["Electricity", "Technology", "Industry", "Inventions"]
        },
        {
            id: "venus",
            title: "A Day on Venus",
            category: "Science & Technology",
            categoryId: "science",
            period: "Solar System",
            date: "Present day",
            discoveryYear: null,
            location: "Venus",
            image: "https://images.unsplash.com/photo-1614732484003-ef9881555dc3?auto=format&fit=crop&w=1200&q=85",
            imageAlt: "A planet in deep space",
            shortDescription:
                "A nearby world with a slow rotation and an extreme, heat-trapping atmosphere.",
            description:
                "Venus has a dense atmosphere dominated by carbon dioxide and surface temperatures hot enough to melt lead. Its rotation is unusually slow, making one sidereal rotation longer than its orbital year.",
            facts: [
                "Venus is the second planet from the Sun.",
                "Its surface is extremely hot due to a powerful greenhouse effect.",
                "It rotates in the opposite direction to most planets.",
                "Its atmosphere exerts crushing pressure at the surface."
            ],
            significance:
                "Venus helps planetary scientists study atmospheres, climate processes and the evolution of rocky planets.",
            featured: false,
            tags: ["Venus", "Astronomy", "Planets", "Space"]
        }
    ];

    const categories = [
        {
            id: "all",
            name: "All Discoveries",
            description: "Explore every collection in the Curio museum."
        },
        {
            id: "history",
            name: "History",
            description: "Objects, events and ideas that shaped human societies."
        },
        {
            id: "ancient-civilizations",
            name: "Ancient Civilizations",
            description: "Discover ancient societies, monuments and artifacts."
        },
        {
            id: "science",
            name: "Science & Technology",
            description: "Explore scientific discoveries and human innovation."
        },
        {
            id: "inventions",
            name: "Art & Inventions",
            description: "Meet the creative ideas that changed the world."
        },
        {
            id: "nature",
            name: "Nature",
            description: "Discover the diversity and complexity of our planet."
        }
    ];

    const timeline = [
        {
            id: "early-civilizations",
            year: "c. 3000 BCE",
            sortYear: -3000,
            title: "The Rise of Early Civilizations",
            category: "Ancient Civilizations",
            categoryId: "ancient-civilizations",
            description:
                "Cities, organized governments, trade and writing developed in several early civilizations.",
            exhibitIds: ["tutankhamun", "rosetta-stone"]
        },
        {
            id: "stonehenge-period",
            year: "c. 3000–2000 BCE",
            sortYear: -2500,
            title: "Stonehenge Takes Shape",
            category: "Archaeology",
            categoryId: "ancient-civilizations",
            description:
                "Communities in prehistoric Britain constructed and modified the monument over many generations.",
            exhibitIds: ["stonehenge"]
        },
        {
            id: "rosetta-decree",
            year: "196 BCE",
            sortYear: -196,
            title: "The Rosetta Stone Decree",
            category: "History & Language",
            categoryId: "history",
            description:
                "A royal decree was inscribed in three scripts, later helping scholars decipher Egyptian hieroglyphs.",
            exhibitIds: ["rosetta-stone"]
        },
        {
            id: "renaissance",
            year: "15th–16th century",
            sortYear: 1450,
            title: "The Renaissance",
            category: "Art & Ideas",
            categoryId: "inventions",
            description:
                "Artists, scholars and inventors explored new approaches to art, science and the natural world.",
            exhibitIds: ["leonardo-sketches", "printing-press"]
        },
        {
            id: "printing-revolution",
            year: "c. 1450 CE",
            sortYear: 1450.5,
            title: "Movable-Type Printing in Europe",
            category: "Inventions",
            categoryId: "inventions",
            description:
                "Printing made the reproduction of written works more efficient and helped ideas circulate more widely.",
            exhibitIds: ["printing-press"]
        },
        {
            id: "rosetta-discovery",
            year: "1799 CE",
            sortYear: 1799,
            title: "The Rosetta Stone Is Found",
            category: "Archaeology",
            categoryId: "history",
            description:
                "The discovery of the inscribed stone provided a vital clue to the reading of ancient Egyptian hieroglyphs.",
            exhibitIds: ["rosetta-stone"]
        },
        {
            id: "tomb-discovery",
            year: "1922 CE",
            sortYear: 1922,
            title: "Tutankhamun's Tomb Is Discovered",
            category: "Archaeology",
            categoryId: "ancient-civilizations",
            description:
                "Howard Carter's excavation brought a remarkable collection of ancient Egyptian royal objects to wider attention.",
            exhibitIds: ["tutankhamun"]
        },
        {
            id: "hubble-launch",
            year: "1990 CE",
            sortYear: 1990,
            title: "The Hubble Space Telescope Launches",
            category: "Science & Technology",
            categoryId: "science",
            description:
                "A space telescope began observing the universe above Earth's atmosphere.",
            exhibitIds: ["hubble-telescope"]
        }
    ];

    const facts = [
        {
            id: "fact-printing",
            title: "Ideas in Print",
            category: "Inventions",
            categoryId: "inventions",
            description:
                "Movable-type printing helped make books and written ideas more widely available.",
            exhibitId: "printing-press"
        },
        {
            id: "fact-hubble",
            title: "A View Beyond Earth",
            category: "Science",
            categoryId: "science",
            description:
                "Space telescopes observe distant objects without looking through Earth's atmosphere.",
            exhibitId: "hubble-telescope"
        },
        {
            id: "fact-rosetta",
            title: "Three Scripts, One Key",
            category: "History",
            categoryId: "history",
            description:
                "The Rosetta Stone's parallel inscriptions helped scholars decipher hieroglyphs.",
            exhibitId: "rosetta-stone"
        },
        {
            id: "fact-blue-whale",
            title: "Giants of the Ocean",
            category: "Nature",
            categoryId: "nature",
            description:
                "Blue whales feed mainly on tiny krill despite being the largest known animals.",
            exhibitId: "blue-whale"
        },
        {
            id: "fact-venus",
            title: "A Slow-Spinning World",
            category: "Space",
            categoryId: "science",
            description:
                "Venus rotates so slowly that one sidereal rotation takes longer than its year.",
            exhibitId: "venus"
        },
        {
            id: "fact-stonehenge",
            title: "A Monument Built Over Time",
            category: "Archaeology",
            categoryId: "ancient-civilizations",
            description:
                "Stonehenge was built and modified through multiple phases in prehistoric Britain.",
            exhibitId: "stonehenge"
        }
    ];

    const quizQuestions = [
        {
            id: "q1",
            category: "Science",
            question: "Which space telescope launched in 1990?",
            options: [
                "James Webb Space Telescope",
                "Hubble Space Telescope",
                "Kepler Space Telescope",
                "Spitzer Space Telescope"
            ],
            answer: 1,
            explanation:
                "The Hubble Space Telescope launched in April 1990 and has made important observations of the universe."
        },
        {
            id: "q2",
            category: "History",
            question: "Which artifact helped scholars decipher Egyptian hieroglyphs?",
            options: [
                "The Rosetta Stone",
                "The Antikythera Mechanism",
                "The Cyrus Cylinder",
                "The Dead Sea Scrolls"
            ],
            answer: 0,
            explanation:
                "The Rosetta Stone contains a decree in three scripts, including ancient Greek."
        },
        {
            id: "q3",
            category: "Space",
            question: "In which year did Apollo 11 land humans on the Moon?",
            options: [
                "1959",
                "1965",
                "1969",
                "1975"
            ],
            answer: 2,
            explanation:
                "Apollo 11 landed on the Moon in July 1969."
        },
        {
            id: "q4",
            category: "Ancient Civilizations",
            question: "Who led the excavation associated with Tutankhamun's tomb discovery?",
            options: [
                "Louis Leakey",
                "Howard Carter",
                "Heinrich Schliemann",
                "Arthur Evans"
            ],
            answer: 1,
            explanation:
                "Howard Carter led the excavation when the tomb was discovered in 1922."
        },
        {
            id: "q5",
            category: "Nature",
            question: "What is the main food of blue whales?",
            options: [
                "Seaweed",
                "Small fish only",
                "Krill",
                "Squid only"
            ],
            answer: 2,
            explanation:
                "Blue whales feed mainly on krill, tiny crustaceans found in the ocean."
        },
        {
            id: "q6",
            category: "Inventions",
            question: "Which technology helped printed books circulate more widely in Europe?",
            options: [
                "The compass",
                "Movable-type printing",
                "The telescope",
                "The steam locomotive"
            ],
            answer: 1,
            explanation:
                "Movable-type printing made it easier to reproduce texts in multiple copies."
        },
        {
            id: "q7",
            category: "Ancient Civilizations",
            question: "Stonehenge is located in which present-day country?",
            options: [
                "Italy",
                "Egypt",
                "China",
                "England"
            ],
            answer: 3,
            explanation:
                "Stonehenge stands in Wiltshire, England."
        },
        {
            id: "q8",
            category: "Space",
            question: "Which planet has a very dense carbon-dioxide atmosphere and an extremely hot surface?",
            options: [
                "Mars",
                "Venus",
                "Mercury",
                "Neptune"
            ],
            answer: 1,
            explanation:
                "Venus has an intense greenhouse effect that makes its surface extremely hot."
        },
        {
            id: "q9",
            category: "Art & Inventions",
            question: "Leonardo da Vinci is especially known for combining art with which other interests?",
            options: [
                "Only poetry",
                "Only music",
                "Science and engineering",
                "Only architecture"
            ],
            answer: 2,
            explanation:
                "Leonardo's notebooks include studies of anatomy, mechanics, nature and engineering."
        },
        {
            id: "q10",
            category: "Ancient Civilizations",
            question: "The Great Wall is associated with which country?",
            options: [
                "India",
                "China",
                "Greece",
                "Mexico"
            ],
            answer: 1,
            explanation:
                "The Great Wall is a network of fortifications built and expanded in China over many centuries."
        }
    ];

    const data = {
        brand: {
            name: "Curio",
            tagline: "The Museum of Everything Worth Discovering",
            description:
                "A digital museum exploring history, science, nature, creativity and human curiosity."
        },

        categories: categories,
        exhibits: exhibits,
        timeline: timeline,
        facts: facts,
        quizQuestions: quizQuestions,

        getExhibitById: function (id) {
            return exhibits.find(function (exhibit) {
                return exhibit.id === id;
            }) || null;
        },

        getCategoryById: function (id) {
            return categories.find(function (category) {
                return category.id === id;
            }) || null;
        },

        getExhibitsByCategory: function (categoryId) {
            if (!categoryId || categoryId === "all") {
                return exhibits.slice();
            }

            return exhibits.filter(function (exhibit) {
                return exhibit.categoryId === categoryId;
            });
        },

        getFeaturedExhibits: function () {
            return exhibits.filter(function (exhibit) {
                return exhibit.featured;
            });
        },

        searchExhibits: function (query) {
            const normalizedQuery = String(query || "")
                .trim()
                .toLowerCase();

            if (!normalizedQuery) {
                return exhibits.slice();
            }

            return exhibits.filter(function (exhibit) {
                const searchableText = [
                    exhibit.title,
                    exhibit.category,
                    exhibit.period,
                    exhibit.date,
                    exhibit.location,
                    exhibit.shortDescription,
                    exhibit.description
                ]
                    .concat(exhibit.tags || [])
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(normalizedQuery);
            });
        },

        getTimeline: function (categoryId) {
            const events = categoryId && categoryId !== "all"
                ? timeline.filter(function (event) {
                    return event.categoryId === categoryId;
                })
                : timeline.slice();

            return events.sort(function (a, b) {
                return a.sortYear - b.sortYear;
            });
        },

        getRandomQuizQuestions: function (count) {
            const shuffled = quizQuestions.slice();

            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));

                const temp = shuffled[i];
                shuffled[i] = shuffled[j];
                shuffled[j] = temp;
            }

            const requestedCount = Number.isFinite(Number(count))
                ? Math.max(0, Math.floor(Number(count)))
                : shuffled.length;

            return shuffled.slice(
                0,
                Math.min(requestedCount, shuffled.length)
            );
        }
    };

    // Expose shared data to the other JavaScript files.
    window.CURIO_DATA = data;

})();
