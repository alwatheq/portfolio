import express from "express";
// Required if using Node < 18

const app = express();
app.use(express.json());

app.get("/product/:barcode", async (req, res) => {
  console.log("f");
  const { barcode } = req.params;

  try {
    const apiUrl = `https://world.openfoodfacts.net/api/v2/product/${barcode}?fields=ecoscore_grade,product_name,ingredients_tags,image_front_small_url`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch product data: ${response.statusText}`,
      });
    }

    const data = await response.json();

    if (data.status !== 1) {
      return res.status(404).json({ error: "Product not found" });
    }

    
    const cleanedIngredientsTags = data.product.ingredients_tags.map(
      (tag) => tag.split(":")[1] || tag
    );

    const lastIngredientCode =
      cleanedIngredientsTags[cleanedIngredientsTags.length - 1];
    console.log(lastIngredientCode);

    const halalCheckResult = isHalal(lastIngredientCode); // ✅ Renamed function

    res.json({
      barcode,
      ingredients_tags: cleanedIngredientsTags || [],
      ecoscore_grade: data.product.ecoscore_grade || "",
      product_name: data.product.product_name || "",
      image_front_small_url: data.product.image_front_small_url || "",
      is_halal: halalCheckResult,
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

// ✅ Renamed to avoid shadowing
function isECodeHalal(eCode) {
  const code = eCode.toString().toUpperCase().replace(/^E/, "");

  const doubtfulECodes = [
    "101",
    "234",
    "235",
    "252",
    "260",
    "270",
    "280",
    "281",
    "282",
    "283",
    "297",
    "300",
    "304",
    "317",
    "318",
    "319",
    "320",
    "321",
    "322",
    "325",
    "326",
    "327",
    "328",
    "329",
    "330",
    "331",
    "332",
    "333",
    "334",
    "335",
    "336",
    "337",
    "353",
    "363",
    "365",
    "366",
    "367",
    "380",
    "381",
    "420",
    "422",
    "430",
    "431",
    "432",
    "433",
    "434",
    "435",
    "436",
    "441",
    "470",
    "471",
    "472",
    "473",
    "474",
    "475",
    "476",
    "477",
    "481",
    "482",
    "483",
    "491",
    "492",
    "493",
    "494",
    "495",
    "542",
    "544",
    "575",
    "620",
    "621",
    "622",
    "623",
    "627",
    "631",
    "635",
    "901",
    "904",
    "920",
    "951",
    "965",
    "1200",
    "1405",
    "1510",
    "1518",
    "1520",
  ];

  const nonHalalECodes = [];

  if (nonHalalECodes.includes(code)) {
    return false; // Haram
  } else if (doubtfulECodes.includes(code)) {
    return false; // Doubtful
  } else {
    return true; // Halal
  }
}

function isHalal(eCode) {
  // Convert input to uppercase and remove any "E" prefix if present
  const code = eCode.toString().toUpperCase().replace(/^E/, '');
  
  // Map of doubtful (Syubhah) E-codes with reasons in English and Arabic
  const doubtfulECodes = {
    '101': {
      english: 'May be manufactured from yeast or other fermenting organisms',
      arabic: 'قد يتم تصنيعه من الخميرة أو كائنات التخمير الأخرى'
    },
    '234': {
      english: 'Produced by the growth of a bacterium called Streptococcus lactis',
      arabic: 'ينتج من نمو بكتيريا تسمى المكورات العقدية اللبنية'
    },
    '235': {
      english: 'Produced by the growth of a bacterium called Strepmyces natalensis',
      arabic: 'ينتج من نمو بكتيريا تسمى ستريبمايسيس ناتالينسيس'
    },
    '252': {
      english: 'May be artificially produced from vegetable material and waste animal',
      arabic: 'قد يتم إنتاجه صناعياً من مواد نباتية ومخلفات حيوانية'
    },
    '260': {
      english: 'May be produced by the action of bacterium Acetobacter on alcohol',
      arabic: 'قد ينتج عن طريق عمل بكتيريا الأسيتوباكتر على الكحول'
    },
    '270': {
      english: 'Produced by heat treatment of carbohydrate and fermented by bacteria',
      arabic: 'ينتج من المعالجة الحرارية للكربوهيدرات والتخمير بواسطة البكتيريا'
    },
    '280': {
      english: 'May be derived from natural gas or wood pulp waste liquor by fermentation activity',
      arabic: 'قد يستخرج من الغاز الطبيعي أو سائل نفايات لب الخشب بواسطة نشاط التخمير'
    },
    '281': {
      english: 'Derived from propionic acid',
      arabic: 'مشتق من حمض البروبيونيك'
    },
    '282': {
      english: 'Derived from propionic acid',
      arabic: 'مشتق من حمض البروبيونيك'
    },
    '283': {
      english: 'Derived from propionic acid',
      arabic: 'مشتق من حمض البروبيونيك'
    },
    '297': {
      english: 'Prepared by glucose fermentation using fungi',
      arabic: 'يتم تحضيره بواسطة تخمير الجلوكوز باستخدام الفطريات'
    },
    '300': {
      english: 'May be produced through fermentation process',
      arabic: 'قد يتم إنتاجه من خلال عملية التخمير'
    },
    '304': {
      english: 'Contains palmitic acid which could be from various sources',
      arabic: 'يحتوي على حمض البالميتيك الذي قد يكون من مصادر مختلفة'
    },
    '317': {
      english: 'Produced from sucrose by fermentation with Penicillium sp.',
      arabic: 'ينتج من السكروز بالتخمير مع فطر البنسليوم'
    },
    '318': {
      english: 'Derived from erythorbic acid',
      arabic: 'مشتق من حمض الإريثوربيك'
    },
    '319': {
      english: 'Derived from petroleum',
      arabic: 'مشتق من البترول'
    },
    '320': {
      english: 'Synthetic preparation from p-methoxyphenol',
      arabic: 'تحضير اصطناعي من بارا-ميثوكسي فينول'
    },
    '321': {
      english: 'Synthetic preparation from p-cresol',
      arabic: 'تحضير اصطناعي من بارا-كريسول'
    },
    '322': {
      english: 'May be obtained from animal or vegetable materials',
      arabic: 'قد يتم الحصول عليه من مواد حيوانية أو نباتية'
    },
    '325': {
      english: 'Derived from lactic acid',
      arabic: 'مشتق من حمض اللاكتيك'
    },
    '326': {
      english: 'Derived from lactic acid',
      arabic: 'مشتق من حمض اللاكتيك'
    },
    '327': {
      english: 'Derived from lactic acid',
      arabic: 'مشتق من حمض اللاكتيك'
    },
    '328': {
      english: 'Derived from lactic acid',
      arabic: 'مشتق من حمض اللاكتيك'
    },
    '329': {
      english: 'Derived from lactic acid',
      arabic: 'مشتق من حمض اللاكتيك'
    },
    '330': {
      english: 'Produced by fermentation with fungal strains',
      arabic: 'ينتج بالتخمير باستخدام سلالات فطرية'
    },
    '331': {
      english: 'Derived from citric acid',
      arabic: 'مشتق من حمض الستريك'
    },
    '332': {
      english: 'Derived from citric acid',
      arabic: 'مشتق من حمض الستريك'
    },
    '333': {
      english: 'Derived from citric acid',
      arabic: 'مشتق من حمض الستريك'
    },
    '334': {
      english: 'May be produced from wine industry by-products',
      arabic: 'قد يتم إنتاجه من منتجات ثانوية لصناعة النبيذ'
    },
    '335': {
      english: 'Derived from tartaric acid',
      arabic: 'مشتق من حمض الطرطريك'
    },
    '336': {
      english: 'By-product of the wine industry',
      arabic: 'منتج ثانوي لصناعة النبيذ'
    },
    '337': {
      english: 'Derivative of tartaric acid',
      arabic: 'مشتق من حمض الطرطريك'
    },
    '353': {
      english: 'Prepared from tartaric acid',
      arabic: 'محضر من حمض الطرطريك'
    },
    '363': {
      english: 'Prepared from acetic acid',
      arabic: 'محضر من حمض الخليك'
    },
    '365': {
      english: 'Derived from fumaric acid',
      arabic: 'مشتق من حمض الفيوماريك'
    },
    '366': {
      english: 'Derived from fumaric acid',
      arabic: 'مشتق من حمض الفيوماريك'
    },
    '367': {
      english: 'Derived from fumaric acid',
      arabic: 'مشتق من حمض الفيوماريك'
    },
    '380': {
      english: 'Derived from citric acid',
      arabic: 'مشتق من حمض الستريك'
    },
    '381': {
      english: 'Prepared from citric acid',
      arabic: 'محضر من حمض الستريك'
    },
    '420': {
      english: 'Produced from glucose by hydrogenation',
      arabic: 'ينتج من الجلوكوز بواسطة الهدرجة'
    },
    '422': {
      english: 'May be derived from oils and fats or produced synthetically',
      arabic: 'قد يستخرج من الزيوت والدهون أو ينتج صناعياً'
    },
    '430': {
      english: 'Synthesized using stearic acid, which may be from animal sources',
      arabic: 'يتم تصنيعه باستخدام حمض الستياريك، الذي قد يكون من مصادر حيوانية'
    },
    '431': {
      english: 'Synthesized using stearic acid, which may be from animal sources',
      arabic: 'يتم تصنيعه باستخدام حمض الستياريك، الذي قد يكون من مصادر حيوانية'
    },
    '432': {
      english: 'Contains sorbitol and fatty acid esters',
      arabic: 'يحتوي على السوربيتول وإسترات الأحماض الدهنية'
    },
    '433': {
      english: 'Contains sorbitol and fatty acid esters',
      arabic: 'يحتوي على السوربيتول وإسترات الأحماض الدهنية'
    },
    '434': {
      english: 'Contains sorbitol and fatty acid esters',
      arabic: 'يحتوي على السوربيتول وإسترات الأحماض الدهنية'
    },
    '435': {
      english: 'Contains sorbitol and fatty acid esters',
      arabic: 'يحتوي على السوربيتول وإسترات الأحماض الدهنية'
    },
    '436': {
      english: 'Contains sorbitol and fatty acid esters',
      arabic: 'يحتوي على السوربيتول وإسترات الأحماض الدهنية'
    },
    '441': {
      english: 'Derived from animal sources (skin, bones, tissues)',
      arabic: 'مشتق من مصادر حيوانية (الجلد، العظام، الأنسجة)'
    },
    '470': {
      english: 'Derived from fatty acids which may be from animal sources',
      arabic: 'مشتق من أحماض دهنية قد تكون من مصادر حيوانية'
    },
    '471': {
      english: 'Derived from glycerin and fatty acids which may be from animal sources',
      arabic: 'مشتق من الجلسرين وأحماض دهنية قد تكون من مصادر حيوانية'
    },
    '472': {
      english: 'Prepared from glycerol and fatty acids which may be from animal sources',
      arabic: 'محضر من الجليسرول وأحماض دهنية قد تكون من مصادر حيوانية'
    },
    '473': {
      english: 'Prepared from sucrose and fatty acids which may be from animal sources',
      arabic: 'محضر من السكروز وأحماض دهنية قد تكون من مصادر حيوانية'
    },
    '474': {
      english: 'Prepared from sucrose and triglycerides which may include animal fats',
      arabic: 'محضر من السكروز والدهون الثلاثية التي قد تشمل دهون حيوانية'
    },
    '475': {
      english: 'Prepared from glycerol and fatty acids',
      arabic: 'محضر من الجليسرول وأحماض دهنية'
    },
    '476': {
      english: 'Prepared from castor oil and glycerol esters',
      arabic: 'محضر من زيت الخروع وإسترات الجليسرول'
    },
    '477': {
      english: 'Prepared from propylene glycol and fatty acids',
      arabic: 'محضر من بروبيلين جلايكول وأحماض دهنية'
    },
    '481': {
      english: 'Prepared from lactic acid and stearic acid',
      arabic: 'محضر من حمض اللاكتيك وحمض الستياريك'
    },
    '482': {
      english: 'Prepared from lactic acid and stearic acid',
      arabic: 'محضر من حمض اللاكتيك وحمض الستياريك'
    },
    '483': {
      english: 'Prepared from tartaric acid and stearic acid',
      arabic: 'محضر من حمض الطرطريك وحمض الستياريك'
    },
    '491': {
      english: 'Prepared from stearic acid and sorbitol',
      arabic: 'محضر من حمض الستياريك والسوربيتول'
    },
    '492': {
      english: 'Prepared from stearic acid and sorbitol',
      arabic: 'محضر من حمض الستياريك والسوربيتول'
    },
    '493': {
      english: 'Prepared from lauric acid and sorbitol',
      arabic: 'محضر من حمض اللوريك والسوربيتول'
    },
    '494': {
      english: 'Prepared from oleic acid and sorbitol',
      arabic: 'محضر من حمض الأوليك والسوربيتول'
    },
    '495': {
      english: 'Prepared from palmitic acid and sorbitol',
      arabic: 'محضر من حمض البالميتيك والسوربيتول'
    },
    '542': {
      english: 'Extracted from animal bones',
      arabic: 'مستخرج من عظام الحيوانات'
    },
    '544': {
      english: 'Derived from polyphosphoric acid, calcium source may be animal',
      arabic: 'مشتق من حمض البوليفوسفوريك، مصدر الكالسيوم قد يكون حيواني'
    },
    '575': {
      english: 'Produced by oxidation of glucose',
      arabic: 'ينتج من أكسدة الجلوكوز'
    },
    '620': {
      english: 'Produced by bacterial fermentation of carbohydrates',
      arabic: 'ينتج من تخمير الكربوهيدرات بواسطة البكتيريا'
    },
    '621': {
      english: 'Derived from glutamic acid',
      arabic: 'مشتق من حمض الجلوتاميك'
    },
    '622': {
      english: 'Derived from glutamic acid',
      arabic: 'مشتق من حمض الجلوتاميك'
    },
    '623': {
      english: 'Derived from glutamic acid',
      arabic: 'مشتق من حمض الجلوتاميك'
    },
    '627': {
      english: 'May be derived from yeast extract or fish sources',
      arabic: 'قد يشتق من مستخلص الخميرة أو مصادر سمكية'
    },
    '631': {
      english: 'May be derived from meat or fish sources',
      arabic: 'قد يشتق من مصادر لحم أو سمك'
    },
    '635': {
      english: 'Mixture of nucleotides which may be from various sources',
      arabic: 'خليط من النيوكليوتيدات التي قد تكون من مصادر مختلفة'
    },
    '901': {
      english: 'Produced by bees, processing methods may vary',
      arabic: 'منتج بواسطة النحل، قد تختلف طرق المعالجة'
    },
    '904': {
      english: 'Obtained from secretions of the lac insect',
      arabic: 'مستخرج من إفرازات حشرة اللاك'
    },
    '920': {
      english: 'May be manufactured from animal hair or feathers',
      arabic: 'قد يصنع من شعر الحيوانات أو الريش'
    },
    '951': {
      english: 'Produced by combining amino acids',
      arabic: 'ينتج من دمج الأحماض الأمينية'
    },
    '965': {
      english: 'Derived from starch and broken down by enzymes',
      arabic: 'مشتق من النشا ويتم تكسيره بواسطة الإنزيمات'
    },
    '1200': {
      english: 'Manufactured from glucose and sorbitol',
      arabic: 'مصنع من الجلوكوز والسوربيتول'
    },
    '1405': {
      english: 'Produced using enzyme treatment of starch',
      arabic: 'ينتج باستخدام معالجة النشا بالإنزيمات'
    },
    '1510': {
      english: 'Produced by fermentation or from various chemical processes',
      arabic: 'ينتج بالتخمير أو من عمليات كيميائية مختلفة'
    },
    '1518': {
      english: 'Produced by acetylation of glycerol',
      arabic: 'ينتج بواسطة أستلة الجليسرول'
    },
    '1520': {
      english: 'Produced synthetically, may use glycerol in manufacturing',
      arabic: 'ينتج صناعياً، قد يستخدم الجليسرول في التصنيع'
    }
  };
  
  // List of non-halal E-codes
  const nonHalalECodes = [
    // Add any explicitly non-halal codes here if identified
  ];
  
  if (nonHalalECodes.includes(code)) {
    return {
      isHalal: false,
      status: {
        english: "non-halal",
        arabic: "غير حلال"
      },
      reason: {
        english: "Listed as non-halal in MUIS guidelines",
        arabic: "مدرج كمادة غير حلال في إرشادات مجلس أوغاما الإسلامي سنغافورة"
      }
    };
  } else if (code in doubtfulECodes) {
    return {
      isHalal: "doubtful",
      status: {
        english: "syubhah (doubtful)",
        arabic: "شبهة (مشكوك فيه)"
      },
      reason: {
        english: doubtfulECodes[code].english,
        arabic: doubtfulECodes[code].arabic
      }
    };
  } else {
    return {
      isHalal: true,
      status: {
        english: "halal",
        arabic: "حلال"
      },
      reason: {
        english: "Listed as permissible in MUIS guidelines",
        arabic: "مدرج كمادة مسموح بها في إرشادات مجلس أوغاما الإسلامي سنغافورة"
      }
    };
  }
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});