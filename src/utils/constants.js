export const MAXIMUM_IMAGE_SIZE = 2 * 1024 * 1024; //less than 2MB in bytes

export const NOTIFICATION_MESSAGES = {
  'contact-form-success': "Thanks for your message, we'll get back to you soon!",
}

export const LANGUAGE_OPTIONS = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
];

export const PAGE_TYPES = [
  { label: "Course Module", value: { type: "course_module", template: "course-module.js" } },
];

export const PERMANENT_PAGES = [
  "home",
]

export const CONTENT_MAP = {
  header: { type: "header", content: { text: "Header" } },
  subHeading: { type: "subHeading", content: { text: "Sub-heading" } },
  paragraph: { type: "paragraph", content: { text: "Paragraph" } },
  image: { type: "image" },
  imageCarousel: { type: "imageCarousel", content: {} },
  readings: { type: "readings", content: {} },
  embeddedIframe: { type: "embeddedIframe" },
  timeline: { type: "timeline", content: { alignment: "left" } },
  button: { type: "button", content: { anchor: "Button", link: "/" } },
  link: { type: "link", content: { anchor: "Link text", link: "/" } },
}

export const SECTION_MAP = {
  default: { content: [] },
  read: {
    type: "read",
    content: [
      { type: "subHeading", content: { text: "Read" }},
      { type: "paragraph", content: { text: "<p>Section introduction</p>" }},
      { type: "readings", content: {} }
    ]
  },
  engage: {
    type: "engage",
    content: [
      { type: "subHeading", content: { text: "Engage & Discuss" }},
      { type: "questions", content: {} }
    ]
  },
  listen: {
    type: "listen",
    content: [
      { type: "subHeading", content: { text: "Listen" }},
      { type: "podcasts", content: {} }
    ]
  },
}