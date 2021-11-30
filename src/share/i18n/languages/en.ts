/* eslint-disable quote-props */

const data = {
  'app-name': 'Yank Note',
  'slogan': 'A Hackable Markdown editor for developers',
  'cancel': 'Cancel',
  'ok': 'OK',
  'demo-tips': 'Some features are not available in DEMO mode.',
  'blank-page': 'Blank',
  'copied': 'Copied',
  'insert-different-repo-doc': 'Documents from different repository cannot be inserted',
  'need-clipboard-permission': 'Please grant clipboard permissions',
  'click-to-copy': 'Click to copy',
  'click-to-copy-link': 'Click to copy link',
  'copy-code': 'Copy code',
  'loading': 'Loading',
  'add-image': 'Add Image',
  'exit-presentation-msg': 'Press the Esc key to exit',
  'reload': 'Reload',
  'open-in-new-window': 'New Window',
  'view-figure': 'View Figure',
  'export': 'Export',
  'no-password': 'No password was entered',
  'save': 'Save',
  'close': 'Close',
  'edit': 'Edit',
  'premium': {
    'need-purchase': '[%s] Premium is required',
    'buy-license': 'Buy License',
    'free': 'Free',
    'premium': 'Premium',
    'intro': {
      'intro': 'Intro',
      'current-plan': 'Current Plan',
      'included': 'Included',
      'desc': 'Yank Note is open-source, I\'ve been constantly updating it since 2018. It consumes my energy and money (such as the annual Apple developer account subscription). Now a paid premium version is available. If you need advanced features or want to support my development, you can buy a license.',
      'free-desc': 'For most users',
      'premium-desc': 'More features',
      'free-list': 'Basic Editing\nGraphic Embedding\nRun Code Snippet\nHTML Widgets\nEncryption\nIntegrated Terminal',
      'premium-list': 'Basic Editing\nGraphic Embedding\nRun Code Snippet\nHTML Widgets\nEncryption\nIntegrated Terminal\nMacro Replacement\nDark Mode',
    },
    'buy': {
      'ipa-buy': 'Buy %s',
      'ipa-restore': 'Restore Purchase',
      'buy': 'Buy',
      'step-1': '1. Pay and note "%s"',
      'step-2': '2. Send an email to me to get the license',
      'step-3': '3. Enter the license to activate the advanced features',
      'send-email': 'Send Email',
      'email-tips': 'Will be processed within 12 hours',
      'wechat': 'Wechat',
      'alipay': 'Alipay',
      'email': {
        'subject': 'Get Yank Note Premium License',
        'body': 'Code: %s\nProduct: %s\nName: <will appear on the license key>\nEmail: <will appear on the license key>\n\n-------------------------\n\n<other message>',
      },
    },
    'activation': {
      'license': 'License',
      'activation': 'Enter License',
      'placeholder': 'Enter license',
      'info': 'Activated',
      'name': 'Name: %s',
      'email': 'Email: %s',
      'expires': 'Expired at: %s',
      'hash': 'Hash: %s',
      'success': 'Success',
      'activating': 'Activating',
      'tips': 'If you have trouble, please contact me',
      'tips-email': 'Email',
      'tips-wechat': 'Wechat',
    },
  },
  'app': {
    'quit': 'Quit',
    'preferences': 'Preferences',
    'close-window': 'Close Window',
    'toggle-fullscreen': 'Toggle Full Screen',
    'tray': {
      'open-main-window': 'Open Main Window',
      'open-in-browser': 'Open in Browser',
      'open-main-dir': 'Open Main Dir',
      'preferences': 'Preferences',
      'start-at-login': 'Start at Login',
      'version': 'Version %s',
      'quit': 'Quit',
      'dev': {
        'dev': 'Develop',
        'port-prod': 'Prod Port (%s)',
        'port-dev': 'Dev port (%s)',
        'reload': 'Reload',
        'dev-tool': 'Develop Tool',
        'restart': 'Restart',
        'force-quit': 'Force Quit',
      }
    },
    'shortcut': {
      'error': {
        'title': 'Register Shortcut Failed',
        'desc': 'Conflict [%s]'
      },
    },
    'updater': {
      'found-dialog': {
        'title': 'Yank Note - Newer version was found',
        'desc': 'Current version: %s\nNewer version: %s',
        'buttons': {
          'download': 'Download',
          'view-changes': 'View Changes',
          'cancel': 'Cancel',
          'ignore': 'Don\'t Ask Again'
        }
      },
      'progress-bar': {
        'title': 'Yank Note - Download',
        'detail': 'Downloading %s',
        'failed': 'Download failed: %s'
      },
      'failed-dialog': {
        'title': 'Yank Note - Something went wrong',
      },
      'install-dialog': {
        'title': 'Yank Note - Download complete',
        'desc': 'Do you want to install it now?',
        'buttons': {
          'install': 'Install',
          'delay': 'Delay',
        }
      },
      'no-newer-dialog': {
        'title': 'Yank Note - No newer version',
        'desc': 'The current version is up-to-date'
      }
    },
  },
  'quit-check-dialog': {
    'title': 'Attention',
    'desc': 'The document has unsaved changes. Do you really want to quit without saving?',
    'buttons': {
      'cancel': 'Cancel',
      'discard': 'Discard Changes and exit',
    },
  },
  'file-status': {
    'unsaved': 'Unsaved',
    'saving': 'Saving',
    'saved': 'Saved',
    'save-failed': 'Save Failed!',
    'loaded': 'Loaded',
    'loading': 'Loading',
    'no-file': 'No open file'
  },
  'modal': {
    'info': 'Info',
    'input-placeholder': 'Please input...',
  },
  'document': {
    'current-path': 'Current Path: %s',
    'password-create': '[Create] Please enter a password',
    'password-save': '[Save] Please enter password of the file',
    'password-open': '[Open] Please enter password of the file',
    'wrong-password': 'Wrong Password',
    'file-transform-error': 'Encrypted and unencrypted files cannot be converted to each other',
    'create-dialog': {
      'title': 'Create a file (encrypted file ends with .c.md)',
      'hint': 'File name',
    },
    'create-dir-dialog': {
      'title': 'Create a Folder',
      'hint': 'Folder name',
    },
    'duplicate-dialog': {
      'title': 'Duplicate a File',
      'hint': 'Target path',
    },
    'delete-dialog': {
      'title': 'Delete a File',
      'content': 'Are you sure delete %s?'
    },
    'move-dialog': {
      'title': 'Move/Rename a File',
      'content': 'New path'
    },
    'save-encrypted-file-dialog': {
      'title': 'Attention',
      'content': 'The password doesn\'t match the old password, save it with the new password?',
    },
  },
  'status-bar': {
    'view': {
      'view': 'View',
      'show': 'Show ',
      'hide': 'Hide ',
      'xterm': 'Terminal',
      'preview': 'Preview',
      'editor': 'Editor',
      'side-bar': 'Side Bar',
      'toggle-wrap': 'Toggle Wrap'
    },
    'setting': 'Setting',
    'repo': {
      'repo': 'Repo: %s',
      'no-data': 'No Repo',
    },
    'nav': {
      'nav': 'Navigation',
      'goto': 'Goto',
      'forward': 'Forward',
      'back': 'Back',
    },
    'insert': {
      'insert': 'Insert',
      'paste-rft': 'Paste RTF',
      'paste-img-base64': 'Paste Image',
    },
    'tool': {
      'tool': 'Tool',
      'convert-img-link': 'Download Remote Image',
      'macro-copy-markdown': 'Copy Markdown after Macro Replacement'
    },
    'document-info': {
      'selected': 'Selected',
      'lines': 'Lines',
      'chars': 'Chars',
    },
    'help': {
      'help': 'Help',
      'readme': 'Introduction',
      'features': 'Features',
      'shortcuts': 'Shortcuts',
      'plugin': 'Create Plugin'
    },
    'rendering': {
      'rendering': 'Synchronous rendering - %s',
      'on': 'ON',
      'off': 'OFF',
      'refresh': 'Refresh'
    },
    'terminal': 'Terminal',
    'present': 'Present',
    'get': {
      'get-application': 'Get Application',
    }
  },
  'view': {
    'outline': 'Outline',
    'print': 'Print',
  },
  'tree': {
    'db-click-refresh': 'Double click to refresh',
    'add-repo': 'Add repository',
    'add-repo-hint': 'Choose a location to save your notes',
    'created-at': 'Created at: %s',
    'updated-at': 'Updated at: %s',
    'context-menu': {
      'mark': 'Mark File',
      'unmark': 'Unmark File',
      'duplicate': 'Duplicate',
      'create-doc': 'New File',
      'create-dir': 'New Folder',
      'rename': 'Rename / Move',
      'delete': 'Delete',
      'open-in-os': 'Open in OS',
      'refresh': 'Refresh',
      'open-in-terminal': 'Open in Terminal',
      'create-in-cd': 'New File',
      'copy-name': 'Copy Name',
      'copy-path': 'Copy Path',
    }
  },
  'tabs': {
    'close-others': 'Close Others',
    'close-right': 'Close to the Right',
    'close-left': 'Close to the Left',
    'close-all': 'Close All',
    'pin': 'Pin',
    'unpin': 'Unpin',
  },
  'export-panel': {
    'export': 'Export',
    'format': 'Format',
    'pdf': {
      'orientation': 'Orientation',
      'portrait': 'Portrait',
      'landscape': 'Landscape',
      'size': 'Size',
      'zoom': 'Zoom',
      'use-browser': 'The browser printing feature will be used.',
      'include-bg': 'Include background',
    },
    'use-html': 'Use the rendered HTML source',
    'use-markdown': 'Use markdown source',
    'loading': 'Converting, please wait...'
  },
  'title-bar': {
    'pin': 'Pin',
    'minimize': 'Minimize',
    'unmaximize': 'Unmaximize',
    'maximize': 'Maximize',
  },
  'setting-panel': {
    'setting': 'Setting',
    'add': 'Add %s',
    'delete-warning': 'Are you sure you want to remove this node?',
    'error-choose-repo-path': 'Please choose repository path',
    'schema': {
      'repos': {
        'repos': 'Repositories',
        'repo': 'Repository',
        'name': 'Name',
        'name-placeholder': 'Name',
        'path': 'Path',
        'path-placeholder': 'Please select the storage location'
      },
      'theme': 'Theme',
      'language': 'Language',
      'assets-dir': 'Image Dir',
      'assets-desc': 'Relative or absolute path (in document repository). Variables: docSlug, date.',
      'shell': 'Shell',
    }
  },
  'quick-open': {
    'input-placeholder': 'Type characters...',
    'empty': 'Empty',
    'files': 'Files',
    'search': 'Search',
    'marked': 'Marked',
  },
  'editor': {
    'context-menu': {
      'paste-image': 'Paste Image',
      'paste-image-as-base64': 'Paste Image as Base64',
      'paste-rtf-as-markdown': 'Paste RTF as Markdown',
      'add-attachment': 'Add Attachment',
      'add-doc': 'Add Document',
      'insert-date': 'Insert Today\'s Date',
      'insert-time': 'Insert Current Time',
    }
  },
  'picgo': {
    'setting': {
      'api-title': 'PicGo Api',
      'api-desc': 'PicGo default URL: http://127.0.0.1:36677/upload',
      'api-msg': 'Must starts with http://',
      'paste-title': 'Paste image with PicGo'
    },
    'uploading': 'Uploading',
    'upload-failed': 'Upload Failed',
    'need-api': 'Please configure PicGo Api first.'
  },
  'code-run': {
    'run': 'Run',
    'run-in-xterm-tips': 'Run code in terminal, %s + click do not exit',
    'run-in-xterm': 'Run in terminal',
    'running': 'Running...',
    'clear': 'Clear',
  },
  'drawio': {
    'adjust-height': 'Adjust Height',
  },
  'mind-map': {
    'zoom-in': 'Zoom In',
    'zoom-out': 'Zoom Out',
    'switch-layout': 'Switch Layout',
    'switch-loose': 'Compact/Loose',
    'convert-error': 'Conversion error\n    1. Please ensure that the outline has only one root item.\n    2. Please ensure that the outline level is correct.',
  },
  'table-cell-edit': {
    'esc-to-cancel': 'Press ESC to cancel',
    'db-click-edit': 'Double Click to Edit',
    'canceled': 'Canceled',
    'edit-hint': 'Content',
    'edit-title': 'Edit Cell',
    'edit-error': 'Something wrong',
    'limit-single-line': 'Editing only single lines',
  },
  'lucky-sheet': {
    'saved-at': 'Saved at',
    'edit-sheet': 'Edit Sheet',
    'create-dialog-title': 'Create Luckysheet File',
  },
  'markdown-link': {
    'convert-to-titled-link': 'Convert to Titled Link',
  },
}

export type BaseLanguage = typeof data

export default data
