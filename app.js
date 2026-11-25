/* ==========================================================================
   上林閱讀生態系 (Shanglin Reading Ecosystem) - 前端核心邏輯與全端 API 串接
   ========================================================================== */

const MOOD_TAG_OPTIONS = [
  "感動落淚", "熱血沸騰", "大開眼界", "發人深省",
  "溫暖治癒", "燒腦推理", "幽默風趣", "知識滿滿", "腦洞大開"
];

const BADGE_CATALOG = [
  { id: "first_book", icon: "🌱", name: "初踏書境", desc: "完成第 1 篇閱讀書評任務" },
  { id: "bookworm_5", icon: "📚", name: "博覽群書", desc: "累積完成 5 本以上閱讀書評" },
  { id: "breadth_4", icon: "🧭", name: "跨域探索家", desc: "閱讀廣度橫跨 4 大以上知識領域" },
  { id: "breadth_all", icon: "🌌", name: "八星全知者", desc: "點亮全部 8 大知識星域分類" },
  { id: "page_500", icon: "🔥", name: "五百頁突破", desc: "累積閱讀總頁數達 500 頁以上" },
  { id: "page_1000", icon: "👑", name: "千頁萬卷王", desc: "累積閱讀總頁數達 1,000 頁以上" },
  { id: "depth_lover", icon: "💎", name: "深度思考者", desc: "撰寫出深度指數 85 分以上的好書評" },
  { id: "critic_star", icon: "🌟", name: "星辰書評家", desc: "累積 3 篇以上深度指數達 85 分的書評" }
];

// 內建預設資料（當使用者直接雙擊 index.html 離線瀏覽時也能完美運作，連線伺服器時則自動同步）
const FALLBACK_STATE = {
  classes: [
    {
      id: "pangolin",
      name: "甲寶寶",
      species: "穿山甲",
      element: "森林守護・掘金探索",
      color: "#d97706",
      description: "雙溪淺山森林的守護者（穿山甲），擅長深入挖掘書本中的細節與知識寶藏，喜愛自然科普與歷史故事。",
      bonusCategory: "science",
      stages: [
        { stage: 1, minLevel: 1, title: "Lv.1 甲寶寶", desc: "剛從雙溪樹洞探出頭的甲寶寶，背著柔軟的小鱗片，對每一本繪本與故事書都充滿好奇。", image: "./assets/characters/pangolin_stage_1.png" },
        { stage: 2, minLevel: 2, title: "Lv.2 岩盾甲", desc: "鱗片進化為堅實的岩盾，帶著滿滿求知慾在書頁間尋找有趣的蛛絲馬跡。", image: "./assets/characters/pangolin_stage_2.png" },
        { stage: 3, minLevel: 3, title: "Lv.3 晶甲勇者", desc: "鱗甲閃耀著晶亮光芒的晶甲勇者，能讀完厚厚的文字書並挖掘出深刻的心得寶藏。", image: "./assets/characters/pangolin_stage_3.png" },
        { stage: 4, minLevel: 4, title: "Lv.4 烈地戰甲", desc: "身披烈地戰甲的知識衛士，閱讀足跡開始橫跨多個不同的圖書分類領域。", image: "./assets/characters/pangolin_stage_4.png" },
        { stage: 5, minLevel: 5, title: "Lv.5 玄武甲王", desc: "覺醒玄武甲王之力，能輕鬆駕馭高難度書籍，寫出令同學讚嘆的精彩書評。", image: "./assets/characters/pangolin_stage_5.png" },
        { stage: 6, minLevel: 6, title: "Lv.6 聖地龍甲", desc: "通曉八大知識星域的終極聖地龍甲，每一篇書評都閃耀著大地智慧之光！", image: "./assets/characters/pangolin_stage_6.png" }
      ]
    },
    {
      id: "fish",
      name: "泡泡魚",
      species: "豆仔魚",
      element: "溪流躍動・靈感泡泡",
      color: "#0284c7",
      description: "悠游於雙溪清澈溪流的活力小魚（豆仔魚），每讀完一本好書就會吐出七彩靈感泡泡，熱愛語文文學與綜合百科。",
      bonusCategory: "literature",
      stages: [
        { stage: 1, minLevel: 1, title: "Lv.1 泡泡魚", desc: "在雙溪淺灘吐著水泡的泡泡魚，最喜歡聽有趣的故事與童話繪本。", image: "./assets/characters/fish_stage_1.png" },
        { stage: 2, minLevel: 2, title: "Lv.2 疾流魚", desc: "化身為泳速飛快的疾流魚，開始逆流而上挑戰更長篇的故事書。", image: "./assets/characters/fish_stage_2.png" },
        { stage: 3, minLevel: 3, title: "Lv.3 碧鱗戰魚", desc: "披上翠綠水紋鱗甲的碧鱗戰魚，能在浩瀚書海中將重點整理得清清楚楚。", image: "./assets/characters/fish_stage_3.png" },
        { stage: 4, minLevel: 4, title: "Lv.4 潮汐破浪", desc: "掌握潮汐破浪之力，游向更廣闊的知識海洋，跨領域吸收豐富養分。", image: "./assets/characters/fish_stage_4.png" },
        { stage: 5, minLevel: 5, title: "Lv.5 深淵碧龍", desc: "躍過知識飛瀑化為深淵碧龍，面對五顆星難度的經典好書也毫不畏懼。", image: "./assets/characters/fish_stage_5.png" },
        { stage: 6, minLevel: 6, title: "Lv.6 滄海龍盾", desc: "覺醒終極滄海龍盾型態，博覽群書、文思泉湧，引領全校掀起閱讀浪潮！", image: "./assets/characters/fish_stage_6.png" }
      ]
    },
    {
      id: "muntjac",
      name: "芽芽羌",
      species: "山羌",
      element: "山林敏捷・萌芽思辨",
      color: "#16a34a",
      description: "輕巧奔馳於雙溪山林的可愛精靈（山羌），頭上的小嫩芽會隨閱讀累積而進化，喜愛歷史地理與社會人文。",
      bonusCategory: "history_geo",
      stages: [
        { stage: 1, minLevel: 1, title: "Lv.1 芽芽羌", desc: "頭頂剛冒出翠綠小嫩芽的芽芽羌，睜著圓滾滾的大眼睛探索圖書館。", image: "./assets/characters/muntjac_stage_1.png" },
        { stage: 2, minLevel: 2, title: "Lv.2 翠影羌", desc: "步伐輕快如翠影的翠影羌，養成天天閱讀的好習慣，知識能量越來越強。", image: "./assets/characters/muntjac_stage_2.png" },
        { stage: 3, minLevel: 3, title: "Lv.3 疾風羌", desc: "奔馳如風的疾風羌，能細膩體會書中主角的心情並寫下溫暖書評。", image: "./assets/characters/muntjac_stage_3.png" },
        { stage: 4, minLevel: 4, title: "Lv.4 雷角戰羌", desc: "鹿角閃耀雷光之力的雷角戰羌，踏遍雙溪淡蘭古道與八大圖書領域。", image: "./assets/characters/muntjac_stage_4.png" },
        { stage: 5, minLevel: 5, title: "Lv.5 蒼芎羌", desc: "氣勢直達天際的蒼芎羌，兼具閱讀廣度與深度，是同學們請教好書的森林智者。", image: "./assets/characters/muntjac_stage_5.png" },
        { stage: 6, minLevel: 6, title: "Lv.6 森羅聖羌", desc: "與整座山林知識共鳴的終極森羅聖羌，讓萬卷書化為漫山遍野的生命奇蹟！", image: "./assets/characters/muntjac_stage_6.png" }
      ]
    },
    {
      id: "magpie",
      name: "藍羽仔",
      species: "台灣藍鵲",
      element: "長尾翩翩・美學共鳴",
      color: "#4f46e5",
      description: "成群飛越雙溪山谷的寶石飛鳥（台灣藍鵲），擁有修長美麗的尾羽，熱愛與同伴分享書評，專精藝術美學與心理哲學。",
      bonusCategory: "arts",
      stages: [
        { stage: 1, minLevel: 1, title: "Lv.1 藍羽仔", desc: "剛長出藍色小羽毛的藍羽仔，喜歡在書枝間跳躍，大聲朗讀好聽的佳句。", image: "./assets/characters/magpie_stage_1.png" },
        { stage: 2, minLevel: 2, title: "Lv.2 疾風藍鵲", desc: "展翅乘風的疾風藍鵲，開始嘗試獨立完成結構完整的三段式書評。", image: "./assets/characters/magpie_stage_2.png" },
        { stage: 3, minLevel: 3, title: "Lv.3 幻影羽刃", desc: "長尾飄逸如幻影羽刃，能從高空俯瞰不同書籍的關聯，見解獨特。", image: "./assets/characters/magpie_stage_3.png" },
        { stage: 4, minLevel: 4, title: "Lv.4 雷翼巡空", desc: "雙翼閃耀雷光的雷翼巡空，熱心在書評星牆分享好書，帶動全班愛上閱讀。", image: "./assets/characters/magpie_stage_4.png" },
        { stage: 5, minLevel: 5, title: "Lv.5 蒼芎幻羽", desc: "翱翔天際的蒼芎幻羽，每一根尾羽都代表精通的知識領域，書評文字優美深刻。", image: "./assets/characters/magpie_stage_5.png" },
        { stage: 6, minLevel: 6, title: "Lv.6 九霄羽皇", desc: "進化為傳說中的九霄羽皇，翱翔於八大知識星域之巔，璀璨奪目！", image: "./assets/characters/magpie_stage_6.png" }
      ]
    },
    {
      id: "eagle",
      name: "鷲鷲寶",
      species: "大冠鷲",
      element: "傲視天際・巔峰洞察",
      color: "#9333ea",
      description: "盤旋於雙溪晴空鳴叫「忽溜～忽溜」的猛禽王者（大冠鷲），擁有銳利雙眼能一眼看穿書籍核心，專精應用科技與哲學思辨。",
      bonusCategory: "applied_sci",
      stages: [
        { stage: 1, minLevel: 1, title: "Lv.1 鷲鷲寶", desc: "頭頂毛茸茸羽冠的鷲鷲寶，站在高高的書堆上好奇張望世界。", image: "./assets/characters/eagle_stage_1.png" },
        { stage: 2, minLevel: 2, title: "Lv.2 烈羽鷲", desc: "雙翅充滿活力的烈羽鷲，能快速抓出每一本書的主旨大意。", image: "./assets/characters/eagle_stage_2.png" },
        { stage: 3, minLevel: 3, title: "Lv.3 蒼藍戰鷲", desc: "銳眼穿雲的蒼藍戰鷲，能穿透厚重書籍，發現別人沒注意到的知識細節。", image: "./assets/characters/eagle_stage_3.png" },
        { stage: 4, minLevel: 4, title: "Lv.4 破空神鷲", desc: "振翅劃破長空的破空神鷲，閱讀領域遍及自然、科技、人文與歷史。", image: "./assets/characters/eagle_stage_4.png" },
        { stage: 5, minLevel: 5, title: "Lv.5 天芎霸羽", desc: "直入雲霄的天芎霸羽，專挑高頁數、高難度的經典好書挑戰，深度指數名列前茅。", image: "./assets/characters/eagle_stage_5.png" },
        { stage: 6, minLevel: 6, title: "Lv.6 雷霆皇鷲", desc: "統御雙溪晴空的最高傳奇雷霆皇鷲，俯瞰萬卷書海，擁有無與倫比的宏觀大智慧！", image: "./assets/characters/eagle_stage_6.png" }
      ]
    }
  ],
  categories: [
    { id: "literature", name: "語文文學", code: "800", icon: "📖", color: "#ec4899", desc: "故事繪本、童話、小說、詩歌、散文與神話" },
    { id: "science", name: "自然科普", code: "300", icon: "🔬", color: "#10b981", desc: "雙溪生態、動植物圖鑑、天文、地球科學與數學" },
    { id: "history_geo", name: "歷史地理", code: "600/700", icon: "🗺️", color: "#f59e0b", desc: "家鄉雙溪文史、淡蘭古道、世界歷史與名人傳記" },
    { id: "social", name: "社會人文", code: "500", icon: "🏛️", color: "#3b82f6", desc: "環境保護、公民社會、民俗文化與品格教育" },
    { id: "arts", name: "藝術美學", code: "900", icon: "🎨", color: "#8b5cf6", desc: "音樂、繪畫、手作美勞、建築與運動遊戲" },
    { id: "philosophy", name: "心理哲學", code: "100/200", icon: "🔮", color: "#6366f1", desc: "情緒探索、思考邏輯、生命教育與品德故事" },
    { id: "applied_sci", name: "應用科技", code: "400", icon: "⚙️", color: "#06b6d4", desc: "AI電腦科技、奇妙發明、醫療健康與生活工藝" },
    { id: "general", name: "綜合百科", code: "000", icon: "🌟", color: "#eab308", desc: "十萬個為什麼、圖鑑百科、博物館與跨領域奇聞" }
  ],
  students: [
    { id: "S101", studentCode: "40101", seatNo: "01", name: "林小星", gradeClass: "四年忠班", role: "student", staffTitle: "", classId: "pangolin", avatarCustom: "", xp: 1480, badges: ["first_book", "breadth_4", "depth_lover", "critic_star"] },
    { id: "S102", studentCode: "40102", seatNo: "02", name: "陳溪游", gradeClass: "四年忠班", role: "student", staffTitle: "", classId: "fish", avatarCustom: "", xp: 920, badges: ["first_book", "page_500"] },
    { id: "S103", studentCode: "50105", seatNo: "05", name: "張山嵐", gradeClass: "五年孝班", role: "student", staffTitle: "", classId: "muntjac", avatarCustom: "", xp: 1750, badges: ["first_book", "breadth_4", "page_1000", "depth_lover"] },
    { id: "S104", studentCode: "60108", seatNo: "08", name: "王藍翎", gradeClass: "六年仁班", role: "student", staffTitle: "", classId: "magpie", avatarCustom: "", xp: 2150, badges: ["first_book", "bookworm_5", "breadth_4", "breadth_all", "page_1000", "depth_lover", "critic_star"] },
    { id: "S105", studentCode: "30112", seatNo: "12", name: "李天翔", gradeClass: "三年愛班", role: "student", staffTitle: "", classId: "eagle", avatarCustom: "", xp: 540, badges: ["first_book"] },
    { id: "T001", studentCode: "principal", seatNo: "-", name: "管理者校長", gradeClass: "校長室", role: "teacher", staffTitle: "管理者校長", classId: "eagle", avatarCustom: "", xp: 2600, badges: ["first_book", "breadth_all"] },
    { id: "T002", studentCode: "teacher", seatNo: "-", name: "管理者閱推教師", gradeClass: "圖書室", role: "teacher", staffTitle: "管理者閱推教師", classId: "magpie", avatarCustom: "", xp: 2600, badges: ["first_book", "breadth_all"] },
    { id: "T003", studentCode: "director", seatNo: "-", name: "管理者教務處主任", gradeClass: "教務處", role: "teacher", staffTitle: "管理者教務處主任", classId: "pangolin", avatarCustom: "", xp: 2600, badges: ["first_book", "breadth_all"] },
    { id: "T004", studentCode: "leader", seatNo: "-", name: "管理者教學組長", gradeClass: "教務處教學組", role: "teacher", staffTitle: "管理者教學組長", classId: "muntjac", avatarCustom: "", xp: 2600, badges: ["first_book", "breadth_all"] },
    { id: "T005", studentCode: "class_teacher", seatNo: "-", name: "班級導師", gradeClass: "教師辦公室", role: "teacher", staffTitle: "教師", classId: "fish", avatarCustom: "", xp: 2400, badges: ["first_book", "breadth_all"] }
  ],
  reviews: [
    {
      id: "R1001", studentId: "S101", studentName: "林小星", gradeClass: "四年忠班", seatNo: "01", classId: "pangolin",
      bookTitle: "穿山甲的祕密森林", author: "林良 / 生態繪本團隊", category: "science", pages: 168, difficulty: 3, rating: 5,
      moodTags: ["感動落淚", "溫暖治癒", "知識滿滿"],
      promptSummary: "介紹臺灣穿山甲媽媽如何背著甲寶寶在雙溪淺山森林裡找尋白蟻、挖掘洞穴並躲避危險。",
      promptTakeaway: "原來穿山甲沒有牙齒，是用長長的舌頭吃蟻類，我們一定要好好愛護雙溪的自然棲地！",
      promptQuote: "「每一片鱗甲下，都藏著守護森林的溫柔力量。」",
      reviewText: "【核心摘要】介紹臺灣穿山甲媽媽如何背著甲寶寶在雙溪淺山森林裡找尋白蟻、挖掘洞穴並躲避危險。\n【深刻啟發】原來穿山甲沒有牙齒，是用長長的舌頭吃蟻類，我們一定要好好愛護雙溪的自然棲地！\n【喜愛金句】「每一片鱗甲下，都藏著守護森林的溫柔力量。」",
      depthScore: 91, xpEarned: 250, likes: 16, teacherComment: "【管理者閱推教師】結合了我們雙溪在地的穿山甲生態觀察，心得寫得真棒！", createdAt: "2026-11-10T14:20:00+08:00"
    },
    {
      id: "R1002", studentId: "S101", studentName: "林小星", gradeClass: "四年忠班", seatNo: "01", classId: "pangolin",
      bookTitle: "淡蘭古道尋寶記", author: "雙溪文史工作室", category: "history_geo", pages: 210, difficulty: 3, rating: 5,
      moodTags: ["大開眼界", "熱血沸騰", "知識滿滿"],
      promptSummary: "主角跟著爺爺走訪雙溪渡船頭、打鐵舖與淡蘭古道石階，認識百年前先民挑擔走古道的歷史。",
      promptTakeaway: "每天上學經過的雙溪街道，以前竟然是重要的水陸交通樞紐，讓我對家鄉更有感情了。",
      promptQuote: "「石階上的每一道青苔，都是時光留下的故事書。」",
      reviewText: "【核心摘要】主角跟著爺爺走訪雙溪渡船頭、打鐵舖與淡蘭古道石階，認識百年前先民挑擔走古道的歷史。\n【深刻啟發】每天上學經過的雙溪街道，以前竟然是重要的水陸交通樞紐，讓我對家鄉更有感情了。\n【喜愛金句】「石階上的每一道青苔，都是時光留下的故事書。」",
      depthScore: 89, xpEarned: 240, likes: 12, teacherComment: "【管理者校長】很棒的家鄉文史探索！下次校外教學你可以當小導覽員喔！", createdAt: "2026-11-12T18:05:00+08:00"
    },
    {
      id: "R1003", studentId: "S101", studentName: "林小星", gradeClass: "四年忠班", seatNo: "01", classId: "pangolin",
      bookTitle: "神奇柑仔店：帶來幸福的錢天堂", author: "廣嶋玲子", category: "literature", pages: 176, difficulty: 3, rating: 5,
      moodTags: ["發人深省", "腦洞大開", "幽默風趣"],
      promptSummary: "幸運的客人才能找到錢天堂柑仔店，老闆娘紅子會賣給客人實現願望的神奇零食。",
      promptTakeaway: "神奇零食雖然能幫忙，但如果自己貪心或不遵守使用說明，反而會招來麻煩，靠自己努力才最踏實。",
      promptQuote: "「是福是禍，全看客人您自己怎麼選擇囉！」",
      reviewText: "【核心摘要】幸運的客人才能找到錢天堂柑仔店，老闆娘紅子會賣給客人實現願望的神奇零食。\n【深刻啟發】神奇零食雖然能幫忙，但如果自己貪心或不遵守使用說明，反而會招來麻煩，靠自己努力才最踏實。\n【喜愛金句】「是福是禍，全看客人您自己怎麼選擇囉！」",
      depthScore: 88, xpEarned: 220, likes: 15, teacherComment: "【管理者教學組長】把故事背後的寓意體會得很深刻！", createdAt: "2026-11-15T20:10:00+08:00"
    },
    {
      id: "R1004", studentId: "S101", studentName: "林小星", gradeClass: "四年忠班", seatNo: "01", classId: "pangolin",
      bookTitle: "給孩子的AI機器人未來百科", author: "科普少年編輯部", category: "applied_sci", pages: 192, difficulty: 4, rating: 4,
      moodTags: ["大開眼界", "腦洞大開", "知識滿滿"],
      promptSummary: "用圖解介紹人工智慧如何學習人類說話、辨識影像，以及未來機器人在醫療與生態保育上的應用。",
      promptTakeaway: "AI 可以幫忙監測森林裡的穿山甲與山羌蹤跡，科技跟自然保育原來可以一起合作！",
      promptQuote: "「科技來自人類的好奇心，更應該用來守護地球。」",
      reviewText: "【核心摘要】用圖解介紹人工智慧如何學習人類說話、辨識影像，以及未來機器人在醫療與生態保育上的應用。\n【深刻啟發】AI 可以幫忙監測森林裡的穿山甲與山羌蹤跡，科技跟自然保育原來可以一起合作！\n【喜愛金句】「科技來自人類的好奇心，更應該用來守護地球。」",
      depthScore: 90, xpEarned: 240, likes: 10, teacherComment: "", createdAt: "2026-11-16T16:40:00+08:00"
    },
    {
      id: "R1005", studentId: "S102", studentName: "陳溪游", gradeClass: "四年忠班", seatNo: "02", classId: "fish",
      bookTitle: "溪流裡的銀色閃電：臺灣淡水魚圖鑑", author: "陳義雄", category: "science", pages: 240, difficulty: 3, rating: 5,
      moodTags: ["大開眼界", "知識滿滿"],
      promptSummary: "介紹臺灣溪流常見的豆仔魚、苦花魚、溪哥與蝦虎，還有護魚封溪的成功故事。",
      promptTakeaway: "雙溪有牡丹溪與平林溪交會，水質清澈才有這麼多泡泡魚（豆仔魚）游來游去，不能亂丟垃圾。",
      promptQuote: "「清澈的溪水，是魚兒最美麗的家園。」",
      reviewText: "【核心摘要】介紹臺灣溪流常見的豆仔魚、苦花魚、溪哥與蝦虎，還有護魚封溪的成功故事。\n【深刻啟發】雙溪有牡丹溪與平林溪交會，水質清澈才有這麼多泡泡魚（豆仔魚）游來游去，不能亂丟垃圾。\n【喜愛金句】「清澈的溪水，是魚兒最美麗的家園。」",
      depthScore: 86, xpEarned: 230, likes: 14, teacherComment: "【管理者教務處主任】完全發揮了泡泡魚守護雙溪河岸的精神！", createdAt: "2026-11-14T11:30:00+08:00"
    },
    {
      id: "R1006", studentId: "S104", studentName: "王藍翎", gradeClass: "六年仁班", seatNo: "08", classId: "magpie",
      bookTitle: "山谷裡的藍寶石：臺灣藍鵲家族日記", author: "劉克襄", category: "arts", pages: 260, difficulty: 4, rating: 5,
      moodTags: ["溫暖治癒", "感動落淚", "知識滿滿"],
      promptSummary: "透過優美的散文與生態插畫，記錄臺灣藍鵲「幫手制度」——哥哥姊姊會留下來幫忙照顧鳥巢裡的弟妹。",
      promptTakeaway: "藍羽仔不僅羽毛漂亮，最美的其實是牠們家族互相幫忙、團結合作照顧幼鳥的心意。",
      promptQuote: "「當長尾藍影掠過雙溪山嵐，那是森林最動人的詩篇。」",
      reviewText: "【核心摘要】透過優美的散文與生態插畫，記錄臺灣藍鵲「幫手制度」——哥哥姊姊會留下來幫忙照顧鳥巢裡的弟妹。\n【深刻啟發】藍羽仔不僅羽毛漂亮，最美的其實是牠們家族互相幫忙、團結合作照顧幼鳥的心意。\n【喜愛金句】「當長尾藍影掠過雙溪山嵐，那是森林最動人的詩篇。」",
      depthScore: 95, xpEarned: 290, likes: 21, teacherComment: "【管理者閱推教師】文字優美又有溫度，不愧是 Lv.6 的九霄羽皇！", createdAt: "2026-11-16T09:15:00+08:00"
    }
  ]
};

