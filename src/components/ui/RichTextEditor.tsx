import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Quote,
  Minus,
  Paperclip,
} from 'lucide-react';
import '../ui/richtext.css';
import { toast } from 'react-toastify';

// Custom Image Extension
const CustomImage = Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      id: {
        default: null,
      },
    };
  },
});

export interface Upload {
  id: string; // Identifiant unique pour chaque upload
  file: File; // Fichier en cours d'upload
  progress: number; // Progression de l'upload (0 à 100)
  fileName: string; // Nom du fichier
}

interface RichTextEditorProps {
  content: string; // Le contenu de l'éditeur (HTML string)
  onChange: (content: string) => void; // Callback pour les changements de contenu
  onTempFileUpload?: (tempFilePath: string) => void; // Callback pour les uploads de fichiers temporaires
  textOnly?: boolean; // Mode texte uniquement (optionnel)
  onUploadsChange?: (uploads: Upload[]) => void; // Nouveau callback pour transmettre les uploads au parent
}

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange, 
  onTempFileUpload, 
  textOnly = false,
  onUploadsChange
}) => {
  const domain = import.meta.env.VITE_MAIN_DOMAIN; // Domaine pour les uploads
  const [uploads, setUploads] = useState<Upload[]>([]); // État pour gérer les uploads en cours

  // Utiliser useEffect pour notifier le parent des changements dans les uploads
  useEffect(() => {
    if (onUploadsChange) {
      onUploadsChange(uploads);
    }
  }, [uploads, onUploadsChange]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      CustomImage,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        validate: (href) => {
          return /^https?:\/\//.test(href);
        },
      }),
      Youtube.configure({
        inline: true,
        controls: true,
        width: 640,
        height: 480,
        nocookie: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc',
      },
      handlePaste: (view, event: ClipboardEvent) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;
        const items = clipboardData.items;
        for (const item of items) {
          if (item.type.indexOf('image') === 0) {
            const file = item.getAsFile();
            if (file) {
              if (file.size > MAX_FILE_SIZE) {
                toast.error(`La taille du fichier dépasse la limite autorisée de 25 Mo. Votre fichier fait ${(file.size / (1024 * 1024)).toFixed(2)} Mo`
);
                return true;
              }
              handleFileUpload(file, view.state.selection.anchor);
              return true;
            }
            return true;
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          const file = files[0];
          if (file.type.indexOf('image') === 0) {
            if (file.size > MAX_FILE_SIZE) {
              toast.error(`La taille du fichier dépasse la limite autorisée de 25 Mo. Votre fichier fait ${(file.size / (1024 * 1024)).toFixed(2)} Mo`);
              return true;
            }
            handleFileUpload(file, view.state.selection.anchor);
            return true;
          }
        }
        return false;
      },
    },
  });

  const handleFileUpload = (file: File, position: number) => {
    // Check file size before proceeding
    if (file.size > MAX_FILE_SIZE) {
      // Show toast error (assuming you have a toast function available)
      toast.error(`La taille du fichier dépasse la limite autorisée de 25 Mo. Votre fichier fait ${(file.size / (1024 * 1024)).toFixed(2)} Mo`);
      return;
    }

    const uploadId = Date.now().toString();
    const newUpload: Upload = {
      id: uploadId,
      file,
      progress: 0,
      fileName: file.name
    };
  
    setUploads((prevUploads) => [...prevUploads, newUpload]);
  
    const formData = new FormData();
    formData.append('file', file);
  
    const xhr = new XMLHttpRequest();
  
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploads((prevUploads) =>
          prevUploads.map((upload) =>
            upload.id === uploadId ? { ...upload, progress } : upload
          )
        );
      }
    });
  
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        const tempFilePath = data.fileUrl;
        const fileName = data.fileName;
        const fileId = data.fichierId;
  
        if (onTempFileUpload) {
          onTempFileUpload(fileId);
        }
  
        if (file.type.startsWith('image/')) {
          editor
            ?.chain()
            .insertContentAt(position, {
              type: 'image',
              attrs: {
                id: 'uploadIMG',
                class: 'uploadIMG',
                src: tempFilePath,
              },
            })
            .focus()
            .run();
        } else {
          editor
            ?.chain()
            .insertContentAt(position, {
              type: 'text',
              text: fileName,
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: tempFilePath,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  },
                },
              ],
            })
            .focus()
            .run();
        }
      } else {
        console.error('Failed to upload file:', xhr.statusText);
        toast.error('Failed to upload file');
      }
  
      setUploads((prevUploads) => prevUploads.filter((upload) => upload.id !== uploadId));
    };
  
    xhr.onerror = () => {
      console.error('Error uploading file:', xhr.statusText);
      toast.error('Error uploading file');
      setUploads((prevUploads) => prevUploads.filter((upload) => upload.id !== uploadId));
    };
  
    xhr.open('POST', `${domain}/api/upload-file/`, true);
    xhr.send(formData);
  };

  const handleImageUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File size exceeds the limit of 25MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
          return;
        }
        handleFileUpload(file, editor?.state.selection.anchor || 0);
      }
    };
    input.click();
  };

  const handleFileUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File size exceeds the limit of 25MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
          return;
        }
        handleFileUpload(file, editor?.state.selection.anchor || 0);
      }
    };
    input.click();
  };

  const addYoutubeVideo = () => {
    const url = prompt('Veuillez entrer le lien YouTube');
    if (url) {
      const videoId = extractYoutubeId(url);
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        editor?.chain().focus().setYoutubeVideo({ src: embedUrl }).run();
      } else {
        alert('Lien YouTube invalide. Veuillez réessayer.');
      }
    }
  };

  function extractYoutubeId(url: string): string {
    const videoIdMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return videoIdMatch ? videoIdMatch[1] : '';
  }

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    const validUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;

    if (!/^https?:\/\/\S+$/.test(validUrl)) {
      alert('Veuillez entrer une URL valide.');
      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: validUrl })
      .run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="rich-text-editor">
      {/* Toolbar */}
      <div className="toolbar sticky top-0 bg-white shadow-md p-2 z-50 flex gap-2">

        {/* Boutons de formatage de texte */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'is-active' : ''}
        >
          <Bold size={20} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'is-active' : ''}
        >
          <Italic size={20} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={editor?.isActive('underline') ? 'is-active' : ''}
        >
          <UnderlineIcon size={20} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={editor?.isActive('strike') ? 'is-active' : ''}
        >
          <Strikethrough size={20} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleCode().run()}
          className={editor?.isActive('code') ? 'is-active' : ''}
        >
          <Code size={20} />
        </button>

        {/* Boutons pour les titres */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor?.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          <Heading1 size={20} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          <Heading2 size={20} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          <Heading3 size={20} />
        </button>

        {/* Boutons pour les listes */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive('bulletList') ? 'is-active' : ''}
        >
          <List size={20} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive('orderedList') ? 'is-active' : ''}
        >
          <ListOrdered size={20} />
        </button>

        {/* Boutons pour les liens et images */}
        <button type="button" onClick={setLink}>
          <LinkIcon size={20} />
        </button>
        {!textOnly && (
          <>
            <button type="button" onClick={handleImageUploadClick} disabled={uploads.length > 0}>
              <ImageIcon size={20} />
            </button>
            <button type="button" onClick={addYoutubeVideo}>
              <YoutubeIcon size={20} />
            </button>
          </>
        )}

        {/* Bouton pour les fichiers */}
        <button type="button" onClick={handleFileUploadClick} disabled={uploads.length > 0}>
          <Paperclip size={20} />
        </button>

        {/* Bouton pour les citations */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={editor?.isActive('blockquote') ? 'is-active' : ''}
        >
          <Quote size={20} />
        </button>

        {/* Bouton pour la ligne horizontale */}
        <button type="button" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
          <Minus size={20} />
        </button>
      </div>

      {/* Contenu de l'éditeur */}
      <div className="editor-content prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc max-h-[400px] overflow-auto border p-2">
  <EditorContent editor={editor} />
</div>

    </div>
  );
};

export default RichTextEditor;