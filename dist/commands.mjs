export const examples = {
  'hi-IN': ['Syed ko paanch sau aur Ramesh ko teen sau', 'सुनीता ने दो सौ रुपये दिए', 'रमेश का कितना बाकी है?', 'Ramesh ka hisaab karo aur bill do'],
  'te-IN': ['రమేష్‌కు ఐదు వందలు మరియు సునీతకు మూడు వందలు', 'సునీత రెండు వందలు చెల్లించింది', 'రమేష్ బాకీ ఎంత?', 'రమేష్ బిల్లు'],
  'en-IN': ['Give Syed five hundred and Ramesh three hundred on credit', 'Sunita paid two hundred', 'What is Ramesh’s balance?', 'Print Ramesh’s bill'],
  'ta-IN': ['ரமேஷுக்கு ஐந்து நூறு மற்றும் சுனிதாவுக்கு மூன்று நூறு', 'சுனிதா இருநூறு செலுத்தினார்', 'ரமேஷ் பாக்கி எவ்வளவு?', 'ரமேஷ் பில்'],
  'kn-IN': ['ರಮೇಶ್‌ಗೆ ಐದು ನೂರು ಮತ್ತು ಸುನಿತಾಗೆ ಮೂರು ನೂರು', 'ಸುನಿತಾ ಎರಡು ನೂರು ಪಾವತಿಸಿದರು', 'ರಮೇಶ್ ಬಾಕಿ ಎಷ್ಟು?', 'ರಮೇಶ್ ಬಿಲ್'],
  'mr-IN': ['रमेशला पाचशे आणि सुनिताला तीनशे उधार', 'सुनिताने दोनशे भरले', 'रमेशची बाकी किती?', 'रमेशचे बिल'],
};

const dict = new Map();
function add(value, words) {
  for (const word of words.split(' ')) if (word) dict.set(word.normalize('NFC'), value);
}
[
  'zero shunya shoonya शून्य సున్నా பூஜ்யம் ಸೊನ್ನೆ',
  'one ek yek एक okati okka ఒక ఒకటి onru ondru oru ஒன்று ஒரு ondu ಒಂದು',
  'two do don दो दोन rendu irandu రెండు இரண்டு eradu ಎರಡು',
  'three teen tin மூன்று तीन తీన్ mudu moodu మూడు moonru moondru mooru ಮೂರು',
  'four char chaar चार nalugu naalugu నాలుగు nangu naalu naanku நான்கு ನಾಲ್ಕು nalku naalku',
  'five panch paanch pach paach पाँच पांच पाच aidu ayidu ఐదు aindhu ainthu anju ஐந்து aidhu ಐದು',
  'six che chhe saha छह छः सहा aru aaru ఆరు ஆறு ಆರು',
  'seven saat सात edu yedu ఏడు ezhu ஏழு elu yelu ಏಳು',
  'eight aath आठ enimidi ఎనిమిది ettu yettu எட்டு entu enTu ಎಂಟು'.toLowerCase(),
  'nine nau now nav nauu नौ नऊ tommidi తొమ్మిది onbadhu onpathu ஒன்பது ombattu ಒಂಬತ್ತು',
  'ten das daha दस दहा padi పది patthu pathu பத்து hattu ಹತ್ತು',
  'eleven gyarah ग्यारह अकरा పదకొండు பதினொன்று ಹನ್ನೊಂದು',
  'twelve barah बारह बारा పన్నెండు பன்னிரண்டு ಹನ್ನೆರಡು',
  'thirteen terah तेरह तेरा పదమూడు பதின்மூன்று ಹದಿಮೂರು',
  'fourteen chaudah चौदह चौदा పద్నాలుగు பதினான்கு ಹದಿನಾಲ್ಕು',
  'fifteen pandrah पंद्रह पन्द्रह पंधरा పదిహేను பதினைந்து ಹದಿನೈದು',
  'sixteen solah सोलह सोळा పదహారు பதினாறு ಹದಿನಾರು',
  'seventeen satrah सत्रह सतरा పదిహేడు பதினேழு ಹದಿನೇಳು',
  'eighteen atharah athara अठारह अठरा పద్దెనిమిది பதினெட்டு ಹದಿನೆಂಟು',
  'nineteen unnis उन्नीस एकोणीस పంతొమ్మిది பத்தொன்பது ಹತ್ತೊಂಬತ್ತು',
].forEach((words, value) => add(value, words));
[
  [20, 'twenty bees bis vees बीस वीस iravai iruvadu ఇరవై ఇరవయి irupathu இருபது ippattu ಇಪ್ಪತ್ತು'],
  [30, 'thirty tees tis तीस muppai ముప్పై muppathu முப்பது moovattu ಮೂವತ್ತು'],
  [40, 'forty chalis chalees चालीस चाळीस nalabhai నలభై naarpathu நாற்பது nalavattu ನಲವತ್ತು'],
  [50, 'fifty pachas pachaas पचास पन्नास yabhai yaabhai యాభై aimpathu ஐம்பது aivattu ಐವತ್ತು'],
  [60, 'sixty saath sath साठ aravai అరవై arupathu அறுபது aravattu ಅರವತ್ತು'],
  [70, 'seventy sattar सत्तर debbai డెబ్బై ezhupathu எழுபது eppattu ಎಪ್ಪತ್ತು'],
  [80, 'eighty assi ऐंशी अस्सी enabhai ఎనభై enpathu எண்பது embattu ಎಂಬತ್ತು'],
  [90, 'ninety nabbe नव्वद नब्बे tombhai తొంభై thonnooru தொண்ணூறு tombattu ತೊಂಬತ್ತು'],
].forEach(([value, words]) => add(value, words));

