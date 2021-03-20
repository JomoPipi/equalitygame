export function flash(color, elem) {
    const baseColor = elem.style.backgroundColor;
    elem.style.backgroundColor = color;
    setTimeout(() => elem.style.backgroundColor = baseColor, 200);
}
//# sourceMappingURL=flash.js.map