let appState = null;
let currentStudentId = "S101";
let isBackendOnline = false;
let selectedMoodTags = new Set(["大開眼界", "知識滿滿"]);
let inspectingClassId = "pangolin";

// ============================================================================
// 等級與角色六階段晉級計算公式 (每 400 XP 升 1 級，Lv.1 ~ Lv.6 每級解鎖新外觀)
// ============================================================================
function getLevelInfo(xp) {
  const numXp = Math.max(0, Number(xp) || 0);
  const level = Math.floor(numXp / 400) + 1;
  const currentLevelStartXp = (level - 1) * 400;
  const nextLevelXp = level * 400;
  const progressPercent = Math.min(100, Math.round(((numXp - currentLevelStartXp) / 400) * 100));
  return { level, numXp, currentLevelStartXp, nextLevelXp, progressPercent };
}

function getCharacterStageInfo(classObj, level) {
  if (!classObj || !classObj.stages) return null;
  let activeStage = classObj.stages[0];
  let nextStage = null;
  for (let i = 0; i < classObj.stages.length; i++) {
    if (level >= classObj.stages[i].minLevel) {
      activeStage = classObj.stages[i];
      nextStage = classObj.stages[i + 1] || null;
    }
  }
  return { activeStage, nextStage };
}

const CUSTOM_IMG_STORE_KEY = "shanglin_reading_custom_stage_images_v3";
const LOCAL_STATE_KEY = "reading_quest_backup_state_v3";
const CURRENT_USER_KEY = "reading_quest_current_student_v3";
const CLOUD_GAS_URL_KEY = "shanglin_reading_cloud_gas_url_v3";

// ★ 方案 2（GitHub Pages + Google 試算表雲端資料庫）：
// 已綁定學校專屬 Google Apps Script 網頁應用程式網址，全校親師生打開網頁即 100% 自動連線！
const DEFAULT_CLOUD_GAS_URL = "https://script.google.com/macros/s/AKfycbxWk2aAO4Vd7Jlb6iSZUqe_0_68OmC4L6Xe6GswB0nNZQT3aUn-AR15L7sGR7f10hXjcw/exec";

let isCloudGasOnline = false;

function getCloudGasUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlFromParam = params.get("gas");
    if (urlFromParam && urlFromParam.startsWith("https://script.google.com/")) {
      localStorage.setItem(CLOUD_GAS_URL_KEY, urlFromParam.trim());
      return urlFromParam.trim();
    }
    const saved = localStorage.getItem(CLOUD_GAS_URL_KEY);
    if (saved && saved.trim().startsWith("https://script.google.com/")) return saved.trim();
  } catch (e) {}
  return (DEFAULT_CLOUD_GAS_URL || "").trim();
}

async function callCloudGasPost(payloadObj) {
  const gasUrl = getCloudGasUrl();
  if (!gasUrl) throw new Error("No Cloud GAS URL configured");
  const res = await fetch(gasUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payloadObj)
  });
  if (!res.ok) throw new Error("Cloud GAS request failed");
  return await res.json();
}

function getCustomImageMap() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_IMG_STORE_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

function saveCustomImageToMap(classId, stageNum, titleVal, imageData) {
  try {
    const map = getCustomImageMap();
    const key = `${classId}_${stageNum}`;
    map[key] = {
      title: titleVal,
      image: imageData,
      updatedAt: Date.now()
    };
    localStorage.setItem(CUSTOM_IMG_STORE_KEY, JSON.stringify(map));
  } catch (e) {
    console.warn("Storage quota warning:", e);
  }
}

function applyCustomImageMapToState(stateObj) {
  if (!stateObj || !stateObj.classes) return;
  const map = getCustomImageMap();
  stateObj.classes.forEach(cls => {
    (cls.stages || []).forEach(st => {
      const custom = map[`${cls.id}_${st.stage}`];
      if (custom) {
        if (custom.image) st.image = custom.image;
        if (custom.title) st.title = custom.title;
      }
    });
  });
}

