# tree-sitter-12dsetup

A [tree-sitter](https://tree-sitter.github.io) grammar for **12d Model setup files**: `toolbars.4d`, `fonts.4d`,
`textstyl.4d`, `symbols.4d`, `linestyl.4d`, `colours.4d`, `plotters.4d`, `pmf.4d`, `sheets.4d`, `userkeys.4d`,
`usermenu.4d` and the like (12d Reference Manual, chapter 33). Used by the [12dpl Zed extension](https://github.com/hello-om-org/12dpl).

These files are line-oriented text in a few shapes that share one vocabulary: blocks (`Toolbar "x" { ... }`, nested, the
`{` may be on the next line, and a one-line block is allowed), commands (`Command "Project_Save"`), rows that start with a
value (`30 155 0 9 "dark_green" ...`), `#include_silent "file"` lines and `//` and `/* */` comments. The grammar is
deliberately loose about arguments: 12d checks the files, this only has to colour and outline them.

## Coverage

Parsed cleanly: **51 of the 54 text setup files** in a 12d Model 15 `set_ups` folder. The failures are source oddities:
a string that runs over several lines (`digitize_error.4d`), a stray quote (`mapinfo.4d`) and `}worldstyle X {` on one line
(`linestyl.4d`). 17 other `.4d` files there are XML (`names.4d`, `textstyle_names.4d`, `drainage.4d`, ...) and are not
this grammar's job.

12d writes some of these files as UTF-16 (for example `fonts.4d`); the parser needs UTF-8, so the editor must decode.

## Licence

MIT, see LICENSE. Independent project: not made by, affiliated with or endorsed by 12d Solutions.
