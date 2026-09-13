/* =========================================================
   DarkvoyagerLabs — project catalogue
   Edit this array to add, remove, or update projects. Cards on
   index.html and projects.html are generated from this single
   source of truth — you should never need to touch the card
   markup to add a new project.

   IMPORTANT — this file only drives the CARD PREVIEWS (thumbnail,
   short description, price/rating chip, filter buttons, search
   suggestions). The full write-up Google should index for each
   project lives in its own static page at
   project-covers/<slug>/index.html — clicking a card sends the
   visitor straight there. When you add a project here, also add
   its matching project-covers/<slug>/index.html page (copy an
   existing one as a template).

   slug:     folder name under project-covers/ — used for both
             image paths (slug/1.png) AND the detail page URL
             (project-covers/slug/index.html). Must be unique.
   type:     "Game" | "App" | "Linux Distro" | "Browser" | "Theme"
   platform: array of any of "Web","Universal","Android","iOS","Windows","MacOS","Linux"
   price:    number (0 = Free) — displayed with a $ sign when > 0
   rating:   0–5, one decimal allowed
   images:   [0] is used as the card thumbnail; the full gallery
             on the detail page is generated from this same array
   download: link used by the download/play button on the detail
             page (ignored when cta is "comingSoon")
   cta:      controls the button's label + behavior —
               "download"   -> button reads "Download"
               "play"       -> button reads "Play"        (use for
                                straight-up browser games)
               "comingSoon" -> button reads "Coming Soon" and is
                                disabled (no link, greyed out)
             Defaults to "download" if omitted.

   seekingContributors: true to list this project on the
             Contribute page's "actively looking for help" list
   helpWanted: short string shown on that Contribute page listing
   ========================================================= */