function resolveImgPath(imgUrl) {
  if (!imgUrl) return "./assets/characters/pangolin_stage_1.png";
  if (imgUrl.startsWith("data:image/")) return imgUrl;
  if (imgUrl.startsWith("/assets/")) return "." + imgUrl;
  return imgUrl;
}

// 當圖片載入失敗或使用預設檔時，自動偵測 public/assets/characters/ 下的實體圖檔
const detectedFolderRasterCache = {};

window.autoDetectFolderImage = function(imgEl, classId, className, stageNum, stageTitle) {
  if (!imgEl || imgEl.dataset.probed === "1") return;
  imgEl.dataset.probed = "1";
  const cacheKey = `${classId}_${stageNum}`;

  const map = getCustomImageMap();
  if (map[cacheKey] && map[cacheKey].image) {
    imgEl.src = resolveImgPath(map[cacheKey].image);
    return;
  }

  if (detectedFolderRasterCache[cacheKey]) {
    imgEl.src = detectedFolderRasterCache[cacheKey];
    return;
  }
  if (detectedFolderRasterCache[cacheKey] === false) return;

  const candidates = [
    `./assets/characters/${classId}_stage_${stageNum}_custom.png`,
    `./assets/characters/${classId}_stage_${stageNum}_custom.jpg`,
    `./assets/characters/${classId}_stage_${stageNum}.png`,
    `./assets/characters/${stageTitle}.png`,
    `./assets/characters/${className}_${stageNum}.png`,
    `./assets/characters/${classId}_stage_${stageNum}.svg`
  ];

  let idx = 0;
  function tryNext() {
    if (idx >= candidates.length) {
      detectedFolderRasterCache[cacheKey] = false;
      return;
    }
    const testUrl = candidates[idx++];
    const probe = new Image();
    probe.onload = function() {
      detectedFolderRasterCache[cacheKey] = testUrl;
      saveCustomImageToMap(classId, stageNum, stageTitle, testUrl);
      applyCustomImageMapToState(appState);
      renderAll();
    };
    probe.onerror = tryNext;
    probe.src = testUrl;
  }
  tryNext();
};

// ============================================================================
// 資料載入與雙模同步 (全端 API 優先 + 獨立自訂圖庫永久保留)
// ============================================================================
function ensureValidAppState(raw) {
  const base = JSON.parse(JSON.stringify(FALLBACK_STATE));
  if (!raw || typeof raw !== "object") return base;
  if (!Array.isArray(raw.classes) || raw.classes.length === 0) raw.classes = base.classes;
  if (!Array.isArray(raw.categories) || raw.categories.length === 0) raw.categories = base.categories;
  if (!Array.isArray(raw.students) || raw.students.length === 0) raw.students = base.students;
  if (!Array.isArray(raw.reviews) || raw.reviews.length === 0) raw.reviews = base.reviews;
  return raw;
}

// 頁面啟動時先以預設資料同步初始化，確保所有分頁 100% 立即呈現完整內容
appState = ensureValidAppState(null);

async function loadAppState() {
  const syncPill = document.getElementById("syncStatusPill");
  const gasUrl = getCloudGasUrl();

  // 1. 優先檢查是否有設定「方案 2：Google 試算表雲端資料庫 (Google Apps Script)」
  if (gasUrl) {
    try {
      const res = await fetch(gasUrl, { cache: "no-store" });
      if (!res.ok) throw new Error("Cloud GAS offline");
      let remoteData = await res.json();
      if (!remoteData || !Array.isArray(remoteData.students) || remoteData.students.length === 0) {
        // 首次連線：自動把預設種子資料初始化寫入 Google 試算表
        const initRes = await callCloudGasPost({ action: "init_or_sync", state: appState });
        if (initRes && initRes.state) remoteData = initRes.state;
      }
      appState = ensureValidAppState(remoteData);
      isCloudGasOnline = true;
      isBackendOnline = false;
      if (syncPill) {
        syncPill.className = "sync-pill online";
        syncPill.textContent = "☁️ 雲端試算表連線中";
      }
    } catch (cloudErr) {
      console.warn("Cloud GAS connection failed, falling back:", cloudErr);
      isCloudGasOnline = false;
    }
  }

  // 2. 若未設定雲端試算表，嘗試連線校內本地伺服器 (/api/state)，若無則進入單機 LocalStorage 模式
  if (!isCloudGasOnline) {
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      if (!res.ok) throw new Error("Backend offline");
      const remoteData = await res.json();
      appState = ensureValidAppState(remoteData);
      isBackendOnline = true;
      if (syncPill) {
        syncPill.className = "sync-pill online";
        syncPill.textContent = "● 全端伺服器連線中";
      }
    } catch (e) {
      isBackendOnline = false;
      let parsed = null;
      try {
        const saved = localStorage.getItem(LOCAL_STATE_KEY);
        if (saved) parsed = JSON.parse(saved);
      } catch (ignore) {}
      appState = ensureValidAppState(parsed);
      if (syncPill) {
        syncPill.className = "sync-pill local";
        syncPill.textContent = "● 單機展示模式 (LocalStorage)";
      }
    }
  }

  applyCustomImageMapToState(appState);
  saveLocalBackup();
  updateCloudGasUiStatus();

  const savedStudentId = localStorage.getItem(CURRENT_USER_KEY);
  if (savedStudentId && appState.students.some(s => s.id === savedStudentId)) {
    currentStudentId = savedStudentId;
  } else if (appState.students.length > 0) {
    currentStudentId = appState.students[0].id;
  }

  const curStudent = getCurrentStudent();
  if (curStudent) inspectingClassId = curStudent.classId;
  renderAll();
}

function updateCloudGasUiStatus() {
  const inputEl = document.getElementById("cloudGasUrlInput");
  const badgeEl = document.getElementById("cloudGasStatusBadge");
  const gasUrl = getCloudGasUrl();
  if (inputEl && !inputEl.value && gasUrl) {
    inputEl.value = gasUrl;
  }
  if (badgeEl) {
    if (isCloudGasOnline) {
      badgeEl.textContent = "✅ 已連線 Google 試算表雲端資料庫";
      badgeEl.style.background = "#dcfce7";
      badgeEl.style.color = "#15803d";
      badgeEl.style.borderColor = "#86efac";
    } else if (gasUrl) {
      badgeEl.textContent = "⚠️ 雲端網址已設定（等待連線或授權檢查）";
    } else {
      badgeEl.textContent = "尚未設定雲端網址";
    }
  }
}

window.saveAndConnectCloudGas = async function() {
  const inputEl = document.getElementById("cloudGasUrlInput");
  const urlVal = inputEl ? inputEl.value.trim() : "";
  if (!urlVal) {
    localStorage.removeItem(CLOUD_GAS_URL_KEY);
    isCloudGasOnline = false;
    await loadAppState();
    alert("已清除雲端試算表網址，切換回本地模式。");
    return;
  }
  if (!urlVal.startsWith("https://script.google.com/")) {
    alert("請輸入正確的 Google Apps Script 網頁應用程式網址（以 https://script.google.com/ 開頭，結尾通常為 /exec）");
    return;
  }
  localStorage.setItem(CLOUD_GAS_URL_KEY, urlVal);
  await loadAppState();
  if (isCloudGasOnline) {
    alert("🎉 成功連線至 Google 試算表雲端資料庫！全校親師生跨裝置閱讀紀錄已開始同步！");
  } else {
    alert("⚠️ 無法連線至該網址，請確認在 Google Apps Script 部署時，「誰可以存取」已選取為「所有人 (Anyone)」！");
  }
};

window.pushCurrentStateToCloudGas = async function() {
  const gasUrl = getCloudGasUrl();
  if (!gasUrl) {
    alert("請先在左側輸入框貼上 Google Apps Script 網頁應用程式網址！");
    return;
  }
  try {
    const res = await callCloudGasPost({ action: "init_or_sync", state: appState });
    if (res && res.ok) {
      appState = ensureValidAppState(res.state);
      isCloudGasOnline = true;
      updateCloudGasUiStatus();
      renderAll();
      alert("📤 已成功將目前系統內的學生名冊與書評資料同步寫入 Google 試算表！");
    }
  } catch (e) {
    alert("寫入失敗，請檢查網址與權限設定：" + e.message);
  }
};

function saveLocalBackup() {
  if (appState) {
    try {
      localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.warn("Local backup quota warning:", e);
    }
  }
}

function getCurrentStudent() {
  if (!appState || !Array.isArray(appState.students) || appState.students.length === 0) {
    appState = ensureValidAppState(appState);
  }
  return appState.students.find(s => s.id === currentStudentId) || appState.students[0];
}

// ============================================================================
// 全局畫面渲染 (加入獨立錯誤防護，確保任一區塊皆穩定渲染)
// ============================================================================
function renderRolePermissions() {
  const student = getCurrentStudent();
  const isTeacher = student && student.role === "teacher";

  document.querySelectorAll(".teacher-only-el").forEach(el => {
    el.style.display = isTeacher ? "" : "none";
  });
  document.querySelectorAll('.nav-tab-btn[data-tab="teacher"]').forEach(btn => {
    btn.style.display = isTeacher ? "" : "none";
  });

  // 若目前為學生身分且停留在教師管理分頁，自動導回冒險者大廳
  const teacherTabSec = document.getElementById("tab-teacher");
  if (!isTeacher && teacherTabSec && teacherTabSec.classList.contains("active")) {
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === "dashboard");
    });
    document.querySelectorAll(".tab-section").forEach(sec => {
      sec.classList.toggle("active", sec.id === "tab-dashboard");
    });
  }
}

// 將頁面上所有 <ruby>字<rt>ㄗˋ</rt></ruby> 自動轉換為「每個國字右方直排注音」結構，符合台灣國小低年級課本閱讀習慣且清晰不重疊
function convertAllRubyToRightSideZhuyin() {
  document.querySelectorAll("ruby").forEach(rubyEl => {
    if (rubyEl.dataset.zyConverted === "1") return;
    const children = Array.from(rubyEl.childNodes);
    const frag = document.createDocumentFragment();
    let currentChar = "";

    children.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        currentChar += node.textContent;
      } else if (node.nodeName === "RT") {
        const py = (node.textContent || "").trim();
        const ch = currentChar;
        currentChar = "";
        if (!py) {
          frag.appendChild(document.createTextNode(ch));
        } else {
          const wrap = document.createElement("span");
          wrap.className = "zy-w";

          const cSpan = document.createElement("span");
          cSpan.className = "zy-c";
          cSpan.textContent = ch;
          wrap.appendChild(cSpan);

          let hasLightTone = false;
          let toneMark = "";
          const bopomofoChars = [];
          for (const c of py) {
            if (c === "˙") hasLightTone = true;
            else if (c === "ˊ" || c === "ˇ" || c === "ˋ") toneMark = c;
            else bopomofoChars.push(c);
          }

          const pSpan = document.createElement("span");
          pSpan.className = "zy-p";
          if (hasLightTone) {
            const lSpan = document.createElement("span");
            lSpan.className = "zy-light";
            lSpan.textContent = "˙";
            pSpan.appendChild(lSpan);
          }
          const bSpan = document.createElement("span");
          bSpan.className = "zy-b";
          bopomofoChars.forEach(bc => {
            const iEl = document.createElement("i");
            iEl.textContent = bc;
            bSpan.appendChild(iEl);
          });
          pSpan.appendChild(bSpan);

          if (toneMark) {
            const tSpan = document.createElement("span");
            tSpan.className = "zy-t";
            tSpan.textContent = toneMark;
            pSpan.appendChild(tSpan);
          }
          wrap.appendChild(pSpan);
          frag.appendChild(wrap);
        }
      }
    });

    if (currentChar) {
      frag.appendChild(document.createTextNode(currentChar));
    }

    rubyEl.innerHTML = "";
    rubyEl.appendChild(frag);
    rubyEl.dataset.zyConverted = "1";
  });
}

function renderAll() {
  const tasks = [
    renderRolePermissions,
    renderStudentSwitcher,
    renderHeroBanner,
    renderDashboard,
    renderQuestFormOptions,
    updateLiveQuestPreview,
    renderClassSelectorTab,
    renderReviewsWall,
    renderLeaderboard,
    renderTeacherWorkshop,
    convertAllRubyToRightSideZhuyin
  ];
  tasks.forEach(fn => {
    try {
      fn();
    } catch (err) {
      console.error("Render error in " + fn.name + ":", err);
    }
  });
}

function renderStudentSwitcher() {
  const sel = document.getElementById("studentSwitcher");
  const studentsList = appState.students.filter(s => s.role !== "teacher");
  const teachersList = appState.students.filter(s => s.role === "teacher");

  const stuOptions = studentsList.map(s => {
    const lv = getLevelInfo(s.xp).level;
    const seatLabel = s.seatNo && s.seatNo !== "-" ? `${s.seatNo}號 ` : "";
    return `<option value="${s.id}" ${s.id === currentStudentId ? "selected" : ""}>🎒 學生｜${s.gradeClass} ${seatLabel}${s.name} (Lv.${lv})</option>`;
  }).join("");

  const teaOptions = teachersList.map(t => {
    const titleLabel = t.staffTitle || t.name;
    return `<option value="${t.id}" ${t.id === currentStudentId ? "selected" : ""}>👩‍🏫 師長｜${titleLabel}（${t.name}）</option>`;
  }).join("");

  sel.innerHTML = `
    <optgroup label="🎒 學生端帳號（班級 / 座號 / 姓名）">
      ${stuOptions}
    </optgroup>
    <optgroup label="👩‍🏫 教師與管理者端身分">
      ${teaOptions}
    </optgroup>
  `;
}

