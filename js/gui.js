const {remote} = require('electron');
const {Menu, MenuItem, dialog} = remote;
var fs = require('fs');

var extRe = /(?:\.([^.]+))?$/;

document.addEventListener("keydown", function (e) {
	if (e.which === 123) {
		remote.getCurrentWindow().toggleDevTools();
	}
});

var currentDocument = 'untitled';
var saved = false;

var updateTitle = function(focusedWindow) {
  focusedWindow.setTitle('enojpad- ' + currentDocument + (saved?'':'*'));
}

var saveFile = function(filename, cb) {
  fs.writeFile(filename, editor.getValue(), function(err) {
    if (err) {
      alert(err);
    }
    saved = true;
    currentDocument = filename;
    cb();
  });
}

var saveFileAs = function(cb) {
  dialog.showSaveDialog(function(filename) {
    saveFile(filename, cb);
  });
}

var openFile = function(filename, cb) {
	fs.readFile(filename, function(err, data) {
		if (err) {
			alert(err);
		}
		currentDocument = filename;
		editor.setValue(data.toString());
		var ext = extRe.exec(currentDocument)[1];
		if (ext == 'lua') editor.session.setMode(new mode_lua());
		else if (ext == 'coffee') editor.session.setMode(new mode_coffee())
		else if (ext == 'css') editor.session.setMode(new mode_css());
		else if (ext == 'fp' || ext == 'vp' || ext == 'gp' || ext == 'cp') editor.session.setMode(new mode_());
		else if (ext == 'html') editor.session.setMode(new mode_html());
		else if (ext == 'jade') editor.session.setMode(new mode_jade());
		else if (ext == 'ejs') editor.session.setMode(new mode_ejs());
		else if (ext == 'js') editor.session.setMode(new mode_javascript());
		else if (ext == 'json') editor.session.setMode(new mode_json());
		else if (ext == 'lisp' || ext == 'cl') editor.session.setMode(new mode_lisp());
		else if (ext == 'mk') editor.session.setMode(new mode_makefile());
		else if (ext == 'md') editor.session.setMode(new mode_markdown());
		else if (ext == 'pas') editor.session.setMode(new mode_pascal());
		else if (ext == 'py') editor.session.setMode(new mode_python());
		else if (ext == 'ps1') editor.session.setMode(new mode_powershell());
		else if (ext == 'rb') editor.session.setMode(new mode_ruby());
		else if (ext == 'xml') editor.session.setMode(new mode_xml());
		else editor.session.setMode(new mode_plain_text());
		cb();
	});
}

if (remote.process.argv[1] != undefined && remote.process.argv[1] != '.') {
	openFile(remote.process.argv[1], function() {
		updateTitle(focusedWindow);
	});
}

document.addEventListener('dragover',function(event){
  event.preventDefault();
  return false;
},false);

document.addEventListener('drop',function(event){
  event.preventDefault();
  return false;
},false);

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click(item, focusedWindow) {
          if (focusedWindow) {
            currentDocument = 'untitled';
            editor.setValue('');
            updateTitle(focusedWindow);
          }
        }
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click(item, focusedWindow) {
          if (focusedWindow) {
            dialog.showOpenDialog({
              properties: ['openFile', 'createDirectory']
            }, function(filename) {
              openFile(filename[0], function() {
								updateTitle(focusedWindow);
              });
            });
          }
        }
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click(item, focusedWindow) {
          if (focusedWindow) {
            if (currentDocument == 'untitled') {
              saveFileAs(function() {
                updateTitle(focusedWindow);
              })
            } else {
              saveFile(currentDocument, function() {
                updateTitle(focusedWindow);
              })
            }
          }
        }
      },
      {
        label: 'Save as',
        accelerator: 'Shift+CmdOrCtrl+S',
        click(item, focusedWindow) {
          if (focusedWindow) {
            saveFileAs(function() {
              updateTitle(focusedWindow);
            })
          }
        }
      },
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      },
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Full Screen',
        accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
        click(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      },
			{
				label: 'Theme',
				submenu: [
					{
						label: 'default',
						click(item, focusedWindow) {
		          editor.setTheme("ace/theme/github");
		        }
					},
					{
						label: 'monokai',
						click(item, focusedWindow) {
		          editor.setTheme("ace/theme/monokai");
		        }
					},
					{
						label: 'solarized dark',
						click(item, focusedWindow) {
		          editor.setTheme("ace/theme/solarized_dark");
		        }
					},
					{
						label: 'cobalt',
						click(item, focusedWindow) {
		          editor.setTheme("ace/theme/cobalt");
		        }
					},
					{
						label: 'xcode',
						click(item, focusedWindow) {
		          editor.setTheme("ace/theme/xcode");
		        }
					},
				]
			}
    ]
  },
  {
    label: 'Language',
    submenu: [
      {
        label: 'Plain text',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_plain_text());
        }
      },
			{
        label: 'Lua',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_lua());
        }
      },
			{
        label: 'Coffee',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_coffee());
        }
      },
			{
        label: 'CSS',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_css());
        }
      },
			{
        label: 'GLSL',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_glsl());
        }
      },
			{
        label: 'Haskell',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_haskell());
        }
      },
			{
        label: 'HTML',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_html());
        }
      },
			{
        label: 'Jade',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_jade());
        }
      },
			{
        label: 'EJS',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_ejs());
        }
      },
			{
        label: 'Javascript',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_javascript());
        }
      },
			{
        label: 'JSON',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_json());
        }
      },
			{
        label: 'Lisp',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_lisp());
        }
      },
			{
        label: 'MakeFile',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_makefile());
        }
      },
			{
        label: 'Markdown',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_markdown());
        }
      },
			{
        label: 'Pascal',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_pascal());
        }
      },
			{
        label: 'Python',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_python());
        }
      },
			{
        label: 'PowerShell',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_powershell());
        }
      },
			{
        label: 'Ruby',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_ruby());
        }
      },
			{
        label: 'XML',
        click(item, focusedWindow) {
					editor.session.setMode(new mode_xml());
        }
      },
    ]
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
    ]
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
