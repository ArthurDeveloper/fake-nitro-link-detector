export default function intersect(string, anotherString) {
    // TODO: Make a better implementation of it later
    let result = "";

    for (const char of string) {
        if (anotherString.includes(char) && !result.includes(char)) {
            result += char;
        } 
    }

    return result;
}