function renderHeroBanner() {
  const student = getCurrentStudent();
  if (!student) return;
  const charClass = appState.classes.find(c => c.id === student.classId) || appState.classes[0];
  const lvInfo = getLevelInfo(student.xp);
  const stInfo = getCharacterStageInfo(charClass, lvInfo.level);

  const imgSrc = student.avatarCustom ? student.avatarCustom : resolveImgPath(stInfo.activeStage.image);
  const heroImgEl = document.getElementById("heroAvatarImg");
  heroImgEl.dataset.probed = "0";
  heroImgEl.src = imgSrc;
  heroImgEl.onerror = function() {
    autoDetectFolderImage(heroImgEl, charClass.id, charClass.name, stInfo.activeStage.stage, stInfo.activeStage.title);
  };

  document.getElementById("heroStageRibbon").textContent = `STAGE ${stInfo.activeStage.stage} 階級`;
  const speciesLabel = charClass.species ? `・${charClass.species}` : "";
  document.getElementById("heroClassBadge").textContent = `🐾 ${charClass.name}${speciesLabel}（${charClass.element}）`;

  if (student.role === "teacher") {
    document.getElementById("heroGradeBadge").textContent = `🎖️ 師長身分：${student.staffTitle || "教師"}`;
    document.getElementById("heroCodeBadge").textContent = `管理權限：全校書評講評 & 圖案工坊`;
  } else {
    document.getElementById("heroGradeBadge").textContent = `🏫 班級：${student.gradeClass}`;
    const seatStr = student.seatNo && student.seatNo !== "-" ? `${student.seatNo}號` : student.studentCode;
    document.getElementById("heroCodeBadge").textContent = `🔢 座號：${seatStr}`;
  }

  document.getElementById("heroStudentName").textContent = student.name;
  document.getElementById("heroStageTitle").textContent = `「${stInfo.activeStage.title}」`;
  document.getElementById("heroStageDesc").textContent = stInfo.activeStage.desc;

  document.getElementById("heroLevelText").textContent = `Lv.${lvInfo.level} 閱讀冒險等級`;
  if (stInfo.nextStage) {
    const xpNeededForNextStage = (stInfo.nextStage.minLevel - 1) * 400 - lvInfo.numXp;
    const isTeacher = student.role === "teacher";
    const nextTitleDisplay = isTeacher ? stInfo.nextStage.title : `Stage ${stInfo.nextStage.stage} 神秘隱藏版`;
    document.getElementById("heroXpText").textContent = `${lvInfo.numXp.toLocaleString()} / ${lvInfo.nextLevelXp.toLocaleString()} XP（距離「${nextTitleDisplay}」解鎖還差 ${Math.max(0, xpNeededForNextStage)} XP）`;
  } else {
    document.getElementById("heroXpText").textContent = `${lvInfo.numXp.toLocaleString()} XP（已達 Lv.6 最高傳奇六階型態！）`;
  }
  document.getElementById("heroXpFill").style.width = `${lvInfo.progressPercent}%`;

  // 統計該學生的閱讀量、廣度、深度
  const myReviews = appState.reviews.filter(r => r.studentId === student.id);
  const totalBooks = myReviews.length;
  const totalPages = myReviews.reduce((acc, r) => acc + (Number(r.pages) || 0), 0);
  const uniqueCats = new Set(myReviews.map(r => r.category));
  const avgDepth = totalBooks > 0
    ? Math.round(myReviews.reduce((acc, r) => acc + (Number(r.depthScore) || 0), 0) / totalBooks)
    : 0;

  document.getElementById("statTotalBooks").textContent = `${totalBooks} 本`;
  document.getElementById("statTotalPages").textContent = `${totalPages.toLocaleString()} 頁`;
  document.getElementById("statBreadthCount").textContent = `${uniqueCats.size} / ${appState.categories.length} 域`;
  document.getElementById("statAvgDepth").textContent = `${avgDepth} 分`;
}

function buildStageNodeHtml(charClass, st, isUnlocked, isCurrent, currentXp) {
  const statusClass = isCurrent ? "current" : (isUnlocked ? "unlocked" : "locked mystery-locked");
  const statusLabel = isCurrent ? "✨ 當前型態" : (isUnlocked ? "✅ 已解鎖" : `🔒 隱藏版 (Lv.${st.minLevel})`);
  const minXp = (st.minLevel - 1) * 400;

  if (isUnlocked) {
    return `
      <div class="stage-node ${statusClass}">
        <span class="stage-lv">STAGE ${st.stage}｜${statusLabel}</span>
        <div class="stage-img-box">
          <img src="${resolveImgPath(st.image)}" alt="${st.title}" onerror="autoDetectFolderImage(this, '${charClass.id}', '${charClass.name}', ${st.stage}, '${st.title}')" />
        </div>
        <h4>${st.title}</h4>
        <p>${st.desc}</p>
      </div>
    `;
  } else {
    const diffXp = Math.max(0, minXp - (Number(currentXp) || 0));
    return `
      <div class="stage-node ${statusClass}" onclick="showMysteryStageHint('${charClass.name}', ${st.stage}, ${st.minLevel}, ${minXp}, ${diffXp})" title="點擊查看隱藏版角色解鎖條件">
        <span class="stage-lv">STAGE ${st.stage}｜${statusLabel}</span>
        <div class="stage-img-box mystery-silhouette-box">
          <div class="mystery-badge-overlay">
            <span class="mystery-lock-icon">🔒</span>
            <span class="mystery-secret-tag">？隱藏版？</span>
          </div>
          <img class="mystery-silhouette-img" src="${resolveImgPath(st.image)}" alt="隱藏版角色" onerror="autoDetectFolderImage(this, '${charClass.id}', '${charClass.name}', ${st.stage}, '${st.title}')" />
        </div>
        <h4 class="mystery-title">？？？・神秘隱藏型態</h4>
        <p class="mystery-desc">需達 Lv.${st.minLevel}（${minXp.toLocaleString()} XP）解鎖真面目！目前還差 ${diffXp.toLocaleString()} XP ✨</p>
      </div>
    `;
  }
}

window.showMysteryStageHint = function(charName, stageNum, minLv, minXp, diffXp) {
  alert(`🔒【${charName}・Stage ${stageNum} 隱藏版封印中】\n\n🌟 解鎖門檻：達成 Lv.${minLv}（累積 ${minXp.toLocaleString()} XP）\n⚡ 距離解鎖還差：${diffXp.toLocaleString()} XP\n\n💡 只要持續閱讀好書並撰寫三步引導書評，就能破除封印、揭曉超帥氣的隱藏版進化外觀喔！`);
};