const PROJECTS = [


//The Lost Transmission
  {
    id: "thelosttransmission",
    slug: "thelosttransmission",
    name: "The Lost Transmission",
    type: "Game",
    platform: ["Windows", "Linux"],
    price: 0,
    rating: 0,
    description: "A 3d psychological horror game. The protagonist is on a space mission to uncover the truth hiding in a Research Vessel, with crews onboard, which lost contact with Earth years ago.",
    longDescription: "The protagonist is on a space mission to uncover the truth hiding in a Research Vessel, with crews onboard, which lost contact with Earth years ago. He is tasked to find out what fate the crews went through, are they alive or not, and why the vessel lost contact with Earth; also he has to fix the communication system in that vessel, and return with the research files and crews back to Earth, all while surviving from.. well, something that lurks in the dark corners of the vessel. Complete this intense psychological horror game, and maybe the protagonist returns to Earth?",
    images: ["project-covers/thelosttransmission/1.png"],
    download: "#",
    cta: "comingSoon",
    seekingContributors: true,
    helpWanted: "Looking for: 3d modelling"
  },


//CyberShadows2 (Helios-9)
  {
    id: "helios-9",
    slug: "cybershadows2",
    name: "HELIOS-9",
    type: "Game",
    platform: ["Web"],
    price: 0,
    rating: 0,
    description: "A terminal-based psychological horror game. Protagonist investigates a research facility shut down decades ago, with all the workers going missing, including protagonist's father.",
    longDescription: "Protagonist's father used to work in a secret research facility. He (along with other researchers and workers in the facility) went missing when the protagonist was six years old. No one knows what happened to them. The government covered up the whole thing. The facility was permanently sealed and still know one knew what resesarch was being conducted there. Currently, the protagonist is 34, and a system analyst, who has secretly crept into the facility to uncover the truth. Explore the main system, read logs and reports, and uncover the eerie truth.",
    images: ["project-covers/cybershadows2/1.gif", "project-covers/cybershadows2/2.png", "project-covers/cybershadows2/3.png"],
    download: "https://phalcon-coder.github.io/cyberShadows/",
    cta: "play",
    seekingContributors: false
  },


//CarDash2
  {
    id: "cardash2",
    slug: "cardash2",
    name: "CarDash2",
    type: "Game",
    platform: ["Web"],
    price: 0,
    rating: 0,
    description: "A simple 3d car game with H patterned gear shifting, giving real driving vibes. There are cars coming from the opposite sides, changing lanes automatically.",
    longDescription: "A simple 3d car game with H patterned gear shifting, giving real driving vibes. There are cars coming from the opposite sides, changing lanes automatically. Everything — geometry, physics, and UI — lives in one HTML file.",
    images: ["project-covers/cardash2/1.png", "project-covers/cardash2/2.png", "project-covers/cardash2/3.png"],
    download: "https://phalcon-coder.github.io/cardash2",
    cta: "play",
    seekingContributors: false
  },


//CyberShadows
  {
    id: "cybershadows",
    slug: "cybershadows1",
    name: "CyberShadows",
    type: "Game",
    platform: ["Web"],
    price: 0,
    rating: 0,
    description: "Protagonist's friend Kevin had died in a mysterious way leaving behind his highly encrypted PC containing an unfinished software he was working on.",
    longDescription: "Protagonist's friend Kevin had died in a mysterious way leaving behind his highly encrypted PC containing an unfinished software he was working on. Solve puzzles to trace the software and find his diary.",
    images: ["project-covers/cybershadows1/1.png", "project-covers/cybershadows1/2.png", "project-covers/cybershadows1/3.png"],
    download: "https://phalcon-coder.github.io/cyberShadows/",
    cta: "play",
    seekingContributors: false
  },


//Folio
  {
    id: "folio",
    slug: "folio",
    name: "Folio",
    type: "App",
    platform: ["Android", "iOS"],
    price: 0,
    rating: 0,
    description: "A focused and featureful ebook library. Best suitable on tablets.",
    longDescription: "A focused and featureful ebook library. Best suitable on tablets.",
    images: ["project-covers/folio/1.png", "project-covers/folio/2.png", "project-covers/folio/3.png"],
    download: "#",
    cta: "download",
    seekingContributors: false
  },


//Smart Homepage
  {
    id: "smarthomepage",
    slug: "smarthomepage",
    name: "Smart Homepage",
    type: "Theme",
    platform: ["Web"],
    price: 0,
    rating: 0,
    description: "A modern, aesthetic browser new tab page theme with a ai/normal search cum url bar, with categorised pinned links for utmost productivity.",
    longDescription: "A modern, aesthetic browser new tab page theme with a ai/normal search cum url bar, with categorised pinned links for utmost productivity.",
    images: ["project-covers/smarthomepage/1.png", "project-covers/smarthomepage/2.png"],
    download: "https://github.com/phalcon-coder/smarthomepage",
    cta: "download",
    seekingContributors: false
  },


  //Surfer
    {
    id: "surfer",
    slug: "surfer",
    name: "Surfer",
    type: "Browser",
    platform: ["Windows", "MacOS", "Linux"],
    price: 0,
    rating: 0,
    description: "A privacy-focused PyQT5 based browser searching with duckduckgo. It has a clean, minimal, customisable and memorable look.",
    longDescription: "A privacy-focused PyQT5 based browser searching with duckduckgo. It has a clean, minimal, customisable and memorable look. It has no account nonsense and has a temporary history.",
    images: ["project-covers/surfer/1.png", "project-covers/surfer/2.png", "project-covers/surfer/3.png"],
    download: "#",
    cta: "download",
    seekingContributors: false
  },


//LeoOS
  {
    id: "leoos",
    slug: "leoos",
    name: "LeoOs",
    type: "Linux Distro",
    platform: ["Linux"],
    price: 0,
    rating: 0,
    description: "A user-friendly Xubuntu-based distribution inspired from macOS X Lion.",
    longDescription: "LeoOS is a user-friendly distro based on Xubuntu LTS inspired from macOS X Lion: traffic-light window controls, a translucent dock-plate, Lucida Grande-style type, a matching icon pack, and a Launchpad-equivalent app grid. For people who loves old themes and nostalgia.",
    images: ["project-covers/leoos/1.png", "project-covers/leoos/2.png", "project-covers/leoos/3.png"],
    download: "#",
    cta: "comingSoon",
    seekingContributors: true,
    helpWanted: "Looking for: testers, someone to look after updates"
  },


//PlatinumOS
{
    id: "platinumos",
    slug: "platinumos",
    name: "PlatinumOs",
    type: "Linux Distro",
    platform: ["Linux"],
    price: 0,
    rating: 0,
    description: "A user-friendly, minimalistic, lightweight and aesthetic Xubuntu-based distribution offering four different desktop layouts, and different color variants.",
    longDescription: "A user-friendly, minimalistic, lightweight and aesthetic Xubuntu-based distribution offering four different desktop layouts, and different color variants. Looks modern enough, without nuking old hardwares. Four desktop layouts includes windows-like, macos-like, ubuntu-like and xfce-like; making it a suitable choice for windows and macos refugees. Future versions will include another unique layout. PlatinumOS has its own user friendly app store App smart, update manager, and all-in-one advance settings manager. Future versions will also ship with its own browser.",
    images: ["project-covers/platinumos/1.png", "project-covers/platinumos/2.png", "project-covers/platinumos/3.png"],
    download: "#",
    cta: "comingSoon",
    seekingContributors: true,
    helpWanted: "Looking for: designers, testers, someone to look after updates"
  },


//Alpha Homepage
  {
    id: "alphahomepage",
    slug: "alphahomepage",
    name: "Alpha Homepage",
    type: "Theme",
    platform: ["Web"],
    price: 0,
    rating: 0,
    description: "A modern, minimal and hacker-themed browser new tab page theme with multiple color variants.",
    longDescription: "A modern, minimal and hacker-themed browser new tab page theme with multiple color variants.",
    images: ["project-covers/alphahomepage/1.png"],
    download: "https://github.com/phalcon-coder/alpha-homepage",
    cta: "download",
    seekingContributors: false
  }
];

/* Maps the `cta` field to a button label. Add new keys here if you
   ever need another button state — every card reads from this map,
   so it only needs to be defined once. */
const CTA_LABELS = {
  download: "Download",
  play: "Play",
  comingSoon: "Coming Soon"
};

function getCta(project){
  const key = project.cta && CTA_LABELS[project.cta] ? project.cta : "download";
  return { label: CTA_LABELS[key], disabled: key === "comingSoon" };
}

/* Utility: turn platform / type into the small pill labels used on cards. */
function formatList(arr){
  return arr.join(" · ");
}

/* Utility: the URL of a project's dedicated detail page. */
function projectUrl(project){
  return `project-covers/${project.slug}/index.html`;
}
