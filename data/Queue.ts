import { atom } from "jotai";

/**
 * Define the product data type.
 */

/**
 * Define the product list atom.
 */
const queueListAtom = atom<string[][]>([
    ["Alice Johnson", "John Doe"],
    ["Chris Evan", "Molly Peters", "Steve Jobs","Mike Tyson","Jean Bart"],
    ["Mark Zuckerberg","Jean Goldberg"]
]);

export default queueListAtom;