const hindi = 'इक्कीस बाईस तेईस चौबीस पच्चीस छब्बीस सत्ताईस अट्ठाईस उनतीस तीस इकतीस बत्तीस तैंतीस चौंतीस पैंतीस छत्तीस सैंतीस अड़तीस उनतालीस चालीस इकतालीस बयालीस तैंतालीस चवालीस पैंतालीस छियालीस सैंतालीस अड़तालीस उनचास पचास इक्यावन बावन तिरपन चौवन पचपन छप्पन सत्तावन अट्ठावन उनसठ साठ इकसठ बासठ तिरसठ चौंसठ पैंसठ छियासठ सड़सठ अड़सठ उनहत्तर सत्तर इकहत्तर बहत्तर तिहत्तर चौहत्तर पचहत्तर छिहत्तर सतहत्तर अठहत्तर उनासी अस्सी इक्यासी बयासी तिरासी चौरासी पचासी छियासी सत्तासी अट्ठासी नवासी नब्बे इक्यानवे बानवे तिरानवे चौरानवे पचानवे छियानवे सत्तानवे अट्ठानवे निन्यानवे';
hindi.split(' ').forEach((word, index) => add(index + 21, word));
add(25, 'pachis pachchis pacchis pachees panchvis पंचवीस');
add(35, 'paintis paintees');
add(45, 'paintalis paintalees पंचेचाळीस');
add(75, 'pachattar pachhattar पंच्याहत्तर');
add(99, 'ninyanve navvyanav नव्याण्णव नव्व्याण्णव');
add(1.5, 'dedh dhed डेढ़ दीड');
add(2.5, 'dhai dhaai ढाई अडीच');
add(150, 'dedhsau दीडशे डेढ़सौ');
add(250, 'dhaaisau अडीचशे ढाईसौ');

