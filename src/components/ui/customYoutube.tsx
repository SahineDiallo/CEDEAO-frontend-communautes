import { Node } from '@tiptap/core';

const CustomYouTube = Node.create({
  name: 'youtube',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-youtube]',
        getAttrs: (dom) => ({
          src: dom.getAttribute('data-youtube'),
        }),
      },
    ];
  },

  renderHTML({ node }) {
    return [
      'div',
      {
        'data-youtube': node.attrs.src,
        class: 'youtube-embed',
      },
      [
        'iframe',
        {
          src: node.attrs.src,
          frameborder: 0,
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          allowfullscreen: true,
        },
      ],
    ];
  },

  addCommands() {
    return {
      setYoutubeVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

export default CustomYouTube;