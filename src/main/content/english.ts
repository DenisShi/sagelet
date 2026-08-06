import { learningCardSchema, type LearningCard } from '../../shared/models'

const rawCards: LearningCard[] = [
  {
    id: 'english-a1-there-is',
    topic: 'english',
    category: 'grammar',
    level: 'A1',
    title: 'There is / There are',
    notificationText: 'Use “there is” for one thing and “there are” for several things.',
    explanation: 'We use these forms when we say that something exists or is present.',
    example: 'There is a café near my office. There are two parks nearby.',
    russian: {
      title: 'There is / There are — есть, находится',
      notificationText: '“There is” используется для одного предмета, “there are” — для нескольких.',
      explanation: 'Эти конструкции сообщают, что что-то существует или находится в определённом месте.',
      example: 'Рядом с моим офисом есть кафе. Поблизости есть два парка.'
    },
    tags: ['basic grammar', 'singular', 'plural'],
    estimatedSeconds: 45
  },
  {
    id: 'english-a1-how-often',
    topic: 'english',
    category: 'phrase',
    level: 'A1',
    title: 'How often…?',
    notificationText: 'Ask “How often…?” when you want to know how regularly something happens.',
    explanation: 'Answer with always, usually, sometimes, rarely, never, or a time expression.',
    example: 'How often do you practise English? — Three times a week.',
    russian: {
      title: 'How often…? — Как часто…?',
      notificationText: 'Этот вопрос помогает узнать, насколько регулярно что-то происходит.',
      explanation: 'В ответе можно использовать наречия частоты или конкретный период.',
      example: 'Как часто ты практикуешь английский? — Три раза в неделю.'
    },
    tags: ['questions', 'frequency'],
    estimatedSeconds: 40
  },
  {
    id: 'english-a1-present-simple',
    topic: 'english',
    category: 'grammar',
    level: 'A1',
    title: 'Present simple routines',
    notificationText: 'Use the present simple for routines, habits, and facts.',
    explanation: 'Add -s or -es to the verb after he, she, or it in affirmative sentences.',
    example: 'I start work at nine. She starts at eight.',
    russian: {
      title: 'Present Simple для регулярных действий',
      notificationText: 'Present Simple описывает привычки, распорядок и факты.',
      explanation: 'В утвердительном предложении после he, she или it к глаголу добавляется -s или -es.',
      example: 'Я начинаю работу в девять. Она начинает в восемь.'
    },
    tags: ['present simple', 'routines'],
    estimatedSeconds: 45
  },
  {
    id: 'english-a1-some-any',
    topic: 'english',
    category: 'grammar',
    level: 'A1',
    title: 'Some vs any',
    notificationText: 'Use “some” mainly in positive sentences and “any” in questions and negatives.',
    explanation: 'Both words refer to an unspecified amount or number.',
    example: 'We have some coffee, but we do not have any milk.',
    russian: {
      title: 'Some и any — некоторое количество',
      notificationText: '“Some” обычно используется в утверждениях, а “any” — в вопросах и отрицаниях.',
      explanation: 'Оба слова обозначают неопределённое количество.',
      example: 'У нас есть кофе, но совсем нет молока.'
    },
    tags: ['quantifiers', 'basic grammar'],
    estimatedSeconds: 45
  },
  {
    id: 'english-a1-can-could',
    topic: 'english',
    category: 'phrase',
    level: 'A1',
    title: 'Can you…? / Could you…?',
    notificationText: 'Both forms make requests; “could” usually sounds a little more polite.',
    explanation: 'Use the base form of the verb after can or could.',
    example: 'Could you open the window, please?',
    russian: {
      title: 'Can you…? / Could you…? — просьба',
      notificationText: 'Обе формы выражают просьбу, но “could” обычно звучит немного вежливее.',
      explanation: 'После can или could используется начальная форма глагола.',
      example: 'Не могли бы вы открыть окно?'
    },
    tags: ['requests', 'modal verbs'],
    estimatedSeconds: 40
  },
  {
    id: 'english-a1-time-prepositions',
    topic: 'english',
    category: 'grammar',
    level: 'A1',
    title: 'At, on, and in for time',
    notificationText: 'Use “at” for clock times, “on” for days, and “in” for months or years.',
    explanation: 'These prepositions move from a precise time to a broader period.',
    example: 'At 9:00, on Monday, in August.',
    russian: {
      title: 'At, on и in со временем',
      notificationText: '“At” ставится со временем, “on” — с днями, “in” — с месяцами и годами.',
      explanation: 'Предлоги выбираются от точного момента к более широкому периоду.',
      example: 'В 9:00, в понедельник, в августе.'
    },
    tags: ['prepositions', 'time'],
    estimatedSeconds: 40
  },
  {
    id: 'english-a2-since-for',
    topic: 'english',
    category: 'grammar',
    level: 'A2',
    title: 'Since vs for',
    notificationText: '“Since” marks a starting point; “for” describes a period of time.',
    explanation: 'They are commonly used with the present perfect.',
    example: 'I have lived in Prague since 2023. I have lived here for three years.',
    russian: {
      title: 'Since и for — с какого момента и как долго',
      notificationText: '“Since” обозначает начальную точку, а “for” — продолжительность.',
      explanation: 'Оба слова часто используются с Present Perfect.',
      example: 'Я живу в Праге с 2023 года. Я живу здесь три года.'
    },
    tags: ['present perfect', 'time'],
    estimatedSeconds: 55
  },
  {
    id: 'english-a2-look-forward',
    topic: 'english',
    category: 'phrase',
    level: 'A2',
    title: 'Look forward to',
    notificationText: 'After “look forward to”, use a noun or a verb ending in -ing.',
    explanation: 'The phrase means to feel pleased about something that is going to happen.',
    example: 'I’m looking forward to meeting the new team.',
    russian: {
      title: 'Look forward to — ждать с нетерпением',
      notificationText: 'После этой конструкции используется существительное или глагол с окончанием -ing.',
      explanation: 'Фраза выражает радостное ожидание будущего события.',
      example: 'Я с нетерпением жду встречи с новой командой.'
    },
    tags: ['work English', 'gerund'],
    estimatedSeconds: 50
  },
  {
    id: 'english-a2-borrow-lend',
    topic: 'english',
    category: 'vocabulary',
    level: 'A2',
    title: 'Borrow vs lend',
    notificationText: 'You borrow something from a person, but that person lends it to you.',
    explanation: '“Borrow” means receiving temporarily; “lend” means giving temporarily.',
    example: 'Can I borrow your charger? I can lend it to you.',
    russian: {
      title: 'Borrow и lend — брать и давать взаймы',
      notificationText: 'Вы “borrow” что-то у человека, а этот человек “lends” это вам.',
      explanation: 'Borrow описывает получение на время, lend — передачу на время.',
      example: 'Можно взять твою зарядку? Я могу дать её тебе.'
    },
    tags: ['confusing words', 'daily English'],
    estimatedSeconds: 45
  },
  {
    id: 'english-a2-perfect-or-past',
    topic: 'english',
    category: 'grammar',
    level: 'A2',
    title: 'Present perfect or past simple?',
    notificationText: 'Use past simple with a finished time and present perfect without one.',
    explanation: 'Present perfect connects a past action with the present result or experience.',
    example: 'I sent it yesterday. I have already sent it.',
    russian: {
      title: 'Present Perfect или Past Simple?',
      notificationText: 'Past Simple используется с завершённым временем, Present Perfect — без него.',
      explanation: 'Present Perfect связывает прошлое действие с текущим результатом или опытом.',
      example: 'Я отправил это вчера. Я уже это отправил.'
    },
    tags: ['past simple', 'present perfect'],
    estimatedSeconds: 55
  },
  {
    id: 'english-a2-too-enough',
    topic: 'english',
    category: 'grammar',
    level: 'A2',
    title: 'Too vs enough',
    notificationText: '“Too” means more than needed; “enough” means as much as needed.',
    explanation: 'Put “too” before an adjective and “enough” after an adjective.',
    example: 'The file is too large. This version is small enough.',
    russian: {
      title: 'Too и enough — слишком и достаточно',
      notificationText: '“Too” означает больше необходимого, “enough” — ровно столько, сколько нужно.',
      explanation: 'Too ставится перед прилагательным, enough — после него.',
      example: 'Файл слишком большой. Эта версия достаточно маленькая.'
    },
    tags: ['adjectives', 'degree'],
    estimatedSeconds: 45
  },
  {
    id: 'english-a2-should-have-to',
    topic: 'english',
    category: 'grammar',
    level: 'A2',
    title: 'Should vs have to',
    notificationText: '“Should” gives advice; “have to” describes a necessity or rule.',
    explanation: 'The strength is different: advice is optional, while necessity is not.',
    example: 'You should rest. You have to show your ID.',
    russian: {
      title: 'Should и have to — совет и необходимость',
      notificationText: '“Should” выражает совет, “have to” — необходимость или правило.',
      explanation: 'Совету можно не следовать, а необходимость предполагает обязательное действие.',
      example: 'Тебе стоит отдохнуть. Ты должен показать удостоверение.'
    },
    tags: ['modal verbs', 'advice'],
    estimatedSeconds: 45
  },
  {
    id: 'english-b1-used-to',
    topic: 'english',
    category: 'grammar',
    level: 'B1',
    title: 'Used to',
    notificationText: '“Used to” describes a past habit or state that is no longer true.',
    explanation: 'Use “used to + base verb” for repeated past actions or situations that changed.',
    example: 'I used to work from an office, but now I work remotely.',
    russian: {
      title: 'Used to — раньше делал, а теперь нет',
      notificationText: 'Конструкция описывает прошлую привычку или состояние, которое уже изменилось.',
      explanation: 'После used to используется начальная форма глагола.',
      example: 'Раньше я работал из офиса, а теперь работаю удалённо.'
    },
    tags: ['past habits', 'work English'],
    estimatedSeconds: 60
  },
  {
    id: 'english-b1-get-used-to',
    topic: 'english',
    category: 'grammar',
    level: 'B1',
    title: 'Get used to',
    notificationText: '“Get used to” means to become familiar with a new situation.',
    explanation: 'It is followed by a noun, pronoun, or verb ending in -ing.',
    example: 'It took me a month to get used to speaking English at work.',
    russian: {
      title: 'Get used to — привыкнуть',
      notificationText: 'Конструкция означает постепенно освоиться в новой ситуации.',
      explanation: 'После неё используется существительное, местоимение или глагол с окончанием -ing.',
      example: 'Мне понадобился месяц, чтобы привыкнуть говорить по-английски на работе.'
    },
    tags: ['adaptation', 'gerund'],
    estimatedSeconds: 60
  },
  {
    id: 'english-b1-actually',
    topic: 'english',
    category: 'vocabulary',
    level: 'B1',
    title: 'Actually',
    notificationText: '“Actually” means “in fact” — it does not mean “currently”.',
    explanation: 'Use it to correct an idea or add a surprising fact.',
    example: 'I thought the task was finished, but it is actually still in progress.',
    russian: {
      title: 'Actually — на самом деле',
      notificationText: 'Слово означает «на самом деле», а не «актуально» или «сейчас».',
      explanation: 'Оно исправляет представление собеседника или добавляет неожиданный факт.',
      example: 'Я думал, что задача завершена, но на самом деле работа ещё идёт.'
    },
    tags: ['false friends', 'work English'],
    estimatedSeconds: 50
  },
  {
    id: 'english-b1-would-you-mind',
    topic: 'english',
    category: 'phrase',
    level: 'B1',
    title: 'Would you mind…?',
    notificationText: 'Use “Would you mind + -ing?” to make a polite request.',
    explanation: 'A positive response to the request is often “Not at all”.',
    example: 'Would you mind sending me the latest version of the file?',
    russian: {
      title: 'Would you mind…? — Вы не могли бы…?',
      notificationText: 'Формула “Would you mind + -ing?” используется для вежливой просьбы.',
      explanation: 'Ответ “Not at all” означает согласие выполнить просьбу.',
      example: 'Вы не могли бы отправить мне последнюю версию файла?'
    },
    tags: ['polite requests', 'work English'],
    estimatedSeconds: 55
  },
  {
    id: 'english-b1-present-perfect-continuous',
    topic: 'english',
    category: 'grammar',
    level: 'B1',
    title: 'Present perfect continuous',
    notificationText: 'Use it for an activity that started earlier and is still continuing.',
    explanation: 'The form is have or has + been + verb-ing and often emphasizes duration.',
    example: 'I have been working on this feature since Monday.',
    russian: {
      title: 'Present Perfect Continuous',
      notificationText: 'Время описывает действие, которое началось раньше и всё ещё продолжается.',
      explanation: 'Форма have/has + been + глагол с -ing часто подчёркивает длительность.',
      example: 'Я работаю над этой функцией с понедельника.'
    },
    tags: ['present perfect', 'duration'],
    estimatedSeconds: 60
  },
  {
    id: 'english-b1-first-conditional',
    topic: 'english',
    category: 'grammar',
    level: 'B1',
    title: 'First conditional',
    notificationText: 'Use “if + present, will + verb” for a realistic future possibility.',
    explanation: 'The if-clause states the condition and the other clause gives its likely result.',
    example: 'If the tests pass, we will release the update.',
    russian: {
      title: 'First Conditional — реальное условие',
      notificationText: 'Схема “if + настоящее время, will + глагол” описывает реальную возможность в будущем.',
      explanation: 'Часть с if задаёт условие, а вторая часть показывает вероятный результат.',
      example: 'Если тесты пройдут, мы выпустим обновление.'
    },
    tags: ['conditionals', 'future'],
    estimatedSeconds: 55
  },
  {
    id: 'english-b1-although-despite',
    topic: 'english',
    category: 'grammar',
    level: 'B1',
    title: 'Although vs despite',
    notificationText: '“Although” introduces a clause; “despite” is followed by a noun or -ing form.',
    explanation: 'Both connect contrasting ideas without changing the meaning.',
    example: 'Although it was late, we continued. Despite the delay, we finished.',
    russian: {
      title: 'Although и despite — несмотря на',
      notificationText: 'После although идёт предложение, после despite — существительное или форма с -ing.',
      explanation: 'Обе конструкции соединяют противопоставленные идеи.',
      example: 'Хотя было поздно, мы продолжили. Несмотря на задержку, мы закончили.'
    },
    tags: ['linking words', 'contrast'],
    estimatedSeconds: 55
  },
  {
    id: 'english-b1-say-tell',
    topic: 'english',
    category: 'vocabulary',
    level: 'B1',
    title: 'Say vs tell',
    notificationText: 'Use “tell” with a person; use “say” when the listener is not specified.',
    explanation: 'Say focuses on the words, while tell often focuses on passing information to someone.',
    example: 'She said the build was ready. She told me it was ready.',
    russian: {
      title: 'Say и tell — сказать и сообщить кому-то',
      notificationText: 'Tell используется с человеком, а say — когда получатель не указан.',
      explanation: 'Say подчёркивает слова, tell — передачу информации конкретному человеку.',
      example: 'Она сказала, что сборка готова. Она сообщила мне, что она готова.'
    },
    tags: ['confusing words', 'communication'],
    estimatedSeconds: 50
  },
  {
    id: 'english-b1-figure-out',
    topic: 'english',
    category: 'phrase',
    level: 'B1',
    title: 'Figure out',
    notificationText: '“Figure out” means to understand or solve something after thinking.',
    explanation: 'It is a common informal alternative to “determine” or “find the solution”.',
    example: 'We need to figure out why the request fails.',
    russian: {
      title: 'Figure out — разобраться, выяснить',
      notificationText: 'Фразовый глагол означает понять или решить что-то после размышления.',
      explanation: 'Это распространённый разговорный вариант слов determine или solve.',
      example: 'Нам нужно разобраться, почему запрос завершается ошибкой.'
    },
    tags: ['phrasal verbs', 'work English'],
    estimatedSeconds: 45
  },
  {
    id: 'english-b1-passive-voice',
    topic: 'english',
    category: 'grammar',
    level: 'B1',
    title: 'Passive voice',
    notificationText: 'Use the passive when the action or result matters more than the person doing it.',
    explanation: 'Build it with a form of “be” plus the past participle.',
    example: 'The issue was fixed this morning.',
    russian: {
      title: 'Passive Voice — страдательный залог',
      notificationText: 'Он используется, когда действие или результат важнее исполнителя.',
      explanation: 'Конструкция строится из формы глагола be и причастия прошедшего времени.',
      example: 'Проблема была исправлена сегодня утром.'
    },
    tags: ['passive voice', 'work English'],
    estimatedSeconds: 55
  },
  {
    id: 'english-b1-second-conditional',
    topic: 'english',
    category: 'grammar',
    level: 'B1',
    title: 'Second conditional',
    notificationText: 'Use “if + past, would + verb” for an unreal or unlikely present situation.',
    explanation: 'The past form expresses distance from reality, not past time.',
    example: 'If I had more time, I would improve the documentation.',
    russian: {
      title: 'Second Conditional — нереальное условие',
      notificationText: 'Схема “if + прошедшая форма, would + глагол” описывает нереальную или маловероятную ситуацию.',
      explanation: 'Прошедшая форма здесь показывает отдалённость от реальности, а не прошедшее время.',
      example: 'Если бы у меня было больше времени, я бы улучшил документацию.'
    },
    tags: ['conditionals', 'hypothetical'],
    estimatedSeconds: 55
  },
  {
    id: 'english-b1-reported-speech',
    topic: 'english',
    category: 'grammar',
    level: 'B1',
    title: 'Reported speech',
    notificationText: 'When reporting earlier words, the verb tense often moves one step into the past.',
    explanation: 'Present simple commonly becomes past simple, and will commonly becomes would.',
    example: '“It works.” — She said that it worked.',
    russian: {
      title: 'Reported Speech — косвенная речь',
      notificationText: 'При передаче чужих слов время глагола часто сдвигается на шаг в прошлое.',
      explanation: 'Present Simple обычно становится Past Simple, а will — would.',
      example: '«Это работает». — Она сказала, что это работает.'
    },
    tags: ['reported speech', 'communication'],
    estimatedSeconds: 60
  },
  {
    id: 'english-b1-relative-clauses',
    topic: 'english',
    category: 'grammar',
    level: 'B1',
    title: 'Who, which, and that',
    notificationText: 'Use “who” for people and “which” for things; “that” can often replace either one.',
    explanation: 'These words introduce a clause that identifies or describes a noun.',
    example: 'The developer who reviewed the change found the issue.',
    russian: {
      title: 'Who, which и that в придаточных',
      notificationText: 'Who относится к людям, which — к предметам, а that часто заменяет оба варианта.',
      explanation: 'Эти слова вводят часть предложения, которая уточняет или описывает существительное.',
      example: 'Разработчик, который проверял изменение, нашёл проблему.'
    },
    tags: ['relative clauses', 'pronouns'],
    estimatedSeconds: 55
  },
  {
    id: 'english-b1-gerund-infinitive',
    topic: 'english',
    category: 'grammar',
    level: 'B1',
    title: 'Gerund or infinitive?',
    notificationText: 'Some verbs take -ing, while others take “to + verb”.',
    explanation: 'For example, enjoy is followed by -ing, while decide is followed by an infinitive.',
    example: 'I enjoy solving problems, but I decided to take a break.',
    russian: {
      title: 'Герундий или инфинитив?',
      notificationText: 'После одних глаголов используется форма с -ing, после других — to + глагол.',
      explanation: 'Например, после enjoy нужна форма с -ing, а после decide — инфинитив.',
      example: 'Мне нравится решать задачи, но я решил сделать перерыв.'
    },
    tags: ['gerund', 'infinitive'],
    estimatedSeconds: 55
  },
  {
    id: 'english-b1-carry-out',
    topic: 'english',
    category: 'phrase',
    level: 'B1',
    title: 'Carry out',
    notificationText: '“Carry out” means to perform or complete a task, plan, or investigation.',
    explanation: 'It is common in professional and technical English.',
    example: 'The team carried out a full security review.',
    russian: {
      title: 'Carry out — выполнить, провести',
      notificationText: 'Фразовый глагол означает выполнить задачу, план или исследование.',
      explanation: 'Он часто встречается в профессиональном и техническом английском.',
      example: 'Команда провела полную проверку безопасности.'
    },
    tags: ['phrasal verbs', 'work English'],
    estimatedSeconds: 45
  },
  {
    id: 'english-b1-make-do',
    topic: 'english',
    category: 'vocabulary',
    level: 'B1',
    title: 'Make vs do',
    notificationText: 'Use “make” for creating a result and “do” for performing an activity.',
    explanation: 'Many combinations are fixed, so learn them as complete phrases.',
    example: 'Make a decision, but do the work.',
    russian: {
      title: 'Make и do — создать и выполнить',
      notificationText: 'Make чаще создаёт результат, а do описывает выполнение действия.',
      explanation: 'Многие сочетания устойчивы, поэтому их полезно запоминать целиком.',
      example: 'Принять решение, но выполнить работу.'
    },
    tags: ['collocations', 'confusing words'],
    estimatedSeconds: 45
  },
  {
    id: 'english-b1-unless',
    topic: 'english',
    category: 'grammar',
    level: 'B1',
    title: 'Unless',
    notificationText: '“Unless” means “if not” and introduces an exception or negative condition.',
    explanation: 'Do not add another negative after unless in a standard sentence.',
    example: 'The notification will appear unless you pause it.',
    russian: {
      title: 'Unless — если не',
      notificationText: 'Unless вводит исключение или отрицательное условие и означает «если не».',
      explanation: 'В обычном предложении после unless не требуется ещё одно отрицание.',
      example: 'Уведомление появится, если его не поставить на паузу.'
    },
    tags: ['conditionals', 'linking words'],
    estimatedSeconds: 45
  },
  {
    id: 'english-b1-supposed-to',
    topic: 'english',
    category: 'phrase',
    level: 'B1',
    title: 'Be supposed to',
    notificationText: 'Use “be supposed to” for an expectation, rule, or planned behavior.',
    explanation: 'It often suggests what should happen, even if reality is different.',
    example: 'The update is supposed to fix this issue.',
    russian: {
      title: 'Be supposed to — предполагаться, быть должным',
      notificationText: 'Конструкция выражает ожидание, правило или запланированное поведение.',
      explanation: 'Она показывает, что должно произойти, даже если реальность может отличаться.',
      example: 'Предполагается, что обновление исправит эту проблему.'
    },
    tags: ['expectations', 'work English'],
    estimatedSeconds: 50
  },
  {
    id: 'english-b1-likely-unlikely',
    topic: 'english',
    category: 'vocabulary',
    level: 'B1',
    title: 'Likely and unlikely',
    notificationText: '“Likely” means probable; “unlikely” means not probable.',
    explanation: 'Both words can follow be or appear before a noun.',
    example: 'The fix is likely to work, but a quick release is unlikely.',
    russian: {
      title: 'Likely и unlikely — вероятно и маловероятно',
      notificationText: 'Likely означает высокую вероятность, unlikely — низкую.',
      explanation: 'Оба слова могут стоять после be или перед существительным.',
      example: 'Исправление, вероятно, сработает, но быстрый релиз маловероятен.'
    },
    tags: ['probability', 'adjectives'],
    estimatedSeconds: 45
  },
  {
    id: 'english-b1-question-tags',
    topic: 'english',
    category: 'grammar',
    level: 'B1',
    title: 'Question tags',
    notificationText: 'Add a short opposite question at the end when checking or inviting agreement.',
    explanation: 'A positive statement usually takes a negative tag, and vice versa.',
    example: 'The build is ready, isn’t it?',
    russian: {
      title: 'Question Tags — уточняющие окончания',
      notificationText: 'К утверждению добавляется короткий противоположный вопрос для проверки или согласия.',
      explanation: 'После утвердительного предложения обычно идёт отрицательное окончание и наоборот.',
      example: 'Сборка готова, не так ли?'
    },
    tags: ['questions', 'conversation'],
    estimatedSeconds: 50
  },
  {
    id: 'english-b2-inversion',
    topic: 'english',
    category: 'grammar',
    level: 'B2',
    title: 'Negative inversion',
    notificationText: 'After “rarely”, “never”, or “only then” at the start, invert subject and auxiliary.',
    explanation: 'Formal or emphatic English places the auxiliary before the subject.',
    example: 'Rarely have I seen such a clear explanation.',
    russian: {
      title: 'Отрицательная инверсия',
      notificationText: 'После rarely, never или only then в начале меняется порядок подлежащего и вспомогательного глагола.',
      explanation: 'Такая структура характерна для формальной или выразительной речи.',
      example: 'Редко мне доводилось видеть настолько ясное объяснение.'
    },
    tags: ['formal English', 'word order'],
    estimatedSeconds: 70
  },
  {
    id: 'english-b2-rule-of-thumb',
    topic: 'english',
    category: 'phrase',
    level: 'B2',
    title: 'A rule of thumb',
    notificationText: 'A “rule of thumb” is a practical guideline, not a strict rule.',
    explanation: 'It describes advice based on experience that is usually helpful but not exact.',
    example: 'As a rule of thumb, keep each function focused on one responsibility.',
    russian: {
      title: 'A rule of thumb — практическое правило',
      notificationText: 'Это полезный ориентир, а не строгое правило.',
      explanation: 'Фраза описывает основанный на опыте совет, который обычно работает, но не является точным законом.',
      example: 'Как правило, каждая функция должна отвечать за одну задачу.'
    },
    tags: ['idiom', 'work English'],
    estimatedSeconds: 55
  },
  {
    id: 'english-b2-eventually',
    topic: 'english',
    category: 'vocabulary',
    level: 'B2',
    title: 'Eventually',
    notificationText: '“Eventually” means “in the end after some time”, not “possibly”.',
    explanation: 'Use it when something happens after a delay or a series of events.',
    example: 'The bug was difficult to reproduce, but we eventually found the cause.',
    russian: {
      title: 'Eventually — в конце концов',
      notificationText: 'Слово означает итог после некоторого времени, а не возможность.',
      explanation: 'Оно подходит, когда событие происходит после задержки или цепочки действий.',
      example: 'Ошибку было трудно воспроизвести, но в конце концов мы нашли причину.'
    },
    tags: ['false friends', 'time'],
    estimatedSeconds: 50
  },
  {
    id: 'english-b2-mixed-conditionals',
    topic: 'english',
    category: 'grammar',
    level: 'B2',
    title: 'Mixed conditionals',
    notificationText: 'Mix past and present forms when a past condition has a present result.',
    explanation: 'A common pattern is “if + past perfect, would + base verb”.',
    example: 'If I had backed up the file, I would not be rebuilding it now.',
    russian: {
      title: 'Mixed Conditionals — смешанные условия',
      notificationText: 'Прошедшая форма условия соединяется с настоящим результатом.',
      explanation: 'Распространённая схема: if + Past Perfect, затем would + начальная форма глагола.',
      example: 'Если бы я сделал резервную копию, мне не пришлось бы восстанавливать файл сейчас.'
    },
    tags: ['conditionals', 'advanced grammar'],
    estimatedSeconds: 70
  },
  {
    id: 'english-b2-hedging',
    topic: 'english',
    category: 'phrase',
    level: 'B2',
    title: 'Hedging an opinion',
    notificationText: 'Use “It seems”, “It appears”, or “I tend to think” to sound less absolute.',
    explanation: 'Hedging makes claims more careful, diplomatic, and appropriate when evidence is limited.',
    example: 'It appears that the latest change caused the regression.',
    russian: {
      title: 'Смягчение мнения',
      notificationText: 'It seems, it appears и I tend to think делают высказывание менее категоричным.',
      explanation: 'Такие обороты звучат осторожнее и дипломатичнее, особенно при неполных данных.',
      example: 'Похоже, что регрессия возникла из-за последнего изменения.'
    },
    tags: ['formal English', 'communication'],
    estimatedSeconds: 55
  },
  {
    id: 'english-b2-causative-have',
    topic: 'english',
    category: 'grammar',
    level: 'B2',
    title: 'Have something done',
    notificationText: 'Use “have + object + past participle” when another person performs a service for you.',
    explanation: 'The structure focuses on arranging the action rather than doing it yourself.',
    example: 'We had the security review completed before release.',
    russian: {
      title: 'Have something done — организовать выполнение',
      notificationText: 'Форма have + объект + причастие означает, что работу для вас выполняет кто-то другой.',
      explanation: 'В центре внимания организация действия, а не самостоятельное выполнение.',
      example: 'Мы организовали проверку безопасности до релиза.'
    },
    tags: ['causative', 'formal English'],
    estimatedSeconds: 65
  }
]

export const englishCards = learningCardSchema.array().parse(rawCards)