const scale = new Map();
for (const [value, words] of [
  [100, 'hundred hundreds sau sow sou सौ शंभर वंद వంద వందలు vandha vanda vandalu vandhalu nooru nuru நூறு நூற்றுக்கு நூரு ನೂರು nuuru ನೂರಕ್ಕೆ'],
  [1000, 'thousand hazaar hazar hajar हजार వెయ్యి వేలు veyyi velu aayiram ayiram ஆயிரம் saavira savira ಸಾವಿರ'],
  [100000, 'lakh lakhs lac लाख లక్ష లక్షలు laksha lakshalu latcham லட்சம் lakhsha ಲಕ್ಷ'],
  [10000000, 'crore crores karod करोड़ करोड कोटी కోటి கோடி ಕೋಟಿ koti kodi'],
]) for (const word of words.split(' ')) scale.set(word, value);
[
  'एकशे ஒருநூறு ஒன்னூறு ನೂರು',
  'दोशे दोनशे இருநூறு இருநூற்று இரண்டுநூறு இரண்டுநூற்று ಇನ್ನೂರು இரணூறு rendunooru irunooru eradanuru innuru',
  'तीनशे முந்நூறு முந்நூற்று முன்னூறு முன்னூற்று மூன்றுநூறு ಮುನ್ನೂರು munnuru',
  'चारशे நானூறு நானூற்று நான்குநூறு ನಾನೂರು ನಾಲ್ಕುನೂರು naanuru',
  'पाचशे ஐந்நூறு ஐந்நூற்று ஐநூறு ஐந்துநூறு ಐನೂರು ainuru',
  'सहाशे அறுநூறு அறுநூற்று ஆறுநூறு ಆರುನೂರು ಆರுநೂರು',
  'सातशे எழுநூறு எழுநூற்று ஏழுநூறு ಏಳುನೂರು ಏಳ್ನೂರು',
  'आठशे எண்ணூறு எண்ணூற்று எட்டுநூறு ಎಂಟುನೂರು',
  'नऊशे தொள்ளாயிரம் தொள்ளாயிரத்து ஒன்பதுநூறு ಒಂಬೈನೂರು ಒಂಬತ್ತುನೂರು',
].forEach((words, index) => add((index + 1) * 100, words));

