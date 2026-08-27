import type { Locale } from '../types/domain'

export type PolicyInline = {
  text: string
  emphasis?: boolean
  href?: string
}

export type PolicyParagraph = string | { parts: PolicyInline[] }

export type PolicySection = {
  heading: string
  paragraphs?: PolicyParagraph[]
  items?: PolicyParagraph[]
}

export type PolicyDocument = {
  notice?: PolicyParagraph[]
  introduction: PolicyParagraph[]
  sections: PolicySection[]
}

const rich = (...parts: PolicyInline[]): PolicyParagraph => ({ parts })
const text = (value: string): PolicyInline => ({ text: value })
const emphasis = (value: string): PolicyInline => ({ text: value, emphasis: true })
const link = (value: string, href: string): PolicyInline => ({ text: value, href })

const privacyArticle = 'https://support.wix.com/en/article/creating-a-privacy-policy'
const accessibilityArticle =
  'https://support.wix.com/en/article/accessibility-adding-an-accessibility-statement-to-your-site'

export const privacyPolicies: Record<Locale, PolicyDocument> = {
  en: {
    introduction: [],
    sections: [
      {
        heading: 'A legal disclaimer',
        paragraphs: [
          'The explanations and information provided on this page are only general and high-level explanations and information on how to write your own document of a Privacy Policy. You should not rely on this article as legal advice or as recommendations regarding what you should actually do, because we cannot know in advance what are the specific privacy policies you wish to establish between your business and your customers and visitors. We recommend that you seek legal advice to help you understand and to assist you in the creation of your own Privacy Policy.',
        ],
      },
      {
        heading: 'Privacy Policy - the basics',
        paragraphs: [
          'Having said that, a privacy policy is a statement that discloses some or all of the ways a website collects, uses, discloses, processes, and manages the data of its visitors and customers. It usually also includes a statement regarding the website’s commitment to protecting its visitors’ or customers’ privacy, and an explanation about the different mechanisms the website is implementing in order to protect privacy.',
          'Different jurisdictions have different legal obligations of what must be included in a Privacy Policy. You are responsible to make sure you are following the relevant legislation to your activities and location.',
        ],
      },
      {
        heading: 'What to include in the Privacy Policy',
        paragraphs: [
          'Generally speaking, a Privacy Policy often addresses these types of issues: the types of information the website is collecting and the manner in which it collects the data; an explanation about why is the website collecting these types of information; what are the website’s practices on sharing the information with third parties; ways in which your visitors and customers can exercise their rights according to the relevant privacy legislation; the specific practices regarding minors’ data collection; and much, much more.',
          rich(
            text('To learn more about this, check out our article “'),
            link('Creating a Privacy Policy', privacyArticle),
            text('”.'),
          ),
        ],
      },
    ],
  },
  hi: {
    introduction: [],
    sections: [
      {
        heading: 'एक कानूनी अस्वीकरण',
        paragraphs: [
          'इस पृष्ठ पर दिए गए स्पष्टीकरण और जानकारी केवल सामान्य और उच्च-स्तरीय विवरण हैं, जिनका उद्देश्य यह बताना है कि आप अपना गोपनीयता नीति दस्तावेज़ कैसे लिख सकते हैं। आपको इस लेख को कानूनी सलाह या इस बारे में अनुशंसा नहीं मानना चाहिए कि आपको वास्तव में क्या करना चाहिए, क्योंकि हम पहले से यह नहीं जान सकते कि आप अपने व्यवसाय तथा अपने ग्राहकों और आगंतुकों के बीच कौन-सी विशिष्ट गोपनीयता नीतियाँ स्थापित करना चाहते हैं। हमारा सुझाव है कि अपनी गोपनीयता नीति को समझने और तैयार करने में सहायता के लिए आप कानूनी सलाह लें।',
        ],
      },
      {
        heading: 'गोपनीयता नीति - मूल बातें',
        paragraphs: [
          'इसे ध्यान में रखते हुए, गोपनीयता नीति एक ऐसा वक्तव्य है जो यह बताता है कि कोई वेबसाइट अपने आगंतुकों और ग्राहकों के डेटा को किन तरीकों से एकत्र, उपयोग, प्रकट, संसाधित और प्रबंधित करती है। इसमें सामान्यतः आगंतुकों या ग्राहकों की गोपनीयता की रक्षा करने के प्रति वेबसाइट की प्रतिबद्धता और गोपनीयता की सुरक्षा के लिए वेबसाइट द्वारा लागू किए जा रहे विभिन्न उपायों का विवरण भी शामिल होता है।',
          'अलग-अलग न्याय क्षेत्रों में गोपनीयता नीति में शामिल की जाने वाली जानकारी से संबंधित कानूनी दायित्व अलग होते हैं। यह सुनिश्चित करना आपकी जिम्मेदारी है कि आप अपनी गतिविधियों और स्थान पर लागू संबंधित कानूनों का पालन कर रहे हैं।',
        ],
      },
      {
        heading: 'गोपनीयता नीति में क्या शामिल करें',
        paragraphs: [
          'सामान्यतः गोपनीयता नीति में इस प्रकार के विषय शामिल होते हैं: वेबसाइट किस प्रकार की जानकारी एकत्र करती है और उसे किस तरीके से एकत्र करती है; वेबसाइट इन प्रकार की जानकारियों को क्यों एकत्र करती है; तीसरे पक्षों के साथ जानकारी साझा करने से संबंधित वेबसाइट की प्रक्रियाएँ; लागू गोपनीयता कानूनों के अनुसार आगंतुक और ग्राहक अपने अधिकारों का उपयोग कैसे कर सकते हैं; नाबालिगों के डेटा के संग्रह से संबंधित विशिष्ट प्रक्रियाएँ; और इसी प्रकार के कई अन्य विषय।',
          rich(
            text('इस विषय में अधिक जानकारी के लिए हमारा लेख “'),
            link('गोपनीयता नीति बनाना', privacyArticle),
            text('” पढ़ें।'),
          ),
        ],
      },
    ],
  },
}