// ============================================================================
// TAB 1: 冒險者大廳 (角色六階段路線圖 + 八大領域廣度雷達圖 + 深度指標)
// ============================================================================
function renderDashboard() {
  const student = getCurrentStudent();
  const charClass = appState.classes.find(c => c.id === student.classId) || appState.classes[0];
  const lvInfo = getLevelInfo(student.xp);
  const stInfo = getCharacterStageInfo(charClass, lvInfo.level);

  // 1. 渲染六階段晉級路線圖（未解鎖階段以神秘隱藏版剪影呈現）
  const roadmapEl = document.getElementById("dashboardStageRoadmap");
  roadmapEl.innerHTML = charClass.stages.map(st => {
    const isCurrent = st.stage === stInfo.activeStage.stage;
    const isUnlocked = student.role === "teacher" || lvInfo.level >= st.minLevel;
    return buildStageNodeHtml(charClass, st, isUnlocked, isCurrent, lvInfo.numXp);
  }).join("");

  // 2. 渲染閱讀廣度八大領域統計與 SVG 雷達圖
  const myReviews = appState.reviews.filter(r => r.studentId === student.id);
  const catCounts = {};
  appState.categories.forEach(c => { catCounts[c.id] = 0; });
  myReviews.forEach(r => {
    if (catCounts[r.category] !== undefined) catCounts[r.category]++;
  });

  const litCount = Object.values(catCounts).filter(v => v > 0).length;
  const breadthRate = Math.round((litCount / appState.categories.length) * 100);
  document.getElementById("breadthRateBadge").textContent = `廣度點亮 ${litCount}/8 域 (${breadthRate}%)`;

  renderBreadthRadarSvg(catCounts);

  const catGridEl = document.getElementById("categoryGridBox");
  catGridEl.innerHTML = appState.categories.map(cat => {
    const count = catCounts[cat.id] || 0;
    const isLit = count > 0;
    return `
      <div class="cat-badge-card ${isLit ? "lit" : ""}" style="--cat-color: ${cat.color}">
        <div class="cat-icon">${cat.icon}</div>
        <div class="cat-meta">
          <h5>${cat.name} <small style="color:#64748b;">(${cat.code})</small></h5>
          <span>${isLit ? `✅ 已讀 ${count} 本` : "尚未探索 (+60 XP)"}</span>
        </div>
      </div>
    `;
  }).join("");

  // 3. 渲染閱讀深度指標
  const totalBooks = myReviews.length;
  const avgPages = totalBooks > 0 ? Math.round(myReviews.reduce((a, r) => a + Number(r.pages), 0) / totalBooks) : 0;
  const avgDiff = totalBooks > 0 ? (myReviews.reduce((a, r) => a + Number(r.difficulty), 0) / totalBooks).toFixed(1) : "0.0";
  const avgWords = totalBooks > 0 ? Math.round(myReviews.reduce((a, r) => a + (r.reviewText ? r.reviewText.length : 0), 0) / totalBooks) : 0;
  const avgDepth = totalBooks > 0 ? Math.round(myReviews.reduce((a, r) => a + Number(r.depthScore), 0) / totalBooks) : 0;

  document.getElementById("depthAvgPages").textContent = `${avgPages} 頁`;
  document.getElementById("depthAvgDiff").textContent = `${avgDiff} ★`;
  document.getElementById("depthAvgWords").textContent = `${avgWords} 字`;

  const depthTagEl = document.getElementById("depthLevelTag");
  if (avgDepth >= 88) depthTagEl.textContent = "💎 宗師級深度思辨者";
  else if (avgDepth >= 75) depthTagEl.textContent = "🌟 進階洞察分析者";
  else if (avgDepth > 0) depthTagEl.textContent = "🌱 穩健成長閱讀者";
  else depthTagEl.textContent = "等待第一篇書評任務";

  const depthBarsEl = document.getElementById("personalDepthBars");
  if (myReviews.length === 0) {
    depthBarsEl.innerHTML = `<p style="font-size:0.85rem; color:#64748b;">尚無閱讀紀錄，點擊右上角「立即撰寫新書評」展開冒險吧！</p>`;
  } else {
    depthBarsEl.innerHTML = myReviews.slice(0, 4).map(r => {
      const cat = appState.categories.find(c => c.id === r.category);
      return `
        <div>
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:2px;">
            <span><strong>《${escapeHtml(r.bookTitle)}》</strong> <small style="color:#64748b;">(${r.pages}頁 / 難度${r.difficulty}★)</small></span>
            <strong style="color:#4d7c0f;">深度 ${r.depthScore} 分</strong>
          </div>
          <div style="height:9px; background:#ecfccb; border-radius:999px; overflow:hidden;">
            <div style="width:${r.depthScore}%; height:100%; background:${cat ? cat.color : '#65a30d'}; border-radius:999px;"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  // 4. 渲染成就徽章
  const earnedSet = new Set(student.badges || []);
  document.getElementById("studentBadgesBox").innerHTML = BADGE_CATALOG.map(b => {
    const isEarned = earnedSet.has(b.id);
    return `
      <div class="badge-item ${isEarned ? "earned" : "locked"}">
        <div class="badge-emoji">${b.icon}</div>
        <div>
          <div style="font-size:0.88rem; font-weight:800;">${b.name}</div>
          <div style="font-size:0.74rem; color:#64748b;">${b.desc}</div>
        </div>
      </div>
    `;
  }).join("");
}

function renderBreadthRadarSvg(catCounts) {
  const svg = document.getElementById("breadthRadarSvg");
  const cats = appState.categories;
  const cx = 130, cy = 130, maxR = 88;
  const maxVal = Math.max(3, ...Object.values(catCounts));

  let gridPolygons = "";
  [0.33, 0.66, 1].forEach(ratio => {
    const pts = cats.map((_, idx) => {
      const angle = (Math.PI * 2 * idx) / cats.length - Math.PI / 2;
      const x = cx + Math.cos(angle) * (maxR * ratio);
      const y = cy + Math.sin(angle) * (maxR * ratio);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    gridPolygons += `<polygon points="${pts}" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3" />`;
  });

  let axesLines = "";
  let labelsHtml = "";
  const dataPts = [];

  cats.forEach((cat, idx) => {
    const angle = (Math.PI * 2 * idx) / cats.length - Math.PI / 2;
    const xEnd = cx + Math.cos(angle) * maxR;
    const yEnd = cy + Math.sin(angle) * maxR;
    axesLines += `<line x1="${cx}" y1="${cy}" x2="${xEnd.toFixed(1)}" y2="${yEnd.toFixed(1)}" stroke="#e2e8f0" stroke-width="1.5" />`;

    const count = catCounts[cat.id] || 0;
    const valRatio = count === 0 ? 0.08 : Math.min(1, 0.25 + (count / maxVal) * 0.75);
    const vx = cx + Math.cos(angle) * (maxR * valRatio);
    const vy = cy + Math.sin(angle) * (maxR * valRatio);
    dataPts.push(`${vx.toFixed(1)},${vy.toFixed(1)}`);

    const lx = cx + Math.cos(angle) * (maxR + 26);
    const ly = cy + Math.sin(angle) * (maxR + 22);
    labelsHtml += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="11" font-weight="bold" fill="${count > 0 ? '#365314' : '#94a3b8'}" text-anchor="middle" dominant-baseline="middle">${cat.icon}${cat.name.slice(0, 2)}</text>`;
  });

  const dotsHtml = dataPts.map(pt => {
    const [px, py] = pt.split(",");
    return `<circle cx="${px}" cy="${py}" r="4.5" fill="#65a30d" stroke="#fff" stroke-width="1.5" />`;
  }).join("");

  svg.innerHTML = `
    ${gridPolygons}
    ${axesLines}
    <polygon points="${dataPts.join(" ")}" fill="rgba(132, 204, 22, 0.35)" stroke="#65a30d" stroke-width="2.5" />
    ${dotsHtml}
    ${labelsHtml}
  `;
}

// ============================================================================
// TAB 2: 撰寫簡單書評任務與即時預覽
// ============================================================================
function renderQuestFormOptions() {
  const catSel = document.getElementById("bookCategorySelect");
  const currentVal = catSel.value;
  catSel.innerHTML = appState.categories.map(c =>
    `<option value="${c.id}">${c.icon} ${c.name}（${c.desc}）</option>`
  ).join("");
  if (currentVal) catSel.value = currentVal;

  const moodContainer = document.getElementById("moodTagsContainer");
  moodContainer.innerHTML = MOOD_TAG_OPTIONS.map(tag => {
    const isSel = selectedMoodTags.has(tag);
    return `<span class="mood-chip ${isSel ? "selected" : ""}" onclick="toggleMoodTag('${tag}')">#${tag}</span>`;
  }).join("");
}

window.toggleMoodTag = function(tag) {
  if (selectedMoodTags.has(tag)) {
    if (selectedMoodTags.size > 1) selectedMoodTags.delete(tag);
  } else {
    selectedMoodTags.add(tag);
  }
  renderQuestFormOptions();
};

function updateLiveQuestPreview() {
  const student = getCurrentStudent();
  if (!student) return;
  const isJunior = document.body.classList.contains("junior-mode");
  const pages = Math.max(10, Number(document.getElementById("bookPagesInput").value) || 32);
  const difficulty = Number(document.getElementById("bookDifficultySelect").value) || 3;
  const category = document.getElementById("bookCategorySelect").value || "literature";
  const s1 = document.getElementById("promptSummaryInput").value.trim();
  const s2 = document.getElementById("promptTakeawayInput").value.trim();
  const s3 = document.getElementById("promptQuoteInput").value.trim();

  const hasAudio = Boolean(window.juniorRecordedAudioDataUrl);
  const combinedLen = s1.length + s2.length + s3.length + (hasAudio ? 80 : 0);
  const pageFactor = isJunior ? Math.min(35, Math.floor(pages / 3) + 15) : Math.min(35, Math.floor(pages / 12));
  const diffFactor = difficulty * 7;
  const textFactor = Math.min(35, Math.floor(combinedLen / 3));
  const depthScore = Math.min(100, Math.max(isJunior ? 78 : 35, pageFactor + diffFactor + textFactor));

  const myReviews = appState.reviews.filter(r => r.studentId === student.id);
  const isNewCategory = !myReviews.some(r => r.category === category);
  const breadthBonus = isNewCategory ? 60 : 0;

  const charClass = appState.classes.find(c => c.id === student.classId);
  const classBonus = (charClass && charClass.bonusCategory === category) ? 30 : 0;
  const voiceBonus = hasAudio ? 50 : 0;

  const xpEarned = 80 + Math.min(150, Math.floor(pages / 3)) + (difficulty * 15) + Math.floor(depthScore * 0.6) + breadthBonus + classBonus + voiceBonus;

  document.getElementById("liveDepthScore").textContent = depthScore;
  document.getElementById("liveXpEstimate").textContent = `+${xpEarned} XP`;
  document.getElementById("liveBreadthBonusRow").style.opacity = isNewCategory ? "1" : "0.35";
  document.getElementById("liveBreadthBonusRow").innerHTML = `🌟 跨領域廣度首讀獎勵：<span>${isNewCategory ? "+60 XP (新領域!)" : "+0 XP (已讀過)"}</span>`;
  document.getElementById("liveClassBonusRow").style.opacity = (classBonus > 0 || voiceBonus > 0) ? "1" : "0.35";
  document.getElementById("liveClassBonusRow").innerHTML = `🐾 專精與錄音獎勵加成：<span>+${classBonus + voiceBonus} XP${voiceBonus > 0 ? " (含錄音+50!)" : ""}</span>`;
}

// ============================================================================
// TAB 3: 雙溪在地生物角色選擇與六階段進化圖鑑
// ============================================================================
function renderClassSelectorTab() {
  const student = getCurrentStudent();
  const grid = document.getElementById("classSelectorGrid");
  grid.innerHTML = appState.classes.map(cls => {
    const isMyClass = student.classId === cls.id;
    const isInspecting = inspectingClassId === cls.id;
    const bonusCat = appState.categories.find(c => c.id === cls.bonusCategory);
    const previewStage = cls.stages[0];
    return `
      <div class="class-option-card ${isMyClass ? "active-class" : ""}" onclick="selectOrInspectClass('${cls.id}')" style="${isInspecting ? 'border-color:#65a30d;' : ''}">
        <span class="pill-tag" style="background:${cls.color}; color:#fff; border:none;">${cls.species || cls.element}</span>
        <img src="${resolveImgPath(previewStage.image)}" alt="${cls.name}" onerror="autoDetectFolderImage(this, '${cls.id}', '${cls.name}', 1, '${previewStage.title}')" />
        <h4 style="font-size:1.12rem; font-weight:900; color:#365314;">${cls.name} <small style="font-size:0.78rem; color:#4d7c0f;">(${cls.species || ""})</small></h4>
        <p style="font-size:0.78rem; color:#64748b;">${cls.description}</p>
        <div style="font-size:0.74rem; font-weight:800; color:#3f6212; background:#ecfccb; border:1px solid #bef264; padding:0.22rem 0.65rem; border-radius:999px;">
          專精加成：${bonusCat ? bonusCat.icon + bonusCat.name : ""} (+30 XP)
        </div>
        <button class="${isMyClass ? 'btn-gold' : 'btn-primary'}" style="width:100%; margin-top:0.35rem; padding:0.55rem; font-size:0.84rem;" onclick="event.stopPropagation(); changeStudentClass('${cls.id}')">
          ${isMyClass ? "👑 目前使用中角色" : "⚡ 選擇此角色夥伴"}
        </button>
      </div>
    `;
  }).join("");

  const detailClass = appState.classes.find(c => c.id === inspectingClassId) || appState.classes[0];
  const lvInfo = getLevelInfo(student.xp);
  const isMySelectedClass = student.classId === detailClass.id;
  const stInfo = getCharacterStageInfo(detailClass, lvInfo.level);
  const detailBox = document.getElementById("selectedClassDetailBox");
  detailBox.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
      <div>
        <h4 style="font-size:1.15rem; font-weight:900; color:#365314;">🌟 【${detailClass.name}（${detailClass.species || ""}）】Lv.1 ~ Lv.6 六階段晉級圖鑑（未解鎖階級為神秘隱藏版）</h4>
        <p style="font-size:0.84rem; color:#4d7c0f; font-weight:600;">每升 1 級（400 XP）即可破除下一階段封印、解鎖隱藏版角色外觀！（師長可於「🎨 角色圖案工坊」管理全階段圖檔）</p>
      </div>
    </div>
    <div class="stages-roadmap">
      ${detailClass.stages.map(st => {
        // 第 1 階初始角色公開；第 2~6 階需達到對應等級才解鎖，否則顯示為神秘隱藏版
        const isUnlocked = student.role === "teacher" || st.stage === 1 || (isMySelectedClass && lvInfo.level >= st.minLevel);
        const isCurrent = isMySelectedClass && st.stage === stInfo.activeStage.stage;
        return buildStageNodeHtml(detailClass, st, isUnlocked, isCurrent, isMySelectedClass ? lvInfo.numXp : 0);
      }).join("")}
    </div>
  `;
}

window.selectOrInspectClass = function(classId) {
  inspectingClassId = classId;
  renderClassSelectorTab();
};

window.changeStudentClass = async function(classId) {
  const student = getCurrentStudent();
  inspectingClassId = classId;
  student.classId = classId;

  if (isCloudGasOnline) {
    try {
      const data = await callCloudGasPost({ action: "student_update", studentId: student.id, classId });
      if (data.ok && data.state) {
        appState = ensureValidAppState(data.state);
        applyCustomImageMapToState(appState);
      }
    } catch (e) { console.warn(e); }
  } else if (isBackendOnline) {
    const res = await fetch("/api/student/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: student.id, classId })
    });
    const data = await res.json();
    if (data.ok) {
      appState = data.state;
      applyCustomImageMapToState(appState);
    }
  } else {
    appState.reviews.forEach(r => {
      if (r.studentId === student.id) r.classId = classId;
    });
  }
  saveLocalBackup();
  renderAll();
};

// ============================================================================
// TAB 4: 全校書評星牆 (支援按讚與師長暖心講評)
// ============================================================================
function renderReviewsWall() {
  const filterSelect = document.getElementById("wallCategoryFilter");
  if (filterSelect.options.length <= 1) {
    appState.categories.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = `${c.icon} ${c.name}`;
      filterSelect.appendChild(opt);
    });
  }

  const catFilter = filterSelect.value || "all";
  const keyword = (document.getElementById("wallSearchInput").value || "").trim().toLowerCase();
  const curUser = getCurrentStudent();

  const filtered = appState.reviews.filter(r => {
    if (catFilter !== "all" && r.category !== catFilter) return false;
    if (keyword) {
      const hay = `${r.bookTitle} ${r.author} ${r.studentName} ${r.reviewText}`.toLowerCase();
      if (!hay.includes(keyword)) return false;
    }
    return true;
  });

  const grid = document.getElementById("reviewsWallGrid");
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="panel-card" style="grid-column:1/-1; text-align:center; color:#64748b;">找不到符合條件的書評紀錄。</div>`;
    return;
  }

  grid.innerHTML = filtered.map(r => {
    const cat = appState.categories.find(c => c.id === r.category) || appState.categories[0];
    const cls = appState.classes.find(c => c.id === r.classId) || appState.classes[0];
    const stars = "⭐".repeat(Number(r.rating) || 5);
    const moodHtml = (r.moodTags || []).map(t => `<span style="font-size:0.74rem; background:#f7fee7; border:1px solid #d9f99d; padding:0.15rem 0.55rem; border-radius:999px; font-weight:700; color:#3f6212;">#${escapeHtml(t)}</span>`).join(" ");
    const seatTag = r.seatNo && r.seatNo !== "-" ? ` ${r.seatNo}號` : "";

    return `
      <article class="review-card">
        <div>
          <div class="review-book-header">
            <div class="book-title-group">
              <span style="font-size:0.75rem; font-weight:800; color:${cat.color};">${cat.icon} ${cat.name}｜📄 ${r.pages} 頁｜難度 ${r.difficulty}★</span>
              <h4>《${escapeHtml(r.bookTitle)}》</h4>
              <p>作者：${escapeHtml(r.author || "未註明")} ｜ 推薦：${stars}</p>
            </div>
            <span class="depth-pill">深度 ${r.depthScore} 分</span>
          </div>

          <div style="display:flex; gap:0.35rem; flex-wrap:wrap; margin:0.65rem 0;">${moodHtml}</div>

          <div class="review-body-text">${escapeHtml(r.reviewText)}</div>

          ${r.audioData ? `
            <div class="review-audio-box">
              <span style="font-size:0.8rem; font-weight:900; color:#365314;">🎙️ 小小說書人語音分享：</span>
              <audio controls src="${r.audioData}" style="height:34px; flex:1; min-width:180px;"></audio>
            </div>
          ` : ""}

          ${r.teacherComment ? `
            <div class="teacher-reply-box" style="margin-top:0.65rem;">
              <strong>👩‍🏫 師長暖心講評：</strong>${escapeHtml(r.teacherComment)}
            </div>
          ` : ""}
        </div>

        <div class="review-footer">
          <div>
            <strong>${escapeHtml(r.studentName)}</strong>
            <span style="color:#64748b;">（${escapeHtml(r.gradeClass)}${escapeHtml(seatTag)}・${cls.name}）</span>
          </div>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn-outline" style="padding:0.32rem 0.7rem; font-size:0.78rem;" onclick="likeReview('${r.id}')">
              👏 按讚 (${r.likes || 0})
            </button>
            ${curUser && curUser.role === "teacher" ? `
              <button class="btn-gold" style="padding:0.32rem 0.75rem; font-size:0.78rem;" onclick="promptTeacherComment('${r.id}')">
                💬 撰寫講評
              </button>
            ` : ""}
          </div>
        </div>
      </article>
    `;
  }).join("");
}

window.likeReview = async function(reviewId) {
  if (isCloudGasOnline) {
    try {
      const data = await callCloudGasPost({ action: "like_review", reviewId });
      if (data.ok && data.state) {
        appState = ensureValidAppState(data.state);
        applyCustomImageMapToState(appState);
      }
    } catch (e) { console.warn(e); }
  } else if (isBackendOnline) {
    const res = await fetch("/api/reviews/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId })
    });
    const data = await res.json();
    if (data.ok) {
      appState = data.state;
      applyCustomImageMapToState(appState);
    }
  } else {
    const target = appState.reviews.find(r => r.id === reviewId);
    if (target) target.likes = (Number(target.likes) || 0) + 1;
  }
  saveLocalBackup();
  renderReviewsWall();
};

window.promptTeacherComment = async function(reviewId) {
  const target = appState.reviews.find(r => r.id === reviewId);
  if (!target) return;
  const curUser = getCurrentStudent();
  const rolePrefix = curUser && curUser.staffTitle ? `【${curUser.staffTitle}】` : "【師長講評】";
  const defaultComment = target.teacherComment || `${rolePrefix}觀察深入，見解獨到，繼續保持閱讀熱情！`;
  const comment = window.prompt(`請輸入對《${target.bookTitle}》（${target.gradeClass} ${target.studentName}）的師長暖心講評：`, defaultComment);
  if (comment === null) return;

  if (isCloudGasOnline) {
    try {
      const data = await callCloudGasPost({ action: "comment_review", reviewId, teacherComment: comment });
      if (data.ok && data.state) {
        appState = ensureValidAppState(data.state);
        applyCustomImageMapToState(appState);
      }
    } catch (e) { console.warn(e); }
  } else if (isBackendOnline) {
    const res = await fetch("/api/reviews/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId, teacherComment: comment })
    });
    const data = await res.json();
    if (data.ok) {
      appState = data.state;
      applyCustomImageMapToState(appState);
    }
  } else {
    target.teacherComment = comment;
  }
  saveLocalBackup();
  renderReviewsWall();
};