const words = v => new Set(v.normalize('NFC').split(' '));
const joiners = words('and aur or then ani aani mariyu inka mattum matrum matthu mattu और व एवं फिर आणि तथा మరియు ఇంకా , ; . । \n & + மற்றும் அப்புறம் ಮತ್ತು ಮತ್ತೆ ಹಾಗೂ');
const payment = words('paid pays pay payment payments repay repaid got received collected collect collection returned deposited settled deposit diya diye diyee diyaa diyeh chukaya diye देयक पेमेंट चुकाया चुकाए दिए दिया दिये लौटाए लौटाया भरे भरले भरली दिले दिलेले भरला जमा ಜಮಾ ಕೊಟ್ಟ ಕೊಟ್ಟರು ಕಟ್ಟಿದ ಪಾವತಿ ಪಾವತಿಸಿದ ಪಾವತಿಸಿದರು ಕಟ್ಟಿದರು pavathi paavathi pavati kattida kotta చెల్లింపు చెల్లించాడు చెల్లించారు చెల్లించింది కట్టాడు ఇచ్చాడు ichadu ichchadu chellinchadu chellinchindi kattadu செலுத்தினார் செலுத்தினாள் செலுத்தியது செலுத்து திருப்பினார் கொடுத்தார் seluthinar seluthinaar koduthaar');
const credit = words('credit lend lent loaned borrow borrowed owes owe owed udhar udhaar udar उधार उधारी उधारे बाकीवर उधारीत उसने ಸಾಲಕ್ಕೆ ಸಾಲವಾಗಿ saala saalakke கடன் கடனாக kadan kadanaaga అప్పు అప్పుగా appu appuga బాకీగా బాకిగా baakiga');
const filler = words("i he she has have the a an for to from by me us please give gave add record enter put of on as in today yesterday some ko kko ka ki ke ne nay se mein me main kara kar karna karo kardo likh likho rupee rupees rupay rupaye rs inr aaj kal par hua huye hue रुपयों हुए हुआ हुई rupye paise rupai rupaiya को का की के ने से में पर आज कल रुपये रुपया रूपये रुपयाचा रुपए रुपयेला रुपयांचे रूपए रूपया रूपये पैसा पैसे जोड़ा जोड़ो लिखो दो दे देना गया लिये नोंद करा कर साठी कडून ला ची चे चा रक्कम च्या दिली diley dili tak taka la ne chi cha che kadun rupaye కు కి దగ్గర నుండి నుంచి రూపాయలు రూపాయి రూపాయల ఇవ్వండి వేసుకో చేర్చండి నేడు ఈరోజు ku ki rupayalu rupayi ichu ivvandi nundi today ee roju க்கு கு இடம் இருந்து ரூபாய் ரூபாய்கள் ரூபாயை கொடு சேர்க்கவும் இன்று kku ku idam irundhu roobai rubai rubaai rupai serkavum indru ಗೆ ಕ್ಕೆ ಇಂದ ಯಿಂದ ಅವರಿಂದ ಅವರಿಗೆ ರೂಪಾಯಿ ರೂಪಾಯಿಗಳು ಹಾಕಿ ಸೇರಿಸಿ ಇಂದು ge inda haaki serisi rupayi roopayi indu");
const interrogative = words('what how who whose tell show list check kitna kitni kitne kinna kiti kay entha enta yentha yendu evvalavu evalavu eshtu estu yaar yaaru कितना कितने कितनी बताओ दिखाओ कोण किती काय दाखवा ఎంత ఎవరు చూపించు எவ்வளவு யார் காட்டு ಎಷ್ಟು ಯಾರು ತೋರಿಸು');
const balanceTerms = words('balance balances outstanding due owes owe udhaar udhar baaki baki baqee बाकी बकाया शिल्लक బాకీ బాకి నిల్వ பாக்கி நிலுவை ಬಾಕಿ ಉಳಿಕೆ saala');
const totalTerms = words('total all overall sab sabka kul ekun ottumotham motham mottham ottu कुल सब सबका एकूण सर्व మొత్తం எல்லா மொத்தம் ಒಟ್ಟು ಎಲ್ಲ');
const todayTerms = words('today aaj aj आज ఈరోజు నేడు இன்று indru ಇಂದು ivattu');
const yesterdayTerms = words('yesterday kal कल काल నిన్న நேற்று ನಿನ್ನೆ');
const summaryTerms = words('summary report सारांश अहवाल సారాంశం சுருக்கம் ಸಾರಾಂಶ');
const statementWords = words('bill bills statement statements hisaab hisab khata हिसाब बिल हिशोब బిల్లు స్టేట్మెంట్ பில் கணக்கு ಬಿಲ್ ಲೆಕ್ಕ');
const statementFill = words('print generate prepare get make please settle settlement final monthly account balance ka ki ke k hai kar karo kardo karoaur do dedo de karna this current past last previous month months aaj mahina mahine mahineka mahineki pichla pichle pichhla pichhle iss is jaari का की के कर करो करके दो दीजिए दीजिये दें प्रिंट निकालो बताओ बनाओ पिछला पिछले पिछलेवाले इस महीने माह और हिसाबकिताब चाहिए कितना');
const perCustomer = words('each apiece pratyek प्रत्येक ఒక్కొక్కருக்கு ஒவ்வொருவருக்கும் ತಲಾ');
const queryFill = words('is are did does do we i customer customers customer’s customer\'s ledger amount money left still any has have cash tella balance due outstanding payment credit what how much who whose today yesterday new baaki baki shillak बाकी बकाया शिल्लक hai hain है हैं अहवाल ರಲ್ಲಿ ರಿಗೆ ledger');
const aliases = [
  ['Syed', 'Sayed', 'Sayyed', 'Saiyed', 'Saiyad', 'सैयद', 'सय्यद', 'सईद', 'సయ్యద్', 'சையத்', 'ಸಯ್ಯದ್'],
  ['Ramesh', 'Ramesh Kumar', 'रमेश', 'रमेश कुमार', 'रमेशकुमार', 'రమేష్', 'రమేశ్', 'ரமேஷ்', 'ரமேஷு', 'ரமேஷ் குமார்', 'ರಮೇಶ್', 'ರಮೇಶ'],
  ['Sunita', 'Sunita Devi', 'Suneeta', 'सुनीता', 'सुनिता', 'सुनीता देवी', 'సునీత', 'சுனிதா', 'ಸುನಿತಾ', 'ಸುನೀತಾ'],
  ['Lakshmi', 'Laxmi', 'लक्ष्मी', 'లక్ష్మి', 'லட்சுமி', 'ಲಕ್ಷ್ಮಿ'],
  ['Priya', 'प्रिया', 'ప్రియ', 'பிரியா', 'ಪ್ರಿಯಾ'],
  ['Mohan', 'Mohan Lal', 'मोहन', 'मोहन लाल', 'మోహన్', 'மோகன்', 'ಮೋಹನ್'],
];
const stableAliases = new Map(aliases.flatMap(group => group.map(name => [name.toLowerCase(), group[0]])));
const standaloneSuffix = /^(?:కు|కి|க்கு|கு|ಗೆ|ಕ್ಕೆ|ला|ने|ची|चा|चे|च्या)$/u;
const joinedSuffix = /(?:ವಿಗೆ|ರಿಗೆ|ಯಿಂದ|ನಿಂದ|ಕ್ಕೆ|ಗೆ|வுக்கு|க்கு|விடமிருந்து|కు|కి|నుంచి|నుండి|कडून|च्या|ची|चे|चा|ला|ने)$/u;
const indianDigit = /[०-९౦-౯௦-௯೦-೯]/g;
const amountSeparator = /[ \t]*[-–—][ \t]*/u;

