# base9-vscode

Base8 Color theme for vscode.

## How to use

* Set color theme to base9.
* To change color, go to `base9.palette` setting.
* For more info on how to pick colors, go to
[base9 website](https://base9-theme.github.io/about) or any color picker
website and paste in 9 colors in correct format.

## Contribute

The most important file is `src/base9.mustache.yml` which is a base9 template
for vscode color theme file.

Go to https://base9-theme.github.io/about for more info on how base9 template
works.

Go to https://code.visualstudio.com/api/references/theme-color for more info on
what each property does.

If a value is commented out, it means I don't know what it's used for, or didn't
have time to work on it yet. It's what I most need from contributers the most.

The file should include all possible keys supported by vscode. If a value is
missing, please add them.

Feel free to add documentation on how a value works if it's not obvious.

All `null` values should have document on what it's default or why it's `null`.

### Todos
Editor related:
- editor
- peek view
- snippet
- matching bracket

Others:
- merge conflict
- debug
- test
- other editor widget
- chart

### Todos but should look ok already.
- welcome screen