# Yank Note

A **hackable** markdown note application for programmers

> The App Store version does not have "open in browser" and "terminal" functions due to sandbox restrictions. If you need to use these two functions, please visit https://github.com/purocean/yn to download the full functional version.

[![Download](./help/mas_en.svg?.inline)](https://apps.apple.com/cn/app/yank-note/id1551528618)

English | [中文说明](./README_ZH-CN.md)

[toc]{level: [2]}

![Screenshot](./help/1.png)

## Highlights

- **Easy to use:** Use *Monaco* kernel, optimize for Markdown editing, and have the same editing experience as VSCode.
- **Powerful:** Support version control; Applets, runnable code blocks, tables, Plantuml, Drawio, macro replacements, etc., can be embedded in the document.
- **High compatibility:** Data is saved as local Markdown files, and the extension functions are implemented in the original syntax of Markdown as far as possible.
- **Plug-in extension:** Support users to write their own plug-ins to expand the functionality of the editor.
- **Encryption supported:** Use encryption to save private files such as account number, and the password can be set separately for each file.

## Attention

- The encryption and decryption of encrypted files are both completed at the front end. Please **be sure to remember your password**. Once the password is lost, it can only be cracked violently.

## Characteristic functions

For more information on how to use the following functions, please see [characteristic functions description](./help/FEATURES.md)

- **Sync scrolling:** the editing area and the preview area scroll synchronously, and the preview area can be scrolled independently
- **Outline:** quickly jump to the corresponding location of the document through the directory outline in the preview area
- **Version Control:** Support backtracking document history versions
- **Encryption:** files ending with `.c.md` are treated as encrypted files
- **Auto-save:** automatically save files after editing, with orange title bar reminder for unsaved files (encrypted documents are not automatically saved)
- **Editing:** automatic completion of list
- **Paste images:** you can quickly paste pictures from the clipboard and insert them as files or Base64
- **Embed attachments:** you can add attachments to the document and click to open them in the operating system.
- **Code running:** support to run JavaScript, PHP, nodejs, Python, bash code
- **To-do list:** support to display the to-do progress in the document. Click to quickly switch the to-do status.
- **Quickly Open:** you can use shortcut key to open the file switch panel to quickly open files, tagged files, and full-text search for file contents.
- **Katex:** support katex expression
- **Style:** Markdown uses GitHub styles and features
- **Repository:** multiple data locations can be defined for document classification
- **External link conversion:** convert external link or Base64 pictures into local pictures
- HTML resolving：you can use HTML code directly in the document, or use shortcut keys to copy and paste HTML to Markdown
- **Multiple formats export:** the backend uses pandoc as converter
- **TOC:** write `[toc]{type:** "ol", level:** [1,2,3]}` to generate TOC where you need to generate a directory
- **Edit table cell:** double-click a table cell to quickly edit
- **Copy title link:** copy title link path to the clipboard for easy insertion into other files
- **Embedded Applets:** document supports embedded HTML Applets
- **Embed Plantuml graphics:** you need to install Java and graphviz
- **Embed drawio graphics:** document supports embedded drawio graphics
- **Embed ECharts graphics:** document supports embeded Echarts graphics
- **Embed Mermaid graphics:** document supports embeded Mermaid graphics
- **Embed Luckysheet tables:** document supports embeded Luckysheet tables
- **Mind map:** nested list can be displayed in the form of a mind map
- **Element attribute writing:** any attribute of an element can be customized
- **Table enhancement:** support table title with multiple lines of text, list and other features
- **Document link:** support to link other documents in the document and jump to each other
- **Footnote:** support writing footnotes in the document
- **Custom container:** support custom containers similar to VuePress default themes
- **Macro replacement:** support for embedded JavaScript expressions to dynamically replace document content
- **Image hosting service:** support [PicGo](https://picgo.github.io/PicGo-Doc/) image hosting service
- **Custom plug-ins:** support writing JavaScript plug-ins to expand editor functionality. The plug-in is placed in the `home directory/plugins`. Refer to [plug-in Development Guide](./help/PLUGIN.md)