export const normalizeKey = value => value.normalize('NFC').toLowerCase().replace(/[\u200c\u200d]/gu, '').trim().replace(/\s+/gu, ' ');

function tokens(input) {
  const clean = input.normalize('NFC').replace(/[\u200c\u200d]/gu, '').replace(/[’‘]/g, "'")
    .replace(indianDigit, digit => {
      const code = digit.charCodeAt(0);
      const base = [0x966, 0xc66, 0xbe6, 0xce6].find(start => code >= start && code <= start + 9);
      return String(code - base);
    });
  return clean.match(/-?\d+(?:,\d{2,3})*(?:\.\d+)?(?:[ \t]*[-–—][ \t]*\d+(?:,\d{2,3})*(?:\.\d+)?)*|[\p{L}\p{M}]+(?:'[\p{L}\p{M}]+)?|[₹,;.।!?&+\n]/gu)
    ?.map(raw => ({raw, key: raw.toLowerCase().replace(/'s$/u, '')})) ?? [];
}

function numberPart(key) {
  if (scale.has(key)) return {scale: scale.get(key)};
  if (dict.has(key)) return {value: dict.get(key)};
  if (/^-?\d/u.test(key)) {
    if (key.includes(',') && !/^\d{1,3}(?:,\d{2})*,\d{3}(?:\.\d+)?$|^\d{1,3}(?:,\d{3})+(?:\.\d+)?$/u.test(key)) return {value: NaN};
    return {value: Number(key.replaceAll(',', ''))};
  }
  return null;
}

function splitClauses(input) {
  const clauses = [[]];
  for (const [index, token] of input.entries()) {
    const additive = ['and', 'aur', 'और', 'aani', 'आणि', 'మరియు', 'மற்றும்', 'ಮತ್ತು'].includes(token.key)
      && numberPart(input[index - 1]?.key ?? '') && numberPart(input[index + 1]?.key ?? '') && numberPart(input[index - 1].key).scale;
    if (joiners.has(token.key) && !additive) {
      if (clauses.at(-1).length) clauses.push([]);
    } else if (!additive) {
      clauses.at(-1).push(token);
    }
  }
  return clauses.filter(clause => clause.length);
}

function compound(parts) {
  let total = 0;
  let group = 0;
  let previousValue = null;
  let previousScale = Infinity;
  for (const part of parts) {
    if ('value' in part) {
      const value = part.value;
      if (!Number.isFinite(value) || value < 0) return NaN;
      if (previousValue !== null) {
        const additive = (previousValue >= 20 && previousValue < 100 && previousValue % 10 === 0 && value < 10)
          || (previousValue >= 100 && previousValue < 1000 && previousValue % 100 === 0 && value < 100);
        if (!additive) return NaN;
      }
      group += value;
      previousValue = value;
      continue;
    }
    if (previousValue !== null && previousValue >= part.scale) return NaN;
    const multiplier = group || 1;
    if (part.scale === 100 && previousScale !== 100) {
      group = multiplier * 100;
    } else if (part.scale > 100 && part.scale !== previousScale) {
      total += multiplier * part.scale;
      group = 0;
    } else {
      return NaN;
    }
    previousScale = part.scale;
    previousValue = null;
  }
  return total + group;
}

function amountGroups(clause) {
  const groups = [];
  let group = [];
  for (const {key} of clause) {
    if (numberPart(key)) {
      group.push(key);
    } else if (group.length) {
      groups.push(group);
      group = [];
    }
  }
  if (group.length) groups.push(group);
  return groups;
}

function repeatedAmount(group) {
  if (group.length === 1) {
    const amounts = group[0].split(amountSeparator).map(key => numberPart(key)?.value);
    return amounts.length > 1 && amounts.every(amount => amount === amounts[0]) ? amounts[0] : NaN;
  }
  const amounts = group.map(key => numberPart(key).value);
  if (amounts.every(amount => amount === amounts[0]) && Number.isFinite(amounts[0])) return amounts[0];
  if (group.length % 2 !== 0) return NaN;
  const middle = group.length / 2;
  const first = compound(group.slice(0, middle).map(numberPart));
  const second = compound(group.slice(middle).map(numberPart));
  return first === second ? first : NaN;
}

function sharedAmount(clauses, groups, names, kinds) {
  const last = groups.at(-1);
  if (clauses.length < 2 || kinds.size > 1 || names.some(name => !name)
    || new Set(names.map(normalizeKey)).size !== names.length || last.length !== 1
    || groups.slice(0, -1).some(group => group.length)) return NaN;
  const repeated = repeatedAmount(last[0]);
  if (Number.isFinite(repeated)) return repeated;
  return clauses.some(clause => has(clause, perCustomer)) ? compound(last[0].map(numberPart)) : NaN;
}

function stripSuffix(raw, language) {
  if (stableAliases.has(normalizeKey(raw))) return raw;
  const stripped = raw.replace(joinedSuffix, '');
  if (stableAliases.has(normalizeKey(stripped))) return stripped;
  if (stripped === raw || stripped.length < 2) return raw;
  const applicable = (language === 'te-IN' && /[\u0c00-\u0c7f]/u.test(stripped))
    || (language === 'ta-IN' && /[\u0b80-\u0bff]/u.test(stripped))
    || (language === 'kn-IN' && /[\u0c80-\u0cff]/u.test(stripped))
    || (language === 'mr-IN' && /[\u0900-\u097f]/u.test(stripped));
  return applicable ? stripped : raw;
}

function namesIn(clause, language) {
  const remaining = clause.filter(({key}, index) => /\p{L}/u.test(key) && !numberPart(key)
    && !filler.has(key) && !credit.has(key) && !payment.has(key) && !joiners.has(key)
    && !perCustomer.has(key) && !standaloneSuffix.test(key)
    && !(key === 'k' && index > 0 && numberPart(clause[index + 1]?.key ?? '')));
  return remaining.map(({raw, key}) => stripSuffix(raw.endsWith("'s") ? key : raw, language)).join(' ');
}

export function displayName(name) {
  const trimmed = name.trim().replace(/\s+/gu, ' ');
  return stableAliases.get(normalizeKey(trimmed)) || trimmed.replace(/\b[a-z]/gu, letter => letter.toUpperCase());
}

const has = (input, dictionary) => input.some(({key}) => dictionary.has(key));
const gave = words('diya diye diyee diyaa diyeh दिए दिया दिये दिले दिली ಕೊಟ್ಟ ಕೊಟ್ಟರು ఇచ్చాడు கொடுத்தார்');
const recipient = words('to ko kko को ला కు కి க்கு கு ಗೆ ಕ್ಕೆ');
const kind = clause => {
  const onCredit = has(clause, credit);
  const paymentWords = clause.filter(({key}) => payment.has(key));
  const gaveOnly = paymentWords.length > 0 && paymentWords.every(({key}) => gave.has(key));
  if (gaveOnly && (onCredit || has(clause, recipient))) return 'credit';
  if (paymentWords.length && onCredit) {
    return /(?:paid|pays|repaid|received|collected|chukaya|चुकाया|चुकाए|भरले|చెల్లించాడు|చెల్లించింది|செலுத்தினார்|ಪಾವತಿಸಿದ)/u
      .test(clause.map(item => item.key).join(' ')) ? 'payment' : '';
  }
  return paymentWords.length ? 'payment' : onCredit ? 'credit' : '';
};

export function interpret(input, language) {
  const clean = input.trim().replace(/^(?:hey dukaan|हे दुकान)[,!\s]+/iu, '').replace(/^(?:aaj|today|आज|ఈరోజు|இன்று|ಇಂದು)[,:]\s*/u, '');
  const inputTokens = tokens(clean);
  const hasAmount = inputTokens.some(({key}) => key !== 'do' && key !== 'दो' && numberPart(key));
  if (has(inputTokens, statementWords) && !hasAmount && kind(inputTokens) !== 'payment') {
    const personTokens = inputTokens.filter(({key}) => !statementWords.has(key) && !statementFill.has(key) && !queryFill.has(key));
    const period = /(?:previous month|last month|pichh?l[ae] mahin[ae]|पिछल[ेा] (?:महीन[ेा]|माह))/iu.test(clean) ? 'previous'
      : /(?:this month|current month|is mahine|iss mahine|इस महीने)/iu.test(clean) ? 'current' : '';
    return { statement: { name: displayName(namesIn(personTokens, language)), period } };
  }
  const question = clean.endsWith('?') || has(inputTokens, interrogative) || has(inputTokens, summaryTerms)
    || (has(inputTokens, balanceTerms) && !inputTokens.some(({key}) => numberPart(key)));
  if (question) {
    const personTokens = inputTokens.filter(({key}) => !interrogative.has(key) && !balanceTerms.has(key)
      && !summaryTerms.has(key) && !todayTerms.has(key) && !yesterdayTerms.has(key) && !totalTerms.has(key) && !queryFill.has(key));
    return { question: {
      name: displayName(namesIn(personTokens, language)),
      total: has(inputTokens, totalTerms),
      window: has(inputTokens, todayTerms) ? 'today' : has(inputTokens, yesterdayTerms) ? 'yesterday' : '',
      category: has(inputTokens, summaryTerms) ? 'summary'
        : kind(inputTokens) === 'payment' ? 'payment'
        : (has(inputTokens, todayTerms) || has(inputTokens, yesterdayTerms)) && has(inputTokens, credit) ? 'credit'
        : has(inputTokens, balanceTerms) ? 'balance' : has(inputTokens, credit) ? 'credit' : '',
    }};
  }
  const clauses = splitClauses(inputTokens);
  const kinds = new Set(clauses.map(kind).filter(Boolean));
  const names = clauses.map(clause => displayName(namesIn(clause, language)));
  const groups = clauses.map(amountGroups);
  const shared = sharedAmount(clauses, groups, names, kinds);
  return { rows: clauses.map((clause, index) => {
    const amount = Number.isFinite(shared) ? shared
      : groups[index].length === 1 ? compound(groups[index][0].map(numberPart)) : NaN;
    const hasBoth = has(clause, credit) && has(clause, payment);
    const type = kind(clause) || (hasBoth || kinds.size > 1 ? '' : kinds.values().next().value || 'credit');
    const name = names[index];
    const issues = [];
    if (!name) issues.push('Enter a customer name.');
    if (!Number.isFinite(amount) || amount <= 0) issues.push('Enter a positive amount.');
    if (!type) issues.push('Choose credit or payment.');
    return {name, type, amount: amount > 0 && Number.isFinite(amount) ? String(amount) : '',
      issue: issues.length ? issues.join(' ') + ' Input: ' + clause.map(t => t.raw).join(' ') : ''};
  })};
}
