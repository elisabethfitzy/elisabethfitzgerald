/*
  ┌──────────────────────────────────────────────────────────────────────┐
  │  ALL SITE CONTENT LIVES HERE.                                        │
  │                                                                      │
  │  Copy, credits, quotes, contact details and every image/video path.  │
  │  Edit this file and the files in content/media, then run             │
  │  `npm run build`. Nothing in src/ needs to change for new content.   │
  │                                                                      │
  │  Everything here is real, taken from the resume PDF. The bio is a    │
  │  first draft written from that resume: edit it freely. Press is      │
  │  empty, so that section is hidden until there are real quotes.       │
  └──────────────────────────────────────────────────────────────────────┘

  Photos: put files in content/media/photos and reference them by `base`
  plus the widths you saved (e.g. base "headshot-olive-top-big-smile-olive-bg"
  with widths [400, 739] means ...-400.jpg and ...-739.jpg exist). The
  originals are 726 to 755px wide, so the large size is the native width
  (never upscaled) and the small size is 400px. `width` and `height` are the
  pixel size of the largest file; they set the aspect ratio so nothing jumps
  while loading. The build writes srcset/sizes for you.
*/

export default {
  meta: {
    title: "Elisabeth Fitzgerald, actor",
    description:
      "Elisabeth Fitzgerald is an actor and singer based in New York. Trailer for All Day Happy Dance, photos, stage credits, training and contact.",
    // Canonical URL. `SITE_URL=... npm run build` overrides it, which the GitHub
    // Pages workflow uses to build for either the custom domain or the
    // username.github.io/repo address. See docs/GITHUB-PAGES.md.
    url: "https://elisabethfitzgerald.com",
    // 1200x630 social preview: the olive-backdrop headshot on an extended backdrop.
    ogImage: "media/og-image.jpg",
    locale: "en_GB",
  },

  person: {
    firstName: "Elisabeth",
    lastName: "Fitzgerald",
    tagline: "Stage and screen. New York.",
    location: "New York",
  },

  // Bottom bar on phones, top bar on larger screens. Keep labels to one short word.
  nav: [
    { label: "About", href: "#about" },
    { label: "Trailer", href: "#reel" },
    { label: "Work", href: "#work" },
    { label: "Resume", href: "media/Elisabeth-Fitzgerald-Resume.pdf", external: true },
    // Press comes back automatically once press.quotes or press.awards has entries:
    // { label: "Press", href: "#press" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    // Two crops of the same photo (the arms-crossed full-length shot on grey):
    // a tall 3:4 crop for phones, and a 16:9 frame for desktop where the
    // figure sits right of centre on the same grey backdrop, extended so
    // nothing is upscaled. To use the red-top full-length shot instead, build
    // new crops from photos/04-... and change the two bases here.
    still: {
      portrait: { base: "hero-portrait", widths: [400, 726], width: 726, height: 968 },
      landscape: { base: "hero-landscape", widths: [1280, 1920], width: 1920, height: 1080 },
      alt: "Elisabeth Fitzgerald standing full length with her arms crossed, in a charcoal top with black lace sleeves and black jeans, against a grey studio backdrop.",
    },
    reelLabel: "Watch the trailer",
    reelDuration: "1:29",
  },

  about: {
    headshot: {
      base: "headshot-olive-top-big-smile-olive-bg",
      widths: [400, 739],
      width: 739,
      height: 1127,
      alt: "Elisabeth Fitzgerald, head and shoulders, smiling widely at the camera in an olive top against an olive backdrop.",
      credit: "", // e.g. "Photograph by <photographer>" once known
    },
    // One line, set large, like the standfirst of a magazine feature.
    lead: "From Stowe, Vermont. Trained in Pittsburgh, London and New York.",
    // First draft from the resume. Third person, short sentences; make it hers.
    bio: [
      "Elisabeth Fitzgerald is an actor and singer from Stowe, Vermont, now based in New York. She grew up on stage with the Lamoille County Players and the Stowe Theater Guild, played Winnifred in Once Upon a Mattress and Maleficent in The Sleeping Beauty before she had finished school, and most recently played Anne Frank in The Diary of Anne Frank at the Mirror Theater in Greensboro, Vermont.",
      "She studied theatre at the University of Pittsburgh, with a semester at the Royal Academy of Dramatic Art in London, a summer of Ancient Greek performance with the British American School of Dramatic Arts, and Stella Adler's ten-week summer program in New York. Her first feature, All Day Happy Dance, in which she plays Ava, is due in 2026.",
      "She sings alto, dances lyric, contemporary and hip hop, and plays the violin. She has co-directed High School Musical, Jr. for the Lamoille County Players' children's theatre, and read the pilot for Alta Global Media.",
    ],
    // Quick casting facts. Order matters; the first few show on phones without scrolling.
    facts: [
      { label: "Height", value: "5′2″ (157 cm)" },
      { label: "Hair", value: "Brown" },
      { label: "Eyes", value: "Brown, hazel" },
      { label: "Voice", value: "Alto. Choir soloist" },
      { label: "Pronouns", value: "She/her" },
      { label: "Dance", value: "Lyric, contemporary and hip hop (Stowe Dance Company). Ballet basics (Alvin Ailey)" },
      { label: "Music", value: "Violin. Voice lessons through Brimmer and May and at college" },
      { label: "Base", value: "New York. Happy to travel" },
    ],
    training: [
      { what: "Theater Studies", where: "University of Pittsburgh", when: "2022 to 2026" },
      { what: "Ancient Greek Performance, summer semester", where: "British American School of Dramatic Arts", when: "2025" },
      { what: "Semester abroad", where: "Royal Academy of Dramatic Art, London", when: "2024" },
      { what: "Ten-week summer program", where: "Stella Adler Studio of Acting, New York", when: "2023" },
      { what: "Academic and Creative Arts Diploma", where: "Brimmer and May School, Chestnut Hill, Massachusetts", when: "2022" },
      { what: "Classes and workshops", where: "Atlantic Theater Company, New York. Cape Playhouse, Dennis, Massachusetts. Governor's Institute of Vermont, acting and directing", when: "Also" },
    ],
  },

  reel: {
    // The trailer is 1:29, 960x720 (4:3), H.264 at about 7.5 MB. The player takes
    // its aspect ratio from the poster size below, so a 16:9 reel needs no CSS change.
    heading: "Trailer and photos",
    title: "All Day Happy Dance, trailer (1:29)",
    description: "Feature from B.Light Productions, directed by John Francis Sullivan. Elisabeth plays Ava. Release planned for 2026.",
    poster: { base: "showreel-poster", widths: [480, 960], width: 960, height: 720 },
    posterAlt: "Poster frame from the trailer: Elisabeth in a lilac hoodie on a night-time station platform, between two friends, under fluorescent lights.",
    // Self-hosted file(s). preload="none" is enforced, so nothing downloads until play.
    // To use Vimeo instead, set `vimeoId: "123456789"` and leave `sources` empty.
    sources: [{ src: "media/reel/showreel.mp4", type: "video/mp4" }],
    vimeoId: "",
    captions: "", // optional path to a .vtt file
  },

  // The photo grid: all twelve studio photos, four across on desktop and two
  // on phones, so the rows come out even. Ordered so each row mixes headshot,
  // full length, three-quarter and half length. Tap opens the lightbox; the
  // caption shows there. Add `credit: "Name"` to any entry once the
  // photographer is confirmed.
  photos: [
    { base: "headshot-red-top-soft-smile-beige-bg", widths: [400, 749], width: 749, height: 1144, alt: "Elisabeth in a red short-sleeved top with a soft smile, dark hair over one shoulder, against a beige studio backdrop.", caption: "Headshot, red top, beige studio" },
    { base: "fullbody-charcoal-lace-top-black-jeans-boots-arms-crossed-grey-bg", widths: [400, 726], width: 726, height: 1135, alt: "Full length: Elisabeth standing with her arms crossed in a charcoal top with black lace sleeves, black jeans and platform boots, grey backdrop.", caption: "Full length, charcoal and lace, grey studio" },
    { base: "headshot-tan-blazer-olive-top-soft-smile-olive-bg", widths: [400, 739], width: 739, height: 1096, alt: "Elisabeth in a tan blazer over an olive top, soft smile, against an olive backdrop.", caption: "Headshot, tan blazer, olive studio" },
    { base: "three-quarter-red-top-jeans-big-smile-hand-on-hip-beige-bg", widths: [400, 735], width: 735, height: 1143, alt: "Three-quarter length: Elisabeth laughing with a hand on her hip, red top and blue jeans, beige backdrop.", caption: "Three-quarter, red top and jeans, beige studio" },
    { base: "headshot-charcoal-lace-sleeve-top-soft-smile-grey-bg", widths: [400, 729], width: 729, height: 1126, alt: "Elisabeth in a charcoal top with black lace sleeves, soft smile, grey backdrop.", caption: "Headshot, charcoal and lace, grey studio" },
    { base: "fullbody-red-top-wideleg-jeans-sneakers-beige-bg", widths: [400, 745], width: 745, height: 1120, alt: "Full length: Elisabeth in a red top, wide-leg jeans and sneakers, one foot kicked out, beige backdrop.", caption: "Full length, red top and wide-leg jeans, beige studio" },
    { base: "headshot-olive-top-big-smile-olive-bg", widths: [400, 739], width: 739, height: 1127, alt: "Elisabeth in an olive top with a wide smile, against an olive backdrop.", caption: "Headshot, olive top, olive studio" },
    { base: "halfbody-charcoal-lace-top-black-jeans-one-hand-in-pocket-grey-bg", widths: [400, 731], width: 731, height: 1145, alt: "Half length: Elisabeth with one hand in her pocket, charcoal top with lace sleeves and black jeans, grey backdrop.", caption: "Half length, one hand in pocket, grey studio" },
    { base: "three-quarter-red-top-jeans-playful-side-glance-beige-bg", widths: [400, 736], width: 736, height: 1108, alt: "Three-quarter length: Elisabeth glancing to the side with a hand in her hair, red top and jeans, beige backdrop.", caption: "Three-quarter, side glance, beige studio" },
    { base: "headshot-charcoal-lace-sleeve-top-neutral-grey-bg", widths: [400, 755], width: 755, height: 1139, alt: "Elisabeth in a charcoal top with lace sleeves, neutral expression, looking straight to camera, grey backdrop.", caption: "Headshot, charcoal and lace, grey studio" },
    { base: "halfbody-charcoal-lace-top-black-jeans-hands-in-pockets-grey-bg", widths: [400, 737], width: 737, height: 1128, alt: "Half length: Elisabeth with both hands in her pockets, charcoal top with lace sleeves and black jeans, grey backdrop.", caption: "Half length, hands in pockets, grey studio" },
    { base: "halfbody-charcoal-lace-top-black-jeans-windy-hair-grey-bg", widths: [400, 731], width: 731, height: 1131, alt: "Half length: Elisabeth with her hair blown across her face, charcoal top with lace sleeves and black jeans, grey backdrop.", caption: "Half length, windblown hair, grey studio" },
  ],

  // Work: one card per production, film first, then the stage roles in the
  // order they appear on the resume. Cards sit in a grid (three across on
  // desktop; the film card takes two columns) with the title, role, company
  // and place captioned underneath. Card images are public-domain art or
  // photos from Wikimedia Commons, tinted to the site palette, in
  // content/media/cards as <base>-640.jpg and <base>-1280.jpg (3:2). `credit`
  // prints in the corner of the image.
  work: {
    intro: "One feature and twelve stage roles, from the Lamoille County Players in Vermont to Brimmer and May and the Mirror Theater.",
    cards: [
      { type: "film", title: "All Day Happy Dance", role: "Ava", company: "B.Light Productions", place: "Directed by John Francis Sullivan. Release planned for 2026", image: { base: "card-all-day-happy-dance", widths: [640, 960], width: 960, height: 640, alt: "Elisabeth as Ava in All Day Happy Dance: wet hair, black swimsuit, looking up and smiling by a sunlit pool.", credit: "Still from the trailer" } },
      { type: "theatre", title: "The Diary of Anne Frank", role: "Anne Frank", company: "Mirror Theater / GAAR", place: "Greensboro, Vermont", note: "Also performed the Anne Frank monologue at the Mirror Theater gala", image: { base: "card-diary-of-anne-frank", widths: [640, 1280], width: 1280, height: 853, alt: "The Prinsengracht canal in Amsterdam with the tower of the Westerkerk, photographed around 1890.", credit: "Rijksmuseum, Amsterdam, c. 1890" } },
      { type: "theatre", title: "The Election", role: "Sasha", company: "Brimmer and May School", place: "Chestnut Hill, Massachusetts. Staged online", image: { base: "card-the-election", widths: [640, 965], width: 965, height: 643, alt: "A New York polling place in 1900: voters and clerks at a long table beside a ballot box, in a halftone illustration.", credit: "New York polling place, 1900" } },
      { type: "theatre", title: "Urinetown", role: "Officer Barrel", company: "Brimmer and May School", place: "Chestnut Hill, Massachusetts", image: { base: "card-urinetown", widths: [640, 1280], width: 1280, height: 853, alt: "Dust Bowl, South Dakota, 1936: farm machinery half buried in drifted soil under a bare sky.", credit: "USDA photograph, South Dakota, 1936" } },
      { type: "theatre", title: "The Three Musketeers", role: "the Duke of Buckingham", company: "Brimmer and May School", place: "Chestnut Hill, Massachusetts", image: { base: "card-three-musketeers", widths: [640, 1280], width: 1280, height: 853, alt: "Maurice Leloir's illustration for The Three Musketeers, 1894: d'Artagnan and Rochefort shake hands, cloaks and swords on the ground.", credit: "After Maurice Leloir, 1894" } },
      { type: "theatre", title: "Once Upon a Mattress", role: "Winnifred", company: "Stowe High School", place: "Stowe, Vermont", image: { base: "card-once-upon-a-mattress", widths: [640, 1280], width: 1280, height: 853, alt: "Edmund Dulac's Princess and the Pea, 1911: the princess awake on a tower of mattresses under a canopy.", credit: "Edmund Dulac, 1911" } },
      { type: "theatre", title: "Anne of Green Gables", role: "Mrs. Barry", company: "Stowe High School", place: "Stowe, Vermont", image: { base: "card-anne-of-green-gables", widths: [640, 1280], width: 1280, height: 853, alt: "Frontispiece of the 1908 first edition of Anne of Green Gables, by M. A. and W. A. J. Claus.", credit: "M. A. and W. A. J. Claus, 1908" } },
      { type: "theatre", title: "Annie Get Your Gun", role: "Annie's Sister", company: "Mirror Theater / GAAR", place: "Greensboro, Vermont", image: { base: "card-annie-get-your-gun", widths: [640, 1280], width: 1280, height: 853, alt: "Studio portrait of the sharpshooter Annie Oakley, 1899.", credit: "Annie Oakley, 1899" } },
      { type: "theatre", title: "The Sleeping Beauty", role: "Maleficent", company: "Mirror Theater / GAAR", place: "Greensboro, Vermont", image: { base: "card-sleeping-beauty", widths: [640, 1280], width: 1280, height: 853, alt: "Edward Burne-Jones's The Briar Wood: knights asleep among tangled thorns.", credit: "After Edward Burne-Jones, The Briar Wood, 1892" } },
      { type: "theatre", title: "A Christmas Carol", role: "Thomas", company: "Stowe Theater Guild", place: "Stowe, Vermont", image: { base: "card-a-christmas-carol", widths: [640, 1280], width: 1280, height: 853, alt: "John Leech's Marley's Ghost, 1843: Scrooge in his chair by the fire as Marley's chained ghost appears.", credit: "John Leech, 1843" } },
      { type: "theatre", title: "Peter Pan, Jr.", role: "Smee", company: "Lamoille County Players", place: "Hyde Park, Vermont", image: { base: "card-peter-pan", widths: [640, 1280], width: 1280, height: 853, alt: "F. D. Bedford's 1911 illustration for Peter and Wendy: Peter playing his pipes.", credit: "F. D. Bedford, 1911" } },
      { type: "theatre", title: "Into the Woods, Jr.", role: "the Evil Stepsister", company: "Lamoille County Players", place: "Hyde Park, Vermont", image: { base: "card-into-the-woods", widths: [640, 1280], width: 1280, height: 853, alt: "Gustave Doré's Little Red Riding Hood, 1867: the girl meets the wolf beneath the trees.", credit: "Gustave Doré, 1867" } },
    ],
  },
  creditTypes: [
    { key: "film", label: "Film" },
    { key: "theatre", label: "Theatre" },
  ],

  resume: {
    // Drop a real PDF at content/media/Elisabeth-Fitzgerald-Resume.pdf and it
    // is used as-is. If that file is missing, the build generates one from the
    // data above. The link opens the PDF in a new tab rather than forcing a
    // download, so a director reads it in the browser and can save it from there.
    // The file name is what the tab and any saved copy are called.
    file: "media/Elisabeth-Fitzgerald-Resume.pdf",
    label: "View resume (PDF)",
  },

  // Press: empty for now, so the section and its nav link are not rendered.
  // Add entries like { quote, publication, about, stars, url } and
  // { result, award, body, year, for } to bring it back.
  press: {
    quotes: [],
    awards: [],
  },

  contact: {
    // The slim bar under the hero uses `status`, the email, phone and resume link.
    status: "Available for stage and screen.",
    statusDetail: "Based in New York and happy to travel.",
    // Direct contact, as on the resume. Add an agent under `representation` later.
    direct: { label: "Write or call", email: "efitzy10@gmail.com", phone: "(802) 730-4470" },
    representation: [],
    form: {
      heading: "Or use the form",
      // Paste the Formspree endpoint here (https://formspree.io/f/xxxxxxxx) and
      // messages arrive in Elisabeth's inbox with the visitor's address as
      // reply-to, so she answers like any email. While it is empty, submitting
      // opens the visitor's own email app instead, addressed to `fallbackTo`.
      endpoint: "https://formspree.io/f/mljdwvaw",
      fallbackTo: "efitzy10@gmail.com",
      subject: "Enquiry for Elisabeth Fitzgerald",
      submitLabel: "Send message",
      sendingLabel: "Sending",
      sentTitle: "Message sent",
      sentMessage: "Elisabeth will get back to you soon.",
    },
    // Add real profiles as { label, handle, url } to show the row again.
    socials: [],
  },

  footer: {
    line: "Actor and singer. New York, by way of Stowe, Vermont.",
  },
};
