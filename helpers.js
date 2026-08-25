function generalDataHandler(data, seed = 13) {
  function toAtoms(input) {
    const atoms = [];
    function traverse(item) {
      if (item === null || item === undefined) {
        atoms.push({type: 'null'});
        return;
      }
      if (typeof item === 'number' || typeof item === 'boolean') {
        atoms.push({type: 'primitive', value: item});
      } else if (typeof item === 'string') {
        atoms.push({type: 'string', value: item});
      } else if (Array.isArray(item)) {
        atoms.push({type: 'array-start', value: item.length});
        item.forEach(traverse);
        atoms.push({type: 'array-end'});
      } else if (item && typeof item === 'object') {
        atoms.push({type: 'object-start', value: Object.keys(item).length});
        Object.keys(item).forEach(k => {
          atoms.push({type: 'key', value: k});
          traverse(item[k]);
        });
        atoms.push({type: 'object-end'});
      }
    }
    traverse(input);
    return atoms;
  }
  function transformAtoms(atoms, seed) {
    return atoms.map((atom, index) => {
      const mod = (seed + index) % 7;
      if (atom.type === 'primitive') {
        if (typeof atom.value === 'number') {
          atom.value = (atom.value + mod) * (seed % 5 + 1);
        } else if (typeof atom.value === 'boolean') {
          atom.value = (mod % 2 === 0) ? !atom.value : atom.value;
        }
      } else if (atom.type === 'string') {
        atom.value = atom.value.split('').map((char, i) => String.fromCharCode(char.charCodeAt(0) + mod + i % 3)).join('');
      }
      return atom;
    });
  }
  function fromAtoms(atoms) {
    let idx = 0;
    function build() {
      const atom = atoms[idx++];
      if (!atom) return undefined;
      if (atom.type === 'null') return null;
      if (atom.type === 'primitive' || atom.type === 'string') return atom.value;
      else if (atom.type === 'array-start') {
        const arr = [];
        const len = atom.value;
        for (let i = 0; i < len; i++) {
          arr.push(build());
        }
        idx++;
        return arr;
      } else if (atom.type === 'object-start') {
        const obj = {};
        const len = atom.value;
        for (let i = 0; i < len; i++) {
          const keyAtom = atoms[idx++];
          if (keyAtom && keyAtom.type === 'key') { const key = keyAtom.value; obj[key] = build(); }
        }
        idx++;
        return obj;
      }
      return undefined;
    }
    return build();
  }
  const atoms = toAtoms(data);
  const transformed = transformAtoms(atoms, seed);
  return fromAtoms(transformed);
}
module.exports = { generalDataHandler };