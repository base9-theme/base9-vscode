import Color from 'color';
import { SSL_OP_PKCS1_CHECK_1 } from 'constants';
import _, { kebabCase } from 'lodash';
import Mustache from 'mustache';

// asdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa


function difference(c1: Color, c2: Color) {
    const f = Math.abs;
    const l1 = c1.rgb().array();
    const l2 = c2.rgb().array();
    return f(l1[0] - l2[0]) + f(l1[1] - l2[1]) + f(l1[2] - l2[2]);
}

const getHues2Constant1: number[][] = [
    [0, 1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5, 0],
    [2, 3, 4, 5, 0, 1],
    [3, 4, 5, 0, 1, 2],
    [4, 5, 0, 1, 2, 3],
    [5, 0, 1, 2, 3, 4],

    [5, 4, 3, 2, 1, 0],
    [0, 5, 4, 3, 2, 1],
    [1, 0, 5, 4, 3, 2],
    [2, 1, 0, 5, 4, 3],
    [3, 2, 1, 0, 5, 4],
    [4, 3, 2, 1, 0, 5],
];
const getHues2Constant2 = [
    Color("#FF0000"),
    Color("#FFFF00"),
    Color("#00FF00"),
    Color("#00FFFF"),
    Color("#0000FF"),
    Color("#FF00FF"),
];

export function getNamedColors(palette: Color[], mapping: {[k: string]: string}, r1: number = 0.5, r2: number = 0.25): { [k: string]: Color } {
    const cs6 = [palette[3], palette[5], palette[6], palette[7], palette[8], palette[9]];
    const order: number[] = _.minBy(getHues2Constant1, (order: number[]) =>
        difference(cs6[order[0]], getHues2Constant2[0]) +
        difference(cs6[order[1]], getHues2Constant2[1]) +
        difference(cs6[order[2]], getHues2Constant2[2]) +
        difference(cs6[order[3]], getHues2Constant2[3]) +
        difference(cs6[order[4]], getHues2Constant2[4]) +
        difference(cs6[order[5]], getHues2Constant2[5])
    )!;

    const order2 = [];
    order2[order[0]] = 0;
    order2[order[1]] = 1;
    order2[order[2]] = 2;
    order2[order[3]] = 3;
    order2[order[4]] = 4;
    order2[order[5]] = 5;

    const bg =  palette[0];
    const fg =  palette[1];
    const hl = palette[2];

    const m = new Map<string, Color>();

    m.set("b0", palette[0]);
    m.set("b1", palette[1]);
    m.set("b2", palette[2]);
    m.set("b3", palette[3]);
    m.set("b4", palette[4]);
    m.set("b5", palette[5]);
    m.set("b6", palette[6]);
    m.set("b7", palette[7]);
    m.set("b8", palette[8]);
    m.set("b9", palette[9]);

    function assignColorShades(name: string, c: Color) {
        m.set(name, c);
        m.set(name+"_h", c.mix(hl, r1));

        m.set(name+"_b", c.mix(bg, 1-r2));
        m.set(name+"_s", c.mix(bg, r2));

        m.set(name+"_1", c.mix(bg, 1-r2));
        m.set(name+"_2", c.mix(bg, r1));
        m.set(name+"_3", c.mix(bg, r2));
    }

    assignColorShades("c1", palette[2]);
    assignColorShades("c2", palette[3]);
    assignColorShades("c3", palette[4]);
    assignColorShades("c4", palette[5]);
    assignColorShades("c5", palette[6]);
    assignColorShades("c6", palette[7]);
    assignColorShades("c7", palette[8]);

    assignColorShades("red", cs6[order2[0]]);
    assignColorShades("yellow", cs6[order2[1]]);
    assignColorShades("green", cs6[order2[2]]);
    assignColorShades("cyan", cs6[order2[3]]);
    assignColorShades("blue", cs6[order2[4]]);
    assignColorShades("magenta", cs6[order2[5]]);

    m.set("fg_b", fg.mix(bg, 1-r2));
    m.set("fg_s", fg.mix(bg, r2));
    m.set("fg_h", hl);
    m.set("fg_1", fg.mix(bg, 1-r2));
    m.set("fg_2", fg.mix(bg, r1));
    m.set("fg_3", fg.mix(bg, r2));
    //TODO
    m.set("bg_s", fg.mix(bg, 1-r2/4));

    
    m.set("todo_template_0", Color("#FFFFFF")); //white
    m.set("todo_template_1", Color("#FF0000")); //red
    m.set("todo_template_2", Color("#FFFF00")); //yellow
    m.set("todo_template_3", Color("#00FF00")); //green
    m.set("todo_template_4", Color("#00FFFF")); //cyan
    m.set("todo_template_5", Color("#0000FF")); //blue
    m.set("todo_template_6", Color("#FF00FF")); //magenta
    m.set("todo_template_7", Color("#FF8000")); //orange
    m.set("todo_template_8", Color("#40FFFF")); //green2
    m.set("todo_template_9", Color("#0080FF")); //blue2

    m.set("d_TEMP_QUOTES", Color("#E9F284"));
    m.set("d_TEMP_PROPERTY", Color("#8BE9FE"));
    m.set("d_LineHighlight", Color("#44475A"));


    function fill(obj: Map<string, string>, left: string, stop?: string): boolean {
        if(stop === "error") {
            console.log("follow error: "+left);
        }
        if(m.has(left)) {
            return true;
        }
        if(!obj.has(left)) {
            return false;
        }
        const right = obj.get(left)!;
        if(right === stop) {
            return false;
        }
        if(!fill(obj, right, stop)) {
            return false;
        }

        m.set(left, m.get(right)!);
        return true;
    }

    const m2 = new Map<string, string>();
    // const variations = ["_b", "", "_s", "_h"];
    const variations = ["", "_h", "_1", "_2", "_3", "_b", "_s"];
    _.each(mapping, (value,key) => {
        if(key.startsWith("$")) {
            const key2 = key.substring(1);
            _.each(variations, v => m2.set(key2+v, value+v));
        } else {
            m2.set(key,value);
        }
    });
    const todo_x = mapping.todo_template_x;
    _.times(100, i => {
        let i2 = i;
        const x0 = i2%10;
        const x1 = (i2/10)|0;
        m2.set("todo"+i, "todo_template_"+(todo_x ? x0 : x1));
    })

    _.each([...m2.entries()], ([key]) => {
        if(!fill(m2, key, key)) {
            console.log("fill fail: "+key);
        }
    });

    const rtn = Object.fromEntries(m);
    // _.each(rtn, (v,k) => {
    //     if(v == undefined) {
    //         console.log(k);
    //     }
    // });
    return rtn;
}
// export type NamedColors = ReturnType<typeof getNamedColors>;
export type NamedColors = { [k: string]: Color };

export function getTemplateVariable(cs: NamedColors) {
    const rtn = [
        ["r1", "3f"],
        ["r2", "7f"],
        ["r3", "bf"],
    ]
    rtn.push(..._.flatMap(cs, (v: Color, k: string) => {
        return [
            [k, v.hex().toString()],
        ];
    }));
  const rtn2 = Object.fromEntries(rtn);
  return rtn2;
}
type Obj = { [k: string]: string };
export function render(template: string, cs: Color[], semantic: Obj) {
    const namedColors = getNamedColors(cs, semantic);
    const view = getTemplateVariable(namedColors);
    return Mustache.render(template, view)
}
