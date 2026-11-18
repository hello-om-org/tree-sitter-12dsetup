// 12d Model setup files: toolbars.4d, fonts.4d, textstyl.4d, symbols.4d, linestyl.4d, colours.4d, plotters.4d, pmf.4d,
// sheets.4d, usermenu.4d, userkeys.4d, gui.4d and the like (the 12d Reference Manual, chapter 33).
//
// They are line-oriented text files in a few shapes that share one vocabulary:
//   Toolbar "Quick Access" {          a block: a word, arguments, '{' ... '}', and blocks nest
//     Button "New Project" {
//       Command "12d Model Open Create"        a command: a word, then arguments
//       Icon "Project_New.bmp"
//     }
//   }
//   30 155 0 9 "dark_green" 9 -9006 "12d"      a row that starts with a value (colours.4d, sheets.4d, pen tables)
//   default_weight 0.250                       a setting
//   #include_silent "user_toolbars.4d"         a preprocessor line
//   // comment
//
// The grammar is deliberately loose about arguments (words, numbers, strings, groups and punctuation in any order):
// 12d checks the files, this only has to colour and outline them.

module.exports = grammar({
  name: 'om_12dsetup',

  extras: $ => [/[ \t\r\f]+/, $.line_comment, $.block_comment],

  // a command followed by '{' on the next line is the start of a block
  conflicts: $ => [[$.block, $.command]],

  rules: {
    source_file: $ => seq(optional($._line), repeat(seq($._newline, optional($._line)))),

    _line: $ => choice($.block, $.preproc, $.command, $.row),

    // Toolbar "Quick Access" {  ...  }        pen_mapping {  ...  }        font "Arial" { stroke_file "X.SHX" }
    block: $ => seq(
      field('name', $.word), repeat($._arg), optional($._newline), '{',
      optional($._body_line), repeat(seq($._newline, optional($._body_line))),
      '}',
    ),
    _body_line: $ => choice($.block, $.preproc, $.command, $.row),

    // #include_silent "user_toolbars.4d"     #include "x.4d"
    preproc: $ => seq('#', field('name', $.word), repeat($._arg)),

    // Command "Project_Save"      default_weight 0.250
    command: $ => seq(field('name', $.word), repeat($._arg)),

    // 30 155 0 9 "dark_green" 9 -9006 "12d"       "A4 LASER" 287 185
    row: $ => seq(choice($.number, $.string, $.punctuation), repeat($._arg)),


    _arg: $ => choice($.word, $.number, $.string, $.group, $.punctuation),

    group: $ => seq('(', repeat($._arg), ')'),

    // Words may hold digits and the odd dot or dash that 12d allows in names (e.g. 12d_Model, Project_New.bmp)
    word: _ => /[A-Za-z_][A-Za-z0-9_]*/,

    number: _ => token(seq(optional('-'), /\d+(\.\d*)?|\.\d+/, optional(/[eE][+-]?\d+/))),

    string: $ => seq('"', repeat(choice($.string_content, $.escape_sequence)), '"'),
    string_content: _ => token.immediate(prec(1, /[^"\\\r\n]+/)),
    escape_sequence: _ => token.immediate(/\\./),

    punctuation: _ => token(/[<>;,:*?\/\\+\-!%^&|~.=\[\]$@#'`]/),

    line_comment: _ => token(seq('//', /[^\r\n]*/)),
    block_comment: _ => token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')),

    _newline: _ => /\r?\n/,
  },
});
