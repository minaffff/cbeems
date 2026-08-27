export type PolicySection = {
  heading: string
  paragraphs?: string[]
  items?: string[]
  links?: Array<{ label: string; href: string }>
}

export type PolicyDocument = {
  introduction: string[]
  sections: PolicySection[]
}

export const privacyPolicy: PolicyDocument = {
  introduction: [
    'This page provides general information about privacy practices for C-BEEMS. It is not legal advice and should be reviewed before the website begins collecting personal information.',
  ],
  sections: [
    {
      heading: 'A legal disclaimer',
      paragraphs: [
        'Privacy requirements vary by organisation, location and the information being handled. C-BEEMS is responsible for confirming which laws and obligations apply and for updating this policy when its services change.',
      ],
    },
    {
      heading: 'Privacy policy — the basics',
      paragraphs: [
        'A privacy policy explains how a website collects, uses, stores, shares and protects information supplied by visitors. It should also explain the choices available to visitors and how they can contact the organisation about privacy.',
      ],
    },
    {
      heading: 'Information this policy should cover',
      items: [
        'The types of personal and non-personal information collected and how it is collected.',
        'Why information is collected and how it is used.',
        'When information may be shared with service providers or other parties.',
        'How information is stored, retained and protected.',
        'How cookies and similar technologies are used.',
        'How visitors can access, correct or request deletion of their information.',
        'How policy updates and privacy enquiries will be handled.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [
        'For privacy questions, contact C-BEEMS at info@mysite.com or 123-456-7890.',
      ],
    },
  ],
}

export const accessibilityStatement: PolicyDocument = {
  introduction: [
    'C-BEEMS is working to make this website accessible to people with disabilities. This statement should be updated after a formal accessibility review and whenever material changes are made to the site.',
  ],
  sections: [
    {
      heading: 'What web accessibility is',
      paragraphs: [
        'An accessible website allows visitors with different abilities to use the same content with a comparable level of ease and independence, including with assistive technologies.',
      ],
    },
    {
      heading: 'Accessibility adjustments on this site',
      paragraphs: [
        'The site has been designed with semantic page structure, keyboard navigation, visible focus states, readable colour contrast, responsive layouts and descriptive labels. Video content should include captions or transcripts before final release.',
      ],
      items: [
        'The page language is identified for English and Hindi routes.',
        'Headings and navigation landmarks are used to organise content.',
        'Interactive controls are designed for keyboard and screen-reader use.',
        'Animations and automatic media playback are avoided.',
      ],
    },
    {
      heading: 'Partial compliance and third-party content',
      paragraphs: [
        'Some embedded media or linked third-party services may be outside C-BEEMS control. Any known limitations should be listed here after accessibility testing.',
      ],
    },
    {
      heading: 'Accessibility arrangements',
      paragraphs: [
        'Information about accessibility arrangements at any physical C-BEEMS location is not currently applicable and can be added if in-person services are introduced.',
      ],
    },
    {
      heading: 'Requests, issues and suggestions',
      paragraphs: [
        'If you encounter an accessibility issue or need content in another format, contact C-BEEMS using the details below.',
      ],
      items: ['Phone: 123-456-7890', 'Email: info@mysite.com'],
    },
  ],
}
