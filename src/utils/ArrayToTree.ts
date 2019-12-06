const arrayToTree = function(
  array: any = [],
  option: {
    customId: string;
    customParentId: string;
    customChildren: string;
  }
) {
  let customId = option.customId,
    customParentId = option.customParentId,
    customChildren = option.customChildren;

  let map: {
    [prop: string]: {
      [prop: string]: any;
    };
  } = {};
  let tree: any[] = [];

  for (const item of array) {
    item[customChildren] = [];
    map[item[customId]] = item;
  }

  for (const id of Object.keys(map)) {
    let item = map[id];
    let parentId = item[customParentId];

    if (
      typeof parentId !== "undefined" &&
      typeof map[parentId] !== "undefined"
    ) {
      map[parentId][customChildren].push(item);
    } else {
      tree.push(item);
    }
  }

  return tree;
};

export default arrayToTree;
