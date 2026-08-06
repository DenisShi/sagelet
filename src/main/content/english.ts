import { learningCardSchema, type LearningCard } from '../../shared/models'

const rawCards: LearningCard[] = [
  {
    id: 'english-a1-there-is',
    topic: 'english',
    category: 'grammar',
    level: 'A1',
    title: 'There is / There are',
    notificationText: 'Use “there is” for one thing and “there are” for several things.',
    explanation:
      'We use “there is” with a singular noun and “there are” with a plural noun when we say that something exists or is present.',
    example: 'There is a café near my office. There are two parks nearby.',
    translation: 'Рядом с моим офисом есть кафе. Поблизости есть два парка.',
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
    explanation:
      '“How often” asks about frequency. You can answer with always, usually, sometimes, rarely, never, or a time expression.',
    example: 'How often do you practise English? — I practise three times a week.',
    translation: 'Как часто ты занимаешься английским? — Я занимаюсь три раза в неделю.',
    tags: ['questions', 'frequency'],
    estimatedSeconds: 40
  },
  {
    id: 'english-a2-since-for',
    topic: 'english',
    category: 'grammar',
    level: 'A2',
    title: 'Since vs for',
    notificationText: '“Since” marks a starting point; “for” describes a period of time.',
    explanation:
      'Use “since” with the moment an action started and “for” with its duration. They are common with the present perfect.',
    example: 'I have lived in Prague since 2023. I have lived here for three years.',
    translation: 'Я живу в Праге с 2023 года. Я живу здесь три года.',
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
    explanation:
      '“Look forward to” means to feel pleased and excited about something that is going to happen. Here “to” is a preposition.',
    example: 'I’m looking forward to meeting the new team.',
    translation: 'Я с нетерпением жду встречи с новой командой.',
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
    explanation:
      '“Borrow” describes receiving something temporarily. “Lend” describes giving something temporarily.',
    example: 'Can I borrow your charger? Sure, I can lend it to you.',
    translation: 'Можно одолжить у тебя зарядку? Конечно, я могу дать её тебе.',
    tags: ['confusing words', 'daily English'],
    estimatedSeconds: 45
  },
  {
    id: 'english-b1-used-to',
    topic: 'english',
    category: 'grammar',
    level: 'B1',
    title: 'Used to',
    notificationText: '“Used to” describes a past habit or state that is no longer true.',
    explanation:
      'Use “used to + base verb” for repeated actions or situations in the past that have changed. In questions and negatives, use “did”.',
    example: 'I used to work from an office, but now I work remotely.',
    translation: 'Раньше я работал из офиса, но теперь работаю удалённо.',
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
    explanation:
      'Unlike “used to”, this expression is followed by a noun, pronoun, or verb ending in -ing. It focuses on the process of adapting.',
    example: 'It took me a month to get used to speaking English at work.',
    translation: 'Мне понадобился месяц, чтобы привыкнуть говорить по-английски на работе.',
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
    explanation:
      'Use “actually” to correct an idea or add a surprising fact. For “currently”, use “currently”, “now”, or “at the moment”.',
    example: 'I thought the task was finished, but it is actually still in progress.',
    translation: 'Я думал, что задача закончена, но на самом деле она всё ещё выполняется.',
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
    explanation:
      'The expression literally asks whether an action would bother someone. A positive response to the request is often “Not at all”.',
    example: 'Would you mind sending me the latest version of the file?',
    translation: 'Не мог бы ты отправить мне последнюю версию файла?',
    tags: ['polite requests', 'work English'],
    estimatedSeconds: 55
  },
  {
    id: 'english-b2-inversion',
    topic: 'english',
    category: 'grammar',
    level: 'B2',
    title: 'Negative inversion',
    notificationText: 'After “rarely”, “never”, or “only then” at the start, invert the subject and auxiliary.',
    explanation:
      'Formal or emphatic English often places a negative expression first. The auxiliary then comes before the subject, as in a question.',
    example: 'Rarely have I seen such a clear explanation.',
    translation: 'Редко мне доводилось видеть настолько понятное объяснение.',
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
    explanation:
      'Use this phrase for advice based on experience that is usually helpful, even though it is not exact in every case.',
    example: 'As a rule of thumb, keep each function focused on one responsibility.',
    translation: 'Как правило, каждая функция должна отвечать за одну задачу.',
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
    explanation:
      'Use “eventually” when something happens after a delay or a series of events. For possibility, use “possibly” or “perhaps”.',
    example: 'The bug was difficult to reproduce, but we eventually found the cause.',
    translation: 'Баг было сложно воспроизвести, но в конце концов мы нашли причину.',
    tags: ['false friends', 'time'],
    estimatedSeconds: 50
  }
]

export const englishCards = learningCardSchema.array().parse(rawCards)
