






export function flash(color : string, elem : HTMLElement) {
  const baseColor = elem.style.backgroundColor
  elem.style.backgroundColor = color
  setTimeout(() => elem.style.backgroundColor = baseColor, 200)
}