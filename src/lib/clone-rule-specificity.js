import postcss from 'postcss';

export default (decl) => {
	const rule = Object(decl.parent).type === 'rule' ? decl.parent.cloneBefore({
		raws: {}
	}).removeAll() : postcss.rule({ selector: '&' });

	rule.assign({'selectors': rule.selectors.map(selector => `[dir] ${selector}`)})

	return rule;
};
