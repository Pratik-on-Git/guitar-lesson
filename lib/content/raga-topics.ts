import type { Block, Topic } from "./types.ts";
import { CARNATIC_SVARAS, HINDUSTANI_POSITIONS, THAATS, CHAKRAS, MELAKARTAS } from "../music/raga.ts";

const p = (text: string): Block => ({ type: "p", text });
const term = (t: string, text: string): Block => ({ type: "term", term: t, text });
const list = (...items: string[]): Block => ({ type: "list", items });
const table = (columns: string[], rows: string[][], caption?: string): Block => ({ type: "table", columns, rows, caption, firstColumnHeader: true });
const tip = (title: string, text: string): Block => ({ type: "callout", tone: "tip", title, text });
const fix = (title: string, text: string): Block => ({ type: "callout", tone: "fix", title, text });
const links = (...items: [string, string][]): Block => ({ type: "links", items: items.map(([label, href]) => ({ label, href })) });

// Page-by-page evidence: docs/raga-review.md. The supplied PDF has no identified
// author/date. Correction notes distinguish factual errors from taught variants.
export const RAGA_TOPICS: Topic[] = [
  {
    slug: "indian-classical",
    title: "Indian classical music & raga",
    description: "Hindustani and Carnatic traditions, svaras, raga grammar, ten thaats, all 72 melakartas, 35 tala variants, gamakas and guided raga listening studies.",
    sections: [
      {
        id: "traditions",
        title: "Two traditions: Hindustani and Carnatic",
        blocks: [
          p("Hindustani music is associated with northern South Asia; Carnatic music with South India. Both have long, interconnected histories and are now practised worldwide. Raga supplies a melodic framework; tala organises recurring rhythmic cycles."),
          p("Their differentiation was gradual over the medieval and early modern periods. Persian and Central Asian influences and court patronage helped shape Hindustani practice. The shared theoretical heritage includes the Natyashastra and Sarngadeva’s 13th-century Sangita Ratnakara."),
          fix("History: a gradual development", "The source’s Mughal-period explanation is too narrow: the development of distinct northern and southern traditions began earlier and continued over centuries."),
          tip("Reading this lesson", "Pitch tables compare with 12-tone equal temperament, with Sa = C. They do not prescribe performance tuning or equate a raga with a Western scale."),
          links(["History: NIOS, chapter 1", "https://nios.ac.in/media/documents/Carnatic_Music_243/carnaticmusicbook1/ch1.pdf"]),
        ],
      },
      {
        id: "shruti-svara",
        title: "Shruti, svara and the movable tonic",
        blocks: [
          term("Shruti", "A term for fine pitch distinctions in music theory; ancient accounts describe 22 shrutis in an octave. This is not a division into 22 equal steps or a universal measurement of the smallest difference any human can hear. In practical usage, shruti can also refer to the tonic pitch reference."),
          term("Svara", "A musical note or scale degree. The seven basic names are Sa, Re (Ri in Carnatic usage), Ga, Ma, Pa, Dha and Ni. An octave register is called saptak in Hindustani usage and sthayi in Carnatic usage."),
          p("Sa is the tonic chosen for the performance. Sa and Pa are invariant relative degrees (achal / prakriti); the other five have variable forms (vikrit / vikriti). ‘Fixed’ concerns their relationship to Sa, not an absolute frequency. Pa can be omitted from a raga even though its pitch form is invariant."),
          p("Twelve nominal pitch positions provide a useful map to a fretted guitar or keyboard. Actual intonation and movement between notes depend on musical context and ornamentation."),
          p("The principal registers are mandra (lower), madhya (middle) and taar / tara (upper). Dots below and above notes often indicate lower and upper registers; notation systems differ."),
          links(["Pitch and intonation: Rao & Rao", "https://dspace.library.iitb.ac.in/jspui/handle/100/16817?mode=simple"]),
        ],
      },
      {
        id: "hindustani-svaras",
        title: "Hindustani svaras: 12 positions",
        blocks: [
          table(
            ["Semitones from Sa", "Name", "Notation here", "Western (Sa = C)"],
            HINDUSTANI_POSITIONS.map((s, semitones) => [String(semitones), s.name, s.symbol, s.western]),
            "Equal-tempered pitch-class comparisons; Sa is movable in performance.",
          ),
          p("Re, Ga, Dha and Ni each have shuddha and komal forms; Ma has shuddha and tivra forms. There is no komal Ma in this system. Komal is the lower form; tivra Ma is the raised fourth. Sa and Pa have no altered forms in this naming scheme."),
          tip("Notation used throughout", "Lowercase re, ga, dha and ni mean komal. Ma means shuddha Ma; Ḿa means tivra Ma. Sa′ means upper Sa, and a leading comma marks a lower-register note, as in ,ni. Other books use different symbols."),
          links(["Hindustani notation and terms: Tanarang", "https://tanarang.com/glossary-of-terms-in-hindustani-classical-music/"]),
        ],
      },
      {
        id: "carnatic-svaras",
        title: "Carnatic svaras: 16 names, 12 positions",
        blocks: [
          p("In the 16-name melakarta convention, Ri, Ga, Dha and Ni each have three names, Ma has two, and Sa and Pa one each. Four pairs share nominal positions: R2/G1, R3/G2, D2/N1 and D3/N2."),
          table(
            ["Semitones from Sa", "Name(s)", "Symbol(s)", "Western (Sa = C)"],
            HINDUSTANI_POSITIONS.map((_, semitones) => {
              const svaras = CARNATIC_SVARAS.filter((s) => s.semitones === semitones);
              return [String(semitones), svaras.map((s) => s.name).join(" / "), svaras.map((s) => s.symbol).join(" / "), svaras.map((s) => s.western).join(" / ")];
            }),
            "Enharmonic spellings show note roles: G1 = E𝄫 and N1 = B𝄫. Shared nominal positions do not imply identical gamaka treatments.",
          ),
          tip("Reading the PDF accurately", "The source’s pp. 3–4 list some variants out of pitch order, but print the double flats for shuddha Ga and Ni correctly. Its merged cells on pp. 7–8 also correctly group shared positions. Text extraction can lose these symbols and cell relationships."),
        ],
      },
      {
        id: "comparison",
        title: "Carnatic, Hindustani and Western names compared",
        blocks: [
          table(
            ["Semitones", "Carnatic", "Hindustani", "Western (Sa = C)"],
            HINDUSTANI_POSITIONS.map((s, semitones) => [String(semitones), CARNATIC_SVARAS.filter((c) => c.semitones === semitones).map((c) => c.symbol).join(" / "), s.name + " (" + s.symbol + ")", s.western]),
            "Pitch-class correspondences only. Full Carnatic names and enharmonic spellings appear above.",
          ),
          tip("Shuddha has different meanings", "Hindustani shuddha notes form the Bilawal collection. In Carnatic naming, shuddha Ri, Ga, Dha and Ni are their lowest variants: R1, G1, D1 and N1. The same adjective does not indicate the same pitch in both traditions."),
        ],
      },
      {
        id: "what-is-raga",
        title: "What a raga is",
        blocks: [
          p("A raga is a melodic framework with a recognisable identity. Its grammar includes characteristic movement, emphasis, phrase endings and ornaments. Traditional mood (rasa), time-of-day and seasonal associations also inform Hindustani practice."),
          p("Jati describes the number of distinct note degrees in ascent and descent. Repeating Sa at the octave does not add another degree:"),
          list("Sampurna — seven notes", "Shadav / shadava — six notes", "Audav / audava — five notes"),
          p("Classify ascent and descent separately: audav–sampurna means five ascending and seven descending degrees. A conventional Hindustani teaching rule requires at least five notes. It is not universal across traditions: Carnatic classifications also recognise ragas with fewer notes."),
          fix("Five is a minimum in the teaching rule", "PDF p. 1 gives five notes as a requirement without saying ‘at least’. Six- and seven-note ragas are also valid."),
          links(["Raga and its elements: NIOS", "https://nios.ac.in/media/documents/Hindustani_Music_242/hindustanimusictheorybook1/HMB1Ch2.pdf"]),
        ],
      },
      {
        id: "raga-vs-scale",
        title: "Raga versus scale: three Kafi-family examples",
        blocks: [
          p("A scale describes an ordered pitch collection. A raga also specifies how notes behave in phrases. Bhimpalasi and Bageshree are conventionally grouped under Kafi thaat, yet their movement and treatment of Pa and Dha distinguish them."),
          table(
            ["Raga", "Ascent (outline)", "Descent (outline)", "Vadi / samvadi"],
            [
              ["Bhimpalasi", ",ni Sa ga Ma Pa ni Sa′", "Sa′ ni Dha Pa Ma ga Re Sa", "Ma / Sa"],
              ["Bageshree (one taught form)", "Sa Re ga Ma Dha ni Sa′", "Sa′ ni Dha Ma Pa Dha Ma ga Re Sa", "Ma / Sa"],
              ["Dhani (pentatonic form)", "Sa ga Ma Pa ni Sa′", "Sa′ ni Pa Ma ga Sa", "ga / ni"],
            ],
            "Outlines follow Tanarang’s teaching descriptions, simplifying phrase extensions. Ma = shuddha Ma; ga and ni = komal; Sa′ = upper Sa; ,ni = lower ni. Listen to the linked renditions.",
          ),
          p("Bhimpalasi omits Re and Dha in ascent and includes them in descent. Bageshree has several taught forms: Tanarang’s includes Re in ascent, while other versions omit it. Pa is omitted in ascent and restrained or used in characteristic turns in descent."),
          p("Dhani is commonly taught without Re and Dha in either direction. Tanarang also documents an older six-note descent and occasional touches of Re. The PDF’s alpa-Re example belongs to that variant; Re is not mandatory in the pentatonic form."),
          links(
            ["Bhimpalasi: notes and renditions", "https://tanarang.com/raag-bheempalasi/"],
            ["Bageshree: documented alternatives", "https://tanarang.com/raag-bageshree/"],
            ["Dhani: pentatonic form and Re variant", "https://tanarang.com/raag-dhani/"],
          ),
        ],
      },
      {
        id: "raga-elements",
        title: "Defining elements of a raga",
        blocks: [
          term("Aroha / arohana and avaroha / avarohana", "Ascending and descending movement. Either may be vakra (turning or zig-zag). Their note sets can differ."),
          term("Pakad and chalan", "Pakad is a characteristic identifying phrase; chalan is the broader pattern of melodic movement. A pitch list alone leaves both out."),
          term("Vadi and samvadi", "In Hindustani descriptions, vadi is the principal note and samvadi the next in importance. They are commonly described as a fourth or fifth apart. The tonic remains Sa. Bhimpalasi’s usual pair is shuddha Ma and Sa."),
          term("Jiva / jeeva and amsha", "Terms for notes important to a raga’s identity. Usage depends on the theoretical tradition; Carnatic descriptions may identify several jiva svaras. Do not assume both traditions use an identical vadi–samvadi hierarchy."),
          term("Anuvadi, vivadi and varjya", "In Hindustani terminology, anuvadi notes are the other regular notes besides vadi and samvadi. Vivadi notes are outside the regular framework and, where accepted, occur in restricted phrases. Varjya means omitted. Carnatic vivadi terminology has a different theoretical context."),
          term("Nyasa", "A point of repose or phrase ending. Suitable resting notes depend on the raga and phrase. Tanarang lists Sa, Ma and Pa as principal resting places in Bhimpalasi; the PDF’s longer list is not an exhaustive universal rule."),
          term("Deergha / dirgha and alpa", "Dirgha means prolonged; alpa means sparingly used or weakly presented. These describe treatment within a raga, not just whether a note appears in its scale."),
          fix("Vadi is not the tonic", "PDF p. 2 conflates the principal note with the root. Sa is the tonic; vadi may be another degree. Its Re/Dha dirgha example in Bhimpalasi is not established as a general rule by the references used here. Those notes occur in descent; omission from ascent alone does not determine their duration."),
        ],
      },
      {
        id: "classification",
        title: "Historical classification and the ten thaats",
        blocks: [
          term("Grama, murchhana and jati", "Ancient theory discusses Shadja and Madhyama gramas as tonal systems, murchhanas as successive note sequences beginning on different degrees, and jatis as melodic types with rules. These precede modern classification; gramas are not simply modern thaats under older names."),
          term("Raga–ragini families", "Historical schemes personified ragas as family groups, with raginis and offspring called ragaputras and ragaputris. Lists varied. Ragamala series often show six principal ragas, each with five or six raginis. This is cultural history rather than a modern parent-scale method."),
          term("Thaat", "Bhatkhande’s influential Hindustani system uses ten seven-note parent collections. A thaat is an ascending scale for classification, not a raga to be performed. Some assignments are approximate or disputed; ten thaats do not exhaust all possible seven-note collections."),
          table(
            ["Thaat", "Notes", "Western pitch collection", "Example raga"],
            THAATS.map((t) => [t.name, t.notes, t.comparison, t.example]),
            "Comparisons use the same tonic. A raga may omit notes or use variants not captured by its thaat.",
          ),
          links(
            ["Historical tonal systems: SPMVV", "https://spmvv.ac.in/ddefiles/ugcproposals/2025/05/MAMUD1_1_Origin_and_Evolution_of_Music_I.pdf"],
            ["Ragamala families: Metropolitan Museum of Art", "https://resources.metmuseum.org/resources/metpublications/pdf/The_Art_of_South_and_Southeast_Asia_A_Resource_for_Educators.pdf"],
          ),
        ],
      },
      {
        id: "carnatic-raga",
        title: "Carnatic ragas: janaka and janya",
        blocks: [
          p("Melakarta (janaka) ragas are parents in the modern Carnatic classification. Janya ragas are associated with a parent but may omit notes, use vakra movement or differ in ascent and descent. Upanga ragas use only their parent’s notes; bhashanga ragas also admit anya svaras, notes foreign to the parent."),
          p("A janya relationship does not prove that a raga was historically invented from that parent. Several parent assignments may be possible when notes are omitted; tradition and melodic affinity also matter."),
          p("The Carnatic Trinity is Tyagaraja (1767–1847), Muthuswami Dikshitar (1775–1835) and Syama Sastri (1762–1827). Their lives and compositions span the late 18th and early 19th centuries."),
          fix("Parent scales and chronology", "PDF p. 4 misuses thaat for groups of southern derivative ragas. Use melakarta / janaka for the parent and janya for the associated raga. Its 18th-century label for the Trinity leaves out their substantial 19th-century activity."),
          links(["Trinity biographies: NIOS, chapter 3", "https://nios.ac.in/media/documents/Carnatic_Music_243/carnaticmusicbook1/ch3.pdf"]),
        ],
      },
      {
        id: "melakarta",
        title: "How the 72 melakartas are constructed",
        blocks: [
          p("Venkatamakhin’s 17th-century Chaturdandi Prakashika is a landmark in 72-mela classification. The modern regular sampurna scheme is associated with later standardisation by Govindacharya. Distinguish it from the asampurna tradition followed by Muthuswami Dikshitar. Dates for the later standardisation vary between accounts."),
          p("The modern scheme requires a complete, straight ascent and descent with the same seven degrees, including Sa and Pa, and reaching upper Sa:"),
          list(
            "Choose one Ma: M1 or M2.",
            "Choose Ri below Ga: R1G1, R1G2, R1G3, R2G2, R2G3 or R3G3.",
            "Choose Dha below Ni: D1N1, D1N2, D1N3, D2N2, D2N3 or D3N3.",
          ),
          p("Two Ma choices × six Ri–Ga pairs × six Dha–Ni pairs = 72. Shared positions cannot supply successive degrees in the same straight scale: R2G1 and D2N1, for example, are excluded."),
          term("Madhyama halves", "Numbers 1–36 use M1; 37–72 use M2. Replacing M1 with M2 in scale n in the first half gives n + 36; other degrees stay the same."),
          tip("Sampurna is not sufficient", "A seven-note raga may be vakra, use different ascending and descending forms, or admit extra variants. Thaats and melakartas have comparable classification roles but differ in rules and historical practice."),
          links(["Mela rules and gamaka classifications: NIOS", "https://nios.ac.in/media/documents/Carnatic_Music_243/carnaticmusicbook1/ch2.pdf"]),
        ],
      },
      {
        id: "katapayadi",
        title: "Katapayadi numbering and the twelve chakras",
        blocks: [
          p("Katapayadi associates consonants with digits. In standard melakarta names, the first two encoded digits, reversed, give the number. Vowels carry no value; precise consonants matter, so simplified Roman spelling alone is not a reliable general decoder."),
          p("Harikambhoji: ha = 8, ri = 2 → 28. Dhirashankarabharanam: dhi = 9, ra = 2 → 29. Mechakalyani: ma = 5, cha = 6 → 65 (unaspirated ca, often written ‘cha’ in English)."),
          p("Each chakra contains six scales. Ri, Ga and Ma stay constant within it; Dha–Ni follows D1N1, D1N2, D1N3, D2N2, D2N3, D3N3. Chakra names are traditional numeric mnemonics:"),
          table(
            ["#", "Chakra", "Mnemonic", "Melakartas"],
            CHAKRAS.map((c, i) => [String(i + 1), c.name, c.meaning, (i * 6 + 1) + "–" + (i * 6 + 6)]),
          ),
          fix("Use the source’s own chart errata", "The wheel on PDF p. 6 swaps Sarasangi and Harikambhoji and mislabels D2N3 combinations on its M2 half. Its caption already identifies both mistakes. Correct values: Sarasangi 27, Harikambhoji 28 and D2N3 (or N3D2 when printed in reverse order)."),
          links(["Mela numbering and parent assignments: SPMVV", "https://spmvv.ac.in/ddefiles/ugcproposals/2025/05/MAMUD1_2_Musical_Concepts_I.pdf"]),
        ],
      },
      {
        id: "melakarta-chart",
        title: "All 72 melakartas: corrected chart",
        blocks: [
          p("This table replaces the source wheel with the modern sampurna list in number order. Roman spellings vary. Each row lists seven degrees: add upper S to complete the ascent, then reverse it for descent."),
          table(
            ["#", "Melakarta", "Chakra", "Svaras", "Western (Sa = C)"],
            MELAKARTAS.map((m) => [String(m.number), m.name, m.chakra, m.svaras.join(" "), m.western.join(" ")]),
            "Western notes are 12-TET comparisons; the pitch list does not supply a raga’s characteristic gamakas.",
          ),
          p("Useful pitch-collection comparisons: Hanumatodi (8) with Phrygian / Bhairavi thaat; Mayamalavagowla (15) with double harmonic major / Bhairav; Natabhairavi (20) with natural minor / Asavari; Kharaharapriya (22) with Dorian / Kafi; Harikambhoji (28) with Mixolydian / Khamaj; Dhirashankarabharanam (29) with major / Bilawal; Mechakalyani (65) with Lydian / Kalyan. These do not make the ragas interchangeable."),
        ],
      },
      {
        id: "gamaka",
        title: "Gamaka and melodic ornamentation",
        blocks: [
          p("Gamaka includes movements on and between notes that help establish a raga’s identity. Learn its shapes through phrases and renditions. Historical classifications vary; no single count is a universal checklist for present-day performance."),
          p("The fifteen-gamaka classification associated with Sangita Ratnakara is commonly transliterated as:"),
          list("Tiripa", "Sphurita", "Kampita", "Lina", "Andolita", "Vali", "Tribhinna", "Kurula", "Ahata", "Ullasita", "Plavita", "Humpita", "Mudrita", "Namita", "Mishrita"),
          p("A tenfold Carnatic classification (dashavidha gamakas) is also taught; NIOS distinguishes it from the historical fifteenfold list. Hindustani practical terms include meend (glide), kan (grace note), andolan (oscillation), gamak (forceful oscillatory movement) and murki (quick ornamental turn). Execution depends on the raga and style."),
          tip("On guitar", "Bends and slides explore continuous pitch movement; hammer-ons and pull-offs can suggest grace notes. Match the contour, timing and target pitches of a taught phrase over a Sa drone. Ordinary vibrato or a scale run does not by itself reproduce a raga’s gamaka."),
        ],
      },
      {
        id: "symbolism",
        title: "Symbolic associations in the supplied notes",
        blocks: [
          p("PDF pp. 8–9 give these cultural and devotional associations without identifying their underlying texts. They are preserved as this source’s beliefs, not as verified universal correspondences, acoustic explanations, anatomy or evidence of therapeutic effects."),
          table(
            ["Svara", "Animal / bird", "Planet", "Colour", "Body chakra (source’s scheme)"],
            [
              ["Sa", "Peacock", "Mercury", "Green", "Muladhara"],
              ["Re", "Bull", "Mars", "Red", "Svadhisthana"],
              ["Ga", "Goat", "Sun", "Golden", "Manipura"],
              ["Ma", "Heron", "Moon", "White", "Anahata"],
              ["Pa", "Cuckoo", "Saturn", "Blue or black", "Vishuddha"],
              ["Dha", "Horse", "Jupiter", "Yellow", "Ajna"],
              ["Ni", "Elephant", "Venus", "Multicoloured", "Sahasrara"],
            ],
            "Reported only from the supplied PDF. These seven body-chakra associations differ from the twelve melakarta classification chakras.",
          ),
        ],
      },
      {
        id: "carnatic-tala-structure",
        title: "Carnatic rhythm: angas, jati and the 35 talas",
        blocks: [
          p("In the suladi sapta-tala scheme, seven patterns combine three kinds of anga. A laghu (L) changes length with jati; a drutam (D) has two counts; an anudrutam (A) has one. The five laghu lengths are tisra 3, chaturasra 4, khanda 5, misra 7 and sankirna 9."),
          table(["Tala", "Angas", "Tisra (3)", "Chaturasra (4)", "Khanda (5)", "Misra (7)", "Sankirna (9)"], [
            ["Dhruva", "L D L L", "11", "14", "17", "23", "29"],
            ["Matya", "L D L", "8", "10", "12", "16", "20"],
            ["Rupaka", "D L", "5", "6", "7", "9", "11"],
            ["Jhampa", "L A D", "6", "7", "8", "10", "12"],
            ["Triputa", "L D D", "7", "8", "9", "11", "13"],
            ["Ata", "L L D D", "10", "12", "14", "18", "22"],
            ["Eka", "L", "3", "4", "5", "7", "9"],
          ], "Counts calculated from the anga patterns: substitute the column’s value for each L, 2 for D, and 1 for A. This is the 35-tala scheme, not a list of every tala in use."),
          tip("Work through the structure", "Chaturasra-jati Triputa gives 4 + 2 + 2 = 8 counts, the familiar Adi tala structure. Keep the groups audible: eight undifferentiated clicks conceal the organisation."),
          links(["Kerala SCERT: Music, Class XI, chapter 4 (tala)", "https://samagra.kite.kerala.gov.in/files/samagra-resource/uploads/tbookscmq/Class_XI/Music/Music.pdf"]),
        ],
      },
      {
        id: "yaman-listening",
        title: "Listening study: Yaman and the raised fourth",
        blocks: [
          p("Tanarang’s Yaman description uses tivra Ma with the other degrees shuddha, assigns Ga and Ni as vadi and samvadi, and places the raga in the first night prahar. Treat these as this teaching source’s conventions. Its melodic examples frequently approach from lower Ni; a straight seven-note ascent alone misses that emphasis."),
          table(["Feature", "Listening task"], [
            ["Pitch material", "Sa Re Ga Ḿa Pa Dha Ni; hear the raised fourth against Sa."],
            ["Lower-register approach", "Notice how lower Ni leads into the middle register rather than treating every phrase as a fresh start on Sa."],
            ["Resting and continuation", "Compare arrivals on Ga or Ni with notes passed through on the way."],
            ["Composition and cycle", "The linked page includes slow Ektal and faster Trital compositions; compare how the melodic identity persists."],
          ]),
          tip("Guitar laboratory", "With Sa = C, the nominal pitch collection is C D E F♯ G A B. First locate F♯ and sing it against a C drone. This is a fretboard orientation exercise, not a complete Yaman phrase or a claim that Yaman is simply Lydian."),
          links(["Tanarang: Yaman description and recorded compositions", "https://tanarang.com/raag-yaman/"]),
        ],
      },
      {
        id: "durga-listening",
        title: "Listening study: Durga and omitted degrees",
        blocks: [
          p("Durga omits Ga and Ni. Tanarang classifies it as audav–audav, groups it under Bilawal, gives Ma / Sa as the principal pair, and associates it with the second night prahar. Its descending outline includes a return from Pa to Dha before moving to Ma: descending does not necessarily mean moving down at every step."),
          table(["Feature", "What to notice"], [
            ["Available degrees", "Sa Re Ma Pa Dha: all five are shuddha."],
            ["Absent degrees", "Listen for the spaces where Ga and Ni would occur in a seven-note collection."],
            ["Phrase direction", "A downward phrase can contain a local upward turn."],
            ["Resting behaviour", "Tanarang advises against resting on Pa in descent; note how a permitted note can still have a restricted role."],
          ]),
          tip("Guitar laboratory", "With Sa = C, locate C D F G A. Sing a short passage from the linked recording before finding it on the instrument. Record whether you copied the direction and ending as well as the pitches."),
          links(["Tanarang: Durga description and recorded compositions", "https://tanarang.com/raag-durga/"]),
        ],
      },
      {
        id: "malkauns-listening",
        title: "Listening study: Malkauns without Re or Pa",
        blocks: [
          p("Malkauns uses Sa, komal ga, shuddha Ma, komal dha and komal ni. Re and Pa are omitted. Tanarang describes an audav–audav raga, with Ma / Sa as the principal pair and a third-night-prahar association. Its examples explore both the lower register and upper Sa."),
          table(["Feature", "Listening task"], [
            ["Pitch material", "Sa ga Ma dha ni; distinguish komal dha from shuddha Dha."],
            ["Missing fifth", "Notice that the melody does not require Pa as a point of support."],
            ["Phrase endings", "Listen for arrivals on Sa and Ma rather than assuming every note is equally stable."],
            ["Register", "Compare the weight of lower dha and ni with the approach to upper Sa."],
          ]),
          tip("Guitar laboratory", "With Sa = C, use C E♭ F A♭ B♭ as a location map. A common C minor-pentatonic box contains G instead of A♭, so it is not this collection. Work slowly over a Sa-only drone and learn the ornament from a specific rendition."),
          links(["Tanarang: Malkauns description and recorded compositions", "https://tanarang.com/raag-malkauns/"]),
        ],
      },
      {
        id: "raga-practice-journal",
        title: "From listening to guitar: a repeatable study journal",
        blocks: [
          p("The following is an original practice workflow for this companion. It is not a traditional composition, a prescribed raga syllabus, or a substitute for learning a rendition with a teacher."),
          list(
            "Identify the recording: write down the performer, raga, composition, tala when stated, and the timestamp of a short phrase.",
            "Establish Sa by listening before choosing a fret. Sing the tonic, then match it on the guitar. The same named raga can be performed at different absolute pitches.",
            "Listen repeatedly without playing. Mark where the phrase begins, where it pauses, and whether its ending feels settled or continuing.",
            "Sing the contour, then locate its main pitches on one string. Add slides or bends only after the arrival pitches and timing are dependable.",
            "Record one imitation. Compare it with the source for approach, duration, ornament and release; matching a list of notes is only one part of the task.",
            "For a metered passage, keep the cycle separately from the melody. Check whether the phrase begins on the first count or approaches it from elsewhere.",
            "Compare a second rendition of the same raga. Record shared behaviour and differences without immediately treating either version as an error.",
          ),
          table(["Journal field", "Example prompt"], [
            ["Pitch", "Which note was my reference, and did my bend arrive accurately?"],
            ["Grammar", "Which note did the phrase settle on? Did I add an absent degree?"],
            ["Rhythm", "Could I maintain the cycle while singing the phrase?"],
            ["Evidence", "Which recording and timestamp support my observation?"],
            ["Next session", "What one detail should I repeat before increasing speed?"],
          ]),
          links(["Practice studio", "/practice"], ["Listening lab", "/listening"], ["Tuning and cents", "/learn/tuning"]),
        ],
      },
      {
        id: "tala-practice",
        title: "Tala and a practical listening path",
        blocks: [
          p("A tala is a recurring rhythmic cycle, not just tempo or beat count. In Hindustani music, matra is the time unit, vibhag a division, sam the first beat, and tali / khali mark clapped / waved divisions. Laya describes tempo."),
          p("Teental has sixteen matras in four divisions of four: clap on 1, clap on 5, wave on 9, clap on 13, then return to sam at 1. Carnatic tala reckoning uses its own angas and gestures; matching beat totals do not imply identical talas."),
          list(
            "Choose a comfortable Sa and sustain or hear a tonic drone.",
            "Compare the linked Bhimpalasi and Dhani renditions, listening for Re and Dha in Bhimpalasi’s descent.",
            "Learn one short phrase with its pitch movement and resting point before extending it.",
            "Clap a tala independently, then follow a composition in that cycle. Unmetered alap need not be fitted into a tala.",
          ),
          links(
            ["Tala terminology and examples: NIOS", "https://nios.ac.in/media/documents/Hindustani_Music_242/hindustanimusictheorybook1/HMB1Ch3.pdf"],
            ["Listening lab", "/listening"],
            ["Tuning and cents", "/learn/tuning"],
          ),
        ],
      },
    ],
  },
];