// ============================================================================
// TAB 5: 英雄風雲榜 (班級風雲榜 + 全校個人風雲榜)
// ============================================================================
function renderLeaderboard() {
  const studentsOnly = appState.students.filter(s => s.role !== "teacher");
  const rowsData = studentsOnly.map(s => {
    const revs = appState.reviews.filter(r => r.studentId === s.id);
    const books = revs.length;
    const pages = revs.reduce((a, r) => a + Number(r.pages), 0);
    const cats = new Set(revs.map(r => r.category)).size;
    const avgDepth = books > 0 ? Math.round(revs.reduce((a, r) => a + Number(r.depthScore), 0) / books) : 0;
    const lvInfo = getLevelInfo(s.xp);
    const cls = appState.classes.find(c => c.id === s.classId) || appState.classes[0];
    const stInfo = getCharacterStageInfo(cls, lvInfo.level);
    return { s, books, pages, cats, avgDepth, lvInfo, cls, stInfo };
  }).sort((a, b) => b.s.xp - a.s.xp);

  // 1. 渲染班級風雲榜
  const classGroups = {};
  rowsData.forEach(item => {
    const gName = item.s.gradeClass || "未分班";
    if (!classGroups[gName]) {
      classGroups[gName] = { gradeClass: gName, studentCount: 0, totalBooks: 0, totalPages: 0, totalXp: 0, depthSum: 0, depthCount: 0 };
    }
    classGroups[gName].studentCount++;
    classGroups[gName].totalBooks += item.books;
    classGroups[gName].totalPages += item.pages;
    classGroups[gName].totalXp += Number(item.s.xp) || 0;
    if (item.avgDepth > 0) {
      classGroups[gName].depthSum += item.avgDepth;
      classGroups[gName].depthCount++;
    }
  });

  const sortedClassGroups = Object.values(classGroups).sort((a, b) => b.totalXp - a.totalXp);
  const classRankGrid = document.getElementById("classRankGrid");
  if (classRankGrid) {
    classRankGrid.innerHTML = sortedClassGroups.map((cg, idx) => {
      const rank = idx + 1;
      const avgD = cg.depthCount > 0 ? Math.round(cg.depthSum / cg.depthCount) : 0;
      const medal = rank === 1 ? "🥇 冠軍班級" : (rank === 2 ? "🥈 亞軍班級" : (rank === 3 ? "🥉 季軍班級" : `🏅 第 ${rank} 名`));
      return `
        <div class="class-rank-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="pill-tag gold">${medal}</span>
            <span style="font-size:0.8rem; font-weight:800; color:#4d7c0f;">總經驗 ${cg.totalXp.toLocaleString()} XP</span>
          </div>
          <h4 style="font-size:1.2rem; font-weight:900; color:#365314;">🏫 ${escapeHtml(cg.gradeClass)}</h4>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.4rem; font-size:0.82rem; color:#3f6212; background:#fff; padding:0.65rem; border-radius:12px; border:1.5px solid #d9f99d;">
            <div>📚 累積冊數：<strong>${cg.totalBooks} 本</strong></div>
            <div>📖 累積頁數：<strong>${cg.totalPages.toLocaleString()} 頁</strong></div>
            <div>🧒 冒險人數：<strong>${cg.studentCount} 人</strong></div>
            <div>💎 平均深度：<strong>${avgD} 分</strong></div>
          </div>
        </div>
      `;
    }).join("");
  }

  // 2. 渲染全校個人風雲榜
  const tbody = document.getElementById("leaderboardTbody");
  tbody.innerHTML = rowsData.map((item, idx) => {
    const rank = idx + 1;
    const rankClass = rank <= 3 ? `rank-${rank}` : "";
    const seatStr = item.s.seatNo && item.s.seatNo !== "-" ? ` ${item.s.seatNo}號` : "";
    return `
      <tr>
        <td><span class="rank-medal ${rankClass}">${rank}</span></td>
        <td>
          <strong>${escapeHtml(item.s.name)}</strong>
          <div style="font-size:0.78rem; color:#64748b;">${escapeHtml(item.s.gradeClass)}${escapeHtml(seatStr)}</div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <img src="${resolveImgPath(item.stInfo.activeStage.image)}" alt="" style="width:104px; height:104px; object-fit:cover; display:block; border-radius:18px; padding:0; overflow:hidden; border:3px solid #84cc16; background:#fff; box-shadow:0 4px 12px rgba(101,163,13,0.16);" />
            <div>
              <div style="font-weight:900; font-size:0.96rem; color:#365314;">${item.stInfo.activeStage.title}</div>
              <div style="font-size:0.8rem; color:#4d7c0f;">${item.cls.name}（${item.cls.species || ""}・STAGE ${item.stInfo.activeStage.stage}）</div>
            </div>
          </div>
        </td>
        <td><strong style="color:#4d7c0f;">Lv.${item.lvInfo.level}</strong> <small style="color:#64748b;">(${item.s.xp} XP)</small></td>
        <td><strong>${item.books} 本</strong> <small style="color:#64748b;">(${item.pages.toLocaleString()} 頁)</small></td>
        <td><span class="depth-pill">${item.cats} / 8 領域</span></td>
        <td><strong style="color:#b45309;">${item.avgDepth} 分</strong></td>
      </tr>
    `;
  }).join("");
}

// ============================================================================
// TAB 6: 角色圖案自訂工坊 & 教師管理面板 (隨時上傳替換角色圖案 + CSV 匯出)
// ============================================================================
let workshopSelectedClassId = "pangolin";

window.selectWorkshopCharacter = function(classId) {
  if (!classId) return;
  workshopSelectedClassId = classId;
  const sel = document.getElementById("workshopClassSelect");
  if (sel) sel.value = classId;
  renderTeacherWorkshop();
};

function renderTeacherWorkshop() {
  const classesList = (appState && Array.isArray(appState.classes) && appState.classes.length > 0)
    ? appState.classes
    : FALLBACK_STATE.classes;

  const sel = document.getElementById("workshopClassSelect");
  if (sel) {
    if (sel.value && classesList.some(c => c.id === sel.value)) {
      workshopSelectedClassId = sel.value;
    }
    const iconsMap = { pangolin: "🐾", fish: "🐟", muntjac: "🦌", magpie: "🐦", eagle: "🦅" };
    sel.innerHTML = classesList.map(c => {
      const ico = iconsMap[c.id] || "🐾";
      return `<option value="${c.id}" ${c.id === workshopSelectedClassId ? "selected" : ""}>${ico} ${c.name}（${c.species || ""}・${c.element}）</option>`;
    }).join("");
    sel.value = workshopSelectedClassId;
  }

  document.querySelectorAll(".workshop-char-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.cid === workshopSelectedClassId);
  });

  const targetClass = classesList.find(c => c.id === workshopSelectedClassId) || classesList[0];
  const slotsBox = document.getElementById("workshopStageSlots");

  slotsBox.innerHTML = targetClass.stages.map(st => {
    const isCustomUploaded = st.image && (st.image.startsWith("data:") || st.image.includes("_custom"));
    return `
    <div class="stage-slot-card" style="border-color:#84cc16; background:#fcfdf5;">
      <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
        <span class="pill-tag" style="background:#365314; color:#fef08a;">STAGE ${st.stage}（Lv.${st.minLevel} 解鎖）</span>
        <span style="font-size:0.74rem; font-weight:800; color:#15803d;">
          ${isCustomUploaded ? '✅ 已套用自訂上傳圖' : '✅ 已套用雙溪角色圖'}
        </span>
      </div>
      <img id="preview_${targetClass.id}_${st.stage}" src="${resolveImgPath(st.image)}" alt="${st.title}" />
      <div style="width:100%; text-align:left;">
        <label style="font-size:0.78rem; font-weight:800;">階級稱號：</label>
        <input type="text" id="title_${targetClass.id}_${st.stage}" value="${escapeHtml(st.title)}" style="padding:0.4rem 0.6rem; font-size:0.84rem; margin-bottom:0.5rem;" />
        <label style="font-size:0.78rem; font-weight:800; color:#4d7c0f;">📂 選擇電腦中的圖片上傳 (PNG/JPG/SVG/GIF/WebP)：</label>
        <input type="file" accept="image/*" onchange="handleStageFileUpload('${targetClass.id}', ${st.stage}, this)" style="font-size:0.76rem; width:100%; margin-bottom:0.5rem;" />
        <label style="font-size:0.78rem; font-weight:800;">或貼上圖片網址 / 資料夾路徑：</label>
        <input type="text" id="url_${targetClass.id}_${st.stage}" value="${escapeHtml(st.image && st.image.startsWith('data:') ? '（已儲存上傳之自訂圖檔）' : st.image)}" style="padding:0.4rem 0.6rem; font-size:0.78rem;" />
      </div>
      <button class="btn-primary" style="width:100%; padding:0.5rem; font-size:0.84rem;" onclick="saveStageCustomization('${targetClass.id}', ${st.stage})">
        💾 儲存並同步 Stage ${st.stage}
      </button>
    </div>
  `}).join("");
}

function compressUploadedImage(file, maxDim = 420) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(evt) {
      const rawDataUrl = evt.target.result;
      if (file.type === "image/svg+xml" || file.type === "image/gif") {
        resolve(rawDataUrl);
        return;
      }
      const img = new Image();
      img.onload = function() {
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

window.handleStageFileUpload = async function(classId, stageNum, fileInput) {
  const file = fileInput.files && fileInput.files[0];
  if (!file) return;
  const optimizedDataUrl = await compressUploadedImage(file, 420);
  const previewEl = document.getElementById(`preview_${classId}_${stageNum}`);
  if (previewEl) previewEl.src = optimizedDataUrl;
  await saveStageCustomization(classId, stageNum, optimizedDataUrl);
};

window.handleBatchFilesUpload = async function(fileInput) {
  const files = Array.from(fileInput.files || []);
  if (files.length === 0) return;

  const currentClassId = document.getElementById("workshopClassSelect").value || appState.classes[0].id;
  files.sort((a, b) => a.name.localeCompare(b.name, "zh-Hant", { numeric: true }));

  const nameToClassMap = [
    { keys: ["甲寶寶", "岩盾甲", "晶甲勇者", "烈地戰甲", "玄武甲王", "聖地龍甲", "穿山甲", "pangolin"], id: "pangolin" },
    { keys: ["泡泡魚", "疾流魚", "碧鱗戰魚", "潮汐破浪", "深淵碧龍", "滄海龍盾", "豆仔魚", "fish"], id: "fish" },
    { keys: ["芽芽羌", "翠影羌", "疾風羌", "雷角戰羌", "蒼芎羌", "森羅聖羌", "山羌", "muntjac"], id: "muntjac" },
    { keys: ["藍羽仔", "疾風藍鵲", "幻影羽刃", "雷翼巡空", "蒼芎幻羽", "九霄羽皇", "藍鵲", "magpie"], id: "magpie" },
    { keys: ["鷲鷲寶", "烈羽鷲", "蒼藍戰鷲", "破空神鷲", "天芎霸羽", "雷霆皇鷲", "大冠鷲", "eagle"], id: "eagle" }
  ];

  let updatedCount = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fname = file.name.toLowerCase();
    let targetClassId = currentClassId;
    for (const item of nameToClassMap) {
      if (item.keys.some(k => fname.includes(k.toLowerCase()))) {
        targetClassId = item.id;
        break;
      }
    }

    const numMatch = fname.match(/([1-6])/);
    const stageNum = numMatch ? Number(numMatch[1]) : ((i % 6) + 1);

    const optimizedDataUrl = await compressUploadedImage(file, 420);
    await saveStageCustomization(targetClassId, stageNum, optimizedDataUrl, true);
    updatedCount++;
  }

  renderAll();
  alert(`🎉 成功批次上傳並連動 ${updatedCount} 張角色圖片！全校畫面已立即更新！`);
};

window.saveStageCustomization = async function(classId, stageNum, overrideDataUrl, skipRender = false) {
  const titleEl = document.getElementById(`title_${classId}_${stageNum}`);
  const urlEl = document.getElementById(`url_${classId}_${stageNum}`);
  const cls = appState.classes.find(c => c.id === classId);
  const st = cls ? cls.stages.find(s => s.stage === stageNum) : null;

  const titleVal = titleEl ? titleEl.value.trim() : (st ? st.title : "");
  let imageData = overrideDataUrl;
  if (!imageData && urlEl) {
    const rawUrlVal = urlEl.value.trim();
    if (rawUrlVal && !rawUrlVal.startsWith("（已儲存")) {
      imageData = rawUrlVal;
    } else if (st) {
      imageData = st.image;
    }
  }

  if (st) {
    if (titleVal) st.title = titleVal;
    if (imageData) st.image = imageData;
  }
  saveCustomImageToMap(classId, stageNum, titleVal, imageData);
  saveLocalBackup();

  if (isCloudGasOnline) {
    try {
      const data = await callCloudGasPost({ action: "update_class_image", classId, stage: stageNum, title: titleVal, imageData });
      if (data.ok && data.state) {
        appState = ensureValidAppState(data.state);
        applyCustomImageMapToState(appState);
      }
    } catch (e) {
      console.warn("Cloud GAS sync skipped:", e);
    }
  } else if (isBackendOnline) {
    try {
      const res = await fetch("/api/classes/update-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, stage: stageNum, title: titleVal, imageData })
      });
      const data = await res.json();
      if (data.ok) {
        appState = data.state;
        applyCustomImageMapToState(appState);
      }
    } catch (e) {
      console.warn("Backend sync skipped:", e);
    }
  }

  if (!skipRender) {
    renderAll();
  }
};

