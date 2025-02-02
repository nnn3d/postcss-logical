import cloneRule from './clone-rule';
import cloneRuleSpecificity from './clone-rule-specificity';

export default (decl, values, dir, preserve) => {
	if ('logical' !== values[0]) {
		decl.cloneBefore({ prop: 'inset-block-start', value: values[0] });
		decl.cloneBefore({ prop: 'inset-inline-start', value: values[3] || values[1] || values[0] });
		decl.cloneBefore({ prop: 'inset-block-end', value: values[2] || values[0] });
		decl.cloneBefore({ prop: 'inset-inline-end', value: values[1] || values[0] });
		clean(decl, preserve);
		return;
	}

	const isLTR = !values[4] || values[4] === values[2];

	if (isLTR) {
		cloneRuleSpecificity(decl).append(lDecl(decl, values));
		clean(decl, preserve);
		return;
	} else if (dir === 'ltr') {
		lDecl(decl, values);
		clean(decl, preserve);
		return;
	} else if (dir === 'rtl') {
		rDecl(decl, values);
		clean(decl, preserve);
		return;
	} else {
		cloneRule(decl, 'ltr').append(lDecl(decl, values));
		cloneRule(decl, 'rtl').append(rDecl(decl, values));
		clean(decl, preserve);
		return;
	}
}

function lDecl(decl, values) {
	return [
		decl.cloneBefore({ prop: 'top', value: values[1] }),
		decl.cloneBefore({ prop: 'left', value: values[2] || values[1] }),
		decl.cloneBefore({ prop: 'bottom', value: values[3] || values[1] }),
		decl.cloneBefore({ prop: 'right', value: values[4] || values[2] || values[1] })
	];
}

function rDecl(decl, values) {
	return [
		decl.cloneBefore({ prop: 'top', value: values[1] }),
		decl.cloneBefore({ prop: 'right', value: values[2] || values[1] }),
		decl.cloneBefore({ prop: 'bottom', value: values[3] || values[1] }),
		decl.cloneBefore({ prop: 'left', value: values[4] || values[2] || values[1] })
	];
}

function clean(decl, preserve) {
	if (!preserve) decl.remove();
}
