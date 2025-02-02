import postcss from 'postcss';

var cloneRule = ((decl, dir) => {
  const rule = Object(decl.parent).type === 'rule' ? decl.parent.cloneBefore({
    raws: {}
  }).removeAll() : postcss.rule({
    selector: '&'
  });
  rule.assign({
    'selectors': rule.selectors.map(selector => `${selector}:dir(${dir})`)
  });
  return rule;
});

var cloneRuleSpecificity = (decl => {
  const rule = Object(decl.parent).type === 'rule' ? decl.parent.cloneBefore({
    raws: {}
  }).removeAll() : postcss.rule({
    selector: '&'
  });
  rule.assign({
    'selectors': rule.selectors.map(selector => `[dir] ${selector}`)
  });
  return rule;
});

const matchLogicalBorderSide = /^border-(block|block-start|block-end|inline|inline-start|inline-end)(-(width|style|color))?$/i;
var transformBorder = {
  // border-block
  'border-block': (decl, values, dir, preserve) => {
    decl.cloneBefore({
      prop: `border-top${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
      value: values[0]
    });
    decl.cloneBefore({
      prop: `border-bottom${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
      value: values[1] || values[0]
    });
    clean$8(decl, preserve);
  },
  // border-block-start
  'border-block-start': (decl, values, dir, preserve) => {
    decl.cloneBefore({
      prop: `border-top${decl.prop.replace(matchLogicalBorderSide, '$2')}`
    });
    clean$8(decl, preserve);
  },
  // border-block-end
  'border-block-end': (decl, values, dir, preserve) => {
    decl.cloneBefore({
      prop: `border-bottom${decl.prop.replace(matchLogicalBorderSide, '$2')}`
    });
    clean$8(decl, preserve);
  },
  // border-inline
  'border-inline': (decl, values, dir, preserve) => {
    const ltrDecls = () => {
      return [decl.cloneBefore({
        prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
        value: values[0]
      }), decl.cloneBefore({
        prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
        value: values[1] || values[0]
      })];
    };
    const rtlDecls = () => {
      return [decl.clone({
        prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
        value: values[0]
      }), decl.clone({
        prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
        value: values[1] || values[0]
      })];
    };
    const isLTR = 1 === values.length || 2 === values.length && values[0] === values[1];
    if (isLTR) {
      cloneRuleSpecificity(decl).append(ltrDecls());
      clean$8(decl, preserve);
      return;
    } else if (dir === 'ltr') {
      ltrDecls();
      clean$8(decl, preserve);
      return;
    } else if (dir === 'rtl') {
      rtlDecls();
      clean$8(decl, preserve);
      return;
    } else {
      cloneRule(decl, 'ltr').append(ltrDecls());
      cloneRule(decl, 'rtl').append(rtlDecls());
      clean$8(decl, preserve);
      return;
    }
  },
  // border-inline-start
  'border-inline-start': (decl, values, dir, preserve) => {
    const ltrDecl = () => {
      return decl.cloneBefore({
        prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`
      });
    };
    const rtlDecl = () => {
      return decl.cloneBefore({
        prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`
      });
    };
    if (dir === 'ltr') {
      ltrDecl();
      clean$8(decl, preserve);
      return;
    } else if (dir === 'rtl') {
      rtlDecl();
      clean$8(decl, preserve);
      return;
    } else {
      cloneRule(decl, 'ltr').append(ltrDecl());
      cloneRule(decl, 'rtl').append(rtlDecl());
      clean$8(decl, preserve);
      return;
    }
  },
  // border-inline-end
  'border-inline-end': (decl, values, dir, preserve) => {
    const ltrDecl = () => {
      return decl.cloneBefore({
        prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`
      });
    };
    const rtlDecl = () => {
      return decl.cloneBefore({
        prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`
      });
    };
    if (dir === 'ltr') {
      ltrDecl();
      clean$8(decl, preserve);
      return;
    } else if (dir === 'rtl') {
      rtlDecl();
      clean$8(decl, preserve);
      return;
    } else {
      cloneRule(decl, 'ltr').append(ltrDecl());
      cloneRule(decl, 'rtl').append(rtlDecl());
      clean$8(decl, preserve);
      return;
    }
  }
};
function clean$8(decl, preserve) {
  if (!preserve) decl.remove();
}

const logicalRadii = /^(border-)(end-end|end-start|start-end|start-start)(-radius)$/i;
const ltrRadii = {
  'end-end': 'bottom-right',
  'end-start': 'bottom-left',
  'start-end': 'top-right',
  'start-start': 'top-left'
};
const rtlRadii = {
  'end-end': 'bottom-left',
  'end-start': 'bottom-right',
  'start-end': 'top-left',
  'start-start': 'top-right'
};
var transformBorderRadius = ((decl, values, dir, preserve) => {
  if (dir === 'ltr') {
    lDecl$3(decl);
    clean$7(decl, preserve);
    return;
  }
  if (dir === 'rtl') {
    rDecl$3(decl);
    clean$7(decl, preserve);
    return;
  }
  cloneRule(decl, 'ltr').append(lDecl$3(decl));
  cloneRule(decl, 'rtl').append(rDecl$3(decl));
  clean$7(decl, preserve);
});
function lDecl$3(decl) {
  return decl.cloneBefore({
    prop: decl.prop.replace(logicalRadii, ($, prefix, direction, suffix) => `${prefix}${ltrRadii[direction]}${suffix}`)
  });
}
function rDecl$3(decl) {
  return decl.cloneBefore({
    prop: decl.prop.replace(logicalRadii, ($, prefix, direction, suffix) => `${prefix}${rtlRadii[direction]}${suffix}`)
  });
}
function clean$7(decl, preserve) {
  if (!preserve) decl.remove();
}

var reduceValues = (values => {
  const reducedValues = values.slice();

  // reduce [A, B, C, B] to [A, B, C]
  if (reducedValues.length === 4 && reducedValues[3] === reducedValues[1]) {
    reducedValues.pop();
  }

  // reduce [A, B, A] to [A, B]
  if (reducedValues.length === 3 && reducedValues[2] === reducedValues[0]) {
    reducedValues.pop();
  }

  // reduce [A, A] to [A]
  if (reducedValues.length === 2 && reducedValues[1] === reducedValues[0]) {
    reducedValues.pop();
  }
  return reducedValues;
});

var transformDirectionalShorthands = ((inlineTransform, prefix, postfix) => (decl, values, dir, preserve) => {
  if ('logical' !== values[0]) {
    const inlineStart = values[3] || values[1] || values[0];
    const inlineEnd = values[1] || values[0];
    const inlineValues = [inlineStart, inlineEnd].filter(Boolean);
    const inlineDecl = decl.cloneBefore({
      prop: `${prefix}-inline${postfix ? `-${postfix}` : ''}`,
      value: inlineValues.join(' ')
    });
    inlineTransform(inlineDecl, inlineValues, dir, false);
    return;
  }

  // get logical directions as all, inline, block-end, then inline-end
  const [, all, inline, blockEnd, inlineEnd] = values;

  // get left-to-right relative directions from logical directions as:
  // → top from all
  // → right from inline-end, inline, or all
  // → bottom from block-end, block, or all
  // → left from inline, or all
  const ltrValues = reduceValues([all, inlineEnd || inline || all, blockEnd || all, inline || all]);
  const ltrDecl = () => {
    return decl.cloneBefore({
      value: ltrValues.join(' ')
    });
  };

  // return the ltr values if the values are flow agnostic (where no second inline value was needed)
  const isFlowAgnostic = ltrValues.length < 4;
  if (isFlowAgnostic) {
    cloneRuleSpecificity(decl).append(ltrDecl());
    clean$6(decl, preserve);
    return;
  }
  if (dir === 'ltr') {
    ltrDecl();
    clean$6(decl, preserve);
    return;
  }

  // get right-to-left relative directions from logical directions as:
  // → top from all
  // → right from inline, or all
  // → bottom from block-end, block, or all
  // → left from inline-end, inline, or all
  const rtlValues = reduceValues([all, inline || all, blockEnd || all, inlineEnd || inline || all]);
  const rtlDecl = () => {
    return decl.cloneBefore({
      value: rtlValues.join(' ')
    });
  };
  if (dir === 'rtl') {
    rtlDecl();
    clean$6(decl, preserve);
    return;
  }
  cloneRule(decl, 'ltr').append(ltrDecl());
  cloneRule(decl, 'rtl').append(rtlDecl());
  clean$6(decl, preserve);
});
function clean$6(decl, preserve) {
  if (!preserve) decl.remove();
}

var transformFloat = ((decl, values, dir, preserve) => {
  if (/^inline-start$/i.test(decl.value)) {
    if (dir === 'ltr') {
      lDecl$2(decl);
      clean$5(decl, preserve);
      return;
    } else if (dir === 'rtl') {
      rDecl$2(decl);
      clean$5(decl, preserve);
      return;
    } else {
      cloneRule(decl, 'ltr').append(lDecl$2(decl));
      cloneRule(decl, 'rtl').append(rDecl$2(decl));
      clean$5(decl, preserve);
      return;
    }
  }
  if (/^inline-end$/i.test(decl.value)) {
    if (dir === 'ltr') {
      rDecl$2(decl);
      clean$5(decl, preserve);
      return;
    } else if (dir === 'rtl') {
      lDecl$2(decl);
      clean$5(decl, preserve);
      return;
    } else {
      cloneRule(decl, 'ltr').append(rDecl$2(decl));
      cloneRule(decl, 'rtl').append(lDecl$2(decl));
      clean$5(decl, preserve);
      return;
    }
  }
});
function lDecl$2(decl) {
  return decl.cloneBefore({
    value: 'left'
  });
}
function rDecl$2(decl) {
  return decl.cloneBefore({
    value: 'right'
  });
}
function clean$5(decl, preserve) {
  if (!preserve) decl.remove();
}

var transformInset = ((decl, values, dir, preserve) => {
  if ('logical' !== values[0]) {
    decl.cloneBefore({
      prop: 'inset-block-start',
      value: values[0]
    });
    decl.cloneBefore({
      prop: 'inset-inline-start',
      value: values[3] || values[1] || values[0]
    });
    decl.cloneBefore({
      prop: 'inset-block-end',
      value: values[2] || values[0]
    });
    decl.cloneBefore({
      prop: 'inset-inline-end',
      value: values[1] || values[0]
    });
    clean$4(decl, preserve);
    return;
  }
  const isLTR = !values[4] || values[4] === values[2];
  if (isLTR) {
    cloneRuleSpecificity(decl).append(lDecl$1(decl, values));
    clean$4(decl, preserve);
    return;
  } else if (dir === 'ltr') {
    lDecl$1(decl, values);
    clean$4(decl, preserve);
    return;
  } else if (dir === 'rtl') {
    rDecl$1(decl, values);
    clean$4(decl, preserve);
    return;
  } else {
    cloneRule(decl, 'ltr').append(lDecl$1(decl, values));
    cloneRule(decl, 'rtl').append(rDecl$1(decl, values));
    clean$4(decl, preserve);
    return;
  }
});
function lDecl$1(decl, values) {
  return [decl.cloneBefore({
    prop: 'top',
    value: values[1]
  }), decl.cloneBefore({
    prop: 'left',
    value: values[2] || values[1]
  }), decl.cloneBefore({
    prop: 'bottom',
    value: values[3] || values[1]
  }), decl.cloneBefore({
    prop: 'right',
    value: values[4] || values[2] || values[1]
  })];
}
function rDecl$1(decl, values) {
  return [decl.cloneBefore({
    prop: 'top',
    value: values[1]
  }), decl.cloneBefore({
    prop: 'right',
    value: values[2] || values[1]
  }), decl.cloneBefore({
    prop: 'bottom',
    value: values[3] || values[1]
  }), decl.cloneBefore({
    prop: 'left',
    value: values[4] || values[2] || values[1]
  })];
}
function clean$4(decl, preserve) {
  if (!preserve) decl.remove();
}

var transformResize = ((decl, values, dir, preserve) => {
  if (/^block$/i.test(decl.value)) {
    decl.cloneBefore({
      value: 'vertical'
    });
    clean$3(decl, preserve);
    return;
  } else if (/^inline$/i.test(decl.value)) {
    decl.cloneBefore({
      value: 'horizontal'
    });
    clean$3(decl, preserve);
    return;
  }
});
function clean$3(decl, preserve) {
  if (!preserve) decl.remove();
}

var matchSide = /^(inset|margin|padding)(?:-(block|block-start|block-end|inline|inline-start|inline-end|start|end))$/i;

var matchInsetPrefix = /^inset-/i;

var cloneDeclBefore = ((decl, suffix, value) => decl.cloneBefore({
  prop: `${decl.prop.replace(matchSide, '$1')}${suffix}`.replace(matchInsetPrefix, ''),
  value
}));

var transformSide = {
  // inset-block, margin-block, padding-block
  'block': (decl, values, dir, preserve) => {
    cloneDeclBefore(decl, '-top', values[0]);
    cloneDeclBefore(decl, '-bottom', values[1] || values[0]);
    clean$2(decl, preserve);
  },
  // inset-block-start, margin-block-start, padding-block-start
  'block-start': (decl, values, dir, preserve) => {
    decl.cloneBefore({
      prop: decl.prop.replace(matchSide, '$1-top').replace(matchInsetPrefix, '')
    });
    clean$2(decl, preserve);
  },
  // inset-block-end, margin-block-end, padding-block-end
  'block-end': (decl, values, dir, preserve) => {
    decl.cloneBefore({
      prop: decl.prop.replace(matchSide, '$1-bottom').replace(matchInsetPrefix, '')
    });
    clean$2(decl, preserve);
  },
  // inset-inline, margin-inline, padding-inline
  'inline': (decl, values, dir, preserve) => {
    const ltrDecls = () => {
      return [cloneDeclBefore(decl, '-left', values[0]), cloneDeclBefore(decl, '-right', values[1] || values[0])];
    };
    const rtlDecls = () => {
      return [cloneDeclBefore(decl, '-right', values[0]), cloneDeclBefore(decl, '-left', values[1] || values[0])];
    };
    const isLTR = 1 === values.length || 2 === values.length && values[0] === values[1];
    if (isLTR) {
      cloneRuleSpecificity(decl).append(ltrDecls());
      clean$2(decl, preserve);
      return;
    } else if (dir === 'ltr') {
      ltrDecls();
      clean$2(decl, preserve);
      return;
    } else if (dir === 'rtl') {
      rtlDecls();
      clean$2(decl, preserve);
      return;
    } else {
      cloneRule(decl, 'ltr').append(ltrDecls());
      cloneRule(decl, 'rtl').append(rtlDecls());
      clean$2(decl, preserve);
      return;
    }
  },
  // inset-inline-start, margin-inline-start, padding-inline-start
  'inline-start': (decl, values, dir, preserve) => {
    const ltrDecl = () => {
      return cloneDeclBefore(decl, '-left', decl.value);
    };
    const rtlDecl = () => {
      return cloneDeclBefore(decl, '-right', decl.value);
    };
    if (dir === 'ltr') {
      ltrDecl();
      clean$2(decl, preserve);
      return;
    } else if (dir === 'rtl') {
      rtlDecl();
      clean$2(decl, preserve);
      return;
    } else {
      cloneRule(decl, 'ltr').append(ltrDecl());
      cloneRule(decl, 'rtl').append(rtlDecl());
      clean$2(decl, preserve);
      return;
    }
  },
  // inset-inline-end, margin-inline-end, padding-inline-end
  'inline-end': (decl, values, dir, preserve) => {
    const ltrDecl = () => {
      return cloneDeclBefore(decl, '-right', decl.value);
    };
    const rtlDecl = () => {
      return cloneDeclBefore(decl, '-left', decl.value);
    };
    if (dir === 'ltr') {
      ltrDecl();
      clean$2(decl, preserve);
      return;
    } else if (dir === 'rtl') {
      rtlDecl();
      clean$2(decl, preserve);
      return;
    } else {
      cloneRule(decl, 'ltr').append(ltrDecl());
      cloneRule(decl, 'rtl').append(rtlDecl());
      clean$2(decl, preserve);
      return;
    }
  }
};
function clean$2(decl, preserve) {
  if (!preserve) decl.remove();
}

var matchSize = /^(min-|max-)?(block|inline)-(size)$/i;

var transformSize = ((decl, values, dir, preserve) => {
  decl.cloneBefore({
    prop: decl.prop.replace(matchSize, ($0, minmax, flow) => `${minmax || ''}${'block' === flow ? 'height' : 'width'}`)
  });
  if (!preserve) {
    decl.remove();
  }
});

var transformTextAlign = ((decl, values, dir, preserve) => {
  if (/^start$/i.test(decl.value)) {
    if (dir === 'ltr') {
      lDecl(decl);
      clean$1(decl, preserve);
      return;
    } else if (dir === 'rtl') {
      rDecl(decl);
      clean$1(decl, preserve);
      return;
    } else {
      cloneRule(decl, 'ltr').append(lDecl(decl));
      cloneRule(decl, 'rtl').append(rDecl(decl));
      clean$1(decl, preserve);
      return;
    }
  } else if (/^end$/i.test(decl.value)) {
    if (dir === 'ltr') {
      rDecl(decl);
      clean$1(decl, preserve);
      return;
    } else if (dir === 'rtl') {
      lDecl(decl);
      clean$1(decl, preserve);
      return;
    } else {
      cloneRule(decl, 'ltr').append(rDecl(decl));
      cloneRule(decl, 'rtl').append(lDecl(decl));
      clean$1(decl, preserve);
      return;
    }
  }
});
function lDecl(decl) {
  return decl.cloneBefore({
    value: 'left'
  });
}
function rDecl(decl) {
  return decl.cloneBefore({
    value: 'right'
  });
}
function clean$1(decl, preserve) {
  if (!preserve) decl.remove();
}

function splitByComma(string, isTrimmed) {
  return splitByRegExp(string, /^,$/, isTrimmed);
}
function splitBySpace(string, isTrimmed) {
  return splitByRegExp(string, /^\s$/, isTrimmed);
}
function splitByRegExp(string, re, isTrimmed) {
  const array = [];
  let buffer = '';
  let split = false;
  let func = 0;
  let i = -1;
  while (++i < string.length) {
    const char = string[i];
    if (char === '(') {
      func += 1;
    } else if (char === ')') {
      if (func > 0) {
        func -= 1;
      }
    } else if (func === 0) {
      if (re.test(char)) {
        split = true;
      }
    }
    if (split) {
      if (!isTrimmed || buffer.trim()) {
        array.push(isTrimmed ? buffer.trim() : buffer);
      }
      if (!isTrimmed) {
        array.push(char);
      }
      buffer = '';
      split = false;
    } else {
      buffer += char;
    }
  }
  if (buffer !== '') {
    array.push(isTrimmed ? buffer.trim() : buffer);
  }
  return array;
}

var transformTransition = ((decl, notValues, dir, preserve) => {
  const ltrValues = [];
  const rtlValues = [];
  splitByComma(decl.value).forEach(value => {
    let hasBeenSplit = false;
    splitBySpace(value).forEach((word, index, words) => {
      if (word in valueMap) {
        hasBeenSplit = true;
        valueMap[word].ltr.forEach(replacement => {
          const clone = words.slice();
          clone.splice(index, 1, replacement);
          if (ltrValues.length && !/^,$/.test(ltrValues[ltrValues.length - 1])) {
            ltrValues.push(',');
          }
          ltrValues.push(clone.join(''));
        });
        valueMap[word].rtl.forEach(replacement => {
          const clone = words.slice();
          clone.splice(index, 1, replacement);
          if (rtlValues.length && !/^,$/.test(rtlValues[rtlValues.length - 1])) {
            rtlValues.push(',');
          }
          rtlValues.push(clone.join(''));
        });
      }
    });
    if (!hasBeenSplit) {
      ltrValues.push(value);
      rtlValues.push(value);
    }
  });
  if (ltrValues.length && dir === 'ltr') {
    if (preserve) {
      decl.cloneBefore({});
    }
    decl.assign({
      value: ltrValues.join('')
    });
    return;
  } else if (rtlValues.length && dir === 'rtl') {
    if (preserve) {
      decl.cloneBefore({});
    }
    decl.assign({
      value: rtlValues.join('')
    });
    return;
  } else if (ltrValues.join('') !== rtlValues.join('')) {
    cloneRule(decl, 'ltr').append(decl.cloneBefore({
      value: ltrValues.join('')
    }));
    cloneRule(decl, 'rtl').append(decl.cloneBefore({
      value: rtlValues.join('')
    }));
    clean(decl, preserve);
    return;
  }
});
function clean(decl, preserve) {
  if (!preserve) decl.remove();
}
const valueMap = {
  // Logical Height and Logical Width
  'block-size': {
    ltr: ['height'],
    rtl: ['height']
  },
  'inline-size': {
    ltr: ['width'],
    rtl: ['width']
  },
  // Flow-relative Margins
  'margin-block-end': {
    ltr: ['margin-bottom'],
    rtl: ['margin-bottom']
  },
  'margin-block-start': {
    ltr: ['margin-top'],
    rtl: ['margin-top']
  },
  'margin-block': {
    ltr: ['margin-top', 'margin-bottom'],
    rtl: ['margin-top', 'margin-bottom']
  },
  'margin-inline-end': {
    ltr: ['margin-right'],
    rtl: ['margin-left']
  },
  'margin-inline-start': {
    ltr: ['margin-left'],
    rtl: ['margin-right']
  },
  'margin-inline': {
    ltr: ['margin-left', 'margin-right'],
    rtl: ['margin-left', 'margin-right']
  },
  // Flow-relative Offsets
  'inset-block-end': {
    ltr: ['bottom'],
    rtl: ['bottom']
  },
  'inset-block-start': {
    ltr: ['top'],
    rtl: ['top']
  },
  'inset-block': {
    ltr: ['top', 'bottom'],
    rtl: ['top', 'bottom']
  },
  'inset-inline-end': {
    ltr: ['right'],
    rtl: ['left']
  },
  'inset-inline-start': {
    ltr: ['left'],
    rtl: ['right']
  },
  'inset-inline': {
    ltr: ['left', 'right'],
    rtl: ['left', 'right']
  },
  'inset': {
    ltr: ['top', 'right', 'bottom', 'left'],
    rtl: ['top', 'right', 'bottom', 'left']
  },
  // Flow-relative Padding
  'padding-block-end': {
    ltr: ['padding-bottom'],
    rtl: ['padding-bottom']
  },
  'padding-block-start': {
    ltr: ['padding-top'],
    rtl: ['padding-top']
  },
  'padding-block': {
    ltr: ['padding-top', 'padding-bottom'],
    rtl: ['padding-top', 'padding-bottom']
  },
  'padding-inline-end': {
    ltr: ['padding-right'],
    rtl: ['padding-left']
  },
  'padding-inline-start': {
    ltr: ['padding-left'],
    rtl: ['padding-right']
  },
  'padding-inline': {
    ltr: ['padding-left', 'padding-right'],
    rtl: ['padding-left', 'padding-right']
  },
  // Flow-relative Borders
  'border-block-color': {
    ltr: ['border-top-color', 'border-bottom-color'],
    rtl: ['border-top-color', 'border-bottom-color']
  },
  'border-block-end-color': {
    ltr: ['border-bottom-color'],
    rtl: ['border-bottom-color']
  },
  'border-block-end-style': {
    ltr: ['border-bottom-style'],
    rtl: ['border-bottom-style']
  },
  'border-block-end-width': {
    ltr: ['border-bottom-width'],
    rtl: ['border-bottom-width']
  },
  'border-block-end': {
    ltr: ['border-bottom'],
    rtl: ['border-bottom']
  },
  'border-block-start-color': {
    ltr: ['border-top-color'],
    rtl: ['border-top-color']
  },
  'border-block-start-style': {
    ltr: ['border-top-style'],
    rtl: ['border-top-style']
  },
  'border-block-start-width': {
    ltr: ['border-top-width'],
    rtl: ['border-top-width']
  },
  'border-block-start': {
    ltr: ['border-top'],
    rtl: ['border-top']
  },
  'border-block-style': {
    ltr: ['border-top-style', 'border-bottom-style'],
    rtl: ['border-top-style', 'border-bottom-style']
  },
  'border-block-width': {
    ltr: ['border-top-width', 'border-bottom-width'],
    rtl: ['border-top-width', 'border-bottom-width']
  },
  'border-block': {
    ltr: ['border-top', 'border-bottom'],
    rtl: ['border-top', 'border-bottom']
  },
  'border-inline-color': {
    ltr: ['border-left-color', 'border-right-color'],
    rtl: ['border-left-color', 'border-right-color']
  },
  'border-inline-end-color': {
    ltr: ['border-right-color'],
    rtl: ['border-left-color']
  },
  'border-inline-end-style': {
    ltr: ['border-right-style'],
    rtl: ['border-left-style']
  },
  'border-inline-end-width': {
    ltr: ['border-right-width'],
    rtl: ['border-left-width']
  },
  'border-inline-end': {
    ltr: ['border-right'],
    rtl: ['border-left']
  },
  'border-inline-start-color': {
    ltr: ['border-left-color'],
    rtl: ['border-right-color']
  },
  'border-inline-start-style': {
    ltr: ['border-left-style'],
    rtl: ['border-right-style']
  },
  'border-inline-start-width': {
    ltr: ['border-left-width'],
    rtl: ['border-right-width']
  },
  'border-inline-start': {
    ltr: ['border-left'],
    rtl: ['border-right']
  },
  'border-inline-style': {
    ltr: ['border-left-style', 'border-right-style'],
    rtl: ['border-left-style', 'border-right-style']
  },
  'border-inline-width': {
    ltr: ['border-left-width', 'border-right-width'],
    rtl: ['border-left-width', 'border-right-width']
  },
  'border-inline': {
    ltr: ['border-left', 'border-right'],
    rtl: ['border-left', 'border-right']
  },
  // Flow-relative Corner Rounding
  'border-end-end-radius': {
    ltr: ['border-bottom-right-radius'],
    rtl: ['border-bottom-left-radius']
  },
  'border-end-start-radius': {
    ltr: ['border-bottom-left-radius'],
    rtl: ['border-bottom-right-radius']
  },
  'border-start-end-radius': {
    ltr: ['border-top-right-radius'],
    rtl: ['border-top-left-radius']
  },
  'border-start-start-radius': {
    ltr: ['border-top-left-radius'],
    rtl: ['border-top-right-radius']
  }
};

// plugin
function postcssLogicalProperties(opts) {
  opts = Object(opts);
  const preserve = Boolean(opts.preserve);
  const dir = !preserve && typeof opts.dir === 'string' ? /^rtl$/i.test(opts.dir) ? 'rtl' : 'ltr' : false;
  const makeTransform = transform => {
    return decl => {
      const parent = decl.parent;
      const values = splitBySpace(decl.value, true);
      transform(decl, values, dir, preserve);
      if (!parent.nodes.length) {
        parent.remove();
      }
    };
  };
  const makeTransformWithoutSplittingValues = transform => {
    return decl => {
      const parent = decl.parent;
      const values = [decl.value];
      transform(decl, values, dir, preserve);
      if (!parent.nodes.length) {
        parent.remove();
      }
    };
  };
  return {
    postcssPlugin: 'postcss-logical-properties',
    Declaration: {
      // Flow-Relative Values
      'clear': makeTransform(transformFloat),
      'float': makeTransform(transformFloat),
      'resize': makeTransform(transformResize),
      'text-align': makeTransform(transformTextAlign),
      // Logical Height and Logical Width
      'block-size': makeTransform(transformSize),
      'max-block-size': makeTransform(transformSize),
      'min-block-size': makeTransform(transformSize),
      'inline-size': makeTransform(transformSize),
      'max-inline-size': makeTransform(transformSize),
      'min-inline-size': makeTransform(transformSize),
      // Flow-relative Margins
      'margin': makeTransform(transformDirectionalShorthands(transformSide['inline'], 'margin')),
      'margin-inline': makeTransform(transformSide['inline']),
      'margin-inline-end': makeTransform(transformSide['inline-end']),
      'margin-inline-start': makeTransform(transformSide['inline-start']),
      'margin-block': makeTransform(transformSide['block']),
      'margin-block-end': makeTransform(transformSide['block-end']),
      'margin-block-start': makeTransform(transformSide['block-start']),
      // Flow-relative Offsets
      'inset': makeTransform(transformInset),
      'inset-inline': makeTransform(transformSide['inline']),
      'inset-inline-end': makeTransform(transformSide['inline-end']),
      'inset-inline-start': makeTransform(transformSide['inline-start']),
      'inset-block': makeTransform(transformSide['block']),
      'inset-block-end': makeTransform(transformSide['block-end']),
      'inset-block-start': makeTransform(transformSide['block-start']),
      // Flow-relative Padding
      'padding': makeTransform(transformDirectionalShorthands(transformSide['inline'], 'padding')),
      'padding-inline': makeTransform(transformSide['inline']),
      'padding-inline-end': makeTransform(transformSide['inline-end']),
      'padding-inline-start': makeTransform(transformSide['inline-start']),
      'padding-block': makeTransform(transformSide['block']),
      'padding-block-end': makeTransform(transformSide['block-end']),
      'padding-block-start': makeTransform(transformSide['block-start']),
      // Flow-relative Borders
      'border-block': makeTransformWithoutSplittingValues(transformBorder['border-block']),
      'border-block-color': makeTransform(transformBorder['border-block']),
      'border-block-style': makeTransform(transformBorder['border-block']),
      'border-block-width': makeTransform(transformBorder['border-block']),
      'border-block-end': makeTransformWithoutSplittingValues(transformBorder['border-block-end']),
      'border-block-end-color': makeTransform(transformBorder['border-block-end']),
      'border-block-end-style': makeTransform(transformBorder['border-block-end']),
      'border-block-end-width': makeTransform(transformBorder['border-block-end']),
      'border-block-start': makeTransformWithoutSplittingValues(transformBorder['border-block-start']),
      'border-block-start-color': makeTransform(transformBorder['border-block-start']),
      'border-block-start-style': makeTransform(transformBorder['border-block-start']),
      'border-block-start-width': makeTransform(transformBorder['border-block-start']),
      'border-inline': makeTransformWithoutSplittingValues(transformBorder['border-inline']),
      'border-inline-color': makeTransform(transformBorder['border-inline']),
      'border-inline-style': makeTransform(transformBorder['border-inline']),
      'border-inline-width': makeTransform(transformBorder['border-inline']),
      'border-inline-end': makeTransformWithoutSplittingValues(transformBorder['border-inline-end']),
      'border-inline-end-color': makeTransform(transformBorder['border-inline-end']),
      'border-inline-end-style': makeTransform(transformBorder['border-inline-end']),
      'border-inline-end-width': makeTransform(transformBorder['border-inline-end']),
      'border-inline-start': makeTransformWithoutSplittingValues(transformBorder['border-inline-start']),
      'border-inline-start-color': makeTransform(transformBorder['border-inline-start']),
      'border-inline-start-style': makeTransform(transformBorder['border-inline-start']),
      'border-inline-start-width': makeTransform(transformBorder['border-inline-start']),
      // Flow-relative Corner Rounding
      'border-end-end-radius': makeTransform(transformBorderRadius),
      'border-end-start-radius': makeTransform(transformBorderRadius),
      'border-start-end-radius': makeTransform(transformBorderRadius),
      'border-start-start-radius': makeTransform(transformBorderRadius),
      // Four-Directional Shorthand Border Properties
      'border-color': makeTransform(transformDirectionalShorthands(transformBorder['border-inline'], 'border', 'color')),
      'border-style': makeTransform(transformDirectionalShorthands(transformBorder['border-inline'], 'border', 'style')),
      'border-width': makeTransform(transformDirectionalShorthands(transformBorder['border-inline'], 'border', 'width')),
      // Transition helpers
      'transition': makeTransform(transformTransition),
      'transition-property': makeTransform(transformTransition)
    }
  };
}
postcssLogicalProperties.postcss = true;

export { postcssLogicalProperties as default };
//# sourceMappingURL=index.esm.mjs.map
