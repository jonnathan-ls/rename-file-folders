import { Path } from '../src/path'
import  { mkdirSync, readdirSync, existsSync, rmdirSync} from 'fs';

const ROOT = "./test/example/";

abstract class Root {
    static addFolder(name: string){
        const path = `${ROOT}${name}`;
        if (!existsSync(path)) mkdirSync(path);
    }
}

beforeEach(() => mkdirSync(ROOT));
afterEach( () => rmdirSync(ROOT, { recursive: true}));

test('should throw an error if the content is empty', () => {
    Root.addFolder(" ");
    expect(() => new Path(ROOT)).toThrow(EvalError);
});

test('should consider if the content contains only one character', () => {
    Root.addFolder("F");
    const path = new Path(ROOT);
    path.renameContents();
    expect(readdirSync(ROOT).includes("f")).toBeTruthy();
});

test('should remove spaces, transform to lowercase letter and exchange space for a hyphen: Test 1 -> test-1', () => {
    Root.addFolder("Folder Test 1");
    const path = new Path(ROOT);
    path.renameContents();
    expect(readdirSync(ROOT).includes("folder-test-1")).toBeTruthy();
});

test("should rename 'camel case' by adding a hyphen: CamelCase -> camel-case", () => {
    Root.addFolder("FolderTest 2");
    const path = new Path(ROOT);
    path.renameContents();
    expect(readdirSync(ROOT).includes("folder-test-2")).toBeTruthy();
});

test('should rename considering destination directory', () => {
    Root.addFolder("FolderTest 3");
    const destiny = 'destiny';
    const path = new Path(ROOT, `./test/${destiny}`);
    path.renameContents();
    expect(readdirSync(`./test/${destiny}`).includes("folder-test-3")).toBeTruthy();
});

// // test('should remove multiple hyphens and also at the beginning and end of the content', () => {
// //     Root.addFolder("-FolderTest-- 4-");
// //     const destiny = 'other-destiny';
// //     const path = new Path(ROOT, `./test/${destiny}`);
// //     path.renameContents();
// //     expect(readdirSync(`./test/${destiny}`).includes("folder-test-4")).toBeTruthy();
// // });