// 全端與單機雙相容匯出 Excel CSV 報表
function exportAllReviewsCsv() {
  if (isBackendOnline) {
    window.open("/api/export/csv", "_blank");
    return;
  }
  const headers = ["書評編號", "日期", "班級", "座號", "學生姓名", "角色夥伴", "書名", "作者", "分類領域", "頁數", "難度星級", "推薦評分", "閱讀深度指數", "獲得經驗值", "心情標籤", "書評內容", "師長評語"];
  const lines = [headers.join(",")];
  (appState.reviews || []).forEach(r => {
    const tags = (r.moodTags || []).join(" / ");
    const seatVal = r.seatNo || "-";
    const cleanReview = String(r.reviewText || "").replace(/\r?\n/g, " ").replace(/"/g, '""');
    const cleanComment = String(r.teacherComment || "").replace(/\r?\n/g, " ").replace(/"/g, '""');
    const cleanTitle = String(r.bookTitle || "").replace(/"/g, '""');
    const cleanAuthor = String(r.author || "").replace(/"/g, '""');
    lines.push([
      r.id, r.createdAt, r.gradeClass, seatVal, r.studentName, r.classId,
      `"${cleanTitle}"`, `"${cleanAuthor}"`, r.category, r.pages, r.difficulty, r.rating,
      r.depthScore, r.xpEarned, `"${tags}"`, `"${cleanReview}"`, `"${cleanComment}"`
    ].join(","));
  });
  const csvStr = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "shanglin_reading_report.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================================
// 身分選擇與帳號登錄邏輯 (學生端 vs 教師/管理者端)
// ============================================================================
window.switchLoginIdentityMode = function(mode) {
  const isStudent = mode === "student";
  document.getElementById("tabBtnStudentMode").classList.toggle("active", isStudent);
  document.getElementById("tabBtnTeacherMode").classList.toggle("active", !isStudent);
  document.getElementById("studentLoginForm").style.display = isStudent ? "block" : "none";
  document.getElementById("teacherLoginForm").style.display = isStudent ? "none" : "block";
};

window.quickFillStudentLogin = function(gradeClass, seatNo, name, classId) {
  document.getElementById("stuGradeInput").value = gradeClass;
  document.getElementById("stuSeatInput").value = seatNo;
  document.getElementById("stuNameInput").value = name;
  const sel = document.getElementById("stuClassSelect");
  if (sel && classId) sel.value = classId;
};

// ============================================================================
// 事件綁定與互動處理
// ============================================================================
window.switchTab = function(tabName) {
  const curUser = getCurrentStudent();
  if (tabName === "teacher" && (!curUser || curUser.role !== "teacher")) {
    alert("🔒「🎨 角色圖案工坊 & 教師管理」為教師與管理者專屬功能，請先切換或登錄師長身分！");
    return;
  }
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  document.querySelectorAll(".tab-section").forEach(sec => {
    sec.classList.toggle("active", sec.id === `tab-${tabName}`);
  });
  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

function closePromotionModal() {
  document.getElementById("promotionModal").classList.remove("show");
}

function closeLoginModal() {
  document.getElementById("loginModal").classList.remove("show");
}

window.openGroupPhotoModal = function() {
  const modal = document.getElementById("groupPhotoModal");
  if (modal) modal.classList.add("show");
};

window.closeGroupPhotoModal = function() {
  const modal = document.getElementById("groupPhotoModal");
  if (modal) modal.classList.remove("show");
};

window.openQrCodeModal = function() {
  const modal = document.getElementById("qrCodeModal");
  const urlInput = document.getElementById("qrTargetUrlInput");
  if (urlInput && !urlInput.value) {
    urlInput.value = "https://paywhathome-design.github.io/shanglin-reading/";
  }
  if (modal) modal.classList.add("show");
};

window.closeQrCodeModal = function() {
  const modal = document.getElementById("qrCodeModal");
  if (modal) modal.classList.remove("show");
};

window.regenerateQrPosterInModal = function() {
  const urlInput = document.getElementById("qrTargetUrlInput");
  const targetUrl = (urlInput && urlInput.value.trim()) ? urlInput.value.trim() : window.location.href;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&ecc=H&color=365314&bgcolor=ffffff&data=${encodeURIComponent(targetUrl)}`;

  const qrImg = new Image();
  qrImg.crossOrigin = "anonymous";
  qrImg.onload = function() {
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.onload = function() {
      const canvas = document.createElement("canvas");
      canvas.width = 900;
      canvas.height = 1120;
      const ctx = canvas.getContext("2d");

      // 背景漸層
      const bgGrad = ctx.createLinearGradient(0, 0, 900, 1120);
      bgGrad.addColorStop(0, "#fef9c3");
      bgGrad.addColorStop(1, "#d9f99d");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 900, 1120);

      // 頂部橫幅「上林閱讀生態系」
      const banGrad = ctx.createLinearGradient(70, 60, 830, 215);
      banGrad.addColorStop(0, "#65a30d");
      banGrad.addColorStop(1, "#84cc16");
      ctx.fillStyle = banGrad;
      ctx.beginPath();
      ctx.roundRect(70, 60, 760, 155, 32);
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      // 橫幅左側校徽
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(100, 80, 112, 112, 24);
      ctx.fill();
      ctx.drawImage(logoImg, 108, 88, 96, 96);

      // 橫幅文字
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 52px 'Microsoft JhengHei', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("上林閱讀生態系", 235, 138);
      ctx.fillStyle = "#fef08a";
      ctx.font = "bold 20px 'Microsoft JhengHei', sans-serif";
      ctx.fillText("雙溪五大生態角色養成 × 八大知識廣度 × 引導式書評", 238, 178);

      // 中央白色 QR 卡片外框
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(110, 250, 680, 680, 36);
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#a3e635";
      ctx.stroke();

      ctx.drawImage(qrImg, 145, 285, 610, 610);

      // QR 中央上林國小校徽
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(380, 520, 140, 140, 24);
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#84cc16";
      ctx.stroke();
      ctx.drawImage(logoImg, 392, 532, 116, 116);

      // 底部說明文字
      ctx.fillStyle = "#365314";
      ctx.font = "bold 26px 'Microsoft JhengHei', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("★ 請用平板或手機相機掃描，立即展開閱讀冒險！ ★", 450, 995);
      ctx.fillStyle = "#4d7c0f";
      ctx.font = "bold 16px 'Microsoft JhengHei', sans-serif";
      ctx.fillText(targetUrl, 450, 1045);

      const dataUrl = canvas.toDataURL("image/png");
      const previewEl = document.getElementById("qrPosterPreviewImg");
      const dlBtn = document.getElementById("btnDownloadQrPoster");
      if (previewEl) previewEl.src = dataUrl;
      if (dlBtn) dlBtn.href = dataUrl;
    };
    logoImg.src = "./assets/images/school_logo.png";
  };
  qrImg.src = qrApiUrl;
};

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ============================================================================
// index4 低年級注音語音版專屬互動：點選繪本、點選厚度/笑臉、語音錄音 (MediaRecorder) 與語音辨識轉文字
// ============================================================================
window.juniorRecordedAudioDataUrl = "";
let juniorMediaRecorder = null;
let juniorAudioChunks = [];
let juniorRecTimerInterval = null;
let juniorRecSeconds = 0;
let juniorSpeechRec = null;

window.juniorQuickPickBook = function(title, categoryId, pages) {
  const titleEl = document.getElementById("bookTitleInput");
  const catEl = document.getElementById("bookCategorySelect");
  const pagesEl = document.getElementById("bookPagesInput");
  if (titleEl) titleEl.value = title;
  if (catEl && categoryId) catEl.value = categoryId;
  if (pagesEl && pages) pagesEl.value = pages;
  updateLiveQuestPreview();
};

window.selectJuniorBookThickness = function(pages, diff, btnEl) {
  const pagesEl = document.getElementById("bookPagesInput");
  const diffEl = document.getElementById("bookDifficultySelect");
  if (pagesEl) pagesEl.value = pages;
  if (diffEl) diffEl.value = String(diff);
  document.querySelectorAll(".thick-btn").forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  updateLiveQuestPreview();
};

window.selectJuniorRating = function(stars, btnEl) {
  const rateEl = document.getElementById("bookRatingSelect");
  if (rateEl) rateEl.value = String(stars);
  document.querySelectorAll(".rate-face-btn").forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
};

window.appendJuniorSentence = function(sentence) {
  const sumEl = document.getElementById("promptSummaryInput");
  if (!sumEl) return;
  const cur = sumEl.value.trim();
  sumEl.value = cur ? `${cur} ${sentence}` : sentence;
  updateLiveQuestPreview();
};

window.startSpeechToText = function(targetInputId) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("您的瀏覽器目前不支援語音轉文字，可直接點選上方的繪本名稱或由家長協助輸入喔！");
    return;
  }
  const rec = new SpeechRecognition();
  rec.lang = "zh-TW";
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  const targetEl = document.getElementById(targetInputId);
  const oldPlaceholder = targetEl ? targetEl.placeholder : "";
  if (targetEl) targetEl.placeholder = "🎙️ 請說話，正在聽你念書名...";
  rec.onresult = function(event) {
    const transcript = event.results[0][0].transcript.replace(/[。，！？]/g, "").trim();
    if (targetEl && transcript) {
      targetEl.value = transcript;
      updateLiveQuestPreview();
    }
  };
  rec.onerror = function() {
    if (targetEl) targetEl.placeholder = oldPlaceholder;
  };
  rec.onend = function() {
    if (targetEl) targetEl.placeholder = oldPlaceholder;
  };
  rec.start();
};

window.toggleJuniorVoiceRecording = async function() {
  const btn = document.getElementById("btnStartVoiceRec");
  const timerBadge = document.getElementById("voiceTimerBadge");

  // 若正在錄音中，點擊則停止錄音
  if (juniorMediaRecorder && juniorMediaRecorder.state === "recording") {
    juniorMediaRecorder.stop();
    if (juniorSpeechRec) {
      try { juniorSpeechRec.stop(); } catch (e) {}
    }
    return;
  }

  // 啟動麥克風錄音
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("找不到麥克風裝置，或瀏覽器未允許麥克風權限。您也可以直接點選下方的「一句話小小心得」按鈕完成打卡喔！");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    juniorAudioChunks = [];
    const options = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? { mimeType: "audio/webm;codecs=opus", audioBitsPerSecond: 16000 }
      : {};
    juniorMediaRecorder = new MediaRecorder(stream, options);

    juniorMediaRecorder.ondataavailable = function(e) {
      if (e.data && e.data.size > 0) juniorAudioChunks.push(e.data);
    };

    juniorMediaRecorder.onstop = function() {
      clearInterval(juniorRecTimerInterval);
      stream.getTracks().forEach(t => t.stop());

      const blob = new Blob(juniorAudioChunks, { type: juniorMediaRecorder.mimeType || "audio/webm" });
      const reader = new FileReader();
      reader.onloadend = function() {
        window.juniorRecordedAudioDataUrl = reader.result;
        const previewWrap = document.getElementById("voicePlaybackWrap");
        const audioEl = document.getElementById("juniorAudioPreview");
        const clearBtn = document.getElementById("btnClearVoiceRec");
        if (audioEl) audioEl.src = window.juniorRecordedAudioDataUrl;
        if (previewWrap) previewWrap.style.display = "flex";
        if (clearBtn) clearBtn.style.display = "inline-flex";
        updateLiveQuestPreview();
      };
      reader.readAsDataURL(blob);

      if (btn) {
        btn.classList.remove("recording");
        btn.innerHTML = `🔴 錄音已完成！（可點此重新錄音）`;
      }
    };

    juniorMediaRecorder.start();
    juniorRecSeconds = 0;
    if (btn) {
      btn.classList.add("recording");
      btn.innerHTML = `⏹️ 正在錄音中... 說完請點這裡停止`;
    }
    if (timerBadge) timerBadge.textContent = `🔴 錄音中 00:00`;

    juniorRecTimerInterval = setInterval(() => {
      juniorRecSeconds++;
      const secStr = String(juniorRecSeconds).padStart(2, "0");
      if (timerBadge) timerBadge.textContent = `🔴 錄音中 00:${secStr}`;
      // 最長錄音 45 秒自動停止，確保雲端試算表同步流暢
      if (juniorRecSeconds >= 45 && juniorMediaRecorder && juniorMediaRecorder.state === "recording") {
        juniorMediaRecorder.stop();
      }
    }, 1000);

    // 同步啟動語音轉文字（若瀏覽器支援，邊錄音邊幫低年級孩子把說的話轉成文字填入心得欄！）
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        juniorSpeechRec = new SpeechRecognition();
        juniorSpeechRec.lang = "zh-TW";
        juniorSpeechRec.continuous = true;
        juniorSpeechRec.interimResults = false;
        juniorSpeechRec.onresult = function(event) {
          let spoken = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              spoken += event.results[i][0].transcript;
            }
          }
          if (spoken.trim()) {
            const sumEl = document.getElementById("promptSummaryInput");
            if (sumEl) {
              sumEl.value = (sumEl.value ? sumEl.value + " " : "") + spoken.trim();
              updateLiveQuestPreview();
            }
          }
        };
        juniorSpeechRec.start();
      } catch (ignore) {}
    }
  } catch (err) {
    alert("無法開啟麥克風（請在瀏覽器網址列左側允許麥克風權限）：" + err.message);
  }
};

window.clearJuniorVoiceRecording = function() {
  window.juniorRecordedAudioDataUrl = "";
  const previewWrap = document.getElementById("voicePlaybackWrap");
  const audioEl = document.getElementById("juniorAudioPreview");
  const clearBtn = document.getElementById("btnClearVoiceRec");
  const btn = document.getElementById("btnStartVoiceRec");
  const timerBadge = document.getElementById("voiceTimerBadge");
  if (audioEl) audioEl.src = "";
  if (previewWrap) previewWrap.style.display = "none";
  if (clearBtn) clearBtn.style.display = "none";
  if (timerBadge) timerBadge.textContent = "⏱️ 00:00 (最長 45 秒)";
  if (btn) {
    btn.classList.remove("recording");
    btn.innerHTML = `🔴 點這裡開始錄音說故事`;
  }
  updateLiveQuestPreview();
};

document.addEventListener("DOMContentLoaded", () => {
  // 立即同步渲染全站內容（不等候網路請求，確保畫面 0 延遲呈現）
  renderAll();
  loadAppState();

  // 分頁切換按鈕
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // 切換展示學生/教師帳號
  document.getElementById("studentSwitcher").addEventListener("change", (e) => {
    currentStudentId = e.target.value;
    localStorage.setItem(CURRENT_USER_KEY, currentStudentId);
    const cur = getCurrentStudent();
    if (cur) inspectingClassId = cur.classId;
    renderAll();
  });

  // 撰寫書評表單即時預覽監聽
  ["bookPagesInput", "bookDifficultySelect", "bookCategorySelect", "promptSummaryInput", "promptTakeawayInput", "promptQuoteInput"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", updateLiveQuestPreview);
    if (el) el.addEventListener("change", updateLiveQuestPreview);
  });

  // 一鍵填入範例書評體驗
  document.getElementById("btnFillDemoBook").addEventListener("click", () => {
    const demos = [
      {
        title: "穿山甲的祕密森林：雙溪淺山生態繪本",
        author: "自然生態繪本團隊",
        category: "science",
        pages: 168,
        diff: "3",
        summary: "介紹臺灣穿山甲媽媽如何背著甲寶寶在雙溪森林裡找尋白蟻、挖掘洞穴並躲避野狗等危險。",
        takeaway: "原來穿山甲沒有牙齒，是用長長的舌頭吃蟻類，而且遇到危險會捲成球，我們一定要好好愛護雙溪的自然棲地！",
        quote: "「每一片鱗甲下，都藏著守護森林的溫柔力量。」"
      },
      {
        title: "淡蘭古道小旅行：雙溪百年故事",
        author: "雙溪文史工作室",
        category: "history_geo",
        pages: 210,
        diff: "3",
        summary: "跟著書中主角走訪雙溪渡船頭、打鐵舖與淡蘭古道石階，認識百年前先民挑擔走古道的歷史。",
        takeaway: "每天上學經過的雙溪街道，以前竟然是重要的水陸交通樞紐，讓我對家鄉更有感情了。",
        quote: "「石階上的每一道青苔，都是時光留下的故事書。」"
      },
      {
        title: "山谷裡的藍寶石：臺灣藍鵲家族日記",
        author: "劉克襄",
        category: "arts",
        pages: 240,
        diff: "4",
        summary: "透過優美的文字與插畫，記錄臺灣藍鵲「幫手制度」——哥哥姊姊會留下來幫忙照顧鳥巢裡的弟妹。",
        takeaway: "藍羽仔不僅羽毛漂亮，最美的其實是牠們家族互相幫忙、團結合作照顧幼鳥的心意。",
        quote: "「當長尾藍影掠過雙溪山嵐，那是森林最動人的詩篇。」"
      }
    ];
    const pick = demos[Math.floor(Math.random() * demos.length)];
    document.getElementById("bookTitleInput").value = pick.title;
    document.getElementById("bookAuthorInput").value = pick.author;
    document.getElementById("bookCategorySelect").value = pick.category;
    document.getElementById("bookPagesInput").value = pick.pages;
    document.getElementById("bookDifficultySelect").value = pick.diff;
    document.getElementById("promptSummaryInput").value = pick.summary;
    document.getElementById("promptTakeawayInput").value = pick.takeaway;
    document.getElementById("promptQuoteInput").value = pick.quote;
    updateLiveQuestPreview();
  });

  // 提交簡單書評表單
  document.getElementById("reviewQuestForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const student = getCurrentStudent();
    const charClass = appState.classes.find(c => c.id === student.classId) || appState.classes[0];
    const oldLv = getLevelInfo(student.xp).level;
    const oldStage = getCharacterStageInfo(charClass, oldLv).activeStage.stage;
    const isJunior = document.body.classList.contains("junior-mode");

    let s1 = document.getElementById("promptSummaryInput").value.trim();
    let s2 = document.getElementById("promptTakeawayInput").value.trim();
    let s3 = document.getElementById("promptQuoteInput").value.trim();
    const audioData = window.juniorRecordedAudioDataUrl || "";

    if (isJunior) {
      if (!s1 && audioData) {
        s1 = "🎙️ 我用麥克風錄下了這本書的故事與喜愛分享！（請點擊下方語音播放收聽）";
      } else if (!s1) {
        s1 = "這本書的圖畫好漂亮，故事超級有趣！";
      }
      if (!s2) {
        s2 = audioData ? "完成「小小說書人」語音錄音打卡任務！" : "讀完這本書讓我學到好多新知識，我想推薦給好朋友一起看！";
      }
    }

    const reviewText = isJunior
      ? `【小小說書人分享】${s1}`
      : `【核心摘要】${s1}\n【深刻啟發】${s2}${s3 ? `\n【喜愛金句】${s3}` : ""}`;

    const payload = {
      studentId: student.id,
      bookTitle: document.getElementById("bookTitleInput").value.trim(),
      author: document.getElementById("bookAuthorInput").value.trim() || (isJunior ? "繪本故事" : ""),
      category: document.getElementById("bookCategorySelect").value,
      pages: Number(document.getElementById("bookPagesInput").value) || (isJunior ? 32 : 120),
      difficulty: Number(document.getElementById("bookDifficultySelect").value) || 3,
      rating: Number(document.getElementById("bookRatingSelect").value) || 5,
      moodTags: Array.from(selectedMoodTags),
      promptSummary: s1,
      promptTakeaway: s2,
      promptQuote: s3,
      reviewText,
      audioData
    };

    let xpEarned = 220;
    if (isCloudGasOnline) {
      const data = await callCloudGasPost({ action: "add_review", ...payload });
      if (data.ok && data.state) {
        appState = ensureValidAppState(data.state);
        applyCustomImageMapToState(appState);
        xpEarned = data.xpEarned;
        saveLocalBackup();
      }
    } else if (isBackendOnline) {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.ok) {
        appState = data.state;
        applyCustomImageMapToState(appState);
        xpEarned = data.xpEarned;
      }
    } else {
      const depthScore = Number(document.getElementById("liveDepthScore").textContent) || 75;
      xpEarned = Number(document.getElementById("liveXpEstimate").textContent.replace(/[^0-9]/g, "")) || 200;
      const newRev = {
        id: "R" + Date.now(),
        studentId: student.id,
        studentName: student.name,
        gradeClass: student.gradeClass,
        seatNo: student.seatNo || "01",
        classId: student.classId,
        ...payload,
        depthScore,
        xpEarned,
        likes: 1,
        teacherComment: "",
        createdAt: new Date().toISOString()
      };
      appState.reviews.unshift(newRev);
      student.xp = Number(student.xp) + xpEarned;
      saveLocalBackup();
    }

    const updatedStudent = getCurrentStudent();
    const newLv = getLevelInfo(updatedStudent.xp).level;
    const newStageObj = getCharacterStageInfo(charClass, newLv).activeStage;

    document.getElementById("bookTitleInput").value = "";
    document.getElementById("bookAuthorInput").value = "";
    document.getElementById("promptSummaryInput").value = "";
    document.getElementById("promptTakeawayInput").value = "";
    document.getElementById("promptQuoteInput").value = "";
    if (typeof window.clearJuniorVoiceRecording === "function") {
      window.clearJuniorVoiceRecording();
    }

    renderAll();
    switchTab("dashboard");

    const modal = document.getElementById("promotionModal");
    document.getElementById("promoModalImg").src = resolveImgPath(newStageObj.image);
    if (newStageObj.stage > oldStage) {
      document.getElementById("promoModalTitle").textContent = `🎉 角色階級大晉升！解鎖 STAGE ${newStageObj.stage}`;
      document.getElementById("promoModalSubtitle").textContent = `恭喜進化為「${newStageObj.title}」！${newStageObj.desc}`;
    } else if (newLv > oldLv) {
      document.getElementById("promoModalTitle").textContent = `⚡ 冒險等級提升至 Lv.${newLv}！`;
      document.getElementById("promoModalSubtitle").textContent = `持續累積閱讀量與書評深度，離下一階型態進化越來越近囉！`;
    } else {
      document.getElementById("promoModalTitle").textContent = `🌟 書評任務完成！獲得 +${xpEarned} XP`;
      document.getElementById("promoModalSubtitle").textContent = `《${payload.bookTitle}》已收錄至你的知識星盤與全校書評星牆！`;
    }
    document.getElementById("promoModalBonusBox").textContent = `本次任務獲得 +${xpEarned} XP ｜ 目前總經驗值：${updatedStudent.xp.toLocaleString()} XP (Lv.${newLv})`;
    modal.classList.add("show");
  });

  // 書評牆篩選
  document.getElementById("wallCategoryFilter").addEventListener("change", renderReviewsWall);
  document.getElementById("wallSearchInput").addEventListener("input", renderReviewsWall);

  // 角色圖案工坊切換角色
  document.getElementById("workshopClassSelect").addEventListener("change", renderTeacherWorkshop);

  // 匯出 CSV 按鈕
  const btnCsv = document.getElementById("btnExportCsv");
  if (btnCsv) btnCsv.addEventListener("click", exportAllReviewsCsv);

  // 還原預設六階段角色圖案
  document.getElementById("btnResetDefaultImages").addEventListener("click", async () => {
    if (!confirm("確定要清除自訂修改，並還原為系統預設的六階段雙溪生物角色圖案嗎？")) return;
    localStorage.removeItem(CUSTOM_IMG_STORE_KEY);
    if (isCloudGasOnline) {
      const data = await callCloudGasPost({ action: "reset_images", defaultClasses: FALLBACK_STATE.classes });
      if (data.ok && data.state) appState = ensureValidAppState(data.state);
    } else if (isBackendOnline) {
      const res = await fetch("/api/classes/reset-images", { method: "POST" });
      const data = await res.json();
      if (data.ok) appState = data.state;
    } else {
      appState.classes = JSON.parse(JSON.stringify(FALLBACK_STATE.classes));
    }
    saveLocalBackup();
    renderAll();
  });

  // 開啟身分選擇與登錄彈窗
  document.getElementById("btnOpenLogin").addEventListener("click", () => {
    const stuClassSel = document.getElementById("stuClassSelect");
    stuClassSel.innerHTML = appState.classes.map(c => `<option value="${c.id}">${c.name}（${c.species || c.element}）</option>`).join("");
    document.getElementById("loginModal").classList.add("show");
  });

  // 教師身分下拉連動顯示稱呼
  const teacherRoleSel = document.getElementById("teacherRoleSelect");
  if (teacherRoleSel) {
    teacherRoleSel.addEventListener("change", () => {
      document.getElementById("teacherNameInput").value = teacherRoleSel.value;
    });
  }

  // 學生端表單提交（班級、座號、姓名）
  document.getElementById("studentLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const gradeClass = document.getElementById("stuGradeInput").value.trim() || "四年忠班";
    const seatNo = document.getElementById("stuSeatInput").value.trim() || "01";
    const name = document.getElementById("stuNameInput").value.trim();
    const classId = document.getElementById("stuClassSelect").value || "pangolin";
    if (!name) return;

    if (isCloudGasOnline) {
      const data = await callCloudGasPost({ identityMode: "student", action: "login", gradeClass, seatNo, name, classId });
      if (data.ok && data.state) {
        appState = ensureValidAppState(data.state);
        applyCustomImageMapToState(appState);
        currentStudentId = data.student.id;
        localStorage.setItem(CURRENT_USER_KEY, currentStudentId);
        saveLocalBackup();
        closeLoginModal();
        renderAll();
      }
    } else if (isBackendOnline) {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identityMode: "student", gradeClass, seatNo, name, classId })
      });
      const data = await res.json();
      if (data.ok) {
        appState = data.state;
        applyCustomImageMapToState(appState);
        currentStudentId = data.student.id;
        localStorage.setItem(CURRENT_USER_KEY, currentStudentId);
        closeLoginModal();
        renderAll();
      }
    } else {
      let existing = appState.students.find(s => s.role !== "teacher" && s.name === name && s.gradeClass === gradeClass);
      if (!existing) {
        existing = appState.students.find(s => s.role !== "teacher" && s.name === name);
      }
      if (!existing) {
        existing = {
          id: "S" + Date.now(),
          studentCode: `${gradeClass}_${seatNo}`,
          seatNo,
          name,
          gradeClass,
          role: "student",
          staffTitle: "",
          classId,
          avatarCustom: "",
          xp: 0,
          badges: []
        };
        appState.students.push(existing);
      } else {
        existing.gradeClass = gradeClass;
        existing.seatNo = seatNo;
        existing.classId = classId;
      }
      saveLocalBackup();
      currentStudentId = existing.id;
      localStorage.setItem(CURRENT_USER_KEY, currentStudentId);
      closeLoginModal();
      renderAll();
    }
  });

  // 教師與管理者端表單提交（管理者校長、管理者閱推教師、管理者教務處主任、管理者教學組長、教師）
  document.getElementById("teacherLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const staffTitle = document.getElementById("teacherRoleSelect").value;
    const name = document.getElementById("teacherNameInput").value.trim() || staffTitle;

    if (isCloudGasOnline) {
      const data = await callCloudGasPost({ identityMode: "teacher", action: "login", staffTitle, name });
      if (data.ok && data.state) {
        appState = ensureValidAppState(data.state);
        applyCustomImageMapToState(appState);
        currentStudentId = data.student.id;
        localStorage.setItem(CURRENT_USER_KEY, currentStudentId);
        saveLocalBackup();
        closeLoginModal();
        renderAll();
      }
    } else if (isBackendOnline) {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identityMode: "teacher", staffTitle, name })
      });
      const data = await res.json();
      if (data.ok) {
        appState = data.state;
        applyCustomImageMapToState(appState);
        currentStudentId = data.student.id;
        localStorage.setItem(CURRENT_USER_KEY, currentStudentId);
        closeLoginModal();
        renderAll();
      }
    } else {
      let existing = appState.students.find(s => s.role === "teacher" && (s.staffTitle === staffTitle || s.name === name));
      if (!existing) {
        existing = {
          id: "T" + Date.now(),
          studentCode: "teacher_" + Date.now(),
          seatNo: "-",
          name,
          gradeClass: staffTitle,
          role: "teacher",
          staffTitle,
          classId: "magpie",
          avatarCustom: "",
          xp: 2600,
          badges: ["first_book", "breadth_all"]
        };
        appState.students.push(existing);
      } else {
        existing.name = name;
      }
      saveLocalBackup();
      currentStudentId = existing.id;
      localStorage.setItem(CURRENT_USER_KEY, currentStudentId);
      closeLoginModal();
      renderAll();
    }
  });
});
