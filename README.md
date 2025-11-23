# Quiz-App-Lag-6

**Gruppdeltagare:** Jesper Reijs, Kalle Salomonsson, Douglas Netzel, Ella Gabari & Moa Sjöberg.

Välkommen till vår quiz-app – **Quizmas**!

---

## 🎄 Beskrivning

Vår quizapp har ett tydligt jultema rakt igenom och börjar på en startsida där man kan skriva in sitt namn.  
Om inget namn skrivs in får man automatiskt namnet **"Tomtenisse"**. Namnet sparas sedan för poängställningen.

På startsidan får man också valet att acceptera eller neka cookies, som används för att samla in data till Google Analytics.

Här finns också knappar, varav vissa följer med i hela flödet:

- **Credits-knapp** (visas bara på startsidan)
- **Mute-knapp**
- **Snöflinge-toggle**
- **Highscore-knapp** (sparas via LocalStorage)

---

## 🎅 Flöde

När man klickar _Starta_ kommer man till temaväljaren där man kan välja mellan fyra olika teman.

När ett tema valts:

- En timer startar för varje fråga
- Timern stoppas när man svarar
- En _Nästa fråga_-knapp visas
- När alla frågor är klara visas resultatet och de rätta svaren
- Man kan då välja att starta ett nytt quiz

---

## 🔧 Styrkor och svagheter

### **Styrkor**

- Starkt designkoncept - tydligt tema och konsekvent design
- Logiskt flöde och tydligt flödesschema från start (visualiserat i Miro)
- Funktionalitet, struktur och användarupplevelse.
- Bra samarbete och kodgranskning
- Kommentarer i koden förklarar vad alla delar gör
- Kod har krävt **2 approvals** innan merge.

### **Svagheter**

- Vi har arbetat med få moduler → vilket skapade fler merge conflicts

---
