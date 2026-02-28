
import Link from "next/link";
import { locationData } from "./locationData/locationData";
import LocationPageClient from "./LocationPageClient";
import { FaCar, FaCarSide, FaClipboardCheck, FaFileAlt, FaGift, FaMapMarkerAlt } from "react-icons/fa";
function formatLocationFromSlug(slug = "") {
  return slug
    .split("-")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
function buildFallback(slug) {
  const loc = formatLocationFromSlug(slug) || "Sydney";
const mapUrls = {
  Menangle: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.77453230056!2d150.63793824228427!3d-34.03812516790745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a2e09e9bb2db%3A0x8fd421cd54484a6e!2sMenangle%20NSW%202554%2C%20Australia!5e0!3m2!1sen!2sus!4v1615488504917!5m2!1sen!2sus",
  Campbelltown: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.24747487515!2d150.80582241063357!3d-34.070798210661664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12933d9c0d3eab%3A0x7a0ad5c0c4a21d59!2sCampbelltown%20NSW%202543%2C%20Australia!5e0!3m2!1sen!2sus!4v1615488773479!5m2!1sen!2sus",
  Roselands: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.776680177167!2d151.05927109811217!3d-33.95127037017697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129e07e9702d9d%3A0xb9a768c0852f07b1!2sRoselands%20NSW%202202%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191573381!5m2!1sen!2sus",
  Sandringham: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.6751386501!2d151.1056825184708!3d-34.01472970415745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a5424162c577%3A0x68c9d2b038d8a226!2sSandringham%20NSW%202181%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191584722!5m2!1sen!2sus",
  Sutherland: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44484.536828565106!2d151.04068977844778!3d-34.03532863596543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12c12d084b5da1%3A0x5017d681632cca0!2sSutherland%20NSW%202232%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772125432043!5m2!1sen!2sbd",
  WaliCreek: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.72206789004!2d151.1968229579344!3d-33.932183824743864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12c6a9b8feeb61%3A0x11839f3b7a6fa1cf!2sWolli%20Creek%20NSW%202213%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191614205!5m2!1sen!2sus",
  Miranda: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26451.35151750204!2d151.08444728515505!3d-34.03312311748612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b84572e5978d%3A0x5017d681632c180!2sMiranda%20NSW%202228%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772125473497!5m2!1sen!2sbd",
  Monterey: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.7445566601!2d151.2752715807996!3d-33.98218401691745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a2fbedbcf271%3A0x189f1da451299e97!2sMonterey%20NSW%202219%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191644393!5m2!1sen!2sus",
  Ramsgate: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.6677462334!2d151.2561786886062!3d-33.96897360402266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a383033586d9%3A0x8dd4979387bbff87!2sRamsgate%20NSW%202221%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191653472!5m2!1sen!2sus",
  "Bardwell Park": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6620.418386753908!2d151.1201317430724!3d-33.93574729144645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ba11745edbb7%3A0x5017d681632ad20!2sBardwell%20Park%20NSW%202207%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772125714929!5m2!1sen!2sbd",
  Eastgardens: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.49233809159!2d151.24150173841346!3d-33.951725157692276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129f2d4f0169f5%3A0x9b4f9b01c75921e5!2sEastgardens%20NSW%202203%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191670195!5m2!1sen!2sus",
  "Gymea Bay": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13222.954005569132!2d151.07717065499855!3d-34.05057839179273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12c7a06be0095f%3A0x5017d681632b960!2sGymea%20Bay%20NSW%202227%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772125661390!5m2!1sen!2sbd",
  "Port Botany": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26469.44933140962!2d151.19600023496415!3d-33.97503354455838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b1680d7140cb%3A0x5017d681632c6f0!2sPort%20Botany%20NSW%202036%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772125584841!5m2!1sen!2sbd",
  Rockdale: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13237.963443564244!2d151.13026060491967!3d-33.95422092219497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b75550c96bf5%3A0x5017d681632c8b0!2sRockdale%20NSW%202216%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772125512073!5m2!1sen!2sbd",
  Woolooware: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.43551557079!2d151.14605296422177!3d-34.04842390724865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a3ac74f1c5fb%3A0xe2b5667e720d3122!2sWoolooware%20NSW%202223%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191701003!5m2!1sen!2sus",
  Kyeemagh: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.48165813022!2d151.15722512144006!3d-33.97632736606069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a368b1b09fbd%3A0x48556e0a99931d9f!2sKyeemagh%20NSW%202221%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191707177!5m2!1sen!2sus",
  RamsgateBeach: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.62702604276!2d151.2428777653773!3d-33.97537605153592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a3451cd91c0d%3A0x94c438c2e5dcb4d3!2sRamsgate%20Beach%20NSW%202221%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191712499!5m2!1sen!2sus",
  BeverlyHills: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.52477706038!2d151.0615480737697!3d-33.9513961188453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a2904cd13e57%3A0x70c87934843c0070!2sBeverly%20Hills%20NSW%202220%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191716882!5m2!1sen!2sus",
  BexleyNorth: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.41791405052!2d151.1261174113269!3d-33.97911109131465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a2db8b3f2ab1%3A0x90f038db63506be5!2sBexley%20North%20NSW%202220%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191722492!5m2!1sen!2sus",
  Botany: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.57960167568!2d151.21759668808897!3d-33.92384334056777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129f09c1d6a807%3A0x803e5b77e8f5eae4!2sBotany%20NSW%202012%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191728587!5m2!1sen!2sus",
  "Ramsgate Beach": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6616.778686985185!2d151.141120343082!3d-33.98253189626887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b9dd914683eb%3A0x5017d681632c7f0!2sRamsgate%20Beach%20NSW%202217%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772126017858!5m2!1sen!2sbd",
  "Bexley North": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13239.786456297314!2d151.10499485491005!3d-33.94250116981511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ba218f9cfa57%3A0x5017d681632aa00!2sBexley%20North%20NSW%202207%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772126090900!5m2!1sen!2sbd",
  "Caringbah": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26450.570737497215!2d151.10811738516333!3d-34.03562726847548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12c7f6b253e00d%3A0x5017d681632afc0!2sCaringbah%20NSW%202229%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772126173651!5m2!1sen!2sbd",
  "Caringbah South": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26444.900456903208!2d151.09898158522313!3d-34.05380837566104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12c78d09dddc5b%3A0x5017d6816334960!2sCaringbah%20South%20NSW%202229%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772126207064!5m2!1sen!2sbd",
  "Carss Park": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13232.679121947134!2d151.1080336049475!3d-33.988172579093984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b83542eb6e9d%3A0x5017d681632b000!2sCarss%20Park%20NSW%202221%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772126246920!5m2!1sen!2sbd",
  "Clemton Park": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6621.195111513183!2d151.0978190930704!3d-33.92575594041718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ba37a99863d1%3A0x5017d6816334370!2sClemton%20Park%20NSW%202206%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772126312693!5m2!1sen!2sbd",
  "Hurstville": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26473.30352278841!2d151.0804369849235!3d-33.96265123967678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b998bee6e1bd%3A0x5017d681632bb60!2sHurstville%20NSW%202220%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772126381274!5m2!1sen!2sbd",
  "Kangaroo Point": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13230.657349959565!2d151.08558140495813!3d-34.00115453173373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b8f5e9de7fa5%3A0x5017d681632bbd0!2sKangaroo%20Point%20NSW%202224%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772126418133!5m2!1sen!2sbd",
  "Kingsgrove": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26480.522409545672!2d151.07833908484736!3d-33.939448530534676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ba2bd8af7b2d%3A0x5017d681632bca0!2sKingsgrove%20NSW%202208%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772126474470!5m2!1sen!2sbd",
  "South Hurstville": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26480.522409545672!2d151.07833908484736!3d-33.939448530534676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b9b02b44e6c5%3A0x5017d681632cb50!2sSouth%20Hurstville%20NSW%202221%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772126515571!5m2!1sen!2sbd",
  Tempe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.43651826312!2d151.14562492805104!3d-33.9150471163817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a2f953dd5b59%3A0x7c2d4070173b3f6a!2sTempe%20NSW%202213%2C%20Australia!5e0!3m2!1sen!2sus!4v1637203597600!5m2!1sen!2sus",
  Marrickville: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26488.980583180284!2d151.1352204347581!3d-33.91224476982498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b06476e64119%3A0x5017d681632c010!2sMarrickville%20NSW%202204%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772126985129!5m2!1sen!2sbd",
  Mortdale: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26488.980583180284!2d151.1352204347581!3d-33.91224476982498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b918f4c43007%3A0x5017d681632c1f0!2sMortdale%20NSW%202223%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772127022268!5m2!1sen!2sbd",
  Peakhurst: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13235.614616312805!2d151.06162965493206!3d-33.96931577526142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b92f4afb3cb9%3A0x5017d681632c610!2sPeakhurst%20NSW%202210%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772127067511!5m2!1sen!2sbd",
  Riverwood: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13239.05016256521!2d151.042470054914!3d-33.947235070776294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b94be26bb7b3%3A0x5017d681632c8a0!2sRiverwood%20NSW%202210%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772127098030!5m2!1sen!2sbd",
  Allawah: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14656.33831522467!2d151.13664929252658!3d-33.95468896584693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a16f598f98d9%3A0xc229f4fd8fba990!2sAllawah%20NSW%202220%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191757254!5m2!1sen!2sus",
  "Dolls Point": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.959215468586!2d151.14198412544397!3d-33.993581325532254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b77eeea1e66f%3A0x5017d681632b4b0!2sDolls%20Point%20NSW%202219%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772127184322!5m2!1sen!2sbd",
  Eastlakes: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13237.079682463982!2d151.19069075931555!3d-33.93455141005791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12c7a4f3c8f5b9%3A0xc3c3badd6f2e801d!2sEastlakes%20NSW%202012%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191766147!5m2!1sen!2sus",
  Gymea: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26449.76076550813!2d151.06161161689435!3d-34.049615048254225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a3b292e88219%3A0x70fc2ffda27e1d9b!2sGymea%20NSW%202227%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191771634!5m2!1sen!2sus",
  "Hurstville Grove": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13234.331533538832!2d151.0828836549388!3d-33.97755907693656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b900b09e9a5f%3A0x5017d681632bb70!2sHurstville%20Grove%20NSW%202220%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772127233547!5m2!1sen!2sbd",
  Kareela: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13230.345219101308!2d151.0843986123925!3d-34.03664258002291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b38d9296099f%3A0x5017d681632b1d98!2sKareela%20NSW%202223%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191781716!5m2!1sen!2sus",
  Sylvania: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13227.872413431322!2d151.10221300497275!3d-34.01902968537011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b9b0019a0e05%3A0x5017d681632ccd0!2sSylvania%20NSW%202224%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772127287166!5m2!1sen!2sbd",
  "Taren Point": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13228.744256954553!2d151.09321130496818!3d-34.01343463423168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b813e6ed65f9%3A0x5017d681632cd10!2sTaren%20Point%20NSW%202229%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772127326105!5m2!1sen!2sbd",
  "Turella": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6620.847733135614!2d151.13578479307122!3d-33.930224740877726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b09f0761bb47%3A0x5017d681632cdc0!2sTurrella%20NSW%202205%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772127373613!5m2!1sen!2sbd",
  "Kirrawee": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26451.34576507969!2d151.05197283515514!3d-34.0331415674934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12c76a29af8be3%3A0x5017d681632bce0!2sKirrawee%20NSW%202232%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772127429006!5m2!1sen!2sbd",

  Penshurst: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26451.34576507969!2d151.05197283515514!3d-34.0331415674934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b90c2b37d5af%3A0x5017d681632c650!2sPenshurst%20NSW%202222%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772127842141!5m2!1sen!2sbd",
  Arncliffe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26451.116304090023!2d151.14409216141582!3d-33.951664889968064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a3ef48888ec5%3A0x3cc3305db609476!2sArncliffe%20NSW%202220%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191772772!5m2!1sen!2sus",
  Banksia: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13227.380671906417!2d151.15095116207398!3d-33.95122586654337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a3df7b79fd5b%3A0x1f92a92d139a9230!2sBanksia%20NSW%202220%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191778375!5m2!1sen!2sus",
  "Bardwell Valley": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6620.287674834647!2d151.12534379307283!3d-33.93742844161948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ba0e339ee13d%3A0x5017d681632ad30!2sBardwell%20Valley%20NSW%202207%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772127893005!5m2!1sen!2sbd",
  "Baverly Hills": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6620.287674834647!2d151.12534379307283!3d-33.93742844161948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b96173212bf1%3A0x5017d681632a9e0!2sBeverly%20Hills%20NSW%202209%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772127962313!5m2!1sen!2sbd",

  "Baxley North": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13239.786456297314!2d151.10499485491002!3d-33.94250116981511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ba218f9cfa57%3A0x5017d681632aa00!2sBexley%20North%20NSW%202207%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128002452!5m2!1sen!2sbd",
  "Bexley": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13239.786456297314!2d151.10499485491002!3d-33.94250116981511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ba6bba88d1bb%3A0x5017d681632a9f0!2sBexley%20NSW%202207%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128037049!5m2!1sen!2sbd",
  "Blakehurst": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26476.514534096194!2d151.09764278488962!3d-33.952332235610115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b84e81c0e8cf%3A0x5017d681632aab0!2sBlakehurst%20NSW%202221%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128094492!5m2!1sen!2sbd",
  "Brighton Le Sands": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26464.574300345277!2d151.08979948501556!3d-33.99068980073355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b74d105fdb2d%3A0x5017d681632ae30!2sBrighton-Le-Sands%20NSW%202216%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128160355!5m2!1sen!2sbd",


  "Cronulla": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26443.501806086948!2d151.13359973523785!3d-34.058291677433594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12c81235d88f33%3A0x5017d681632b360!2sCronulla%20NSW%202230%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128211438!5m2!1sen!2sbd",
  "Endgadline": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26443.501806086948!2d151.13359973523785!3d-34.058291677433594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12c81235d88f33%3A0x5017d681632b360!2sCronulla%20NSW%202230%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128211438!5m2!1sen!2sbd",

  "Carlton Park": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3308.52197511394!2d151.12073627544316!3d-33.9791241247811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b9c5fb4ae025%3A0x95660406e4001771!2sPark%20Rd%2C%20Sydney%20NSW%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128629735!5m2!1sen!2sbd",
  "Endgadline": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26443.670948710194!2d150.9973315352361!3d-34.057749527219215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12c1112c138bc7%3A0x5017d681632b670!2sEngadine%20NSW%202233%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128341153!5m2!1sen!2sbd",
  "Mascot": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26443.670948710194!2d150.9973315352361!3d-34.057749527219215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b121fa72efcf%3A0x5017d681632c040!2sMascot%20NSW%202020%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128386847!5m2!1sen!2sbd",
  "Pagewood": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52956.47797819687!2d151.1425742698154!3d-33.94678933494316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b174737bef7b%3A0x5017d681632c5a0!2sPagewood%20NSW%202035%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128427415!5m2!1sen!2sbd",
  "Abbotsford": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13254.07776681328!2d151.11958305483495!3d-33.85050170116167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a53ed3368d43%3A0x5017d681632aaf0!2sAbbotsford%20NSW%202046%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128462085!5m2!1sen!2sbd",
  "Chatswood": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13254.07776681328!2d151.11958305483495!3d-33.85050170116167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a8d41f630641%3A0x5017d681632b0c0!2sChatswood%20NSW%202067%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128506510!5m2!1sen!2sbd",

  Baxley: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26476.514534096194!2d151.09764278488962!3d-33.95233223561012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ba6bba88d1bb%3A0x5017d681632a9f0!2sBexley%20NSW%202207%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128579067!5m2!1sen!2sbd",
  Jannali: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13231.561556215798!2d151.11897313645614!3d-34.046514557706145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b2c57f87f2ff%3A0x7d8f30d29b059f8!2sJannali%20NSW%202229%2C%20Australia!5e0!3m2!1sen!2sus!4v1621191794995!5m2!1sen!2sus",
  Airds: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26434.887077413343!2d150.79399158667357!3d-34.08589430504626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ef9a6edcde1b%3A0x5017d681632ab20!2sAirds%20NSW%202560%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128669025!5m2!1sen!2sbd",
  Ambarvale: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13216.97351364395!2d150.78404755503!3d-34.088905149603164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ee288b33d48f%3A0x5017d681632ab70!2sAmbarvale%20NSW%202560%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128695749!5m2!1sen!2sbd",
  Belfield: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13245.482244648874!2d151.07594275488015!3d-33.905861212380096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12bbaeda9a4761%3A0x5017d681632a930!2sBelfield%20NSW%202191%2C%20Australia!5e0!3m2!1sen!2sbd!4v1772128726733!5m2!1sen!2sbd",
};

 const mapUrl = mapUrls[loc] || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300011.7111011841!2d150.81942602049298!3d-33.82024954555311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129838f39a743f%3A0x3017d681632a850!2sSydney%20NSW%2C%20Australia!5e0!3m2!1sen!2sbd!4v1771690963427!5m2!1sen!2sbd";

  return {
    mapUrl: mapUrl,
    pageTitle: `Driving Lessons in ${loc} – Book Today`,
    metaDescription:
      `Gain confidence behind the wheel with Driving Lessons in ${loc} – expert instructors, flexible timings. Book now and enjoy stress-free learning!`,
    keywords: [
      `Driving Lessons in ${loc}`,
      `driving lessons near me in ${loc}`,
      `driving lesson in ${loc}`,
      "driving lessons schools",
      "manual driving lessons",
      "learners driving lessons",
     ` car driving lessons near me in ${loc}`,
      "cheap driving lessons",
     `driving school in ${loc}`,
      "driving lessons schools",
      "driving training school near me",
      `affordable driving school in ${loc}`,
      "drivers education school near me",
      `driver education course in ${loc}`,
      "drivers education",
      "driver education",
      "learn to drive schools",
      "manual driving lessons near me",
      "cheap driving lessons near me",
      "Teen driving lessons",
      `book driving lesson in ${loc}`,
    ],
    heroTitle: `Driving Lessons in ${loc}  –  Book Today`,
    heroDescription: (
      <>
        Local knowledge makes all the difference here. Our
        <Link
          href={`/services/automatic-driving-lessons`}
          className="font-semibold underline px-1"
        >
          Driving Lessons in {loc}
        </Link>
        prepare you for industrial roads and busy freight routes. You will handle complex roundabouts near the port with ease. We equip you with skills for both suburban streets and commercial zones. Your path to a licence begins at
        <Link href={`/`} className="font-semibold underline px-1">
          Test Route Driving School,
        </Link>
     your nearby specialists.

      </>
    ),

    section1Title: `Why Learners Choose Our Driving Lessons in ${loc}`,
    section1SubTitle: (
      <>
        You deserve an
        <Link href={`/`} className="font-semibold underline px-1">
          affordable driving school
        </Link>{" "}
        in {loc}, NSW that cares. Many students struggle with nerves during
        their first few sessions. We solve this by providing a calm and patient
        learning environment. You will find our driving lessons near me in 
         {loc}, NSW convenient. Our instructors use local knowledge to prepare
        you for the actual test. You will feel confident in facing any traffic
        situation.
      </>
    ),
    section1Features: [
      "Expert driving school",
      `High first-time test pass rates.`,
      `Flexible booking for busy students.`,
      `Safe, modern dual-controlled training vehicles.`,
    ],
    section2Title: `Service Areas for Driving Lessons in ${loc}`,
    section2SubTitle: (
      <>
        We provide the most reliable
        <strong>learner&apos;s driving lessons</strong> across major suburbs.
        You can access our premium Driving Services in
        <strong> Hurstville, Rockdale</strong> and <strong>Bexley.</strong>
        Our team also reaches learners in Carlton, Arncliffe, and Allawah. You
        will benefit from our door-to-door pick-up and drop-off service. We make
        it easy to <strong>book a driving lesson in {loc}, NSW</strong>now.
        Our <strong>driving training school near me</strong> covers every corner
        of these areas. You will learn to navigate the Princes Highway and local
        streets. We ensure you gain experience in the exact areas where you
        live.
      </>
    ),
    section2Features: [
      "Professional Automatic Driving Lessons Rockdale.",
      "Comprehensive Highway Package Hurstville.",
      "Local City Driving Package Bexley.",
      "Specialized Night Driving Lesson Carlton.",
    ],
    section3Title1: `Local Road and Intersection Driving Training in ${loc}`,
    section3Description1: (
      <>
         <Link href={`/`} className="font-semibold underline px-1">
         Learning to drive in {loc}
        </Link> means handling real traffic situations, not empty back streets—and that’s exactly how our lessons are structured. You’ll practise on active local roads, including intersections near {loc} Station, school zones with strict speed enforcement, narrow residential streets, and busy shopping strips. Your instructor teaches you how to read traffic patterns, anticipate pedestrian movement, and make confident decisions at roundabouts and signal-controlled intersections. <br/>
You’ll spend time mastering lane positioning, gap selection, and safe merging on roads like Princes Highway and surrounding feeder streets. We focus heavily on speed control, observation routines, and hazard perception during peak-hour conditions, so nothing feels unfamiliar later. Mistakes are corrected calmly in real time, helping you build confidence without pressure. <br/>
Each lesson adapts to your skill level, whether you’re a first-time learner or returning after a long break. The goal is simple: help you feel relaxed, alert, and fully in control behind the wheel. By the time you finish your training, you won’t just “know how to drive”—you’ll understand how to drive safely and independently throughout {loc} and neighbouring suburbs.
      </>
    ),
    section3Title2: "NSW Driving Test Preparation with Mock Assessments",
    section3Description2: (
      <>
      Our NSW <Link href={`/services/driving-test-assessment`} className="font-semibold underline px-1">
     driving test preparation
        </Link> in {loc} is designed to mirror the real testing experience as closely as possible. You’ll train on commonly used local test routes, practising the exact manoeuvres examiners assess during the official RMS driving test. This includes controlled stops, safe turns, correct lane usage, parking techniques, and consistent observation checks at every decision point. <br />
Mock driving tests are conducted under real exam-style conditions, with clear instructions and no coaching during assessment runs. After each session, your instructor breaks down your performance in plain language, explaining what examiners look for and how marks are awarded. Weak areas are addressed immediately through targeted practice, not guesswork. <br />
We also spend time on test-day behaviour—how to respond to instructions, manage nerves, and recover calmly from minor errors. You’ll learn how to stay focused even when traffic conditions change unexpectedly. This structured, local, and experience-based preparation gives you clarity and confidence, significantly improving your chances of passing your driving test in {loc} on the first attempt.

      </>
    ),
    services: [
      {
        icon: <FaCar className="w-8 h-8 text-white" />,
        title: `Dual-Controlled Vehicles in ${loc}`,
        description: (
          <>
            You will find our automatic cars very easy to drive. These{" "}
            <strong>car driving lessons near me in {loc}, NSW</strong>are
            suitable for beginners. You can focus on road rules instead of gear
            changes.
          </>
        ),
      },
      {
        icon: <FaClipboardCheck className="w-8 h-8 text-white" />,
        title: `Driving Test Assessment in ${loc}`,
        description: (
          <>
            You need to know if you are ready for your license. Our instructors
            provide a detailed mock test for every student. This helps you fix
            errors and pass on your first attempt.
          </>
        ),
      },
      {
        icon: <FaFileAlt className="w-8 h-8 text-white" />,
        title: `Driving Test Package in ${loc}`,
        description:
          "You get a warm-up session right before your practical driving exam. This package includes a reliable car for your use at the registry. You will feel supported and focused during this high-pressure moment.",
      },
      {
        icon: <FaCarSide className="w-8 h-8 text-white" />,
        title: `Car Hire for Instructor in ${loc}`,
        description:
          "You can rent our professional vehicle for your official test day. Our cars meet all safety requirements and are easy to maneuver. This service removes the stress of finding a suitable car.",
      },
      {
        icon: <FaMapMarkerAlt className="w-8 h-8 text-white" />,
        title: `Parking Package in ${loc}`,
        description: (
          <>
            You will master the art of reverse parallel parking in spaces. Our{" "}
            <strong>cheap driving lessons</strong> focus on the technical points
            of parking. You will develop the spatial awareness necessary for
            navigating any street.
          </>
        ),
      },

      {
        icon: <FaGift className="w-8 h-8 text-white" />,
        title: `Highway Package in ${loc}`,
        description: (
          <>
            You must learn how to merge safely at high speeds. Our{" "}
            <strong>Driving Lessons in {loc}</strong> include specific
            training for the Highway. You will build the confidence to drive
            anywhere in Australia.
          </>
        ),
      },
    ],
    lessonTipsSectionTitle: "Driving Lesson Tips & Advice",
    lessonTips: [
      {
        name: "Monitor Your Speed",
        description: (
          <>
            You must watch for school zones during your teen driving lessons.
            Speed cameras are common in {loc}, so always stay alert. Check our
            expert{" "}
            <a
              href="https://www.nhtsa.gov/ten-tips-for-safe-driving"
              target="_blank"
              className="location-link"
            >
              Resources
            </a>{" "}
            for more tips on avoiding fines.
          </>
        ),
      },
      {
        name: "Check All Mirrors",
        description: (
          <>
            You should scan your mirrors every few seconds while driving. This
            habit is vital for passing your
            <strong>driving test at learn to drive schools.</strong> Proper
            observation prevents accidents and keeps you and others safe.
          </>
        ),
      },
      {
        name: "Practice Smooth Braking",
        description: (
          <>
            You will learn to brake gently to keep your passengers comfortable.
            Our local{" "}
            <a
              target="_blank"
              href="https://en.wikipedia.org/wiki/Driver%27s_education"
              className="location-link"
            >
              driver&apos;s education
            </a>{" "}
            school emphasizes control and vehicle handling. Avoid sudden stops
            unless it is an emergency on the road.
          </>
        ),
      },
      {
        name: "Understand Right of Way",
        description: (
          <>
            You must know who has the right of way at a busy intersection. Our
            guides explain these complex Australian road rules clearly and
            concisely. Knowing the rules reduces your anxiety and prevents
            dangerous mistakes.
          </>
        ),
      },
    ],
    faqs: [
      {
        question: "Where can I find cheap driving lessons near me?",
        answer: (
          <>
            You can find competitive rates right here at{" "}
            <strong>test route driving school.</strong> We offer a range of
            packages to suit your budget and goals. You get high-quality
            instruction without a massive price tag.
          </>
        ),
      },
      {
        question: "Do you offer manual driving lessons in my area?",
        answer: (
          <>
            We currently specialize in providing the best Automatic Driving
            Lessons. This focus allows us to provide modern vehicles and
            specialized techniques. Most local learners prefer automatic cars
            for their ease.
          </>
        ),
      },
      {
        question:
          "Is your school a registered provider of driver's education? ",
        answer: (
          <>
            You are choosing a professional and fully licensed{" "}
            <strong>driver&apos;s education</strong> team. We follow all
            official guidelines to ensure you receive great training. Our
            background reflects years of local driving expertise.
          </>
        ),
      },
      {
        question: `How do I book a driving lesson in ${loc} today? `,
        answer: (
          <>
            You can simply visit our contact page to secure your slot. We offer
            flexible hours to accommodate students and young professionals. Our
            team will respond to you promptly to confirm.
          </>
        ),
      },
      {
        question: "What makes your driving lessons school different?",
        answer: (
          <>
            You benefit from our deep local expertise and personalized teaching
            style. We don&apos;t just teach you to drive; we teach safety. Our
            student feedback demonstrates the high value learners place on our
            approach.
          </>
        ),
      },
      {
        question:
          "Do you provide manual driving lessons for international holders?",
        answer: (
          <>
            We focus on automatic cars to help you adapt quickly. If you need a{" "}
            <strong>refresher on driver education</strong>, we can help you. Our
            instructors explain local signs and rules clearly and
            straightforwardly.
          </>
        ),
      },
      {
        question: `What is in your driver education course in ${loc}?`,
        answer: (
          <>
            You will cover everything from car control to hazard perception. We
            show our students how to practice these vital skills. We ensure you
            are a safe driver before your test.
          </>
        ),
      },
      {
        question: "Can I get a discount on cheap driving lessons? ",
        answer: (
          <>
            You can save money by purchasing one of our bulk bundles. These
            packages provide the best value for long-term learners. Quality
            safety training should be accessible to everyone in {loc}.
          </>
        ),
      },
    ],
     ctaDescription:`Start your driving journey today with Test Route Driving School in ${loc}. Expert instructors, flexible schedules, and safe vehicles make learning fun and easy.`,
  }}

export async function generateMetadata({ params }) {
   const resolvedParams = await params;



  const slug = Array.isArray(resolvedParams.locations)
    ? resolvedParams.locations[0]
    : resolvedParams.locations;


  const data = locationData[slug];
  if (!data) {
    return {
      title: "Driving Lessons in Sydney | Test Route Driving School",
      description:
        "Professional driving lessons across Sydney suburbs with expert instructors.",
    };
  }

  return {
    title: data.pageTitle,
    description: data.metaDescription,
    keywords: data.keywords,
  };
}

export default async function LocationDetailsPage({ params }) {
  const resolvedParams = await params;



  const slug = Array.isArray(resolvedParams.locations)
    ? resolvedParams.locations[0]
    : resolvedParams.locations;

 

  const data = locationData[slug] || buildFallback(slug);

  return <LocationPageClient locationData={data} />;
}
