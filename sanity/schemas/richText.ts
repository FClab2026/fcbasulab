// Shared Portable Text definition used by every `body` field across schemas.
// Editors get a WYSIWYG toolbar in Studio (bold, italic, links, lists, headings).
export const richTextBody = {
  type: 'array' as const,
  of: [
    {
      type: 'block' as const,
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
          {title: 'Underline', value: 'underline'},
          {title: 'Strike', value: 'strike-through'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object' as const,
            title: 'Link',
            fields: [
              {name: 'href', type: 'url' as const, title: 'URL'},
              {
                name: 'blank',
                type: 'boolean' as const,
                title: 'Open in new tab',
                initialValue: true,
              },
            ],
          },
        ],
      },
    },
  ],
}