export const accessibilityStatements: Record<Locale, PolicyDocument> = {
  en: {
    notice: [
      'The purpose of the following template is to assist you in writing your accessibility statement. Please note that you are responsible for ensuring that your site’s statement meets the requirements of the local law in your area or region.',
      rich(
        emphasis(
          'Note: This page currently has two sections. Once you complete editing the Accessibility Statement below, you need to delete this section.',
        ),
      ),
      rich(
        text('To learn more about this, check out our article “'),
        link('Accessibility: Adding an Accessibility Statement to Your Site', accessibilityArticle),
        text('”.'),
      ),
    ],
    introduction: [
      rich(text('This statement was last updated on '), emphasis('[enter relevant date].')),
      rich(
        text('We at '),
        emphasis('[enter organization / business name]'),
        text(' are working to make our site '),
        emphasis('[enter site name and address]'),
        text(' accessible to people with disabilities.'),
      ),
    ],
    sections: [
      {
        heading: 'What web accessibility is',
        paragraphs: [
          'An accessible site allows visitors with disabilities to browse the site with the same or a similar level of ease and enjoyment as other visitors. This can be achieved with the capabilities of the system on which the site is operating, and through assistive technologies.',
        ],
      },
      {
        heading: 'Accessibility adjustments on this site',
        paragraphs: [
          rich(
            text('We have adapted this site in accordance with WCAG '),
            emphasis('[2.0 / 2.1 / 2.2 - select relevant option]'),
            text(' guidelines, and have made the site accessible to the level of '),
            emphasis('[A / AA / AAA - select relevant option].'),
            text(' This site’s contents have been adapted to work with assistive technologies, such as screen readers and keyboard use. As part of this effort, we have also '),
            emphasis('[remove irrelevant information]:'),
          ),
        ],
        items: [
          'Used the Accessibility Wizard to find and fix potential accessibility issues',
          'Set the language of the site',
          'Set the content order of the site’s pages',
          'Defined clear heading structures on all of the site’s pages',
          'Added alternative text to images',
          'Implemented color combinations that meet the required color contrast',
          'Reduced the use of motion on the site',
          'Ensured all videos, audio, and files on the site are accessible',
        ],
      },
      {
        heading:
          'Declaration of partial compliance with the standard due to third-party content [only add if relevant]',
        paragraphs: [
          rich(
            text('The accessibility of certain pages on the site depend on contents that do not belong to the organization, and instead belong to '),
            emphasis('[enter relevant third-party name]'),
            text('. The following pages are affected by this: '),
            emphasis('[list the URLs of the pages]'),
            text('. We therefore declare partial compliance with the standard for these pages.'),
          ),
        ],
      },
      {
        heading: 'Accessibility arrangements in the organization [only add if relevant]',
        paragraphs: [
          rich(
            emphasis(
              '[Enter a description of the accessibility arrangements in the physical offices / branches of your site’s organization or business. The description can include all current accessibility arrangements - starting from the beginning of the service (e.g., the parking lot and / or public transportation stations) to the end (such as the service desk, restaurant table, classroom etc.). It is also required to specify any additional accessibility arrangements, such as disabled services and their location, and accessibility accessories (e.g. in audio inductions and elevators) available for use]',
            ),
          ),
        ],
      },
      {
        heading: 'Requests, issues, and suggestions',
        paragraphs: [
          'If you find an accessibility issue on the site, or if you require further assistance, you are welcome to contact us through the organization’s accessibility coordinator:',
        ],
        items: [
          rich(emphasis('[Name of the accessibility coordinator]')),
          rich(emphasis('[Telephone number of the accessibility coordinator]')),
          rich(emphasis('[Email address of the accessibility coordinator]')),
          rich(emphasis('[Enter any additional contact details if relevant / available]')),
        ],
      },
    ],
  },
  hi: {
    notice: [
      'निम्नलिखित टेम्पलेट का उद्देश्य आपका सुलभता वक्तव्य लिखने में आपकी सहायता करना है। कृपया ध्यान दें कि यह सुनिश्चित करना आपकी जिम्मेदारी है कि आपकी साइट का वक्तव्य आपके क्षेत्र या प्रदेश के स्थानीय कानून की आवश्यकताओं को पूरा करता हो।',
      rich(
        emphasis(
          'नोट: इस पृष्ठ पर वर्तमान में दो खंड हैं। नीचे दिए गए सुलभता वक्तव्य का संपादन पूरा करने के बाद आपको यह खंड हटाना होगा।',
        ),
      ),
      rich(
        text('इस विषय में अधिक जानकारी के लिए हमारा लेख “'),
        link('सुलभता: अपनी साइट पर सुलभता वक्तव्य जोड़ना', accessibilityArticle),
        text('” पढ़ें।'),
      ),
    ],
    introduction: [
      rich(text('यह वक्तव्य अंतिम बार '), emphasis('[संबंधित तारीख दर्ज करें]'), text(' को अपडेट किया गया था।')),
      rich(
        text('हम '),
        emphasis('[संगठन / व्यवसाय का नाम दर्ज करें]'),
        text(' में अपनी साइट '),
        emphasis('[साइट का नाम और पता दर्ज करें]'),
        text(' को दिव्यांग लोगों के लिए सुलभ बनाने पर काम कर रहे हैं।'),
      ),
    ],
    sections: [
      {
        heading: 'वेब सुलभता क्या है',
        paragraphs: [
          'एक सुलभ साइट दिव्यांग आगंतुकों को अन्य आगंतुकों के समान या लगभग समान सहजता और आनंद के साथ साइट देखने की सुविधा देती है। यह उस प्रणाली की क्षमताओं, जिस पर साइट संचालित होती है, और सहायक तकनीकों के माध्यम से प्राप्त किया जा सकता है।',
        ],
      },
      {
        heading: 'इस साइट पर सुलभता संबंधी समायोजन',
        paragraphs: [
          rich(
            text('हमने इस साइट को WCAG '),
            emphasis('[2.0 / 2.1 / 2.2 - संबंधित विकल्प चुनें]'),
            text(' दिशानिर्देशों के अनुसार अनुकूलित किया है और साइट को '),
            emphasis('[A / AA / AAA - संबंधित विकल्प चुनें]'),
            text(' स्तर तक सुलभ बनाया है। इस साइट की सामग्री को स्क्रीन रीडर और कीबोर्ड उपयोग जैसी सहायक तकनीकों के साथ काम करने के लिए अनुकूलित किया गया है। इस प्रयास के अंतर्गत हमने '),
            emphasis('[अप्रासंगिक जानकारी हटाएँ]:'),
          ),
        ],
        items: [
          'संभावित सुलभता समस्याओं को खोजने और ठीक करने के लिए Accessibility Wizard का उपयोग किया',
          'साइट की भाषा निर्धारित की',
          'साइट के पृष्ठों की सामग्री का क्रम निर्धारित किया',
          'साइट के सभी पृष्ठों पर स्पष्ट शीर्षक संरचनाएँ निर्धारित कीं',
          'चित्रों में वैकल्पिक पाठ जोड़ा',
          'आवश्यक रंग कंट्रास्ट पूरा करने वाले रंग संयोजन लागू किए',
          'साइट पर गति और एनीमेशन का उपयोग कम किया',
          'सुनिश्चित किया कि साइट के सभी वीडियो, ऑडियो और फ़ाइलें सुलभ हों',
        ],
      },
      {
        heading:
          'तृतीय-पक्ष सामग्री के कारण मानक के आंशिक अनुपालन की घोषणा [केवल प्रासंगिक होने पर जोड़ें]',
        paragraphs: [
          rich(
            text('साइट के कुछ पृष्ठों की सुलभता ऐसी सामग्री पर निर्भर करती है जो संगठन की नहीं है, बल्कि '),
            emphasis('[संबंधित तीसरे पक्ष का नाम दर्ज करें]'),
            text(' की है। इससे प्रभावित पृष्ठ हैं: '),
            emphasis('[पृष्ठों के URL सूचीबद्ध करें]'),
            text('। इसलिए हम इन पृष्ठों के लिए मानक के आंशिक अनुपालन की घोषणा करते हैं।'),
          ),
        ],
      },
      {
        heading: 'संगठन में सुलभता व्यवस्थाएँ [केवल प्रासंगिक होने पर जोड़ें]',
        paragraphs: [
          rich(
            emphasis(
              '[अपनी साइट के संगठन या व्यवसाय के भौतिक कार्यालयों / शाखाओं में उपलब्ध सुलभता व्यवस्थाओं का विवरण दर्ज करें। विवरण में सेवा की शुरुआत (जैसे पार्किंग स्थल और / या सार्वजनिक परिवहन स्टेशन) से लेकर सेवा के अंत (जैसे सेवा डेस्क, रेस्तराँ की मेज़, कक्षा आदि) तक की सभी वर्तमान व्यवस्थाएँ शामिल हो सकती हैं। किसी भी अतिरिक्त व्यवस्था, जैसे दिव्यांग सेवाएँ और उनका स्थान तथा उपयोग के लिए उपलब्ध सुलभता उपकरण (जैसे ऑडियो इंडक्शन और लिफ्ट), का उल्लेख करना भी आवश्यक है।]',
            ),
          ),
        ],
      },
      {
        heading: 'अनुरोध, समस्याएँ और सुझाव',
        paragraphs: [
          'यदि आपको साइट पर कोई सुलभता समस्या मिलती है या आपको अतिरिक्त सहायता की आवश्यकता है, तो आप संगठन के सुलभता समन्वयक से संपर्क कर सकते हैं:',
        ],
        items: [
          rich(emphasis('[सुलभता समन्वयक का नाम]')),
          rich(emphasis('[सुलभता समन्वयक का टेलीफ़ोन नंबर]')),
          rich(emphasis('[सुलभता समन्वयक का ईमेल पता]')),
          rich(emphasis('[प्रासंगिक / उपलब्ध होने पर अतिरिक्त संपर्क विवरण दर्ज करें]')),
        ],
      },
    ],
  },
}
